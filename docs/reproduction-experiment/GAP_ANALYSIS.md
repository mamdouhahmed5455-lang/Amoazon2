# Reproduction Gap Analysis: Technical Requirements for Independent Closure

> **Methodological Standard**: Research Engineering Defensibility & Gap Closure Protocol  
> **Target**: Comprehensive analysis of missing upstream artifacts and the specific evidence required to close each gap.

---

## 1. Overview of Gaps

During the forensic audit and reproduction experiment, seven critical upstream gaps were confirmed between the production frontend delivery repository and the original Colab modeling pipeline.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ GAP CLOSURE MATRIX                                                                     │
├────┬───────────────────────────────┬───────────────────────────────────────────────────┤
│ ID │ Gap Description               │ Exact Evidence Required to Close                  │
├────┼───────────────────────────────┼───────────────────────────────────────────────────┤
│ G1 │ Missing Training Source Code  │ Jupyter / Python script executing xgboost.fit()   │
│ G2 │ Missing Model Weights         │ Serialized model.json / model.onnx binary file    │
│ G3 │ Missing Ground-Truth Target   │ PRODES / Hansen annual clear-cut polygon masks    │
│ G4 │ Missing Raw Feature Sources   │ OpenStreetMap road vectors, SRTM DEM GeoTIFFs     │
│ G5 │ Missing Partitioning Indices  │ Random seed, train_test_split index arrays        │
│ G6 │ Missing Hyperparameters       │ Config dictionary (max_depth, lr, subsample)      │
│ G7 │ Missing Spatial Preprocessing │ GIS buffering and raster extraction scripts       │
└────┴───────────────────────────────┴───────────────────────────────────────────────────┘
```

---

## 2. Detailed Gap Analysis & Closure Requirements

### Gap 1: Missing Original Training Source Code
- **What Is Missing**: The original Python script or Colab notebook that orchestrated data ingestion, hyperparameter tuning, model training, and evaluation.
- **Why It Matters**: Prevents automated end-to-end retraining from git clone alone.
- **Evidence Required to Close**: Commit the original Colab notebook or export a clean, standardized training script (`scripts/train.py`) into the repository.

### Gap 2: Missing Serialized Model Weights
- **What Is Missing**: The binary model artifact (e.g., `xgb_model.json` or `model.onnx`).
- **Why It Matters**: The current repository serves precomputed spatial inferences (`data/forest_data_clean.json`). Without the binary weights, new geographic coordinates cannot be scored interactively on the fly.
- **Evidence Required to Close**: Save and version the model artifact in a dedicated model registry or via Git LFS at `models/xgb_model.json`.

### Gap 3: Missing Ground-Truth Deforestation Target Labels
- **What Is Missing**: Binary target column ($y \in \{0, 1\}$) assigning true ground-truth clear-cut status to each cell.
- **Why It Matters**: Prevents training a new model without fabricating pseudo-labels. In Phase 5B, this resulted in the required scientific halt (`TARGET_RECONSTRUCTION_BLOCKED.md`).
- **Evidence Required to Close**: Download official INPE PRODES annual clearing shapefiles from TerraBrasilis, perform spatial intersection with the 150,000 coordinate centroids, and append an authentic `is_deforested` boolean ground-truth column.

### Gap 4: Missing Raw Source Satellite Rasters & Vector Geometries
- **What Is Missing**: Multi-band Landsat 8 scenes, SRTM 30m DEM elevation GeoTIFFs, WorldPop population density rasters, and OpenStreetMap highway vector files.
- **Why It Matters**: Prevents re-extracting fresh feature values if coordinates are moved or spatial resolution is adjusted.
- **Evidence Required to Close**: Provide an automated data acquisition script (e.g., `scripts/download_raw_data.sh`) interfacing with USGS EarthExplorer, NASA Earthdata, and OpenStreetMap APIs with persistent storage on cloud object storage (e.g., S3/GCS).

### Gap 5: Missing Exact Partitioning Indices & Random Seed
- **What Is Missing**: The random seed and explicit index arrays dividing the 150,000 samples into train, validation, and test subsets.
- **Why It Matters**: Re-training with a different random seed will yield minor natural stochastic variations ($\pm 1\%$) in AUC and F1 metrics.
- **Evidence Required to Close**: Serialize explicit train/test index lists (`train_indices.npy`, `test_indices.npy`) or lock a standard spatial block holdout scheme.

### Gap 6: Missing Explicit Hyperparameter Configuration
- **What Is Missing**: The exact hyperparameter dictionary passed to `XGBClassifier` during the benchmark training run.
- **Why It Matters**: A new engineer must run Optuna hyperparameter optimization to re-converge to the 0.82 AUC / 0.81 F1 benchmark.
- **Evidence Required to Close**: Document the configuration file (`config/hyperparams.json`) specifying `max_depth`, `learning_rate`, `n_estimators`, `subsample`, `colsample_bytree`, and `scale_pos_weight`.

### Gap 7: Missing Spatial Preprocessing & Feature Extraction Code
- **What Is Missing**: The GIS pipeline that performed Euclidean distance transforms on road lines and kernel density smoothing on historical forest loss polygons.
- **Why It Matters**: Minor differences in buffer cutoffs or distance metrics can alter feature values.
- **Evidence Required to Close**: Provide a deterministic Python script using `rasterio`, `geopandas`, and `scipy.ndimage.distance_transform_edt` that standardizes feature derivation.
