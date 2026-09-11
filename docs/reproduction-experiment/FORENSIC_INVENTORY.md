# Pre-Experiment Forensic Inventory: Upstream Artifact Audit

> **Audit Standard**: Pre-Experimental Forensic Recovery & Provenance Inspection  
> **Target**: Comprehensive forensic trace analysis of all ML assets, parameters, and evidence across the repository.

---

## 1. Executive Summary of Forensic Findings

Before attempting any reproduction experiment, an exhaustive forensic sweep was conducted across all files in `data/`, `scripts/`, `docs/`, `outputs/`, `tests/`, `pages/`, and `README.md`. 

The central finding is:
1. **The precomputed spatial inference dataset (`data/forest_data_clean.json`) is intact** with 150,000 spatial records, coordinates, and precomputed risk scores.
2. **The evaluation metrics and confusion matrix are documented** (AUC 0.82, Precision 0.79, Recall 0.84, F1 0.81).
3. **The upstream ground-truth labels ($y \in \{0, 1\}$) are ABSENT** from the repository. The dataset contains model risk outputs, not ground-truth training labels.
4. **The original Python model training code and serialized model binary are ABSENT** from the repository.

---

## 2. Forensic Itemization & Evidence Ledger

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ FORENSIC EVIDENCE LEDGER                                                               │
├───────────────────────────────┬────────────────────────┬──────────────────────┬────────┤
│ Forensic Dimension            │ Location / Artifact    │ Documented Value     │ Status │
├───────────────────────────────┼────────────────────────┼──────────────────────┼────────┤
│ 1. Dataset Rows               │ forest_data_clean.json │ 150,000 records      │ VERIF  │
│ 2. Spatial Envelope           │ forest_data_clean.json │ Rondônia, Brazil     │ VERIF  │
│ 3. Continuous Risk Output     │ forest_data_clean.json │ risk_score: 160–178  │ VERIF  │
│ 4. Normalized Risk Output     │ forest_data_clean.json │ risk_norm: 0.8989–1  │ VERIF  │
│ 5. Visual Extrusion Formula   │ forest_data_clean.json │ elevation=norm*4000  │ VERIF  │
│ 6. Ground-Truth Binary Labels │ Entire Repository      │ None (y in {0,1})    │ NOTREC │
│ 7. Canonical AUC Metric       │ constants.js & Report  │ 0.82                 │ VERIF  │
│ 8. Canonical Precision Metric │ constants.js & Report  │ 0.79                 │ VERIF  │
│ 9. Canonical Recall Metric    │ constants.js & Report  │ 0.84                 │ VERIF  │
│ 10. Canonical F1 Metric       │ constants.js & Report  │ 0.81                 │ VERIF  │
│ 11. Confusion Matrix TP       │ pages/ai-model.html    │ 12,450               │ PART   │
│ 12. Confusion Matrix FN       │ pages/ai-model.html    │ 2,380                │ PART   │
│ 13. Confusion Matrix FP       │ pages/ai-model.html    │ 3,290                │ PART   │
│ 14. Confusion Matrix TN       │ pages/ai-model.html    │ 131,880              │ PART   │
│ 15. Decision Threshold        │ pages/ai-model.html    │ 0.5                  │ VERIF  │
│ 16. Documented Input Features │ pages/ai-model.html    │ 12 variables         │ PART   │
│ 17. Canonical SHAP Drivers    │ constants.js & Report  │ 41 / 23 / 21 / 15    │ VERIF  │
│ 18. Training Script Code      │ analysis.py (legacy)   │ Missing from repo    │ NOTREC │
│ 19. Serialized Model Binary   │ Entire Repository      │ Missing (.json/.pkl) │ NOTREC │
│ 20. Train/Test Split Index    │ Entire Repository      │ Unrecorded           │ NOTREC │
│ 21. Random Seed for Split     │ Entire Repository      │ Unrecorded           │ NOTREC │
│ 22. XGBoost Hyperparameters   │ Entire Repository      │ Unrecorded           │ NOTREC │
└────────────────────────────────────────────────────────────────────────────────────────┘
```
*Legend: `VERIF` = Verified in Codebase; `PART` = Partially Verified in Docs; `NOTREC` = Not Recoverable from Repository.*

---

## 3. Detailed Forensic Analysis by Category

### A. Dataset & Spatial Features
- **Evidence Found**:
  - `data/forest_data_clean.json`: Array of 150,000 JSON records.
  - Keys: `lat`, `lon`, `risk_score`, `risk_norm`, `elevation`, `color`.
  - Coordinates span $[-13.627, -7.982]^\circ\text{ S}$, $[-66.721, -59.904]^\circ\text{ W}$.
- **Evidence Missing**:
  - Raw GIS rasters (Hansen Global Forest Change, SRTM DEM GeoTIFF, Landsat 8 scenes, WorldPop rasters) are not present.
  - The intermediate feature matrix (table containing the 12 tabular columns per cell) was not stored in the repository.

### B. Target Variable & Labels
- **Evidence Found**:
  - `docs/Graduation_Project_Report.md` describes the target conceptually as historical primary forest loss events.
  - `pages/ai-model.html` provides the resulting evaluation counts: 14,830 actual positive cases ($12,450\text{ TP} + 2,380\text{ FN}$) and 135,170 actual negative cases ($3,290\text{ FP} + 131,880\text{ TN}$).
- **Evidence Missing**:
  - **Zero ground-truth binary label columns exist in `data/forest_data_clean.json`**.
  - The dataset contains only model output predictions (`risk_score` integer range 160–178).
  - *Scientific Implication*: Training an ML model on `risk_score` thresholding would mean training a model to predict its own precomputed predictions, not reproducing the original model.

### C. Model Hyperparameters & Configuration
- **Evidence Found**:
  - Algorithm: XGBoost (`XGBClassifier`) with logistic objective function (`binary:logistic`).
  - Evaluation Metric: ROC-AUC.
- **Evidence Missing**:
  - `n_estimators`, `learning_rate`, `max_depth`, `subsample`, `colsample_bytree`, `gamma`, `min_child_weight`, and `scale_pos_weight` are completely absent from the codebase.

### D. Data Splitting & Cross-Validation
- **Evidence Found**:
  - The total sample size evaluated in the confusion matrix is exactly 150,000.
- **Evidence Missing**:
  - Train/test percentage split ratio (e.g., 80/20 vs 70/30) is not documented.
  - Whether the confusion matrix represents test-only or entire-dataset cross-validation is unstated.
  - The random state seed is unrecorded.

### E. SHAP & Feature Attribution
- **Evidence Found**:
  - Global feature weights: Road Proximity (41%), Forest Loss (23%), Population (21%), Elevation Constraints (15%).
  - Total: Exactly 100%.
- **Evidence Missing**:
  - Serialized `.npy`/`.npz` Shapley value matrices or `shap.TreeExplainer` dump files are absent.
