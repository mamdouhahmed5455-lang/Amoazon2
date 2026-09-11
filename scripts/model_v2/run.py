"""
Master orchestration script for Validated XGBoost Model V2.

Run with:
    python scripts/model_v2/run.py

This single entrypoint:
1. Verifies all authoritative data sources & hashes
2. Builds neutral spatial grid (7,045 eligible forest units)
3. Engineers 4 feature groups (5 variables) with strict pre-observation cutoff
4. Assigns official PRODES ground-truth labels
5. Executes 4-stage ablation study
6. Evaluates across 3 perspectives (Temporal, Spatial, Spatio-Temporal)
7. Computes 4 baselines & bootstrap 95% confidence intervals
8. Runs TreeSHAP explainability (beeswarm plot + local example)
9. Generates dataset & model manifests with cryptographic provenance
"""

import sys
import json
import platform
import datetime
from pathlib import Path

# Add project root to sys.path for module resolution
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import numpy as np
import xgboost as xgb
import sklearn

from scripts.model_v2.config import (
    EXPERIMENT_ID, ARTIFACTS_DIR, OUTPUT_MODEL_MANIFEST, FEATURE_COLS, XGB_HYPERPARAMS
)
from scripts.model_v2.download_sources import verify_model_v2_sources
from scripts.model_v2.assemble_dataset import assemble_full_dataset
from scripts.model_v2.train import train_model
from scripts.model_v2.explain import explain_model


def run_model_v2():
    """Full Model V2 training and evaluation pipeline."""
    print("\n" + "=" * 80)
    print("  Validated XGBoost Model V2 -- Independent Reproducible Pipeline")
    print(f"  Experiment ID: {EXPERIMENT_ID}")
    print("=" * 80 + "\n")

    # Step 1: Verify authoritative sources
    print("[Step 1/5] Verifying authoritative data sources...")
    sources = verify_model_v2_sources()
    for name, s in sources.items():
        print(f"  [OK] {name:22s}: {s['size_bytes']:8,d} bytes | SHA-256: {s['sha256'][:16]}...")

    # Step 2: Assemble dataset
    print("\n[Step 2/5] Assembling multi-year panel dataset (Parquet + CSV.gz)...")
    df_full, dataset_manifest = assemble_full_dataset()

    # Step 3: Train model & evaluate
    print("\n[Step 3/5] Training Model V2 & Running 3-Perspective Validation Suite...")
    model, training_results = train_model(df_full)

    # Step 4: SHAP explainability
    print("\n[Step 4/5] Computing TreeSHAP feature attributions...")
    shap_results = explain_model(model, df_full)

    # Step 5: Write model manifest
    print("\n[Step 5/5] Writing comprehensive model manifest...")
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)

    model_manifest = {
        "model_version": "2.0.0-validated",
        "experiment_name": "Independent Reproducible Model V2",
        "experiment_id": EXPERIMENT_ID,
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "scientific_classification": "Retrospective Out-of-Time Spatial Evaluation",
        "original_benchmark_preserved": {
            "roc_auc": 0.82, "precision": 0.79, "recall": 0.84, "f1": 0.81,
            "note": "Original documented benchmark -- preserved untouched as historical reference."
        },
        "environment": {
            "python_version": platform.python_version(),
            "xgboost_version": xgb.__version__,
            "sklearn_version": sklearn.__version__,
            "numpy_version": np.__version__,
            "platform": platform.platform()
        },
        "sources": {name: s["sha256"] for name, s in sources.items()},
        "feature_groups_count": 4,
        "features": FEATURE_COLS,
        "hyperparameters": XGB_HYPERPARAMS,
        "temporal_design": {
            "train_target": 2022,
            "val_target": 2023,
            "test_target": 2024
        },
        "results": training_results,
        "shap_summary": shap_results,
        "status": "VALIDATED_XGBOOST_MODEL_V2_COMPLETE"
    }

    with open(OUTPUT_MODEL_MANIFEST, "w", encoding="utf-8") as f:
        json.dump(model_manifest, f, indent=2)

    print(f"\nModel manifest saved to: {OUTPUT_MODEL_MANIFEST}")

    # Final summary banner
    tr = training_results
    test_m = tr["test_metrics"]
    ci = tr["test_bootstrap_ci"]
    base = tr["baselines"]
    top5 = tr["test_top_k_operational"].get("top_5pct", {})

    print("\n" + "=" * 80)
    print("  Model V2 Pipeline Execution Complete -- Summary of Findings")
    print("=" * 80)
    print(f"  Train AUC:        {tr['train_metrics']['roc_auc']}")
    print(f"  Validation AUC:   {tr['val_metrics']['roc_auc']}")
    print(f"  Test ROC-AUC:     {test_m['roc_auc']}  (95% CI: [{ci['roc_auc_ci_lower']}, {ci['roc_auc_ci_upper']}])")
    print(f"  Test PR-AUC:      {test_m['pr_auc']}  (95% CI: [{ci['pr_auc_ci_lower']}, {ci['pr_auc_ci_upper']}])")
    print(f"  Test Brier Score: {test_m['brier_score']}")
    print(f"  Top-5% Lift:      {top5.get('lift', 'N/A')}x  (Precision: {top5.get('precision', 'N/A')}, Captured: {top5.get('captured_positives', 'N/A')}/{top5.get('total_positives', 'N/A')})")
    print(f"  Baselines:        Random={base['random_baseline']['mean_auc']:.4f} | Lat={base['latitude_heuristic']['roc_auc']} | Road={base['road_proximity_heuristic']['roc_auc']} | HistLoss={base['historical_loss_heuristic']['roc_auc']}")
    print(f"  Spatial Holdouts: North AUC={tr['spatial_evaluation']['north_region']['metrics']['roc_auc']} | South AUC={tr['spatial_evaluation']['south_region']['metrics']['roc_auc']}")
    print("=" * 80 + "\n")

    return model_manifest


if __name__ == "__main__":
    run_model_v2()
