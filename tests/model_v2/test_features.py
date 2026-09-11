"""
Automated unit tests for Model V2 feature schema, completeness, and physical sanity bounds.
TEST FIXTURE -- VERIFIES FEATURE EXTRACTION
"""

import unittest
import numpy as np
import pandas as pd

from scripts.model_v2.config import FEATURE_COLS, OUTPUT_FEATURES_PARQUET, OUTPUT_FEATURES_CSV_GZ


class TestModelV2Features(unittest.TestCase):
    """Verifies feature schema, data types, absence of NaNs, and physical value ranges."""

    @classmethod
    def setUpClass(cls):
        """Loads features artifact."""
        if OUTPUT_FEATURES_PARQUET.exists():
            cls.df = pd.read_parquet(OUTPUT_FEATURES_PARQUET)
        elif OUTPUT_FEATURES_CSV_GZ.exists():
            cls.df = pd.read_csv(OUTPUT_FEATURES_CSV_GZ)
        else:
            raise FileNotFoundError("Model V2 features artifact not found. Run pipeline first.")

    def test_feature_columns_present_and_exact(self):
        """Ensures all 5 quantitative feature columns are present."""
        for col in FEATURE_COLS:
            self.assertIn(col, self.df.columns)

    def test_no_nulls_nans_or_infinities(self):
        """Ensures zero nulls, NaNs, or infinite values exist in any feature column."""
        for col in FEATURE_COLS:
            self.assertEqual(self.df[col].isna().sum(), 0, f"NaNs detected in {col}!")
            self.assertFalse(np.isinf(self.df[col]).any(), f"Infinities detected in {col}!")

    def test_feature_physical_ranges(self):
        """Verifies that engineered features fall within authentic physical bounds."""
        # Road proximity: 0 to 300 km
        self.assertGreaterEqual(self.df["dist_road_km"].min(), 0.0)
        self.assertLessEqual(self.df["dist_road_km"].max(), 300.0)

        # Historical loss distance: 0 to 300 km
        self.assertGreaterEqual(self.df["dist_hist_loss_km"].min(), 0.0)
        self.assertLessEqual(self.df["dist_hist_loss_km"].max(), 300.0)

        # Historical loss density count within 20km: >= 0
        self.assertGreaterEqual(self.df["prior_loss_dens"].min(), 0)
        self.assertTrue(np.issubdtype(self.df["prior_loss_dens"].dtype, np.integer))

        # Population pressure: >= 0
        self.assertGreaterEqual(self.df["pop_pressure"].min(), 0.0)

        # Physical elevation in meters ASL: 30m to 800m (Madeira river valley floor ~40m)
        self.assertGreaterEqual(self.df["elevation_m"].min(), 30.0)
        self.assertLessEqual(self.df["elevation_m"].max(), 800.0)


if __name__ == "__main__":
    unittest.main()
