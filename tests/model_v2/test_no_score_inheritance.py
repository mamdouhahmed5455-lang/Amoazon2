"""
Automated unit tests proving ZERO inheritance from production risk scores or web grid.
TEST FIXTURE -- VERIFIES SCIENTIFIC ISOLATION FROM LEGACY PREDICTIONS
"""

import unittest
from pathlib import Path
import pandas as pd

from scripts.model_v2.config import FEATURE_COLS, OUTPUT_FEATURES_PARQUET, OUTPUT_LABELS_PARQUET


class TestModelV2NoScoreInheritance(unittest.TestCase):
    """Proves that Model V2 predictors and labels never inherit production risk values."""

    def test_feature_list_excludes_legacy_scores(self):
        """Ensures declared feature columns contain zero legacy score or probability columns."""
        forbidden = ["risk_score", "risk_norm", "elevation", "color", "confidence", "frontier_score"]
        for col in forbidden:
            self.assertNotIn(col, FEATURE_COLS)

    def test_features_artifact_excludes_legacy_scores(self):
        """Ensures saved features artifact contains zero legacy score columns."""
        if OUTPUT_FEATURES_PARQUET.exists():
            df = pd.read_parquet(OUTPUT_FEATURES_PARQUET)
            forbidden = ["risk_score", "risk_norm", "color", "confidence"]
            for col in forbidden:
                self.assertNotIn(col, df.columns)

    def test_labels_artifact_excludes_legacy_scores(self):
        """Ensures saved labels artifact contains zero legacy score columns."""
        if OUTPUT_LABELS_PARQUET.exists():
            df = pd.read_parquet(OUTPUT_LABELS_PARQUET)
            forbidden = ["risk_score", "risk_norm", "color", "confidence"]
            for col in forbidden:
                self.assertNotIn(col, df.columns)

    def test_zero_heuristic_zero_risk_assignments(self):
        """
        Verifies that no manual 'deep forest -> risk_norm = 0' or
        'within 3.5 km -> inherit score' heuristics exist in feature extraction.
        """
        # Read source code of build_features.py and build_labels.py to ensure no heuristic score assignments
        bf_code = Path("scripts/model_v2/build_features.py").read_text(encoding="utf-8")
        bl_code = Path("scripts/model_v2/build_labels.py").read_text(encoding="utf-8")

        for code, fname in [(bf_code, "build_features.py"), (bl_code, "build_labels.py")]:
            self.assertNotIn("forest_data_clean.json", code, f"{fname} references production web grid!")
            self.assertNotIn("risk_norm", code, f"{fname} references risk_norm!")
            self.assertNotIn("risk_score", code, f"{fname} references risk_score!")


if __name__ == "__main__":
    unittest.main()
