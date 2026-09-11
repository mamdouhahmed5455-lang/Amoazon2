# Ground-Truth Label Definition & Spatial Association Semantics

> **Protocol Standard**: Independent Ground-Truth Formulation  
> **Authoritative Source**: INPE / TerraBrasilis PRODES Amazônia  
> **Evaluation Mode**: Point-in-Polygon Centroid Intersection

---

## 1. Mathematical Ground-Truth Definition

Let $\mathcal{G} = \{(\text{lat}_i, \text{lon}_i)\}_{i=1}^{150000}$ represent the set of 150,000 coordinate centroids in the Rondônia spatial grid.

Let $\mathcal{P}_{\text{PRODES}}(T)$ represent the union of authoritative PRODES deforestation polygons mapped by INPE for observation period $T$:
$$\mathcal{P}_{\text{PRODES}}(T) = \bigcup_{k=1}^{M} \text{polygon}_k \quad \text{where } \text{state} = \text{'RO'} \text{ and } \text{year} \in T$$

The ground-truth binary label $y_i \in \{0, 1\}$ for each cell $i$ is deterministically defined as:

$$y_i = \begin{cases} 1 & \text{if } (\text{lon}_i, \text{lat}_i) \in \mathcal{P}_{\text{PRODES}}(T) \quad (\text{Deforestation Confirmed by INPE}) \\ 0 & \text{if } (\text{lon}_i, \text{lat}_i) \notin \mathcal{P}_{\text{PRODES}}(T) \quad (\text{Intact Forest / No Mapped Clear-Cut}) \end{cases}$$

---

## 2. Temporal Semantics & Alignment Strategy

Because the runtime dataset (`data/forest_data_clean.json`) contains static spatial risk predictions without per-cell calendar event timestamps, we define two explicit, scientifically separated validation experiments:

### Experiment 1: 2024 PRODES Benchmark Alignment (Primary)
- **Temporal Window**: PRODES 2024 monitoring cycle (August 1, 2023 to July 31, 2024).
- **Source File**: `data/external/prodes/prodes_ro_2024.geojson` (2,773 polygons).
- **Scientific Meaning**: Evaluates whether high precomputed risk scores predicted the actual clear-cutting events detected in the most recent completed PRODES census year.

### Experiment 2: Cumulative Recent Frontier (2023–2024 Joint Period)
- **Temporal Window**: Combined 2023 + 2024 PRODES clearing periods (7,828 total polygons).
- **Source Files**: `prodes_ro_2024.geojson` + `prodes_ro_2023.geojson`.
- **Scientific Meaning**: Evaluates spatial risk correlation against recent active multi-year deforestation expansion along the Rondônia frontier.

---

## 3. Boundary & Edge Case Protocols

1. **Polygon Boundary Intersections**: If a coordinate centroid lies precisely on the exterior boundary of a polygon, it is classified as $y=1$ using standard topological closure ($\text{Point.intersects(Polygon)}$).
2. **Overlapping Polygons**: PRODES polygons are officially mutually exclusive by year (canopy cannot be clear-cut twice). Any multi-year spatial union dissolves overlapping geometries.
3. **Minimum Mapping Unit**: Points falling within clearings $<6.25\text{ ha}$ are not mapped by PRODES; this is an inherent resolution threshold of the national census, not an error.
