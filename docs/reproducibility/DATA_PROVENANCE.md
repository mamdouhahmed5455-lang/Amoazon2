# Data Provenance & Spatial Dataset Specification

> **Document Status**: `VERIFIED AUDIT`  
> **Target Dataset**: `data/forest_data_clean.json`  
> **Pilot Geography**: Rondônia, Brazil

---

## 1. Primary Dataset Overview

The runtime dataset driving the 2D/3D spatial visualization and analytical filtering is stored in:
`data/forest_data_clean.json`

| Property | Verified Value | Verification Method |
| :--- | :--- | :--- |
| **File Path** | `data/forest_data_clean.json` | Direct filesystem verification |
| **File Size** | **20.4 MB** (20,381,040 bytes) | Filesystem metadata |
| **Format** | Array of JSON Objects (UTF-8) | Parser verification |
| **Total Records** | **150,000** spatial points | Exact JSON array length |
| **Missing Values** | **0** null / undefined fields | Programmatic sweep across all 150k objects |
| **Spatial Bounds** | Rondônia, Brazil | Coordinate bounding box calculation |

---

## 2. Field Inventory & Verified Summary Statistics

Every record in `data/forest_data_clean.json` consists of exactly 6 properties:

```json
{
  "lat": -11.9182632848,
  "lon": -63.8722379103,
  "risk_score": 166,
  "risk_norm": 0.9325842697,
  "elevation": 3730.3370786517,
  "color": [ 0, 180, 0, 200 ]
}
```

### Verified Numeric Ranges (Complete Dataset Sweep)

| Field Name | Type | Min Value | Max Value | Data Classification |
| :--- | :---: | :---: | :---: | :--- |
| `lat` | `float64` | **-13.6273979443** | **-7.9822948674** | **Empirical Spatial Coordinate** |
| `lon` | `float64` | **-66.7213346654** | **-59.9041996373** | **Empirical Spatial Coordinate** |
| `risk_score` | `int` | **160** | **178** | **Derived Model Prediction** |
| `risk_norm` | `float64` | **0.8988764045** | **1.0000000000** | **Derived Transformed Metric** |
| `elevation` | `float64` | **3595.5056179775** | **4000.0000000000** | **Visualization-Only Extrusion** |
| `color` | `int[4]` | `[0, 180, 0, 200]` | `[255, 60, 60, 220]` | **Visualization-Only Styling** |

---

## 3. Data Classification: Empirical vs. Derived vs. Visualization

To maintain absolute scientific integrity, data elements are strictly delineated into three distinct categories:

### A. Empirical Spatial Data
- **`lat`, `lon`**: Actual geographic coordinates located within the sovereign territory of Rondônia, Brazil. The spatial envelope matches the federal road network surrounding BR-364 and the agricultural-forest transition frontier.

### B. Derived / Precomputed Model Inference
- **`risk_score`**: Integer risk score output generated offline by the XGBoost classifier.
- **`risk_norm`**: Normalized representation calculated as:
  $$\text{risk\_norm} = \frac{\text{risk\_score} - \text{min\_val}}{\text{max\_val} - \text{min\_val}}$$
  Within this active inference subset, scores scale linearly from $0.8989$ to $1.0000$.

### C. Visualization-Only Synthetic Fields (Critical Caveat)
- **`elevation`**: 
  > [!WARNING]
  > **The Elevation Field Is NOT Physical Altitude in Meters.**  
  > Programmatic analysis reveals the exact formula used to generate this field:
  > $$\text{elevation} = \text{risk\_norm} \times 4000$$
  > Example: $0.8988764045 \times 4000 = 3595.505618$.  
  > This column was created solely as a Deck.GL 3D column extrusion height parameter to visually represent risk severity as vertical column height in the WebGL canvas. It does **NOT** represent topographic height above sea level.
- **`color`**: RGBA color tuples generated for direct GPU buffer binding during map rendering.

---

## 4. Provenance Status Matrix

| Component | Status | Evidentiary Basis & Repository Finding |
| :--- | :---: | :--- |
| **Inference Dataset** | **VERIFIED** | Present in `data/forest_data_clean.json` (150,000 records). |
| **Historical PRODES Data** | **VERIFIED** | Present in `data/prodes_historical.json` (2001–2025 INPE census). |
| **Spatial Bounding Box** | **VERIFIED** | Coordinates strictly within Rondônia state boundaries. |
| **Raw Satellite Rasters** | **NOT RECOVERABLE** | Hansen GFC, Landsat 8, and SRTM GeoTIFFs are not stored in this repo. |
| **ETL Transformation Code**| **NOT RECOVERABLE** | The Python script that sampled coordinates and joined raster values is absent. |
| **Original Ground Truth** | **PARTIALLY DOCUMENTED** | Documented as Hansen/PRODES forest loss; raw binary mask labels absent. |
| **Point-Event Timestamps**| **NOT RECOVERABLE** | The dataset contains spatial risk states; individual event dates are absent. |
| **Training Pipeline Script**| **NOT RECOVERABLE** | `analysis.py` referenced in old docs is not present in repository. |

---

## 5. Temporal Honesty: Static Spatial Grid vs. Historical PRODES

The platform maintains two separate data files that must never be conflated:

1. **`data/forest_data_clean.json` (Spatial Risk Dataset)**:
   - A static spatial grid of 150,000 cells representing modeled vulnerability.
   - The interactive timeline slider on the dashboard (2020–2030) represents a **simulated projection**, not real historical event timestamps.
2. **`data/prodes_historical.json` (Historical Intelligence Series)**:
   - Contains official, annual, consolidated deforestation statistics from INPE / TerraBrasilis covering all 9 Legal Amazon states and the Legal Amazon Total from **2001 to 2025**.
   - These numbers are audited historical facts and are strictly separated from spatial model predictions.
