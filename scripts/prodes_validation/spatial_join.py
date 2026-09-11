"""
High-performance spatial join module.
Performs Point-in-Polygon (PiP) evaluation of 150,000 grid centroids against PRODES polygons using Shapely STRtree.
"""

import json
import time
from pathlib import Path
from typing import Tuple, Dict, Any, List
import pandas as pd
import numpy as np
from shapely.geometry import Point, shape
from shapely.strtree import STRtree

from .config import PRODUCTION_GRID_PATH, PRODES_2024_PATH, PRODES_2023_PATH


def execute_spatial_join(
    grid_path: Path = PRODUCTION_GRID_PATH,
    prodes_2024_path: Path = PRODES_2024_PATH,
    prodes_2023_path: Path = PRODES_2023_PATH
) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Executes C/GEOS-accelerated point-in-polygon spatial join between 150,000 grid centroids
    and official INPE PRODES deforestation polygons.
    """
    start_time = time.time()

    # 1. Load Grid Points
    with open(grid_path, "r", encoding="utf-8") as f:
        grid_data = json.load(f)

    df = pd.DataFrame(grid_data)
    df["cell_id"] = np.arange(len(df), dtype=np.int32)
    
    # Create Shapely Point objects
    # Note: Shapely Point takes (x, y) = (lon, lat)
    points = [Point(lon, lat) for lon, lat in zip(df["lon"], df["lat"])]

    # 2. Load 2024 PRODES Polygons
    with open(prodes_2024_path, "r", encoding="utf-8") as f:
        prodes_2024_data = json.load(f)

    polygons_2024 = [shape(feat["geometry"]) for feat in prodes_2024_data["features"]]
    poly_areas_2024 = [feat["properties"].get("area_km", 0.0) for feat in prodes_2024_data["features"]]

    # 3. Build Spatial Index & Query 2024
    tree_2024 = STRtree(polygons_2024)
    # query returns integer indices: (point_indices, polygon_indices)
    point_idx_2024, poly_idx_2024 = tree_2024.query(points, predicate="intersects")
    
    # Map to binary array
    is_deforested_2024 = np.zeros(len(df), dtype=np.int8)
    is_deforested_2024[point_idx_2024] = 1
    df["prodes_label_2024"] = is_deforested_2024

    # 4. Load 2023 PRODES Polygons (if available) for Joint Period Analysis
    polygons_2023 = []
    if prodes_2023_path.exists():
        with open(prodes_2023_path, "r", encoding="utf-8") as f:
            prodes_2023_data = json.load(f)
        polygons_2023 = [shape(feat["geometry"]) for feat in prodes_2023_data["features"]]

    all_polygons_recent = polygons_2024 + polygons_2023
    tree_recent = STRtree(all_polygons_recent)
    point_idx_recent, _ = tree_recent.query(points, predicate="intersects")

    is_deforested_recent = np.zeros(len(df), dtype=np.int8)
    is_deforested_recent[point_idx_recent] = 1
    df["prodes_label_recent"] = is_deforested_recent

    elapsed_time = time.time() - start_time

    audit_summary = {
        "total_cells_evaluated": len(df),
        "prodes_2024_polygon_count": len(polygons_2024),
        "prodes_2023_polygon_count": len(polygons_2023),
        "cells_intersecting_2024": int(is_deforested_2024.sum()),
        "prevalence_2024_pct": round((is_deforested_2024.sum() / len(df)) * 100, 3),
        "cells_intersecting_recent": int(is_deforested_recent.sum()),
        "prevalence_recent_pct": round((is_deforested_recent.sum() / len(df)) * 100, 3),
        "join_execution_seconds": round(elapsed_time, 2)
    }

    return df, audit_summary


if __name__ == "__main__":
    df_joined, audit = execute_spatial_join()
    print("Spatial Join Summary:", audit)
