"""
Automated unit tests for Model V2 neutral spatial unit grid determinism and eligibility.
TEST FIXTURE -- VERIFIES SPATIAL GRID GENERATION
"""

import unittest
import numpy as np
import pandas as pd

from scripts.model_v2.build_grid import build_model_v2_grid


class TestModelV2Grid(unittest.TestCase):
    """Verifies neutral grid determinism, cell count, and coordinate envelope."""

    def test_grid_determinism(self):
        """Ensures grid generation is completely deterministic across repeated calls."""
        df1, meta1 = build_model_v2_grid()
        df2, meta2 = build_model_v2_grid()

        self.assertEqual(len(df1), len(df2))
        self.assertEqual(len(df1), 7045)
        np.testing.assert_array_equal(df1["cell_id"].values, df2["cell_id"].values)
        np.testing.assert_allclose(df1["lat"].values, df2["lat"].values, atol=1e-7)
        np.testing.assert_allclose(df1["lon"].values, df2["lon"].values, atol=1e-7)

    def test_grid_coordinate_envelope(self):
        """Verifies that all cells are strictly bounded within Rondônia's geographic envelope."""
        df, meta = build_model_v2_grid()
        self.assertGreaterEqual(df["lat"].min(), -13.65)
        self.assertLessEqual(df["lat"].max(), -7.95)
        self.assertGreaterEqual(df["lon"].min(), -66.75)
        self.assertLessEqual(df["lon"].max(), -59.85)

    def test_no_production_risk_columns_in_grid(self):
        """Verifies that grid contains only geographic identifiers and zero production risk scores."""
        df, _ = build_model_v2_grid()
        forbidden_cols = ["risk_score", "risk_norm", "elevation", "color", "confidence"]
        for col in forbidden_cols:
            self.assertNotIn(col, df.columns)


if __name__ == "__main__":
    unittest.main()
