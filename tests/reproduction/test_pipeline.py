"""
Reproduction Unit Tests.
Verifies dataset integrity, schema audits, deterministic splits, metric calculations, and the label guard.
Uses synthetic fixtures ONLY for verifying software execution.
"""

import unittest
import pandas as pd
import numpy as np
from pathlib import Path
import json

from scripts.reproduction.config import (
    PRODUCTION_DATASET_PATH,
    BENCHMARK_METRICS,
    EXPERIMENT_SEED
)
from scripts.reproduction.load_data import load_and_verify_dataset, compute_file_sha256
from scripts.reproduction.prepare_features import audit_features
from scripts.reproduction.prepare_labels import audit_target_labels, get_ground_truth_labels, TargetReconstructionBlockedException
from scripts.reproduction.split_data import split_random, split_spatial_holdout
from scripts.reproduction.train_model import build_model, train_reproduction_model
from scripts.reproduction.evaluate_model import evaluate_predictions


class TestReproductionPipeline(unittest.TestCase):

    def test_01_dataset_integrity(self):
        """Verifies that the production dataset exists, has 150,000 rows, and zero nulls."""
        df, meta = load_and_verify_dataset(PRODUCTION_DATASET_PATH)
        self.assertEqual(meta["row_count"], 150000)
        self.assertEqual(len(df), 150000)
        self.assertEqual(sum(meta["null_counts"].values()), 0)
        self.assertTrue(len(meta["sha256"]) == 64)

    def test_02_feature_schema_and_elevation_formula(self):
        """Verifies feature schema audit and confirms elevation = risk_norm * 4000."""
        df, _ = load_and_verify_dataset(PRODUCTION_DATASET_PATH)
        audit = audit_features(df)
        self.assertEqual(audit["documented_training_features_count"], 12)
        self.assertFalse(audit["elevation_column_is_physical_meters"])
        self.assertLess(audit["elevation_formula_max_deviation"], 1e-5)

    def test_03_label_integrity_and_guard(self):
        """Verifies that ground-truth labels are correctly flagged as absent and blocked."""
        df, _ = load_and_verify_dataset(PRODUCTION_DATASET_PATH)
        label_audit = audit_target_labels(df)
        self.assertTrue(label_audit["blocked"])
        self.assertEqual(label_audit["status"], "NOT_RECOVERABLE")
        
        # Verify that get_ground_truth_labels raises TargetReconstructionBlockedException
        with self.assertRaises(TargetReconstructionBlockedException):
            get_ground_truth_labels(df, allow_synthetic_test_fixture=False)

    def test_04_deterministic_split(self):
        """Verifies that Track A random split is strictly deterministic with the same seed."""
        df_sample = pd.DataFrame({"lat": np.linspace(-12, -10, 100), "lon": np.linspace(-64, -62, 100)})
        train1, test1, _ = split_random(df_sample, test_size=0.2, seed=42)
        train2, test2, _ = split_random(df_sample, test_size=0.2, seed=42)
        pd.testing.assert_frame_equal(train1, train2)
        pd.testing.assert_frame_equal(test1, test2)

    def test_05_spatial_holdout_split(self):
        """Verifies that Track B spatial holdout strictly partitions by latitude boundary."""
        df_sample = pd.DataFrame({"lat": [-12.5, -11.5, -10.5, -9.5], "lon": [-63.0, -63.1, -63.2, -63.3]})
        train, test, meta = split_spatial_holdout(df_sample, lat_threshold=-11.0)
        self.assertTrue(all(train["lat"] <= -11.0))
        self.assertTrue(all(test["lat"] > -11.0))
        self.assertEqual(len(train), 2)
        self.assertEqual(len(test), 2)

    def test_06_metrics_calculation_consistency(self):
        """Verifies metric computation logic on synthetic fixture against mathematical definitions."""
        y_true = pd.Series([1, 1, 0, 0, 1, 0, 1, 0, 0, 0])
        y_prob = np.array([0.9, 0.8, 0.2, 0.1, 0.7, 0.6, 0.85, 0.3, 0.4, 0.15])
        results = evaluate_predictions(y_true, y_prob, threshold=0.5)
        
        self.assertIn("roc_auc", results["metrics"])
        self.assertIn("precision", results["metrics"])
        self.assertIn("recall", results["metrics"])
        self.assertIn("f1", results["metrics"])
        self.assertGreater(results["metrics"]["roc_auc"], 0.8)

    def test_07_deterministic_training_harness(self):
        """Verifies that the XGBoost training harness executes deterministically on a fixture."""
        np.random.seed(42)
        X = pd.DataFrame({"feat1": np.random.randn(200), "feat2": np.random.randn(200)})
        y = pd.Series((X["feat1"] + X["feat2"] > 0).astype(int))
        
        model1, _ = train_reproduction_model(X, y)
        preds1 = model1.predict_proba(X)[:, 1]
        
        model2, _ = train_reproduction_model(X, y)
        preds2 = model2.predict_proba(X)[:, 1]
        
        np.testing.assert_allclose(preds1, preds2, rtol=1e-5)


if __name__ == "__main__":
    unittest.main()
