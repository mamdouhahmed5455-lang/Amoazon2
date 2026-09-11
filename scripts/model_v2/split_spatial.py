"""
Spatial splitting module for Model V2.
Provides geographically separated block partitions to evaluate spatial generalization:
- North vs South Partition (Latitude = -11.0 deg)
- 4-Quadrant Spatial Blocking (NW, NE, SW, SE)
"""

from typing import Tuple, Dict, Any
import numpy as np
import pandas as pd

from .config import SPATIAL_HOLDOUT_LATITUDE


def split_north_south(df: pd.DataFrame, lat_cutoff: float = SPATIAL_HOLDOUT_LATITUDE) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """
    Partitions DataFrame into North (lat > lat_cutoff) and South (lat <= lat_cutoff) regions.
    Northern region encompasses the active agricultural frontier along BR-364 and Porto Velho.
    Southern region encompasses the established agricultural interior and Guaporé basin.
    """
    north_mask = df["lat"] > lat_cutoff
    df_north = df[north_mask].copy().reset_index(drop=True)
    df_south = df[~north_mask].copy().reset_index(drop=True)

    # Disjointness check
    assert len(set(df_north["cell_id"]).intersection(set(df_south["cell_id"]))) == 0, "Spatial leakage between North and South!"

    return df_north, df_south


def assign_spatial_quadrants(df: pd.DataFrame, lat_center: float = -11.0, lon_center: float = -63.0) -> pd.DataFrame:
    """
    Assigns each cell to one of 4 geographic quadrants:
    - NW: North of -11.0, West of -63.0
    - NE: North of -11.0, East of -63.0
    - SW: South of -11.0, West of -63.0
    - SE: South of -11.0, East of -63.0
    """
    df = df.copy()
    conditions = [
        (df["lat"] > lat_center) & (df["lon"] <= lon_center),
        (df["lat"] > lat_center) & (df["lon"] > lon_center),
        (df["lat"] <= lat_center) & (df["lon"] <= lon_center),
        (df["lat"] <= lat_center) & (df["lon"] > lon_center)
    ]
    choices = ["NW", "NE", "SW", "SE"]
    df["spatial_quadrant"] = np.select(conditions, choices, default="UNKNOWN")
    return df


def summarize_spatial_distribution(df: pd.DataFrame) -> Dict[str, Any]:
    """Summarizes sample counts and positive event prevalence across spatial blocks."""
    summary = {}
    if "spatial_quadrant" not in df.columns:
        df = assign_spatial_quadrants(df)

    for q in ["NW", "NE", "SW", "SE"]:
        sub = df[df["spatial_quadrant"] == q]
        pos = int(sub["label"].sum()) if "label" in sub.columns else None
        summary[q] = {
            "cell_count": len(sub),
            "positives": pos,
            "prevalence_pct": round(pos / len(sub) * 100, 4) if pos is not None and len(sub) > 0 else None
        }
    return summary
