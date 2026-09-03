// =============================================================
// GeoAI Risk Dashboard — Single Source of Truth (SSOT)
// Source: Graduation_Project_Report.md §4 "Risk Prediction Model & Explainable AI"
// DO NOT duplicate or override these values in any component.
// =============================================================

window.GEOAI_CONSTANTS = {

    // ── 1) FEATURE IMPORTANCE (SHAP) ─────────────────────────
    // Canonical values: Road 41, Forest Loss 23, Population 21, Elevation 15 → sum = 100
    // Applied with largest-remainder rounding (values are already exact integers that sum to 100).
    FEATURE_IMPORTANCES: [
        { name: 'Road Proximity',        value: 41, color: '#ef4444' },
        { name: 'Forest Loss (Temporal)', value: 23, color: '#f97316' },
        { name: 'Population Pressure',   value: 21, color: '#eab308' },
        { name: 'Elevation Constraints', value: 15, color: '#3b82f6' }
    ],

    // ── 2) RISK INDEX FORMULA ─────────────────────────────────
    // Exact formula from Graduation_Project_Report.md §4
    // Used verbatim in Methodology modal and Report text — do NOT hand-copy.
    RISK_FORMULA_TEXT:
        'Risk = 0.41(Roads) + 0.23(Forest Loss) + 0.21(Population) + 0.15(Elevation)',

    RISK_FORMULA_VARIABLES: [
        { name: 'Roads',         weight: 0.41 },
        { name: 'Forest Loss',   weight: 0.23 },
        { name: 'Population',    weight: 0.21 },
        { name: 'Elevation',     weight: 0.15 }
    ],

    // ── 3) RISK SCORE NORMALISATION ──────────────────────────
    // Raw risk_score range in the dataset: ~140–185.
    // Maps to 0–100 % probability scale. Clamps strictly; never returns <0 or >100.
    normalizeRiskScore: function (rawScore) {
        if (rawScore == null || isNaN(rawScore)) return 0;
        // Linear map: 140 → 0 %, 185 → 100 %
        var pct = ((rawScore - 140) / (185 - 140)) * 100;
        return Math.max(0, Math.min(100, Math.round(pct)));
    },

    // ── 5) PRIORITY MAPPING ───────────────────────────────────
    // Input: probability percent [0–100].
    // Thresholds match model-documented risk classes (Report §5).
    calculatePriority: function (probabilityPercent) {
        var p = Math.max(0, Math.min(100, Math.round(probabilityPercent)));
        if (p > 75) return 'Urgent';
        if (p > 50) return 'High';
        if (p > 25) return 'Medium';
        return 'Low';
    },

    // ── 6) MODEL METRICS ──────────────────────────────────────
    MODEL_METRICS: {
        recall: 0.84,
        f1: 0.81
    },

    // ── 7) ZONE AREAS ─────────────────────────────────────────
    ZONE_AREAS: {
        'Rondonia Northern Frontier': 4500,
        'Rondonia Northern Core': 4200,
        'Rondonia Northern Eastern': 3800,
        'Rondonia Central Frontier': 4100,
        'Rondonia Central Core': 3900,
        'Rondonia Central Eastern': 3600,
        'Rondonia Southern Frontier': 4800,
        'Rondonia Southern Core': 4300,
        'Rondonia Southern Eastern': 4000,
        'Primary hotspot': 4500
    },

    // ── 8) PROJECT INFO ───────────────────────────────────────
    PROJECT_NAME: "AI-Based Deforestation Risk Prediction Model - Amazon Basin",
    
    // ── 9) SPATIAL ANALYSIS INFO ──────────────────────────────
    TOTAL_RISK_CELLS: 150000,
    TOTAL_HOTSPOTS: 847
};

// SSOT UI INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    if (!window.GEOAI_CONSTANTS) return;
    
    // 1. Model Metrics
    document.querySelectorAll('[data-ssot="recall"]').forEach(el => el.innerText = GEOAI_CONSTANTS.MODEL_METRICS.recall);
    document.querySelectorAll('[data-ssot="f1"]').forEach(el => el.innerText = GEOAI_CONSTANTS.MODEL_METRICS.f1);

    // 2. Project Name
    document.querySelectorAll('[data-ssot="project-name"]').forEach(el => {
        if (el.tagName === 'TITLE') {
            el.innerText = GEOAI_CONSTANTS.PROJECT_NAME;
        } else {
            el.textContent = GEOAI_CONSTANTS.PROJECT_NAME;
        }
    });

    // 3. Spatial Analysis (847 hotspots vs 150k cells tooltip explanation)
    document.querySelectorAll('[data-ssot="total-hotspots"]').forEach(el => {
        el.innerText = GEOAI_CONSTANTS.TOTAL_HOTSPOTS;
        el.title = `Total hotspots (clusters) vs ${GEOAI_CONSTANTS.TOTAL_RISK_CELLS.toLocaleString()} raw risk cells analyzed globally`;
    });
    
    document.querySelectorAll('[data-ssot="total-cells"]').forEach(el => {
        el.innerText = GEOAI_CONSTANTS.TOTAL_RISK_CELLS.toLocaleString();
    });
});
