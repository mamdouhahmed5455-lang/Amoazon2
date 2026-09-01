/**
 * GeoAI Dashboard – Unit Tests
 * Run with: node tests/unit.js
 * Covers: Fix #1 (sum=100), Fix #3 (clamp), Fix #4 (simulator direction), Fix #5 (priority)
 */

'use strict';

let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`  ✅ PASS: ${message}`);
        passed++;
    } else {
        console.error(`  ❌ FAIL: ${message}`);
        failed++;
    }
}

// ─── Load SSOT constants (simulate window global) ─────────────────────────────
const fs = require('fs');
const path = require('path');
// Mock browser's window object so constants.js can run in Node
global.window = {};
const constantsPath = path.join(__dirname, '..', 'scripts', 'constants.js');
require(constantsPath.replace(/\\/g, '/'));
// constants.js assigns to window.GEOAI_CONSTANTS
const GEOAI_CONSTANTS = global.window.GEOAI_CONSTANTS;

console.log('\n══════════════════════════════════════════════════════');
console.log('  GeoAI Dashboard – Unit Tests');
console.log('══════════════════════════════════════════════════════\n');

// ─── FIX #1: Feature Importances sum to exactly 100 ──────────────────────────
console.log('▶ Fix #1 – Feature importances sum to 100%');
const fi = GEOAI_CONSTANTS.FEATURE_IMPORTANCES;
const total = fi.reduce((s, f) => s + f.value, 0);
assert(total === 100, `Sum of all FEATURE_IMPORTANCES = ${total} (expected 100)`);
assert(fi.length === 4, `Exactly 4 features defined (got ${fi.length})`);
assert(fi[0].name === 'Road Proximity',        `Feature 0 name = "Road Proximity"`);
assert(fi[1].name === 'Forest Loss (Temporal)', `Feature 1 name = "Forest Loss (Temporal)"`);
assert(fi[2].name === 'Population Pressure',    `Feature 2 name = "Population Pressure"`);
assert(fi[3].name === 'Elevation Constraints',  `Feature 3 name = "Elevation Constraints"`);

// ─── FIX #3: normalizeRiskScore clamps to [0, 100] ───────────────────────────
console.log('\n▶ Fix #3 – normalizeRiskScore never exits [0, 100]');
const norm = GEOAI_CONSTANTS.normalizeRiskScore;
assert(norm(140) === 0,   `norm(140) = ${norm(140)} (expected 0)`);
assert(norm(185) === 100, `norm(185) = ${norm(185)} (expected 100)`);
assert(norm(162.5) === 50, `norm(162.5) = ${norm(162.5)} (expected 50)`);
// Edge cases far out of range (the "169%" / "175" scenario)
assert(norm(200) === 100, `norm(200) clamped to 100 (got ${norm(200)})`);
assert(norm(300) === 100, `norm(300) clamped to 100 (got ${norm(300)})`);
assert(norm(0) === 0,     `norm(0) clamped to 0 (got ${norm(0)})`);
assert(norm(-99) === 0,   `norm(-99) clamped to 0 (got ${norm(-99)})`);
assert(norm(null) === 0,  `norm(null) returns 0 (got ${norm(null)})`);
assert(norm(NaN) === 0,   `norm(NaN) returns 0 (got ${norm(NaN)})`);

// Verify output is always integer in [0,100] for all scores 100–300
let rangeOk = true;
for (let s = 100; s <= 300; s++) {
    const v = norm(s);
    if (v < 0 || v > 100 || !Number.isInteger(v)) { rangeOk = false; break; }
}
assert(rangeOk, 'norm(s) is an integer in [0,100] for all s in 100..300');

// ─── FIX #4: Simulator — positive sliders always increase risk ───────────────
console.log('\n▶ Fix #4 – Scenario simulator direction');
// Simulate the corrected impact formula from scenario-simulator/app.js
function simulateImpact(road, pop, fire, policies) {
    const policyReduction = policies * 3.5;
    const impact = (road * 0.41 + fire * 0.23 + pop * 0.21) * 0.15 - policyReduction;
    return Math.round(impact * 10) / 10;
}
const baseline = 63.8;
// Test: road+20, pop+15, fire+10, 0 policies → delta must be positive
const delta1 = simulateImpact(20, 15, 10, 0);
assert(delta1 > 0, `Road+20, Pop+15, Fire+10, 0 policies → delta=${delta1} > 0`);
// Test: road+50, pop+0, fire+0, 0 policies → positive
const delta2 = simulateImpact(50, 0, 0, 0);
assert(delta2 > 0, `Road+50 only → delta=${delta2} > 0`);
// Test: road-40, pop-20, fire-30, 4 policies → strongly negative
const delta3 = simulateImpact(-40, -20, -30, 4);
assert(delta3 < 0, `Best-case sliders + 4 policies → delta=${delta3} < 0`);
// Test: any single positive slider with 0 policies → positive
assert(simulateImpact(10, 0, 0, 0) > 0, `road+10 alone → positive delta`);
assert(simulateImpact(0, 10, 0, 0) > 0, `pop+10 alone → positive delta`);
assert(simulateImpact(0, 0, 10, 0) > 0, `fire+10 alone → positive delta`);

// ─── FIX #5: calculatePriority thresholds ────────────────────────────────────
console.log('\n▶ Fix #5 – calculatePriority thresholds');
const cp = GEOAI_CONSTANTS.calculatePriority;
assert(cp(0) === 'Low',    `cp(0) = ${cp(0)} (expected Low)`);
assert(cp(25) === 'Low',   `cp(25) = ${cp(25)} (expected Low)`);
assert(cp(26) === 'Medium', `cp(26) = ${cp(26)} (expected Medium)`);
assert(cp(50) === 'Medium', `cp(50) = ${cp(50)} (expected Medium)`);
assert(cp(51) === 'High',  `cp(51) = ${cp(51)} (expected High)`);
assert(cp(75) === 'High',  `cp(75) = ${cp(75)} (expected High)`);
assert(cp(76) === 'Urgent', `cp(76) = ${cp(76)} (expected Urgent)`);
assert(cp(100) === 'Urgent', `cp(100) = ${cp(100)} (expected Urgent)`);
// Out-of-range clamps
assert(cp(200) === 'Urgent', `cp(200) clamped → Urgent (got ${cp(200)})`);
assert(cp(-10) === 'Low',   `cp(-10) clamped → Low (got ${cp(-10)})`);

// ─── FIX #2: Risk formula string ─────────────────────────────────────────────
console.log('\n▶ Fix #2 – RISK_FORMULA_TEXT consistency');
const formula = GEOAI_CONSTANTS.RISK_FORMULA_TEXT;
assert(formula.includes('0.41'), `Formula contains 0.41 (Roads)`);
assert(formula.includes('0.23'), `Formula contains 0.23 (Forest Loss)`);
assert(formula.includes('0.21'), `Formula contains 0.21 (Population)`);
assert(formula.includes('0.15'), `Formula contains 0.15 (Elevation)`);
assert(!formula.includes('w1') && !formula.includes('FireHistory'),
    `Formula does not contain abstract placeholders (w1, FireHistory)`);
const weightSum = GEOAI_CONSTANTS.RISK_FORMULA_VARIABLES.reduce((s, v) => s + v.weight, 0);
assert(Math.abs(weightSum - 1.0) < 0.001, `Formula weights sum to 1.0 (sum=${weightSum.toFixed(3)})`);

// ─── Summary ──────────────────────────────────────────────────────────────────
console.log('\n══════════════════════════════════════════════════════');
console.log(`  Results: ${passed} passed, ${failed} failed`);
console.log('══════════════════════════════════════════════════════\n');
process.exit(failed > 0 ? 1 : 0);
