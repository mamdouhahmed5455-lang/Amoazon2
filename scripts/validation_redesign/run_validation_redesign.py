"""
Master execution script for Phase 5D: Validation Design Correction & Full-Coverage Ground Truth.
Run with: python scripts/validation_redesign/run_validation_redesign.py
"""

import sys
import json
import datetime
from pathlib import Path

# Add project root to sys.path
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from scripts.validation_redesign.config import (
    EXPERIMENT_ID,
    EXPERIMENT_NAME,
    ARTIFACTS_DIR,
    OUTPUT_MANIFEST_PATH,
    OUTPUT_VALIDATION_DATASET_CSV_GZ
)
from scripts.validation_redesign.acquire_data import verify_all_external_sources
from scripts.validation_redesign.generate_ground_truth import assign_prodes_ground_truth
from scripts.validation_redesign.evaluate_scores import evaluate_redesigned_validation


def run_full_redesigned_validation() -> dict:
    """Orchestrates the Phase 5D redesigned validation pipeline."""
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)

    print("\n" + "=" * 75)
    print(f"  {EXPERIMENT_NAME}")
    print(f"  ID: {EXPERIMENT_ID}")
    print("=" * 75 + "\n")

    # Step 1: Verify all external sources
    print("[1/5] Verifying authoritative INPE boundary, no_forest, and PRODES sources...")
    sources = verify_all_external_sources()
    for name, s in sources.items():
        print(f"      Verified {name:20s}: {s['size_bytes']:8,d} bytes | SHA-256: {s['sha256'][:16]}...")

    # Step 2: Build neutral validation population & assign ground truth
    print("\n[2/5] Building neutral full-coverage lattice & applying eligibility mask...")
    df_val, audit_gt = assign_prodes_ground_truth()
    print(f"      Total eligible primary forest cells: {audit_gt['validation_cells_total']:,}")
    print(f"      2024 Observed Clear-Cuts: {audit_gt['positives_2024']} ({audit_gt['prevalence_2024_pct']}%)")
    print(f"      Recent 2023-2024 Clear-Cuts: {audit_gt['positives_recent']} ({audit_gt['prevalence_recent_pct']}%)")
    print(f"      Confirmed Intact Forest Baseline: {audit_gt['negatives_intact_forest_2024']:,} cells")

    # Step 3: Evaluate model risk score vs baselines (PRODES 2024)
    print("\n[3/5] Evaluating existing risk score against PRODES 2024 observations...")
    eval_2024 = evaluate_redesigned_validation(df_val, label_col="prodes_label_2024")
    print(f"      Model ROC-AUC: {eval_2024['model_performance']['roc_auc']}")
    print(f"      Baseline Random AUC: {eval_2024['baseline_comparison']['baseline_random_auc']}")
    print(f"      Baseline Latitude AUC: {eval_2024['baseline_comparison']['baseline_latitude_heuristic_auc']}")
    print(f"      Top 5% Priority Tier Lift: {eval_2024['top_k_operational_tiers'][1]['lift_over_base']}x base prevalence")

    # Step 4: Evaluate model risk score vs baselines (Recent Combined 2023-2024)
    print("\n[4/5] Evaluating existing risk score against Recent Combined 2023-2024...")
    eval_recent = evaluate_redesigned_validation(df_val, label_col="prodes_label_recent")
    print(f"      Model ROC-AUC: {eval_recent['model_performance']['roc_auc']}")
    print(f"      Baseline Random AUC: {eval_recent['baseline_comparison']['baseline_random_auc']}")
    print(f"      Top 5% Priority Tier Lift: {eval_recent['top_k_operational_tiers'][1]['lift_over_base']}x base prevalence")
    print(f"      Spatial Holdout South ROC-AUC: {eval_recent['spatial_holdout']['southern_sector']['roc_auc']}")

    # Step 5: Serialize manifest
    print("\n[5/5] Serializing validation manifest...")
    manifest = {
        "experiment_id": EXPERIMENT_ID,
        "experiment_name": EXPERIMENT_NAME,
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "methodology": {
            "validation_type": "Retrospective Spatial Association Validation",
            "eligibility_mask": "INPE TerraBrasilis sovereign boundary + no_forest natural exclusions",
            "sampling_method": "Neutral systematic geographic lattice",
            "score_transfer": "Spatial nearest-neighbor within modeled frontier; zero baseline in deep forest"
        },
        "sources": sources,
        "population_audit": audit_gt,
        "evaluation_2024": eval_2024,
        "evaluation_recent": eval_recent,
        "status": "PHASE_5D_REDESIGNED_VALIDATION_COMPLETE"
    }

    with open(OUTPUT_MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    print(f"      Manifest written to: {OUTPUT_MANIFEST_PATH}")
    print("\n" + "=" * 75)
    print("  Phase 5D Redesigned Validation Completed Successfully.")
    print("=" * 75 + "\n")

    return manifest


if __name__ == "__main__":
    run_full_redesigned_validation()
