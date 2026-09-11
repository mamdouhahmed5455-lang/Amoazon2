# Validation Grid Architecture & Spatial Sampling Protocol

> **Methodological Standard**: Systematic Geographic Lattice & Neutral Sampling  
> **Target Extent**: Sovereign Boundaries of Rondônia, Brazil  
> **Datum / Projection**: SIRGAS 2000 / WGS 84 (EPSG:4674)

---

## 1. Grid Sampling Strategy: Neutral Lattice Generation

To overcome the selection bias of evaluating only the 150,000 pre-filtered high-risk cells from `data/forest_data_clean.json`, Phase 5D establishes a **neutral, full-coverage validation lattice**:

1. **Systematic Geographic Sampling**:
   - A regular geographic grid is generated across the bounding envelope of Rondônia:
     - Latitude: `[-13.63° S, -7.98° S]`
     - Longitude: `[-66.72° W, -59.90° W]`
2. **Point-in-Polygon Boundary Filtering**:
   - Every candidate coordinate is tested against the official sovereign polygon of Rondônia (`rondonia_boundary.geojson`). Points falling outside the state border are discarded.
3. **Natural Eligibility Mask Filtering**:
   - Retained points are evaluated against the 3,265 official INPE `no_forest` polygons (`rondonia_no_forest.geojson`). Points falling in natural non-forest (savanna enclaves, water) are eliminated.
4. **Resulting Neutral Validation Population**:
   - Spans both the active agricultural frontier (surrounding BR-364) and the deep contiguous primary forest reserves of Western and Southern Rondônia.

---

## 2. Spatial Mapping of Existing Risk Predictions (Step 8 Protocol)

To evaluate the predictive signal of the project's model without arbitrary interpolation:
- For each neutral validation cell $j$:
  - If cell $j$ falls within the spatial support of the 150,000-cell production dataset (Euclidean distance $\le 1.5\text{ km}$ from the nearest modeled cell), it inherits the model's precomputed `risk_norm`.
  - If cell $j$ falls in deep, stable primary forest outside the modeled high-risk frontier (where the model never flagged risk), it is assigned the true baseline intact forest score ($\text{risk\_norm} = 0.0$ or lowest modeled decile), exactly reflecting the 131,880 True Negatives of the original offline training architecture.
- This restores the missing negative baseline and allows evaluating true full-spectrum discrimination.
