# Ground-Truth Label Definition: Annual PRODES Observations

> **Model Architecture**: Validated XGBoost Model V2  
> **Source Platform**: INPE TerraBrasilis PRODES Amazônia (EPSG:4674)  
> **Observation Target**: Anthropic Clear-Cutting of Forest Canopy ($\ge 6.25\text{ ha}$)  
> **Rule of Origin**: Strictly empirical satellite observation; zero model-derived pseudo-labels.

---

## 1. Mathematical Formulation & Semantics

Let $\mathcal{E} = \{u_i\}_{i=1}^{N}$ represent the set of $N = 7,045$ neutral spatial units within the verified **eligible forest domain** of Rondônia.

For monitoring year $T \in \{2022, 2023, 2024\}$, let $\mathcal{P}_{\text{PRODES}}(T)$ represent the official clear-cut polygons mapped by INPE:

$$y_i(T) = \begin{cases} 
1 & \text{if } u_i \in \mathcal{E} \text{ and } \text{Point}(u_i) \cap \mathcal{P}_{\text{PRODES}}(T) \ne \emptyset \quad (\text{Observed Deforestation Event}) \\ 
0 & \text{if } u_i \in \mathcal{E} \text{ and } \text{Point}(u_i) \cap \mathcal{P}_{\text{PRODES}}(T) = \emptyset \quad (\text{Eligible Forest-Domain Unit with No Mapped Deforestation}) 
\end{cases}$$

---

## 2. Absolute Semantic Rules

1. **Negative Class Definition**:
   - A unit is assigned $y = 0$ **only if** it has already been proven to belong to the eligible forest domain AND shows no PRODES clear-cut in year $T$.
   - **"Not in PRODES" alone is NEVER sufficient to call an area forest.** Water bodies, urban sprawl, and natural savannas are excluded a priori by the INPE eligibility mask, not by label assignment.
2. **Independence from Model Outputs**:
   - Zero model outputs, risk scores, normalized probabilities, or scenario simulations are ever consulted when assigning labels.
   - Labels are derived directly and deterministically from INPE's sovereign vector datasets.
3. **Target Isolation**:
   - The PRODES polygons for target year $T$ are used **strictly and exclusively** to generate $y_i(T)$. They are completely hidden from all feature engineering functions for year $T$.

---

## 3. Empirical Ground-Truth Quantities

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ MODEL V2 GROUND-TRUTH EVENT COUNTS                                                     │
├────────────────────┬────────────────────┬──────────────────────┬───────────────────────┤
│ Target Year        │ Total Active Cells │ Confirmed Positives  │ Positive Prevalence   │
├────────────────────┼────────────────────┼──────────────────────┼───────────────────────┤
│ PRODES 2022 (Train)│ 7,045 cells        │ 28 cells             │ 0.3974%               │
│ PRODES 2023 (Val)  │ 7,045 cells        │ 23 cells             │ 0.3265%               │
│ PRODES 2024 (Test) │ 7,045 cells        │ 10 cells             │ 0.1419%               │
└────────────────────┴────────────────────┴──────────────────────┴───────────────────────┘
```

These observed quantities reflect the true physical sparsity of deforestation in intact forest:
- Across all three monitoring years, confirmed positive events occur in less than 0.5% of eligible forest units annually.
- This creates an authentic rare-event class imbalance (~1:250 to 1:700), necessitating specialized evaluation metrics (PR-AUC, Brier score, Precision@K, and Lift) rather than naive accuracy.
