"""
Configuration for PRODES Ground-Truth Validation Pipeline.
Declares paths, official TerraBrasilis URLs, dataset checksums, and parameters.
"""

from pathlib import Path

# Paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
DATA_DIR = PROJECT_ROOT / "data"
EXTERNAL_PRODES_DIR = DATA_DIR / "external" / "prodes"
ARTIFACTS_DIR = PROJECT_ROOT / "artifacts" / "prodes-validation"
FIGURES_DIR = ARTIFACTS_DIR / "figures"
DOCS_DIR = PROJECT_ROOT / "docs" / "prodes-validation"

# Source Files
PRODUCTION_GRID_PATH = DATA_DIR / "forest_data_clean.json"
PRODES_2024_PATH = EXTERNAL_PRODES_DIR / "prodes_ro_2024.geojson"
PRODES_2023_PATH = EXTERNAL_PRODES_DIR / "prodes_ro_2023.geojson"

# Outputs
OUTPUT_LABELS_PARQUET = ARTIFACTS_DIR / "prodes_cell_labels.parquet"
OUTPUT_LABELS_CSV = ARTIFACTS_DIR / "prodes_cell_labels.csv"
OUTPUT_MANIFEST_PATH = ARTIFACTS_DIR / "validation_manifest.json"

# Official TerraBrasilis WFS URLs
TERRABRASILIS_WFS_BASE = "http://terrabrasilis.dpi.inpe.br/geoserver/wfs"
PRODES_LAYER_NAME = "prodes-legal-amz:yearly_deforestation"

# Known Verified Checksums
CHECKSUMS = {
    "forest_data_clean.json": "858b0ab2a2dccb104a87b1d935e72cf0678f235d1c83185edc3af247d310147e",
    "prodes_ro_2024.geojson": "aca4f29791332b27edbee9993f3cedb744cbf609241788b88cf4aacb8982443c",
    "prodes_ro_2023.geojson": "fc35febac4a31b7b4d6a4e9fa9d8e637fb63a3e4d4873305e1011e8079eeca3a"
}

# Experiment Metadata
EXPERIMENT_ID = "GEOAI-VAL-PRODES-20260907"
EXPERIMENT_NAME = "Official INPE PRODES Deforestation Spatial Validation"

# Spatial Holdout Boundary (Degrees Latitude)
# Splits Rondônia into Northern Development Corridor and Southern Forest Reserve
SPATIAL_HOLDOUT_LATITUDE = -11.0
