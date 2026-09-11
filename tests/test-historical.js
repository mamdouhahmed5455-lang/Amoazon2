/**
 * Historical Intelligence Unit Tests
 * Run with: node tests/test-historical.js
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');

console.log('\n══════════════════════════════════════════════════════');
console.log('  Historical Intelligence (PRODES) — Unit Tests');
console.log('══════════════════════════════════════════════════════\n');

const hist = require('../scripts/historical-intelligence.js');

// 1. Check metadata and years
assert.strictEqual(hist.YEARS.length, 25, 'Expected 25 years (2001-2025)');
assert.strictEqual(hist.YEARS[0], 2001, 'First year must be 2001');
assert.strictEqual(hist.YEARS[24], 2025, 'Last year must be 2025');
console.log('  ✅ PASS: 25 years verified (2001-2025)');

// 2. Check states
const expectedStates = [
    'Amazônia Legal', 'Acre', 'Amapá', 'Amazonas', 'Maranhão',
    'Mato Grosso', 'Pará', 'Rondônia', 'Roraima', 'Tocantins'
];
assert.strictEqual(hist.STATES.length, 10, 'Expected 10 state entries');
expectedStates.forEach(st => {
    assert(hist.STATES.includes(st), `Missing state ${st}`);
    assert.strictEqual(hist.getSeries(st).length, 25, `Series for ${st} must have 25 entries`);
});
console.log('  ✅ PASS: All 9 states and Amazônia Legal series defined with 25 entries');

// 3. Check official verified values
const legalAmazon = hist.getSeries('Amazônia Legal');
assert.strictEqual(legalAmazon[hist.YEARS.indexOf(2004)], 27772, '2004 peak must be 27,772 km²');
assert.strictEqual(legalAmazon[hist.YEARS.indexOf(2012)], 4571, '2012 low must be 4,571 km²');
assert.strictEqual(legalAmazon[hist.YEARS.indexOf(2021)], 13038, '2021 rebound must be 13,038 km²');
assert.strictEqual(legalAmazon[hist.YEARS.indexOf(2024)], 6518, '2024 consolidated must be 6,518 km²');
assert.strictEqual(legalAmazon[hist.YEARS.indexOf(2025)], 5731, '2025 consolidated must be 5,731 km²');
console.log('  ✅ PASS: Canonical Legal Amazon benchmark values verified');

// 4. Check state-level values for 2024 and 2025
const rondonia = hist.getSeries('Rondônia');
assert.strictEqual(rondonia[hist.YEARS.indexOf(2004)], 3858, 'Rondônia 2004 must be 3,858 km²');
assert.strictEqual(rondonia[hist.YEARS.indexOf(2021)], 1673, 'Rondônia 2021 must be 1,673 km²');
assert.strictEqual(rondonia[hist.YEARS.indexOf(2024)], 360, 'Rondônia 2024 must be 360 km²');
assert.strictEqual(rondonia[hist.YEARS.indexOf(2025)], 229, 'Rondônia 2025 must be 229 km²');

const matoGrosso = hist.getSeries('Mato Grosso');
assert.strictEqual(matoGrosso[hist.YEARS.indexOf(2024)], 1257, 'Mato Grosso 2024 must be 1,257 km²');
assert.strictEqual(matoGrosso[hist.YEARS.indexOf(2025)], 1593, 'Mato Grosso 2025 must be 1,593 km²');

const para = hist.getSeries('Pará');
assert.strictEqual(para[hist.YEARS.indexOf(2024)], 2395, 'Pará 2024 must be 2,395 km²');
assert.strictEqual(para[hist.YEARS.indexOf(2025)], 2064, 'Pará 2025 must be 2,064 km²');
console.log('  ✅ PASS: State specific 2024/2025 values verified');

// 5. Check calculation logic
const amzStats = hist.calculateStats('Amazônia Legal');
assert.strictEqual(amzStats.peakYear, 2004, 'Amz peak year must be 2004');
assert.strictEqual(amzStats.peakValue, 27772, 'Amz peak value must be 27,772');
assert.strictEqual(amzStats.lowYear, 2012, 'Amz low year must be 2012');
assert.strictEqual(amzStats.val2025, 5731, 'Amz 2025 must be 5,731');
assert.strictEqual(amzStats.delta, -787, 'Amz delta must be -787');
assert.strictEqual(amzStats.deltaPct, -12.07, 'Amz deltaPct must be -12.07%');

const roStats = hist.calculateStats('Rondônia');
assert.strictEqual(roStats.peakYear, 2004, 'RO peak year must be 2004');
assert.strictEqual(roStats.peakValue, 3858, 'RO peak value must be 3,858');
assert.strictEqual(roStats.val2025, 229, 'RO 2025 must be 229');
assert.strictEqual(roStats.delta, -131, 'RO delta must be -131');
assert.strictEqual(roStats.deltaPct, -36.39, 'RO deltaPct must be -36.39%');

const mtStats = hist.calculateStats('Mato Grosso');
assert.strictEqual(mtStats.val2024, 1257, 'MT 2024 must be 1,257');
assert.strictEqual(mtStats.val2025, 1593, 'MT 2025 must be 1,593');
assert.strictEqual(mtStats.delta, 336, 'MT delta must be +336');
assert.strictEqual(mtStats.deltaPct, 26.73, 'MT deltaPct must be +26.73%');
console.log('  ✅ PASS: Dynamic calculation logic verified for all test cases');

// 6. Check sum of states equals Legal Amazon for 2024 and 2025
let sum2024 = 0;
let sum2025 = 0;
expectedStates.slice(1).forEach(st => {
    const s = hist.getSeries(st);
    sum2024 += s[hist.YEARS.indexOf(2024)];
    sum2025 += s[hist.YEARS.indexOf(2025)];
});
assert.strictEqual(sum2024, 6518, `Sum of states 2024 (${sum2024}) must match Legal Amazon (6,518)`);
assert.strictEqual(sum2025, 5731, `Sum of states 2025 (${sum2025}) must match Legal Amazon (5,731)`);
console.log('  ✅ PASS: Sum of 9 states equals Legal Amazon total in 2024 (6,518) and 2025 (5,731)');

// 7. Check Phase 3B State Ranking (2025)
const ranking2025 = hist.getStateRanking(2025);
assert.strictEqual(ranking2025.length, 9, 'Ranking must include exactly 9 states');
assert.strictEqual(ranking2025[0].state, 'Pará', 'Rank #1 must be Pará');
assert.strictEqual(ranking2025[0].area, 2064, 'Pará 2025 must be 2,064 km²');
assert.strictEqual(ranking2025[0].sharePct, 36.01, 'Pará share must be 36.01%');
assert.strictEqual(ranking2025[0].trend, 'Recent Decline', 'Pará trend must be Recent Decline');

assert.strictEqual(ranking2025[1].state, 'Mato Grosso', 'Rank #2 must be Mato Grosso');
assert.strictEqual(ranking2025[1].area, 1593, 'Mato Grosso 2025 must be 1,593 km²');
assert.strictEqual(ranking2025[1].trend, 'Recent Increase', 'Mato Grosso trend must be Recent Increase');

const roItem = ranking2025.find(r => r.state === 'Rondônia');
assert.strictEqual(roItem.rank, 6, 'Rondônia must rank #6 in 2025');
assert.strictEqual(roItem.area, 229, 'Rondônia area must be 229 km²');
assert.strictEqual(roItem.sharePct, 4.0, 'Rondônia share must be 4.00%');
assert.strictEqual(roItem.trend, 'Recent Decline', 'Rondônia trend must be Recent Decline');

// Check trend classification across all states: 8 Decline, 1 Increase
const increaseStates = ranking2025.filter(r => r.trend === 'Recent Increase');
const declineStates = ranking2025.filter(r => r.trend === 'Recent Decline');
assert.strictEqual(increaseStates.length, 1, 'Only 1 state must have Recent Increase');
assert.strictEqual(increaseStates[0].state, 'Mato Grosso', 'Sole increase state must be Mato Grosso');
assert.strictEqual(declineStates.length, 8, 'Exactly 8 states must have Recent Decline');
console.log('  ✅ PASS: Phase 3B State ranking and trend classification verified (8 Decline, 1 Increase)');

// 8. Check Top 3 concentration
const top3 = hist.getTopThreeConcentration(2025);
assert.strictEqual(top3.states.join(','), 'Pará,Mato Grosso,Amazonas', 'Top 3 states must be Pará, MT, AM');
assert.strictEqual(top3.totalArea, 4636, 'Top 3 combined area must be 4,636 km²');
assert.strictEqual(top3.sharePct, 80.89, 'Top 3 share must be 80.89%');
console.log('  ✅ PASS: Top 3 concentration verified (80.89% across Pará, MT, AM)');

// 9. Check Rondônia comparative position
const roComp = hist.getRondoniaComparativePosition(2025);
assert.strictEqual(roComp.rondoniaArea, 229, 'Rondônia area must be 229 km²');
assert.strictEqual(roComp.rondoniaRank, 6, 'Rondônia rank must be 6');
assert.strictEqual(roComp.comparisons.length, 4, 'Comparisons must include 4 states');
const paComp = roComp.comparisons.find(c => c.state === 'Pará');
assert.strictEqual(paComp.ratioVsRondonia, 9.0, 'Pará must be 9.0x Rondônia');
const mtComp = roComp.comparisons.find(c => c.state === 'Mato Grosso');
assert.strictEqual(mtComp.ratioVsRondonia, 7.0, 'Mato Grosso must be 7.0x Rondônia');
console.log('  ✅ PASS: Rondônia comparative position and benchmarks verified');

console.log('\n══════════════════════════════════════════════════════');
console.log('  Historical Intelligence Tests: ALL PASSED');
console.log('══════════════════════════════════════════════════════\n');
