# Model Card: Validated XGBoost Model V2

> **Model Identifier**: `GEOAI-MODEL-V2-20260908`  
> **Model Version**: `2.0.0-validated`  
> **Framework**: XGBoost 3.4.1 (Python 3.14)  
> **Status**: **RESEARCH-ONLY (STRICTLY PROHIBITED FROM PRODUCTION DEPLOYMENT)**

---

## 1. Model Details

- **Developer**: Antigravity GeoAI Scientific Research Team.
- **Model Type**: Gradient Boosted Decision Trees (XGBoost `binary:logistic`).
- **Release Date**: 2026-09-11.
- **Scientific Role**: Independent empirical research experiment testing out-of-time spatial association between pre-observation environmental features and observed INPE PRODES clear-cut events.
- **Relation to Historical Project**: Completely independent from the legacy 2021 graduation model and the 150,000-cell visualization asset. The legacy benchmark (AUC 0.82, Precision 0.79, Recall 0.84, F1 0.81) remains untouched as historical reference.

---

## 2. Intended Use & Scope

### Permitted / Intended Uses
- Retrospective scientific benchmarking of geospatial machine learning architectures in southwestern Amazonia.
- Methodological comparison of spatial vs. spatio-temporal validation protocols.
- Evaluating operational prioritization capacity (lift over base prevalence) for environmental monitoring agencies (e.g., IBAMA, SEDAM).

### Strictly Prohibited Uses
- **Direct Autonomous Law Enforcement Enforcement**: The model must never trigger punitive enforcement actions or fines without independent high-resolution optical satellite verification or field ground-truthing.
- **Land Title Adjudication**: Must not be used in legal proceedings to determine property boundaries or environmental compliance status.
- **Production Dashboard Overwrite**: Strictly prohibited from replacing the 3D web application inference dataset (`data/forest_data_clean.json`).

---

## 3. Geographic & Temporal Scope

- **Geographic Envelope**: State of Rondônia, Brazil (Lat: $[-13.65^\circ, -7.95^\circ]\text{ S}$, Lon: $[-66.75^\circ, -59.85^\circ]\text{ W}$).
- **Spatial Resolution**: 0.05° (~5.5 km spacing), totaling 7,045 active spatial units over the eligible forest domain.
- **Temporal Horizon**:
  - Training Partition: Pre-2022 features $\to$ PRODES 2022 clear-cuts ($N = 7,045$, $41\text{ positives}$).
  - Validation Partition: Pre-2023 features $\to$ PRODES 2023 clear-cuts ($N = 7,045$, $23\text{ positives}$).
  - Final Held-Out Test: Pre-2024 features $\to$ PRODES 2024 clear-cuts ($N = 7,045$, $10\text{ positives}$).

---

## 4. Input Features & Target Label

### Features (4 Groups / 5 Quantitative Variables)
1. `dist_road_km`: Euclidean distance to nearest OpenStreetMap (OSM) highway corridor (km).
2. `dist_hist_loss_km`: Euclidean distance to nearest PRODES clear-cut occurring strictly prior to observation year (km).
3. `prior_loss_dens`: Count of PRODES clear-cuts within 20 km buffer occurring strictly prior to observation year.
4. `pop_pressure`: Gravity-decay potential model of IBGE 2022 municipal census population.
5. `elevation_m`: Real physical elevation in meters above sea level from Copernicus DEM GLO-90.

### Target Variable
- Binary indicator $y \in \{0, 1\}$ derived from official INPE TerraBrasilis PRODES satellite clear-cuts ($\ge 6.25\text{ ha}$). Zero pseudo-labels or model-derived scores used.

---

## 5. Performance Metrics (Held-Out Test Set: PRODES 2024)

- **ROC-AUC**: **0.7474** (95% Bootstrap CI: $[0.5837, 0.9036]$)
- **PR-AUC**: **0.005534** (95% Bootstrap CI: $[0.001854, 0.014138]$)
- **Brier Score**: **0.00693**; probabilistic calibration is not established. Outputs are interpreted as relative spatial risk scores.
- **Top-5% Lift**: **4.0x** over baseline prevalence (2 of 10 test events captured in top 352 cells).
- **Top-10% Lift**: The top 10% of ranked cells captured 5 of 10 observed 2024 events, corresponding to 5.0x enrichment relative to overall event prevalence in this test sample. This is retrospective ranking evidence, not a measured field-operations efficiency gain.
- **TreeSHAP Attributions**: Historical Loss 53.7%, Road Proximity 17.4%, Physical Elevation 16.4%, Population Pressure 12.5%.

---

## 6. Known Limitations

1. **Extreme Class Imbalance**: Real deforestation events occur in only ~0.14% to 0.58% of eligible forest domain cells annually, creating broad bootstrap confidence intervals ($[0.58, 0.90]$).
2. **Missing Clandestine Roads**: Only primary highway corridors (OSM) are modeled; unmapped clandestine logging spurs in remote areas lead to false negatives.
3. **Population Temporal Limitation**: 2022 Census data serves as an out-of-time static proxy for 2022 and 2023, while temporally valid for 2024.
4. **Resolution Coarseness**: 5.5 km grid spacing aggregates local landscape dynamics.

---

## 7. Human Oversight & Governance

All model outputs are relative spatial risk scores, not deterministic forecasts. Any deployment scenario must mandate human expert review by remote sensing specialists before allocating field inspection assets.
