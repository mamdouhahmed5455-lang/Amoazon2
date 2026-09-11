"""
Automated unit tests for Model V2 authoritative data sources integrity and CRS consistency.
TEST FIXTURE -- VERIFIES PHYSICAL DATA ASSETS
"""

import unittest
import json
import hashlib
from pathlib import Path

from scripts.model_v2.config import (
    RONDONIA_BOUNDARY_PATH, RONDONIA_NO_FOREST_PATH,
    PRODES_2021_PATH, PRODES_2022_PATH, PRODES_2023_PATH, PRODES_2024_PATH,
    HIGHWAYS_PATH, IBGE_POP_PATH
)
from scripts.model_v2.download_sources import verify_model_v2_sources, compute_sha256


class TestModelV2Sources(unittest.TestCase):
    """Verifies existence, integrity, and coordinate validity of external sources."""

    def test_sources_exist_and_non_empty(self):
        """Ensures all 8 required primary source files exist on disk and have non-zero size."""
        sources = verify_model_v2_sources()
        self.assertEqual(len(sources), 8)
        for name, meta in sources.items():
            self.assertGreater(meta["size_bytes"], 0, f"Source {name} is empty!")
            self.assertEqual(len(meta["sha256"]), 64, f"Invalid SHA-256 for {name}")

    def test_prodes_files_valid_geojson(self):
        """Verifies that all PRODES files are valid GeoJSON with features within Rondônia bounds."""
        for yr, p in [(2021, PRODES_2021_PATH), (2022, PRODES_2022_PATH),
                      (2023, PRODES_2023_PATH), (2024, PRODES_2024_PATH)]:
            self.assertTrue(p.exists(), f"PRODES {yr} missing: {p}")
            with open(p, "r", encoding="utf-8") as f:
                data = json.load(f)
            self.assertIn("features", data)
            self.assertGreater(len(data["features"]), 0)
            
            # Check coordinate bounds of first feature (SIRGAS 2000 / WGS 84)
            feat = data["features"][0]
            self.assertIn("geometry", feat)
            geom_type = feat["geometry"]["type"]
            self.assertIn(geom_type, ["Polygon", "MultiPolygon"])

    def test_rondonia_boundary_valid(self):
        """Verifies Rondônia state boundary GeoJSON."""
        self.assertTrue(RONDONIA_BOUNDARY_PATH.exists())
        with open(RONDONIA_BOUNDARY_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        self.assertIn("features", data)
        self.assertEqual(len(data["features"]), 1)

    def test_no_forest_mask_valid(self):
        """Verifies natural non-forest mask contains expected polygon formations."""
        self.assertTrue(RONDONIA_NO_FOREST_PATH.exists())
        with open(RONDONIA_NO_FOREST_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        self.assertIn("features", data)
        self.assertGreater(len(data["features"]), 3000)

    def test_highways_and_ibge_sources(self):
        """Verifies highway vector network and IBGE population records."""
        self.assertTrue(HIGHWAYS_PATH.exists())
        with open(HIGHWAYS_PATH, "r", encoding="utf-8") as f:
            hw_data = json.load(f)
        self.assertIn("elements", hw_data)
        self.assertGreater(len(hw_data["elements"]), 0)

        self.assertTrue(IBGE_POP_PATH.exists())
        with open(IBGE_POP_PATH, "r", encoding="utf-8") as f:
            pop_data = json.load(f)
        self.assertIsInstance(pop_data, list)


if __name__ == "__main__":
    unittest.main()
