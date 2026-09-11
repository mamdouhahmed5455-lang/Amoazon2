# Final Submission Package: Amazon Deforestation Risk Intelligence

> **Competition Track**: Technology Creativity Track  
> **Award**: Bibliotheca Alexandrina Youth Creators Award 2026  
> **Project**: Amazon Deforestation Risk Intelligence (Rondônia, Brazil)  
> **Canonical Production Platform URL**: [https://amazon-deforestation-risk-3d.vercel.app](https://amazon-deforestation-risk-3d.vercel.app)  
> **GitHub Research Repository**: [https://github.com/mamdouhahmed5455-lang/Amoazon2](https://github.com/mamdouhahmed5455-lang/Amoazon2)  

---

## 1. Project Title & Summary

### Amazon Deforestation Risk Intelligence: Spatio-Temporal Machine Learning & Interactive Decision Support for the Amazon Basin (Rondônia, Brazil)

**Project Summary:**  
The Amazon Deforestation Risk Intelligence Platform is an explainable GeoAI decision-support system designed to transform multi-source geospatial and demographic indicators into actionable spatial risk prioritizations. Evaluated across 150,000 empirical spatial cells in the State of Rondônia, Brazil, the platform combines gradient boosted decision trees (XGBoost) with TreeSHAP explainability, GPU-accelerated 2D/3D WebGL visualization, and client-side parametric scenario simulation. By operating upstream of retrospective satellite censuses and reactive alerts, the platform provides environmental coordinators with an interpretable screening tool to focus scarce monitoring and field inspection resources where structural vulnerability is highest.

---

## 2. Canonical Production & Repository Links

- **Canonical Public Platform URL**:  
  👉 **[https://amazon-deforestation-risk-3d.vercel.app](https://amazon-deforestation-risk-3d.vercel.app)**  
  *(Publicly accessible, hosted on Vercel Edge, zero installation or database setup required)*
- **GitHub Research Repository**:  
  👉 **[https://github.com/mamdouhahmed5455-lang/Amoazon2](https://github.com/mamdouhahmed5455-lang/Amoazon2)**  
  *(Contains full source code, open data assets, offline training pipelines, and automated test suites)*

---

## 3. Submission Document Suite

All documents in this package adhere to strict scientific integrity standards with zero unsupported financial or carbon claims:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ FINAL SUBMISSION DOCUMENT INDEX                                                        │
├───────────────────────────────────────────────┬────────────────────────────────────────┤
│ File Name                                     │ Scope & Description                    │
├───────────────────────────────────────────────┼────────────────────────────────────────┤
│ 01_Executive_Project_Description.md           │ Executive overview, core objectives,   │
│                                               │ technical architecture, and innovation.│
│ 02_Feasibility_Study.md                       │ 15-part comprehensive feasibility,     │
│                                               │ operational boundaries, and costs.     │
│ 03_Technical_Evidence_Appendix.md             │ 16-part empirical evidence appendix,   │
│                                               │ bootstrap CIs, ablations, and tests.   │
│ 04_Market_and_Competitive_Analysis.md         │ Ecosystem positioning: PRODES, DETER,  │
│                                               │ GFW, MapBiomas, and Planet NICFI.      │
│ 05_Future_Development_Plan.md                 │ Phased evolution separating current   │
│                                               │ prototype from future live MLOps.      │
│ 06_Team_and_CV.md                             │ Applicant credentials, developer       │
│                                               │ portfolio, and project attributions.   │
└───────────────────────────────────────────────┴────────────────────────────────────────┘
```

---

## 4. 5-Minute Judge Review Journey

To evaluate the live application efficiently, judges can follow this structured 5-minute walkthrough:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 5-MINUTE JUDGE EVALUATION WALKTHROUGH                                  │
├─────────┬─────────────────────────┬────────────────────────────────────┤
│ Minute  │ Action / Destination    │ What to Observe                    │
├─────────┼─────────────────────────┼────────────────────────────────────┤
│ Min 1   │ Dashboard (index.html)  │ GPU-accelerated WebGL 3D extruded  │
│         │ Canonical URL Home      │ risk mesh across 150,000 cells;    │
│         │                         │ sub-second spatial risk filtering. │
├─────────┼─────────────────────────┼────────────────────────────────────┤
│ Min 2   │ Cell Triage & SHAP XAI  │ Click an individual high-risk cell │
│         │ Right-Hand Panel        │ to view calibrated TreeSHAP driver │
│         │                         │ weights and the 5-step narrative.  │
├─────────┼─────────────────────────┼────────────────────────────────────┤
│ Min 3   │ Scenario Simulator      │ Interactive parametric sliders:    │
│         │ pages/scenario-simulator│ model directional risk shifts from │
│         │                         │ road bans and reserve enforcement. │
├─────────┼─────────────────────────┼────────────────────────────────────┤
│ Min 4   │ Historical Intelligence │ 25-year official PRODES time-series│
│         │ pages/historical-intel  │ (2001–2025) across all 9 states    │
│         │                         │ of the Brazilian Legal Amazon.     │
├─────────┼─────────────────────────┼────────────────────────────────────┤
│ Min 5   │ Impact & Feasibility    │ Operational boundary matrix and    │
│         │ pages/impact-feasibility│ qualitative cost evaluation; zero  │
│         │                         │ speculative ROI or carbon claims.  │
└─────────┴─────────────────────────┴────────────────────────────────────┘
```

---

## 5. Key Scientific Evidence

The platform maintains absolute scientific honesty through an explicit **Dual-Track Evaluation Architecture**:

```
┌────────────────────────────────────────────────────────────────────────┐
│ DUAL-TRACK SCIENTIFIC BENCHMARKS                                       │
├──────────────────────────┬───────────────────┬─────────────────────────┤
│ Dimension                │ Track 1: Original │ Track 2: Independent    │
│                          │ Documented Record │ Model V2 Research Audit │
├──────────────────────────┼───────────────────┼─────────────────────────┤
│ Model Version            │ XGBoost Baseline  │ `v2.0.0-validated`      │
│ Target Test Set          │ Documented split  │ Held-Out PRODES 2024    │
│ ROC-AUC                  │ 0.82              │ 0.7474                  │
│ 95% Bootstrap CI         │ Unrecorded        │ [0.5837, 0.9036]        │
│ PR-AUC                   │ Unrecorded        │ 0.005534                │
│ Brier Score              │ Unrecorded        │ 0.00693 (Uncalibrated)  │
│ Retrospective Top-10% Lift│ Unrecorded       │ 5.0x Enrichment Factor  │
│ Reproducibility          │ Legacy benchmark  │ 100% Deterministic Code │
│ Scientific Classification│ Baseline Reference│ Independent Research    │
└──────────────────────────┴───────────────────┴─────────────────────────┘
```
*Mandatory Note: "Model V2 is an independent research experiment and is not presented as a reproduction of the original benchmark."*

### Automated Test Verification
The codebase is validated by **99 automated tests** passing with 100% success rate:
- **38 JavaScript Unit Tests**: `node tests/unit.js` (PASSING)
- **9 Historical Data Tests**: `node tests/test-historical.js` (PASSING)
- **52 Python Scientific Tests**: `python tests/run_all_python_tests.py` (PASSING)

---

## 6. Key Structural Limitations

To assist evaluators in calibrating expectations, the platform highlights four primary technical boundaries:

1. **Precomputed Prototype**: The live platform renders precomputed, static geospatial grids. Live automated satellite alerting (e.g., daily DETER ingestion) is delineated as a future operational roadmap item.
2. **Rare-Event Class Imbalance**: In strict annual temporal holdouts (2024), deforestation occurs in a tiny fraction of cells ($0.14\%$ prevalence, $10$ events in $7,045$ units). As a result, PR-AUC is $0.005534$, and high-risk prioritizations will inevitably include false positives.
3. **Relative Ranking vs. Probability**: Probabilistic calibration is not established (Brier Score = 0.00693). Model outputs represent relative spatial risk rankings, not physical probabilities of forest clearing.
4. **Potential Downstream Outcomes**: The platform does not claim measured carbon savings, commercial dollar ROI, or verified patrol efficiency improvements. Real-world impact requires an operational agency pilot with independent post-hoc satellite auditing.
