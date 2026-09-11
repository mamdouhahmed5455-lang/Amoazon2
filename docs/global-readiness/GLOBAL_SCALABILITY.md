# Phase 6F: Global Scalability & Geographic Expansion Roadmap

> **Evaluation Principle**: Honest Geographic Boundaries  
> **Declaration**: The project currently proves empirical efficacy **exclusively within the State of Rondônia**. Scaling across broader biomes requires region-specific retraining and covariate adaptation.

---

## 1. Geographic Scaling Tier Matrix

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ GEOGRAPHIC EXPANSION ROADMAP: TIER 1 TO TIER 4                                                                 │
├─────────────────────┬────────────────────┬─────────────────────────────┬───────────────────────────────────────┤
│ Scaling Tier        │ Geographic Scope   │ Feature & Data Adaptations  │ Governance & Validation Requirements  │
├─────────────────────┼────────────────────┼─────────────────────────────┼───────────────────────────────────────┤
│ Tier 1 (Current)    │ Rondônia, Brazil   │ OSM highway network, PRODES,│ Completed Model V2 out-of-time        │
│                     │ (~237,000 km²)     │ IBGE 2022, Copernicus DEM   │ evaluation (ROC-AUC 0.7474).          │
├─────────────────────┼────────────────────┼─────────────────────────────┼───────────────────────────────────────┤
│ Tier 2 (Regional)   │ Amazônia Legal     │ Add state highways (DER-PA, │ Stratified regional retraining (Pará, │
│                     │ (9 Brazilian states│ MT); integrate MapBiomas    │ Mato Grosso, Amazonas have distinct   │
│                     │ ~5,000,000 km²)    │ pasture/cropland masks      │ frontier dynamics and tenure regimes).│
├─────────────────────┼────────────────────┼─────────────────────────────┼───────────────────────────────────────┤
│ Tier 3 (National)   │ All Brazilian      │ Replace PRODES Amazon with  │ Multi-biome calibration: Cerrado has  │
│                     │ Biomes (Cerrado,   │ PRODES Cerrado / Mata       │ legal clearings under Forest Code     │
│                     │ Atlantic Forest)   │ Atlântica; add CAR registry │ (up to 80% legal clearing allowed).   │
├─────────────────────┼────────────────────┼─────────────────────────────┼───────────────────────────────────────┤
│ Tier 4 (Global)     │ Global Tropical    │ Replace INPE with Hansen GFW│ Cross-national harmonization: replace │
│                     │ Forests (Congo,    │ / JAXA ALOS-2 radar; Open-  │ IBGE with WorldPop; adapt to varied   │
│                     │ Indonesia, Peru)   │ StreetMap for global roads  │ tenure and concession frameworks.     │
└─────────────────────┴────────────────────┴─────────────────────────────┴───────────────────────────────────────┘
```

---

## 2. Technical Requirements for Pan-Amazonian Scaling (Tier 2)

Moving from Rondônia to the entire Legal Amazon (Amazônia Legal) entails:
1. **Covariate Shift Handling**:
   - In Mato Grosso, deforestation is predominantly large-scale industrial agribusiness clear-cutting (> 500 ha).
   - In Amazonas, deforestation is concentrated along riverways and speculative highway corridors (BR-319).
   - *Requirement*: Regionally stratified XGBoost models or spatially conditioned hierarchical models rather than a single monolithic model.
2. **Computational Scaling**:
   - Expanding from 7,045 units in Rondônia to the ~5 million km² Legal Amazon at 5 km resolution increases grid size to ~200,000 active cells.
   - *Requirement*: Transition feature engineering from local Python scripts to distributed GeoPandas / PySpark geospatial pipelines (Apache Sedona or Google Earth Engine).
3. **Tenure & Registry Integration**:
   - Rural Environmental Cadastre (CAR) polygons must be incorporated to distinguish between illegal invasions into public lands vs. authorized agricultural clearings on private holdings.
