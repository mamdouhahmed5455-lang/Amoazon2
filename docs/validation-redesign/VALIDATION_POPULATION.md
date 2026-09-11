# Validation Population Definition: Rondônia Environmental Domain

> **Methodological Standard**: Population Representativeness & Sampling Validity  
> **Geographic Boundary**: State of Rondônia, Brazil (EPSG:4674)  
> **Guiding Principle**: $\text{Production Dataset } \ne \text{ Validation Dataset}$

---

## 1. The Core Principle: Why a Dedicated Validation Dataset Is Required

In machine learning and spatial statistics, evaluating model discrimination on an intentionally pre-filtered subset introduces severe **survivorship and selection bias**.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ PRODUCTION ARTIFACT VS. SCIENTIFIC VALIDATION POPULATION                               │
├───────────────────────────────┬────────────────────────────────────────────────────────┤
│ Production Grid               │ Validation Population                                  │
│ (data/forest_data_clean.json) │ (artifacts/validation-redesign/)                       │
├───────────────────────────────┼────────────────────────────────────────────────────────┤
│ • 150,000 cells               │ • Complete spatial sample across Rondônia              │
│ • Filtered to high risk (100%)│ • Spans full risk gradient (Low, Med, High)            │
│ • Optimized for 3D UI render  │ • Optimized for statistical balance & unbiased AUC     │
│ • Upper-tail truncated        │ • Unbiased representation of the target forest biome   │
└───────────────────────────────┴────────────────────────────────────────────────────────┘
```

---

## 2. Delineation of Eligible vs. Ineligible Area

To ensure that a negative label ($y=0$) legitimately represents **intact forest preserved from deforestation**, the spatial domain is partitioned using authoritative INPE layers:

### A. Sovereign Territorial Extent (Gross Area)
- **Source**: `data/external/prodes-validation/rondonia_boundary.geojson` (INPE TerraBrasilis `states_legal_amazon`).
- **Territorial Scope**: The complete sovereign land boundary of the State of Rondônia ($237,590\text{ km}^2$).
- **Rule**: Any coordinate outside this official polygon is **STRICTLY EXCLUDED**.

### B. Naturally Ineligible Land (Non-Forest Exclusions)
- **Source**: `data/external/prodes-validation/rondonia_no_forest.geojson` (INPE TerraBrasilis `no_forest`, 3,265 polygons).
- **Ineligible Sub-Biomes**:
  - Cerrado savanna enclaves (*cerrado sensu stricto*).
  - Rocky outcrops and natural shrublands (*campos rupestres*).
  - Major inland rivers, reservoirs (Samuel Dam), and persistent water bodies.
- **Rule**: Any coordinate intersecting a `no_forest` polygon cannot undergo PRODES primary forest clear-cutting and is **STRICTLY EXCLUDED from the validation population**.

### C. Eligible Forest Domain (Net Validation Area)
- **Definition**: The net territorial area of Rondônia after subtracting natural non-forest and water bodies.
- **Scientific Role**: Only within this domain can a spatial cell validly transition to deforested ($y=1$) or remain intact forest ($y=0$).
