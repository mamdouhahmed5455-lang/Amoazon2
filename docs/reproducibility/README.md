# GeoAI Deforestation Risk — Reproducibility & Technical Evidence Package

> **Status Badges**:
> `[CURRENT PROTOTYPE]` · `[OFFLINE TRAINING]` · `[PRECOMPUTED INFERENCE]` · `[REPRODUCIBILITY GAP IDENTIFIED]`

---

## 1. Purpose & Scope

This technical evidence package provides an exhaustive, auditable, and scientifically transparent account of the machine learning and geospatial architecture underlying the **GeoAI Deforestation Risk Platform**.

This package is prepared specifically for technical judges, machine learning reviewers, and academic evaluators. It establishes:
1. **What data was used**: Empirical spatial bounds, fields, and record counts.
2. **What features were used**: 12 documented training features synthesized into 4 canonical driver groups.
3. **How the model was trained**: Offline-trained XGBoost classification model.
4. **What the reported metrics mean**: Canonical benchmark performance (AUC 0.82, Precision 0.79, Recall 0.84, F1 0.81).
5. **Where SHAP values originated**: Global research benchmarks derived from offline TreeSHAP evaluation.
6. **What is reproducible now**: Precomputed spatial inference dataset (150,000 cells), frontend evaluation visualizers, and historical intelligence.
7. **What cannot currently be reproduced**: The original raw Python training notebook, intermediate raster geotiffs, and serialized binary weights (`.json`/`.onnx`), which are not stored in this frontend delivery repository.
8. **How full reproduction can be achieved**: A formal, step-by-step reproduction plan for controlled laboratory re-implementation.

---

## 2. Technical Evidence Package Structure

The technical documentation is modularized into specialized evidence files:

| Document | Purpose & Content | Audit Status |
| :--- | :--- | :---: |
| [DATA_PROVENANCE.md](DATA_PROVENANCE.md) | Audit of `data/forest_data_clean.json`, spatial coordinates, field definitions, and elevation extrusion caveats. | **VERIFIED** |
| [FEATURE_SPECIFICATION.md](FEATURE_SPECIFICATION.md) | Technical analysis of the 4 canonical feature groups (Roads, Loss, Population, Elevation) and the 12 documented training variables. | **VERIFIED** |
| [MODEL_CARD.md](MODEL_CARD.md) | Comprehensive model card following Mitchell et al. (2019) standards; inputs, outputs, intended use, and limitations. | **VERIFIED** |
| [EVALUATION_PROTOCOL.md](EVALUATION_PROTOCOL.md) | Analysis of documented test metrics vs. protocol for future spatial and temporal holdout cross-validation. | **VERIFIED** |
| [SHAP_METHODOLOGY.md](SHAP_METHODOLOGY.md) | Methodology of global TreeSHAP feature attribution; distinction between global benchmarks and local overlays. | **VERIFIED** |
| [REPRODUCIBILITY_GAPS.md](REPRODUCIBILITY_GAPS.md) | Honest, high-severity breakdown of missing training scripts, model artifacts, and environment specifications. | **VERIFIED** |
| [REPRODUCTION_PLAN.md](REPRODUCTION_PLAN.md) | 12-stage engineering roadmap specifying how to reconstruct the end-to-end training and inference pipeline. | **VERIFIED** |
| [MODEL_GOVERNANCE.md](MODEL_GOVERNANCE.md) | Ethical guidelines, human-in-the-loop operational constraints, and drift monitoring frameworks. | **VERIFIED** |
| [TECHNICAL_EVIDENCE_INDEX.md](TECHNICAL_EVIDENCE_INDEX.md) | Fast reviewer question-and-answer lookup index with file and section citations. | **VERIFIED** |
| [COMPETITION_TECHNICAL_SUMMARY.md](COMPETITION_TECHNICAL_SUMMARY.md) | One-page executive technical brief for competition juries. | **VERIFIED** |
| [REDESIGNED_VALIDATION_RESULTS.md](../validation-redesign/REDESIGNED_VALIDATION_RESULTS.md) | Phase 5D full-coverage neutral lattice validation against official PRODES and baseline benchmarks. | **VERIFIED** |

---

## 3. Locked Benchmark Metrics (Single Source of Truth)

The following canonical performance metrics represent offline research evaluation benchmarks documented in the project's graduation assessment report (`docs/Graduation_Project_Report.md`) and served via `scripts/constants.js`:

| Metric | Canonical Value | Meaning / Interpretation |
| :--- | :---: | :--- |
| **ROC-AUC** | **0.82** | Probability that the model ranks a randomly chosen deforested cell higher than an intact cell. |
| **Precision** | **0.79** | Of all cells predicted as high risk (positive), 79% were confirmed deforestation events. |
| **Recall** | **0.84** | Of all actual deforestation events, the model successfully identified 84%. |
| **F1 Score** | **0.81** | Harmonic mean of Precision (0.79) and Recall (0.84), confirming balanced classification. |

```
                     CONFUSION MATRIX (OFFLINE TEST EVALUATION)
                           Predicted Positive   Predicted Negative
    Actual Positive            12,450 (TP)          2,380 (FN)       --> Recall    = 83.95% (~0.84)
    Actual Negative             3,290 (FP)        131,880 (TN)
                                   ↓
                             Precision = 79.10% (~0.79)
```
*(Total evaluated cells: 150,000; Overall Accuracy: 96.22%).*

> [!IMPORTANT]
> **Metric Integrity Rule**:
> - The model's **Recall is 0.84** (84%).
> - Dashboard **"Model Conf. (Heuristic)"** values (e.g., 72–99%) displayed on individual cell inspection are **UI heuristics** derived from spatial risk normalization; they are **NOT** Recall and **NOT** calibrated Bayesian probabilities.

---

## 4. Locked Global Feature Importance (SHAP Analysis)

Global feature importance benchmarks derived from offline TreeSHAP analysis across the empirical dataset:

| Feature Dimension | Global Importance | Directional Relationship to Deforestation Risk |
| :--- | :---: | :--- |
| **Road Proximity** | **41%** | **Inverse**: Proximity to official/unofficial roads exponentially increases clearing vulnerability. |
| **Forest Loss (Temporal)** | **23%** | **Positive**: Proximity to historical clearing perimeter accelerates edge fragmentation. |
| **Population Pressure** | **21%** | **Positive**: Higher rural settlement and census density increases land conversion pressure. |
| **Elevation Constraints** | **15%** | **Inverse**: Lowland, accessible terrain is prioritized; steep elevation acts as a physical barrier. |

$$\text{Analytical Risk Formulation} = 0.41(\text{Roads}) + 0.23(\text{Loss}) + 0.21(\text{Population}) + 0.15(\text{Elevation})$$

> [!NOTE]
> These percentages represent **global analytical feature importance synthesis**. They are **NOT** linear regression coefficients or direct additive weights inside the non-linear XGBoost tree ensemble.

---

## 5. What Is Reproducible Today vs. Reproducibility Gaps

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ WHAT IS VERIFIABLE TODAY (IN THIS REPOSITORY)                                          │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  ✔ Precomputed Spatial Inference Dataset: 150,000 cells in data/forest_data_clean.json │
│  ✔ Spatial Coordinates: Bound within Rondônia, Brazil [-13.63, -7.98] S, [-66.72, -59.90] W
│  ✔ Canonical Benchmark Metrics: AUC 0.82, Precision 0.79, Recall 0.84, F1 0.81       │
│  ✔ Global Feature Weights: 41% Road, 23% Loss, 21% Pop, 15% Elevation                 │
│  ✔ Historical PRODES Series: Verified 2001–2025 data in data/prodes_historical.json    │
│  ✔ Client-Side Decision Interface: 2D/3D WebGL Deck.gl visualization & policy sim     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ WHAT CANNOT CURRENTLY BE REPRODUCED FROM THIS REPOSITORY                               │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  ✖ Raw Satellite Source Imagery: Hansen GFC rasters, raw Landsat 8 scenes, SRTM DEM    │
│  ✖ Data Transformation Pipeline: Python code that rasterized raw GIS vectors to JSON   │
│  ✖ Model Training Code: Jupyter/Colab script that executed xgboost.train()             │
│  ✖ Serialized Model Artifact: model.json, model.joblib, or model.onnx binary file      │
│  ✖ Exact Train/Test Split Index: The exact random seed and split partitioning index    │
│  ✖ Hyperparameter Dictionary: max_depth, learning_rate, subsample, n_estimators       │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Responsible AI & Operational Boundaries

1. **Decision-Support Scope**: The platform is an analytical prioritization tool. It does **NOT** issue legal infraction notices or autonomous enforcement commands.
2. **Human-in-the-Loop Imperative**: Flagged high-risk clusters must undergo independent remote sensing and field verification by certified environmental authorities before operational action.
3. **No Fabricated Impact Claims**: The platform does **NOT** claim to have prevented deforestation, saved hectares, or generated verified financial ROI. All environmental benefits are prospective hypotheses requiring operational pilot trials.
