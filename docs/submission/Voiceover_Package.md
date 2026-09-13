# GeoAI Deforestation Risk Platform — Professional Voice-Over & Competition Video Package

**Competition:** Bibliotheca Alexandrina Youth Creators Award 2026 — Technology Creativity Track  
**Project:** Amazon Deforestation Risk Intelligence / GeoAI Deforestation Risk Platform  
**Principal Developer & Researcher:** Mamdouh Alwakil  
**Study Area:** Rondônia, Brazilian Amazon Basin  
**Deliverable Files:** [`Voiceover_Package.html`](file:///d:/Amazon-Deforestation-Risk-3D/docs/submission/Voiceover_Package.html) · [`Voiceover_Package.pdf`](file:///d:/Amazon-Deforestation-Risk-3D/docs/submission/Voiceover_Package.pdf) · [`Voiceover_Package.md`](file:///d:/Amazon-Deforestation-Risk-3D/docs/submission/Voiceover_Package.md)

---

## Executive Summary & Presentation Format Strategy

This package provides the complete, production-ready voice-over scripts, visual timing plans, pronunciation standards, and technical recording protocols for the competition video submission.

### Two Presentation Formats Defined
1. **Format A: Primary Competition Video (90–120 Seconds / ~252 Words):**
   - **Primary Evaluated Asset:** Designed to deliver a fast, compelling, credible first impression to the competition jury.
   - **Narrative Arc:** *Problem $\rightarrow$ Idea $\rightarrow$ Technology $\rightarrow$ Demonstrated Prototype $\rightarrow$ Scientific Evidence $\rightarrow$ Decision Value $\rightarrow$ Responsible Future Direction*.
   - **Target Duration:** Approximately 112 seconds (1:52) at a disciplined 135 words per minute.
2. **Format B: Express Video (~60 Seconds / ~128 Words):**
   - **Preview & Social Asset:** Highly compressed, fast-paced version for social sharing, trailers, or rapid juror briefings.
   - **Target Duration:** Approximately 57 seconds at 135 words per minute.
3. **Relationship to the Existing 4-Minute Demo Path:**
   - The previously developed [`Demo_Path.pdf`](file:///d:/Amazon-Deforestation-Risk-3D/docs/submission/Demo_Path.pdf) remains the dedicated guide for an *interactive live demonstration* if jurors sit down with the platform.
   - The competition video introduces the project concisely and does not attempt to compress the full 4-minute live walkthrough into 90 seconds.

---

## Format A: Primary 90–120 Second Competition Video Script

### Master Narrative Arc (7 Stages)
$$\text{Problem} \longrightarrow \text{Idea} \longrightarrow \text{Technology} \longrightarrow \text{Prototype} \longrightarrow \text{Evidence} \longrightarrow \text{Value} \longrightarrow \text{Direction}$$

### Verbatim Voice-Over Script

#### SCENE 1: THE CONTEXT & OPPORTUNITY (0:00–0:12 | 12s · 30 Words)
> *“Brazil already monitors forests at scale through systems like PRODES. This project explores how multiple spatial signals can be organized into a **proactive risk-screening workflow** for the state of Rondônia.”*

#### SCENE 2: THE SPATIAL RISK SURFACE (0:12–0:28 | 16s · 23 Words)
> *“Across approximately **150,000 precomputed cells**, the platform transforms multi-source spatial indicators into a **relative risk surface** that reveals where screening priority is higher.”*

#### SCENE 3: HOTSPOT PRIORITIZATION (0:28–0:42 | 14s · 23 Words)
> *“The platform surfaces high-priority cells for screening based on their **relative spatial risk score**, focusing attention along active agricultural frontiers and access corridors.”*

#### SCENE 4: AI METHODOLOGY & DUAL-TRACK EVIDENCE (0:42–1:02 | 20s · 44 Words)
> *“Under the hood, an **offline XGBoost classifier** evaluates multi-source spatial features. We maintain **two distinct evidence tracks**: a documented production benchmark with a **0.82 ROC-AUC**, and an independent research evaluation on held-out PRODES 2024 data achieving a **0.7474 ROC-AUC** with **5.0x retrospective top-decile enrichment**.”*

#### SCENE 5: INTERPRETABILITY & HISTORICAL GROUNDING (1:02–1:16 | 14s · 51 Words)
> *“The project does not simply rank locations; it examines the spatial signals behind those rankings. **TreeSHAP helps expose the signals behind the research model**, with historical-loss proximity contributing **41.3%** of the measured attribution in this evaluation. This evidence is complemented by a longer **25-year PRODES record** and documented regional driver analysis.”*

#### SCENE 6: EXPLORATORY SCENARIO SIMULATION (1:16–1:30 | 14s · 25 Words)
> *“This simulator explores how changing assumptions can shift relative spatial priorities. It is an **exploratory sensitivity model, not live forecasting**, designed to evaluate policy trade-offs.”*

#### SCENE 7: DECISION-SUPPORT VALUE (1:30–1:45 | 15s · 16 Words)
> *“The result is a structured **decision-support workflow** for spatial screening, prioritization, contextual analysis, and **verification planning**.”*

#### SCENE 8: RESPONSIBLE CLOSING (1:45–2:00 | 15s · 30 Words)
> *“The goal is **not to replace established forest-monitoring systems**, but to organize spatial evidence into an interpretable workflow that helps decision-makers focus attention where further verification may be most useful.”*

### Timing & Word Count Summary
- **Total Word Count:** 242 words.
- **Delivery Cadence:** 135–140 words per minute.
- **Estimated Spoken Runtime:** ~108 seconds (1 minute 48 seconds @ 135 WPM / ~104 seconds @ 140 WPM), falling squarely within the target 90–120 second window.

---

## Scene-by-Scene Video Production Plan

| Scene | Timecode | Screen / Route | Visual Presenter Action | Synced Voice-Over Script | On-Screen Text Supers | Transition |
| :---: | :---: | :--- | :--- | :--- | :--- | :---: |
| **01** | **0:00–0:12** | `index.html` (Hero banner & status dot) | Wide establishing view of Rondônia state boundary; slow cinematic push. | “Brazil already monitors forests at scale through systems like PRODES. This project explores how multiple spatial signals can be organized into a proactive risk-screening workflow for the state of Rondônia.” | **GeoAI Deforestation Risk Platform**<br>Study Area: Rondônia, Brazilian Amazon | Fade in from black |
| **02** | **0:12–0:28** | `index.html` (`btn3d` map controls) | Smooth 3D tilt of Deck.gl perspective; reveal extruded risk columns along BR-364. | “Across approximately 150,000 precomputed cells, the platform transforms multi-source spatial indicators into a relative risk surface that reveals where screening priority is higher.” | **150,000 Precomputed Grid Cells**<br>Relative Spatial Risk Score (0–100%) | Smooth camera pan |
| **03** | **0:28–0:42** | Sidebar `Story` Tab $\rightarrow$ `focusTopHotspot()` | Click `Target Highest-Risk Hotspot`; camera auto-flies to Rondônia Arc Hotspot. | “The platform surfaces high-priority cells for screening based on their relative spatial risk score, focusing attention along active agricultural frontiers and access corridors.” | **Priority Hotspot Screening**<br>LAT -11.9182 \| LON -63.8722 (84% Risk Score (Heuristic)) | Dynamic camera transition |
| **04** | **0:42–1:02** | `pages/ai-model.html` | Scroll through Tree Ensemble diagram to Dual-Track KPI benchmark cards. | “Under the hood, an offline XGBoost classifier evaluates multi-source spatial features. We maintain two distinct evidence tracks: a documented production benchmark with a 0.82 ROC-AUC, and an independent research evaluation on held-out PRODES 2024 data achieving a 0.7474 ROC-AUC with 5.0x retrospective top-decile enrichment.” | **Dual-Track Scientific Evidence**<br>Track 1: ROC-AUC 0.82 \| Track 2: ROC-AUC 0.7474<br>5.0x Retrospective Enrichment | Clean cut to AI Model page |
| **05** | **1:02–1:16** | `pages/ai-model.html` & `pages/historical-intelligence.html` | Highlight TreeSHAP feature attribution bars (41.3%) and 25-year PRODES chart. | “The project does not simply rank locations; it examines the spatial signals behind those rankings. TreeSHAP helps expose the signals behind the research model, with historical-loss proximity contributing 41.3% of the measured attribution in this evaluation. This evidence is complemented by a longer 25-year PRODES record and documented regional driver analysis.” | **Model Explainability & History**<br>Historical Loss Proximity: 41.3% SHAP<br>PRODES Continuum: 2001–2025 | Smooth pan to PRODES chart |
| **06** | **1:16–1:30** | `pages/scenario-simulator.html` | Adjust Road slider (+20%); toggle strict forest reserve switch; show risk delta. | “This simulator explores how changing assumptions can shift relative spatial priorities. It is an exploratory sensitivity model, not live forecasting, designed to evaluate policy trade-offs.” | **Exploratory Scenario Simulation**<br>Analytical Sensitivity (Not Live Forecasting) | Quick cut to Simulator |
| **07** | **1:30–1:45** | `index.html` (Decision Story Steps 04–05) | Highlight inspection planning window and 5-node decision flow. | “The result is a structured decision-support workflow for spatial screening, prioritization, contextual analysis, and verification planning.” | **Decision-Support Workflow**<br>Screening $\rightarrow$ Prioritization $\rightarrow$ Verification Planning | Return to Dashboard |
| **08** | **1:45–2:00** | Branded Closing Slate | Display clean credit slide with author, award track, and repository URL. | “The goal is not to replace established forest-monitoring systems, but to organize spatial evidence into an interpretable workflow that helps decision-makers focus attention where further verification may be most useful.” | **Principal Developer: Mamdouh Alwakil**<br>Bibliotheca Alexandrina Youth Creators Award 2026<br>Technology Creativity Track | Slow fade to black |

---

## Format B: 60-Second Express Version (Preview & Social)

### Overview
- **Duration:** ~57 seconds (128 words @ 135 wpm).
- **Purpose:** Quick pitch, competition teaser, social sharing, and rapid juror briefings.

### Verbatim Express Voice-Over Script
- **[0:00–0:10] Beat 01 (Context):**  
  *“Brazil already monitors deforestation at scale. This GeoAI platform explores how spatial signals can be organized into a **proactive risk-screening workflow** for Rondônia.”* (23 words)
- **[0:10–0:22] Beat 02 (Surface & Prioritization):**  
  *“Across **150,000 precomputed grid cells**, the system calculates **relative spatial risk rankings**, surfacing high-priority hotspots along active agricultural frontiers.”* (19 words)
- **[0:22–0:38] Beat 03 (Dual-Track Evidence):**  
  *“Powered by **offline XGBoost**, the platform maintains two distinct evidence tracks: a documented production benchmark with a **0.82 ROC-AUC**, and an independent research evaluation on PRODES 2024 with a **0.7474 ROC-AUC and 5.0x retrospective top-decile enrichment**.”* (36 words)
- **[0:38–0:50] Beat 04 (Explainability & Simulation):**  
  *“**TreeSHAP attribution** and 25 years of PRODES history explain the spatial signals, while a scenario simulator enables **exploratory policy sensitivity analysis**.”* (21 words)
- **[0:50–1:00] Beat 05 (Responsible Close):**  
  *“Designed **not to replace monitoring systems**, but to help decision-makers focus attention where **verification planning** is needed most.”* (18 words)

---

## Pronunciation Key & Vocal Delivery Guide

### Phonetic Pronunciation Key
| Term | Respelling Key | IPA Transcription | Articulatory Guidance & Pitfalls to Avoid |
| :--- | :--- | :---: | :--- |
| **Rondônia** | **ron-DOHN-yah** | `[ʁõˈdõniɐ]` | Brazilian state. Stress on the middle syllable **“DOHN”**. Do *not* say “ron-don-EE-ah”. |
| **GeoAI** | **JEE-oh-AY-EYE** | `[ˌdʒiː.oʊ.eɪˈaɪ]` | Enunciate “Geo” smoothly, followed by distinct letters “A-I”. |
| **PRODES** | **PRAW-dez** | `[ˈpɾɔdʒis]` | Brazilian Amazon satellite monitoring program. First syllable rhymes with “raw”. Stress first syllable. |
| **XGBoost** | **X-G-Boost** | `[ˌɛks.dʒiːˈbuːst]` | Pronounce each letter clearly: “X”, “G”, then “Boost”. Avoid blending into “X-Boost”. |
| **TreeSHAP** | **Tree-SHAP** | `[triː-ʃæp]` | “Tree” followed by “SHAP” (rhymes with “map” and “trap”). |
| **IBAMA** | **ee-BAH-mah** | `[iˈbɐ̃mɐ]` | Brazilian environmental protection agency. Primary stress on middle syllable **“BAH”**. |
| **ICMBio** | **ee-sem-BEE-oh** | `[iˌsẽmiˈbi.u]` | Chico Mendes Institute. Four distinct syllables: ee-sem-BEE-oh. Stress on **“BEE”**. |

### Vocal Persona & Cadence Guidelines
- **Persona:** The Project Creator & Researcher — calm, authoritative, intellectually rigorous, confident. Avoid sounding like a commercial voiceover or hyped product trailer.
- **Pacing:** Disciplined 130–140 words per minute. Never rush technical terms or metric recitations.
- **Micro-Pauses (0.3s):** Insert distinct pauses before contrasting clauses (e.g., *“...exploratory sensitivity model [pause] not live forecasting”*).
- **Downward Inflection:** Avoid rising pitch at sentence endings (up-talk); conclude every factual statement with a firm downward cadence.

---

## Technical Recording & Editing Master Checklist

### 1. Audio Setup & Mastering Specifications
- [ ] **Microphone:** Broadcast dynamic or large-diaphragm condenser mic placed 15–20 cm at 45° off-axis with dual-layer pop filter.
- [ ] **Gain Staging:** Peak signal between -12 dB and -6 dB True Peak; room noise floor below -50 dB.
- [ ] **Target Loudness:** Mastered to **-16 LUFS Integrated** (±0.5 LUFS) with -1.0 dB True Peak ceiling.
- [ ] **Background Music:** Subtle ambient/acoustic bed mixed at **-24 dB to -28 dB** beneath voice-over. Zero percussion clash.

### 2. Screen Capture Protocol
- [ ] **Resolution & Framerate:** 1920×1080 Full HD (or 3840×2160 4K) at 60 fps Constant Framerate (CFR).
- [ ] **Clean Browser:** Fullscreen mode (F11); bookmarks, extensions, URL bar, and OS taskbar hidden.
- [ ] **Cursor Discipline:** Smooth, deliberate cursor paths; zero nervous or erratic mouse circling.
- [ ] **Deck.gl Camera:** Continuous, dampened camera rotation; avoid sudden discrete zoom steps.

### 3. Subtitles & Closed Captions
- [ ] **Font:** Inter, Helvetica Neue, or SF Pro Display (Semi-Bold, White with 1px black outline or 40% translucent pill).
- [ ] **Limits:** Maximum 2 lines per title card; maximum 37 characters per line.
- [ ] **Delivery:** Export clean master video alongside burned-in open captions version and standalone `.srt` file.

### 4. Final 10-Point Pre-Submission Quality Control
1. [x] Zero calibrated probability claims (Relative Spatial Risk Score only).
2. [x] Track 1 (0.82) and Track 2 (0.7474) remain visibly and audibly distinct.
3. [x] 5.0× lift is defined strictly as retrospective top-decile enrichment.
4. [x] Zero live satellite telemetry (NASA FIRMS) or runtime browser training claims.
5. [x] 3D extrusion height is identified as risk intensity, not physical elevation.
6. [x] Primary video duration falls strictly between 90 and 120 seconds (~114s).
7. [x] Express video duration falls under 60 seconds (~57s).
8. [x] Voice-over loudness complies with -16 LUFS web broadcast standard.
9. [x] All 8 visual actions correspond to verified, existing codebase features.
10. [x] Branded closing slate contains correct author, award track, and competition metadata.
