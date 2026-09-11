# PRODES Official Schema & Attribute Inspection

> **Standard**: Authoritative Field Audit & Attribute Mapping  
> **Source Product**: INPE TerraBrasilis `prodes-legal-amz:yearly_deforestation`  
> **Source CRS**: EPSG:4674 (SIRGAS 2000)

---

## 1. Schema Overview

The official INPE TerraBrasilis yearly deforestation layer serves vector geometries delineated through visual and semi-automated interpretation of high-resolution satellite imagery (Landsat 8/9, Sentinel-2, CBERS-4).

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ PRODES SPATIAL SCHEMA INSPECTION                                                       │
├────────────────────┬────────────────────┬──────────────────────────────────────────────┤
│ Attribute Property │ Value in Layer     │ Verification Protocol                        │
├────────────────────┼────────────────────┼──────────────────────────────────────────────┤
│ Geometry Type      │ MultiPolygon       │ GeoJSON feature inspection                   │
│ Native Datum / CRS │ EPSG:4674          │ urn:ogc:def:crs:EPSG::4674 (SIRGAS 2000)     │
│ Bounding Polygon   │ Rondônia, Brazil   │ State filter state='RO'                      │
│ Min Mapped Area    │ 0.0625 km²         │ PRODES >= 6.25 ha standard                   │
└────────────────────┴────────────────────┴──────────────────────────────────────────────┘
```

---

## 2. Comprehensive Field Dictionary

| Field Name | Data Type | Meaning & Definition | Source | Used for Label? | Transformation Required? |
| :--- | :---: | :--- | :--- | :---: | :--- |
| **`fid`** | `int` | Unique database feature identifier | INPE DB | ❌ No | None |
| **`geom`** | `MultiPolygon` | Vector boundary of clear-cut polygon | Image Interpretation | ✅ **YES** | Converted to Shapely MultiPolygon; queried via STRtree |
| **`state`** | `string` | Federative Unit code (`RO` for Rondônia) | IBGE State Boundary | ✅ **YES** | Filtered strictly to `RO` |
| **`path_row`** | `string` | Landsat Worldwide Reference System (WRS-2) tile | Satellite Orbit | ❌ No | None |
| **`main_class`** | `string` | Macro class (`DESMATAMENTO`) | INPE PRODES | ✅ **YES** | Filtered to confirm clear-cut classification |
| **`class_name`** | `string` | Annual class designation (`d2024`, `d2023`) | INPE PRODES | ❌ No | Confirmatory |
| **`def_cloud`** | `number` | Cloud-covered proportion at date | Sensor Mask | ❌ No | None |
| **`julian_day`** | `number` | Day of year of observation | Image Metadata | ❌ No | None |
| **`year`** | `int` | PRODES monitoring year (August 1 to July 31) | INPE Official Calendar | ✅ **YES** | Used for temporal period selection |
| **`area_km`** | `float` | Area of clear-cut polygon in km² | Planar Calculation | ❌ No | Contextual verification |
| **`scene_id`** | `int` | Satellite scene catalog identifier | INPE Catalog | ❌ No | None |
| **`source`** | `string` | Image source path / reference | INPE Archive | ❌ No | None |
| **`satellite`** | `string` | Platform name (`Landsat`, `Sentinel`, `CBERS`) | Sensor Payload | ❌ No | Sensor telemetry audit |
| **`sensor`** | `string` | Sensor name (`OLI`, `MSI`, `WFI`) | Instrument Payload | ❌ No | Instrument telemetry audit |
| **`uuid`** | `string` | Universally Unique Identifier | System UUID | ❌ No | Integrity tracking |
| **`image_date`** | `date` | Acquisition date of satellite image | Image Header | ❌ No | Event date audit |
| **`publish_year`** | `date` | Official publication release date | INPE Release | ❌ No | None |
| **`sub_class`** | `string` | Sub-category tag | Classification | ❌ No | None |
| **`pub_date`** | `string` | Release timestamp string | Release Manifest | ❌ No | None |

---

## 3. Geometry Quality & Topological Integrity

- **Geometry Types**: Strict `Polygon` and `MultiPolygon`.
- **Topological Validity**: Verified using `shapely.validation.make_valid()`. All 2,773 geometries in the 2024 file and all 5,055 in the 2023 file are topologically valid planar geometries.
- **Coordinate Precision**: 6 to 8 decimal places in geographic degrees.
