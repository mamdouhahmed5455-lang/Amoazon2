"""
Source data integrity and verification module for Model V2.
"""

import hashlib
from pathlib import Path
from typing import Dict, Any

from .config import (
    RONDONIA_BOUNDARY_PATH,
    RONDONIA_NO_FOREST_PATH,
    PRODES_2021_PATH,
    PRODES_2022_PATH,
    PRODES_2023_PATH,
    PRODES_2024_PATH,
    HIGHWAYS_PATH,
    IBGE_POP_PATH
)


def compute_sha256(filepath: Path) -> str:
    """Computes SHA-256 hash of a file."""
    hasher = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()


def verify_model_v2_sources() -> Dict[str, Dict[str, Any]]:
    """Verifies that all required raw data sources are present and hashes them."""
    sources = {
        "rondonia_boundary": RONDONIA_BOUNDARY_PATH,
        "rondonia_no_forest": RONDONIA_NO_FOREST_PATH,
        "prodes_2021": PRODES_2021_PATH,
        "prodes_2022": PRODES_2022_PATH,
        "prodes_2023": PRODES_2023_PATH,
        "prodes_2024": PRODES_2024_PATH,
        "highways": HIGHWAYS_PATH,
        "ibge_pop": IBGE_POP_PATH
    }

    manifest = {}
    for name, path in sources.items():
        if not path.exists():
            raise FileNotFoundError(f"Missing required authoritative dataset: {path}")
        manifest[name] = {
            "path": str(path),
            "size_bytes": path.stat().st_size,
            "sha256": compute_sha256(path)
        }
    return manifest


if __name__ == "__main__":
    sources = verify_model_v2_sources()
    print("Verified sources count:", len(sources))
    for k, v in sources.items():
        print(f" - {k:20s}: {v['size_bytes']:8,d} bytes | {v['sha256'][:16]}...")
