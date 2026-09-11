"""
SHAP explainability module for Model V2.
Runs TreeSHAP exclusively on Model V2.
Generates:
1. Global mean absolute SHAP values & normalized percentage importance.
2. SHAP summary beeswarm visualization saved to artifacts/model-v2/shap/shap_summary_plot.png.
3. Deterministic local explanation example saved to artifacts/model-v2/shap/local_shap_example.json.
4. Full summary artifact saved to artifacts/model-v2/shap/shap_summary.json.
"""

import json
from pathlib import Path
from typing import Dict, Any
import numpy as np
import pandas as pd
import xgboost as xgb
import shap
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

from .config import FEATURE_COLS, SHAP_DIR


def explain_model(model: xgb.XGBClassifier, df: pd.DataFrame) -> Dict[str, Any]:
    """
    Executes TreeSHAP explainability pipeline on the held-out test split of Model V2.
    """
    SHAP_DIR.mkdir(parents=True, exist_ok=True)

    df_test = df[df["split"] == "test"].reset_index(drop=True)
    X_test = df_test[FEATURE_COLS].values

    print("\n  Computing SHAP TreeExplainer values on held-out test set...")
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X_test)

    # 1. Global Mean Absolute SHAP Importance
    mean_abs_shap = np.abs(shap_values).mean(axis=0)
    total_shap = mean_abs_shap.sum()
    normalized_pct = (mean_abs_shap / total_shap * 100) if total_shap > 0 else np.zeros_like(mean_abs_shap)

    global_importance = {}
    for i, feat in enumerate(FEATURE_COLS):
        global_importance[feat] = {
            "mean_abs_shap": round(float(mean_abs_shap[i]), 6),
            "normalized_pct": round(float(normalized_pct[i]), 2)
        }

    # Sort descending
    ranked_features = sorted(global_importance.items(), key=lambda x: -x[1]["mean_abs_shap"])

    print("\n  Model V2 SHAP Global Feature Importance:")
    print(f"  {'Feature':<26} {'Mean |SHAP|':>14} {'Normalized %':>14}")
    print("  " + "-" * 56)
    for feat, vals in ranked_features:
        print(f"  {feat:<26} {vals['mean_abs_shap']:>14.6f} {vals['normalized_pct']:>13.2f}%")

    # 2. Generate Beeswarm / Summary Plot
    plot_path = SHAP_DIR / "shap_summary_plot.png"
    plt.figure(figsize=(9, 5), dpi=150)
    shap.summary_plot(shap_values, X_test, feature_names=FEATURE_COLS, show=False)
    plt.title("Model V2 TreeSHAP Feature Attributions (Held-Out Test Set: PRODES 2024)", fontsize=11, pad=12)
    plt.tight_layout()
    plt.savefig(plot_path)
    plt.close()
    print(f"\n  SHAP summary plot saved to: {plot_path}")

    # 3. Deterministic Local Explanation Example
    # Select the test cell with highest predicted risk
    test_preds = model.predict_proba(X_test)[:, 1]
    top_risk_idx = int(np.argmax(test_preds))
    top_cell = df_test.iloc[top_risk_idx]

    local_example = {
        "cell_id": int(top_cell["cell_id"]),
        "lat": float(top_cell["lat"]),
        "lon": float(top_cell["lon"]),
        "target_year": int(top_cell["target_year"]),
        "ground_truth_label": int(top_cell["label"]),
        "model_predicted_probability": round(float(test_preds[top_risk_idx]), 5),
        "base_value_expected": round(float(explainer.expected_value), 5) if np.isscalar(explainer.expected_value) else float(explainer.expected_value[0]),
        "feature_contributions": {
            feat: {
                "feature_value": round(float(X_test[top_risk_idx, i]), 4),
                "shap_attribution": round(float(shap_values[top_risk_idx, i]), 5)
            }
            for i, feat in enumerate(FEATURE_COLS)
        }
    }

    local_file = SHAP_DIR / "local_shap_example.json"
    with open(local_file, "w", encoding="utf-8") as f:
        json.dump(local_example, f, indent=2)
    print(f"  Local SHAP explanation saved to: {local_file}")

    # 4. Save SHAP Summary Manifest
    shap_summary = {
        "experiment": "GEOAI-MODEL-V2-20260908",
        "scientific_classification": "TreeSHAP Attribution on Retrospective Out-of-Time Test Set",
        "note": "Model V2 SHAP values are independently calculated and NOT identical to legacy 41/23/21/15 benchmark weights.",
        "test_samples_evaluated": len(X_test),
        "feature_count": len(FEATURE_COLS),
        "global_importance": global_importance,
        "feature_ranking_descending": [feat for feat, _ in ranked_features],
        "artifacts": {
            "summary_plot": str(plot_path),
            "local_example": str(local_file)
        }
    }

    summary_file = SHAP_DIR / "shap_summary.json"
    with open(summary_file, "w", encoding="utf-8") as f:
        json.dump(shap_summary, f, indent=2)
    print(f"  SHAP manifest saved to: {summary_file}")

    return shap_summary
