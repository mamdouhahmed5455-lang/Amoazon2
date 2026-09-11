"""
Configuration module for the GeoAI reproduction experiment.
Defines explicit paths, experiment identifiers, random seeds, and benchmark constants.
"""

from pathlib import Path

# Base Paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
DATA_DIR = PROJECT_ROOT / "data"
ARTIFACTS_DIR = PROJECT_ROOT / "artifacts" / "reproduction"
DOCS_DIR = PROJECT_ROOT / "docs" / "reproduction-experiment"

# Production Data Files
PRODUCTION_DATASET_PATH = DATA_DIR / "forest_data_clean.json"
HISTORICAL_PRODES_PATH = DATA_DIR / "prodes_historical.json"

# Experiment Metadata
EXPERIMENT_ID = "GEOAI-REP-20260907-EXP01"
EXPERIMENT_NAME = "Independent Model Reproduction & Validation Experiment"
EXPERIMENT_TYPE = "independent_reconstruction"

# Locked Canonical Benchmark Metrics (Documented SSOT - DO NOT MODIFY)
BENCHMARK_METRICS = {
    "roc_auc": 0.82,
    "precision": 0.79,
    "recall": 0.84,
    "f1": 0.81,
    "accuracy": 0.9622,
    "threshold": 0.5,
    "total_cells": 150000,
    "confusion_matrix": {
        "true_positives": 12450,
        "false_negatives": 2380,
        "false_positives": 3290,
        "true_negatives": 131880
    }
}

# Locked Global Feature Importance Benchmarks (TreeSHAP)
BENCHMARK_SHAP_IMPORTANCE = {
    "Road Proximity": 0.41,
    "Forest Loss (Temporal)": 0.23,
    "Population Pressure": 0.21,
    "Elevation Constraints": 0.15
}

# Experiment Parameters (Assumptions for New Experiment)
EXPERIMENT_SEED = 42
DEFAULT_THRESHOLD = 0.5

# Spatial Holdout Split Parameters (Rondônia Bounding Box Partition)
SPATIAL_SPLIT_LATITUDE_THRESHOLD = -11.0  # Partitions Rondônia into North and South sectors
