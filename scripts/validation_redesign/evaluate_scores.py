"""
Evaluation module for Phase 5D Redesigned Validation Experiment.
Computes ROC-AUC, PR-AUC, Brier score, Baseline comparisons, Top-K lift, and Spatial Holdout.
"""

from typing import Dict, Any, List
import numpy as np
import pandas as pd
from sklearn.metrics import (
    roc_auc_score,
    average_precision_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    brier_score_loss
)

from .config import SPATIAL_HOLDOUT_LATITUDE


def compute_top_k_lift(df: pd.DataFrame, score_col: str, label_col: str, k_percentages: List[float] = [0.01, 0.05, 0.10, 0.20]) -> List[Dict[str, Any]]:
    """
    Computes Precision, Recall, and Lift over base prevalence for top-ranked percentage tiers.
    """
    total_cells = len(df)
    total_positives = int(df[label_col].sum())
    base_prevalence = total_positives / total_cells if total_cells > 0 else 0.0

    df_sorted = df.sort_values(by=score_col, ascending=False).reset_index(drop=True)
    
    results = []
    for pct in k_percentages:
        k = max(1, int(total_cells * pct))
        top_k_slice = df_sorted.iloc[:k]
        captured_pos = int(top_k_slice[label_col].sum())
        prec = captured_pos / k if k > 0 else 0.0
        rec = captured_pos / total_positives if total_positives > 0 else 0.0
        lift = prec / base_prevalence if base_prevalence > 0 else 0.0

        results.append({
            "tier_percentage": f"Top {int(pct*100)}%",
            "flagged_cells_k": k,
            "captured_positives": captured_pos,
            "precision": round(prec, 5),
            "recall": round(rec, 4),
            "lift_over_base": round(lift, 2)
        })

    return results


def evaluate_redesigned_validation(df: pd.DataFrame, label_col: str = "prodes_label_recent") -> Dict[str, Any]:
    """
    Executes comprehensive evaluation of model risk_norm vs Baselines across the full-coverage population.
    """
    y_true = df[label_col].to_numpy()
    risk_norm = df["risk_norm"].to_numpy()
    base_lat = df["baseline_latitude"].to_numpy()
    base_rand = df["baseline_random"].to_numpy()

    # 1. Primary Model Performance
    model_auc = float(roc_auc_score(y_true, risk_norm))
    model_prauc = float(average_precision_score(y_true, risk_norm))
    model_brier = float(brier_score_loss(y_true, risk_norm))

    # 2. Baseline Models
    lat_auc = float(roc_auc_score(y_true, base_lat))
    lat_prauc = float(average_precision_score(y_true, base_lat))
    rand_auc = float(roc_auc_score(y_true, base_rand))

    # 3. Top-K Operational Capacity Tiers
    top_k_tiers = compute_top_k_lift(df, score_col="risk_norm", label_col=label_col)

    # 4. Spatial Holdout Evaluation
    north_mask = df["lat"] > SPATIAL_HOLDOUT_LATITUDE
    south_mask = ~north_mask

    df_north = df[north_mask]
    df_south = df[south_mask]

    north_auc = float(roc_auc_score(df_north[label_col], df_north["risk_norm"])) if df_north[label_col].nunique() > 1 else None
    south_auc = float(roc_auc_score(df_south[label_col], df_south["risk_norm"])) if df_south[label_col].nunique() > 1 else None

    return {
        "evaluation_target": label_col,
        "population_size": len(df),
        "total_positives": int(y_true.sum()),
        "base_prevalence": round(float(y_true.mean()), 6),
        "model_performance": {
            "roc_auc": round(model_auc, 4),
            "pr_auc": round(model_prauc, 6),
            "brier_score": round(model_brier, 4)
        },
        "baseline_comparison": {
            "baseline_random_auc": round(rand_auc, 4),
            "baseline_uniform_auc": 0.5000,
            "baseline_latitude_heuristic_auc": round(lat_auc, 4),
            "model_vs_random_delta_auc": round(model_auc - rand_auc, 4),
            "model_vs_latitude_delta_auc": round(model_auc - lat_auc, 4)
        },
        "top_k_operational_tiers": top_k_tiers,
        "spatial_holdout": {
            "latitude_partition": SPATIAL_HOLDOUT_LATITUDE,
            "northern_sector": {
                "samples": int(north_mask.sum()),
                "positives": int(df_north[label_col].sum()),
                "roc_auc": round(north_auc, 4) if north_auc is not None else "INSUFFICIENT_CLASSES"
            },
            "southern_sector": {
                "samples": int(south_mask.sum()),
                "positives": int(df_south[label_col].sum()),
                "roc_auc": round(south_auc, 4) if south_auc is not None else "INSUFFICIENT_CLASSES"
            }
        }
    }


if __name__ == "__main__":
    import pandas as pd
    from .config import OUTPUT_VALIDATION_DATASET_CSV
    df = pd.read_csv(OUTPUT_VALIDATION_DATASET_CSV)
    eval_res = evaluate_redesigned_validation(df, label_col="prodes_label_recent")
    print("Redesigned Validation Evaluation:", eval_res)
