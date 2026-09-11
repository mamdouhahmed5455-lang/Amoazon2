# Forest Eligibility Mask Specification

> **Cartographic Standard**: Sovereign Land Cover Exclusion Layer  
> **Source Platform**: INPE TerraBrasilis PRODES Amazônia  
> **CRS / Datum**: EPSG:4674 (SIRGAS 2000)

---

## 1. Authoritative Exclusion Sources

To prevent counting ancient cattle pastures, urban zones, rock faces, or open rivers as "intact forest," the eligibility mask combines two official INPE products:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ ELIGIBILITY MASK DATA SOURCES                                                          │
├────────────────────┬────────────────────┬──────────────────────┬───────────────────────┤
│ Layer Name         │ Institution        │ Feature Count (RO)   │ Primary Function      │
├────────────────────┼────────────────────┼──────────────────────┼───────────────────────┤
│ rondonia_boundary  │ INPE TerraBrasilis │ 1 Sovereign Polygon  │ Gross territorial     │
│                    │                    │                      │ boundary filter       │
├────────────────────┼────────────────────┼──────────────────────┼───────────────────────┤
│ rondonia_no_forest │ INPE TerraBrasilis │ 3,265 MultiPolygons  │ Savanna & non-forest  │
│                    │                    │                      │ exclusion filter      │
└────────────────────┴────────────────────┴──────────────────────┴───────────────────────┘
```

---

## 2. Mask Construction & Geometric Processing

1. **Topological Healing**: Geometries are parsed via Shapely 2.0 with `shapely.validation.make_valid()` to resolve any self-intersections or unclosed ring slivers.
2. **Spatial Indexing**: An STRtree spatial index is built over the 3,265 `no_forest` polygons.
3. **Point Filtration**: When generating the neutral validation lattice, each candidate point is tested against the `no_forest` STRtree. Any point falling inside natural non-forest is filtered out prior to ground-truth labeling.
