"""
Neutral spatial unit grid generator for Model V2.
Generates systematic geographic lattice filtered by official INPE eligibility masks.
"""

import json
from pathlib import Path
from typing import Tuple, Dict, Any
import numpy as np
import pandas as pd
from shapely.geometry import Point, shape
from shapely.strtree import STRtree
from shapely.validation import make_valid

from .config import RONDONIA_BOUNDARY_PATH, RONDONIA_NO_FOREST_PATH, LATTICE_STEP_DEGREES


def build_model_v2_grid(step_deg: float = LATTICE_STEP_DEGREES) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Constructs the neutral 7,045-unit spatial grid across eligible primary forest in Rondônia.
    """
    # 1. Bounding box coordinates for Rondônia
    lat_min, lat_max = -13.65, -7.95
    lon_min, lon_max = -66.75, -59.85

    lats = np.arange(lat_min, lat_max, step_deg)
    lons = np.arange(lon_min, lon_max, step_deg)
    grid_lons, grid_lats = np.meshgrid(lons, lats)
    flat_lons = grid_lons.ravel()
    flat_lats = grid_lats.ravel()
    candidate_count = len(flat_lons)

    candidate_points = [Point(lon, lat) for lon, lat in zip(flat_lons, flat_lats)]

    # 2. Load Boundary & No-Forest Masks
    with open(RONDONIA_BOUNDARY_PATH, "r", encoding="utf-8") as f:
        boundary_data = json.load(f)
    ro_geom = make_valid(shape(boundary_data["features"][0]["geometry"]))

    with open(RONDONIA_NO_FOREST_PATH, "r", encoding="utf-8") as f:
        no_forest_data = json.load(f)
    no_forest_geoms = [make_valid(shape(feat["geometry"])) for feat in no_forest_data["features"]]
    no_forest_tree = STRtree(no_forest_geoms)

    # 3. Filter points inside Rondônia
    inside_ro_indices = [i for i, pt in enumerate(candidate_points) if ro_geom.contains(pt)]
    inside_ro_points = [candidate_points[i] for i in inside_ro_indices]

    # 4. Filter out natural non-forest
    no_forest_matches = no_forest_tree.query(inside_ro_points, predicate="intersects")
    in_no_forest_set = set(no_forest_matches[0])

    eligible_lons = []
    eligible_lats = []
    for local_idx, global_idx in enumerate(inside_ro_indices):
        if local_idx not in in_no_forest_set:
            eligible_lons.append(flat_lons[global_idx])
            eligible_lats.append(flat_lats[global_idx])

    df_grid = pd.DataFrame({
        "cell_id": np.arange(len(eligible_lons), dtype=np.int32),
        "lat": np.array(eligible_lats, dtype=np.float64),
        "lon": np.array(eligible_lons, dtype=np.float64)
    })

    metadata = {
        "candidate_lattice_points": candidate_count,
        "eligible_primary_forest_cells": len(df_grid),
        "lattice_step_degrees": step_deg,
        "lat_min": float(df_grid["lat"].min()),
        "lat_max": float(df_grid["lat"].max()),
        "lon_min": float(df_grid["lon"].min()),
        "lon_max": float(df_grid["lon"].max())
    }

    return df_grid, metadata


if __name__ == "__main__":
    df, meta = build_model_v2_grid()
    print("Model V2 Grid generated:", meta)
