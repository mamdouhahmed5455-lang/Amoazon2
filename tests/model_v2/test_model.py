"""
Automated unit tests for Model V2 training determinism, probability boundaries, and artifact deserialization.
TEST FIXTURE -- VERIFIES MODEL FUNCTIONALITY
"""

import unittest
import numpy as np
import xgboost as xgb

from scripts.model_v2.config import OUTPUT_MODEL_JSON, XGB_HYPERPARAMS, RANDOM_SEED, FEATURE_COLS


class TestModelV2Model(unittest.TestCase):
    """Verifies model loading, deterministic training, and output bounds."""

    def test_model_artifact_exists_and_loads(self):
        """Ensures serialized XGBoost model exists and can be loaded via XGBClassifier."""
        self.assertTrue(OUTPUT_MODEL_JSON.exists(), f"Model artifact missing: {OUTPUT_MODEL_JSON}")
        clf = xgb.XGBClassifier()
        clf.load_model(str(OUTPUT_MODEL_JSON))
        self.assertEqual(clf.n_features_in_, len(FEATURE_COLS))

    def test_deterministic_training_reproducibility(self):
        """Ensures two independent training runs with identical seed produce identical predictions."""
        np.random.seed(RANDOM_SEED)
        X_mock = np.random.randn(100, len(FEATURE_COLS))
        y_mock = (np.random.rand(100) > 0.8).astype(int)

        clf1 = xgb.XGBClassifier(**XGB_HYPERPARAMS)
        clf1.fit(X_mock, y_mock)
        p1 = clf1.predict_proba(X_mock)[:, 1]

        clf2 = xgb.XGBClassifier(**XGB_HYPERPARAMS)
        clf2.fit(X_mock, y_mock)
        p2 = clf2.predict_proba(X_mock)[:, 1]

        np.testing.assert_allclose(p1, p2, atol=1e-6, err_msg="Model training is not deterministic!")

    def test_predictions_bounded_in_zero_one(self):
        """Ensures all model output predictions fall strictly in [0, 1]."""
        clf = xgb.XGBClassifier()
        clf.load_model(str(OUTPUT_MODEL_JSON))
        
        # Test on standard range inputs
        test_inputs = np.array([
            [10.0, 5.0, 12, 4.5, 200.0],
            [150.0, 80.0, 0, 1.2, 350.0],
            [0.5, 0.2, 50, 8.0, 120.0]
        ])
        preds = clf.predict_proba(test_inputs)[:, 1]
        self.assertTrue((preds >= 0.0).all())
        self.assertTrue((preds <= 1.0).all())


if __name__ == "__main__":
    unittest.main()
