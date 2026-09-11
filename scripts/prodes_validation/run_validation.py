"""
Master runner for Phase 5C: Official PRODES Ground-Truth Integration & Real Spatial Validation.
Executes: python scripts/prodes_validation/run_validation.py
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

from scripts.prodes_validation.config import (
    EXPERIMENT_ID,
    EXPERIMENT_NAME,
    ARTIFACTS_DIR,
    PRODUCTION_GRID_PATH,
    PRODES_2024_PATH,
    PRODES_2023_PATH,
    OUTPUT_MANIFEST_PATH,
    CHECKSUMS
)
from scripts.prodes_validation.acquire_prodes import ensure_prodes_sources, compute_sha256
from scripts.prodes_validation.inspect_prodes import inspect_prodes_file
from scripts.prodes_validation.generate_labels import generate_and_save_labels
from scripts.prodes_validation.evaluate_predictions import evaluate_prodes_alignment


def run_full_validation() -> dict:
    """Orchestrates the complete official PRODES spatial validation experiment."""
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)

    print("\n" + "=" * 70)
    print(f"  {EXPERIMENT_NAME}")
    print(f"  ID: {EXPERIMENT_ID}")
    print("=" * 70 + "\n")

    # Step 1: Verify source files and checksums
    print("[1/6] Verifying data sources and cryptographic hashes...")
    sources = ensure_prodes_sources()
    grid_sha = compute_sha256(PRODUCTION_GRID_PATH)
    print(f"      Production Grid SHA-256: {grid_sha}")
    print(f"      PRODES 2024 SHA-256: {sources[2024]['sha256']}")
    print(f"      PRODES 2023 SHA-256: {sources[2023]['sha256']}")

    # Step 2: Inspect CRS and topological validity
    print("\n[2/6] Inspecting official PRODES schema and geometry validity...")
    schema_2024 = inspect_prodes_file(PRODES_2024_PATH)
    print(f"      PRODES 2024: {schema_2024['feature_count']} polygons | CRS: {schema_2024['crs']}")
    print(f"      Topological Validity: {schema_2024['validity_percentage']}% | Total Mapped Loss: {schema_2024['total_prodes_area_km']} km²")

    # Step 3: Execute spatial join and generate labels
    print("\n[3/6] Executing Point-in-Polygon spatial join on 150,000 cells...")
    df_labels, join_audit = generate_and_save_labels()
    print(f"      Join completed in: {join_audit['join_execution_seconds']}s")
    print(f"      2024 Intersections: {join_audit['cells_intersecting_2024']} cells ({join_audit['prevalence_2024_pct']}%)")
    print(f"      Recent Intersections: {join_audit['cells_intersecting_recent']} cells ({join_audit['prevalence_recent_pct']}%)")

    # Step 4: Evaluate predictions against PRODES ground truth
    print("\n[4/6] Evaluating existing risk predictions against PRODES observations...")
    eval_2024 = evaluate_prodes_alignment(df_labels, label_col="prodes_label_2024")
    eval_recent = evaluate_prodes_alignment(df_labels, label_col="prodes_label_recent")

    print(f"      [PRODES 2024] ROC-AUC: {eval_2024['metrics']['roc_auc']} | PR-AUC: {eval_2024['metrics']['pr_auc']}")
    print(f"      [Recent 23-24] ROC-AUC: {eval_recent['metrics']['roc_auc']} | PR-AUC: {eval_recent['metrics']['pr_auc']}")
    print(f"      [Spatial Holdout North] ROC-AUC: {eval_2024['spatial_holdout']['northern_sector']['roc_auc']}")
    print(f"      [Spatial Holdout South] ROC-AUC: {eval_2024['spatial_holdout']['southern_sector']['roc_auc']}")

    # Step 5: Construct and serialize validation manifest
    print("\n[5/6] Writing validation manifest...")
    manifest = {
        "experiment_id": EXPERIMENT_ID,
        "experiment_name": EXPERIMENT_NAME,
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "ground_truth_source": {
            "institution": "INPE / TerraBrasilis",
            "layer": "prodes-legal-amz:yearly_deforestation",
            "crs": schema_2024["crs"],
            "sha256_2024": sources[2024]["sha256"],
            "sha256_2023": sources[2023]["sha256"],
            "polygons_2024": schema_2024["feature_count"]
        },
        "grid": {
            "file": "data/forest_data_clean.json",
            "sha256": grid_sha,
            "rows": len(df_labels)
        },
        "spatial_join_audit": join_audit,
        "evaluation_2024": eval_2024,
        "evaluation_recent": eval_recent,
        "status": "VALIDATED_AGAINST_OFFICIAL_PRODES"
    }

    with open(OUTPUT_MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    print(f"      Manifest saved to: {OUTPUT_MANIFEST_PATH}")

    # Step 6: Print executive summary
    print("\n[6/6] Validation Experiment Execution Finished.")
    print("=" * 70 + "\n")
    return manifest


if __name__ == "__main__":
    run_full_validation()
