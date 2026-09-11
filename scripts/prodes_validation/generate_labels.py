"""
Ground-truth label generation module.
Executes spatial join and exports deterministic, auditable label datasets to artifacts/prodes-validation/.
"""

from pathlib import Path
from typing import Tuple, Dict, Any
import pandas as pd

from .config import (
    ARTIFACTS_DIR,
    OUTPUT_LABELS_PARQUET,
    OUTPUT_LABELS_CSV,
    PRODUCTION_GRID_PATH,
    PRODES_2024_PATH,
    PRODES_2023_PATH,
    CHECKSUMS
)
from .spatial_join import execute_spatial_join


def generate_and_save_labels() -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Executes spatial join between 150,000 grid centroids and official PRODES geometries,
    and writes the versioned label tables to artifacts/prodes-validation/.
    """
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)

    df_joined, audit = execute_spatial_join(
        grid_path=PRODUCTION_GRID_PATH,
        prodes_2024_path=PRODES_2024_PATH,
        prodes_2023_path=PRODES_2023_PATH
    )

    # Prepare minimal, auditable output table
    columns_to_export = [
        "cell_id",
        "lat",
        "lon",
        "risk_score",
        "risk_norm",
        "prodes_label_2024",
        "prodes_label_recent"
    ]
    export_df = df_joined[columns_to_export].copy()

    # Save to compressed CSV (standard, robust, zero-dependency)
    compressed_csv = ARTIFACTS_DIR / "prodes_cell_labels.csv.gz"
    export_df.to_csv(compressed_csv, compression="gzip", index=False)
    print(f"Exported compressed labels to: {compressed_csv}")

    # Also save standard CSV
    export_df.to_csv(OUTPUT_LABELS_CSV, index=False)
    print(f"Exported full labels to CSV: {OUTPUT_LABELS_CSV}")

    return export_df, audit


if __name__ == "__main__":
    df, audit = generate_and_save_labels()
    print("Label generation complete:", audit)
