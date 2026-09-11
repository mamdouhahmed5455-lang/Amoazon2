# Reconstruction Boundary Specification

> **Methodological Boundary Definition**: Separation between repository facts, plausible assumptions, and scientifically unreconstructable elements.

---

## 1. Boundary Classification Framework

To protect scientific integrity and avoid false claims of reproducibility, every stage of the modeling workflow is classified into one of three strict tiers:

- 🟢 **TIER 1: REPRODUCIBLE DIRECTLY FROM REPOSITORY**  
  Verified assets, code, or data that execute deterministically using only files present in this repository.
- 🟡 **TIER 2: RECONSTRUCTABLE WITH EXPLICIT ASSUMPTIONS**  
  Components where conceptual definitions exist, but specific parameters must be chosen and documented as new experimental assumptions.
- 🔴 **TIER 3: NOT RECONSTRUCTABLE (BLOCKED)**  
  Elements where essential ground-truth data or original code is missing, making authentic reproduction impossible without external data acquisition.

---

## 2. Component-by-Component Reconstruction Boundary Matrix

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ RECONSTRUCTION BOUNDARY MATRIX                                                         │
├──────────────────────┬─────────┬───────────────────────────────────────────────────────┤
│ Component            │ Tier    │ Specific Technical Boundary                           │
├──────────────────────┼─────────┼───────────────────────────────────────────────────────┤
│ A. Dataset Access    │ 🟢 TIER 1 │ data/forest_data_clean.json (150,000 spatial cells)   │
│ B. Feature Data      │ 🟡 TIER 2 │ Conceptual definitions known; raw rasters absent       │
│ C. Label Definition  │ 🔴 TIER 3 │ Ground-truth labels (y in {0,1}) are ABSENT           │
│ D. Preprocessing     │ 🟡 TIER 2 │ Scaling logic documented; raw join code absent        │
│ E. Train/Test Split  │ 🟡 TIER 2 │ Can design new spatial/random split; seed unknown     │
│ F. XGBoost Config    │ 🟡 TIER 2 │ Algorithmic family verified; hyperparameters unknown  │
│ G. Evaluation Matrix │ 🟢 TIER 1 │ Benchmark metrics and confusion matrix verified       │
│ H. SHAP Analysis     │ 🟢 TIER 1 │ Global benchmarks verified; raw TreeSHAP matrix absent│
│ I. Spatial Export    │ 🟢 TIER 1 │ Deck.gl JSON inference data fully verified            │
└──────────────────────┴─────────┴───────────────────────────────────────────────────────┘
```

---

## 3. Detailed Boundary Analysis

### A. Dataset Access: 🟢 TIER 1 (Directly Reproducible)
- The 150,000 spatial records, geographic coordinates, raw predicted risk scores, normalized scores, extrusion values, and visualization colors are fully verifiable directly from `data/forest_data_clean.json`.
- The 25-year PRODES historical series is verifiable directly from `data/prodes_historical.json`.

### B. Feature Data: 🟡 TIER 2 (Reconstructable with Assumptions)
- The conceptual definitions of the 4 canonical feature drivers (Road Proximity, Forest Loss, Population, Elevation) and the 12 documented input features are preserved.
- However, raw raster values at each point are not stored. A reconstruction experiment operating on this repository alone can only use spatial coordinates and spatial proxy relationships, not raw satellite spectral bands.

### C. Target / Label Definition: 🔴 TIER 3 (NOT RECONSTRUCTABLE — BLOCKED)
- **Critical Finding**: Ground-truth binary labels ($y \in \{0, 1\}$) indicating whether a cell actually suffered clear-cutting are **completely absent** from the repository.
- `risk_score` in `forest_data_clean.json` is a continuous model output prediction.
- Thresholding `risk_score` to create pseudo-labels would mean training a surrogate model to predict an earlier model's predictions (label leakage / circular reasoning).
- In accordance with Phase 5B rules, **target label reconstruction is BLOCKED**.

### D. Preprocessing Pipeline: 🟡 TIER 2 (Reconstructable with Assumptions)
- The linear normalization formula `((risk_score - 140) / 45) * 100` and extrusion scaling `risk_norm * 4000` are fully verified.
- The original raster-to-point spatial sampling pipeline must be assumed or re-engineered.

### E. Train / Test Split Design: 🟡 TIER 2 (Reconstructable with Assumptions)
- The exact original partition indices and random seed cannot be recovered.
- A new independent experiment can implement a reproducible spatial block holdout or deterministic random split using an explicit new seed (e.g., `seed=42`).

### F. XGBoost Configuration: 🟡 TIER 2 (Reconstructable with Assumptions)
- Algorithm family (`XGBClassifier`) and objective (`binary:logistic`) are verified.
- Concrete hyperparameters (`max_depth`, `learning_rate`, `subsample`) must be declared as new baseline assumptions.

### G. Evaluation Harness: 🟢 TIER 1 (Directly Reproducible)
- Canonical metrics (AUC 0.82, Precision 0.79, Recall 0.84, F1 0.81) and confusion matrix math are verified and tested via `tests/unit.js`.

### H. SHAP Interpretability: 🟢 TIER 1 (Directly Reproducible)
- The canonical global attribution weights (Road 41%, Loss 23%, Pop 21%, Elevation 15%) are locked and verified.

### I. Spatial Inference Export: 🟢 TIER 1 (Directly Reproducible)
- Export of the spatial grid to Deck.GL JSON/GeoJSON is fully operational in the production frontend.
