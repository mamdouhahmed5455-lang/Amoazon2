# Feature Specification & Driver Attribution

> **Status**: `VERIFIED DOCUMENTATION`  
> **Model Architecture**: Tabular Geospatial Feature Ensemble (12 Features)  
> **Interpretability Framework**: Global TreeSHAP Feature Attribution

---

## 1. Mandatory Scientific Statement on Feature Weights

> **IMPORTANT DECLARATION**:  
> **"The 41/23/21/15 values represent global/offline feature-importance evidence used for analytical interpretation. They are not the learned coefficients of the XGBoost model."**

The XGBoost model is an ensemble of non-linear decision trees. It does not compute additive linear coefficients. The four percentages (41%, 23%, 21%, 15%) represent **global mean absolute Shapley values (TreeSHAP)** computed across the training dataset and normalized to sum to 100%. The formula:
$$\text{Analytical Risk Formulation} = 0.41(\text{Roads}) + 0.23(\text{Loss}) + 0.21(\text{Population}) + 0.15(\text{Elevation})$$
is an analytical synthesis designed for executive decision support and client-side policy sensitivity exploration, **not** the internal mathematical equation of the XGBoost tree ensemble.

---

## 2. Canonical Feature Groups (Analytical Synthesis)

The 12 raw training variables are conceptually grouped into 4 canonical operational drivers:

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│ CANONICAL FEATURE DRIVERS & GLOBAL SHAP IMPORTANCE (SUM = 100%)                    │
├───────────────────────────────┬────────────┬───────────────────────────────────────┤
│ Driver Dimension              │ Global Wt. │ Primary Environmental Mechanism       │
├───────────────────────────────┼────────────┼───────────────────────────────────────┤
│ 1. Road Proximity             │    41%     │ Infrastructure accessibility corridor │
│ 2. Forest Loss (Temporal)     │    23%     │ Perimeter expansion & fragmentation   │
│ 3. Population Pressure        │    21%     │ Anthropogenic settlement demand       │
│ 4. Elevation Constraints      │    15%     │ Topographic slope accessibility       │
└───────────────────────────────┴────────────┴───────────────────────────────────────┘
```

---

## 3. Detailed Specifications for Canonical Drivers

### 1. Road Proximity
- **Conceptual Meaning**: Spatial distance from a grid cell to the nearest official highway (e.g., BR-364) or secondary unpaved logging feeder track.
- **Expected Direction of Risk**: **Inverse** (Lower distance $\to$ Exponentially higher risk of clearing).
- **Role in Model**: Strongest single splitting variable in early tree depth, isolating high-vulnerability corridors along the "fishbone" agricultural frontier.
- **Data Provenance**: Documented as derived from OpenStreetMap (OSM) vector road networks.
- **Transformation Status**: Euclidean distance transform / spatial buffer.
- **Raw Data in Repository**: **NOT STORED**.
- **Training Computation Reproducible**: **PARTIALLY DOCUMENTED** (requires re-querying OSM road vectors for Rondônia).

### 2. Previous Forest Loss (Temporal)
- **Conceptual Meaning**: Historical tree canopy disturbance within the local spatial neighborhood over preceding years.
- **Expected Direction of Risk**: **Positive** (Higher past surrounding loss $\to$ Higher probability of continued outward clearing).
- **Role in Model**: Captures spatial contagion and edge effects, penalizing intact forest patches surrounded by active cattle pasture or agriculture.
- **Data Provenance**: Documented as Hansen Global Forest Change (GFC) / PRODES historical clearing masks.
- **Transformation Status**: Kernel density estimation or spatial focal window sum.
- **Raw Data in Repository**: **NOT STORED**.
- **Training Computation Reproducible**: **PARTIALLY DOCUMENTED** (requires downloading Hansen GFC tiles for Rondônia).

### 3. Population Pressure
- **Conceptual Meaning**: Anthropogenic settlement density and proximity to rural agricultural communities.
- **Expected Direction of Risk**: **Positive** (Higher local population $\to$ Greater demand for agricultural conversion and firewood).
- **Role in Model**: Distinguishes remote wilderness roads from actively settled frontier corridors.
- **Data Provenance**: Documented as WorldPop gridded population density / IBGE rural census data.
- **Transformation Status**: Log-transformed population count surface.
- **Raw Data in Repository**: **NOT STORED**.
- **Training Computation Reproducible**: **PARTIALLY DOCUMENTED** (requires WorldPop 1km/100m raster download).

### 4. Elevation Constraints
- **Conceptual Meaning**: Topographic accessibility constraint based on elevation and slope gradient.
- **Expected Direction of Risk**: **Inverse** (Steeper slopes / high elevations $\to$ Significantly lower probability of mechanized clearing).
- **Role in Model**: Acts as a physical negative filter; agricultural machinery and cattle ranching avoid steep mountainous terrain.
- **Data Provenance**: Documented as Shuttle Radar Topography Mission (SRTM) Digital Elevation Model (DEM).
- **Transformation Status**: Normalized relative elevation and derived slope angle.
- **Raw Data in Repository**: **NOT STORED**.
- **Training Computation Reproducible**: **PARTIALLY DOCUMENTED** (requires SRTM 30m DEM tiles).
- *Critical Caveat*: No physical elevation in meters is stored in `data/forest_data_clean.json`.

---

## 4. Full 12-Feature Training Inventory (Documented Architecture)

As documented in `pages/ai-model.html`, the complete feature set utilized during the original Colab model training experiments comprises 12 spatial variables:

| # | Feature Name | Domain Type | Original Data Source | Units / Format | In Repo? |
| :-: | :--- | :---: | :--- | :--- | :---: |
| **1** | Road Proximity | Spatial | OpenStreetMap | Continuous distance | ❌ |
| **2** | Previous Forest Loss | Temporal | Hansen GFC / PRODES | Disturbance density | ❌ |
| **3** | Population Pressure | Demographic | WorldPop | Gridded density | ❌ |
| **4** | Elevation | Topographic | SRTM DEM | Relative elevation index | ❌ |
| **5** | Slope | Topographic | SRTM DEM | Slope gradient | ❌ |
| **6** | River Distance | Hydrological | HydroSHEDS | Continuous distance | ❌ |
| **7** | Protected Area Status | Statutory | WDPA / ICMBio | Binary indicator (0/1) | ❌ |
| **8** | NDVI (Vegetation Index)| Spectral | Landsat 8 OLI | Normalized spectral index | ❌ |
| **9** | Soil Moisture | Soil / Climate | NASA SMAP | Volumetric water content | ❌ |
| **10**| Fire Frequency | Temporal | NASA FIRMS Archive | Historical thermal count | ❌ |
| **11**| Logging Concessions | Legal Policy | Brazilian Gov. Portal | Polygon intersection | ❌ |
| **12**| Urban Proximity | Anthropogenic | WorldPop / IBGE | Continuous distance | ❌ |

---

## 5. Summary of Data Gaps in Feature Construction

To achieve exact byte-for-byte feature reproduction:
1. **The exact GIS sampling grid coordinates** must be re-generated across Rondônia.
2. **The exact spatial buffer radii and focal kernel bandwidths** used in the original Colab feature-engineering script must be specified.
3. **The exact normalizer parameters** (e.g., StandardScaler / MinMaxScaler `mean_` and `scale_` arrays) are not serialized in this repository.
