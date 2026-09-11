"""
Configuration module for the Phase 5D Redesigned Validation Experiment.
Defines paths, grid generation parameters, and official source registries.
"""

from pathlib import Path

# Paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
DATA_DIR = PROJECT_ROOT / "data"
EXTERNAL_PRODES_DIR = DATA_DIR / "external" / "prodes"
EXTERNAL_VAL_DIR = DATA_DIR / "external" / "prodes-validation"
ARTIFACTS_DIR = PROJECT_ROOT / "artifacts" / "validation-redesign"
DOCS_DIR = PROJECT_ROOT / "docs" / "validation-redesign"

# Source Data Files
PRODUCTION_GRID_PATH = DATA_DIR / "forest_data_clean.json"
PRODES_2024_PATH = EXTERNAL_PRODES_DIR / "prodes_ro_2024.geojson"
PRODES_2023_PATH = EXTERNAL_PRODES_DIR / "prodes_ro_2023.geojson"
RONDONIA_BOUNDARY_PATH = EXTERNAL_VAL_DIR / "rondonia_boundary.geojson"
RONDONIA_NO_FOREST_PATH = EXTERNAL_VAL_DIR / "rondonia_no_forest.geojson"

# Output Files
OUTPUT_VALIDATION_DATASET_CSV_GZ = ARTIFACTS_DIR / "redesigned_validation_population.csv.gz"
OUTPUT_VALIDATION_DATASET_CSV = ARTIFACTS_DIR / "redesigned_validation_population.csv"
OUTPUT_MANIFEST_PATH = ARTIFACTS_DIR / "validation_manifest.json"

# Official TerraBrasilis WFS Base
TERRABRASILIS_WFS_BASE = "http://terrabrasilis.dpi.inpe.br/geoserver/wfs"

# Experiment Metadata
EXPERIMENT_ID = "GEOAI-VAL-REDESIGN-20260908"
EXPERIMENT_NAME = "Full-Coverage Rondônia Validation & Baseline Benchmarking"

# Grid Sampling Parameters
# Generates a systematic geographic lattice across Rondônia
LATTICE_STEP_DEGREES = 0.05  # ~5.5 km spacing yielding a balanced territorial sample (~8,000 cells)
RANDOM_SEED = 42

# Spatial Holdout Boundary
SPATIAL_HOLDOUT_LATITUDE = -11.0
