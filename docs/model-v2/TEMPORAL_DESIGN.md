# Temporal Design & Cutoff Protocol

> **Model Architecture**: Validated XGBoost Model V2  
> **Guiding Axiom**: Strict Target-Year PRODES Isolation & Documented Temporal Cutoffs  
> **Evaluation Horizon**: Annual Retrospective Out-of-Time Spatial Evaluation

---

## 1. The Core Temporal Principle & Cutoff Distinction

In Earth observation modeling, temporal validity requires auditing when data was released relative to the prediction cutoff. Rather than claiming a blanket "zero temporal leakage", Model V2 explicitly separates two distinct components:

1. **PRODES Historical-Loss Features (Zero Future Target-Year Leakage)**: Strictly verified. For any target year $T$, features query only historical clear-cut polygons from years $< T$. Target-year $T$ polygons are strictly quarantined and used exclusively as binary ground-truth labels.
2. **Population / Demographic Features (Documented Temporal Limitation)**:
   - **2022 population feature**: Out-of-time static proxy (IBGE 2022 Census published June 28, 2023, after the July 31, 2021 cutoff).
   - **2023 population feature**: Out-of-time static proxy (published 11 months after the July 31, 2022 cutoff).
   - **2024 population feature**: Temporally valid (published June 28, 2023, before the July 31, 2023 prediction cutoff).

*(Note: Official INPE PRODES monitoring years run from August 1 of year $T$ to July 31 of year $T+1$).*

---

## 2. Source Temporal Validity Audit

Each candidate predictor source was audited against its empirical availability date and temporal alignment:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ SOURCE TEMPORAL AUDIT & CUTOFF SPECIFICATION                                                           │
├─────────────────────┬──────────────┬───────────────────┬──────────────┬───────────────┬────────────────┤
│ Source Name         │ Data Vintage │ Availability Date │ Dynamic/Stat │ Leakage Risk  │ Validity Check │
├─────────────────────┼──────────────┼───────────────────┼──────────────┼───────────────┼────────────────┤
│ OpenStreetMap (OSM) │ 2021–2024    │ Established       │ Static       │ None          │ VALID (Static) │
│ INPE PRODES 2021    │ Aug20–Jul21  │ November 2021     │ Dynamic      │ Controlled    │ VALID          │
│ INPE PRODES 2022    │ Aug21–Jul22  │ November 2022     │ Dynamic      │ Controlled    │ VALID          │
│ INPE PRODES 2023    │ Aug22–Jul23  │ November 2023     │ Dynamic      │ Controlled    │ VALID          │
│ INPE PRODES 2024    │ Aug23–Jul24  │ November 2024     │ Dynamic      │ Label Only    │ VALID (Label)  │
│ IBGE 2022 Census Pop│ 2022 Enum.   │ June 28, 2023     │ Static Proxy │ See Below     │ Part-Specific  │
│ Copernicus DEM 90m  │ 2011–2015    │ 2019 Open Release │ Static       │ None          │ VALID (Static) │
└─────────────────────┴──────────────┴───────────────────┴──────────────┴───────────────┴────────────────┘
```

### Population Source Temporal Validity by Target Year

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ POPULATION SOURCE TEMPORAL AUDIT BY TARGET YEAR                                                                │
├─────────────┬───────────────────┬──────────────────────┬──────────────────────┬────────────────────────────────┤
│ Target Year │ Population Source │ Information Avail.   │ Valid Before Cutoff? │ Status / Empirical Role        │
├─────────────┼───────────────────┼──────────────────────┼──────────────────────┼────────────────────────────────┤
│ 2022 (Train)│ IBGE 2022 Census  │ June 28, 2023        │ NO                   │ Out-of-time static proxy       │
│             │                   │                      │                      │ (municipal hierarchy proxy).   │
├─────────────┼───────────────────┼──────────────────────┼──────────────────────┼────────────────────────────────┤
│ 2023 (Val)  │ IBGE 2022 Census  │ June 28, 2023        │ NO                   │ Out-of-time static proxy       │
│             │                   │                      │                      │ (published 11 mos post cutoff).│
├─────────────┼───────────────────┼──────────────────────┼──────────────────────┼────────────────────────────────┤
│ 2024 (Test) │ IBGE 2022 Census  │ June 28, 2023        │ YES                  │ Temporally valid               │
│             │                   │                      │                      │ (published 1 mo before cutoff).│
└─────────────┴───────────────────┴──────────────────────┴──────────────────────┴────────────────────────────────┘
```
*Empirical Sensitivity Note*: In the ablation study, Model B (trained and evaluated with zero population information) achieved ROC-AUC = 0.7349 on the test set, demonstrating that Model V2's primary predictive signal does not depend on population data.

---

## 3. Candidate Temporal Partition Analysis

We evaluated three candidate observation years ($T \in \{2022, 2023, 2024\}$) for partitioning into Training, Validation, and Held-Out Test sets:

### Partition 1: Training Set (Candidate Target Year 2022)
- **Monitoring Period**: August 1, 2021 to July 31, 2022 (PRODES 2022).
- **Feature Cutoff**: July 31, 2021.
- **Historical Loss Feature**: Uses strictly PRODES 2021 clear-cuts. PRODES 2022 clear-cuts are strictly excluded from feature computation.
- **Road & DEM Features**: Static infrastructure and topography.
- **Population Feature**: Uses IBGE 2022 settlement gravity as a static structural geographic proxy for municipal settlement pull. *Limitation noted*: 2022 Census was enumerated in late 2022, but municipality rankings and settlement hierarchy in Rondônia (Porto Velho, Ji-Paraná, Ariquemes, Cacoal, Vilhena) are long-standing structural features.
- **Partition Status**: **VALID FOR TRAINING BASELINE**.

### Partition 2: Validation Set (Candidate Target Year 2023)
- **Monitoring Period**: August 1, 2022 to July 31, 2023 (PRODES 2023).
- **Feature Cutoff**: July 31, 2022.
- **Historical Loss Feature**: Uses PRODES 2021 and 2022 clear-cuts. PRODES 2023 clear-cuts are strictly excluded from feature computation.
- **Partition Status**: **VALID FOR VALIDATION TUNING**.

### Partition 3: Held-Out Final Test Set (Candidate Target Year 2024)
- **Monitoring Period**: August 1, 2023 to July 31, 2024 (PRODES 2024).
- **Feature Cutoff**: July 31, 2023.
- **Historical Loss Feature**: Uses strictly PRODES 2021, 2022, and 2023 clear-cuts. PRODES 2024 clear-cuts are strictly excluded from feature computation.
- **Population Feature**: IBGE official 2022 Census results were officially published on **June 28, 2023**, one month prior to the August 1, 2023 start of PRODES 2024. Therefore, for the final test set, the IBGE 2022 census data was publicly available *before* the target observation period commenced.
- **Partition Status**: **STRICTLY VALID FOR FINAL HELD-OUT TEST**.

---

## 4. Multi-Year Panel Partitioning Matrix

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ MODEL V2 TEMPORAL PARTITION MATRIX                                                     │
├─────────────┬─────────────────┬──────────────────────┬─────────────────────────────────┤
│ Partition   │ Feature Cutoff  │ Target Period        │ Primary Function                │
├─────────────┼─────────────────┼──────────────────────┼─────────────────────────────────┤
│ Training    │ July 31, 2021   │ PRODES 2022          │ Fit tree split weights          │
│             │ (<= 2021 Data)  │ (Aug 2021–Jul 2022)  │ & gradient descent              │
├─────────────┼─────────────────┼──────────────────────┼─────────────────────────────────┤
│ Validation  │ July 31, 2022   │ PRODES 2023          │ Tune early stopping iterations  │
│             │ (<= 2022 Data)  │ (Aug 2022–Jul 2023)  │ & select hyperparameter bounds  │
├─────────────┼─────────────────┼──────────────────────┼─────────────────────────────────┤
│ Final Test  │ July 31, 2023   │ PRODES 2024          │ Untouched out-of-time test      │
│ (Held-Out)  │ (<= 2023 Data)  │ (Aug 2023–Jul 2024)  │ for final benchmark reporting   │
└─────────────┴─────────────────┴──────────────────────┴─────────────────────────────────┘
```

---

## 5. Strict Leakage Prevention Rules

1. **Target-Year Polygons Never in Features**:
   - For 2024 test predictions, 2024 PRODES clear-cut polygons are used **only** as the binary label indicator $y$. They are strictly quarantined from the feature extraction code.
2. **Deterministic Module Isolation**:
   - `build_features.py` accepts `target_year` and only queries years $< \text{target\_year}$.
   - `build_labels.py` accepts `target_year` and queries only $\text{target\_year}$.
   - Cross-talk between these modules is prevented by explicit parameter interfaces and automated unit tests.
3. **No Test Set Feedback**:
   - The final test set (2024) is evaluated exactly once at the conclusion of training. No hyperparameter or feature adjustments are made based on 2024 test metrics.
