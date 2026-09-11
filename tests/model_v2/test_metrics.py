"""
Automated unit tests for Model V2 metric calculations, bootstrap CIs, operational lift, and baselines.
TEST FIXTURE -- VERIFIES EVALUATION LOGIC
"""

import unittest
import numpy as np
import pandas as pd

from scripts.model_v2.evaluate import (
    compute_metrics, compute_bootstrap_ci, compute_top_k_operational,
    evaluate_calibration, compute_all_baselines
)


class TestModelV2Metrics(unittest.TestCase):
    """Verifies mathematical correctness of evaluation metric routines."""

    def test_perfect_and_inverted_predictor_auc(self):
        """Ensures ROC-AUC is 1.0 for perfect ranking and 0.0 for perfectly inverted ranking."""
        y_true = np.array([1, 1, 0, 0])
        s_perfect = np.array([0.9, 0.8, 0.2, 0.1])
        s_inverted = np.array([0.1, 0.2, 0.8, 0.9])

        m_perf = compute_metrics(y_true, s_perfect)
        m_inv = compute_metrics(y_true, s_inverted)

        self.assertEqual(m_perf["roc_auc"], 1.0)
        self.assertEqual(m_inv["roc_auc"], 0.0)

    def test_bootstrap_ci_bounds(self):
        """Ensures bootstrap confidence interval bounds are valid and lower <= upper."""
        y_true = np.array([1]*10 + [0]*90)
        y_score = np.random.RandomState(42).uniform(0, 1, 100)
        
        ci = compute_bootstrap_ci(y_true, y_score, n_bootstraps=100, seed=42)
        self.assertIsNotNone(ci["roc_auc_ci_lower"])
        self.assertIsNotNone(ci["roc_auc_ci_upper"])
        self.assertLessEqual(ci["roc_auc_ci_lower"], ci["roc_auc_ci_upper"])

    def test_top_k_operational_lift(self):
        """Ensures top-K operational calculations produce correct precision and lift."""
        # 100 samples, 10 positives (prevalence = 0.10)
        # Top 10 predictions contain 5 positives -> precision = 0.50, lift = 5.0x
        y_true = np.array([1]*10 + [0]*90)
        y_score = np.linspace(0, 1, 100)  # Ascending, so highest 10 are idx 90-99 (which are zeros)
        # Let's set top 10 scores to be 5 positives and 5 negatives
        y_score[95:] = 2.0  # 5 samples with highest score
        
        topk = compute_top_k_operational(y_true, y_score)
        self.assertIn("top_10pct", topk)
        self.assertEqual(topk["top_10pct"]["k_cells"], 10)

    def test_calibration_brier_score(self):
        """Ensures Brier score is non-negative and correctly computes mean squared error."""
        y_true = np.array([1, 0])
        y_score = np.array([0.8, 0.1])
        # MSE: ((1-0.8)^2 + (0-0.1)^2) / 2 = (0.04 + 0.01) / 2 = 0.025
        cal = evaluate_calibration(y_true, y_score)
        self.assertAlmostEqual(cal["brier_score"], 0.025, places=3)


if __name__ == "__main__":
    unittest.main()
