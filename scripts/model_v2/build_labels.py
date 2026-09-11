"""
Ground-truth label assignment module for Model V2.
Builds PRODES binary labels for each spatial cell and target year.
Zero future leakage: target year polygons used ONLY for label, never for features.
"""

import json
from pathlib import Path
from typing import Dict, Any
import numpy as np
import pandas as pd
from shapely.geometry import Point, shape
from shapely.strtree import STRtree
from shapely.validation import make_valid

from .config import PRODES_2021_PATH, PRODES_2022_PATH, PRODES_2023_PATH, PRODES_2024_PATH


PRODES_FILES = {
    2021: PRODES_2021_PATH,
    2022: PRODES_2022_PATH,
    2023: PRODES_2023_PATH,
    2024: PRODES_2024_PATH,
}


def build_labels_for_year(df_grid: pd.DataFrame, target_year: int) -> pd.Series:
    """
    Creates binary deforestation labels from official INPE PRODES observations.

    y_i = 1 iff cell centroid intersects a PRODES clear-cut polygon for target_year.
    y_i = 0 iff no intersection (eligible forest-domain unit with no mapped PRODES deforestation during target_year).

    IMPORTANT: The target year's PRODES data is used ONLY to create labels,
               never as a feature input. This is enforced by module separation.
    """
    prodes_path = PRODES_FILES.get(target_year)
    if not prodes_path or not prodes_path.exists():
        raise FileNotFoundError(f"PRODES data for year {target_year} not found: {prodes_path}")

    with open(prodes_path, "r", encoding="utf-8") as f:
        prodes_data = json.load(f)

    polys = [make_valid(shape(feat["geometry"])) for feat in prodes_data["features"]]
    tree = STRtree(polys)

    cell_pts = [Point(lon, lat) for lon, lat in zip(df_grid["lon"], df_grid["lat"])]
    matches = tree.query(cell_pts, predicate="intersects")
    
    labels = np.zeros(len(df_grid), dtype=np.int8)
    if len(matches) > 0:
        labels[matches[0]] = 1

    positives = int(labels.sum())
    print(f"    Labels for {target_year}: {positives} positives / {len(labels)} cells ({positives/len(labels)*100:.4f}%)")
    return pd.Series(labels, name="label", index=df_grid.index)


if __name__ == "__main__":
    from .build_grid import build_model_v2_grid
    df_grid, _ = build_model_v2_grid()
    for yr in [2022, 2023, 2024]:
        labels = build_labels_for_year(df_grid, yr)
        print(f"Year {yr}: {labels.sum()} positives")
