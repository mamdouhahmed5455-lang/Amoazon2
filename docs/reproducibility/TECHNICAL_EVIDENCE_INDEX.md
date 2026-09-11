# Technical Evidence Index & Reviewer Lookup Matrix

> **Purpose**: Rapid cross-referencing index enabling competition judges and peer reviewers to instantly locate evidentiary artifacts, data provenance proofs, and architectural specifications across the codebase.

---

## 1. Fast Reviewer Lookup Matrix

| # | Question / Reviewer Inquiry | Primary Evidence File | Exact Section / Anchor | Audit Status |
| :-: | :--- | :--- | :--- | :---: |
| **Q1** | **Where is the spatial dataset?** | [`data/forest_data_clean.json`](../../data/forest_data_clean.json) | Full JSON array (150,000 records) | **VERIFIED** |
| **Q2** | **Where is dataset provenance documented?** | [`DATA_PROVENANCE.md`](DATA_PROVENANCE.md) | §2 Field Inventory & §3 Numeric Ranges | **VERIFIED** |
| **Q3** | **Where are the locked canonical metrics?** | [`scripts/constants.js`](../../scripts/constants.js) | `MODEL_METRICS` (AUC 0.82, Prec 0.79, Rec 0.84, F1 0.81) | **VERIFIED** |
| **Q4** | **Where is the model architecture described?** | [`MODEL_CARD.md`](MODEL_CARD.md) | §1 Overview & §5 Training Characteristics | **VERIFIED** |
| **Q5** | **Where is the 12-feature training set specified?**| [`FEATURE_SPECIFICATION.md`](FEATURE_SPECIFICATION.md) | §4 Full 12-Feature Training Inventory | **VERIFIED** |
| **Q6** | **Where are global SHAP weights documented?** | [`SHAP_METHODOLOGY.md`](SHAP_METHODOLOGY.md) | §1 Global Benchmarks (Road 41%, Loss 23%, Pop 21%, Elev 15%) | **VERIFIED** |
| **Q7** | **Where is the prototype boundary stated?** | [`pages/impact-feasibility.html`](../../pages/impact-feasibility.html) | Part 2, §3 Operational Workflow (Boundary Banner) | **VERIFIED** |
| **Q8** | **Where are reproducibility gaps cataloged?** | [`REPRODUCIBILITY_GAPS.md`](REPRODUCIBILITY_GAPS.md) | §3 Detailed Audit (Gaps G1 to G8) | **VERIFIED** |
| **Q9** | **Where is the reproduction plan defined?** | [`REPRODUCTION_PLAN.md`](REPRODUCTION_PLAN.md) | §2 Stage-by-Stage Protocols (Stages 01–12) | **VERIFIED** |
| **Q10**| **Where is future validation specified?** | [`EVALUATION_PROTOCOL.md`](EVALUATION_PROTOCOL.md) | §3 Required Future Validation (Protocols 1–8) | **VERIFIED** |
| **Q11**| **Where is the technical architecture diagram?** | [`pages/impact-feasibility.html`](../../pages/impact-feasibility.html) | Part 3, §4 Technical Integration Architecture | **VERIFIED** |
| **Q12**| **Where is historical PRODES data stored?** | [`data/prodes_historical.json`](../../data/prodes_historical.json) | Complete 2001–2025 Legal Amazon Series | **VERIFIED** |
| **Q13**| **Where is the 25-year historical analysis?** | [`pages/historical-intelligence.html`](../../pages/historical-intelligence.html) | 25-Year PRODES Intelligence & State Ranking | **VERIFIED** |
| **Q14**| **Where are model governance rules stated?** | [`MODEL_GOVERNANCE.md`](MODEL_GOVERNANCE.md) | §2 Core Governance Directives (HITL, Drift, Rollback) | **VERIFIED** |
| **Q15**| **Where is the competitive positioning defined?**| [`pages/impact-feasibility.html`](../../pages/impact-feasibility.html) | Part 3, §1 Competitive Landscape & §2 Differentiation | **VERIFIED** |
| **Q16**| **Where is the scenario simulator math?** | [`assets/pages/scenario-simulator/app.js`](../../assets/pages/scenario-simulator/app.js) | Line 66 (`simulateImpact` SHAP-weighted formulation) | **VERIFIED** |
| **Q17**| **Where are automated regression tests?** | [`tests/unit.js`](../../tests/unit.js) | Fix #1 to #5 (38/38 Passing Unit Tests) | **VERIFIED** |
| **Q18**| **Where are historical PRODES unit tests?** | [`tests/test-historical.js`](../../tests/test-historical.js) | Benchmark & Ranking Verification (9/9 Blocks Pass) | **VERIFIED** |

---

## 2. Cross-Verification Checkpoints

### Checkpoint A: Confusion Matrix Consistency
- **Location**: `MODEL_CARD.md` §7 and `pages/ai-model.html` Lines 137–154.
- **Values**: TP = 12,450 | FN = 2,380 | FP = 3,290 | TN = 131,880.
- **Derived Metrics**:
  - $\text{Precision} = 12,450 / 15,740 = 0.7910$ ($\approx 0.79$).
  - $\text{Recall} = 12,450 / 14,830 = 0.8395$ ($\approx 0.84$).
  - $\text{F1} = 2 \times (0.7910 \times 0.8395) / (0.7910 + 0.8395) = 0.8144$ ($\approx 0.81$).

### Checkpoint B: Global SHAP Feature Importances Sum
- **Location**: `FEATURE_SPECIFICATION.md` §2 and `scripts/constants.js` Lines 13–18.
- **Values**: Road Proximity (41%) + Forest Loss (23%) + Population Pressure (21%) + Elevation Constraints (15%) = **Exactly 100%**.
- **Test Confirmation**: `node tests/unit.js` Fix #1 passed.

### Checkpoint C: Historical PRODES Sum Integrity
- **Location**: `data/prodes_historical.json` and `scripts/historical-intelligence.js`.
- **Values**: Sum of 9 states in 2024 = **6,518 km²**; in 2025 = **5,731 km²**.
- **Test Confirmation**: `node tests/test-historical.js` Block #6 passed.
