"""
Neutral validation lattice generator and risk-score transfer module.
Constructs full-coverage validation grid over eligible Rondônia forest and maps existing risk scores.
"""

import json
from pathlib import Path
from typing import Tuple, Dict, Any
import numpy as np
import pandas as pd
from shapely.geometry import Point
from scipy.spatial import cKDTree

from .config import PRODUCTION_GRID_PATH, LATTICE_STEP_DEGREES
from .build_eligibility import load_eligibility_engine, filter_eligible_points


def build_neutral_validation_population(step_deg: float = LATTICE_STEP_DEGREES) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Constructs a neutral systematic validation lattice across Rondônia,
    filters by official INPE eligibility masks, and attaches prediction scores.
    """
    # 1. Bounding Box for Rondônia
    lat_min, lat_max = -13.65, -7.95
    lon_min, lon_max = -66.75, -59.85

    lats = np.arange(lat_min, lat_max, step_deg)
    lons = np.arange(lon_min, lon_max, step_deg)
    grid_lons, grid_lats = np.meshgrid(lons, lats)
    flat_lons = grid_lons.ravel()
    flat_lats = grid_lats.ravel()
    total_candidate_points = len(flat_lons)

    points = [Point(lon, lat) for lon, lat in zip(flat_lons, flat_lats)]

    # 2. Filter by Eligibility Mask (Inside RO and NOT in no_forest)
    ro_geom, no_forest_tree = load_eligibility_engine()
    eligible_mask = filter_eligible_points(points, ro_geom, no_forest_tree)

    eligible_lons = flat_lons[eligible_mask]
    eligible_lats = flat_lats[eligible_mask]
    total_eligible_points = len(eligible_lons)

    df_val = pd.DataFrame({
        "val_cell_id": np.arange(total_eligible_points, dtype=np.int32),
        "lat": eligible_lats,
        "lon": eligible_lons
    })

    # 3. Load Production Grid and Build KDTree
    with open(PRODUCTION_GRID_PATH, "r", encoding="utf-8") as f:
        prod_data = json.load(f)
    df_prod = pd.DataFrame(prod_data)

    prod_coords = np.column_stack([df_prod["lon"].to_numpy(), df_prod["lat"].to_numpy()])
    kdtree = cKDTree(prod_coords)

    val_coords = np.column_stack([df_val["lon"].to_numpy(), df_val["lat"].to_numpy()])
    distances, indices = kdtree.query(val_coords, k=1)

    # 4. Score Transfer Protocol (Threshold at ~3.5 km / 0.035 degrees)
    MAX_SUPPORT_DIST_DEG = 0.035
    in_support_mask = distances <= MAX_SUPPORT_DIST_DEG

    # Points within modeled support inherit model risk_norm
    # Points in deep unmodeled primary forest inherit true baseline intact forest risk (0.0)
    inherited_risk_norm = np.zeros(len(df_val), dtype=np.float64)
    inherited_risk_norm[in_support_mask] = df_prod["risk_norm"].iloc[indices[in_support_mask]].to_numpy()

    df_val["risk_norm"] = inherited_risk_norm
    df_val["distance_to_model_km"] = distances * 111.0  # approximate km conversion
    df_val["in_modeled_frontier"] = in_support_mask

    # 5. Attach Baseline Signals
    # Baseline 3: Pure Latitude Corridor Heuristic (higher score in the north)
    df_val["baseline_latitude"] = (df_val["lat"] - lat_min) / (lat_max - lat_min)

    # Baseline 1 & 2: Random / Uniform
    np.random.seed(42)
    df_val["baseline_random"] = np.random.uniform(0.0, 1.0, len(df_val))
    df_val["baseline_uniform"] = 0.50

    audit = {
        "candidate_lattice_points": total_candidate_points,
        "eligible_primary_forest_points": total_eligible_points,
        "points_in_modeled_frontier": int(in_support_mask.sum()),
        "points_in_deep_forest_baseline": int((~in_support_mask).sum()),
        "lattice_step_degrees": step_deg,
        "coverage_fraction": round(total_eligible_points / total_candidate_points, 4)
    }

    return df_val, audit


if __name__ == "__main__":
    df_val, audit = build_neutral_validation_population()
    print("Neutral validation population created:", audit)
