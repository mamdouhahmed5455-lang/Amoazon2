# GeoAI Deforestation Risk Platform

An interactive GeoAI dashboard for visualizing and exploring deforestation risk across the Amazon Basin (Rondônia pilot zone). The project is designed as a presentation-grade spatial intelligence interface, combining 3D map exploration, hotspot views, scenario simulation, focused spatial analysis, and export actions in a static frontend application.

- **Live Production URL**: [https://amazon-deforestation-risk-3d.vercel.app/](https://amazon-deforestation-risk-3d.vercel.app/)
- **Repository**: [https://github.com/mamdouhahmed5455-lang/Amoazon2](https://github.com/mamdouhahmed5455-lang/Amoazon2)

## Overview

The platform centers on a primary dashboard built with Deck.GL and Mapbox-based rendering. It loads a precomputed forest-risk dataset and presents it through multiple analytical modes, including `3D`, `2D`, `Heatmap`, and `Hotspots`.

The repository also includes supporting pages for:

- model explanation and dual-track validation
- scenario simulation and policy sensitivity
- focused spatial analysis and corridor exploration
- 25-year historical PRODES intelligence and state benchmarking
- standalone visual outputs and analytical maps

This is a frontend-driven decision-support project. It operates as a precomputed static prototype and does not run live model training or real-time inference in the browser. The main runtime dataset is already prepared and stored in [data/forest_data_clean.json](data/forest_data_clean.json).

## Key Features

- Interactive 3D deforestation risk dashboard powered by WebGL/Deck.GL
- Multiple visualization modes for the same spatial dataset (3D, 2D, Heatmap, Hotspots)
- Right-side analytical panel for selected points with dynamic profile inspection
- Scenario simulation state integrated into the dashboard with parameterized policy levers
- Spatial deep-dive page for hotspot, corridor, and road-proximity exploration
- Historical intelligence module visualizing 25 years of sovereign INPE PRODES data (2001–2025)
- Export actions for selected locations and summary reports
- Additional standalone visual artifacts for presentation and competition review

## Project Structure

```text
Amazon-Deforestation-Risk-3D/
|- index.html                      # Primary 2D/3D decision-support dashboard
|- server.js                        # Local development HTTP server (Node.js)
|- package.json                     # Project manifest and Vercel build script
|- vercel.json                      # Vercel deployment routing configuration
|- README.md                        # Repository documentation and verification index
|- .gitignore                       # Version control ignore rules
|- GeoAI_3D_Map.html                # Supporting standalone 3D geospatial scene
|- GeoAI_3D_Map.css                 # Styles for standalone 3D scene
|- GeoAI_3D_Map.bundle.js           # Standalone Deck.gl/React client bundle
|- geoai-timeline.html              # Standalone temporal timeline view (Plotly export)
|- run_output.txt                   # Execution log for Model V2 training run
|- .vscode/                         # Editor configuration
|- artifacts/                       # Frozen model weights, manifests, and validation outputs
|  |- model-v2/                     # Model V2 weights (model_v2.json), features, and SHAP outputs
|  |- prodes-validation/            # Phase 5C retrospective validation labels and manifest
|  |- reproduction/                 # Original benchmark reproduction logs and manifest
|  `- validation-redesign/          # Phase 5D neutral lattice validation population
|- assets/                          # Static platform assets and modular page bundles
|  |- css/
|  |  `- platform.css               # Shared platform design system tokens and navigation
|  |- images/                       # Architectural diagrams and diagnostic charts
|  |  |- framework_diagram.png
|  |  |- geoai_framework.png
|  |  `- model_validation_results.png
|  `- pages/                        # Per-page modular CSS and JavaScript bundles
|     |- ai-model/
|     |- decision-film/
|     |- index/
|     |- intelligence-map/
|     |- scenario-simulator/
|     `- spatial-analysis/
|- data/                            # Spatial datasets and authoritative external records
|  |- external/                     # Sovereign INPE PRODES, IBGE, DEM, and highway sources
|  |- forest_data_clean.json        # Production spatial risk dataset (150,000 cells)
|  |- prodes_historical.json        # Sovereign PRODES annual loss series (2001–2025)
|  `- risk_area_stats.csv           # Production risk score distribution metadata
|- docs/                            # Research reports, governance, and submission dossier
|  |- archive/                      # Preserved historical documentation
|  |- global-readiness/             # Architecture, security, and global scalability audits
|  |- model-v2/                     # Model V2 research methodology, card, and results
|  |- prodes-validation/            # INPE PRODES validation methodology and label audit
|  |- reproducibility/              # Technical evidence package, model card, and protocols
|  |- reproduction-experiment/      # Benchmark reconstruction forensic audit
|  |- submission/                   # Competition submission package (docs/submission/final/)
|  |- validation-redesign/          # Phase 5D neutral validation lattice documentation
|  |- Graduation_Project_Report.md  # Research draft and methodology report
|  `- README.txt                    # Truth-aligned project notes
|- outputs/                         # Standalone analytical exports and presentation slides
|  |- GeoAI_Decision_Film.html      # Narrative decision film presentation
|  |- GeoAI_INTELLIGENCE_MAP.html   # Interactive Folium/Leaflet territory map
|  `- Project_*_Slide.html          # High-resolution HTML presentation slides
|- pages/                           # Analytical dashboard subpages
|  |- ai-model.html                 # AI model architecture and dual-track validation
|  |- historical-intelligence.html  # 25-year PRODES temporal intelligence and state ranks
|  |- impact-feasibility.html       # Environmental impact and operational feasibility
|  |- scenario-simulator.html       # Client-side policy sensitivity simulator
|  `- spatial-analysis.html         # Spatial analysis, corridor and hotspot workspace
|- scripts/                         # Offline research, validation, and build utilities
|  |- model_v2/                     # Model V2 feature engineering and training pipeline
|  |- prodes_validation/            # Phase 5C spatial join and validation scripts
|  |- reproduction/                 # Benchmark reproduction harness
|  |- validation_redesign/          # Phase 5D neutral grid generation scripts
|  |- constants.js                  # Shared platform constants and SSOT metrics
|  |- historical-intelligence.js    # Historical intelligence calculation engine
|  `- inject-token.js               # Vercel build-time Mapbox token injector
`- tests/                           # Automated regression and reproducibility test suites
   |- model_v2/                     # Model V2 unit, feature, and split tests
   |- prodes_validation/            # PRODES validation pipeline tests
   |- reproduction/                 # Reproduction pipeline tests
   |- validation_redesign/          # Validation redesign tests
   |- run_all_python_tests.py       # Master test runner (52 Python tests)
   |- test-historical.js            # Historical calculation tests (9 tests)
   `- unit.js                       # Frontend formula and priority tests (38 tests)
```

## Dual-Track Scientific Architecture & Benchmark Metrics (Locked SSOT)

The platform maintains a strict separation between two distinct modeling tracks:

### Track 1: Documented Production Benchmark (Dashboard Inference)
- **Architecture:** Offline-trained XGBoost classifier powering 150,000 precomputed spatial cells in the production dashboard.
- **Pilot Geography:** Rondônia, Brazil (Arc of Deforestation study zone).
- **Documented Benchmark Metrics:**
  - ROC-AUC: **0.82**
  - Precision: **0.79**
  - Recall: **0.84**
  - F1 Score: **0.81**
- **Documented Global Feature-Importance Reference:**
  *(Documented global feature-importance evidence used as an analytical attribution/reference layer; not learned linear coefficients and distinct from the Model V2 TreeSHAP ranking)*
  - Road Proximity: **41%**
  - Forest Loss (Temporal): **23%**
  - Population Pressure: **21%**
  - Elevation Constraints: **15%**

### Track 2: Independent Research Model V2 (Empirical Verification)
- **Architecture:** Independent out-of-time research model trained exclusively on sovereign Brazilian public data (INPE PRODES, IBGE 2022 Census, Copernicus DEM, DNIT Federal Highways) across 7,045 primary forest cells with 5 quantitative predictors. Research-only; not deployed as the production inference model.
- **Held-Out Test Partition (2024 Out-of-Time):**
  - ROC-AUC: **0.7474** (95% Bootstrap CI: `[0.5837, 0.9036]`)
  - PR-AUC: **0.005534** (reflecting extreme rare-event annual clear-cut prevalence of 0.14%)
  - Brier Calibration Score: **0.00693** (demonstrating that outputs represent relative spatial risk rankings rather than calibrated probabilities)
  - Retrospective Top-10% Enrichment: **5.0x** (top 10% ranked cells captured 5 of 10 observed 2024 events; retrospective ranking evidence, not measured field patrol gain)

## Production Status & Scientific Boundaries

This platform is an interactive, frontend-driven decision-support prototype built for spatial exploration and policy planning. It operates on precomputed spatial risk data and adheres to strict scientific boundaries:

- **Precomputed Decision Support:** The production dashboard renders precomputed spatial risk inferences over 150,000 cells. It does not perform live browser model training or real-time streaming inference.
- **Relative Risk Ranking:** Model outputs represent relative spatial risk rankings rather than calibrated probabilities. The Brier score ($0.00693$) confirms that probabilistic calibration is not established.
- **Non-Causal Association:** Feature importances and scenario sensitivity levers represent statistical associations within learned trees, not causal economic or deforestation guarantees.
- **No Speculative Operational Claims:** The project makes **no claims** of measured financial ROI, commercial dollar savings, verified carbon offsets, or measured field patrol efficiency gains.

## Technical Evidence & Reproducibility Package

For technical reviewers, machine learning evaluators, and competition judges, a comprehensive technical evidence package is provided in [`docs/reproducibility/`](docs/reproducibility/README.md):

- [Technical Evidence Package Overview](docs/reproducibility/README.md): Architecture overview, verified assets, and reproduction status.
- [Competition Technical Summary](docs/reproducibility/COMPETITION_TECHNICAL_SUMMARY.md): One-page briefing document and verification index.
- [Model Card](docs/reproducibility/MODEL_CARD.md): Formal model specifications, inputs, outputs, intended use, and limitations.
- [Data Provenance](docs/reproducibility/DATA_PROVENANCE.md): Complete audit of `data/forest_data_clean.json` and elevation extrusion caveats.
- [Feature Specification](docs/reproducibility/FEATURE_SPECIFICATION.md): Detailed feature inventory and global attribution breakdown.
- [Evaluation Protocol](docs/reproducibility/EVALUATION_PROTOCOL.md): Benchmark test metrics and spatial/temporal validation protocols.
- [SHAP Methodology](docs/reproducibility/SHAP_METHODOLOGY.md): TreeSHAP interpretability framework and verification steps.
- [Reproducibility Gaps](docs/reproducibility/REPRODUCIBILITY_GAPS.md): Audited breakdown of upstream training code and data gaps.
- [Full Reproduction Plan](docs/reproducibility/REPRODUCTION_PLAN.md): 12-stage engineering roadmap for independent retraining.
- [Model Governance](docs/reproducibility/MODEL_GOVERNANCE.md): Ethical boundaries, human-in-the-loop rules, and drift monitoring.
- [Technical Evidence Index](docs/reproducibility/TECHNICAL_EVIDENCE_INDEX.md): Reviewer question-and-answer evidentiary lookup matrix.
- [Competition Submission Dossier](docs/submission/final/README.md): Complete submission package for the Bibliotheca Alexandrina Youth Creators Award 2026.

## Main Runtime Files

| File | Role |
| --- | --- |
| [index.html](index.html) | Main 2D/3D decision-support dashboard |
| [assets/pages/index/app.js](assets/pages/index/app.js) | Dashboard logic, dataset loading, WebGL rendering, interaction |
| [assets/pages/index/styles.css](assets/pages/index/styles.css) | Dashboard styling and HUD layout |
| [data/forest_data_clean.json](data/forest_data_clean.json) | Precomputed forest-risk dataset (150,000 cells) |
| [pages/historical-intelligence.html](pages/historical-intelligence.html) | PRODES 25-Year Historical Intelligence & State Comparison |
| [pages/impact-feasibility.html](pages/impact-feasibility.html) | Environmental Impact, Operational Feasibility & Roadmap |
| [pages/spatial-analysis.html](pages/spatial-analysis.html) | Spatial analysis & hotspot workspace |
| [pages/scenario-simulator.html](pages/scenario-simulator.html) | Client-side policy sensitivity simulator |
| [pages/ai-model.html](pages/ai-model.html) | Model explanation, feature weights, and validation metrics |

## How It Works

1. The dashboard fetches [data/forest_data_clean.json](data/forest_data_clean.json).
2. Risk points are rendered on top of the map using Deck.GL.
3. Users switch between visualization modes and map styles.
4. Selecting a point opens detailed analysis in the right panel.
5. Scenario settings can modify the displayed risk interpretation.
6. Spatial analysis opens as a dedicated deep-dive page.

## Running Locally

Because the dashboard loads geospatial datasets via client-side `fetch()`, files must be served through a local HTTP server rather than opened directly via `file://`.

### Option 1: Node.js Built-in Server (Recommended)

```bash
node server.js
```

Then navigate to: `http://localhost:5500`

### Option 2: Python HTTP Server

```bash
python -m http.server 8000
```

Then navigate to: `http://localhost:8000/index.html`

## Technology Stack

- HTML5, CSS3, and vanilla JavaScript (ES6+)
- Deck.GL (v8.9.0)
- Mapbox GL JS (v1.13.0)
- Chart.js
- D3.js (v7)
- jsPDF (v2.5.1)
- Python 3 for offline research pipelines (XGBoost, GeoPandas, Shapely, Scipy)

## Notes

- The dashboard is the main decision-support product in this repository.
- The runtime dataset is precomputed and optimized for browser rendering performance.
- The standalone files in [outputs/](outputs/) are exported supporting artifacts and presentation materials.
- All 99 automated unit, historical, and scientific tests pass with a 100% success rate (`tests/run_all_python_tests.py`, `tests/unit.js`, `tests/test-historical.js`).

## Supporting Documentation & Code

- [docs/Graduation_Project_Report.md](docs/Graduation_Project_Report.md): Research draft and methodology report
- [docs/archive/implementation_plan.md](docs/archive/implementation_plan.md): Archived initial implementation notes
- [scripts/constants.js](scripts/constants.js): Shared platform configuration and SSOT metrics
- [scripts/historical-intelligence.js](scripts/historical-intelligence.js): PRODES 25-year time-series computation engine
- [docs/submission/final/README.md](docs/submission/final/README.md): Official Competition Submission Dossier (BA Youth Creators Award 2026)
