# Forensic Discovery & Artifact Availability Audit

> **Model Architecture**: Validated XGBoost Model V2 (Independent Research Experiment)  
> **Evaluation Date**: 2026-09-11  
> **Guiding Principle**: Non-negotiable empirical verification without inference or fabrication.

---

## 1. Executive Summary

A comprehensive forensic audit was conducted across the entire repository (`data/`, `scripts/`, `docs/`, `outputs/`, `tests/`, `pages/`, `artifacts/`) to evaluate the availability, integrity, and provenance of all data sources, model parameters, labels, and baseline metrics.

Key findings:
1. **Original Upstream Assets**: The original Python training code, raw GIS rasters, ground-truth binary labels ($y \in \{0, 1\}$), random seeds, train/test split indices, and serialized model binary (`.json` or `.pkl`) for the original 2021 graduation project remain **NOT AVAILABLE** in the codebase.
2. **Original Benchmark Documentation**: The reported historical benchmark metrics (ROC-AUC = 0.82, Precision = 0.79, Recall = 0.84, F1 = 0.81; SHAP weights 41% Road, 23% Loss, 21% Population, 15% Elevation) are **VERIFIED** as documented in `docs/Graduation_Project_Report.md`, `scripts/constants.js`, and `pages/ai-model.html`. These remain untouched as historical reference.
3. **Production Web Grid**: The 150,000-cell file (`data/forest_data_clean.json`) is **VERIFIED** as a visualization asset. It contains model outputs (`risk_score` 160–178, `risk_norm` 0.8989–1.0), not ground-truth labels, and is strictly quarantined from Model V2 training.
4. **Independently Acquired Primary Sources for Model V2**: Official INPE PRODES clear-cut polygons (2021–2024), INPE state boundary and natural non-forest masks, OpenStreetMap (OSM) highway corridors, IBGE 2022 Census population data, and Copernicus DEM 90m physical elevations are **VERIFIED** and stored locally under `data/external/`.

---

## 2. Item-by-Item Forensic Classification Ledger

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ MODEL V2 FORENSIC EVIDENCE & SOURCE CLASSIFICATION LEDGER                                              │
├──────────────────────────────────────┬─────────────────────────────┬──────────────────────────┬────────┤
│ Artifact / Asset Description         │ Local Path / Location       │ Documented Value / Scope │ Status │
├──────────────────────────────────────┼─────────────────────────────┼──────────────────────────┼────────┤
│ 1. Original Training Python Code     │ Entire Repository           │ Legacy analysis.py lost  │ NOTAVA │
│ 2. Original Model Serialized Weights │ Entire Repository           │ Missing from repo        │ NOTAVA │
│ 3. Original Ground-Truth Labels      │ data/forest_data_clean.json │ Only risk_score output   │ NOTAVA │
│ 4. Original Train/Test Split Index   │ Entire Repository           │ Unrecorded               │ NOTAVA │
│ 5. Original XGBoost Hyperparameters  │ Entire Repository           │ Unrecorded               │ NOTAVA │
│ 6. Original Random State Seed        │ Entire Repository           │ Unrecorded               │ NOTAVA │
│ 7. Original Raw Raster GeoTIFFs      │ Entire Repository           │ Missing from repo        │ NOTAVA │
│ 8. Original Benchmark Metrics        │ constants.js & Report       │ AUC 0.82 / Prec 0.79     │ VERIF  │
│ 9. Original Documented SHAP Weights  │ constants.js & Report       │ 41 / 23 / 21 / 15        │ VERIF  │
│ 10. Production 150k Web Grid         │ data/forest_data_clean.json │ 150,000 spatial cells    │ VERIF  │
│ 11. INPE Rondônia Sovereign Boundary │ data/external/prodes-val/   │ EPSG:4674 State Polygon  │ VERIF  │
│ 12. INPE Natural Non-Forest Mask     │ data/external/prodes-val/   │ 3,265 polygons (EPSG4674)│ VERIF  │
│ 13. PRODES 2021 Clear-Cut Polygons   │ data/external/prodes/       │ 8,045,033 bytes (GeoJSON)│ VERIF  │
│ 14. PRODES 2022 Clear-Cut Polygons   │ data/external/prodes/       │ 8,330,650 bytes (GeoJSON)│ VERIF  │
│ 15. PRODES 2023 Clear-Cut Polygons   │ data/external/prodes/       │ 5,959,016 bytes (GeoJSON)│ VERIF  │
│ 16. PRODES 2024 Clear-Cut Polygons   │ data/external/prodes/       │ 5,791,181 bytes (GeoJSON)│ VERIF  │
│ 17. OSM Highway Geometry (RO)        │ data/external/roads/        │ 1,000 highway segments   │ VERIF  │
│ 18. IBGE 2022 Census Municipality Pop│ data/external/ibge/         │ 52 Rondônia Municipalities│ PART   │
│ 19. IBGE Municipality Geo-Centroids  │ data/external/ibge/         │ 52 Municipality geocodes │ VERIF  │
│ 20. Copernicus DEM GLO-90 Elevation  │ data/external/dem/          │ 7,045 cell elevations (m)│ VERIF  │
└──────────────────────────────────────┴─────────────────────────────┴──────────────────────────┴────────┘
```
*Legend: `VERIF` = Verified with authoritative data present; `PART` = Partially Verified (documented with temporal or spatial constraints); `NOTAVA` = Not Available in repository.*

---

## 3. Analysis of Key Dimensions

### A. Ground-Truth Deforestation Observations
- **Verified Sources**:
  - `data/external/prodes/prodes_ro_2021.geojson`: 6,192 clear-cut features (monitoring year Aug 2020–Jul 2021).
  - `data/external/prodes/prodes_ro_2022.geojson`: 6,155 clear-cut features (monitoring year Aug 2021–Jul 2022).
  - `data/external/prodes/prodes_ro_2023.geojson`: 5,055 clear-cut features (monitoring year Aug 2022–Jul 2023).
  - `data/external/prodes/prodes_ro_2024.geojson`: 2,773 clear-cut features (monitoring year Aug 2023–Jul 2024).
- **Integrity**: Acquired directly from INPE TerraBrasilis WFS service. Coordinate reference system is SIRGAS 2000 / EPSG:4674.

### B. Forest Eligibility Layer
- **Verified Sources**:
  - Boundary: `data/external/prodes-validation/rondonia_boundary.geojson` (official IBGE state outline).
  - Mask: `data/external/prodes-validation/rondonia_no_forest.geojson` (official INPE mask containing 3,265 polygons of natural savanna, water bodies, and non-forest formations).
- **Semantics**: A neutral spatial unit is defined as "eligible forest domain" iff it is located inside the Rondônia state boundary AND outside all 3,265 INPE non-forest mask polygons. Forest eligibility is never inferred from PRODES absence alone.

### C. Road Infrastructure
- **Verified Sources**:
  - `data/external/roads/rondonia_federal_highways.json`: 1,000 geometric road elements covering the sovereign federal highway trunk network in Rondônia (BR-364, BR-421, BR-425, BR-429).
  - Queried via Overpass API with bounding box $[-13.7, -66.8, -7.9, -59.8]$.
- **Temporal Status**: Represents established, static highway corridors. Future planned road constructions are not included, avoiding post-observation leakage.

### D. Population / Demographic Pressure
- **Verified Sources**:
  - `data/external/ibge/rondonia_ibge_2022_pop.json`: 2022 Decennial Demographic Census official municipal populations published by IBGE.
  - `data/external/ibge/rondonia_municipios.json`: Official IBGE geocodes and municipality names for all 52 municipalities of Rondônia.
- **Temporal Constraint**: Classified as **PARTIALLY VERIFIED** because IBGE decennial census data reflect 2022 enumeration. For prediction tasks covering 2022, 2023, and 2024, this feature functions as a static settlement gravity snapshot. It is not an annual time-series, which is explicitly declared as a known limitation.

### E. Topographic Elevation
- **Verified Sources**:
  - `data/external/dem/rondonia_elevations.json`: Physical elevation values in meters above sea level (range: 85m to 585m) sampled from the Copernicus DEM GLO-90 (90-meter global digital elevation model) via the Open-Meteo Elevation API.
- **Integrity**: Replaces the old visualization formula (`elevation = risk_norm * 4000`), which was purely aesthetic. Real physical elevation is now available for all 7,045 grid cells.

---

## 4. Methodological Conclusion

All required raw data for the Four Feature Groups (5 quantitative predictors) and independent PRODES ground-truth labels across 2021–2024 are present, verified, and uncorrupted. The experiment can proceed with zero dependency on missing legacy code or production risk scores.
