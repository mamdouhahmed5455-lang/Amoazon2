"""
Model V2 training and comprehensive validation pipeline.
Trains Validated XGBoost Model V2 with strict temporal partitions,
four-stage ablation study, and three rigorous evaluation perspectives:
1. Temporal Test (Held-Out PRODES 2024)
2. Spatial Test (North vs. South Holdout)
3. Spatio-Temporal Test (Cross-region and cross-time generalization)
"""

import json
import datetime
import hashlib
import platform
from pathlib import Path
from typing import Dict, Any, Tuple
import numpy as np
import pandas as pd
import xgboost as xgb

from .config import (
    FEATURE_COLS, XGB_HYPERPARAMS, RANDOM_SEED, SPATIAL_HOLDOUT_LATITUDE,
    ARTIFACTS_DIR, OUTPUT_MODEL_JSON, OUTPUT_MODEL_MANIFEST
)
from .split_temporal import split_by_time, get_temporal_metadata
from .split_spatial import split_north_south
from .evaluate import (
    compute_metrics, compute_bootstrap_ci, compute_top_k_operational,
    evaluate_calibration, compute_all_baselines
)


def train_model(df: pd.DataFrame) -> Tuple[xgb.XGBClassifier, Dict[str, Any]]:
    """
    Trains XGBoost Model V2 using strict temporal splits.
    Executes baselines, ablation study, and 3 evaluation perspectives.
    Returns fitted model and comprehensive results dictionary.
    """
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)

    # 1. Temporal Partitions
    df_train, df_val, df_test = split_by_time(df)

    X_train, y_train = df_train[FEATURE_COLS].values, df_train["label"].values
    X_val,   y_val   = df_val[FEATURE_COLS].values,   df_val["label"].values
    X_test,  y_test  = df_test[FEATURE_COLS].values,  df_test["label"].values

    print(f"\n  [Split Summary]")
    print(f"    Train (Target 2022): {len(X_train)} cells | {y_train.sum()} positives ({y_train.mean()*100:.3f}%)")
    print(f"    Val   (Target 2023): {len(X_val)} cells | {y_val.sum()} positives ({y_val.mean()*100:.3f}%)")
    print(f"    Test  (Target 2024): {len(X_test)} cells | {y_test.sum()} positives ({y_test.mean()*100:.3f}%)")

    # 2. Mandatory Baselines on Test Set
    print("\n  [Evaluating Baselines on Held-Out Test Set]...")
    baselines_results = compute_all_baselines(df_test, y_test, n_random_seeds=50)
    for b_name, b_data in baselines_results.items():
        if "mean_auc" in b_data:
            print(f"    {b_name}: Mean AUC = {b_data['mean_auc']:.4f} (+/- {b_data['std_auc']:.4f})")
        else:
            print(f"    {b_name}: AUC = {b_data['roc_auc']:.4f}")

    # 3. Four-Stage Ablation Study
    # Exactly FOUR feature groups comprising FIVE predictor variables
    print("\n  [Executing 4-Stage Ablation Study]...")
    ablation_feature_sets = {
        "Model_A_road_only": ["dist_road_km"],
        "Model_B_road_loss": ["dist_road_km", "dist_hist_loss_km", "prior_loss_dens"],
        "Model_C_road_loss_pop": ["dist_road_km", "dist_hist_loss_km", "prior_loss_dens", "pop_pressure"],
        "Model_D_all_four_groups": FEATURE_COLS  # Adds elevation_m
    }
    ablation_results = {}
    for name, feats in ablation_feature_sets.items():
        clf = xgb.XGBClassifier(**XGB_HYPERPARAMS, verbosity=0)
        feat_indices = [FEATURE_COLS.index(f) for f in feats]
        clf.fit(X_train[:, feat_indices], y_train,
                eval_set=[(X_val[:, feat_indices], y_val)],
                verbose=False)
        preds_test = clf.predict_proba(X_test[:, feat_indices])[:, 1]
        m = compute_metrics(y_test, preds_test)
        ablation_results[name] = {
            "feature_count": len(feats),
            "features": feats,
            "roc_auc": m["roc_auc"],
            "pr_auc": m["pr_auc"],
            "brier_score": m["brier_score"]
        }
        print(f"    {name} ({len(feats)} vars): ROC-AUC={m['roc_auc']} | PR-AUC={m['pr_auc']}")

    # 4. Perspective 1: Primary Temporal Model Training (Full Model D)
    print("\n  [Perspective 1: Training Final Full Model V2 (All 4 Feature Groups)]...")
    model = xgb.XGBClassifier(**XGB_HYPERPARAMS, verbosity=0)
    model.fit(X_train, y_train,
              eval_set=[(X_val, y_val)],
              verbose=False)

    train_preds = model.predict_proba(X_train)[:, 1]
    val_preds   = model.predict_proba(X_val)[:, 1]
    test_preds  = model.predict_proba(X_test)[:, 1]

    train_metrics = compute_metrics(y_train, train_preds)
    val_metrics   = compute_metrics(y_val, val_preds)
    test_metrics  = compute_metrics(y_test, test_preds)
    test_bootstrap_ci = compute_bootstrap_ci(y_test, test_preds, n_bootstraps=1000)
    test_topk = compute_top_k_operational(y_test, test_preds)
    test_calibration = evaluate_calibration(y_test, test_preds)

    # 5. Perspective 2: Pure Spatial Test (North vs. South Holdout on Test Set)
    print("\n  [Perspective 2: Pure Spatial Holdout Evaluation]...")
    df_test_north, df_test_south = split_north_south(df_test, SPATIAL_HOLDOUT_LATITUDE)
    y_test_north = df_test_north["label"].values
    y_test_south = df_test_south["label"].values
    preds_test_north = model.predict_proba(df_test_north[FEATURE_COLS].values)[:, 1]
    preds_test_south = model.predict_proba(df_test_south[FEATURE_COLS].values)[:, 1]

    spatial_results = {
        "spatial_holdout_latitude": SPATIAL_HOLDOUT_LATITUDE,
        "north_region": {
            "description": f"Northern Agricultural Frontier (Lat > {SPATIAL_HOLDOUT_LATITUDE})",
            "samples": len(df_test_north),
            "positives": int(y_test_north.sum()),
            "metrics": compute_metrics(y_test_north, preds_test_north)
        },
        "south_region": {
            "description": f"Southern Interior Core (Lat <= {SPATIAL_HOLDOUT_LATITUDE})",
            "samples": len(df_test_south),
            "positives": int(y_test_south.sum()),
            "metrics": compute_metrics(y_test_south, preds_test_south)
        }
    }
    print(f"    North Region AUC: {spatial_results['north_region']['metrics']['roc_auc']}")
    print(f"    South Region AUC: {spatial_results['south_region']['metrics']['roc_auc']}")

    # 6. Perspective 3: Spatio-Temporal Test
    # Train on 2022 North -> Evaluate on 2024 South
    # Train on 2022 South -> Evaluate on 2024 North
    print("\n  [Perspective 3: Spatio-Temporal Cross-Region / Cross-Time Test]...")
    df_train_north, df_train_south = split_north_south(df_train, SPATIAL_HOLDOUT_LATITUDE)
    
    spatio_temporal_results = {}
    # Direction 1: Train on North 2022 -> Test on South 2024
    if df_train_north["label"].sum() > 0 and df_test_south["label"].sum() > 0:
        st_clf_1 = xgb.XGBClassifier(**XGB_HYPERPARAMS, verbosity=0)
        st_clf_1.fit(df_train_north[FEATURE_COLS].values, df_train_north["label"].values, verbose=False)
        st_preds_1 = st_clf_1.predict_proba(df_test_south[FEATURE_COLS].values)[:, 1]
        spatio_temporal_results["train_north2022_test_south2024"] = {
            "train_samples": len(df_train_north),
            "train_positives": int(df_train_north["label"].sum()),
            "test_samples": len(df_test_south),
            "test_positives": int(df_test_south["label"].sum()),
            "metrics": compute_metrics(df_test_south["label"].values, st_preds_1)
        }
        print(f"    Train North 2022 -> Test South 2024: AUC = {spatio_temporal_results['train_north2022_test_south2024']['metrics']['roc_auc']}")

    # Direction 2: Train on South 2022 -> Test on North 2024
    if df_train_south["label"].sum() > 0 and df_test_north["label"].sum() > 0:
        st_clf_2 = xgb.XGBClassifier(**XGB_HYPERPARAMS, verbosity=0)
        st_clf_2.fit(df_train_south[FEATURE_COLS].values, df_train_south["label"].values, verbose=False)
        st_preds_2 = st_clf_2.predict_proba(df_test_north[FEATURE_COLS].values)[:, 1]
        spatio_temporal_results["train_south2022_test_north2024"] = {
            "train_samples": len(df_train_south),
            "train_positives": int(df_train_south["label"].sum()),
            "test_samples": len(df_test_north),
            "test_positives": int(df_test_north["label"].sum()),
            "metrics": compute_metrics(df_test_north["label"].values, st_preds_2)
        }
        print(f"    Train South 2022 -> Test North 2024: AUC = {spatio_temporal_results['train_south2022_test_north2024']['metrics']['roc_auc']}")

    # Save model artifact
    model.save_model(str(OUTPUT_MODEL_JSON))
    print(f"\n  Model artifact saved to: {OUTPUT_MODEL_JSON}")

    # Compile comprehensive training results
    results = {
        "model_version": "2.0.0-validated",
        "experiment_name": "Independent Reproducible Model V2",
        "training_timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "temporal_partitions": get_temporal_metadata(),
        "train_metrics": train_metrics,
        "val_metrics": val_metrics,
        "test_metrics": test_metrics,
        "test_bootstrap_ci": test_bootstrap_ci,
        "test_top_k_operational": test_topk,
        "test_calibration": test_calibration,
        "baselines": baselines_results,
        "ablation_study": ablation_results,
        "spatial_evaluation": spatial_results,
        "spatio_temporal_evaluation": spatio_temporal_results,
        "feature_importances_gain": dict(zip(FEATURE_COLS, [round(float(v), 6) for v in model.feature_importances_])),
        "hyperparameters": XGB_HYPERPARAMS
    }

    return model, results
