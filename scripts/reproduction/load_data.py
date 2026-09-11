"""
Data loading and integrity verification module.
Loads data/forest_data_clean.json, computes SHA-256 hash, and verifies integrity.
"""

import json
import hashlib
import pandas as pd
from pathlib import Path
from typing import Tuple, Dict, Any

from .config import PRODUCTION_DATASET_PATH


def compute_file_sha256(filepath: Path) -> str:
    """Computes SHA-256 hash of a file."""
    hasher = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()


def load_and_verify_dataset(filepath: Path = PRODUCTION_DATASET_PATH) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Loads production dataset and computes forensic verification statistics.
    
    Returns:
        df: pandas DataFrame containing records
        metadata: dictionary of forensic summary statistics
    """
    if not filepath.exists():
        raise FileNotFoundError(f"Production dataset not found at: {filepath}")

    sha256_hash = compute_file_sha256(filepath)

    with open(filepath, "r", encoding="utf-8") as f:
        records = json.load(f)

    df = pd.DataFrame(records)

    metadata = {
        "file_path": str(filepath),
        "sha256": sha256_hash,
        "row_count": len(df),
        "columns": list(df.columns),
        "null_counts": df.isnull().sum().to_dict(),
        "lat_range": (float(df["lat"].min()), float(df["lat"].max())),
        "lon_range": (float(df["lon"].min()), float(df["lon"].max())),
        "risk_score_range": (int(df["risk_score"].min()), int(df["risk_score"].max())),
        "risk_norm_range": (float(df["risk_norm"].min()), float(df["risk_norm"].max())),
        "elevation_range": (float(df["elevation"].min()), float(df["elevation"].max()))
    }

    # Verify zero missing values
    assert df.isnull().sum().sum() == 0, "Dataset contains unexpected null values"
    assert len(df) == 150000, f"Expected 150,000 rows, got {len(df)}"

    return df, metadata


if __name__ == "__main__":
    df, meta = load_and_verify_dataset()
    print(f"Loaded {meta['row_count']} rows. SHA-256: {meta['sha256']}")
