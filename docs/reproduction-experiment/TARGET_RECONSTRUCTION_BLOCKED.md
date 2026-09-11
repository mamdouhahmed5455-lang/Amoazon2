# Target Reconstruction Blocked: Scientific Halt Notice

> **Protocol Status**: `SCIENTIFIC EXECUTION HALTED (TARGET BLOCKED)`  
> **Mandatory Rule**: Non-Negotiable Scientific Honesty (Zero Label Fabrication)  
> **Investigation Target**: Ground-Truth Binary Target Label ($y \in \{0, 1\}$)

---

## 1. Executive Notice of Scientific Block

In strict compliance with **Phase 5B Step 4 and Step 19**, the model training pipeline has been **formally halted**.

Independent forensic investigation of the repository confirmed that:
1. **The repository contains only precomputed model inference outputs (`risk_score`, `risk_norm`, `elevation`, `color`) in `data/forest_data_clean.json`.**
2. **The original ground-truth binary deforestation training labels ($y \in \{0, 1\}$) are ABSENT from the repository.**
3. **No historical clear-cut raster masks or polygon intersection tables are bundled with this frontend application.**

In accordance with scientific integrity standards, **we refuse to fabricate pseudo-labels by thresholding the model's own predictions**. Training a new model on thresholded `risk_score` values would merely train a surrogate model to mimic its own precomputed outputs (a circular tautology / severe label leakage), rather than reproducing the original empirical model.

---

## 2. Detailed Forensic Findings on Target Labels

### What Was Investigated:
- **`data/forest_data_clean.json`**: Checked all 150,000 objects. Verified fields: `lat`, `lon`, `risk_score`, `risk_norm`, `elevation`, `color`. Zero binary label fields exist.
- **`data/risk_area_stats.csv`**: Contains only high-level summary counts (150,000 High). No cell labels.
- **`data/prodes_historical.json`**: Contains macro aggregate square kilometers per state per year (2001–2025). No cell-level coordinates or target labels.
- **`scripts/`**: No database dump, label mapping script, or target extraction file exists.

### Target Classification:
- Target Reconstruction Status: **`NOT RECOVERABLE`**

---

## 3. Why Creating Synthetic Labels Would Be Scientifically Fraudulent

A common flaw in superficial model reproduction is the temptation to create "synthetic labels" to force code execution—for example:
$$\hat{y}_{\text{fake}} = \begin{cases} 1 & \text{if } \text{risk\_score} \ge 170 \\ 0 & \text{otherwise} \end{cases}$$

Doing so in this project would constitute scientific misconduct for three reasons:
1. **Self-Referential Target Leakage**: `risk_score` is the *output* of the original model. Training a model on $\hat{y}_{\text{fake}}$ evaluates how well XGBoost can learn a step function of its own prior predictions, completely bypassing the actual satellite ground truth.
2. **Fabricated Validation Metrics**: The resulting AUC, Precision, and Recall would measure surrogate approximation error, not deforestation detection performance. Presenting this to competition judges as "reproducing the 0.82 AUC benchmark" would be deceitful.
3. **Loss of Class Imbalance Reality**: In the true evaluation partition, actual positive deforestation occurred on 14,830 cells (~9.88% prevalence). Arbitrary thresholding cannot accurately reflect the true underlying spatial distribution of forest loss events.

---

## 4. What Is Required to Close This Block

To unblock authentic model retraining in a future development phase (Stage 2 Validation Pilot), the following external assets must be acquired:

1. **INPE PRODES Deforestation Polygons**: Annual vector shapefiles from TerraBrasilis covering Rondônia for target year $T$.
2. **Hansen Global Forest Change (GFC) LossYear Layer**: Raster band encoding the exact calendar year of tree cover loss.
3. **Spatial Intersection Pipeline**: A GIS script (e.g., using `geopandas` or `rasterio`) that overlays the 150,000 coordinate centroids onto the PRODES clearing polygons to assign an authentic binary label:
   $$y_i = \begin{cases} 1 & \text{if centroid } i \text{ falls within PRODES clear-cut polygon in evaluation year} \\ 0 & \text{if centroid } i \text{ remains intact primary forest} \end{cases}$$

---

## 5. Conclusion & Affirmation of Scientific Outcome

As explicitly stated in the Phase 5B specification:
> *"A scientifically valid 'reproduction blocked because required evidence is missing' is better than fabricated reproduction."*

The reproduction experiment correctly completes all data ingestion, feature auditing, schema validation, and pipeline infrastructure up to the point of label verification, where it cleanly raises an auditable, intentional halt notice.
