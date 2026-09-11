"""
Data partitioning module supporting both Random Split (Track A) and Spatial Holdout (Track B).
Ensures deterministic, reproducible data partitioning.
"""

import pandas as pd
import numpy as np
from typing import Tuple, Dict, Any

from .config import EXPERIMENT_SEED, SPATIAL_SPLIT_LATITUDE_THRESHOLD


def split_random(df: pd.DataFrame, test_size: float = 0.2, seed: int = EXPERIMENT_SEED) -> Tuple[pd.DataFrame, pd.DataFrame, Dict[str, Any]]:
    """
    Track A: Deterministic Random Split.
    Partitions dataset using a specified random seed.
    """
    np.random.seed(seed)
    shuffled_indices = np.random.permutation(len(df))
    test_count = int(len(df) * test_size)
    
    test_idx = shuffled_indices[:test_count]
    train_idx = shuffled_indices[test_count:]

    train_df = df.iloc[train_idx].copy()
    test_df = df.iloc[test_idx].copy()

    metadata = {
        "split_type": "random_split_track_a",
        "random_seed": seed,
        "train_rows": len(train_df),
        "test_rows": len(test_df),
        "test_fraction": test_size
    }

    return train_df, test_df, metadata


def split_spatial_holdout(df: pd.DataFrame, lat_threshold: float = SPATIAL_SPLIT_LATITUDE_THRESHOLD) -> Tuple[pd.DataFrame, pd.DataFrame, Dict[str, Any]]:
    """
    Track B: Spatial Block Holdout.
    Partitions dataset along a geographic latitude line (Northern Sector vs. Southern Sector)
    to eliminate spatial autocorrelation leakage.
    """
    # North sector (lat > threshold), South sector (lat <= threshold)
    train_df = df[df["lat"] <= lat_threshold].copy()
    test_df = df[df["lat"] > lat_threshold].copy()

    metadata = {
        "split_type": "spatial_holdout_track_b",
        "latitude_boundary": lat_threshold,
        "train_rows": len(train_df),
        "test_rows": len(test_df),
        "train_lat_range": (float(train_df["lat"].min()), float(train_df["lat"].max())),
        "test_lat_range": (float(test_df["lat"].min()), float(test_df["lat"].max()))
    }

    return train_df, test_df, metadata
