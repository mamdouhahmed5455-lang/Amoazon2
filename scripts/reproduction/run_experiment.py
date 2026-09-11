"""
Master execution script for the Independent Model Reproduction & Validation Experiment.
Run with: python scripts/reproduction/run_experiment.py
"""

import sys
import json
import argparse
import datetime
import platform
from pathlib import Path

# Add project root to sys.path
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from scripts.reproduction.config import (
    EXPERIMENT_ID,
    EXPERIMENT_NAME,
    EXPERIMENT_TYPE,
    ARTIFACTS_DIR,
    BENCHMARK_METRICS,
    BENCHMARK_SHAP_IMPORTANCE
)
from scripts.reproduction.load_data import load_and_verify_dataset
from scripts.reproduction.prepare_features import audit_features
from scripts.reproduction.prepare_labels import audit_target_labels, get_ground_truth_labels, TargetReconstructionBlockedException
from scripts.reproduction.split_data import split_random, split_spatial_holdout
from scripts.reproduction.train_model import train_reproduction_model
from scripts.reproduction.evaluate_model import evaluate_predictions


def run_experiment(run_fixture_test: bool = False) -> dict:
    """Executes the reproduction experiment pipeline."""
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    
    print("\n" + "=" * 70)
    print(f"  {EXPERIMENT_NAME}")
    print(f"  ID: {EXPERIMENT_ID}")
    print("=" * 70 + "\n")

    # Step 1: Load and verify dataset
    print("[1/5] Loading and verifying production dataset...")
    df, data_meta = load_and_verify_dataset()
    print(f"      Loaded {data_meta['row_count']:,} cells from {Path(data_meta['file_path']).name}")
    print(f"      Dataset SHA-256: {data_meta['sha256']}")
    print(f"      Spatial Envelope: Lat {data_meta['lat_range']}, Lon {data_meta['lon_range']}")

    # Step 2: Audit features
    print("\n[2/5] Auditing feature dimensions against 12-feature training schema...")
    feature_audit = audit_features(df)
    print(f"      Documented training features: {feature_audit['documented_training_features_count']}")
    print(f"      Raw raster features stored in repo: {feature_audit['raw_raster_features_status']}")
    print(f"      Elevation column is physical meters: {feature_audit['elevation_column_is_physical_meters']}")
    print(f"      Elevation derivation: {feature_audit['elevation_column_derivation']}")

    # Step 3: Audit target labels
    print("\n[3/5] Auditing ground-truth target labels (y in {0, 1})...")
    label_audit = audit_target_labels(df)

    manifest = {
        "experiment_id": EXPERIMENT_ID,
        "experiment_name": EXPERIMENT_NAME,
        "experiment_type": EXPERIMENT_TYPE,
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "environment": {
            "python_version": platform.python_version(),
            "platform": platform.platform()
        },
        "dataset": data_meta,
        "features": feature_audit,
        "target_audit": label_audit,
        "benchmark_comparison": {
            "canonical_benchmark_metrics": BENCHMARK_METRICS,
            "canonical_shap_importance": BENCHMARK_SHAP_IMPORTANCE
        },
        "status": "COMPLETED_AUDIT_HALTED_ON_TARGET"
    }

    if label_audit["blocked"] and not run_fixture_test:
        print("\n" + "!" * 70)
        print("  [SCIENTIFIC GUARD ACTIVATED] TARGET RECONSTRUCTION BLOCKED")
        print("!" * 70)
        print(f"  Reason: {label_audit['reason']}")
        print(f"  Remediation Required: {label_audit['remediation_required']}")
        print("  In accordance with Step 4 & Step 19, training pipeline is safely halted.")
        print("  See: docs/reproduction-experiment/TARGET_RECONSTRUCTION_BLOCKED.md")
        print("!" * 70 + "\n")
        
        manifest["reproduction_status"] = "BLOCKED_ABSENT_GROUND_TRUTH"
        manifest_path = ARTIFACTS_DIR / "experiment_manifest.json"
        with open(manifest_path, "w", encoding="utf-8") as f:
            json.dump(manifest, f, indent=2)
        print(f"[5/5] Manifest written to: {manifest_path}")
        return manifest

    # If run_fixture_test is True, execute synthetic test harness to verify code execution
    print("\n[4/5] Executing Test Fixture Harness (Software Verification Only)...")
    y = get_ground_truth_labels(df, allow_synthetic_test_fixture=True)
    X = df[["lat", "lon"]].copy()

    # Track A: Random Split
    X_train, X_test, split_meta = split_random(X)
    y_train = y.iloc[X_train.index]
    y_test = y.iloc[X_test.index]

    model, train_meta = train_reproduction_model(X_train, y_train)
    y_prob = model.predict_proba(X_test)[:, 1]
    eval_results = evaluate_predictions(y_test, y_prob)

    print(f"      [Test Fixture] Evaluated {len(y_test):,} holdout samples")
    print(f"      [Test Fixture] ROC-AUC: {eval_results['metrics']['roc_auc']}")
    print(f"      [Test Fixture] F1 Score: {eval_results['metrics']['f1']}")

    manifest["reproduction_status"] = "TEST_FIXTURE_VERIFIED"
    manifest["test_fixture_evaluation"] = eval_results
    manifest["test_fixture_training"] = train_meta

    manifest_path = ARTIFACTS_DIR / "experiment_manifest.json"
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    print(f"[5/5] Manifest written to: {manifest_path}")

    return manifest


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="GeoAI Model Reproduction Experiment")
    parser.add_argument("--fixture-test", action="store_true", help="Run synthetic unit-test fixture to verify pipeline code execution")
    args = parser.parse_args()
    
    run_experiment(run_fixture_test=args.fixture_test)
