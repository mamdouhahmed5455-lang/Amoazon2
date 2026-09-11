# Reproduction Experiment Pipeline

> **Module Package**: `scripts/reproduction/`  
> **Execution Python**: Python 3.10+ (Tested on Python 3.14)

---

## 1. Module Inventory

- `config.py`: Central configuration declaring experiment constants, canonical benchmarks, and paths.
- `load_data.py`: Loads `data/forest_data_clean.json`, computes SHA-256 hash, and verifies 150,000 spatial cells.
- `prepare_features.py`: Feature schema auditor comparing dataset fields against the 12 documented training features.
- `prepare_labels.py`: Scientific target label guard. Verifies whether authentic ground truth ($y \in \{0, 1\}$) exists; halts execution if absent.
- `split_data.py`: Deterministic data splitting implementing Track A (Random Split) and Track B (Spatial Holdout).
- `train_model.py`: XGBoost model initialization and training harness.
- `evaluate_model.py`: Multi-metric evaluation calculating ROC-AUC, Precision, Recall, F1, and Confusion Matrix.
- `run_experiment.py`: Master pipeline runner producing `artifacts/reproduction/experiment_manifest.json`.

---

## 2. Reproduction Command

### Standard Audit Run (Enforces Target Label Guard):
```bash
python scripts/reproduction/run_experiment.py
```

### Test Harness Run (Software Execution Verification Only):
```bash
python scripts/reproduction/run_experiment.py --fixture-test
```
