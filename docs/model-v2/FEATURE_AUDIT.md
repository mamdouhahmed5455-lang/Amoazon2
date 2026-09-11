# Feature Audit & Provenance Ledger: Model V2

> **Model Architecture**: Validated XGBoost Model V2  
> **Guiding Principle**: Authoritative Geodata Provenance, Exact Dimensionality & Zero Future Leakage  
> **Structure**: Exactly FOUR Feature Groups comprising FIVE Quantitative Predictor Variables.

---

## 1. Feature Specifications & Provenance Matrix

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ MODEL V2 FEATURE PROVENANCE MATRIX (4 FEATURE GROUPS / 5 VARIABLES)                                    │
├────────────────────┬────────────────────┬─────────────────────┬────────────────────────┬───────────────┤
│ Variable Name      │ Feature Group      │ Source & Platform   │ Temporal Cutoff Rule   │ Resolution    │
├────────────────────┼────────────────────┼─────────────────────┼────────────────────────┼───────────────┤
│ 1. dist_road_km    │ Group A: Road      │ OpenStreetMap (OSM) │ Static highway network │ Continuous km │
│                    │ Proximity          │ Overpass API Vector │ Established corridors  │ (cKDTree)     │
├────────────────────┼────────────────────┼─────────────────────┼────────────────────────┼───────────────┤
│ 2. dist_hist_loss  │ Group B: Historical│ INPE TerraBrasilis  │ STRICTLY PRIOR YEARS:  │ Continuous km │
│    _km             │ Forest Loss        │ PRODES GeoJSONs     │ Only clearings < Year T│ (cKDTree)     │
├────────────────────┼────────────────────┼─────────────────────┼────────────────────────┼───────────────┤
│ 3. prior_loss_dens │ Group B: Historical│ INPE TerraBrasilis  │ STRICTLY PRIOR YEARS:  │ Count within  │
│                    │ Forest Loss        │ PRODES GeoJSONs     │ Count clearings < T    │ 20 km buffer  │
├────────────────────┼────────────────────┼─────────────────────┼────────────────────────┼───────────────┤
│ 4. pop_pressure    │ Group C: Population│ IBGE 2022 Decennial │ Out-of-time proxy for  │ Gravity-decay │
│                    │ Pressure           │ Census (52 Munic.)  │ 22/23; valid for 2024  │ log(sum pop/d)│
├────────────────────┼────────────────────┼─────────────────────┼────────────────────────┼───────────────┤
│ 5. elevation_m     │ Group D: Physical  │ Copernicus DEM      │ Static geomorphology   │ Continuous    │
│                    │ Terrain Elevation  │ GLO-90 (Open-Meteo) │ Physical meters ASL    │ meters [85–585│
└────────────────────┴────────────────────┴─────────────────────┴────────────────────────┴───────────────┘
```

---

## 2. Detailed Technical Definitions

### Group A: Road Proximity
- **Variable**: `dist_road_km`
- **Source**: OpenStreetMap (OSM) highway network (trunk, primary, and secondary federal corridors including BR-364, BR-421, BR-425, BR-429) extracted via Overpass API.
- **Mathematical Definition**: Euclidean distance in kilometers from cell centroid $(lon_i, lat_i)$ to the nearest coordinate point of the primary highway trunk network in Rondônia (BR-364, BR-421, BR-425, BR-429).
- **Algorithm**: $k$-d tree nearest neighbor query (`scipy.spatial.cKDTree`).
- **Zero-Inheritance Guarantee**: Computed strictly from vector highway geometry; does NOT inherit or calibrate against the web visualization grid.

### Group B: Historical Forest Loss
- **Variables**: `dist_hist_loss_km` and `prior_loss_dens`
- **Source**: INPE TerraBrasilis PRODES official clear-cut polygons ($\ge 6.25\text{ ha}$).
- **Neighborhood Size Specification**: The historical density buffer was pre-declared at $r = 20\text{ km}$ ($\approx 0.18^\circ$), reflecting the typical operational reach of logging camps and secondary access tracks in southwestern Amazonia.
- **Strict Temporal Separation**:
  - Target 2022: Evaluates prior loss exclusively from PRODES 2021.
  - Target 2023: Evaluates prior loss exclusively from PRODES 2021 and 2022.
  - Target 2024: Evaluates prior loss exclusively from PRODES 2021, 2022, and 2023.
  - **Target-year clear-cuts are strictly quarantined from feature extraction.**

### Group C: Population Pressure
- **Variable**: `pop_pressure`
- **Source**: IBGE 2022 Demographic Census municipal population enumerations for all 52 municipalities of Rondônia.
- **Mathematical Formulation**: Gravity-decay potential model with log transformation:
  $$\text{pop\_pressure}_i = \ln\left(1 + \sum_{m=1}^{52} \frac{\text{Population}_m}{(\text{Distance}_{i, m} + 10)^2}\right)$$
  where $\text{Distance}_{i, m}$ is the Euclidean distance in kilometers between cell $i$ and municipality centroid $m$, with a 10 km smoothing parameter to prevent singularity at urban centers.
- **Temporal Status**: Represents the 2022 structural settlement hierarchy. For target year 2024, the IBGE 2022 census data was published on June 28, 2023, strictly before the observation period started (Aug 1, 2023).

### Group D: Physical Elevation
- **Variable**: `elevation_m`
- **Source**: Copernicus DEM GLO-90 (90-meter global elevation raster) accessed via Open-Meteo Elevation API with local SHA-256 verified cache.
- **Unit**: Physical meters above mean sea level ($85\text{ m} \le \text{elevation} \le 585\text{ m}$).
- **Prohibition of Extrusion Formulas**: Strictly replaces the aesthetic formula $\text{elevation} = \text{risk\_norm} \times 4000$ used in the 3D visualization dashboard. Only authentic topographic elevations are utilized.
