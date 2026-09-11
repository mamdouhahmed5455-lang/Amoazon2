# SHAP Methodology & Explainability Specification

> **Status**: `EXPLAINABLE AI SPECIFICATION`  
> **Framework**: Lundberg & Lee (2017) *TreeSHAP*  
> **Benchmark Attribution**: Global Research Synthesis

---

## 1. Current Evidence: Global Benchmark Feature Importance

The explainability layer of the platform is grounded in Shapley additive explanations (TreeSHAP). Across the empirical sample dataset evaluated during offline research modeling, global feature contributions were established as follows:

```
┌────────────────────────────────────────────────────────────────────────┐
│ GLOBAL SHAP ATTRIBUTION BENCHMARKS (LOCKED SSOT)                       │
├────────────────────────────────┬───────────────┬───────────────────────┤
│ Environmental Driver Dimension │ SHAP Relative │ Operational Role      │
├────────────────────────────────┼───────────────┼───────────────────────┤
│ Road Proximity                 │      41%      │ Primary Spatial Risk  │
│ Previous Forest Loss (Temporal)│      23%      │ Contagion & Edge Loss │
│ Population Pressure            │      21%      │ Frontier Demand       │
│ Elevation Constraints          │      15%      │ Topographic Barrier   │
├────────────────────────────────┼───────────────┼───────────────────────┤
│ Total Normalized Attribution   │     100%      │ Complete Driver Space │
└────────────────────────────────┴───────────────┴───────────────────────┘
```

---

## 2. Absolute Scientific Distinctions: What SHAP Values Are and Are NOT

To prevent misinterpretation during competition jury evaluation, the scientific nature of these SHAP values is strictly defined:

### What These Values ARE:
- **Global Feature Importance Synthesis**: The mean absolute Shapley value $E[|\phi_i|]$ computed across training samples, expressing the relative magnitude of each feature's contribution to moving model outputs away from the base expected value.
- **Normalized Benchmarks**: Scaled to sum to exactly 100% for clear executive interpretation.
- **Empirical Confirmation**: Consistent with established peer-reviewed Amazonian deforestation studies (e.g., roads driving the vast majority of historical clearing frontiers).

### What These Values ARE NOT:
- ❌ **NOT Local Cell-Level Explanations**: The web application does **not** dynamically compute unique local TreeSHAP force plots for each of the 150,000 cells in the browser.
- ❌ **NOT Model Coefficients**: XGBoost is an ensemble of non-linear decision trees with split conditions and threshold interactions. These percentages are not linear multipliers or slope terms.
- ❌ **NOT Causal Effect Estimates**: SHAP measures predictive feature attribution within the model's learned structure; it does **not** establish econometric or counterfactual causality (i.e., paving a road by 10% does not causally guarantee a 4.1% increase in clearing without ceteris paribus controls).

---

## 3. Current Reproducibility Limitations

The original Python script executing `shap.TreeExplainer` and the serialized Shapley explanation matrix (`.npz` or `.parquet`) are not packaged within this frontend repository:
- The exact background sample subset used for TreeSHAP expectation calculations is **NOT RECOVERABLE** from this repository.
- The raw distribution plots (beeswarm plots, dependence plots) exist only as visual figure references in project reports (`docs/Graduation_Project_Report.md`).

---

## 4. Controlled Laboratory Reproduction Protocol

To reconstruct byte-level exact SHAP values in a future development phase:

```python
import xgboost as xgb
import shap
import pandas as pd
import numpy as np
import json

# Stage 1: Load Harmonized Dataset and Serialized Model
X_train = pd.read_parquet("data/processed/train_features.parquet")
model = xgb.XGBClassifier()
model.load_model("models/xgb_deforestation_v1.json")

# Stage 2: Initialize TreeExplainer
# TreeSHAP provides exact polynomial-time Shapley values for tree ensembles
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_train)

# Stage 3: Compute Mean Absolute Feature Importance
mean_abs_shap = np.abs(shap_values).mean(axis=0)
feature_names = X_train.columns

# Stage 4: Aggregate into Canonical Driver Groups
driver_groups = {
    "Road Proximity": ["dist_roads_official", "dist_roads_unofficial"],
    "Forest Loss": ["historical_loss_density", "loss_year_proximity"],
    "Population": ["worldpop_density", "dist_urban_centers"],
    "Elevation": ["srtm_elevation", "srtm_slope"]
}

grouped_shap = {}
for driver, features in driver_groups.items():
    indices = [X_train.columns.get_loc(f) for f in features if f in X_train.columns]
    grouped_shap[driver] = mean_abs_shap[indices].sum()

# Stage 5: Normalize to 100%
total_importance = sum(grouped_shap.values())
normalized_shap = {k: round((v / total_importance) * 100) for k, v in grouped_shap.items()}

# Verify Canonical SSOT Consistency: Road 41%, Loss 23%, Pop 21%, Elevation 15%
print(normalized_shap)
```

---

## 5. Future Operational Extension: Cell-Level Local TreeSHAP

In Stage 3 of the platform roadmap, cell-level localized TreeSHAP overlays will be precomputed and stored as compact 4-element arrays directly within the GeoJSON schema:
```json
{
  "cell_id": 10482,
  "risk_score": 84,
  "local_shap": {
    "road_contribution": +0.34,
    "loss_contribution": +0.18,
    "pop_contribution": +0.12,
    "elev_contribution": -0.09
  }
}
```
This will allow field rangers to inspect an individual cell and see specifically which localized driver triggered the high-risk alert.
