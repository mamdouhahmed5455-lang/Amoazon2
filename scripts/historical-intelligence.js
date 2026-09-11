/**
 * Historical Intelligence Module — PRODES Official Time Series (2001–2025)
 * Authority: INPE / TerraBrasilis — Sistema PRODES
 * Consolidated clear-cut deforestation census (>= 6.25 ha)
 * Covers: Amazônia Legal Total and all 9 federated states.
 */

(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.PRODES_HISTORICAL_DATA = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    const YEARS = [
        2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010,
        2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020,
        2021, 2022, 2023, 2024, 2025
    ];

    const SERIES = {
        'Amazônia Legal': [
            18165, 21650, 25396, 27772, 19014, 14286, 11651, 12911, 7464, 7000,
            6418, 4571, 5891, 5012, 6207, 7893, 6947, 7536, 10129, 10851,
            13038, 11594, 9064, 6518, 5731
        ],
        'Acre': [
            419, 883, 1078, 728, 592, 398, 184, 254, 167, 259,
            280, 305, 221, 309, 264, 372, 257, 444, 682, 706,
            889, 840, 601, 449, 324
        ],
        'Amapá': [
            7, 0, 25, 46, 33, 30, 39, 100, 70, 53,
            66, 27, 23, 31, 25, 17, 24, 24, 32, 24,
            17, 14, 17, 27, 17
        ],
        'Amazonas': [
            634, 885, 1558, 1232, 775, 788, 610, 604, 405, 595,
            502, 523, 583, 500, 712, 1129, 1001, 1045, 1434, 1512,
            2306, 2594, 1610, 1223, 979
        ],
        'Maranhão': [
            958, 1085, 993, 755, 922, 674, 631, 1271, 828, 712,
            396, 269, 403, 257, 209, 258, 265, 253, 237, 336,
            350, 271, 306, 307, 210
        ],
        'Mato Grosso': [
            7703, 7892, 10405, 11814, 7145, 4333, 2678, 3258, 1049, 871,
            1120, 757, 1139, 1075, 1601, 1489, 1561, 1490, 1702, 1779,
            2213, 1927, 2048, 1257, 1593
        ],
        'Pará': [
            5237, 7510, 7145, 8870, 5899, 5659, 5526, 5607, 4281, 3770,
            3008, 1741, 2346, 1887, 2153, 2992, 2433, 2744, 4172, 4899,
            5238, 4162, 3299, 2395, 2064
        ],
        'Rondônia': [
            2673, 3099, 3597, 3858, 3244, 2049, 1611, 1136, 482, 435,
            865, 773, 932, 684, 1030, 1376, 1243, 1316, 1257, 1273,
            1673, 1480, 867, 360, 229
        ],
        'Roraima': [
            345, 84, 439, 311, 133, 231, 309, 574, 121, 256,
            141, 124, 170, 219, 156, 202, 132, 195, 590, 297,
            315, 279, 284, 468, 285
        ],
        'Tocantins': [
            189, 212, 156, 158, 271, 124, 63, 107, 61, 49,
            40, 52, 74, 50, 57, 58, 31, 25, 23, 25,
            37, 27, 32, 32, 30
        ]
    };

    const STATES = Object.keys(SERIES);

    function getSeries(state) {
        return SERIES[state] || SERIES['Amazônia Legal'];
    }

    function calculateStats(state) {
        const data = getSeries(state);
        let maxVal = -Infinity;
        let maxYear = YEARS[0];
        let minVal = Infinity;
        let minYear = YEARS[0];

        data.forEach((val, idx) => {
            if (val > maxVal) {
                maxVal = val;
                maxYear = YEARS[idx];
            }
            if (val < minVal) {
                minVal = val;
                minYear = YEARS[idx];
            }
        });

        const val2024 = data[YEARS.indexOf(2024)];
        const val2025 = data[YEARS.indexOf(2025)];
        const delta = val2025 - val2024;
        const deltaPct = val2024 === 0 ? 0 : (delta / val2024) * 100;
        const pctBelowPeak = ((maxVal - val2025) / maxVal) * 100;

        let directionText = '';
        if (delta < 0) {
            directionText = `${pctBelowPeak.toFixed(1)}% below ${maxYear} peak; declining recently (${deltaPct.toFixed(1)}% in 2025)`;
        } else if (delta > 0) {
            directionText = `${pctBelowPeak.toFixed(1)}% below ${maxYear} peak; rising recently (+${deltaPct.toFixed(1)}% in 2025)`;
        } else {
            directionText = `${pctBelowPeak.toFixed(1)}% below ${maxYear} peak; stable YoY in 2025`;
        }

        return {
            state: state,
            peakYear: maxYear,
            peakValue: maxVal,
            lowYear: minYear,
            lowValue: minVal,
            val2024: val2024,
            val2025: val2025,
            delta: delta,
            deltaPct: Number(deltaPct.toFixed(2)),
            pctBelowPeak: Number(pctBelowPeak.toFixed(1)),
            longTermDirection: directionText
        };
    }

    const KEY_MOMENTS = [
        {
            year: 2004,
            title: '2004 — Historical Peak',
            value: '27,772 km²',
            desc: 'Peak annual loss across the Legal Amazon prior to coordinated federal enforcement under the PPCDAm program.'
        },
        {
            year: 2012,
            title: '2012 — Long-Term Low',
            value: '4,571 km²',
            desc: 'Historic low achieved through intensive satellite alert deterrence and credit restrictions in high-deforestation municipalities.'
        },
        {
            year: 2021,
            title: '2021 — Major Rebound',
            value: '13,038 km²',
            desc: 'Renewed pressure along active agricultural frontiers and AMACRO border expansion zones.'
        },
        {
            year: 2025,
            title: '2025 — Lowest Level Since 2014',
            value: '5,731 km²',
            desc: 'Consolidated reduction to 5,731 km² (-12.07% vs 2024), reaching the lowest annual level in over a decade.'
        }
    ];

    const RONDONIA_FACTS = {
        title: 'Why Rondônia?',
        badge: 'Prototype Study Area',
        series: {
            val2004: 3858,
            val2021: 1673,
            val2024: 360,
            val2025: 229,
            deltaPct: -36.39
        },
        leadStatement: 'Rondônia is the current prototype study area.',
        contextExplanation: 'The pilot focuses on a highly fragmented, road-influenced landscape, providing a useful setting for testing spatial risk prioritization.',
        scientificEvidence: 'Bisected by the BR-364 corridor with classic geometric fishbone settlement grids, Rondônia features dense road access and sharp protected enclave perimeters, making it an ideal empirical testbed for road-proximity modeling.'
    };

    const LATEST_PRODES_CHANGES = [
        {
            region: 'Legal Amazon Total',
            val2024: 6518,
            val2025: 5731,
            changePct: -12.07,
            direction: 'down',
            note: 'Consolidated annual reduction'
        },
        {
            region: 'Rondônia (Pilot)',
            val2024: 360,
            val2025: 229,
            changePct: -36.39,
            direction: 'down',
            note: 'Accelerated decline along monitored frontier'
        },
        {
            region: 'Mato Grosso',
            val2024: 1257,
            val2025: 1593,
            changePct: 26.73,
            direction: 'up',
            note: 'Sole state recording an increase in 2025'
        }
    ];

    const SCIENTIFIC_HONESTY_NOTE = {
        title: 'Measurement Methodology & Monitoring Separation',
        prodesDefinition: 'PRODES measures annual consolidated deforestation via wall-to-wall cloud-free satellite composites (>= 6.25 ha). It should not be interpreted as a real-time alert stream.',
        deterDistinction: 'DETER provides daily/weekly rapid operational alerts (>= 3.0 ha) for tactical law enforcement (IBAMA), subject to persistent seasonal cloud cover. PRODES and DETER figures cannot be mathematically combined.'
    };

    // ─── Browser UI & Chart Controller ─────────────────────────────────────────
    let chartInstance = null;

    function renderHistoricalStats(stateName, compareRondonia) {
        if (typeof document === 'undefined') return;
        const stats = calculateStats(stateName);
        const isRondonia = stateName === 'Rondônia';

        // Update titles and badges
        const chartTitle = document.getElementById('hiChartTitle');
        if (chartTitle) {
            chartTitle.textContent = `${stateName}: Annual Deforestation Trajectory`;
        }
        const activePill = document.getElementById('hiActivePillText');
        if (activePill) {
            activePill.textContent = `Viewing: ${stateName}`;
        }
        const legendPrimary = document.getElementById('hiLegendPrimary');
        if (legendPrimary) {
            legendPrimary.textContent = stateName;
        }
        const legendRondonia = document.getElementById('hiLegendRondonia');
        if (legendRondonia) {
            legendRondonia.style.display = (compareRondonia && !isRondonia) ? 'flex' : 'none';
        }

        // Summary Intelligence Cards
        const summaryTitle = document.getElementById('hiSummaryTitle');
        if (summaryTitle) {
            summaryTitle.textContent = `${stateName} Intelligence`;
        }
        const peakVal = document.getElementById('hiPeakYearVal');
        if (peakVal) {
            peakVal.textContent = `${stats.peakYear} (${stats.peakValue.toLocaleString()} km²)`;
        }
        const lowVal = document.getElementById('hiLowYearVal');
        if (lowVal) {
            lowVal.textContent = `${stats.lowYear} (${stats.lowValue.toLocaleString()} km²)`;
        }
        const v2025 = document.getElementById('hi2025Val');
        if (v2025) {
            v2025.textContent = `${stats.val2025.toLocaleString()} km²`;
        }
        const deltaVal = document.getElementById('hiDeltaVal');
        if (deltaVal) {
            const sign = stats.delta >= 0 ? '+' : '';
            const colorClass = stats.delta < 0 ? 'text-emerald' : (stats.delta > 0 ? 'text-rose' : '');
            deltaVal.className = `hi-stat-val ${colorClass}`;
            deltaVal.textContent = `${sign}${stats.delta.toLocaleString()} km² (${sign}${stats.deltaPct.toFixed(2)}%)`;
        }
        const directionText = document.getElementById('hiDirectionText');
        if (directionText) {
            directionText.textContent = stats.longTermDirection;
        }
    }

    function initOrUpdateHistoricalChart(canvasId, stateName, compareRondonia) {
        if (typeof document === 'undefined') return null;
        if (typeof Chart === 'undefined') {
            console.warn('[HistoricalIntelligence] Chart.js not yet loaded');
            return null;
        }

        const id = canvasId || 'hiChartCanvas';
        const canvas = document.getElementById(id);
        if (!canvas) return null;

        const stateSelect = document.getElementById('hiStateSelect');
        const state = stateName || (stateSelect ? stateSelect.value : 'Amazônia Legal');
        const compareToggle = document.getElementById('hiCompareRondonia');
        const doCompare = compareRondonia !== undefined ? compareRondonia : (compareToggle ? compareToggle.checked : false);

        const primaryData = getSeries(state);
        const rondoniaData = getSeries('Rondônia');
        const isRondonia = state === 'Rondônia';

        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 240);
        gradient.addColorStop(0, 'rgba(56, 189, 248, 0.32)');
        gradient.addColorStop(1, 'rgba(56, 189, 248, 0.01)');

        const datasets = [
            {
                label: state,
                data: primaryData,
                borderColor: '#38bdf8',
                backgroundColor: gradient,
                borderWidth: 2.8,
                fill: true,
                tension: 0.3,
                pointRadius: ctxItem => {
                    const yr = YEARS[ctxItem.dataIndex];
                    return (yr === 2004 || yr === 2012 || yr === 2021 || yr === 2024 || yr === 2025) ? 4.5 : 2;
                },
                pointBackgroundColor: ctxItem => {
                    const yr = YEARS[ctxItem.dataIndex];
                    if (yr === 2004) return '#ef4444';
                    if (yr === 2012) return '#10b981';
                    if (yr === 2021) return '#f59e0b';
                    if (yr === 2025) return '#06b6d4';
                    return '#38bdf8';
                },
                pointBorderColor: '#0b132b',
                pointBorderWidth: 1.5,
                pointHoverRadius: 6
            }
        ];

        if (doCompare && !isRondonia) {
            datasets.push({
                label: 'Rondônia (Benchmark)',
                data: rondoniaData,
                borderColor: '#f59e0b',
                backgroundColor: 'transparent',
                borderWidth: 2.2,
                borderDash: [5, 4],
                fill: false,
                tension: 0.3,
                pointRadius: 2.5,
                pointBackgroundColor: '#f59e0b',
                pointBorderColor: '#0b132b',
                pointBorderWidth: 1,
                pointHoverRadius: 5
            });
        }

        if (chartInstance) {
            chartInstance.data.labels = YEARS;
            chartInstance.data.datasets = datasets;
            chartInstance.update();
        } else {
            chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: YEARS,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(11, 19, 43, 0.95)',
                            borderColor: 'rgba(56, 189, 248, 0.3)',
                            borderWidth: 1,
                            padding: 10,
                            titleColor: '#f8fafc',
                            bodyColor: '#cbd5e1',
                            titleFont: { family: 'Inter', weight: '700', size: 12 },
                            bodyFont: { family: 'Inter', size: 11 },
                            callbacks: {
                                label: function (context) {
                                    const val = context.parsed.y;
                                    return ` ${context.dataset.label}: ${val.toLocaleString()} km²`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            display: true,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.04)',
                                drawBorder: false
                            },
                            ticks: {
                                color: '#94a3b8',
                                font: { family: 'Inter', size: 10 },
                                maxRotation: 0,
                                autoSkip: true,
                                maxTicksLimit: 13
                            }
                        },
                        y: {
                            display: true,
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.06)',
                                drawBorder: false
                            },
                            ticks: {
                                color: '#94a3b8',
                                font: { family: 'Inter', size: 10 },
                                callback: function (value) {
                                    return value >= 1000 ? (value / 1000).toFixed(0) + 'k km²' : value + ' km²';
                                }
                            }
                        }
                    }
                }
            });
        }

        renderHistoricalStats(state, doCompare);
        return chartInstance;
    }

    // ─── PHASE 3B: State-by-State Comparative Intelligence ─────────────────────

    /**
     * Transparent State Trend Classification Rule:
     * - 2025 < 2024 -> "Recent Decline"
     * - 2025 > 2024 -> "Recent Increase"
     * - otherwise -> "Stable"
     */
    function classifyTrend(val2025, val2024) {
        if (val2025 < val2024) return 'Recent Decline';
        if (val2025 > val2024) return 'Recent Increase';
        return 'Stable';
    }

    function getStateRanking(year = 2025) {
        const yrIdx = YEARS.indexOf(year);
        const prevYrIdx = YEARS.indexOf(year - 1);
        const totalLegalAmazon = SERIES['Amazônia Legal'][yrIdx];

        const statesOnly = STATES.filter(s => s !== 'Amazônia Legal');
        const ranking = statesOnly.map(st => {
            const area = SERIES[st][yrIdx];
            const prevArea = prevYrIdx !== -1 ? SERIES[st][prevYrIdx] : area;
            const delta = area - prevArea;
            const deltaPct = prevArea > 0 ? (delta / prevArea) * 100 : 0;
            const sharePct = totalLegalAmazon > 0 ? (area / totalLegalAmazon) * 100 : 0;
            const trend = classifyTrend(area, prevArea);

            return {
                state: st,
                area: area,
                prevArea: prevArea,
                delta: delta,
                deltaPct: Number(deltaPct.toFixed(2)),
                sharePct: Number(sharePct.toFixed(2)),
                trend: trend
            };
        });

        // Sort descending by deforestation area in the target year
        ranking.sort((a, b) => b.area - a.area);
        return ranking.map((item, idx) => ({ ...item, rank: idx + 1 }));
    }

    function getTopThreeConcentration(year = 2025) {
        const ranking = getStateRanking(year);
        const top3 = ranking.slice(0, 3);
        const top3Area = top3.reduce((sum, item) => sum + item.area, 0);
        const totalArea = SERIES['Amazônia Legal'][YEARS.indexOf(year)];
        const sharePct = totalArea > 0 ? (top3Area / totalArea) * 100 : 0;

        return {
            states: top3.map(t => t.state),
            totalArea: top3Area,
            totalLegalAmazon: totalArea,
            sharePct: Number(sharePct.toFixed(2))
        };
    }

    function getRondoniaComparativePosition(year = 2025) {
        const yrIdx = YEARS.indexOf(year);
        const roArea = SERIES['Rondônia'][yrIdx];
        const roPrev = SERIES['Rondônia'][YEARS.indexOf(year - 1)];
        const roDelta = roArea - roPrev;
        const roDeltaPct = roPrev > 0 ? (roDelta / roPrev) * 100 : 0;

        const compareStates = ['Pará', 'Mato Grosso', 'Amazonas', 'Acre'];
        const comparisons = compareStates.map(st => {
            const stArea = SERIES[st][yrIdx];
            const ratio = roArea > 0 ? (stArea / roArea).toFixed(1) : 'N/A';
            return {
                state: st,
                area: stArea,
                ratioVsRondonia: Number(ratio)
            };
        });

        const ranking = getStateRanking(year);
        const roRank = ranking.findIndex(s => s.state === 'Rondônia') + 1;

        return {
            rondoniaArea: roArea,
            rondoniaPrevArea: roPrev,
            rondoniaDelta: roDelta,
            rondoniaDeltaPct: Number(roDeltaPct.toFixed(2)),
            rondoniaRank: roRank,
            comparisons: comparisons,
            interpretation: 'Rondônia is not the largest contributor by absolute annual area. Its value as a pilot comes from its spatial structure and road-influenced fragmentation.'
        };
    }

    function focusState(stateName) {
        if (typeof document === 'undefined') return;
        const select = document.getElementById('hiStateSelect');
        if (select) {
            select.value = stateName;
        }
        const compareToggle = document.getElementById('hiCompareRondonia');
        const compare = compareToggle ? compareToggle.checked : false;
        initOrUpdateHistoricalChart('hiChartCanvas', stateName, compare);

        // Update active highlight on state ranking rows
        const rows = document.querySelectorAll('.hi-ranking-row');
        rows.forEach(r => {
            if (r.dataset.state === stateName) {
                r.classList.add('active-focus');
            } else {
                r.classList.remove('active-focus');
            }
        });

        // Smoothly scroll to the chart if in a scrolled view
        const chartWrapper = document.querySelector('.hi-chart-wrapper');
        if (chartWrapper && typeof chartWrapper.scrollIntoView === 'function') {
            chartWrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    function renderStateIntelligenceDOM(containerId = 'hiStateIntelligenceContainer') {
        if (typeof document === 'undefined') return;
        const container = document.getElementById(containerId);
        if (!container) return;

        const ranking = getStateRanking(2025);
        const top3 = getTopThreeConcentration(2025);
        const roComp = getRondoniaComparativePosition(2025);
        const maxArea = ranking[0].area;

        // Build HTML
        let html = `
            <div class="hi-state-intel-shell">
                <!-- Section Header (Part A) -->
                <div class="hi-state-intel-header">
                    <div>
                        <div class="hi-badge-tag"><i class="fas fa-layer-group"></i> COMPARATIVE JURISDICTIONAL INTELLIGENCE</div>
                        <h3 class="hi-state-title">Amazonia Legal — State Intelligence</h3>
                        <p class="hi-state-subtitle">How deforestation patterns differ across jurisdictions (PRODES 2025 vs 2024).</p>
                    </div>
                    <div>
                        <span class="hi-source-label"><i class="fas fa-database"></i> Source: INPE / TerraBrasilis — PRODES</span>
                    </div>
                </div>

                <!-- Key Insight Cards (Part F) -->
                <div class="hi-state-insights-grid">
                    <div class="hi-insight-card">
                        <div class="hi-ic-kicker"><i class="fas fa-trophy"></i> LEADING JURISDICTION</div>
                        <div class="hi-ic-val">${ranking[0].state} (${ranking[0].area.toLocaleString()} km²)</div>
                        <div class="hi-ic-desc">Pará remains the largest 2025 contributor, accounting for <strong>${ranking[0].sharePct}%</strong> of all Legal Amazon deforestation despite a -13.82% annual reduction.</div>
                    </div>
                    <div class="hi-insight-card alert-amber">
                        <div class="hi-ic-kicker text-rose"><i class="fas fa-arrow-trend-up"></i> UNIQUE DIVERGENCE</div>
                        <div class="hi-ic-val text-rose">Mato Grosso (+26.73%)</div>
                        <div class="hi-ic-desc">Mato Grosso is the <strong>only jurisdiction with a 2025 increase</strong> (+336 km² to 1,593 km²), diverging from all other 8 declining states.</div>
                    </div>
                    <div class="hi-insight-card">
                        <div class="hi-ic-kicker text-emerald"><i class="fas fa-arrow-trend-down"></i> PILOT ACCELERATION</div>
                        <div class="hi-ic-val text-emerald">Rondônia (-36.39%)</div>
                        <div class="hi-ic-desc">Rondônia declined <strong>36.39%</strong> from 360 km² in 2024 to 229 km² in 2025, falling to 6th place (4.00% share of total).</div>
                    </div>
                    <div class="hi-insight-card">
                        <div class="hi-ic-kicker"><i class="fas fa-pie-chart"></i> HIGH CONCENTRATION</div>
                        <div class="hi-ic-val">${top3.sharePct}% in 3 States</div>
                        <div class="hi-ic-desc">Three jurisdictions (Pará, Mato Grosso, and Amazonas) account for <strong>${top3.totalArea.toLocaleString()} km² (${top3.sharePct}%)</strong> of all 2025 clearing.</div>
                    </div>
                </div>

                <!-- Two-Column State Intelligence Grid (Parts A, B, C, H) -->
                <div class="hi-state-layout-grid">
                    <!-- Left Column: Ranking Bars (Part A & Part D) -->
                    <div class="hi-card hi-ranking-card">
                        <div class="hi-card-header-flex">
                            <div>
                                <div class="hi-card-kicker"><i class="fas fa-chart-bar"></i> JURISDICTIONAL RANKING (2025)</div>
                                <h4 class="hi-card-title">2025 Deforestation by State (km²)</h4>
                            </div>
                            <span class="hi-mini-tip"><i class="fas fa-hand-pointer"></i> Click state to inspect trajectory</span>
                        </div>

                        <div class="hi-ranking-list">
        `;

        ranking.forEach(item => {
            const barWidth = ((item.area / maxArea) * 100).toFixed(1);
            const deltaSign = item.delta > 0 ? '+' : '';
            const deltaClass = item.delta < 0 ? 'badge-down' : (item.delta > 0 ? 'badge-up' : '');
            const trendClass = item.trend === 'Recent Decline' ? 'trend-decline' : (item.trend === 'Recent Increase' ? 'trend-increase' : 'trend-stable');
            const trendIcon = item.trend === 'Recent Decline' ? 'fa-arrow-down' : (item.trend === 'Recent Increase' ? 'fa-arrow-up' : 'fa-minus');

            html += `
                <div class="hi-ranking-row" data-state="${item.state}" onclick="PRODES_HISTORICAL_DATA.focusState('${item.state}')">
                    <div class="hi-rank-num">#${item.rank}</div>
                    <div class="hi-rank-state-col">
                        <div class="hi-rank-state-name">${item.state}</div>
                        <div class="hi-rank-track">
                            <div class="hi-rank-fill ${item.state === 'Mato Grosso' ? 'fill-rose' : ''}" style="width: ${barWidth}%;"></div>
                        </div>
                    </div>
                    <div class="hi-rank-metrics">
                        <div class="hi-rank-val">${item.area.toLocaleString()} <span class="hi-unit">km²</span></div>
                        <div class="hi-rank-share">${item.sharePct}% share</div>
                    </div>
                    <div class="hi-rank-badges">
                        <span class="hi-change-badge ${deltaClass}">${deltaSign}${item.deltaPct}%</span>
                        <span class="hi-trend-badge ${trendClass}"><i class="fas ${trendIcon}"></i> ${item.trend}</span>
                    </div>
                </div>
            `;
        });

        html += `
                        </div>
                        <div class="hi-card-footer-note" style="margin-top: 14px;">
                            <i class="fas fa-info-circle"></i> Showing all 9 states of the Brazilian Legal Amazon sorted descending by 2025 clear-cut deforestation area (INPE/PRODES).
                        </div>
                    </div>

                    <!-- Right Column: Recent Change (Part B), Rondônia Position (Part C), and Project Connection (Part H) -->
                    <div class="hi-state-right-column">
                        <!-- Part B: 2024 -> 2025 State Change -->
                        <div class="hi-card hi-change-dist-card">
                            <div class="hi-card-kicker"><i class="fas fa-arrows-split-up-and-left"></i> 2024 → 2025 STATE TRAJECTORIES</div>
                            <h4 class="hi-card-title">Interannual Deforestation Dynamics</h4>
                            
                            <div class="hi-bipolar-summary">
                                <div class="hi-bipolar-box box-decline">
                                    <div class="hi-bipolar-title"><i class="fas fa-circle-arrow-down"></i> 8 STATES DECREASED</div>
                                    <div class="hi-bipolar-states">RR (-39.1%), AP (-37.0%), RO (-36.4%), MA (-31.6%), AC (-27.8%), AM (-20.0%), PA (-13.8%), TO (-6.3%)</div>
                                </div>
                                <div class="hi-bipolar-box box-increase">
                                    <div class="hi-bipolar-title"><i class="fas fa-circle-arrow-up"></i> 1 STATE INCREASED</div>
                                    <div class="hi-bipolar-states"><strong>Mato Grosso (+26.73%)</strong> — Rose from 1,257 to 1,593 km²</div>
                                </div>
                            </div>
                            <div class="hi-card-footer-note">
                                Regional behavior is not uniform across states: aggregate reductions can conceal significant localized expansion.
                            </div>
                        </div>

                        <!-- Part C: Where Does Rondônia Stand? -->
                        <div class="hi-card hi-rondonia-position-card">
                            <div class="hi-card-kicker"><i class="fas fa-crosshairs"></i> RONDÔNIA BENCHMARK POSITION</div>
                            <h4 class="hi-card-title">Where does Rondônia stand?</h4>

                            <div class="hi-ro-metrics-band">
                                <div class="hi-ro-metric-item">
                                    <span class="hi-ro-m-label">2025 Area</span>
                                    <strong class="hi-ro-m-val text-emerald">229 km²</strong>
                                </div>
                                <div class="hi-ro-metric-item">
                                    <span class="hi-ro-m-label">2024 Area</span>
                                    <strong class="hi-ro-m-val">360 km²</strong>
                                </div>
                                <div class="hi-ro-metric-item">
                                    <span class="hi-ro-m-label">YoY Change</span>
                                    <strong class="hi-ro-m-val text-emerald">-36.39%</strong>
                                </div>
                                <div class="hi-ro-metric-item">
                                    <span class="hi-ro-m-label">Basin Rank</span>
                                    <strong class="hi-ro-m-val">#${roComp.rondoniaRank} of 9</strong>
                                </div>
                            </div>

                            <div class="hi-ro-comp-grid">
        `;

        roComp.comparisons.forEach(c => {
            html += `
                <div class="hi-ro-comp-chip">
                    <span class="hi-ro-comp-name">${c.state}</span>
                    <span class="hi-ro-comp-val">${c.area.toLocaleString()} km²</span>
                    <span class="hi-ro-comp-ratio">${c.ratioVsRondonia}× Rondônia</span>
                </div>
            `;
        });

        html += `
                            </div>

                            <div class="hi-ro-quote-box">
                                <i class="fas fa-quote-left" style="color: #38bdf8; margin-right: 6px;"></i>
                                <span>${roComp.interpretation}</span>
                            </div>
                        </div>

                        <!-- Part H: Connecting State Intelligence to the Project -->
                        <div class="hi-card hi-project-connect-card">
                            <div class="hi-card-kicker"><i class="fas fa-network-wired"></i> REGIONAL CALIBRATION PRINCIPLE</div>
                            <h4 class="hi-card-title">Deployment Context & Model Governance</h4>
                            <p class="hi-project-connect-p">
                                State-level patterns demonstrate why a single national risk model should be validated and calibrated regionally before Amazon-wide deployment.
                            </p>
                            <div class="hi-project-deploy-grid">
                                <div class="hi-deploy-chip chip-active">
                                    <span class="hi-deploy-tag">CURRENT PROTOTYPE</span>
                                    <strong>Rondônia</strong>
                                    <span class="hi-deploy-sub">Road-influenced fragmentation testbed</span>
                                </div>
                                <div class="hi-deploy-chip chip-future">
                                    <span class="hi-deploy-tag">FUTURE VALIDATION</span>
                                    <strong>Multi-State Amazonia Legal</strong>
                                    <span class="hi-deploy-sub">Calibrated per regional driver profile</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    return {
        YEARS: YEARS,
        SERIES: SERIES,
        STATES: STATES,
        getSeries: getSeries,
        calculateStats: calculateStats,
        KEY_MOMENTS: KEY_MOMENTS,
        RONDONIA_FACTS: RONDONIA_FACTS,
        LATEST_PRODES_CHANGES: LATEST_PRODES_CHANGES,
        SCIENTIFIC_HONESTY_NOTE: SCIENTIFIC_HONESTY_NOTE,
        renderHistoricalStats: renderHistoricalStats,
        initOrUpdateHistoricalChart: initOrUpdateHistoricalChart,
        // Phase 3B exports
        classifyTrend: classifyTrend,
        getStateRanking: getStateRanking,
        getTopThreeConcentration: getTopThreeConcentration,
        getRondoniaComparativePosition: getRondoniaComparativePosition,
        focusState: focusState,
        renderStateIntelligenceDOM: renderStateIntelligenceDOM
    };
}));

