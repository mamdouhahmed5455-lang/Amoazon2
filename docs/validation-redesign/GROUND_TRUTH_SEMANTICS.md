# Ground-Truth Semantics: Multi-Class Logic & Eligibility

> **Standard**: Authoritative Ground-Truth Semantic Specification  
> **Source Platform**: INPE TerraBrasilis PRODES Amazônia  
> **Target Jurisdiction**: State of Rondônia, Brazil

---

## 1. Multi-State Land Cover Logic

In official INPE PRODES Earth observation science, a spatial point exists in one of four distinct states during monitoring year $T$:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ PRODES SPATIAL LAND-COVER TAXONOMY                                                     │
├────────────────────┬────────────────────┬──────────────────────┬───────────────────────┤
│ State Designation  │ Physical Reality   │ INPE PRODES Layer    │ Validation Treatment  │
├────────────────────┼────────────────────┼──────────────────────┼───────────────────────┤
│ State 1: Active Loss| Anthropic clear-cut| yearly_deforestation│ POSITIVE CLASS (y = 1)│
│                    │ >= 6.25 ha in yr T | (prodes_ro_2024)     │                       │
├────────────────────┼────────────────────┼──────────────────────┼───────────────────────┤
│ State 2: Intact     │ Primary rainforest | Eligible Forest      │ NEGATIVE CLASS (y = 0)│
│ Forest             │ canopy preserved   │ (Inside RO, not non) │                       │
├────────────────────┼────────────────────┼──────────────────────┼───────────────────────┤
│ State 3: Natural   │ Savanna, rocky     │ no_forest            │ EXCLUDED FROM SAMPLE  │
│ Non-Forest         │ shrubs, water      │ (rondonia_no_forest) │ (Not primary forest)  │
├────────────────────┼────────────────────┼──────────────────────┼───────────────────────┤
│ State 4: Sovereign │ Outside Rondônia   │ states_legal_amazon  │ EXCLUDED FROM SAMPLE  │
│ Exterior           │ territory          │ (Outside border)     │ (Not in pilot study)  │
└────────────────────┴────────────────────┴──────────────────────┴───────────────────────┘
```

---

## 2. Mathematical Definition of Ground Truth

For each candidate coordinate $p = (\text{lon}, \text{lat})$:

1. **Eligibility Check**:
   $$p \in \Omega_{\text{Eligible}} \iff p \in \text{Polygon}(\text{Rondônia}) \land p \notin \bigcup \text{Polygons}(\text{no\_forest})$$
   If $p \notin \Omega_{\text{Eligible}}$, the point is pruned from the validation population.

2. **Binary Event Classification**:
   $$y(p) = \begin{cases} 1 & \text{if } p \in \bigcup \text{Polygons}(\text{PRODES}_{2024}) \quad (\text{Observed Clear-Cut Event}) \\ 0 & \text{if } p \in \Omega_{\text{Eligible}} \land p \notin \bigcup \text{Polygons}(\text{PRODES}_{2024}) \quad (\text{Confirmed Intact Forest}) \end{cases}$$

This formal specification completely eliminates the negative-class ambiguity of Phase 5C, ensuring that every negative sample represents genuine intact rainforest canopy.
