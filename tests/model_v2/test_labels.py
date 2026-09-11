"""
Automated unit tests for Model V2 ground-truth labels integrity.
TEST FIXTURE -- VERIFIES LABEL ASSIGNMENT
"""

import unittest
import numpy as np
import pandas as pd

from scripts.model_v2.config import OUTPUT_LABELS_PARQUET, OUTPUT_LABELS_CSV_GZ


class TestModelV2Labels(unittest.TestCase):
    """Verifies label values, binary integrity, and annual prevalence counts."""

    @classmethod
    def setUpClass(cls):
        """Loads labels artifact."""
        if OUTPUT_LABELS_PARQUET.exists():
            cls.df = pd.read_parquet(OUTPUT_LABELS_PARQUET)
        elif OUTPUT_LABELS_CSV_GZ.exists():
            cls.df = pd.read_csv(OUTPUT_LABELS_CSV_GZ)
        else:
            raise FileNotFoundError("Model V2 labels artifact not found.")

    def test_labels_strictly_binary(self):
        """Ensures labels contain ONLY integers {0, 1}."""
        unique_vals = set(self.df["label"].unique())
        self.assertTrue(unique_vals.issubset({0, 1}))
        self.assertEqual(self.df["label"].isna().sum(), 0)

    def test_annual_positive_counts(self):
        """Verifies positive event counts per year match PRODES ground-truth."""
        counts = self.df.groupby("target_year")["label"].sum().to_dict()
        self.assertIn(2022, counts)
        self.assertIn(2023, counts)
        self.assertIn(2024, counts)

        # 2022: 41 positives
        self.assertEqual(counts[2022], 41)
        # 2023: 23 positives
        self.assertEqual(counts[2023], 23)
        # 2024: 10 positives
        self.assertEqual(counts[2024], 10)

    def test_prevalence_sparsity(self):
        """Ensures annual positive event prevalence reflects rare-event physical reality (< 1.0%)."""
        for yr, group in self.df.groupby("target_year"):
            prev = group["label"].mean()
            self.assertGreater(prev, 0.001, f"Prevalence too low in {yr}")
            self.assertLess(prev, 0.01, f"Prevalence too high for primary forest in {yr}")


if __name__ == "__main__":
    unittest.main()
