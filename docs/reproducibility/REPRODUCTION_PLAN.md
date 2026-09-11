# Full Reproduction Plan: End-to-End Engineering Specification

> **Status**: `CONTROLLED RE-ENGINEERING ROADMAP`  
> **Objective**: Complete step-by-step specification for independently retraining the XGBoost model and generating the spatial risk inference grid from raw public sources.

---

## 1. Overview of the 12-Stage Pipeline

To close the reproducibility gaps identified in [REPRODUCIBILITY_GAPS.md](REPRODUCIBILITY_GAPS.md), this document defines an open, reproducible 12-stage engineering pipeline:

```
[Raw Public Satellite Feeds & Vectors]
                 ↓
  Stage 01: Environment Specification        [FUTURE]
  Stage 02: Raw Data Acquisition             [FUTURE]
  Stage 03: Data Harmonization & Projection  [FUTURE]
  Stage 04: Feature Engineering              [FUTURE]
  Stage 05: Label Construction               [FUTURE]
  Stage 06: Spatial / Temporal Splitting     [FUTURE]
  Stage 07: XGBoost Model Training           [FUTURE]
  Stage 08: Multi-Metric Evaluation          [FUTURE]
  Stage 09: SHAP Explainability Extraction   [FUTURE]
                 ↓
  Stage 10: Spatial Grid Inference Export    [CURRENT: data/forest_data_clean.json]
  Stage 11: Artifact Versioning & Registry   [FUTURE]
  Stage 12: Web Application Deployment      [CURRENT: index.html & Deck.gl WebGL]
```

---

## 2. Stage-by-Stage Engineering Protocols

### Stage 01: Environment Specification `[FUTURE]`
Create an isolated Python environment guaranteeing dependency pinning:
```bash
# Environment setup
conda create -n geoai-reproduce python=3.10 -y
conda activate geoai-reproduce

# Core dependencies
pip install xgboost==1.7.6 shap==0.42.1 scikit-learn==1.3.0 \
            geopandas==0.13.2 rasterio==1.3.8 pyproj==3.6.0 \
            numpy==1.24.3 pandas==2.0.3 optuna==3.2.0
```

### Stage 02: Raw Data Acquisition `[FUTURE]`
Acquire raw geospatial inputs from official public repositories:
- **Territorial Mask**: IBGE state boundary shapefile for Rondônia (Code: 11).
- **Road Network**: OpenStreetMap (OSM) highway vectors (primary, secondary, tertiary, unclassified) via Geofabrik Brazil regional extract.
- **Historical Loss Ground Truth**: INPE PRODES Amazonia annual shapefiles (2000–2024) via TerraBrasilis API.
- **Topography**: NASA SRTM 30m Digital Elevation Model (DEM) tiles (1-arcsecond global) via USGS EarthExplorer.
- **Population**: WorldPop gridded population density raster (100m resolution, UN-adjusted census).
- **Conservation Boundaries**: ICMBio / WDPA protected areas and indigenous demarcations (FUNAI).

### Stage 03: Data Harmonization & Reprojection `[FUTURE]`
1. **Coordinate Reference System (CRS)**: Reproject all spatial layers from EPSG:4326 (WGS 84) to **EPSG:31980 (SIRGAS 2000 / UTM Zone 20S)** to ensure planar Euclidean distance calculations without spherical distortion.
2. **Sampling Grid Generation**: Generate a regular hexagonal or centroid grid across Rondônia yielding exactly **150,000 sampling points** within forest and transition biomes.

### Stage 04: Feature Engineering `[FUTURE]`
Extract 12 features for each sampling coordinate:
1. `dist_roads_m`: Distance to nearest road vector via rasterized Euclidean distance transform.
2. `loss_density_5km`: Fraction of surrounding $5\text{ km}$ buffer deforested in prior 3 years.
3. `pop_density_1km`: Log-transformed population count within $1\text{ km}$ cell window.
4. `elevation_m`: SRTM elevation sampled at cell centroid.
5. `slope_deg`: Topographic slope calculated via Horn's formula on elevation raster.
6. `dist_rivers_m`: Distance to nearest river line (HydroSHEDS).
7. `protected_flag`: Binary indicator (1 if inside conservation unit / indigenous territory, 0 otherwise).
8. `ndvi_annual_median`: Annual cloud-free median NDVI from Landsat 8 Surface Reflectance.
9. `soil_moisture`: NASA SMAP surface moisture estimate.
10. `fire_history_count`: Cumulative MODIS/VIIRS thermal anomalies within $5\text{ km}$ over prior 24 months.
11. `logging_concession_flag`: Binary indicator of active legal forestry concessions.
12. `dist_urban_m`: Distance to nearest municipal urban seat.

### Stage 05: Label Construction `[FUTURE]`
- **Target Variable ($y$)**: Binary clear-cut occurrence ($y \in \{0, 1\}$).
- **Positive Class ($y=1$)**: Cells that were primary forest at year $T-1$ and transitioned to cleared canopy in PRODES year $T$ ($\ge 6.25\text{ ha}$).
- **Negative Class ($y=0$)**: Cells that remained intact primary forest canopy.
- **Prevalence**: Documented benchmark class balance exhibits approximately ~10% positive deforestation events across the evaluation window (14,830 positive vs. 135,170 negative cells).

### Stage 06: Spatial & Temporal Splitting `[FUTURE]`
- Split the 150,000 samples into **Train (70%), Validation (15%), and Test (15%)** using contiguous spatial blocks ($50\text{ km} \times 50\text{ km}$) with a $5\text{ km}$ spatial buffer to prevent spatial data leakage.

### Stage 07: XGBoost Model Training `[FUTURE]`
Execute gradient boosted decision tree optimization:
```python
import xgboost as xgb

params = {
    'objective': 'binary:logistic',
    'eval_metric': 'auc',
    'max_depth': 6,
    'learning_rate': 0.05,
    'n_estimators': 300,
    'subsample': 0.8,
    'colsample_bytree': 0.8,
    'scale_pos_weight': 4.0,  # Handles class imbalance
    'tree_method': 'hist',
    'random_state': 42
}

model = xgb.XGBClassifier(**params)
model.fit(X_train, y_train, eval_set=[(X_val, y_val)], early_stopping_rounds=30)
```

### Stage 08: Multi-Metric Evaluation `[FUTURE]`
Compute evaluation metrics on the held-out test partition:
- Verify that the resulting model satisfies canonical benchmark thresholds:
  - $\text{ROC-AUC} \ge 0.82$
  - $\text{Precision} \ge 0.79$
  - $\text{Recall} \ge 0.84$
  - $\text{F1 Score} \ge 0.81$

### Stage 09: SHAP Explainability Extraction `[FUTURE]`
```python
import shap
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)
# Compute global mean absolute Shapley values and verify driver group rankings:
# Road Proximity (41%) > Forest Loss (23%) > Population (21%) > Elevation (15%)
```

### Stage 10: Spatial Grid Inference Export `[CURRENT]`
- **Status**: **ALREADY IMPLEMENTED**.
- Model outputs are exported to `data/forest_data_clean.json`:
  ```json
  [
    {
      "lat": -11.918263,
      "lon": -63.872237,
      "risk_score": 166,
      "risk_norm": 0.932584,
      "elevation": 3730.337,
      "color": [0, 180, 0, 200]
    }
  ]
  ```

### Stage 11: Artifact Versioning & Model Registry `[FUTURE]`
- Save model weights as `models/xgb_deforestation_v1.json`.
- Track data and model hashes using DVC (Data Version Control) and Git LFS.

### Stage 12: Web Application Deployment `[CURRENT]`
- **Status**: **ALREADY IMPLEMENTED**.
- Precomputed JSON dataset is consumed client-side by Deck.GL in `index.html` and supporting analytical pages without runtime backend dependencies.
