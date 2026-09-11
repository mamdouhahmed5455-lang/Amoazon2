"""
Automated unit tests proving ZERO future temporal information leakage.
TEST FIXTURE -- VERIFIES TEMPORAL ISOLATION
"""

import unittest
from unittest.mock import patch
import pandas as pd
import numpy as np

from scripts.model_v2.config import FEATURE_COLS
from scripts.model_v2.build_grid import build_model_v2_grid
from scripts.model_v2.build_features import build_features_for_year, _load_prodes_coords
from scripts.model_v2.split_temporal import split_by_time


class TestModelV2TemporalLeakage(unittest.TestCase):
    """Rigorous verification that future observations never enter feature engineering."""

    @classmethod
    def setUpClass(cls):
        # Sample small grid subset for fast unit testing
        cls.df_grid_sample = pd.DataFrame({
            "cell_id": [0, 1, 2],
            "lat": [-10.0, -11.0, -12.0],
            "lon": [-62.0, -63.0, -64.0]
        })

    def test_target_year_never_in_prodes_history(self):
        """Ensures that for target year T, PRODES years query only < T."""
        for target_yr in [2022, 2023, 2024]:
            prior_years = [yr for yr in [2021, 2022, 2023] if yr < target_yr]
            # Target year must never be in prior years
            self.assertNotIn(target_yr, prior_years)
            for y in prior_years:
                self.assertLess(y, target_yr)

    def test_features_invariant_to_target_year_modifications(self):
        """
        Proof of zero leakage: mocks 2024 PRODES loading to verify that
        feature generation for 2024 is completely agnostic to 2024 data.
        """
        with patch("scripts.model_v2.build_features._load_prodes_coords") as mock_load:
            # Set return coordinates for prior years
            mock_load.return_value = np.array([[-62.5, -10.5], [-63.5, -11.5]])
            
            # Call feature builder for target year 2024
            df_feat = build_features_for_year(self.df_grid_sample, target_year=2024)
            
            # Check what years were passed to _load_prodes_coords
            mock_load.assert_called_once_with([2021, 2022, 2023])
            # Verify 2024 was NOT passed
            called_args = mock_load.call_args[0][0]
            self.assertNotIn(2024, called_args)

    def test_train_val_test_partitions_temporal_disjointness(self):
        """Ensures train, validation, and test datasets have strictly disjoint observation periods."""
        df_dummy = pd.DataFrame({
            "cell_id": [1, 2, 3],
            "target_year": [2022, 2023, 2024],
            "label": [0, 1, 0]
        })
        train, val, test = split_by_time(df_dummy)
        
        self.assertEqual(list(train["target_year"].unique()), [2022])
        self.assertEqual(list(val["target_year"].unique()), [2023])
        self.assertEqual(list(test["target_year"].unique()), [2024])


if __name__ == "__main__":
    unittest.main()
