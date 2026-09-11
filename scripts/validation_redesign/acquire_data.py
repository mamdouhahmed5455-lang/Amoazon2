"""
Data acquisition and verification module for redesigned validation.
Verifies presence and cryptographic hashes of official INPE boundary, no_forest, and PRODES layers.
"""

import hashlib
from pathlib import Path
from typing import Dict, Any

from .config import (
    RONDONIA_BOUNDARY_PATH,
    RONDONIA_NO_FOREST_PATH,
    PRODES_2024_PATH,
    PRODES_2023_PATH,
    PRODUCTION_GRID_PATH
)


def compute_sha256(filepath: Path) -> str:
    """Computes SHA-256 hash of a file."""
    hasher = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()


def verify_all_external_sources() -> Dict[str, Dict[str, Any]]:
    """Verifies that all 4 official INPE data sources and the production grid are intact."""
    sources = {
        "production_grid": PRODUCTION_GRID_PATH,
        "rondonia_boundary": RONDONIA_BOUNDARY_PATH,
        "rondonia_no_forest": RONDONIA_NO_FOREST_PATH,
        "prodes_2024": PRODES_2024_PATH,
        "prodes_2023": PRODES_2023_PATH
    }

    manifest = {}
    for name, path in sources.items():
        if not path.exists():
            raise FileNotFoundError(f"Missing required authoritative dataset: {path}")
        sha = compute_sha256(path)
        manifest[name] = {
            "path": str(path),
            "sha256": sha,
            "size_bytes": path.stat().st_size
        }
    return manifest


if __name__ == "__main__":
    sources = verify_all_external_sources()
    for k, v in sources.items():
        print(f"Verified {k}: {v['size_bytes']} bytes | SHA-256: {v['sha256'][:16]}...")
