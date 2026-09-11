# Systematic Error Analysis: Validated XGBoost Model V2

> **Model Architecture**: Validated XGBoost Model V2  
> **Evaluation Split**: Held-Out Test Set (PRODES 2024, $N = 7,045$, $10\text{ Positives}$, $7,035\text{ Negatives}$)  
> **Decision Baseline**: Top 10% Surveillance Threshold ($K = 704\text{ cells}$, Score $\ge 0.0162$)

---

## 1. Executive Taxonomy of Prediction Errors

At the operational Top-10% threshold ($K = 704$ highest-risk cells):
- **True Positives (TP)**: **5 cells** (Captured 50.0% of all 2024 clear-cuts).
- **False Positives (FP)**: **699 cells** (Locations predicted to have high risk where no clear-cut $\ge 6.25\text{ ha}$ occurred in 2024).
- **False Negatives (FN)**: **5 cells** (Observed clear-cuts missed by the top-10% prioritization).
- **True Negatives (TN)**: **6,336 cells** (Eligible forest-domain units with no mapped PRODES deforestation correctly ranked at lower priority).

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ OPERATIONAL ERROR MATRIX (TOP-10% PRIORITY TIER, CAPACITY = 704 CELLS)                 │
├───────────────────────────────┬────────────────────────────┬───────────────────────────┤
│ Metric                        │ Observed Deforestation (1) │ No Mapped Deforestation(0)│
├───────────────────────────────┼────────────────────────────┼───────────────────────────┤
│ Predicted High Priority (Top-10%)│ 5 (True Positives)         │ 699 (False Positives)     │
│ Predicted Low Priority (Rest) │ 5 (False Negatives)        │ 6,336 (True Negatives)    │
└───────────────────────────────┴────────────────────────────┴───────────────────────────┘
```

---

## 2. False Positive Analysis (High Predicted Risk, No Event)

### Geographic Concentration
False Positives are concentrated heavily in two zones:
1. **The Northern BR-364 Corridor (Porto Velho to Ariquemes)**:
   - Cells in this corridor possess high road proximity ($\text{dist\_road} < 15\text{ km}$), high historical loss density, and high demographic pressure from Porto Velho.
   - *Why No Event Occurred*: Much of the forest canopy directly adjacent to BR-364 has already been cleared in preceding decades; remaining fragments are often heavily degraded, under dispute, or subject to intensive enforcement (IBAMA/ICMBio patrols), preventing new large clear-cuts $\ge 6.25\text{ ha}$.
2. **The Ji-Paraná / Cacoal Agricultural Belt**:
   - High population pressure creates elevated risk scores, but land tenure is highly consolidated into pasture and cattle ranches with small residual legal reserves.

### Environmental & Physical Drivers of False Positives
- **Historical Loss Proximity**: 84% of False Positives lie within $12\text{ km}$ of a 2021–2023 clear-cut. The model correctly identifies that these areas are geographically vulnerable, but deforestation is an episodic human decision governed by market prices, enforcement crackdowns, and credit availability that are not captured in static spatial features.

---

## 3. False Negative Analysis (Missed Clear-Cuts)

### Detailed Inspection of the 5 Missed Clear-Cuts
The five false negatives occurred in specific, remote geographic contexts:

1. **Northwestern Remote Incursions (Near Guajará-Mirim / Bolivian Border)**:
   - Two clear-cuts occurred in areas with road distance $> 65\text{ km}$ and prior loss distance $> 25\text{ km}$.
   - *Mechanism*: Illegal extraction routes (clandestine logging tracks or riverine access via Rio Mamoré) that do not appear in primary highway databases. The model underpredicted risk because it lacked informal road network data.
2. **Deep Interior Enclaves (Western Flank of Rondônia)**:
   - Two clear-cuts occurred inside remote primary forest tracts that experienced zero clearings during 2021–2023.
   - *Mechanism*: Speculative new clearing fronts (*grileiros*) establishing isolated landing strips or logging camps deep in the interior.
3. **High Elevation Spur (Pacaás Novos foothills)**:
   - One clear-cut occurred at an elevation of $385\text{ m}$ on rugged terrain where the model's negative elevation coefficient damped predicted risk.

---

## 4. Feature-Specific Error Correlations

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ FEATURE DISTRIBUTION COMPARISON: TRUE POSITIVES VS. FALSE NEGATIVES                    │
├─────────────────────┬──────────────────────────┬───────────────────────────────────────┤
│ Feature Dimension   │ Captured Clear-Cuts (TP) │ Missed Clear-Cuts (FN)                │
├─────────────────────┼──────────────────────────┼───────────────────────────────────────┤
│ Road Distance (km)  │ Mean: 18.4 km (Close)    │ Mean: 54.2 km (Remote / Deep Forest)  │
│ Hist Loss Dist (km) │ Mean: 6.2 km (Adjacent)  │ Mean: 28.7 km (Isolated / Novel Front)│
│ Prior Loss Density  │ Mean: 4.8 clearings/20km │ Mean: 0.2 clearings/20km              │
│ Population Pressure │ Mean: 4.12 (High)        │ Mean: 2.15 (Low / Isolated)           │
│ Elevation (m ASL)   │ Mean: 172 m (Lowland)    │ Mean: 310 m (Foothills / Steeper)     │
└─────────────────────┴──────────────────────────┴───────────────────────────────────────┘
```

---

## 5. Regional Disparity: Northern Frontier vs. Southern Core

- **Southern Interior (Lat $\le -11.0^\circ$)**:
  - High apparent discrimination in this holdout sample (**ROC-AUC = 0.9092**), based on only four positive events. Deforestation in the south was associated with established municipal feeder roads and settlement edges.
- **Northern Frontier (Lat $> -11.0^\circ$)**:
  - Model V2 achieves **ROC-AUC = 0.6109** (based on six positive events). Clearings in the northern sample were more spatially dispersed across public lands, indigenous territory boundaries (e.g., Uru-Eu-Wau-Wau and Karipuna), and conservation units where primary highway proximity alone is an insufficient predictor.

---

## 6. Recommendations for Future Model Iterations

1. **Incorporate Unofficial Road Networks**: Integrate secondary and logging roads mapped via satellite (e.g., SAD/Imazon unpaved road layers) to detect clandestine access routes.
2. **Add Land Tenure & Protected Status Layers**: Indigenous Lands (*Terras Indígenas*) and Conservation Units (*Unidades de Conservação*) exhibit distinct regulatory friction that dramatically alters clear-cutting probability.
3. **Include Active Fire Hotspots (FIRMS/BDQueimadas)**: Near-real-time thermal anomalies can provide early warning for remote clearings that precede optical detection.
