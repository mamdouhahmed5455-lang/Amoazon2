# Model Card: GeoAI Deforestation Risk Classifier

> **Document Standard**: Mitchell et al. (2019) *Model Cards for Model Reporting*  
> **Model Version**: 1.0 (Offline Research Benchmark)  
> **Target Biome**: Legal Amazon (Pilot: Rondônia, Brazil)

---

## 1. Model Overview

- **Model Architecture**: XGBoost Classifier (Gradient Boosted Decision Trees).
- **Core Task**: Cell-level binary classification and continuous risk scoring of deforestation vulnerability.
- **Developer Context**: Developed as an academic graduation research project evaluating spatial machine learning for early territorial protection.
- **Repository Role**: This repository hosts the interactive, presentation-grade decision-support frontend utilizing precomputed inference data (`data/forest_data_clean.json`).

---

## 2. Intended Use & Target Users

### Intended Use Cases
- **Spatial Prioritization**: Ranking territorial grid cells to focus scarce remote-sensing analyst attention on high-vulnerability corridors.
- **Inspection Planning**: Supporting environmental protection planners in designing weekly surveillance agendas along road expansion axes.
- **Policy Sensitivity Exploration**: Evaluating how hypothetical road expansion bans or protected area buffer enforcements alter regional risk profiles.

### Target Users
- Environmental monitoring teams (e.g., remote-sensing triage analysts).
- Field patrol coordinators and conservation logistics planners.
- Civil society watchdogs, conservation NGOs, and environmental research teams.

---

## 3. Out-of-Scope & Prohibited Uses

- ❌ **Autonomous Enforcement Dispatch**: The model must never trigger law enforcement raids, vehicle dispatch, or property seizure without independent human review.
- ❌ **Automated Infraction Fines**: Model predictions do not constitute legal evidence of a crime and cannot be used to issue automated administrative sanctions.
- ❌ **Fine-Scale Cadastral Boundary Adjudication**: Cell-level risk predictions cannot replace official ground-surveyed property lines or land tenure registries.
- ❌ **Direct Transfer to Flooded Biomes**: Applying this model to flooded forest biomes (e.g., western Amazonas igapó/várzea) without retraining will produce invalid inferences.

---

## 4. Geographic & Spatial Scope

- **Pilot Region**: State of Rondônia, Brazil.
- **Spatial Envelope**:
  - Latitude: `[-13.63° S, -7.98° S]`
  - Longitude: `[-66.72° W, -59.90° W]`
- **Cell Coverage**: 150,000 spatial cells sampled across the federal BR-364 corridor and peripheral agricultural frontiers.
- **Regional Characteristics**: Marked by high road accessibility, historical fishbone settlement fragmentation, and sharp protected enclave boundaries.

---

## 5. Model Characteristics & Training Status

- **Algorithm**: XGBoost (`xgboost.XGBClassifier`).
- **Objective Function**: Binary logistic loss (`binary:logistic`).
- **Training Status**: **Offline Trained**. Executed in an external Google Colab environment.
- **Inference Mode in Current Repository**: **Precomputed Static Inference**. The web frontend does not execute live model weights or Python kernels in the browser.
- **Original Model Weights**: Not bundled in the frontend repository (documented as Strategic Gap #1).

---

## 6. Input & Output Characteristics

### Input Characteristics
- **Input Dimension**: 12 geospatial features (tabular matrix).
- **Primary Data Sources**: OpenStreetMap (roads), Hansen GFC (historical loss), WorldPop (census density), SRTM (DEM topography), HydroSHEDS (waterways), WDPA (conservation status), Landsat 8 (NDVI), SMAP (soil moisture), FIRMS (fire frequency).
- **Missing Value Handling**: Imputed prior to training; runtime inference dataset contains zero null fields.

### Output Characteristics
- **Continuous Prediction**: Raw risk score ($160 \le \text{risk\_score} \le 178$ in precomputed dataset; scaled to $[0, 100]$ probability scale in UI).
- **Categorical Risk Tier**:
  - Low Risk: $[0, 25]$
  - Medium Risk: $(25, 50]$
  - High Risk: $(50, 75]$
  - Urgent Priority: $(75, 100]$

---

## 7. Canonical Performance Metrics (Locked SSOT)

Evaluated across the held-out test dataset partition documented in `docs/Graduation_Project_Report.md`:

| Metric | Benchmark Value | Technical Definition |
| :--- | :---: | :--- |
| **ROC-AUC** | **0.82** | Area Under the Receiver Operating Characteristic Curve. |
| **Precision** | **0.79** | $\text{True Positives} / (\text{True Positives} + \text{False Positives})$. |
| **Recall** | **0.84** | $\text{True Positives} / (\text{True Positives} + \text{False Negatives})$. |
| **F1 Score** | **0.81** | Harmonic mean: $2 \times (\text{Precision} \times \text{Recall}) / (\text{Precision} + \text{Recall})$. |

```
                       DOCUMENTED CONFUSION MATRIX
                           Predicted Positive   Predicted Negative
    Actual Positive            12,450 (TP)          2,380 (FN)       --> Recall    = 0.8395 (0.84)
    Actual Negative             3,290 (FP)        131,880 (TN)
                                   ↓
                             Precision = 0.7910 (0.79)
```

### Critical Distinction: Recall vs. UI Heuristic Confidence
> [!IMPORTANT]
> - **Recall (0.84)** measures the model's ability to identify actual deforestation events across the test dataset.
> - **Dashboard "Model Conf. (Heuristic)" (72–99%)** is a UI display metric derived from score normalization $[(score - 140) / 45 \times 100]$. It is **NOT** Recall, **NOT** statistical confidence, and **NOT** a calibrated Bayesian posterior probability.

---

## 8. Explainability & Interpretability

- **Framework**: SHAP (SHapley Additive exPlanations) via `shap.TreeExplainer`.
- **Global Feature Importance**:
  - Road Proximity: **41%**
  - Previous Forest Loss: **23%**
  - Population Pressure: **21%**
  - Elevation Constraints: **15%**
- **Interpretability Status**: **Global Benchmark Only**. Individual cell-level TreeSHAP force plots are not computed dynamically in the browser.

---

## 9. Caveats, Risks & Limitations

1. **Spatial Autocorrelation**: Standard random splitting in geospatial data can lead to over-optimistic test metrics if neighboring cells share spatial features. Future validation requires spatial block holdouts.
2. **Temporal Stationarity**: The model assumes that historical relationships (e.g., roads predicting loss) remain stationary. Shifts in national environmental enforcement policy can alter feature dynamics.
3. **Absence of Serialized Artifact**: The binary model weights are not hosted within this repository; full independent re-execution requires following `REPRODUCTION_PLAN.md`.
4. **Elevation Representation**: The `elevation` field in `data/forest_data_clean.json` is a synthetic 3D extrusion column (`risk_norm * 4000`), not physical elevation.

---

## 10. Human Oversight & Operational Protocol

- **Mandatory Analyst Review**: Any operational response must be preceded by a qualified human analyst reviewing recent high-resolution optical (PlanetScope) or SAR (Sentinel-1) satellite imagery.
- **Triage Protocol**: High-priority cells serve as triggers for imagery tasking, not direct physical interdiction.
