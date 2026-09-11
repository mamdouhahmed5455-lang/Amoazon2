"""
Feature preparation and audit module.
Audits available feature representations in the dataset and documents gaps against the 12 training features.
"""

import pandas as pd
from typing import Dict, Any


DOCUMENTED_TRAINING_FEATURES = [
    "Road Proximity",
    "Previous Forest Loss",
    "Population Pressure",
    "Elevation",
    "Slope",
    "River Distance",
    "Protected Area Status",
    "NDVI",
    "Soil Moisture",
    "Fire Frequency",
    "Logging Concessions",
    "Urban Proximity"
]


def audit_features(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Audits the input DataFrame against documented model training features.
    
    Identifies:
    1. Features present in the runtime dataset
    2. Missing raw raster features
    3. Derived visualization artifacts
    """
    present_cols = list(df.columns)
    
    audit_results = {
        "dataset_columns_present": present_cols,
        "empirical_spatial_features": ["lat", "lon"],
        "precomputed_model_outputs": ["risk_score", "risk_norm"],
        "visualization_artifacts": ["elevation", "color"],
        "documented_training_features_count": len(DOCUMENTED_TRAINING_FEATURES),
        "documented_training_features_present_in_file": 0,
        "raw_raster_features_status": "NOT STORED IN PRODUCTION REPOSITORY",
        "elevation_column_is_physical_meters": False,
        "elevation_column_derivation": "elevation = risk_norm * 4000"
    }

    # Verify elevation formula integrity
    max_dev = (df["elevation"] - (df["risk_norm"] * 4000)).abs().max()
    audit_results["elevation_formula_max_deviation"] = float(max_dev)

    return audit_results
