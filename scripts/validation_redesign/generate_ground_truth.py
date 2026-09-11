"""
Ground-truth label assignment module for neutral validation population.
Executes point-in-polygon spatial join against official PRODES polygons and exports versioned dataset.
"""

import json
from pathlib import Path
from typing import Tuple, Dict, Any
import numpy as np
import pandas as pd
from shapely.geometry import Point, shape
from shapely.strtree import STRtree
from shapely.validation import make_valid

from .config import (
    PRODES_2024_PATH,
    PRODES_2023_PATH,
    OUTPUT_VALIDATION_DATASET_CSV_GZ,
    OUTPUT_VALIDATION_DATASET_CSV,
    ARTIFACTS_DIR
)
from .build_validation_grid import build_neutral_validation_population


def assign_prodes_ground_truth() -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Generates neutral validation population, joins against official PRODES deforestation polygons,
    and exports dataset to artifacts/validation-redesign/.
    """
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)

    # 1. Build neutral validation population
    df_val, grid_audit = build_neutral_validation_population()
    val_points = [Point(lon, lat) for lon, lat in zip(df_val["lon"], df_val["lat"])]

    # 2. Load and index PRODES 2024 Polygons
    with open(PRODES_2024_PATH, "r", encoding="utf-8") as f:
        prodes_2024_data = json.load(f)
    polys_2024 = [make_valid(shape(feat["geometry"])) for feat in prodes_2024_data["features"]]
    tree_2024 = STRtree(polys_2024)

    matches_2024 = tree_2024.query(val_points, predicate="intersects")
    label_2024 = np.zeros(len(df_val), dtype=np.int8)
    label_2024[matches_2024[0]] = 1
    df_val["prodes_label_2024"] = label_2024

    # 3. Load and index PRODES 2023 Polygons for Recent Window
    polys_recent = list(polys_2024)
    if PRODES_2023_PATH.exists():
        with open(PRODES_2023_PATH, "r", encoding="utf-8") as f:
            prodes_2023_data = json.load(f)
        polys_recent += [make_valid(shape(feat["geometry"])) for feat in prodes_2023_data["features"]]
    
    tree_recent = STRtree(polys_recent)
    matches_recent = tree_recent.query(val_points, predicate="intersects")
    label_recent = np.zeros(len(df_val), dtype=np.int8)
    label_recent[matches_recent[0]] = 1
    df_val["prodes_label_recent"] = label_recent

    # 4. Export Artifacts
    df_val.to_csv(OUTPUT_VALIDATION_DATASET_CSV_GZ, compression="gzip", index=False)
    df_val.to_csv(OUTPUT_VALIDATION_DATASET_CSV, index=False)

    audit = {
        "validation_cells_total": len(df_val),
        "positives_2024": int(label_2024.sum()),
        "prevalence_2024_pct": round((label_2024.sum() / len(df_val)) * 100, 4),
        "positives_recent": int(label_recent.sum()),
        "prevalence_recent_pct": round((label_recent.sum() / len(df_val)) * 100, 4),
        "negatives_intact_forest_2024": int((label_2024 == 0).sum()),
        "output_csv_gz": str(OUTPUT_VALIDATION_DATASET_CSV_GZ)
    }

    return df_val, audit


if __name__ == "__main__":
    df, audit = assign_prodes_ground_truth()
    print("Ground truth assigned successfully:", audit)
