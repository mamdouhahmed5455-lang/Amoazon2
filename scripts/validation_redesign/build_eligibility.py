"""
Eligibility mask construction module.
Filters candidate geographic coordinates using official INPE state boundary and no_forest polygons.
"""

import json
from pathlib import Path
from typing import List, Tuple
import numpy as np
from shapely.geometry import Point, shape
from shapely.strtree import STRtree
from shapely.validation import make_valid

from .config import RONDONIA_BOUNDARY_PATH, RONDONIA_NO_FOREST_PATH


def load_eligibility_engine() -> Tuple[Any, STRtree]:
    """
    Loads Rondônia state boundary polygon and builds an STRtree index over no_forest polygons.
    """
    # 1. Load sovereign state boundary
    with open(RONDONIA_BOUNDARY_PATH, "r", encoding="utf-8") as f:
        boundary_data = json.load(f)
    ro_geom = make_valid(shape(boundary_data["features"][0]["geometry"]))

    # 2. Load no_forest exclusion polygons
    with open(RONDONIA_NO_FOREST_PATH, "r", encoding="utf-8") as f:
        no_forest_data = json.load(f)
    
    no_forest_geoms = [make_valid(shape(feat["geometry"])) for feat in no_forest_data["features"]]
    no_forest_tree = STRtree(no_forest_geoms)

    return ro_geom, no_forest_tree


def filter_eligible_points(points: List[Point], ro_geom, no_forest_tree: STRtree) -> np.ndarray:
    """
    Tests points against Rondônia boundary (must be inside) and no_forest (must NOT be inside).
    Returns boolean array where True indicates eligible primary forest territory.
    """
    is_eligible = np.zeros(len(points), dtype=bool)

    # Fast boundary check
    inside_ro_indices = [i for i, pt in enumerate(points) if ro_geom.contains(pt)]
    
    if not inside_ro_indices:
        return is_eligible

    inside_points = [points[i] for i in inside_ro_indices]
    
    # Check no_forest intersection on points inside RO
    no_forest_matches = no_forest_tree.query(inside_points, predicate="intersects")
    points_in_no_forest = set(no_forest_matches[0])  # indices into inside_points

    for local_idx, global_idx in enumerate(inside_ro_indices):
        if local_idx not in points_in_no_forest:
            is_eligible[global_idx] = True

    return is_eligible
