# Spatial Holdout Specification: Geographic Sector Partitioning

> **Protocol Standard**: Spatially Disjoint Validation Partitioning  
> **Geographic Axis**: Latitude Boundary $\phi = -11.0^\circ\text{ S}$  
> **Biome Context**: Rondônia Development Frontier vs. Conservation Core

---

## 1. Geographic Partition Design

To evaluate whether prediction alignment varies across geographically distinct sub-regions, the 150,000 cells were partitioned along latitude $\phi = -11.0^\circ\text{ S}$:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ SPATIAL HOLDOUT PARTITION OVERVIEW                                                     │
├───────────────────────────────┬────────────────────────┬───────────────────────────────┤
│ Sector Dimension              │ Northern Sector        │ Southern Sector               │
├───────────────────────────────┼────────────────────────┼───────────────────────────────┤
│ Boundary Condition            │ Latitude > -11.0° S    │ Latitude <= -11.0° S          │
│ Total Grid Cells              │ 82,968 cells (55.3%)   │ 67,032 cells (44.7%)          │
│ Dominant Landscape            │ BR-364 Highway Axis    │ Guaporé River Basin           │
│ Primary Frontier Dynamic      │ Commercial Agriculture │ Protected Forest Enclaves     │
│ PRODES 2024 Clear-Cut Cells   │ 17 cells (0.020%)      │ 10 cells (0.015%)             │
│ Recent (23–24) Clear-Cut Cells│ 79 cells (0.095%)      │ 22 cells (0.033%)             │
└───────────────────────────────┴────────────────────────┴───────────────────────────────┘
```

---

## 2. Geographic Rationale for Boundary Selection

The choice of latitude $\phi = -11.0^\circ\text{ S}$ reflects real physical and legal geography:
1. **The Northern Sector ($\phi > -11.0^\circ$)**:  
   Encompasses the federal highway BR-364 trunk corridor running between Porto Velho, Ariquemes, and Jaru. This is the oldest, most fragmented fishbone clearing zone in Rondônia, characterized by dense secondary road networks and established cattle ranching.
2. **The Southern Sector ($\phi \le -11.0^\circ$)**:  
   Extends toward the Bolivian border and the Guaporé River. This sector features extensive federal indigenous lands (e.g., Uru-Eu-Wau-Wau) and state conservation parks where large contiguous primary forest canopy persists.

---

## 3. Spatial Holdout Performance Findings

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ SPATIAL HOLDOUT PERFORMANCE COMPARISON                                                 │
├───────────────────────────────┬────────────────────────┬───────────────────────────────┤
│ Observation Period            │ Northern Sector ROC-AUC│ Southern Sector ROC-AUC       │
├───────────────────────────────┼────────────────────────┼───────────────────────────────┤
│ PRODES 2024                   │ 0.1181                 │ 0.0988                        │
│ Recent Combined (2023–2024)   │ 0.2320                 │ 0.1727                        │
└───────────────────────────────┴────────────────────────┴───────────────────────────────┘
```

- **Higher Correlation Along the Active Northern Frontier**: Prediction alignment against recent clearing was noticeably higher in the Northern Development Sector (0.2320 AUC) than in the Southern Sector (0.1727 AUC), where clearing events were exceedingly sparse (only 22 out of 67,032 cells).
