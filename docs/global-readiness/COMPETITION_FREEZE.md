# Phase 6I: Competition Asset Freeze Specification

> **Governance Directive**: Absolute Codebase & Model Science Freeze  
> **Effective Date**: 2026-09-11  
> **Target**: Final Competition Submission Lock

---

## 1. Sealed & Frozen Assets Ledger

The following components are formally declared **SEALED AND FROZEN**. Zero modifications, retunings, or overwrites are permitted:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ COMPETITION SUBMISSION FROZEN ASSETS                                                                           │
├──────────────────────────┬─────────────────────────────┬───────────────────────────────────────────────────────┤
│ Asset Category           │ Frozen Files & Locations    │ Frozen Values / Mandate                               │
├──────────────────────────┼─────────────────────────────┼───────────────────────────────────────────────────────┤
│ 1. Original Benchmark    │ `docs/Graduation_Report.md` │ ROC-AUC = 0.82 | Precision = 0.79 | Recall = 0.84      │
│    Metrics               │ `scripts/constants.js`      │ F1 = 0.81 | SHAP: 41% Road, 23% Loss, 21% Pop, 15% El│
│                          │                             │ MANDATE: Must never be modified or overwritten.       │
├──────────────────────────┼─────────────────────────────┼───────────────────────────────────────────────────────┤
│ 2. Production Web Grid   │ `data/forest_data_clean.js` │ Exactly 150,000 spatial cells with coordinates,       │
│                          │                             │ `risk_score` (160–178), `risk_norm` (0.8989–1.0).    │
│                          │                             │ MANDATE: Must remain intact for web UI rendering.     │
├──────────────────────────┼─────────────────────────────┼───────────────────────────────────────────────────────┤
│ 3. Model V2 Research     │ `artifacts/model-v2/`       │ Out-of-Time Held-Out ROC-AUC = 0.7474 (PRODES 2024).  │
│    Model & Results       │ `model_v2.json`             │ PR-AUC = 0.005534 | Brier = 0.00693 | 5.0x Top-10% Lft│
│                          │ `model_manifest.json`       │ MANDATE: Model weights and evaluation frozen.         │
├──────────────────────────┼─────────────────────────────┼───────────────────────────────────────────────────────┤
│ 4. Historical Satellite  │ `data/prodes_historical.js` │ Official annual PRODES deforested km² (2000–2024).    │
│    Intelligence Data     │                             │ MANDATE: Data points frozen against INPE records.     │
├──────────────────────────┼─────────────────────────────┼───────────────────────────────────────────────────────┤
│ 5. Scenario Simulator    │ `pages/scenario-simulator`  │ Parametric sensitivity levers: Road expansion,        │
│    Policy Sensitivity    │ `scripts/constants.js`      │ population pressure, fire frequency, reserve toggles. │
│                          │                             │ MANDATE: Policy sensitivity logic locked.             │
├──────────────────────────┼─────────────────────────────┼───────────────────────────────────────────────────────┤
│ 6. User Interface        │ `index.html`, `app.js`,     │ All deck.gl layers, Mapbox styling, filter bars,      │
│    Applications          │ `styles.css`, 5 subpages    │ camera fly-to buttons, and mobile responsiveness.     │
│                          │                             │ MANDATE: Production UI frozen with 0 console errors.  │
├──────────────────────────┼─────────────────────────────┼───────────────────────────────────────────────────────┤
│ 7. Automated Test Suite  │ `tests/run_all_tests.py`    │ All 52 Python unit tests across 4 test suites and     │
│                          │ `tests/unit.js`             │ Node.js unit tests.                                   │
│                          │                             │ MANDATE: 100% pass rate must be preserved.            │
└──────────────────────────┴─────────────────────────────┴───────────────────────────────────────────────────────┘
```

---

## 2. Post-Freeze Modification Policy

1. **Bug Fixes Only**: Only genuine, critical breaking bugs identified by evaluation judges may be touched.
2. **Zero Feature Bloat**: No new feature, page, animation, or third-party dependency may be introduced.
3. **Audit Trail**: Any emergency patch must be recorded with a documented post-freeze justification in this ledger.
