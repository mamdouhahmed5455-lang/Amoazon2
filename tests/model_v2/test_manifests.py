"""
Automated unit tests for Model V2 dataset and model manifest schema and cryptographic hash integrity.
TEST FIXTURE -- VERIFIES MANIFESTS
"""

import unittest
import json
import hashlib
from pathlib import Path

from scripts.model_v2.config import OUTPUT_DATASET_MANIFEST, OUTPUT_MODEL_MANIFEST


class TestModelV2Manifests(unittest.TestCase):
    """Verifies manifest schemas and cryptographic checksum consistency."""

    def test_dataset_manifest_schema_and_hashes(self):
        """Ensures dataset_manifest.json exists and its referenced artifact hashes match files on disk."""
        self.assertTrue(OUTPUT_DATASET_MANIFEST.exists(), "Dataset manifest missing!")
        with open(OUTPUT_DATASET_MANIFEST, "r", encoding="utf-8") as f:
            dm = json.load(f)

        self.assertIn("experiment_id", dm)
        self.assertIn("temporal_design", dm)
        self.assertIn("label_statistics", dm)
        self.assertIn("artifacts", dm)

        # Verify physical file hashes
        for art_name, art_info in dm["artifacts"].items():
            p = Path(art_info["path"])
            self.assertTrue(p.exists(), f"Artifact file missing: {p}")
            with open(p, "rb") as f:
                computed_hash = hashlib.sha256(f.read()).hexdigest()
            self.assertEqual(computed_hash, art_info["sha256"], f"Hash mismatch for {art_name}!")

    def test_model_manifest_schema_and_sections(self):
        """Ensures model_manifest.json contains complete experimental records."""
        self.assertTrue(OUTPUT_MODEL_MANIFEST.exists(), "Model manifest missing!")
        with open(OUTPUT_MODEL_MANIFEST, "r", encoding="utf-8") as f:
            mm = json.load(f)

        self.assertIn("model_version", mm)
        self.assertIn("experiment_id", mm)
        self.assertIn("environment", mm)
        self.assertIn("sources", mm)
        self.assertIn("hyperparameters", mm)
        self.assertIn("results", mm)
        self.assertIn("original_benchmark_preserved", mm)

        # Ensure original benchmark is preserved intact
        bench = mm["original_benchmark_preserved"]
        self.assertEqual(bench["roc_auc"], 0.82)
        self.assertEqual(bench["precision"], 0.79)
        self.assertEqual(bench["recall"], 0.84)
        self.assertEqual(bench["f1"], 0.81)


if __name__ == "__main__":
    unittest.main()
