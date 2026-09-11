# Phase 6M: Master Judge & Evaluator Documentation Index

> **Purpose**: Direct evidence mapping for competition judges, technical evaluators, and peer reviewers.  
> **Structure**: Maps every critical judge question directly to the authoritative repository file, section, and empirical evidence.

---

## 1. Master Evidence Mapping Matrix

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ MASTER JUDGE QUESTION TO TECHNICAL EVIDENCE INDEX                                                                                                      │
├────┬──────────────────────────────────┬─────────────────────────────────────┬──────────────────────────────────────────┬───────────────────────────┤
│ #  │ Core Evaluator Question          │ Best Empirical Evidence             │ Repository File                          │ Specific Section          │
├────┼──────────────────────────────────┼─────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────────┤
│ 1  │ What problem is being solved?    │ Amazon deforestation crisis & the   │ `README.md`                              │ Section 1: Executive      │
│    │                                  │ urgent need for predictive triage   │ `docs/Graduation_Project_Report.md`      │ Section 1: Problem Def.   │
├────┼──────────────────────────────────┼─────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────────┤
│ 2  │ Why Rondônia as the pilot area?  │ Southwestern Amazon deforestation   │ `docs/model-v2/SPATIAL_UNIT.md`          │ Section 2: Spatial Unit   │
│    │                                  │ hotspot along BR-364 corridor       │ `pages/spatial-analysis.html`            │ Section: Regional Context │
├────┼──────────────────────────────────┼─────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────────┤
│ 3  │ How does the AI model work?      │ Gradient Boosted Trees (XGBoost) on │ `pages/ai-model.html`                    │ Architecture & Training   │
│    │                                  │ spatial & environmental features    │ `scripts/model_v2/train.py`              │ Full Python implementation│
├────┼──────────────────────────────────┼─────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────────┤
│ 4  │ Where did the data come from?    │ Primary sovereign platforms: INPE   │ `docs/model-v2/SOURCE_REGISTRY.md`       │ Master Source Inventory   │
│    │                                  │ PRODES, OSM highways, IBGE, DEM     │ `docs/model-v2/FEATURE_AUDIT.md`         │ Full Provenance Matrix    │
├────┼──────────────────────────────────┼─────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────────┤
│ 5  │ How was Model V2 validated?      │ Out-of-time temporal test, spatial  │ `docs/model-v2/RESULTS.md`               │ Section 7: Three Perspect.│
│    │                                  │ holdout, spatio-temporal test       │ `scripts/model_v2/run.py`                │ Complete pipeline runner  │
├────┼──────────────────────────────────┼─────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────────┤
│ 6  │ What does AUC 0.82 mean?         │ Documented historical benchmark of  │ `docs/reproduction-experiment/`          │ Benchmark Analysis        │
│    │                                  │ the original 2021 student research  │ `scripts/constants.js`                   │ Canonical benchmark ledger│
├────┼──────────────────────────────────┼─────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────────┤
│ 7  │ What does Model V2 0.7474 mean?  │ Genuine out-of-time ROC-AUC on 2024 │ `docs/model-v2/RESULTS.md`               │ Section 7: Primary Test   │
│    │                                  │ PRODES observations (95% CI bounds) │ `artifacts/model-v2/model_manifest.json` │ test_metrics.roc_auc      │
├────┼──────────────────────────────────┼─────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────────┤
│ 8  │ Why are the two scores different?│ 0.82 evaluated legacy student data; │ `docs/model-v2/RESULTS.md`               │ Section 2: 4-Way Table    │
│    │                                  │ 0.7474 is a true out-of-time test   │ `docs/reproducibility/`                  │ Gap Analysis Summary      │
├────┼──────────────────────────────────┼─────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────────┤
│ 9  │ What does SHAP mean in Model V2? │ TreeSHAP empirical attributions:    │ `docs/model-v2/RESULTS.md`               │ Section 10: SHAP Table    │
│    │                                  │ Loss 53.7%, Road 17.4%, Elev 16.4%  │ `artifacts/model-v2/shap/`               │ `shap_summary_plot.png`   │
├────┼──────────────────────────────────┼─────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────────┤
│ 10 │ What is not live in the demo?    │ Precomputed 150k grid; live alerts  │ `docs/global-readiness/`                 │ Section 1: Comparison     │
│    │                                  │ and API streaming are post-comp.    │ `POST_COMPETITION_ARCHITECTURE.md`       │ Current vs Future         │
├────┼──────────────────────────────────┼─────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────────┤
│ 11 │ What can the system do today?    │ Interactive 3D risk exploration,    │ `index.html`                             │ 3D Platform Dashboard     │
│    │                                  │ simulated policy sensitivity        │ `pages/scenario-simulator.html`          │ Interactive Simulator     │
├────┼──────────────────────────────────┼─────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────────┤
│ 12 │ What if the model is wrong?      │ Detailed false positive/negative    │ `docs/model-v2/ERROR_ANALYSIS.md`        │ Section 2 & 3: FP/FN Tax. │
│    │                                  │ analysis; human-in-the-loop mandated│ `docs/model-v2/MODEL_CARD.md`            │ Section 7: Human Oversight│
├────┼──────────────────────────────────┼─────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────────┤
│ 13 │ What is the environmental impact?│ Potential ecological benefits       │ `pages/impact-feasibility.html`          │ Potential Impact Domains  │
│    │                                  │ framework & modeled risk shifts     │ `pages/scenario-simulator.html`          │ Modeled Risk Shifts       │
├────┼──────────────────────────────────┼─────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────────┤
│ 14 │ What is the economic value?      │ Qualitative operational cost logic; │ `pages/impact-feasibility.html`          │ Qualitative Cost Matrix   │
│    │                                  │ feasibility framework (no ROI)      │ `pages/impact-feasibility.html`          │ Honesty Disclaimer        │
├────┼──────────────────────────────────┼─────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────────┤
│ 15 │ How can the platform scale?      │ 4-tier expansion roadmap from       │ `docs/global-readiness/`                 │ Section 1: Expansion Table│
│    │                                  │ Rondônia to Pan-Amazon & global     │ `GLOBAL_SCALABILITY.md`                  │ Tier 1 to Tier 4 Roadmap  │
├────┼──────────────────────────────────┼─────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────────┤
│ 16 │ What remains future work?        │ Live DETER ingestion, field mobile  │ `docs/global-readiness/`                 │ Section 1: Gap Matrix     │
│    │                                  │ app, secondary road mapping, CAR    │ `GAP_MATRIX.md`                          │ Priority P2 Post-Comp     │
└────┴──────────────────────────────────┴─────────────────────────────────────┴──────────────────────────────────────────┴───────────────────────────┘
```

---

## 2. Quick Guide for Evaluators

1. **To Verify Model V2 Reproducibility**:
   Run `python scripts/model_v2/run.py` from repository root.
2. **To Run Complete Automated Test Suite**:
   Run `python tests/run_all_python_tests.py` (52 tests across all experimental phases).
3. **To Inspect Visual Application**:
   Launch local server (`node server.js` or open `index.html` in modern browser).
