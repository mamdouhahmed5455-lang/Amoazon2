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
    }
};
