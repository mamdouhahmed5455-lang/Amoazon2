# Technical Evidence Appendix: Scientific Validation, Empirical Benchmarks & Reproducibility

> **Competition Track**: Technology Creativity Track  
> **Award**: Bibliotheca Alexandrina Youth Creators Award 2026  
> **Project**: Amazon Deforestation Risk Intelligence (Rondônia, Brazil)  
> **Canonical Platform URL**: [https://amazon-deforestation-risk-3d.vercel.app](https://amazon-deforestation-risk-3d.vercel.app)  
> **GitHub Repository**: [https://github.com/mamdouhahmed5455-lang/Amoazon2](https://github.com/mamdouhahmed5455-lang/Amoazon2)  

---

> [!IMPORTANT]
> **Foundational Scientific Disclaimer**:  
> "Model V2 is an independent research experiment and is not presented as a reproduction of the original benchmark."  
> The repository maintains a strict **Dual-Track Evaluation Architecture**: the original documented project benchmark (ROC-AUC 0.82) is preserved intact as historical baseline documentation, while Model V2 represents an independently trained, open-source, fully reproducible scientific audit.

---

## 1. System Architecture

The Amazon Deforestation Risk Intelligence platform operates as a hybrid architecture combining an offline reproducible Python data-science pipeline with an ultra-lightweight, high-performance static client-side geospatial dashboard:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ END-TO-END SYSTEM ARCHITECTURE                                                                         │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. DATA HARVESTING & PROVENANCE LAYER (Offline Python Engine)                                         │
│    • INPE TerraBrasilis WFS Services: Annual PRODES deforestation shapefiles (2021–2024)               │
│    • OpenStreetMap Overpass API: Official road vectors (Federal highways: BR-364, BR-421, BR-429)     │
│    • IBGE API: Decennial 2022 demographic census figures for 52 Rondônia municipalities               │
│    • Copernicus GLO-90m DEM: Global digital elevation raster via Open-Meteo elevation API              │
│    • INPE Sovereignty & Mask: Official Rondônia state boundary & natural non-forest mask (3,265 units) │
│                                                                                                        │
│ 2. GEOSPATIAL FEATURE ENGINEERING & SPATIAL INDEXING                                                   │
│    • Neutral Spatial Unit: 0.05° (~5.5 km) systematic lattice across Rondônia                          │
│    • Eligible Forest Domain: Exactly 7,045 non-mask forest cells per monitoring cycle (N=21,135 total) │
│    • Nearest-Neighbor & Spatial Joins: STRtree & Scipy cKDTree Euclidean distance transforms           │
│    • Zero Score Inheritance: Features constructed strictly from raw physical & demographic layers     │
│                                                                                                        │
│ 3. MODEL TRAINING & EXPLAINABLE AI (XGBoost + TreeSHAP)                                                │
│    • Gradient Boosted Decision Trees with Log-Loss Objective                                           │
│    • Rolling Out-of-Time Partitions: Train (2022) ➔ Validation (2023) ➔ Test (2024)                      │
│    • Explainable AI: TreeSHAP additive feature attribution for global and local driver ranking         │
│                                                                                                        │
│ 4. CLIENT-SIDE PRESENTATION & ANALYTICS (Static Web Architecture)                                      │
│    • Deck.gl WebGL Engine + Mapbox GL JS Spatial Canvas (GPU-accelerated rendering)                    │
│    • Responsive 2D/3D visualization of 150,000 empirical spatial cells                                 │
│    • Client-side parametric policy sensitivity recalculation engine                                    │
│    • Hosted entirely on Vercel Edge with zero server-side database latency                             │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Data Sources & Provenance

All data used in the Model V2 scientific audit are authoritative, sovereign, and publicly accessible. No synthetic data, proprietary vendor feeds, or unrecorded sources were utilized:

| Data Layer | Authoritative Provider | Primary Asset / Endpoint | Coordinate Reference System | Temporal Window | Role in Pipeline |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Clear-Cut Polygons** | INPE TerraBrasilis | PRODES Amazonia WFS / SHP | SIRGAS 2000 (EPSG:4674) | 2021–2024 | Ground-truth labels & historical loss features |
| **Road Network** | OpenStreetMap (OSM) | Overpass API Highway Query | WGS 84 (EPSG:4326) | Snapshot (2024) | Transport corridor proximity calculations |
| **Demographics** | IBGE | 2022 Decennial Census API | WGS 84 (EPSG:4326) | 2022 Census | Population pressure index calculation |
| **Elevation** | Copernicus / ESA | GLO-90m Digital Elevation | WGS 84 (EPSG:4326) | Continuous DEM | Physical topographic accessibility filter |
| **Non-Forest Mask** | INPE TerraBrasilis | PRODES Natural Non-Forest | SIRGAS 2000 (EPSG:4674) | Official Mask | Masking water, savannah, and rocky outcrops |

---

## 3. Feature Groups

Predictors in Model V2 are structured into **4 canonical feature groups** comprising 5 distinct mathematical variables, constructed with zero inheritance of existing production risk scores:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ MODEL V2 FEATURE SPECIFICATION MATRIX                                                                  │
├─────────────────────┬────────────────────┬───────────┬─────────────────────────────────────────────────┤
│ Feature Name        │ Feature Group      │ Unit      │ Definition & Construction Method                │
├─────────────────────┼────────────────────┼───────────┼─────────────────────────────────────────────────┤
│ dist_road_km        │ Road Proximity     │ Kilometers│ Euclidean distance from cell centroid to the    │
│                     │                    │           │ nearest primary, secondary, or trunk highway.   │
│ dist_hist_loss_km   │ Historical Loss    │ Kilometers│ Euclidean distance to the nearest verified      │
│                     │                    │           │ PRODES clearing occurring in year T-1.          │
│ prior_loss_dens     │ Historical Loss    │ Count     │ Total number of PRODES clearings within a 20 km │
│                     │                    │           │ radius in the preceding observation year (T-1). │
│ pop_pressure        │ Population Pressure│ Index     │ Distance-decayed population sum from all 52     │
│                     │                    │           │ municipality seats: Sum(Pop_m / (Dist_m + 10)). │
│ elevation_m         │ Physical Elevation │ Meters    │ Orthometric terrain elevation above sea level   │
│                     │                    │           │ sampled from Copernicus 90m DEM.                │
└─────────────────────┴────────────────────┴───────────┴─────────────────────────────────────────────────┘
```

---

## 4. Model Methodology

Model V2 uses an extreme gradient boosted decision tree (XGBoost) architecture tuned for extreme class imbalance:

- **Algorithm**: `xgboost.XGBClassifier`
- **Objective Function**: `binary:logistic` (Log-Loss)
- **Evaluation Metric**: Area Under the Precision-Recall Curve (`aucpr`) and ROC-AUC (`auc`)
- **Key Hyperparameters**:
  - `max_depth`: 4 (restricting tree depth to control overfitting on sparse positives)
  - `learning_rate`: 0.05
  - `n_estimators`: 150 (with early stopping on validation fold)
  - `scale_pos_weight`: Balanced weighting according to training partition prevalence
  - `subsample`: 0.8
  - `colsample_bytree`: 0.8

---

## 5. Original Documented Benchmark

The project repository preserves the baseline documented benchmark established during the initial research phase:

```
┌────────────────────────────────────────────────────────────────────────┐
│ TRACK 1: ORIGINAL DOCUMENTED PROJECT BENCHMARK                         │
├───────────────────────────────┬────────────────────────────────────────┤
│ Metric                        │ Reported Value                         │
├───────────────────────────────┼────────────────────────────────────────┤
│ Area Under ROC Curve (ROC-AUC)│ 0.82                                   │
│ Precision                     │ 0.79                                   │
│ Recall                        │ 0.84                                   │
│ F1 Score                      │ 0.81                                   │
│ Study Geography               │ State of Rondônia (150,000 cells)      │
│ Role in Repository            │ Historical Project Reference           │
└───────────────────────────────┴────────────────────────────────────────┘
```
*Scientific Preservation Rule*: These metrics are preserved intact as documented baseline records and are not modified, overwritten, or reinterpreted.

---

## 6. Independent Model V2

To meet the highest standards of scientific reproducibility, Model V2 was independently engineered from raw authoritative sources:

```
┌────────────────────────────────────────────────────────────────────────┐
│ TRACK 2: INDEPENDENT REPRODUCIBLE MODEL V2                             │
├───────────────────────────────┬────────────────────────────────────────┤
│ Metric / Parameter            │ Audited Value                          │
├───────────────────────────────┼────────────────────────────────────────┤
│ Model Version                 │ `v2.0.0-validated`                     │
│ Evaluated Target Year         │ PRODES 2024 (Held-Out Test Partition)  │
│ Total Evaluated Units         │ 7,045 Eligible Forest Cells            │
│ Verified Positive Events      │ 10 Clear-Cut Events                    │
│ Base Rate Prevalence          │ 0.1419% (1 positive per 705 cells)     │
│ Out-of-Time ROC-AUC           │ 0.7474                                 │
│ 95% Bootstrap Confidence Int. │ [0.5837, 0.9036] (1,000 iterations)   │
│ Area Under PR Curve (PR-AUC)  │ 0.005534 (95% CI: [0.0019, 0.0141])    │
│ Brier Score                   │ 0.00693 (Calibration not established)  │
│ Retrospective Top-10% Lift    │ 5.0x Enrichment Factor                 │
│ Evidence Classification       │ Moderate Evidence                      │
└───────────────────────────────┴────────────────────────────────────────┘
```

---

## 7. 2024 Held-Out Evaluation

Model V2 evaluation follows a strict **rolling out-of-time temporal validation design** to eliminate temporal lookahead bias:

```
┌────────────────────────────────────────────────────────────────────────┐
│ STRICT OUT-OF-TIME PARTITIONING PROTOCOL                               │
├────────────────┬─────────────┬─────────────┬─────────────┬─────────────┤
│ Partition Name │ Target Year │ Input Years │ Total Cells │ Positives   │
├────────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ Training       │ PRODES 2022 │ 2021 Data   │ 7,045       │ 41 (0.58%)  │
│ Validation     │ PRODES 2023 │ 2022 Data   │ 7,045       │ 23 (0.33%)  │
│ Held-Out Test  │ PRODES 2024 │ 2023 Data   │ 7,045       │ 10 (0.14%)  │
└────────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```
In the 2024 held-out evaluation, all historical loss features were computed exclusively from clearings occurring in or before 2023. The model had zero access to 2024 spatial patterns during training or hyperparameter tuning.

---

## 8. ROC-AUC and Confidence Interval

On the held-out 2024 test partition, Model V2 achieved an **ROC-AUC of 0.7474**.

To account for the small number of positive events (10 events across 7,045 units), a rigorous **1,000-iteration empirical bootstrap** was executed:
- **Mean Bootstrap ROC-AUC**: 0.7474
- **95% Bootstrap Confidence Interval**: **[0.5837, 0.9036]**
- **Null Comparison**: The lower bound of the 95% confidence interval ($0.5837$) strictly exceeds the random guessing baseline ($0.5000$), demonstrating statistically significant spatial discrimination.

---

## 9. PR-AUC (Precision-Recall Area)

- **Observed PR-AUC**: **0.005534** (95% Bootstrap CI: **[0.001854, 0.014138]**)
- **Analytical Context**: In extreme rare-event settings (base rate = $0.1419\%$), PR-AUC is heavily bounded by the rarity of the target class. 
- **Baseline Comparison**: The random ranking baseline PR-AUC equals the base rate ($0.001419$). Model V2 achieves a PR-AUC nearly **3.9 times higher** than random guessing, confirming meaningful predictive concentration in the precision-recall domain.

---

## 10. Brier Score & Calibration Disclaimer

- **Observed Brier Score**: **0.00693**
- **Calibration Status**: **Calibration not established.**

> [!WARNING]
> **Probabilistic Interpretation Rule**:  
> Because the annual target event rate is exceptionally rare ($10$ positives in $7,045$ cells), standard logistic sigmoid calibration curves cannot be reliably established. Model V2 output values must be interpreted strictly as **relative spatial risk rankings**, rather than calibrated, frequentist probabilities of physical tree loss.

---

## 11. Top-K Retrospective Enrichment

Under operational constraints, monitoring agencies can inspect only a small fraction of their jurisdiction. Model V2 was evaluated across pre-declared inspection capacity tiers:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ OPERATIONAL CAPACITY ENRICHMENT (HELD-OUT 2024 TEST PARTITION, N=7,045)                │
├─────────────┬──────────────┬───────────────┬───────────────────┬───────────┬───────────┤
│ Capacity    │ Cells Insp.  │ Positives Hit │ Total Test Events │ Recall    │ Lift      │
├─────────────┼──────────────┼───────────────┼───────────────────┼───────────┼───────────┤
│ Top 0.1%    │ 7 cells      │ 0             │ 10                │ 0.0%      │ 0.0x      │
│ Top 1.0%    │ 70 cells     │ 0             │ 10                │ 0.0%      │ 0.0x      │
│ Top 5.0%    │ 352 cells    │ 2             │ 10                │ 20.0%     │ 4.0x      │
│ Top 10.0%   │ 704 cells    │ 5             │ 10                │ 50.0%     │ 5.0x      │
│ Top 20.0%   │ 1,409 cells  │ 6             │ 10                │ 60.0%     │ 3.0x      │
└─────────────┴──────────────┴───────────────┴───────────────────┴───────────┴───────────┘
```

**Key Takeaway**:  
Focusing inspection effort on the **top 10% highest-ranked cells captured 50.0% of all observed clear-cut events** (5 out of 10), representing a **5.0x retrospective enrichment** over uniform random inspection.  
*Scientific Caution*: This demonstrates retrospective ranking concentration in this test partition; it is not a measured claim of field patrol efficiency gains.

---

## 12. Spatial Holdout Caveats

To test spatial transferability, the 2024 test partition was divided geographically along Latitude $-11.0^\circ$:
- **Northern Partition (Active Frontier / BR-364 Corridor)**:
  - 3,777 cells | 6 positive events (prevalence 0.1589%)
  - **ROC-AUC: 0.6109** | PR-AUC: 0.00403
- **Southern Partition (Interior Core / Guaporé Valley)**:
  - 3,268 cells | 4 positive events (prevalence 0.1224%)
  - **ROC-AUC: 0.9092** | PR-AUC: 0.0152

**Critical Spatial Caveat**:  
While the southern partition shows high apparent discrimination (ROC-AUC 0.9092), this metric is derived from only **4 positive events**. In the more active northern frontier with 6 events, clear-cuts were more widely dispersed, resulting in lower discrimination (ROC-AUC 0.6109). Spatial holdout metrics must be interpreted with extreme caution due to small sample sizes.

---

## 13. Temporal Qualifications

A rigorous data-integrity review identified specific temporal boundaries:

1. **PRODES Historical Loss Features**: **Temporally Valid**. Calculated exclusively from $T-1$ satellite polygons; zero target-year PRODES leakage exists.
2. **OpenStreetMap Highways**: **Static Infrastructure Proxy**. Road vectors reflect modern OpenStreetMap geometry, serving as a static proxy for accessibility corridors.
3. **IBGE Population Pressure**: **Static Decennial Proxy**. Sourced from the official 2022 Decennial Census:
   - For **2024 Evaluation**: **Temporally Valid** (2022 census data was officially available prior to 2024).
   - For **2022 & 2023 Partitions**: Represents an **out-of-time static proxy** (census data collected during 2022 was published subsequent to early 2022).

---

## 14. Reproducibility

The entire Model V2 research pipeline is fully automated and deterministic:

- **Single Execution Command**:
  ```bash
  python scripts/model_v2/run.py
  ```
- **Automated Workflow**:
  1. Verifies local data assets and schema integrity.
  2. Constructs the 7,045 eligible forest cell lattice.
  3. Computes spatial distance matrices via KDTree.
  4. Generates temporal features for 2022, 2023, and 2024.
  5. Trains XGBoost with fixed random seeds (`seed=42`).
  6. Evaluates holdout metrics and executes 1,000 bootstrap iterations.
  7. Computes exact TreeSHAP attribution matrices.
  8. Exports audited JSON summaries to `docs/model-v2/` and `artifacts/model_v2/`.

---

## 15. Automated Test Evidence

The codebase is protected by comprehensive automated test suites covering data ingestion, spatial indexing, feature engineering, model training, evaluation, and web components:

```
┌────────────────────────────────────────────────────────────────────────┐
│ AUTOMATED REGRESSION & VALIDATION TEST SUITE SUMMARY                   │
├────────────────────────────────┬───────────────┬───────────────────────┤
│ Test Suite                     │ Total Tests   │ Verification Status   │
├────────────────────────────────┼───────────────┼───────────────────────┤
│ JavaScript Platform Unit Tests │ 38 tests      │ 38 / 38 PASSING (100%)│
│ Historical PRODES Series Tests │ 9 tests       │ 9 / 9 PASSING (100%)  │
│ Python Scientific Master Suite │ 52 tests      │ 52 / 52 PASSING (100%)│
├────────────────────────────────┼───────────────┼───────────────────────┤
│ TOTAL AUTOMATED TEST SUITE     │ 99 tests      │ 99 / 99 PASSING (100%)│
└────────────────────────────────┴───────────────┴───────────────────────┘
```

The 52 Python unit tests explicitly validate:
- `test_acquire_prodes.py`: WFS polygon ingestion and CRS reprojection.
- `test_labels.py`: Intersection rules and non-forest mask filtering.
- `test_features.py`: Distance calculation bounds and NaN assertions.
- `test_split.py`: Strict out-of-time temporal cutoffs and zero-overlap splits.
- `test_train.py`: Deterministic seed reproducibility and hyperparameter locking.
- `test_evaluate.py`: Bootstrap CI bounds, PR-AUC calculations, and Top-K logic.
- `test_provenance.py`: Hash verification of all raw input data artifacts.
- `test_pipeline.py`: End-to-end integration and JSON artifact validation.

---

## 16. Known Limitations

In accordance with scientific best practices, the following structural limitations are acknowledged:

1. **Small Positive Sample Count**: With only 10 positive clear-cut events in the 2024 held-out partition, confidence intervals are wide ($[0.5837, 0.9036]$). While the statistical signal is moderate, larger multi-year test panels are required for definitive operational deployment.
2. **Low Precision at Rare Prevalence**: At a 0.14% base event rate, achieving high precision is mathematically challenging. The Top-10% priority tier achieves a precision of $0.710\%$ ($5$ events in $704$ inspections). Ground inspection protocols must account for high false-positive rates during screening.
3. **Absence of Active Radar (SAR)**: Optical sensors cannot penetrate persistent cloud cover during the Amazonian rainy season. The current model does not incorporate Sentinel-1 SAR backscatter anomalies.
4. **Static Demographic & Road Proxies**: Road construction often occurs illicitly and rapidly. Relying on official OSM road networks may miss active logging spurs cut into primary forest.
5. **No Direct Causal Inference**: Statistical correlations between roads and clearing events do not constitute economic or behavioral causality. Policy simulations represent mathematical sensitivities, not guaranteed real-world outcomes.
