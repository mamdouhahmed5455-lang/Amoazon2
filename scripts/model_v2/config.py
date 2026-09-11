"""
Configuration module for Validated XGBoost Model V2.
Declares paths, hyperparameter specifications, feature definitions, and random seeds.
"""

from pathlib import Path

# Paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
DATA_DIR = PROJECT_ROOT / "data"
EXTERNAL_PRODES_DIR = DATA_DIR / "external" / "prodes"
EXTERNAL_VAL_DIR = DATA_DIR / "external" / "prodes-validation"
EXTERNAL_ROADS_DIR = DATA_DIR / "external" / "roads"
EXTERNAL_IBGE_DIR = DATA_DIR / "external" / "ibge"
ARTIFACTS_DIR = PROJECT_ROOT / "artifacts" / "model-v2"
SHAP_DIR = ARTIFACTS_DIR / "shap"
DOCS_DIR = PROJECT_ROOT / "docs" / "model-v2"

# Source Files
RONDONIA_BOUNDARY_PATH = EXTERNAL_VAL_DIR / "rondonia_boundary.geojson"
RONDONIA_NO_FOREST_PATH = EXTERNAL_VAL_DIR / "rondonia_no_forest.geojson"
PRODES_2021_PATH = EXTERNAL_PRODES_DIR / "prodes_ro_2021.geojson"
PRODES_2022_PATH = EXTERNAL_PRODES_DIR / "prodes_ro_2022.geojson"
PRODES_2023_PATH = EXTERNAL_PRODES_DIR / "prodes_ro_2023.geojson"
PRODES_2024_PATH = EXTERNAL_PRODES_DIR / "prodes_ro_2024.geojson"
HIGHWAYS_PATH = EXTERNAL_ROADS_DIR / "rondonia_federal_highways.json"
IBGE_POP_PATH = EXTERNAL_IBGE_DIR / "rondonia_ibge_2022_pop.json"

# Artifacts Output
OUTPUT_FEATURES_CSV_GZ = ARTIFACTS_DIR / "features.csv.gz"
OUTPUT_FEATURES_PARQUET = ARTIFACTS_DIR / "features.parquet"
OUTPUT_LABELS_CSV_GZ = ARTIFACTS_DIR / "labels.csv.gz"
OUTPUT_LABELS_PARQUET = ARTIFACTS_DIR / "labels.parquet"
OUTPUT_MODEL_JSON = ARTIFACTS_DIR / "model_v2.json"
OUTPUT_DATASET_MANIFEST = ARTIFACTS_DIR / "dataset_manifest.json"
OUTPUT_MODEL_MANIFEST = ARTIFACTS_DIR / "model_manifest.json"

# Experiment Identifiers
EXPERIMENT_ID = "GEOAI-MODEL-V2-20260908"
MODEL_VERSION = "2.0.0-validated"
RANDOM_SEED = 42

# Spatial Framework
LATTICE_STEP_DEGREES = 0.05  # ~5.5 km spacing yielding 7,045 eligible forest units
SPATIAL_HOLDOUT_LATITUDE = -11.0

# Feature Names (Minimum 4 Groups)
FEATURE_COLS = [
    "dist_road_km",       # Group A: Road Proximity
    "dist_hist_loss_km",  # Group B: Historical Forest Loss Distance
    "prior_loss_dens",    # Group B: Historical Forest Loss Density
    "pop_pressure",       # Group C: Population / Settlement Pressure
    "elevation_m"         # Group D: Physical Elevation
]

# Baseline Conservative XGBoost Hyperparameters
XGB_HYPERPARAMS = {
    "objective": "binary:logistic",
    "eval_metric": "auc",
    "max_depth": 4,
    "learning_rate": 0.05,
    "n_estimators": 150,
    "subsample": 0.8,
    "colsample_bytree": 0.8,
    "scale_pos_weight": 10.0,  # accounts for rare event class imbalance
    "random_state": RANDOM_SEED,
    "tree_method": "hist"
}
