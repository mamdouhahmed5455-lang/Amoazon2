# GeoAI Deforestation Risk Platform — Official Jury Demo Path

**Competition:** Bibliotheca Alexandrina Youth Creators Award 2026 — Technology Creativity Track  
**Project:** Amazon Deforestation Risk Intelligence / GeoAI Deforestation Risk Platform  
**Principal Developer & Researcher:** Mamdouh Alwakil  
**Study Area:** Rondônia, Brazilian Amazon Basin  
**Evaluation Target:** 3–5 Minute Live Walkthrough (Standard Budget: 4:00 | Compressed Fast-Track: 2:20)  
**Deliverable Files:** [`Demo_Path.html`](file:///d:/Amazon-Deforestation-Risk-3D/docs/submission/Demo_Path.html) · [`Demo_Path.pdf`](file:///d:/Amazon-Deforestation-Risk-3D/docs/submission/Demo_Path.pdf) · [`Demo_Path.md`](file:///d:/Amazon-Deforestation-Risk-3D/docs/submission/Demo_Path.md)

---

## Executive Summary & Narrative Architecture

This document defines the official, repeatable, jury-first demonstration path for the production web application. It guides the presenter through an intentional, evidence-grounded walkthrough structured around a 6-stage decision narrative:

$$\text{Observe} \longrightarrow \text{Identify} \longrightarrow \text{Explain} \longrightarrow \text{Contextualize} \longrightarrow \text{Explore} \longrightarrow \text{Decide}$$

The goal is **not** to perform unstructured exploration or make speculative claims about future expansion. The goal is to demonstrate a working technological prototype that organizes heterogeneous spatial data into an interpretable risk-screening workflow—while maintaining absolute fidelity to scientific guardrails.

---

## Master 4-Minute Presentation Timeline

```
[0:00 ── 0:20] STEP 01: ORIENT & SCOPE (Rondônia Basin Context & ~150k Cells)
[0:20 ── 1:10] STEP 02: SPATIAL RISK FIELD (3D Deck.gl Surface & Relative Risk Ranking)
[1:10 ── 1:45] STEP 03: HIGH-RISK FOCUS (Rondônia Arc Hotspot & Point Screening)
[1:45 ── 2:30] STEP 04: EXPLAIN RISK SIGNAL (Dual-Track Architecture & TreeSHAP Attribution)
[2:30 ── 3:10] STEP 05: HISTORICAL CONTEXT (25-Year PRODES Series: 2001–2025)
[3:10 ── 3:40] STEP 06: SCENARIO EXPLORATION (Exploratory Sensitivity Simulation Sliders)
[3:40 ── 4:00] STEP 07: DECISION STORY & CLOSE (Targeted Inspection Planning & Value Flow)
```

---

## Master 7-Step Sequence Summary Matrix

| Step | Narrative Phase | Application Route / Component | Primary Presenter Action | Core Evidence Displayed | Standard Budget | Compressed Alternative |
| :---: | :--- | :--- | :--- | :--- | :---: | :---: |
| **01** | **Orient & Scope** | `index.html` (Hero banner & status dot) | State study area, territorial scale, and project differentiation | Rondônia state boundary; ~150,000 precomputed cells | 0:20 (20s) | 0:10 (10s) |
| **02** | **Spatial Risk Field** | `index.html` (Map controls: `btn3d` / `btn2d`) | Pan/tilt 3D Deck.gl view; toggle 2D grid and Hotspot layers | 3D risk extrusion (BR-364 corridor); relative risk scale | 0:50 (50s) | 0:30 (30s) |
| **03** | **High-Risk Focus** | Sidebar `Story` Tab $\rightarrow$ `focusTopHotspot()` | Click `Target Highest-Risk Hotspot` (auto-fly to Arc Hotspot) | LAT -11.9182, LON -63.8722; 84% Risk; Urgent priority | 0:35 (35s) | 0:20 (20s) |
| **04** | **Explain Risk Signal**| `pages/ai-model.html` | Show Dual-Track Architecture & TreeSHAP attribution bars | Track 1 (AUC 0.82) vs Track 2 (AUC 0.7474, 5.0× lift); SHAP | 0:45 (45s) | 0:30 (30s) |
| **05** | **Historical Context** | `pages/historical-intelligence.html` | Check `Compare with Rondônia`; click 2004/2012 cards | 25-yr official PRODES series (2001–2025); Rondônia vs Basin | 0:40 (40s) | 0:20 (20s) |
| **06** | **Scenario Exploration**| `pages/scenario-simulator.html` | Move Road slider; toggle Strict Reserve policy switch | Projected risk shift (+2.3% to -4.1%); distribution curves | 0:30 (30s) | 0:15 (15s) |
| **07** | **Decision Story Close**| `index.html` (Sidebar Story Steps 04–05) | Highlight targeted verification protocol and 5-node value flow | Targeted inspection planning; structured decision workflow | 0:20 (20s) | 0:15 (15s) |
| **TOTAL**| **Full Walkthrough** | **Verified 7-Step Route** | **Complete Live Platform Demonstration** | **Dual-Track GeoAI Prototype** | **4:00 Total**| **2:20 Fast** |

---

## Presenter Discipline: Must Show vs. Skip Decision Matrix

### 1. Must Show (Core Credibility & Wow)
- **3D Spatial Risk Extrusion:** Visual prioritization across the Rondônia landscape (Steps 01–02).
- **~150,000 Spatial Scale:** Precomputed cell resolution covering the entire state territory (Step 01).
- **Specific Hotspot Inspection:** Rondônia Arc cell at LAT -11.9182, LON -63.8722 (84% score, Urgent priority) (Step 03).
- **Dual-Track Scientific Distinction:** Track 1 (Production Benchmark: ROC-AUC 0.82) vs Track 2 (Independent Research Model V2: ROC-AUC 0.7474, 5.0× retrospective enrichment) (Step 04).
- **Model Attribution vs Drivers:** Model V2 TreeSHAP shows historical-loss distance at 41.28%; separate documented global analytical driver importance assigns 41% to road proximity (Step 04).
- **25-Year PRODES History:** Official INPE ground-truth from 2001 to 2025 (Step 05).
- **Decision-Support Framing:** Clear positioning as risk screening and verification planning, not loss replacement (Step 07).

### 2. Nice to Show (If Time Permits)
- **Basemap Switcher:** Toggle between Analytical, Terrain, and Satellite styles.
- **Risk Trajectory Chart:** Point-level 2030–2035 trend canvas in the dashboard sidebar.
- **Report Export Options:** CSV, GeoJSON, and PDF export trigger buttons.
- **Policy Preset Buttons:** Quick presets ("Worst Case" vs "Conservation Focus") in the simulator.
- **Jurisdiction Dropdown:** Comparing Amazônia Legal with Pará or Mato Grosso in historical intelligence.
- **Historical Milestone Cards:** Highlighting 2004 peak (27,772 km²) or 2012 historic trough (4,571 km²).

### 3. Deliberately Skip (Avoid Distractions & Rabbit Holes)
- **Source Code Walkthrough:** Do not open IDEs or review JavaScript library dependencies unless requested.
- **WebGL Shaders:** Avoid deep technical tangents on Deck.gl GPU buffer management.
- **Calibrated Probabilities:** Never claim a score represents a percentage likelihood of future loss.
- **Live Satellite Telemetry:** Never claim active real-time streaming connections (e.g., NASA FIRMS).
- **Live XGBoost Retraining:** Scenario sliders are analytical sensitivity functions, not browser-side model training.
- **Institutional Partnerships:** Do not claim formal operational deployment with IBAMA, ICMBio, or SEDAM.
- **Carbon Offset Revenues:** Do not speculate on dollar amounts or commercial financial ROI.

---

## Screen-by-Screen Presenter Script & Route

### STEP 01 — ORIENT & SCOPE (0:00–0:20 | 20s)
- **Screen:** `index.html` (Hero banner & status dot: "Pre-calculated Predictive Dashboard")
- **Tag:** `[Must Show]`
- **Show:** The landing screen over the state of Rondônia, top navigation bar, status indicator, and ~150,000 spatial cells scale.
- **Purpose:** Establish the project's geographic scope, territorial scale, and fundamental value proposition: proactive spatial risk screening rather than passive post-deforestation mapping.
- **Presenter Script (SAY):**
  > *“This platform organizes environmental spatial data into proactive risk intelligence for the state of Rondônia in the Brazilian Amazon. Rather than mapping deforestation after tree cover is lost, it evaluates 150,000 precomputed cells to surface areas of elevated spatial vulnerability.”*
- **Deliberately Skip:** Implementation details, GitHub repository structure, or raw data ingestion pipelines.

---

### STEP 02 — SPATIAL RISK FIELD (0:20–1:10 | 50s)
- **Screen:** `index.html` (Top-right map controls: `btn3d`, `btn2d`, `btnHeat`, `btnHotspot`)
- **Tag:** `[Must Show]`
- **Action:** Pan and tilt the 3D Deck.gl layer; toggle between 3D extrusion, 2D grid, and Hotspot layers.
- **Show:** 3D column extrusion where column height and color represent relative spatial risk score (0–100%). High-risk clusters are clearly visible along Highway BR-364 and expanding agricultural frontiers.
- **Purpose:** Demonstrate high-performance WebGL visualization while establishing essential scientific guardrails: relative risk ranking, not calibrated probability; visual extrusion, not physical elevation.
- **Presenter Script (SAY):**
  > *“The 3D surface visually prioritizes landscape risk. Vertical column height is a visual representation of normalized risk intensity, not physical elevation. Crucially, this represents a relative spatial risk ranking, not a calibrated probability forecast.”*
- **Deliberately Skip:** Speculating on physical tree heights or claiming real-time satellite telemetry.

---

### STEP 03 — FOCUS ON A HIGH-RISK AREA (1:10–1:45 | 35s)
- **Screen:** `index.html` (Sidebar `Story` Tab $\rightarrow$ click button `Target Highest-Risk Hotspot` / `focusTopHotspot()`)
- **Tag:** `[Must Show]`
- **Action:** Open sidebar `Story` Tab; click button `Target Highest-Risk Hotspot`.
- **Show:** Smooth camera transition targeting the Rondônia Arc Hotspot (LAT -11.9182 | LON -63.8722). Inspect 84% Risk Score (Heuristic), Urgent Priority badge, and driver contribution summary.
- **Purpose:** Ground the macro-scale surface into a concrete, auditable point screening event.
- **Presenter Script (SAY):**
  > *“By targeting the highest-priority hotspot, we see exactly why the area receives a higher relative spatial risk score and is surfaced for screening. The platform flags this cell because it sits at the immediate intersection of active clearing frontiers and primary access corridors.”*
- **Deliberately Skip:** Claiming this point is an active fire or confirmed ongoing deforestation event today without physical ground verification.

---

### STEP 04 — EXPLAIN WHY THE SCORE EXISTS (1:45–2:30 | 45s)
- **Screen:** `pages/ai-model.html`
- **Tag:** `[Must Show]`
- **Action:** Navigate to `AI Model`; scroll through Tree Ensemble architecture to the Dual-Track KPI grids and TreeSHAP attribution bars.
- **Show:** Track 1 (0.82) vs Track 2 (0.7474, 5.0× retrospective top-decile enrichment); Model V2 TreeSHAP shows historical-loss distance at 41.28%. The separate documented global analytical driver importance assigns 41% to road proximity.
- **Purpose:** Prove machine learning interpretability and transparent scientific integrity.
- **Presenter Script (SAY):**
  > *“The system does not treat AI as a black box; it exposes the spatial signals behind every score. We strictly separate the documented 0.82 production benchmark from our independent research evaluation: Model V2 TreeSHAP shows historical-loss distance at 41.28%, while the separate documented global analytical driver importance assigns 41% to road proximity.”*
- **Deliberately Skip:** Mathematical derivations of gradient boosted trees; do not claim Model V2 is running live in production.

---

### STEP 05 — HISTORICAL CONTEXT (2:30–3:10 | 40s)
- **Screen:** `pages/historical-intelligence.html`
- **Tag:** `[Must Show]`
- **Action:** Check `Compare with Rondônia` (`hiCompareRondonia`); click historical milestone callouts (2004 Peak, 2012 Low, 2025 Current).
- **Show:** 25-year official PRODES time series (2001–2025). Compare Amazônia Legal (5,731 km² in 2025) with the Rondônia benchmark (647 km²). Highlight historical policy turning points.
- **Purpose:** Contextualize risk predictions within sovereign historical environmental monitoring.
- **Presenter Script (SAY):**
  > *“Spatial risk cannot be evaluated in isolation. We place the risk layer inside a 25-year historical monitoring continuum from INPE PRODES, allowing analysts to compare current spatial vulnerability against multi-decade basin trends and policy shifts.”*
- **Deliberately Skip:** Lengthy political commentary on past Brazilian presidential administrations.

---

### STEP 06 — SCENARIO EXPLORATION (3:10–3:40 | 30s)
- **Screen:** `pages/scenario-simulator.html`
- **Tag:** `[Nice to Show / Core Demo]`
- **Action:** Move the `Road Network Expansion` slider (`roadSlider`); toggle the `Strict Forest Reserve` policy switch.
- **Show:** Dynamic shift in Projected Regional Risk (+2.3% to -4.1%) and the comparative risk distribution chart.
- **Purpose:** Demonstrate exploratory policy sensitivity simulation with strict scientific guardrails against false forecasting claims.
- **Presenter Script (SAY):**
  > *“The simulator allows decision-makers to explore policy assumptions through analytical sensitivity modeling. We explicitly present this as exploratory sensitivity simulation, not live browser-side XGBoost retraining or deterministic forecasting.”*
- **Deliberately Skip:** Claiming this predicts exact future deforestation hectares or financial carbon offset revenues.

---

### STEP 07 — DECISION STORY / CLOSE (3:40–4:00 | 20s)
- **Screen:** `index.html` (Sidebar `Story` Tab, Steps 04–05: "What Should Happen Next?" & "Value Flow")
- **Tag:** `[Must Show]`
- **Action:** Return to `index.html`; highlight Decision Story Step 04 & 05 Value Flow.
- **Show:** The inspection planning window and decision-support value flow toward verification planning.
- **Purpose:** Conclude with a memorable, grounded statement defining the platform's true utility.
- **Presenter Script (SAY):**
  > *“The purpose is not to replace established forest-monitoring systems. It is to organize spatial evidence into an interpretable workflow for risk screening, prioritization, contextual analysis, and verification planning.”*
- **Deliberately Skip:** Overpromising guaranteed real-world patrol enforcement cost reductions.

---

## Demonstration Failure Safety & 4-Tier Fallback Protocol

Live browser demonstrations in competition environments can experience GPU freezes, network drops, or UI stutters. The presenter must follow this pre-defined 4-tier fallback matrix:

| Failure Scenario | Trigger / Symptom | Immediate Technical Pivot | Presenter Script & Behavioral Protocol |
| :--- | :--- | :--- | :--- |
| **Tier 1: WebGL Crash / GPU Context Lost** | 3D map canvas turns black or Deck.gl fails to initialize. | Click `2D` button (`btn2d`) or switch to `Analytical` basemap (`styleDark`). 2D canvas renders reliably without GPU instancing. | *“Let us switch instantly to our high-contrast 2D spatial screening view. This isolates the spatial risk field across the 150,000 cells without requiring 3D WebGL depth buffers.”* (Keep momentum; no apology). |
| **Tier 2: Network Throttling / Slow Basemap** | Mapbox satellite tiles load sluggishly or show blank grey squares. | Toggle to `Analytical` style (`styleDark`). The vector polygon grid is precomputed and cached locally in browser memory. | *“The precomputed 150,000 risk cells are fully cached in browser memory, enabling analytical spatial screening independent of external satellite tile delivery.”* |
| **Tier 3: Full Browser Freeze / Tab Crash** | Browser becomes unresponsive during 3D camera transitions. | Pivot immediately to pre-opened fallback tab or high-resolution PDF dossier (`GeoAI_Technical_Evidence.pdf`). | *“As documented in our technical evidence dossier, the identical precomputed risk field can be examined directly here in our published submission records.”* (Never claim a static PDF is live data). |
| **Tier 4: Interaction / Slider Stutter** | Simulator sliders or animation loops hitch or lag. | Skip simulator; pivot directly to Step 02 & 03 of the Decision Story sidebar in `index.html`. | *“The analytical sensitivity model demonstrates that road proximity drives +41% of risk expansion, as verified in our sidebar feature attribution panel.”* |

### Golden Execution Rules
1. **Pre-Load Exact Tabs:** Before entering the jury room, open and keep active three browser tabs: (1) `index.html`, (2) `pages/ai-model.html`, and (3) `pages/historical-intelligence.html`. Avoid live page reloads during the demo.
2. **Never Bluff Glitches:** If an interaction fails, acknowledge it with professional poise and pivot to the next verified view. Never pretend a static fallback is streaming live data.
3. **Anchor on Locked Metrics:** When challenged on numbers, cite locked submission metrics: ROC-AUC 0.82 (Track 1) and ROC-AUC 0.7474 with 5.0× retrospective enrichment (Track 2).

---

## Jury Defense: Top 5 Technical Challenge Questions

### Q1: “Is this model predicting the exact probability of deforestation occurring next month?”
**Defense:**  
*“No. We explicitly do **not** claim calibrated probability forecasts. Because deforestation is an extreme rare event (0.14% annual prevalence in the test lattice), Raw scores are interpreted as relative spatial risk rankings across the precomputed cells, not as calibrated probabilities.”*

### Q2: “What does the 5.0× lift metric actually mean, and how was it measured?”
**Defense:**  
*“The 5.0× metric represents **retrospective top-decile enrichment** evaluated out-of-time on official PRODES 2024 clear-cuts. When inspecting the top 10% highest-ranked test cells, the model captured 5 out of the 10 observed clearing events (50% recall), which is exactly 5.0 times higher than random inspection (10%). It is not an operational patrol field measurement.”*

### Q3: “Does your platform ingest live real-time satellite telemetry or NASA FIRMS alerts?”
**Defense:**  
*“No. The current production application operates on **150,000 precomputed spatial cells** derived from authoritative annual INPE PRODES, IBGE, and infrastructure records. Real-time satellite alert integration is documented as a future deployment phase, not an active prototype feature.”*

### Q4: “Why does historical loss proximity dominate the model over road infrastructure in Model V2?”
**Defense:**  
*“In this evaluation sample, proximity to historical loss was the strongest single-feature benchmark, suggesting strong spatial persistence in the observed clearing pattern. This is an empirical finding, not a universal causal claim.”*

### Q5: “Why did you develop Model V2 instead of simply reproducing the original 0.82 benchmark?”
**Defense:**  
*“The original 0.82 benchmark is documented from the project's inception, but its training labels were unrecorded in the repository. Rather than manufacturing synthetic pseudo-labels to fake a reproduction, we exercised **scientific discipline**: locking the 0.82 benchmark as Track 1 and conducting an independent, reproducible out-of-time evaluation (Model V2) as Track 2.”*

---

## Confident Transition into Jury Q&A

> *“Thank you. We have structured this platform to prove that AI in conservation is most valuable when it provides transparent, interpretable decision support within rigorously defined scientific boundaries. I welcome your questions.”*
