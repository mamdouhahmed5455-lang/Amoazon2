"""
Automated unit tests for Model V2 temporal and spatial partition integrity and disjointness.
TEST FIXTURE -- VERIFIES DATA SPLITS
"""

import unittest
import pandas as pd
import numpy as np

from scripts.model_v2.split_temporal import split_by_time
from scripts.model_v2.split_spatial import split_north_south, assign_spatial_quadrants
from scripts.model_v2.config import SPATIAL_HOLDOUT_LATITUDE, OUTPUT_FEATURES_PARQUET


class TestModelV2Splits(unittest.TestCase):
    """Verifies disjointness of temporal partitions and geographic spatial blocks."""

    def test_temporal_split_disjointness(self):
        """Ensures temporal partitions share zero target observations."""
        df_dummy = pd.DataFrame({
            "cell_id": range(6),
            "target_year": [2022, 2022, 2023, 2023, 2024, 2024],
            "label": [0, 1, 0, 0, 1, 0]
        })
        train, val, test = split_by_time(df_dummy)
        self.assertEqual(len(train), 2)
        self.assertEqual(len(val), 2)
        self.assertEqual(len(test), 2)

        s_train = set(train["target_year"])
        s_val = set(val["target_year"])
        s_test = set(test["target_year"])

        self.assertTrue(s_train.isdisjoint(s_val))
        self.assertTrue(s_train.isdisjoint(s_test))
        self.assertTrue(s_val.isdisjoint(s_test))

    def test_spatial_split_disjointness(self):
        """Ensures North and South spatial partitions share zero cells."""
        df_dummy = pd.DataFrame({
            "cell_id": [1, 2, 3, 4],
            "lat": [-9.5, -10.2, -11.5, -12.8],
            "lon": [-62.0, -62.5, -63.0, -63.5]
        })
        north, south = split_north_south(df_dummy, lat_cutoff=-11.0)
        self.assertEqual(len(north), 2)
        self.assertEqual(len(south), 2)

        self.assertTrue(all(north["lat"] > -11.0))
        self.assertTrue(all(south["lat"] <= -11.0))
        self.assertTrue(set(north["cell_id"]).isdisjoint(set(south["cell_id"])))

    def test_spatial_quadrants_mutually_exclusive(self):
        """Ensures 4-quadrant assignment covers all cells with zero overlap."""
        df_dummy = pd.DataFrame({
            "cell_id": [1, 2, 3, 4],
            "lat": [-9.0, -9.0, -12.0, -12.0],
            "lon": [-64.0, -61.0, -64.0, -61.0]
        })
        df_q = assign_spatial_quadrants(df_dummy, lat_center=-11.0, lon_center=-63.0)
        self.assertEqual(list(df_q["spatial_quadrant"]), ["NW", "NE", "SW", "SE"])


if __name__ == "__main__":
    unittest.main()
