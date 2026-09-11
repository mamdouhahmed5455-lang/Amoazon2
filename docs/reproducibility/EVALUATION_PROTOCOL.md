# Model Evaluation Protocol: Current Evidence & Future Validation

> **Status**: `SCIENTIFIC AUDIT & BENCHMARK METHODOLOGY`  
> **Evaluation Mode**: Offline Held-Out Partition vs. Future Operational Validation Protocols

---

## 1. Current Evidenced Evaluation (Documented Benchmark)

The quantitative performance metrics cited across the platform originate from the offline evaluation experiments conducted during model development and documented in `docs/Graduation_Project_Report.md`:

### Evidenced Metrics (Locked SSOT)

| Metric | Benchmark Value | Evaluation Basis |
| :--- | :---: | :--- |
| **ROC-AUC** | **0.82** | Receiver Operating Characteristic curve integration. |
| **Precision** | **0.79** | Positive predictive value at threshold $\tau = 0.5$. |
| **Recall** | **0.84** | Sensitivity / true positive rate at threshold $\tau = 0.5$. |
| **F1 Score** | **0.81** | Harmonic mean of Precision and Recall. |
| **Overall Accuracy**| **96.22%** | $(TP + TN) / \text{Total Samples}$. |

### Documented Confusion Matrix
Derived from evaluation across the 150,000-cell sample space:

```
                        PREDICTED CLASS (Threshold = 0.5)
                         Predicted High Risk   Predicted Low Risk
    Actual Deforested        12,450 (TP)            2,380 (FN)        Total Actual Positive: 14,830
    Actual Intact             3,290 (FP)          131,880 (TN)        Total Actual Negative: 135,170
                              Total: 15,740        Total: 134,260     Total Evaluated:       150,000
```

### Unrecoverable Evaluation Parameters
To maintain strict scientific honesty, the following methodological parameters cannot be verified from the frontend codebase:
- **Exact Train / Test Split Percentage**: *Not currently recoverable from the repository.*
- **Random Seed for Dataset Shuffling**: *Not currently recoverable from the repository.*
- **Cross-Validation Fold Count ($k$-fold)**: *Not currently recoverable from the repository.*
- **Hyperparameter Grid Search Logs**: *Not currently recoverable from the repository.*

---

## 2. Why Geospatial Evaluation Requires Spatial & Temporal Separation

Standard cross-validation (random $k$-fold) in machine learning assumes that samples are Independent and Identically Distributed ($i.i.d.$). **In geospatial modeling, this assumption is fundamentally violated due to Tobler's First Law of Geography** ("everything is related to everything else, but near things are more related than distant things"):

1. **Spatial Autocorrelation**: If a grid cell is randomly assigned to the training set and its immediate neighbor is assigned to the test set, the model can "cheat" by memorizing local spatial coordinates rather than learning generalizable environmental relationships.
2. **Temporal Leakage**: Evaluating future risk using training data collected concurrently in the same year does not test the model's true predictive utility for future lead times.

---

## 3. Required Future Validation Protocols (Operational Roadmap)

Before this prototype can transition into an authoritative sovereign environmental intelligence platform, the following 8 validation protocols must be executed:

### Protocol 1: Spatial Block Holdout Cross-Validation
- **Method**: Partition the Rondônia study area into contiguous geographic tiles ($50\text{ km} \times 50\text{ km}$ spatial blocks).
- **Execution**: Train on $k-1$ spatial blocks and evaluate on held-out geographic tiles that are physically separated by a spatial buffer zone ($10\text{ km}$) to eliminate spatial spillover.
- **Target**: Confirm that the AUC does not drop significantly on unseen geographic territories.

### Protocol 2: Out-of-Time Temporal Backtesting
- **Method**: Train the XGBoost model on historical data up to year $T-1$ (e.g., 2023) and predict deforestation occurrences in year $T$ (e.g., 2024).
- **Execution**: Cross-reference predictions against the official INPE PRODES 2024 clear-cut census polygons.
- **Target**: Measure the temporal lead time between early high-risk prioritization and actual canopy clearing.

### Protocol 3: Probability Calibration Analysis
- **Method**: Evaluate whether predicted probability $P = 0.80$ corresponds to an empirical 80% clear-cutting frequency.
- **Metrics**: Brier Score and Reliability Curves (Expected Calibration Error / ECE).
- **Target**: Ensure calibrated outputs to prevent misinforming operational field dispatch.

### Protocol 4: Precision@K and Recall@K (Operational Capacity Envelope)
- **Method**: Environmental enforcement agencies have finite inspection capacity (e.g., can only inspect 200 sites per month).
- **Execution**: Rank all 150,000 cells by risk score and evaluate Precision@200, Precision@500, and Precision@1000.
- **Target**: Maximize the enforcement yield within the realistic capacity envelope of field rangers.

### Protocol 5: Asymmetric Operational Cost Analysis
- **False Positive Cost**: Cost of deploying ground patrol vehicles and personnel to an intact area where no illegal clearing was planned (fuel, staff hours, vehicle wear).
- **False Negative Cost**: Irreversible loss of primary old-growth tropical rainforest and associated biodiversity/carbon reserves.
- **Target**: Establish a decision threshold $\tau^*$ that minimizes total operational and ecological loss rather than using a default $\tau = 0.5$.

### Protocol 6: Regional Transferability Benchmark
- **Method**: Apply the Rondônia-trained model to distinct Amazonian jurisdictions:
  - Eastern Pará (active cattle frontier and logging roads).
  - Northern Mato Grosso (large-scale commercial soy expansion).
  - Southern Amazonas (remote riverine and highway expansion).
- **Target**: Identify regional performance degradation and calibrate sub-regional model ensembles.

### Protocol 7: Robustness Under Sensor Degradation
- **Method**: Introduce synthetic cloud-mask data gaps, missing optical spectral bands, and delayed road registry updates.
- **Target**: Measure prediction stability when real-time satellite feeds suffer from seasonal wet-season cloud cover.

### Protocol 8: Counterfactual Operational Pilot Trial
- **Method**: Partner with environmental protection units across two comparable territorial sectors:
  - *Sector A (Control)*: Conventional reactive alerting workflow (waiting for DETER alerts).
  - *Sector B (Intervention)*: Proactive spatial prioritization workflow (dispatching weekly patrols to top-decile GeoAI cells).
- **Target**: Quantify lead time reduction and independently verified avoided deforestation.
