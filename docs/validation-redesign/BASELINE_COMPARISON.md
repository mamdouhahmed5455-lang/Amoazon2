# Baseline Model Benchmarking Specification

> **Benchmarking Standard**: Empirical Comparison Against Non-Trivial Statistical Baselines  
> **Evaluation Mode**: Signal Strength & Lift Determination

---

## 1. Why Baseline Benchmarks Are Essential

In environmental predictive modeling, stating that an algorithm achieves a specific AUC is scientifically meaningless without demonstrating that it outperforms naive spatial heuristics (e.g., "areas further north along highway BR-364 have higher clearing rates").

Phase 5D evaluates the model's spatial risk score against three pre-declared baseline predictors:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ BASELINE BENCHMARK DEFINITIONS                                                         │
├────────────────────┬────────────────────┬──────────────────────────────────────────────┤
│ Baseline Model     │ Prediction Signal  │ Expected Value / Hypothesis                  │
├────────────────────┼────────────────────┼──────────────────────────────────────────────┤
│ Baseline 1: Random │ Uniform random U(0,1) Expected ROC-AUC = 0.5000                   │
│ Ranking            │ pseudo-random draw │ Null hypothesis of zero ranking capability   │
├────────────────────┼────────────────────┼──────────────────────────────────────────────┤
│ Baseline 2: Uniform│ Constant C = 0.50  │ Expected ROC-AUC = 0.5000                   │
│ Prediction         │ for all cells      │ No discriminative power between cells        │
├────────────────────┼────────────────────┼──────────────────────────────────────────────┤
│ Baseline 3: Pure   │ Predicted score =  │ Tests whether model is merely learning that  │
│ Latitude Heuristic │ Normalized latitude│ the Northern BR-364 corridor is deforested   │
└────────────────────┴────────────────────┴──────────────────────────────────────────────┘
```

---

## 2. Mathematical Definition of Baseline 3 (Latitude Corridor Heuristic)

Given latitude $\text{lat}_i \in [-13.63, -7.98]$:
$$\text{score}_{\text{latitude}}(i) = \frac{\text{lat}_i - (-13.63)}{(-7.98) - (-13.63)}$$
This assigns higher risk scores to cells in the northern agricultural frontier, providing a rigorous non-trivial spatial baseline that tests whether multi-variable GeoAI adds predictive value beyond simple geographical coordinates.
