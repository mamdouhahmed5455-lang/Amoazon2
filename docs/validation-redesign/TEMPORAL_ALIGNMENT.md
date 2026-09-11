# Temporal Alignment & Predictive Horizon Semantics

> **Epistemological Standard**: Predictive Semantics & Temporal Truth Labeling  
> **Experiment Classification**: Retrospective Spatial Association Validation (NOT Temporal Forecast)

---

## 1. The Temporal Provenance Audit

To maintain non-negotiable scientific honesty, we address the temporal relationship between the model predictions and external observations:

1. **Prediction Timestamp Status**:
   - `data/forest_data_clean.json` does **NOT** contain per-cell historical acquisition dates.
   - The interactive 2020–2030 slider on the dashboard represents a simulated sensitivity projection, **not empirical historical dates**.
2. **Model Training Window**:
   - Original graduation research documents indicate the XGBoost model was developed using satellite feature rasters from circa **2018–2020**.
3. **PRODES Observation Windows**:
   - PRODES 2023: Satellite imagery acquired between August 1, 2022 and July 31, 2023.
   - PRODES 2024: Satellite imagery acquired between August 1, 2023 and July 31, 2024.

---

## 2. Mandatory Renaming Directive

Because the exact prediction timestamp cannot be mathematically pinned to an individual day or month:

> **SCIENTIFIC DECLARATION**:  
> **This experiment must NOT be called "Temporal Forecast Validation."**  
> **It is formally designated as:**  
> **"Retrospective Spatial Association Validation Against Observed PRODES Deforestation"**

---

## 3. Epistemological Distinction

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ PREDICTIVE FORECASTING VS. RETROSPECTIVE SPATIAL ASSOCIATION                           │
├───────────────────────────────┬────────────────────────────────────────────────────────┤
│ Temporal Forecast Validation  │ Retrospective Spatial Association Validation (This Exp)│
├───────────────────────────────┼────────────────────────────────────────────────────────┤
│ • Model trained on date T_0   │ • Static spatial risk surface evaluated against later  │
│ • Features frozen at T_0      │   sovereign clear-cut polygons                         │
│ • Real-time forward test on   │ • Tests whether high spatial vulnerability correlates  │
│   T_1 (e.g. exactly 1 yr out) │   with where actual clearings concentrated             │
│ • Requires exact timestamps   │ • Operates on time-aggregated spatial frontiers        │
└───────────────────────────────┴────────────────────────────────────────────────────────┘
```

This honest distinction prevents claiming that the model "forecasted 2024 with zero error," while accurately reporting the extent to which the spatial risk surface overlaps with observed sovereign satellite deforestation.
