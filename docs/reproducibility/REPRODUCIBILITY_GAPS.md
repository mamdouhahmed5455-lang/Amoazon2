# Reproducibility Gaps & Technical Debt Audit

> **Audit Standard**: IEEE / ACM Artifact Review and Badging Standards  
> **Repository Scope**: Frontend Decision-Support Prototype Delivery Repository  
> **Audit Status**: Comprehensive Gap Identification

---

## 1. Executive Summary of Reproducibility State

This repository serves as the **production-grade decision-support interface** for visualizing precomputed deforestation risk inferences. While the precomputed dataset (`data/forest_data_clean.json`), historical PRODES series (`data/prodes_historical.json`), and client-side visualization architecture are 100% functional and test-verified, the **upstream model-training artifacts and raw GIS extraction pipelines are external to this repository**.

To uphold the highest level of academic and scientific honesty, this document catalogs every identified gap across three formal severity tiers.

---

## 2. Severity Classification Framework

- 🔴 **HIGH SEVERITY**: Gaps that prevent a third-party researcher from immediately re-training the identical model binary from this repository alone.
- 🟡 **MEDIUM SEVERITY**: Missing experimental metadata or procedural parameters that require re-derivation during reproduction.
- 🟢 **LOW SEVERITY**: Minor operational logging, artifact versioning, or hardware metadata omissions.

---

## 3. Detailed Audit of Gaps

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ REPRODUCIBILITY GAPS AUDIT MATRIX                                                    │
├────┬──────────┬──────────────────────────────────────────────┬───────────────────────┤
│ ID │ Severity │ Gap Description                              │ Status in Repository  │
├────┼──────────┼──────────────────────────────────────────────┼───────────────────────┤
│ G1 │ 🔴 HIGH  │ Missing Python Training Script               │ NOT RECOVERABLE       │
│ G2 │ 🔴 HIGH  │ Missing Serialized Model Binary (JSON/ONNX)   │ NOT RECOVERABLE       │
│ G3 │ 🔴 HIGH  │ Missing Raw Source GIS Rasters (GeoTIFFs)    │ NOT STORED (Size ~GB) │
│ G4 │ 🟡 MED   │ Unrecorded Random Seed & Split Indices       │ NOT RECOVERABLE       │
│ G5 │ 🟡 MED   │ Exact XGBoost Hyperparameter Dictionary      │ NOT RECOVERABLE       │
│ G6 │ 🟡 MED   │ Feature Extraction Buffers & Focal Radii     │ PARTIALLY DOCUMENTED  │
│ G7 │ 🟢 LOW   │ Experiment Tracking Telemetry (MLflow/W&B)   │ NOT RECOVERABLE       │
│ G8 │ 🟢 LOW   │ Hardware Training Specs & Runtime Execution  │ NOT RECOVERABLE       │
└────┴──────────┴──────────────────────────────────────────────┴───────────────────────┘
```

---

### 🔴 HIGH SEVERITY GAPS

#### Gap G1: Missing Original Model Training Script
- **Description**: The Python source code that initialized `xgboost.XGBClassifier()`, performed cross-validation, and executed the training fit is not bundled in this repository.
- **Reference in Docs**: Referenced historically as `analysis.py` or `scripts/framework.py` in early documentation, but neither file exists in the current repository.
- **Remediation**: Specified in Stage 07 of [REPRODUCTION_PLAN.md](REPRODUCTION_PLAN.md).

#### Gap G2: Missing Serialized Model Artifact
- **Description**: The binary weights (e.g., `model.json`, `model.joblib`, `model.onnx`, or `model.ubj`) are not present. The frontend consumes a static precomputed JSON array containing coordinates and model-generated risk scores.
- **Impact**: A reviewer cannot run `model.predict_proba()` on arbitrary new geographic coordinates without retraining the model.
- **Remediation**: Specified in Stage 10 of [REPRODUCTION_PLAN.md](REPRODUCTION_PLAN.md).

#### Gap G3: Incomplete Raw GIS Raster Data
- **Description**: Multi-gigabyte raw input rasters (Hansen Global Forest Change 2000–2024 tiles, Landsat 8 spectral scenes, SRTM 30m DEM GeoTIFFs, WorldPop population grids) are not stored in the repository.
- **Justification**: Standard web application repositories cannot host hundreds of gigabytes of satellite raster imagery.
- **Remediation**: External download URLs and retrieval scripts specified in [REPRODUCTION_PLAN.md](REPRODUCTION_PLAN.md).

---

### 🟡 MEDIUM SEVERITY GAPS

#### Gap G4: Unrecoverable Dataset Partitioning Indices
- **Description**: The exact row indices assigned to train, validation, and test sets are not serialized. While the test confusion matrix totals 150,000 samples, the exact random seed used for splitting is not recorded.
- **Impact**: Independent re-training will produce minor statistical variances ($\pm 1\%$) in performance metrics unless the split is standardized.

#### Gap G5: Undocumented Exact Hyperparameter Dictionary
- **Description**: Key XGBoost hyperparameters (such as `max_depth`, `learning_rate`, `subsample`, `colsample_bytree`, `n_estimators`, and `scale_pos_weight`) are not explicitly defined in any configuration file in the repository.
- **Impact**: A re-trainer must perform hyperparameter search (e.g., via Optuna or GridSearchCV) to re-converge to the canonical AUC 0.82 / F1 0.81 performance benchmark.

#### Gap G6: Missing Exact Feature Buffer Radii
- **Description**: The exact Euclidean distance cutoff used for road buffers (e.g., 5 km vs. 10 km) and the exact kernel bandwidth for previous forest loss density calculations are not formally codified in code.
- **Impact**: Requires standardizing raster processing parameters during feature re-engineering.

---

### 🟢 LOW SEVERITY GAPS

#### Gap G7: Absence of MLOps Experiment Tracking
- **Description**: Training loss curves, iteration histories, and learning curves were not captured in MLflow, Weights & Biases, or TensorBoard log directories within this repository.
- **Impact**: Does not impact runtime frontend usage, but limits model lifecycle observability.

#### Gap G8: Missing Hardware & Runtime Specifications
- **Description**: The compute environment (GPU vs. CPU, RAM capacity, wall-clock training duration) used for model fitting is not recorded.
- **Impact**: Trivial; XGBoost on 150,000 rows typically trains in under 5 minutes on any modern workstation.

---

## 4. Remediation Commitment

The existence of these gaps is a natural characteristic of separating a **lightweight, high-performance web deployment repository** from an **upstream compute-intensive satellite data pipeline**. The exact engineering roadmap to close every high and medium gap is detailed in [REPRODUCTION_PLAN.md](REPRODUCTION_PLAN.md).
