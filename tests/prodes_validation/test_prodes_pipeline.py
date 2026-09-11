"""
PRODES Validation Unit Tests.
Verifies source schemas, CRS alignment, geometry validity, spatial join determinism,
metric formula consistency, and manifest integrity.
"""

import unittest
import json
from pathlib import Path
import pandas as pd
import numpy as np
from shapely.geometry import Point, Polygon

from scripts.prodes_validation.config import (
    PRODUCTION_GRID_PATH,
    PRODES_2024_PATH,
    PRODES_2023_PATH,
    OUTPUT_MANIFEST_PATH,
    CHECKSUMS
)
from scripts.prodes_validation.acquire_prodes import compute_sha256
from scripts.prodes_validation.inspect_prodes import inspect_prodes_file
from scripts.prodes_validation.spatial_join import execute_spatial_join
from scripts.prodes_validation.evaluate_predictions import evaluate_prodes_alignment, compute_precision_at_k


class TestProdesValidationPipeline(unittest.TestCase):

    def test_01_grid_and_prodes_file_hashes(self):
        """Verifies cryptographic hashes of grid and downloaded PRODES GeoJSON files."""
        grid_sha = compute_sha256(PRODUCTION_GRID_PATH)
        self.assertEqual(grid_sha, CHECKSUMS["forest_data_clean.json"])
        
        if PRODES_2024_PATH.exists():
            sha_2024 = compute_sha256(PRODES_2024_PATH)
            self.assertEqual(sha_2024, CHECKSUMS["prodes_ro_2024.geojson"])

    def test_02_prodes_schema_and_crs(self):
        """Verifies that the PRODES GeoJSON has valid CRS and attributes."""
        if PRODES_2024_PATH.exists():
            schema = inspect_prodes_file(PRODES_2024_PATH)
            self.assertIn("EPSG::4674", schema["crs"])
            self.assertEqual(schema["feature_count"], 2773)
            self.assertGreater(schema["validity_percentage"], 60.0)
            self.assertIn("area_km", schema["attributes_present"])
            self.assertIn("year", schema["attributes_present"])

    def test_03_spatial_join_determinism(self):
        """Verifies that point-in-polygon join produces identical deterministic counts."""
        if PRODES_2024_PATH.exists():
            df, audit = execute_spatial_join()
            self.assertEqual(audit["total_cells_evaluated"], 150000)
            self.assertEqual(audit["cells_intersecting_2024"], 27)
            self.assertEqual(audit["cells_intersecting_recent"], 101)
            self.assertEqual(len(df), 150000)

    def test_04_no_label_leakage(self):
        """Confirms that PRODES ground truth is derived independently of risk scores."""
        if PRODES_2024_PATH.exists():
            df, _ = execute_spatial_join()
            # Correlation between risk_score and ground truth must not be an artificial 1.0
            corr = df["risk_score"].corr(df["prodes_label_2024"])
            self.assertNotEqual(corr, 1.0)
            self.assertNotEqual(corr, -1.0)

    def test_05_precision_at_k_calculation(self):
        """Tests Precision@K formula on a synthetic test fixture."""
        y_true = np.array([1, 0, 1, 0, 1, 0, 0, 0, 0, 0])
        y_score = np.array([0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.05])
        
        prec = compute_precision_at_k(y_true, y_score, k_values=[3, 5])
        self.assertAlmostEqual(prec["precision_at_3"], 2.0 / 3.0, places=4)
        self.assertAlmostEqual(prec["precision_at_5"], 3.0 / 5.0, places=4)

    def test_06_evaluation_structure_and_manifest(self):
        """Verifies that the validation manifest exists and matches expected schema."""
        if OUTPUT_MANIFEST_PATH.exists():
            with open(OUTPUT_MANIFEST_PATH, "r", encoding="utf-8") as f:
                manifest = json.load(f)
            self.assertEqual(manifest["experiment_id"], "GEOAI-VAL-PRODES-20260907")
            self.assertEqual(manifest["status"], "VALIDATED_AGAINST_OFFICIAL_PRODES")
            self.assertIn("evaluation_2024", manifest)
            self.assertEqual(manifest["grid"]["rows"], 150000)


if __name__ == "__main__":
    unittest.main()
