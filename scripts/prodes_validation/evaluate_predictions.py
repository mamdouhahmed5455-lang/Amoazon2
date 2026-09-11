"""
Prediction evaluation module against official INPE PRODES ground-truth observations.
Calculates ROC-AUC, PR-AUC, Precision@K, Spatial Holdout metrics, and Calibration statistics.
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


def compute_precision_at_k(y_true: np.ndarray, y_score: np.ndarray, k_values: List[int] = [100, 500, 1000]) -> Dict[str, float]:
    """Computes Precision@K for top-ranked K cells by risk score."""
    sorted_indices = np.argsort(y_score)[::-1]
    precisions = {}
    for k in k_values:
        if k <= len(sorted_indices):
            top_k_indices = sorted_indices[:k]
            top_k_true = y_true[top_k_indices]
            precisions[f"precision_at_{k}"] = round(float(top_k_true.sum() / k), 5)
    return precisions


def evaluate_prodes_alignment(df: pd.DataFrame, label_col: str = "prodes_label_2024") -> Dict[str, Any]:
    """
    Evaluates existing precomputed risk_norm against authoritative PRODES ground truth.
    """
    y_true = df[label_col].to_numpy()
    y_score = df["risk_norm"].to_numpy()

    # 1. Overall Threshold-Independent Metrics
    auc = float(roc_auc_score(y_true, y_score))
    pr_auc = float(average_precision_score(y_true, y_score))
    brier = float(brier_score_loss(y_true, y_score))
    prec_at_k = compute_precision_at_k(y_true, y_score)

    # 2. Threshold Sensitivity Grid (Percentile-based thresholds on risk_norm)
    thresholds = [0.90, 0.92, 0.94, 0.96, 0.98]
    threshold_results = []
    for t in thresholds:
        y_pred = (y_score >= t).astype(int)
        p = float(precision_score(y_true, y_pred, zero_division=0))
        r = float(recall_score(y_true, y_pred, zero_division=0))
        f = float(f1_score(y_true, y_pred, zero_division=0))
        coverage = int(y_pred.sum())
        threshold_results.append({
            "threshold": t,
            "predicted_positives": coverage,
            "precision": round(p, 5),
            "recall": round(r, 5),
            "f1": round(f, 5)
        })

    # 3. Default Decision Threshold Confusion Matrix (at median score ~0.94)
    default_t = 0.94
    y_pred_def = (y_score >= default_t).astype(int)
    tn, fp, fn, tp = confusion_matrix(y_true, y_pred_def).ravel()

    # 4. Spatial Holdout Evaluation (North vs South)
    north_mask = df["lat"] > SPATIAL_HOLDOUT_LATITUDE
    south_mask = ~north_mask

    df_north = df[north_mask]
    df_south = df[south_mask]

    north_auc = float(roc_auc_score(df_north[label_col], df_north["risk_norm"])) if df_north[label_col].nunique() > 1 else None
    south_auc = float(roc_auc_score(df_south[label_col], df_south["risk_norm"])) if df_south[label_col].nunique() > 1 else None

    return {
        "evaluation_target": label_col,
        "sample_size": len(df),
        "positive_ground_truth_count": int(y_true.sum()),
        "prevalence_rate": round(float(y_true.mean()), 6),
        "metrics": {
            "roc_auc": round(auc, 4),
            "pr_auc": round(pr_auc, 6),
            "brier_score": round(brier, 4)
        },
        "precision_at_k": prec_at_k,
        "threshold_grid": threshold_results,
        "confusion_matrix_at_0_94": {
            "threshold": default_t,
            "true_positives": int(tp),
            "false_negatives": int(fn),
            "false_positives": int(fp),
            "true_negatives": int(tn)
        },
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
