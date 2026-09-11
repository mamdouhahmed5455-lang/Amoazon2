"""
Model evaluation module computing ROC-AUC, Precision, Recall, F1, Accuracy, and Confusion Matrix.
Provides structured metric comparison against canonical project benchmarks.
"""

from typing import Dict, Any
import numpy as np
import pandas as pd
from sklearn.metrics import (
    roc_auc_score,
    precision_score,
    recall_score,
    f1_score,
    accuracy_score,
    confusion_matrix,
    brier_score_loss
)

from .config import DEFAULT_THRESHOLD, BENCHMARK_METRICS


def evaluate_predictions(y_true: pd.Series, y_prob: np.ndarray, threshold: float = DEFAULT_THRESHOLD) -> Dict[str, Any]:
    """
    Computes standard classification metrics and compares with documented benchmarks.
    """
    y_pred = (y_prob >= threshold).astype(int)

    # Core Metrics
    auc = float(roc_auc_score(y_true, y_prob))
    prec = float(precision_score(y_true, y_pred, zero_division=0))
    rec = float(recall_score(y_true, y_pred, zero_division=0))
    f1 = float(f1_score(y_true, y_pred, zero_division=0))
    acc = float(accuracy_score(y_true, y_pred))
    brier = float(brier_score_loss(y_true, y_prob))

    # Confusion Matrix
    tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()

    results = {
        "metrics": {
            "roc_auc": round(auc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1": round(f1, 4),
            "accuracy": round(acc, 4),
            "brier_score": round(brier, 4),
            "decision_threshold": threshold
        },
        "confusion_matrix": {
            "true_positives": int(tp),
            "false_negatives": int(fn),
            "false_positives": int(fp),
            "true_negatives": int(tn)
        },
        "comparison_with_canonical_benchmark": {
            "benchmark_auc": BENCHMARK_METRICS["roc_auc"],
            "reconstructed_auc": round(auc, 4),
            "benchmark_f1": BENCHMARK_METRICS["f1"],
            "reconstructed_f1": round(f1, 4),
            "auc_delta": round(auc - BENCHMARK_METRICS["roc_auc"], 4),
            "f1_delta": round(f1 - BENCHMARK_METRICS["f1"], 4)
        }
    }

    return results
