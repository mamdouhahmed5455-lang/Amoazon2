"""
Comprehensive evaluation module for Model V2.
Calculates rare-event metrics, bootstrap confidence intervals, operational Top-K lift,
calibration statistics, and 4 mandatory baselines (multi-seed random, latitude heuristic,
road proximity, and historical loss).
"""

from typing import Dict, Any, List, Tuple, Optional
import numpy as np
import pandas as pd
from sklearn.metrics import (
    roc_auc_score, average_precision_score, precision_score, recall_score,
    f1_score, balanced_accuracy_score, brier_score_loss
)
from sklearn.calibration import calibration_curve

from .config import RANDOM_SEED


def compute_metrics(y_true: np.ndarray, y_score: np.ndarray, threshold: float = 0.5) -> Dict[str, Any]:
    """Computes the core metric suite for binary classification."""
    y_true = np.asarray(y_true, dtype=int)
    y_score = np.asarray(y_score, dtype=float)
    y_pred = (y_score >= threshold).astype(int)

    n_pos = int(y_true.sum())
    has_both_classes = 0 < n_pos < len(y_true)

    roc_auc = float(roc_auc_score(y_true, y_score)) if has_both_classes else None
    pr_auc = float(average_precision_score(y_true, y_score)) if has_both_classes else None
    brier = float(brier_score_loss(y_true, y_score))
    bal_acc = float(balanced_accuracy_score(y_true, y_pred)) if has_both_classes else None
    prec = float(precision_score(y_true, y_pred, zero_division=0))
    rec = float(recall_score(y_true, y_pred, zero_division=0))
    f1 = float(f1_score(y_true, y_pred, zero_division=0))

    return {
        "roc_auc": round(roc_auc, 4) if roc_auc is not None else None,
        "pr_auc": round(pr_auc, 6) if pr_auc is not None else None,
        "brier_score": round(brier, 5),
        "balanced_accuracy": round(bal_acc, 4) if bal_acc is not None else None,
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1": round(f1, 4),
        "positives": n_pos,
        "total_samples": len(y_true),
        "prevalence_pct": round(n_pos / len(y_true) * 100, 4) if len(y_true) > 0 else 0.0
    }


def compute_bootstrap_ci(
    y_true: np.ndarray, y_score: np.ndarray, n_bootstraps: int = 1000, alpha: float = 0.05, seed: int = RANDOM_SEED
) -> Dict[str, Any]:
    """Computes percentile bootstrap 95% confidence intervals for ROC-AUC and PR-AUC."""
    rng = np.random.default_rng(seed)
    n = len(y_true)
    boot_aucs = []
    boot_praucs = []

    for _ in range(n_bootstraps):
        idx = rng.choice(n, size=n, replace=True)
        y_b = y_true[idx]
        s_b = y_score[idx]
        if y_b.sum() > 0 and (y_b == 0).sum() > 0:
            try:
                boot_aucs.append(roc_auc_score(y_b, s_b))
                boot_praucs.append(average_precision_score(y_b, s_b))
            except ValueError:
                continue

    if boot_aucs:
        low_auc = float(np.percentile(boot_aucs, 100 * (alpha / 2)))
        high_auc = float(np.percentile(boot_aucs, 100 * (1 - alpha / 2)))
        mean_auc = float(np.mean(boot_aucs))
    else:
        low_auc, high_auc, mean_auc = None, None, None

    if boot_praucs:
        low_prauc = float(np.percentile(boot_praucs, 100 * (alpha / 2)))
        high_prauc = float(np.percentile(boot_praucs, 100 * (1 - alpha / 2)))
        mean_prauc = float(np.mean(boot_praucs))
    else:
        low_prauc, high_prauc, mean_prauc = None, None, None

    return {
        "roc_auc_mean": round(mean_auc, 4) if mean_auc else None,
        "roc_auc_ci_lower": round(low_auc, 4) if low_auc else None,
        "roc_auc_ci_upper": round(high_auc, 4) if high_auc else None,
        "pr_auc_mean": round(mean_prauc, 6) if mean_prauc else None,
        "pr_auc_ci_lower": round(low_prauc, 6) if low_prauc else None,
        "pr_auc_ci_upper": round(high_prauc, 6) if high_prauc else None,
        "n_bootstraps": len(boot_aucs)
    }


def compute_top_k_operational(y_true: np.ndarray, y_score: np.ndarray) -> Dict[str, Any]:
    """
    Computes operational prioritization metrics across pre-declared capacity tiers:
    0.1%, 0.5%, 1.0%, 5.0%, 10.0%, 20.0%.
    """
    n = len(y_true)
    total_pos = int(y_true.sum())
    base_prev = total_pos / n if n > 0 else 0.0

    sorted_idx = np.argsort(y_score)[::-1]
    tiers = [
        (0.001, "top_0.1pct"),
        (0.005, "top_0.5pct"),
        (0.01,  "top_1pct"),
        (0.05,  "top_5pct"),
        (0.10,  "top_10pct"),
        (0.20,  "top_20pct")
    ]

    results = {}
    for pct, name in tiers:
        k = max(1, int(n * pct))
        top_k_labels = y_true[sorted_idx[:k]]
        captured = int(top_k_labels.sum())
        prec = captured / k
        rec = captured / total_pos if total_pos > 0 else 0.0
        lift = prec / base_prev if base_prev > 0 else 0.0
        results[name] = {
            "capacity_pct": pct * 100,
            "k_cells": k,
            "captured_positives": captured,
            "total_positives": total_pos,
            "precision": round(prec, 5),
            "recall": round(rec, 4),
            "lift": round(lift, 2)
        }
    return results


def evaluate_calibration(y_true: np.ndarray, y_score: np.ndarray, n_bins: int = 5) -> Dict[str, Any]:
    """
    Evaluates probability calibration using binned reliability and Brier score.
    Determines whether model output qualifies as well-calibrated probability or relative risk score.
    """
    brier = float(brier_score_loss(y_true, y_score))
    
    # Stratified score quantiles
    try:
        prob_true, prob_pred = calibration_curve(y_true, y_score, n_bins=n_bins, strategy="quantile")
        bins_data = [
            {"mean_predicted": round(float(p), 4), "observed_frequency": round(float(t), 4)}
            for p, t in zip(prob_pred, prob_true)
        ]
    except Exception:
        bins_data = []

    # Calibration verdict
    is_calibrated = (brier < 0.01) and (len(bins_data) > 0 and bins_data[-1]["observed_frequency"] > bins_data[0]["observed_frequency"])
    semantic_designation = "probability" if is_calibrated else "relative risk score"

    return {
        "brier_score": round(brier, 5),
        "binned_calibration": bins_data,
        "semantic_designation": semantic_designation,
        "recommendation": "Output should be interpreted as relative spatial risk score rather than literal physical probability."
    }


def compute_all_baselines(df_test: pd.DataFrame, y_test: np.ndarray, n_random_seeds: int = 50) -> Dict[str, Any]:
    """
    Evaluates 4 mandatory baselines:
    1. Multi-seed Random Ranking (mean and std across seeds)
    2. Latitude-only heuristic (higher latitude = northern agricultural frontier)
    3. Road-proximity-only baseline (inverse distance to road)
    4. Historical-loss-only baseline (inverse distance to prior clear-cuts)
    """
    y_test = np.asarray(y_test, dtype=int)
    has_pos = y_test.sum() > 0

    # 1. Multi-seed random baseline
    rand_aucs = []
    for s in range(n_random_seeds):
        rng = np.random.default_rng(RANDOM_SEED + s)
        rand_scores = rng.uniform(0, 1, len(y_test))
        if has_pos:
            rand_aucs.append(roc_auc_score(y_test, rand_scores))
    rand_mean = float(np.mean(rand_aucs)) if rand_aucs else 0.5
    rand_std = float(np.std(rand_aucs)) if rand_aucs else 0.0

    # 2. Latitude heuristic
    lat_vals = df_test["lat"].values
    lat_scores = (lat_vals - lat_vals.min()) / (lat_vals.max() - lat_vals.min() + 1e-9)
    lat_auc = float(roc_auc_score(y_test, lat_scores)) if has_pos else 0.5

    # 3. Road distance heuristic (closer road = higher risk)
    road_dists = df_test["dist_road_km"].values
    road_scores = 1.0 / (road_dists + 1.0)
    road_scores = (road_scores - road_scores.min()) / (road_scores.max() - road_scores.min() + 1e-9)
    road_auc = float(roc_auc_score(y_test, road_scores)) if has_pos else 0.5

    # 4. Historical loss distance heuristic (closer prior loss = higher risk)
    loss_dists = df_test["dist_hist_loss_km"].values
    loss_scores = 1.0 / (loss_dists + 1.0)
    loss_scores = (loss_scores - loss_scores.min()) / (loss_scores.max() - loss_scores.min() + 1e-9)
    loss_auc = float(roc_auc_score(y_test, loss_scores)) if has_pos else 0.5

    return {
        "random_baseline": {
            "mean_auc": round(rand_mean, 4),
            "std_auc": round(rand_std, 4),
            "expected_theoretical": 0.5000,
            "seeds_evaluated": n_random_seeds
        },
        "latitude_heuristic": {
            "roc_auc": round(lat_auc, 4),
            "hypothesis": "Northern frontier latitude correlates with deforestation"
        },
        "road_proximity_heuristic": {
            "roc_auc": round(road_auc, 4),
            "hypothesis": "Proximity to federal highway correlates with deforestation"
        },
        "historical_loss_heuristic": {
            "roc_auc": round(loss_auc, 4),
            "hypothesis": "Proximity to prior clear-cuts correlates with deforestation"
        }
    }
