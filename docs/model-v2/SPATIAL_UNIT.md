# Spatial Unit Definition & Neutral Grid Specification

> **Model Architecture**: Validated XGBoost Model V2  
> **Spatial Population Concept**: Systematic Geographic Lattice over Eligible Forest Domain  
> **Datum / Coordinate Reference System**: SIRGAS 2000 (EPSG:4674) / WGS 84 (EPSG:4326)

---

## 1. Why the Production Display Grid Was Quarantined

The production dataset `data/forest_data_clean.json` (150,000 cells) was generated in 2021 as a 3D visualization asset. Because it was pre-filtered to include only high-risk cells ($160 \le \text{risk\_score} \le 178$), it lacks a true intact forest negative baseline and reflects the model's own prior predictions.

**Model V2 establishes a completely independent, neutral spatial unit framework.**
The training and validation population is defined strictly from geography and official forest eligibility masks, completely independent of:
- production `risk_score`
- production `risk_norm`
- model confidence
- scenario simulator projections

---

## 2. Spatial Unit Architecture & Specification

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ MODEL V2 SPATIAL UNIT SPECIFICATION                                                    │
├────────────────────┬────────────────────┬──────────────────────────────────────────────┤
│ Dimension          │ Technical Standard │ Implementation Details                       │
├────────────────────┼────────────────────┼──────────────────────────────────────────────┤
│ Geographic Bounds  │ Rondônia, Brazil   │ Lat [-13.65°, -7.95°], Lon [-66.75°, -59.85°]│
│ Spatial Resolution │ ~5.5 km (0.05°)    │ Systematic geographic lattice covering entire│
│                    │                    │ sovereign state (7,045 active forest units)  │
│ Geometric Entity   │ Centroid Point     │ Formal Point(lon, lat) evaluated via STRtree │
│ Forest Eligibility │ Sovereign INPE Mask│ Inside RO state polygon AND strictly outside │
│                    │                    │ 3,265 INPE no_forest (savanna/water) polygons│
│ Total Population   │ 7,045 units        │ Constant across all monitoring years         │
└────────────────────┴────────────────────┴──────────────────────────────────────────────┘
```

### Scientific Justification of Resolution
A resolution of 0.05° (~5.5 km) was chosen because:
1. It aligns with regional macroeconomic landscape analysis and spatial planning units in the Brazilian Amazon.
2. It yields an analytically robust sample size of **7,045 cells per year** (21,135 panel observations across 3 years), providing sufficient spatial coverage across all 52 municipalities while remaining computationally reproducible without specialized HPC infrastructure.
3. It ensures that cells are larger than the PRODES minimum mapping unit (6.25 hectares = 0.0625 km²) so that deforestation patches represent discrete events within the local territory.

---

## 3. Eligible Forest Domain Definition

The territory is classified as **eligible forest domain** through a two-stage geometric inclusion/exclusion pipeline:

1. **State Territorial Boundary**:
   - Source: IBGE / INPE official boundary (`rondonia_boundary.geojson`).
   - A grid point must fall strictly within the territorial polygon of Rondônia.
2. **Natural Non-Forest Mask**:
   - Source: INPE TerraBrasilis natural non-forest formation mask (`rondonia_no_forest.geojson`).
   - Contains 3,265 polygons representing natural savannas (*cerrado* enclaves), permanent water bodies (Rio Madeira, Rio Guaporé, Jamari, Mamoré), wetlands, and rocky outcrops.
   - Any point intersecting this mask is excluded prior to dataset assembly.

*Terminological Precision*:
In strict adherence to scientific accuracy, we designate this population as the **"eligible forest domain"** (areas eligible for forest monitoring under INPE standards), rather than asserting unverified ecological primary rainforest status for every individual square meter.

---

## 4. Class Balance & Sampling Representation

Across the 7,045 neutral spatial units:
- **Eligible Intact Forest Domain**: **99.6% to 99.8%** of the territorial landscape.
- **Annual Observed PRODES Deforestation**: **0.14% to 0.40%** depending on the monitoring year.
- This accurately mirrors the real physical base rate of Amazon deforestation, ensuring that Model V2 is evaluated on real-world operational class distributions rather than artificially balanced toy subsets.
