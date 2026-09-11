# Phase 5C Methodological Audit & Scientific Critique

> **Audit Standard**: Post-Experimental Critical Analysis & Methodological Deconstruction  
> **Evaluation Target**: Phase 5C PRODES Validation Design  
> **Historical Finding (Preserved)**: PRODES 2024 ROC-AUC = 0.1151 | Recent 2023–2024 ROC-AUC = 0.2260

---

## 1. Executive Summary of Audit

Phase 5C successfully established the first independent link between the project's spatial grid and official INPE PRODES sovereign Earth observation data. However, as documented in `artifacts/prodes-validation/validation_manifest.json`, the resulting spatial association metrics were low ($AUC = 0.1151$ for 2024 and $0.2260$ for 2023–2024).

In accordance with Phase 5D instructions, **these Phase 5C metrics are strictly preserved as historical empirical findings**. They are not deleted, overwritten, or excused. Instead, this document provides an exhaustive post-mortem identifying the eight structural methodological flaws in Phase 5C that mandated a complete redesign.

---

## 2. The Eight Structural Flaws of Phase 5C

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ PHASE 5C METHODOLOGICAL FLAW DECONSTRUCTION                                           │
├────┬───────────────────────────────┬───────────────────────────────────────────────────┤
│ ID │ Flaw Category                 │ Core Methodological Defect                        │
├────┼───────────────────────────────┼───────────────────────────────────────────────────┤
│ A  │ Sampling Selection Bias       │ Production grid was pre-filtered to high-risk only│
│ B  │ Upper-Tail Range Truncation   │ risk_norm compressed to [0.8989, 1.0]; no baseline│
│ C  │ Negative-Class Ambiguity      │ "No polygon" assumed intact forest without mask   │
│ D  │ Temporal Mismatch             │ Historical model (~2020) vs out-of-time (2024)   │
│ E  │ Geometry Resolution Mismatch  │ 1.25 km point spacing vs 250m polygon perimeters  │
│ F  │ Spatial Autocorrelation Bias  │ Evaluated within localized frontier clusters      │
│ G  │ Base-Rate Compression         │ Extreme class imbalance (prevalence 0.018%)       │
│ H  │ Geographic Conflation         │ Production visualization goals conflated with val │
└────┴───────────────────────────────┴───────────────────────────────────────────────────┘
```

---

## 3. Detailed Forensic Deconstruction

### A. Sampling Selection Bias: Conflating Production with Validation
- **The Defect**: Phase 5C evaluated the model on `data/forest_data_clean.json`.
- **The Reality**: As proven in `data/risk_area_stats.csv`, `forest_data_clean.json` contains 150,000 cells where 100% of cells are labeled **"High Risk"** ($160 \le \text{risk\_score} \le 178$). Stable primary forest areas (which formed the 131,880 True Negatives of the original offline training evaluation) were intentionally pruned to optimize web browser performance.
- **The Scientific Consequence**: Evaluating an ROC-AUC only on samples pre-selected for high risk asks the model to rank items that are all in the top decile, rather than discriminating forest from frontier.

### B. Upper-Tail Range Truncation
- In `forest_data_clean.json`, `risk_norm` spans only $[0.8989, 1.0000]$ (a dynamic range of only $\Delta = 0.1011$).
- With virtually zero variance in predicted probability, the receiver operating characteristic curve becomes hypersensitive to minor spatial permutations, collapsing the area under the curve.

### C. Negative-Class Ambiguity (Absence of Eligibility Mask)
- In Phase 5C, any grid point not intersecting a 2024 PRODES polygon was automatically coded as negative ($y=0$).
- **The Scientific Error**: A point could fail to intersect a 2024 clear-cut polygon because:
  1. It is deep primary forest that remained intact (**True Negative**).
  2. It was already completely deforested in 2012 (**Ineligible Non-Forest**).
  3. It is open savanna, rocky outcrop, or river (**Naturally Ineligible**).
- Without an authoritative **Forest Eligibility Mask**, the negative class was chemically contaminated with ancient pasture and rocky terrain.

### D. Temporal Mismatch
- The model was trained offline on satellite observations from circa 2018–2020.
- Evaluating against PRODES 2024 represents an out-of-time forecast over a 4-year horizon during which federal environmental enforcement intensified, shifting clearing away from historical corridors into unexpected remote pockets.

### E. Point-vs-Polygon Geometry Resolution Mismatch
- The 150,000 cells are spaced ~1.25 km apart.
- An official PRODES polygon can be as small as 6.25 hectares ($250\text{ m} \times 250\text{ m}$).
- Discrete centroid sampling missed small clear-cuts falling between grid nodes, artificially depressing the positive count to only 27 cells in 2024.

---

## 4. Methodological Mandate for Phase 5D

To produce an unassailable scientific evaluation, Phase 5D must establish:
1. **$\text{Production Dataset } \ne \text{ Validation Dataset}$**: A dedicated, full-coverage validation grid spanning both active frontiers and intact forest.
2. **Authoritative Eligibility Mask**: Exclusion of water, urban, and pre-existing non-forest via official INPE masks.
3. **Transparent Baseline Benchmarking**: Comparison against Random, Uniform, and Spatial-Heuristic baselines.
4. **Honest Multi-Dimensional Reporting**: Preserving the Phase 5C metrics while contextualizing the redesigned findings.
