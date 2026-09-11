"""
Acquisition module for official INPE TerraBrasilis PRODES deforestation layers.
Downloads WFS GeoJSON products for Rondônia if not already present.
"""

import urllib.request
import urllib.parse
import hashlib
from pathlib import Path
from typing import Dict, Any

from .config import (
    EXTERNAL_PRODES_DIR,
    PRODES_2024_PATH,
    PRODES_2023_PATH,
    TERRABRASILIS_WFS_BASE,
    PRODES_LAYER_NAME,
    CHECKSUMS
)


def compute_sha256(filepath: Path) -> str:
    """Computes SHA-256 hash of a file."""
    hasher = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()


def download_prodes_year(year: int, output_path: Path) -> Dict[str, Any]:
    """Downloads official PRODES deforestation polygons for Rondônia for a specific year."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    if output_path.exists():
        sha = compute_sha256(output_path)
        return {
            "year": year,
            "status": "ALREADY_EXISTS",
            "path": str(output_path),
            "sha256": sha,
            "size_bytes": output_path.stat().st_size
        }

    cql_filter = f"state='RO' AND year={year}"
    params = {
        "service": "WFS",
        "version": "2.0.0",
        "request": "GetFeature",
        "typeName": PRODES_LAYER_NAME,
        "outputFormat": "application/json",
        "cql_filter": cql_filter
    }
    query_string = urllib.parse.urlencode(params)
    url = f"{TERRABRASILIS_WFS_BASE}?{query_string}"

    print(f"Downloading official PRODES {year} data for Rondônia from TerraBrasilis...")
    req = urllib.request.Request(url, headers={"User-Agent": "GeoAI-Research-Client/1.0"})
    with urllib.request.urlopen(req, timeout=120) as resp, open(output_path, "wb") as out_f:
        while chunk := resp.read(65536):
            out_f.write(chunk)

    sha = compute_sha256(output_path)
    return {
        "year": year,
        "status": "DOWNLOADED",
        "path": str(output_path),
        "sha256": sha,
        "size_bytes": output_path.stat().st_size
    }


def ensure_prodes_sources() -> Dict[int, Dict[str, Any]]:
    """Ensures that 2024 and 2023 PRODES sources are downloaded and available."""
    res_2024 = download_prodes_year(2024, PRODES_2024_PATH)
    res_2023 = download_prodes_year(2023, PRODES_2023_PATH)
    return {2024: res_2024, 2023: res_2023}


if __name__ == "__main__":
    results = ensure_prodes_sources()
    print(results)
