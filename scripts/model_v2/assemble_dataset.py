"""
Dataset assembly module for Model V2.
Combines features and labels for training, validation, and test years.
Exports versioned CSV artifacts with full provenance metadata.
"""

import json
import hashlib
import datetime
from pathlib import Path
from typing import Dict, Any, Tuple
import numpy as np
import pandas as pd

from .config import (
    ARTIFACTS_DIR, OUTPUT_FEATURES_CSV_GZ, OUTPUT_FEATURES_PARQUET,
    OUTPUT_LABELS_CSV_GZ, OUTPUT_LABELS_PARQUET,
    OUTPUT_DATASET_MANIFEST, FEATURE_COLS, EXPERIMENT_ID, RANDOM_SEED
)
from .build_grid import build_model_v2_grid
from .build_features import build_features_for_year
from .build_labels import build_labels_for_year


def assemble_full_dataset() -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Builds the complete multi-year panel dataset for Model V2.
    Returns assembled DataFrame with features, labels, and metadata.
    """
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)

    print("[1/4] Building neutral validation grid...")
    df_grid, grid_meta = build_model_v2_grid()
    print(f"      Grid: {len(df_grid)} eligible primary forest cells")

    # Temporal partitions:
    # Training:   Features from ≤2021, Labels from 2022
    # Validation: Features from ≤2022, Labels from 2023
    # Test:       Features from ≤2023, Labels from 2024
    SPLITS = [
        {"target_year": 2022, "split": "train"},
        {"target_year": 2023, "split": "val"},
        {"target_year": 2024, "split": "test"},
    ]

    all_panels = []
    label_stats = {}

    print("[2/4] Building features and labels per temporal partition...")
    for sp in SPLITS:
        yr = sp["target_year"]
        split_name = sp["split"]
        print(f"\n  === {split_name.upper()} SPLIT (target_year={yr}) ===")

        df_feat = build_features_for_year(df_grid, target_year=yr)
        labels = build_labels_for_year(df_grid, target_year=yr)

        df_panel = df_feat.copy()
        df_panel["label"] = labels.values
        df_panel["split"] = split_name
        all_panels.append(df_panel)

        label_stats[yr] = {
            "split": split_name,
            "total_cells": len(labels),
            "positives": int(labels.sum()),
            "negatives": int((labels == 0).sum()),
            "prevalence_pct": round(float(labels.mean()) * 100, 4)
        }

    print("\n[3/4] Concatenating panel dataset...")
    df_full = pd.concat(all_panels, ignore_index=True)

    print("[4/4] Exporting artifacts (Parquet + compressed CSV)...")
    features_export = df_full[["cell_id", "lat", "lon", "target_year", "split"] + FEATURE_COLS]
    labels_export = df_full[["cell_id", "lat", "lon", "target_year", "split", "label"]]

    features_export.to_csv(OUTPUT_FEATURES_CSV_GZ, compression="gzip", index=False)
    labels_export.to_csv(OUTPUT_LABELS_CSV_GZ, compression="gzip", index=False)
    features_export.to_parquet(OUTPUT_FEATURES_PARQUET, index=False)
    labels_export.to_parquet(OUTPUT_LABELS_PARQUET, index=False)

    def _file_hash(p: Path) -> str:
        h = hashlib.sha256()
        with open(p, "rb") as f:
            while chunk := f.read(65536):
                h.update(chunk)
        return h.hexdigest()

    manifest = {
        "experiment_id": EXPERIMENT_ID,
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "crs": "EPSG:4674 / EPSG:4326",
        "grid_metadata": grid_meta,
        "temporal_design": {
            "train": "Features <= 2021 -> Labels 2022",
            "val":   "Features <= 2022 -> Labels 2023",
            "test":  "Features <= 2023 -> Labels 2024"
        },
        "label_statistics": label_stats,
        "feature_groups_count": 4,
        "feature_columns": FEATURE_COLS,
        "total_panel_rows": len(df_full),
        "artifacts": {
            "features_parquet": {"path": str(OUTPUT_FEATURES_PARQUET), "sha256": _file_hash(OUTPUT_FEATURES_PARQUET)},
            "features_csv_gz":  {"path": str(OUTPUT_FEATURES_CSV_GZ),  "sha256": _file_hash(OUTPUT_FEATURES_CSV_GZ)},
            "labels_parquet":   {"path": str(OUTPUT_LABELS_PARQUET),   "sha256": _file_hash(OUTPUT_LABELS_PARQUET)},
            "labels_csv_gz":    {"path": str(OUTPUT_LABELS_CSV_GZ),    "sha256": _file_hash(OUTPUT_LABELS_CSV_GZ)}
        }
    }

    with open(OUTPUT_DATASET_MANIFEST, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    print(f"\nDataset assembled: {len(df_full)} total panel rows across 3 years.")
    print(f"Positive events: Train={label_stats[2022]['positives']} Val={label_stats[2023]['positives']} Test={label_stats[2024]['positives']}")
    return df_full, manifest


if __name__ == "__main__":
    df, manifest = assemble_full_dataset()
    print("\nDataset manifest:", manifest["label_statistics"])
