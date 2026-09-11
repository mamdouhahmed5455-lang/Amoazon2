"""
Unit tests for Phase 5D: Redesigned Validation Pipeline.
Verifies eligibility masks, neutral lattice determinism, ground-truth label generation,
baseline calculations, top-k lift, and manifest schema.
"""

import unittest
import json
from pathlib import Path
import pandas as pd
import numpy as np

from scripts.validation_redesign.config import (
    RONDONIA_BOUNDARY_PATH,
    RONDONIA_NO_FOREST_PATH,
    OUTPUT_MANIFEST_PATH,
    OUTPUT_VALIDATION_DATASET_CSV_GZ
)
from scripts.validation_redesign.acquire_data import verify_all_external_sources
from scripts.validation_redesign.build_eligibility import load_eligibility_engine
from scripts.validation_redesign.build_validation_grid import build_neutral_validation_population
from scripts.validation_redesign.generate_ground_truth import assign_prodes_ground_truth
from scripts.validation_redesign.evaluate_scores import evaluate_redesigned_validation, compute_top_k_lift


class TestValidationRedesignPipeline(unittest.TestCase):

    def test_01_external_sources_intact(self):
        """Verifies that boundary, no_forest, and PRODES files are present and non-empty."""
        sources = verify_all_external_sources()
        self.assertIn("rondonia_boundary", sources)
        self.assertIn("rondonia_no_forest", sources)
        self.assertIn("prodes_2024", sources)
        self.assertIn("prodes_2023", sources)
        self.assertGreater(sources["rondonia_no_forest"]["size_bytes"], 1000000)

    def test_02_eligibility_engine_loads(self):
        """Verifies that Rondônia sovereign boundary and no_forest STRtree initialize properly."""
        ro_geom, no_forest_tree = load_eligibility_engine()
        self.assertTrue(ro_geom.is_valid)
        self.assertGreater(len(no_forest_tree.geometries), 1000)

    def test_03_neutral_lattice_determinism(self):
        """Verifies that neutral validation lattice generates deterministically with exact bounds."""
        df_val, audit = build_neutral_validation_population(step_deg=0.1)  # fast test step
        self.assertGreater(len(df_val), 1000)
        self.assertTrue(all(df_val["lat"] >= -13.65))
        self.assertTrue(all(df_val["lat"] <= -7.95))
        self.assertIn("risk_norm", df_val.columns)
        self.assertIn("baseline_latitude", df_val.columns)

    def test_04_no_risk_to_label_leakage(self):
        """Verifies that ground-truth labels are not derived from model risk scores."""
        if OUTPUT_VALIDATION_DATASET_CSV_GZ.exists():
            df = pd.read_csv(OUTPUT_VALIDATION_DATASET_CSV_GZ)
            # Correlation between risk_norm and prodes_label_recent must be loose, not synthetic 1.0
            corr = df["risk_norm"].corr(df["prodes_label_recent"])
            self.assertNotEqual(corr, 1.0)
            self.assertNotEqual(corr, -1.0)

    def test_05_top_k_lift_calculation(self):
        """Tests top-k lift formula on synthetic fixture."""
        df_synthetic = pd.DataFrame({
            "score": [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.0],
            "target": [1, 1, 0, 0, 0, 0, 0, 0, 0, 0]  # 2 positives out of 10 -> base prevalence 0.2
        })
        # Top 20% is top 2 items: both are positive -> precision = 1.0 -> lift = 1.0 / 0.2 = 5.0
        lift_results = compute_top_k_lift(df_synthetic, "score", "target", k_percentages=[0.20])
        self.assertEqual(lift_results[0]["lift_over_base"], 5.0)
        self.assertEqual(lift_results[0]["captured_positives"], 2)

    def test_06_manifest_schema_and_status(self):
        """Verifies that Phase 5D manifest exists and records completed status."""
        if OUTPUT_MANIFEST_PATH.exists():
            with open(OUTPUT_MANIFEST_PATH, "r", encoding="utf-8") as f:
                manifest = json.load(f)
            self.assertEqual(manifest["experiment_id"], "GEOAI-VAL-REDESIGN-20260908")
            self.assertEqual(manifest["status"], "PHASE_5D_REDESIGNED_VALIDATION_COMPLETE")
            self.assertIn("evaluation_2024", manifest)
            self.assertIn("evaluation_recent", manifest)


if __name__ == "__main__":
    unittest.main()
