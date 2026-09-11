"""
PRODES schema and topological inspection module.
Inspects geometries, attributes, and calculates total observed deforestation area.
"""

import json
from pathlib import Path
from typing import Dict, Any
from shapely.geometry import shape

from .config import PRODES_2024_PATH, PRODES_2023_PATH


def inspect_prodes_file(filepath: Path) -> Dict[str, Any]:
    """Inspects a PRODES GeoJSON file and verifies topological validity."""
    if not filepath.exists():
        raise FileNotFoundError(f"PRODES file not found: {filepath}")

    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    features = data.get("features", [])
    feature_count = len(features)
    
    if feature_count == 0:
        return {"feature_count": 0, "status": "EMPTY"}

    sample_props = features[0]["properties"]
    crs = data.get("crs", {}).get("properties", {}).get("name", "EPSG:4674")

    # Geometry validation & Area aggregation
    valid_geoms = 0
    total_area_km = 0.0
    years_present = set()

    for feat in features:
        geom = shape(feat["geometry"])
        if geom.is_valid:
            valid_geoms += 1
        props = feat.get("properties", {})
        total_area_km += float(props.get("area_km", 0.0))
        years_present.add(props.get("year"))

    return {
        "file": filepath.name,
        "feature_count": feature_count,
        "crs": crs,
        "valid_geometries_count": valid_geoms,
        "validity_percentage": round((valid_geoms / feature_count) * 100, 2),
        "total_prodes_area_km": round(total_area_km, 2),
        "years_present": sorted(list(years_present)),
        "attributes_present": list(sample_props.keys())
    }


if __name__ == "__main__":
    report_2024 = inspect_prodes_file(PRODES_2024_PATH)
    print("2024 PRODES Inspection:", report_2024)
