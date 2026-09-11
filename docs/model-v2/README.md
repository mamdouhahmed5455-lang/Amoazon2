# Model V2: Independent Reproducible XGBoost Pipeline

> **Research Architecture**: Validated XGBoost Model V2  
> **Scientific Target**: Retrospective Out-of-Time Spatial Evaluation on INPE PRODES Deforestation  
> **Status**: Research-Only (Independent Empirical Study; Production Frozen)

---

## 1. Quick Start (Single-Command Execution)

To reproduce the entire data assembly, feature extraction, model training, 3-perspective evaluation, ablation study, and TreeSHAP explainability pipeline from scratch:

```powershell
# From the repository root:
python scripts/model_v2/run.py
```

Or using the dedicated virtual environment:
```powershell
D:\venv\Scripts\python.exe scripts/model_v2/run.py
```

---

## 2. Environment & Dependencies

- **Python Version**: Python 3.14.6 (64-bit Windows)
- **Key Libraries**:
  - `xgboost == 3.4.1`
  - `scikit-learn == 1.9.1`
  - `scipy == 1.18.1`
  - `shap == 0.52.0`
  - `shapely == 2.1.2`
  - `pandas == 3.0.5`
  - `numpy == 2.5.3`
  - `pyarrow == 25.0.1`
  - `geopandas == 1.1.4`
  - `matplotlib == 3.11.1`

---

## 3. Pipeline Architecture & Modular Structure

```
scripts/model_v2/
├── __init__.py               # Package declaration
├── config.py                 # Hyperparameters, file paths, feature columns, seeds
├── download_sources.py       # Source verification and SHA-256 cryptographic hashing
├── build_grid.py             # Neutral 7,045-unit eligible forest domain lattice generator
├── build_features.py         # 4 feature groups (5 vars) with strict pre-observation cutoffs
├── build_labels.py           # Ground-truth PRODES clear-cut label assignment (2022-2024)
├── assemble_dataset.py       # Multi-year panel assembler (Parquet + CSV.gz exports)
├── split_temporal.py         # Temporal partitioner & disjointness verification
├── split_spatial.py          # North/South and 4-quadrant spatial blocking
├── train.py                  # Model training, 4-stage ablation, 3 evaluation perspectives
├── evaluate.py               # Rare-event metrics, bootstrap CIs, lift, and baselines
├── explain.py                # TreeSHAP explainability, summary plot, and local example
└── run.py                    # Master end-to-end orchestration entrypoint
```

---

## 4. Automated Testing Suite

To run all 33 Model V2 dedicated unit tests:
```powershell
python -m unittest discover -s tests/model_v2 -p "test_*.py" -v
```

To run the master repository test suite across all 4 experimental phases (52 tests):
```powershell
python tests/run_all_python_tests.py
```

---

## 5. Artifact Ledger

The pipeline deterministically generates the following artifacts in `artifacts/model-v2/`:

```
artifacts/model-v2/
├── features.parquet          # Complete 5-feature matrix across 3 years (21,135 rows)
├── features.csv.gz           # Compressed CSV version
├── labels.parquet            # Ground-truth binary labels (2022, 2023, 2024)
├── labels.csv.gz             # Compressed CSV version
├── dataset_manifest.json     # Provenance, cell counts, class prevalence, and SHA-256 hashes
├── model_v2.json             # Serialized XGBoost booster binary
├── model_manifest.json       # Complete experimental parameters, metrics, CIs, and baselines
└── shap/
    ├── shap_summary.json     # Global mean absolute SHAP values and rankings
    ├── shap_summary_plot.png # High-resolution beeswarm summary visualization
    └── local_shap_example.json # Deterministic local explanation of highest-risk test unit
```

---

## 6. Scientific Quality Boundaries

- **No Production Modifications**: Production application code (`index.html`, `app.js`, `styles.css`, `constants.js`) is completely untouched.
- **No Score Inheritance**: Features never inherit production `risk_score` or `risk_norm`.
- **PRODES Target-Year Isolation**: For any target year $T$, historical-loss features query only PRODES clear-cuts from years $< T$. Target-year $T$ polygons are quarantined as evaluation labels.
- **Population Temporal Limitation**: IBGE 2022 Census data serves as an out-of-time static proxy for 2022 and 2023, while temporally valid for 2024.
- **Benchmark Preservation**: The original documented benchmark (ROC-AUC 0.82, Precision 0.79, Recall 0.84, F1 0.81) remains intact and is not overwritten.
