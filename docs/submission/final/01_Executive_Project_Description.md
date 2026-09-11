# Executive Project Description

> **Competition Track**: Technology Creativity Track  
> **Award**: Bibliotheca Alexandrina Youth Creators Award 2026  
> **Project Focus**: Spatio-Temporal Environmental Intelligence & Predictive Forest Degradation Risk Modeling  
> **Study Geography**: State of Rondônia, Brazilian Amazon Basin  
> **Canonical Platform URL**: [https://amazon-deforestation-risk-3d.vercel.app](https://amazon-deforestation-risk-3d.vercel.app)  
> **GitHub Repository**: [https://github.com/mamdouhahmed5455-lang/Amoazon2](https://github.com/mamdouhahmed5455-lang/Amoazon2)  

---

## 1. Project Title

**Amazon Deforestation Risk Intelligence: Spatio-Temporal Machine Learning & Interactive Decision Support for the Amazon Basin (Rondônia, Brazil)**

---

## 2. Problem

The Amazon rainforest represents Earth's largest terrestrial carbon reservoir and biodiversity haven, yet it faces persistent fragmentation, infrastructure-driven incursions, and illegal clearing. Conventional satellite monitoring systems—such as Brazil's official PRODES program—are retrospective: they map consolidated clear-cuts only after the forest canopy has already been permanently lost (annual accounting cycle). Real-time alert systems (e.g., DETER, GLAD) detect active clearings as they occur, but typically flag events when tree felling is already in progress.

Environmental protection agencies (e.g., IBAMA, ICMBio, state environmental secretariats) operate under severe logistical, personnel, and vehicle constraints across millions of square kilometers. What enforcement coordinators urgently need is a **proactive, predictive spatial intelligence layer** that identifies where pressure is accumulating *before* large-scale clear-cutting takes place, enabling more strategic resource allocation and targeted monitoring.

---

## 3. Proposed Solution

This project provides an end-to-end GeoAI decision-support platform designed to transform multi-source geospatial and demographic indicators into actionable spatial risk prioritizations:

1. **Predictive Machine Learning Engine**: An offline-trained XGBoost classifier that integrates anthropogenic road networks, historical deforestation patterns, demographic pressure, and topographic constraints to evaluate localized risk.
2. **Interactive 2D/3D WebGL Visualization**: A presentation-grade spatial interface powered by Deck.GL and Mapbox GL JS that maps risk across 150,000 empirical spatial cells in Rondônia, offering 3D extrusion, analytical 2D views, smooth heatmaps, and spatial hotspot filtering.
3. **Transparent Decision Story**: A 5-step guided narrative sequence embedded in the dashboard that walks analysts from a specific geographic coordinate through risk probability, feature drivers, scenario simulation, and inspection planning.
4. **Parametric Scenario Simulation**: A client-side policy sensitivity simulator allowing analysts to model projected risk shifts under varying road construction, population influx, fire frequency, and protected reserve enforcement policies.
5. **Historical Intelligence**: A comprehensive 25-year official PRODES time series (2001–2025) analyzing long-term deforestation trends across all nine states of the Brazilian Legal Amazon.

---

## 4. Objectives

1. **Proactive Spatial Screening**: Distill vast Amazonian territories into prioritized, score-ranked spatial units so scarce field capacity can be concentrated where pressure is highest.
2. **Explainable AI (XAI)**: Demystify machine learning predictions through calibrated TreeSHAP feature attributions, allowing environmental analysts to inspect *why* a particular cell is flagged.
3. **Interactive Scenario Exploration**: Enable environmental policy analysts to explore hypothetical policy interventions (e.g., road construction moratoriums, reserve expansions) and observe modeled risk sensitivities without specialized GIS desktop software.
4. **Scientific Transparency & Reproducibility**: Maintain open, fully documented data provenance, rigorous temporal separation protocols, deterministic code pipelines, and audited validation benchmarks.

---

## 5. Innovation

- **Predictive Risk Prioritization vs. Post-Hoc Detection**: Complements retrospective satellite mapping (PRODES) and reactive alert streams (DETER) with a predictive, forward-looking spatial prioritization model.
- **Explainable GeoAI (SHAP Integration)**: Rather than functioning as an opaque black box, every cell presents an exact quantitative breakdown of the anthropogenic and physical drivers behind its score.
- **Client-Side Policy Sensitivity Engine**: Interactive simulation directly in the browser that couples model-derived feature importance weights with parametric policy mitigation toggles.
- **High-Performance WebGL 3D Rendering**: GPU-accelerated visualization capable of smoothly rendering over 100,000 spatial cells with dynamic height extrusions, multi-attribute color ramps, and sub-second filtering.
- **Dual-Track Scientific Architecture**: Explicit separation between the original project benchmark and an independently acquired, out-of-time validated research model (Model V2), ensuring scientific honesty.

---

## 6. Technical Implementation

The platform is engineered with a modular, lightweight static web architecture supported by reproducible offline Python research pipelines:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ PLATFORM ARCHITECTURE & PIPELINE                                                       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. DATA INGESTION & FEATURE ENGINEERING (Offline Python Engine)                        │
│    • INPE PRODES WFS Satellite Polygons (2021–2024)                                    │
│    • OpenStreetMap Highway Network via Overpass API                                    │
│    • IBGE 2022 Decennial Population Census & Geocodes                                  │
│    • Copernicus DEM GLO-90m Elevation Model                                            │
│    • STRtree Spatial Indexing & cKDTree Spatial Join Algorithms                        │
│                                                                                        │
│ 2. MODELING & EVALUATION (XGBoost Pipeline)                                            │
│    • Gradient Boosted Decision Trees with Log-Loss Objective                           │
│    • Strict Out-of-Time Annual Partitions (2022 Train, 2023 Validation, 2024 Test)     │
│    • Geographic Latitude Split (North vs. South Holdout at -11.0° Lat)                 │
│    • 1,000-iteration Bootstrap Confidence Intervals                                    │
│                                                                                        │
│ 3. CLIENT-SIDE PRESENTATION & ANALYTICS (Static Web Application)                       │
│    • Deck.gl WebGL Engine + Mapbox GL JS Spatial Canvas                                │
│    • Vanilla JavaScript (Modular ES6 architecture) & Inter Typography                  │
│    • Chart.js & D3.js Analytical Visualizations                                        │
│    • Zero Server-Side Database Requirement: Hosted on Vercel Edge                      │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. AI / Model Approach

The platform strictly distinguishes between the canonical baseline project benchmark and the independent Model V2 research audit:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ DUAL-TRACK MODEL SPECIFICATION & BENCHMARKS                                            │
├──────────────────────────┬─────────────────────────────┬───────────────────────────────┤
│ Metric / Dimension       │ Track 1: Original Benchmark │ Track 2: Independent Model V2 │
├──────────────────────────┼─────────────────────────────┼───────────────────────────────┤
│ Model Version            │ XGBoost (Baseline)          │ XGBoost (`v2.0.0-validated`)  │
│ Role in Repository       │ Baseline Project Reference  │ Independent Scientific Audit  │
│ ROC-AUC                  │ 0.82                        │ 0.7474                        │
│ 95% Bootstrap CI         │ Not Documented Upstream     │ [0.5837, 0.9036]              │
│ Precision                │ 0.79                        │ 0.0071 (at top 10% capacity)  │
│ Recall                   │ 0.84                        │ 0.5000 (5 of 10 events)       │
│ F1 Score                 │ 0.81                        │ N/A (Ranking model)           │
│ PR-AUC                   │ N/A                         │ 0.005534 (vs. base 0.001421)  │
│ Brier Calibration Score  │ N/A                         │ 0.00693 (Prob. unestablished) │
│ Test Partition Events    │ Undocumented Upstream Split │ 10 observed events in 2024    │
│ Top-Decile Lift          │ N/A                         │ 5.0x retrospective enrichment │
│ Scientific Classification│ Canonical Benchmark (Locked)│ Moderate Evidence             │
└──────────────────────────┴─────────────────────────────┴───────────────────────────────┘
```

> **Explicit Scientific Statement**:  
> *"Model V2 is an independent research experiment and is not presented as a reproduction of the original benchmark."*

### Global Feature Attributions (SHAP Synthesis)
- **Road Proximity**: 41% (Infrastructure corridors act as the primary conduits for frontier expansion)
- **Previous Forest Loss**: 23% (Clearings expand contiguously outward from historical loss edges)
- **Population Pressure**: 21% (Settlement density drives localized agricultural and timber demand)
- **Elevation Constraints**: 15% (Lowland terrain is significantly more accessible than steep uplands)

---

## 8. Data Sources

All data used in the independent research pipelines are derived from sovereign, authoritative, and documented open repositories:

1. **Road Network**: OpenStreetMap contributors, extracted via Overpass API (trunk, primary, secondary corridors, and highway BR-364).
2. **Demographic Pressure**: Instituto Brasileiro de Geografia e Estatística (IBGE) 2022 Decennial Census population counts and official municipal geocodes.
3. **Physical Elevation**: European Space Agency (ESA) & NASA Copernicus DEM GLO-90 Global 90m resolution elevation model.
4. **Deforestation Labels**: Instituto Nacional de Pesquisas Espaciais (INPE) PRODES program via TerraBrasilis WFS service (2021–2024 annual clear-cut polygons $\ge 6.25\text{ ha}$).
5. **Territorial Boundary & Masks**: Official Rondônia sovereign state boundary and INPE Non-Forest Formations vector layers.

---

## 9. Prototype Capabilities

The working prototype implements **100%** of the core presentation and analytical specifications described:

- **Interactive 3D Deforestation Map** (`index.html`): Deck.GL column layers where 3D height and color correspond to risk severity; supports 3D perspective, flat 2D orthographic, density heatmap, and spatial hotspot filtering.
- **Guided Decision Story**: Step-by-step analytical sequence leading the user through geographic coordinates, risk tiers, feature driver analysis, scenario sensitivity, and next steps.
- **PRODES Historical Intelligence** (`pages/historical-intelligence.html`): 25-year time series (2001–2025) comparing all nine Amazônia Legal states with interactive trajectory charts, state-by-state rankings, and Rondônia focus analysis.
- **Client-Side Scenario Simulator** (`pages/scenario-simulator.html`): Sliders for road expansion, population pressure, and fire frequency combined with policy toggles to observe simulated risk shifts and zone transitions.
- **Spatial Analysis Workspace** (`pages/spatial-analysis.html`): Spatial sandbox for examining critical danger zones, road corridor convergence, and cluster distributions.
- **AI Model Architecture & Diagnostics** (`pages/ai-model.html`): Visual model explanation, confusion matrix breakdowns, and feature weight analyses.
- **Multi-Format Export**: Report generation and CSV data export functionality.

---

## 10. Feasibility Summary

A comprehensive 12-part feasibility study is presented in `pages/impact-feasibility.html` and `docs/global-readiness/PRODUCT_COMPLETENESS.md`:

- **Technical Feasibility**: Demonstrated through a fully functional, zero-backend static web application capable of running smoothly in standard web browsers without dedicated server compute.
- **Operational Feasibility**: Designed to sit upstream of field operations as a strategic screening layer; ranks territories into capacity tiers so field coordinators can prioritize high-probability zones.
- **Qualitative Cost Dimensions**: Identifies operational cost drivers across prototype and production tiers (satellite ingestion query volume, batch model inference frequency, cloud tile caching, and human analyst verification triage) without asserting speculative monetary figures.
- **Environmental Relevance**: Evaluates how early risk warning conceptually supports carbon retention, biodiversity preservation, hydrological stability, and ecosystem resilience in the Amazon.
- **Market & Deployment Context**: Articulates pre-deployment requirements (e.g., GPS field export to QField, automated alert connectors, role-based access control).

> **Integrity Standard**:  
> The project **does NOT claim** measured financial ROI, measured carbon savings, verified carbon offset valuation, patrol efficiency gains, or proven commercial financial returns. All operational benefits remain qualitative hypotheses requiring field pilot validation.

---

## 11. Competitive Context

The platform is evaluated against five major established forest monitoring systems:

| System | Operating Agency | Primary Scope | Update Cadence | Key Differentiation from This Project |
| :--- | :--- | :--- | :--- | :--- |
| **PRODES** | INPE (Brazil) | Annual official accounting | Annual | Retrospective consolidated loss; this project offers forward-looking predictive risk ranking. |
| **DETER** | INPE (Brazil) | Enforcement alert stream | Daily / Weekly | Reactive detection of active clearing; this project models underlying spatial susceptibility. |
| **Global Forest Watch** | WRI | Global canopy disturbance | Near-real-time | Global tree cover loss detection; this project offers localized Amazonian anthropogenic risk modeling. |
| **MapBiomas** | NGO Consortium | Multi-decade land cover | Annual | Historical land use classification; this project focuses on forward predictive risk scoring. |
| **Planet NICFI** | Norway / Planet | High-resolution basemaps | Monthly | High-resolution visual imagery; this project provides machine learning risk inference. |

*Project Niche*: An explainable decision-support layer bridging the gap between retrospective satellite accounting and operational patrol dispatching.

---

## 12. Limitations & Scientific Qualifications

1. **Temporal Demographic Validity**:
   - **2022 Population Feature**: Out-of-time static proxy (IBGE 2022 Census published June 28, 2023, after the July 31, 2021 prediction cutoff).
   - **2023 Population Feature**: Out-of-time static proxy (published 11 months after the July 31, 2022 cutoff).
   - **2024 Population Feature**: Temporally valid (published June 28, 2023, before the July 31, 2023 prediction cutoff).
   - *Universal zero temporal leakage across all target periods is not claimed.*
2. **Label Prevalence Sparsity**: Deforestation events in the 2024 held-out test partition represent 10 positive cells out of 7,045 ($0.142\%$). While the model achieves a 5.0x lift in the top decile, small event counts introduce finite-sample statistical uncertainty (ROC-AUC 95% CI: $[0.5837, 0.9036]$).
3. **Probabilistic Calibration**: With a Brier score of $0.00693$, probabilistic calibration is not established; outputs must be interpreted as relative spatial risk rankings rather than absolute frequentist probabilities.
4. **Non-Causal Inference**: SHAP feature attributions reflect predictive correlations within the model, not real-world econometric causal treatment effects.

---

## 13. Future Development

The post-competition operationalization roadmap comprises four structured stages:

1. **Field Interoperability Module**: Direct export of prioritized cell centroid coordinates to Garmin GPX and QField GeoPackage formats for mobile GPS offline field navigation.
2. **Near-Real-Time Alert Feed Integration**: Connecting bi-weekly INPE DETER and Global Forest Watch GLAD alerts to validate model risk forecasts against emerging clearing events.
3. **Automated MLOps Cloud Pipeline**: Migrating offline Python scripts to a scheduled cloud workflow (AWS Lambda / Google Cloud Functions) to re-score territorial grids as new satellite composites arrive.
4. **Controlled Operational Pilot**: Partnering with a regional conservation agency (e.g., SEDAM-RO) to run a comparative pilot study measuring inspection yield against conventional workflows.

---

## 14. Team

*This project was developed for academic, scientific research, and competition submission.*

- **Principal Developer & Researcher**: Mamdouh Ahmed
- **Role**: Spatial Data Engineering, Machine Learning Architecture, Frontend WebGL Development
- **Repository**: [github.com/mamdouhahmed5455-lang/Amoazon2](https://github.com/mamdouhahmed5455-lang/Amoazon2)
- **Live Platform**: [amazon-deforestation-risk-3d.vercel.app](https://amazon-deforestation-risk-3d.vercel.app)
- **Submission Note**: Formal applicant curriculum vitae and biographical information are attached in `06_Team_and_CV.md`.
