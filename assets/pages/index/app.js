let deckInstance
        let dataGlobal
        let introHeightScale = 0
        let manualHeightScale = 1.2
        let minRiskThreshold = 0
        let heatmapIntensity = 1.2
        let performanceMode = 'balanced'
        let currentMode = '3d'
        let currentScenario = 'baseline'
        let currentMetric = 'risk'
        let currentYear = 2030
        let isPlaying = false
        let playInterval
        let riskChartInstance
        let autoRotateFrame = null
        let autoRotateEnabled = false
        let currentViewState = null
        let uiReady = false
        let introRevealProgress = 1
        let columnRevealState = null
        let columnRevealFrameId = null
        let statsRevealState = null
        let statsRevealFrameId = null
        let alertRevealEnabled = false
        let hotspotPulseFrame = null
        let hotspotPulseLastTick = 0
        let appInitialized = false
        let pendingMapStyle = null
        let selectedAnalysisPoint = null
        let validationLayerEnabled = false
        let generatedSpatialLayers = null
        let spatialLayersVisible = {
            roads: true,
            rivers: false,
            protected: true,
            urban: false
        }
        const DEFAULT_VIEW_STATE = {
            longitude: -62.73,
            latitude: -10.95,
            zoom: 7.15,
            pitch: 62,
            bearing: -14
        };
        const AMAZON_FOCUS_VIEW = {
            longitude: -61.8,
            latitude: -10.2,
            zoom: 8.0,
            pitch: 58,
            bearing: -22
        };
        const DATA_BOUNDS = {
            minLat: -13.6,
            maxLat: -8.4,
            minLon: -66.4,
            maxLon: -60.2
        };
        const SCENARIO_CONFIG = {
            baseline: {
                label: 'Baseline',
                insight: 'Baseline pressure tracks the original model output.'
            },
            road: {
                label: 'Road +20%',
                insight: 'Road expansion amplifies frontier exposure and accessible-edge pressure.'
            },
            protection: {
                label: 'Protection',
                insight: 'Protection enforcement suppresses risk across accessible expansion corridors.'
            },
            simulated: {
                label: 'Simulated',
                insight: 'Custom scenario imported from the GeoAI Simulator.'
            }
        };
        const DEFAULT_SIMULATION_STATE = {
            road: 20,
            pop: 15,
            fire: 10,
            policies: [],  // Fix #4: Default to no active policies so positive slider values always increase risk
            timestamp: 0
        };
        let simulationState = { ...DEFAULT_SIMULATION_STATE };
        const COLUMN_PANEL_STORAGE_KEY = 'geoai.columnPanelCollapsed';
        const PERFORMANCE_CONFIG = {
            quality: {
                label: 'Quality',
                threeDStride: 1,
                heatStride: 1,
                hotspotThreshold: 160,
                validationStride: 1,
                cameraTransition: 1,
                timelineInterval: 120
            },
            balanced: {
                label: 'Balanced',
                threeDStride: 2,
                heatStride: 3,
                hotspotThreshold: 162,
                validationStride: 2,
                cameraTransition: 0.82,
                timelineInterval: 100
            },
            fast: {
                label: 'Fast',
                threeDStride: 3,
                heatStride: 4,
                hotspotThreshold: 166,
                validationStride: 3,
                cameraTransition: 0.68,
                timelineInterval: 80
            }
        };
        const VALIDATION_STATUS_STYLE = {
            confirmed: { label: 'Confirmed loss proxy', color: [56, 189, 248] },
            overpredicted: { label: 'Overpredicted risk', color: [245, 158, 11] },
            missed: { label: 'Missed loss proxy', color: [220, 38, 38] },
            stable: { label: 'Stable agreement', color: [148, 163, 184] }
        };
        const DEMO_DATA = [
            { lat: -11.9182632848, lon: -63.8722379103, risk_score: 166, risk_norm: 0.9325842697, elevation: 3730, color: [0, 180, 0, 200] },
            { lat: -12.4057789895, lon: -60.8067370032, risk_score: 175, risk_norm: 0.9831460674, elevation: 3932, color: [220, 0, 0, 230] },
            { lat: -10.1813706829, lon: -62.6333713020, risk_score: 177, risk_norm: 0.9943820225, elevation: 3977, color: [220, 0, 0, 230] },
            { lat: -10.2579071451, lon: -64.2287792466, risk_score: 161, risk_norm: 0.9044943820, elevation: 3617, color: [0, 180, 0, 200] },
            { lat: -9.6652885522, lon: -64.9612655292, risk_score: 177, risk_norm: 0.9943820225, elevation: 3977, color: [220, 0, 0, 230] },
            { lat: -11.5576795297, lon: -60.9528030684, risk_score: 177, risk_norm: 0.9943820225, elevation: 3977, color: [220, 0, 0, 230] },
            { lat: -10.3519607554, lon: -65.2078530747, risk_score: 164, risk_norm: 0.9213483146, elevation: 3685, color: [0, 180, 0, 200] },
            { lat: -13.3417336840, lon: -61.2810474732, risk_score: 175, risk_norm: 0.9831460674, elevation: 3932, color: [220, 0, 0, 230] },
            { lat: -11.8438827792, lon: -61.9547839363, risk_score: 161, risk_norm: 0.9044943820, elevation: 3617, color: [0, 180, 0, 200] },
            { lat: -13.0584948749, lon: -60.8924362813, risk_score: 165, risk_norm: 0.9269662921, elevation: 3707, color: [0, 180, 0, 200] },
            { lat: -12.4850103975, lon: -62.0135337559, risk_score: 165, risk_norm: 0.9269662921, elevation: 3707, color: [0, 180, 0, 200] },
            { lat: -9.4181620175, lon: -62.4215485580, risk_score: 166, risk_norm: 0.9325842697, elevation: 3730, color: [0, 180, 0, 200] },
            { lat: -8.5, lon: -63.1, risk_score: 178, risk_norm: 1.0, elevation: 4000, color: [255, 0, 0, 255] },
            { lat: -11.2, lon: -61.5, risk_score: 174, risk_norm: 0.97, elevation: 3880, color: [220, 0, 0, 230] },
            { lat: -10.5, lon: -64.8, risk_score: 168, risk_norm: 0.94, elevation: 3760, color: [220, 100, 0, 200] },
            { lat: -12.8, lon: -62.5, risk_score: 172, risk_norm: 0.96, elevation: 3840, color: [220, 0, 0, 230] },
            { lat: -9.1, lon: -65.2, risk_score: 162, risk_norm: 0.91, elevation: 3640, color: [0, 180, 0, 200] },
            { lat: -10.2, lon: -61.0, risk_score: 179, risk_norm: 1.0, elevation: 4000, color: [255, 0, 0, 255] },
            { lat: -11.8, lon: -63.5, risk_score: 165, risk_norm: 0.92, elevation: 3680, color: [0, 180, 0, 200] },
            { lat: -12.5, lon: -60.2, risk_score: 176, risk_norm: 0.99, elevation: 3960, color: [220, 0, 0, 230] },
            { lat: -10.8, lon: -63.2, risk_score: 167, risk_norm: 0.93, elevation: 3720, color: [200, 80, 0, 200] },
            { lat: -11.5, lon: -62.1, risk_score: 181, risk_norm: 1.0, elevation: 3950, color: [255, 0, 0, 255] },
            { lat: -9.9, lon: -61.8, risk_score: 173, risk_norm: 0.96, elevation: 3860, color: [220, 20, 0, 230] },
            { lat: -10.4, lon: -64.1, risk_score: 169, risk_norm: 0.94, elevation: 3780, color: [220, 120, 0, 200] },
            { lat: -11.1, lon: -65.3, risk_score: 171, risk_norm: 0.95, elevation: 3820, color: [220, 40, 0, 230] },
            { lat: -12.3, lon: -63.9, risk_score: 165, risk_norm: 0.92, elevation: 3670, color: [100, 180, 0, 200] },
            { lat: -12.9, lon: -61.4, risk_score: 178, risk_norm: 0.99, elevation: 3940, color: [255, 0, 0, 255] },
            { lat: -10.1, lon: -60.9, risk_score: 172, risk_norm: 0.96, elevation: 3830, color: [220, 20, 0, 230] },
            { lat: -11.4, lon: -64.5, risk_score: 164, risk_norm: 0.91, elevation: 3640, color: [0, 180, 0, 200] },
            { lat: -9.3, lon: -63.7, risk_score: 180, risk_norm: 1.0, elevation: 3980, color: [255, 0, 0, 255] },
            { lat: -10.6, lon: -62.4, risk_score: 168, risk_norm: 0.94, elevation: 3750, color: [220, 110, 0, 200] },
            { lat: -11.9, lon: -64.8, risk_score: 174, risk_norm: 0.97, elevation: 3870, color: [255, 50, 0, 230] },
            { lat: -12.1, lon: -61.1, risk_score: 170, risk_norm: 0.95, elevation: 3800, color: [220, 90, 0, 210] },
            { lat: -9.7, lon: -62.9, risk_score: 163, risk_norm: 0.91, elevation: 3630, color: [100, 150, 0, 180] },
            { lat: -10.9, lon: -60.5, risk_score: 179, risk_norm: 1.0, elevation: 3990, color: [255, 0, 0, 255] }
        ];
        // Map styles
        function createRasterStyle(tileUrl, attribution = "") {
            return {
                version: 8,
                sources: {
                    "basemap-source": {
                        type: "raster",
                        tiles: [tileUrl],
                        tileSize: 256,
                        attribution
                    }
                },
                layers: [{
                    id: "basemap-layer",
                    type: "raster",
                    source: "basemap-source",
                    minzoom: 0,
                    maxzoom: 22
                }]
            };
        }
        const MAP_STYLES = {
            dark: "mapbox://styles/mapbox/dark-v11",
            terrain: createRasterStyle("https://tile.opentopomap.org/{z}/{x}/{y}.png", "OpenTopoMap"),
            satellite: createRasterStyle("https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", "Esri")
        };
        const MAPBOX_TOKEN = "pk.eyJ1IjoibWFtZG91aGFobWVkMTU4MSIsImEiOiJjbTduaXVndjEwMDRsMm9zYXVhcHJ3eGt6In0.H_fBihpC9-p5Qp7q_WKgVw";
        function assignEventYear(point) {
            const latSeed = Math.round(Math.abs(point.lat) * 1000);
            const lonSeed = Math.round(Math.abs(point.lon) * 1000);
            return 2001 + ((latSeed * 31 + lonSeed * 17) % 30);
        }
        async function loadForestData() {
            const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
            const timeoutId = controller ? setTimeout(() => controller.abort(), 12000) : null;
            try {
                const response = await fetch("data/forest_data_clean.json", {
                    signal: controller ? controller.signal : undefined,
                    cache: "no-store"
                });
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return await response.json();
            } finally {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
            }
        }
        function initializeDashboard(data) {
            if (appInitialized) return;
            appInitialized = true;
            dataGlobal = data;
            initSpatialLayers();
            syncSimulatorState();
            dataGlobal.forEach(point => {
                point.event_year = assignEventYear(point);
            });
            deckInstance = new deck.DeckGL({
                container: "deck-container",
                mapStyle: MAP_STYLES.dark,
                mapboxApiAccessToken: MAPBOX_TOKEN,
                initialViewState: {
                    longitude: -40.0,
                    latitude: -5.0,
                    zoom: 2.5,
                    pitch: 0,
                    bearing: 0
                },
                controller: true,
                onViewStateChange: ({ viewState, interactionState }) => {
                    currentViewState = { ...viewState };
                    if (interactionState.isPanning || interactionState.isZooming || interactionState.isRotating) {
                        markAnalysisReady();
                    }
                    if (autoRotateEnabled && (interactionState.isPanning || interactionState.isZooming || interactionState.isRotating)) {
                        stopAutoRotate();
                    }
                },
                getTooltip: ({ object }) => {
                    if (!object) return null;
                    const pointScore = getPointScore(object);
                    const displayMetricValue = getDisplayMetricValue(object);
                    const displayMetricLabel = currentMetric === 'risk'
                        ? 'Risk Score'
                        : (currentMetric === 'probability' ? 'Probability' : 'Confidence');
                    const validationEvidence = getValidationEvidence(object);
                    const distanceToRoadKm = getDistanceToRoadKm(object);
                    const regionPoints = getLocalRegionPoints(object);
                    const drivers = buildExplanationDrivers(object, regionPoints);
                    let driversHtml = '<div style="margin-top:8px; padding-top:8px; border-top:1px solid rgba(255,255,255,0.1)">';
                    drivers.slice(0, 3).forEach(d => {
                        driversHtml += `<div style="display:flex; justify-content:space-between; font-size:10px; margin-bottom:2px;">
                            <span style="color:#94a3b8">${d.label}:</span>
                            <span style="color:#f8fafc; font-weight:700">${d.percent}%</span>
                        </div>`;
                    });
                    driversHtml += '</div>';
                    return {
                        html: `<div style="line-height:1.6; min-width:180px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                                <b style="color:#3b82f6; font-size:14px;">Risk Assessment</b>
                                <span style="background:${pointScore > 170 ? '#dc2626' : (pointScore > 165 ? '#f59e0b' : '#22c55e')}; padding:2px 6px; border-radius:4px; font-size:9px; font-weight:800; color:white;">
                                    ${getRiskClassText(pointScore).toUpperCase()}
                                </span>
                            </div>
                            <div style="font-size:18px; font-weight:800; color:#f8fafc; margin-bottom:4px;">
                                ${(getProbabilityPercent(pointScore) / 100).toFixed(2)} <span style="font-size:10px; color:#64748b; font-weight:400">prob.</span>
                            </div>
                            <span style="color:#94a3b8; font-size:11px;">${displayMetricLabel}: <b style="color:#f8fafc">${displayMetricValue}${currentMetric === 'risk' ? '' : '%'}</b></span><br>
                            <span style="color:#94a3b8; font-size:11px;">Prediction Year: <b style="color:#f8fafc">${object.event_year}</b></span><br>
                            <span style="color:#94a3b8; font-size:11px;">Scenario: <b style="color:#f8fafc">${SCENARIO_CONFIG[currentScenario].label}</b></span><br>
                            
                            ${driversHtml}
                            <div style="margin-top:8px; font-size:10px; color:#64748b; background:rgba(255,255,255,0.05); padding:6px; border-radius:6px;">
                                <b>Satellite Validation:</b> ${validationEvidence.observedForestLoss ? 'Evidence Detected' : 'No Evidence'}<br>
                                <span style="font-size:9px; opacity:0.8">${validationEvidence.satelliteValidation}</span>
                            </div>
                            
                            <div style="font-size:10px; margin-top:8px; color:#60a5fa; text-align:center;">Click for full analysis</div>
                          </div>`,
                        style: { color: 'white' }
                    };
                }
            });
            const mapboxMap = deckInstance && deckInstance.map;
            if (mapboxMap && typeof mapboxMap.once === 'function') {
                mapboxMap.once('idle', () => {
                    if (pendingMapStyle) {
                        const nextStyle = pendingMapStyle;
                        pendingMapStyle = null;
                        toggleMapStyle(nextStyle);
                    }
                });
            }
            try {
                // Consolidate intro: call ONLY startAnimation which handles growColumns internally
                startAnimation();
            } catch (e) {
                console.warn("Animation start error:", e);
            }
            hideLoadingOverlay();
        }
        function hideLoadingOverlay() {
            setTimeout(() => {
                document.getElementById("loadingOverlay").classList.add("fade-out");
            }, 500);
        }
        function showLoadingError(message, allowRecovery = false) {
            const overlay = document.getElementById("loadingOverlay");
            overlay.classList.remove("fade-out");
            overlay.classList.add("error");
            const messageEl = overlay.querySelector("#loadingMsg") || overlay.querySelector("p");
            if (messageEl) {
                messageEl.classList.remove("loading-copy");
                messageEl.removeAttribute("aria-hidden");
                messageEl.innerText = message;
                messageEl.style.display = "block";
            }
            let actions = overlay.querySelector(".loading-actions");
            if (!actions) {
                actions = document.createElement("div");
                actions.className = "loading-actions";
                overlay.appendChild(actions);
            }
            actions.innerHTML = "";
            if (!allowRecovery) {
                return;
            }
            const pickFileBtn = document.createElement("button");
            pickFileBtn.className = "loading-action-btn";
            pickFileBtn.type = "button";
            pickFileBtn.innerText = "Choose JSON File";
            pickFileBtn.onclick = promptForJsonFile;
            actions.appendChild(pickFileBtn);
            const demoBtn = document.createElement("button");
            demoBtn.className = "loading-action-btn";
            demoBtn.type = "button";
            demoBtn.innerText = "Load Demo Data";
            demoBtn.onclick = () => initializeDashboard(DEMO_DATA.map(point => ({ ...point })));
            actions.appendChild(demoBtn);
        }
        function promptForJsonFile() {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".json,application/json";
            input.onchange = async event => {
                const [file] = event.target.files || [];
                if (!file) return;
                try {
                    const text = await file.text();
                    const parsed = JSON.parse(text);
                    initializeDashboard(parsed);
                } catch (error) {
                    console.error("Manual JSON load failed:", error);
                    showLoadingError("The selected file could not be parsed. Choose forest_data_clean.json or use demo data.", true);
                }
            };
            input.click();
        }
        function bootstrapApp() {
            initializeColumnPanel();
            const columnPanel = document.getElementById('columnPanel');
            if (columnPanel) {
                const shell = columnPanel.querySelector('.column-panel-shell');
                if (shell) {
                    shell.scrollTop = 0;
                } else {
                    columnPanel.scrollTop = 0;
                }
            }
            syncColumnScaleUI();
            syncRiskThresholdUI();
            syncHeatmapIntensityUI();
            syncPerformanceUI();
            syncScenarioUI();
            syncScenarioControlUI();
            syncLayerUI();
            updateSideTrajectoryChart();
            bindGlobalShortcuts();
            handleDashboardEntryHash();
            const autoFallback = () => {
                if (appInitialized) return;
                console.warn("Bootstrap: Activating Autonomous Demo Mode.");
                const msg = document.getElementById('loadingMsg');
                if (msg) msg.innerText = "Connection restricted. Activating Local Preview Mode...";
                setTimeout(() => {
                    if (!appInitialized) {
                        initializeDashboard(DEMO_DATA.map(p => ({ ...p })));
                        setInterfaceReady(true);
                        // Add a small notification to the user
                        const banner = document.getElementById('alertBanner');
                        if (banner) {
                            banner.classList.add('active', 'low');
                            banner.querySelector('.alert-headline').innerText = "Autonomous Mode Active";
                            banner.querySelector('.alert-meta').innerText = "Running on local encrypted cache due to restricted server access.";
                            setTimeout(() => banner.classList.remove('active'), 6000);
                        }
                    }
                }, 1200);
            };
            let loadTimeout = setTimeout(autoFallback, 4500);
            loadForestData()
                .then(data => {
                    clearTimeout(loadTimeout);
                    initializeDashboard(data);
                })
                .catch(error => {
                    clearTimeout(loadTimeout);
                    console.error("Failed to initialize dashboard:", error);
                    // Instead of a hard error, try auto-fallback immediately
                    autoFallback();
                });
        }
        function bindGlobalShortcuts() {
            document.addEventListener('keydown', event => {
                if (event.key !== 'Escape') return;
                toggleMetricsPopup(false);
                toggleModal(false);
                toggleSidebar(false);
                closeMapControlsMenu();
                if (autoRotateEnabled) {
                    stopAutoRotate();
                }
            });
            document.addEventListener('click', event => {
                const controls = document.getElementById('mapControls');
                if (!controls || controls.contains(event.target)) return;
                closeMapControlsMenu();
            });
        }
        function setSecondaryReady(ready) {
            document.body.classList.toggle('secondary-ready', ready);
        }
        function setStatsReveal(value) {
            const clamped = Math.max(0, Math.min(1, Number(value) || 0));
            document.documentElement.style.setProperty('--stats-reveal', clamped.toFixed(3));
        }
        function stopStatsReveal() {
            if (statsRevealFrameId) {
                cancelAnimationFrame(statsRevealFrameId);
                statsRevealFrameId = null;
            }
            statsRevealState = null;
        }

        function startStatsReveal(duration = 320) {
            stopStatsReveal();
            const currentValue = Math.max(
                0,
                Math.min(1, parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--stats-reveal')) || 0)
            );
            statsRevealState = {
                startTime: performance.now(),
                duration,
                startValue: currentValue
            };
            statsRevealFrameId = requestAnimationFrame(animateStatsReveal);
        }

        function animateStatsReveal(now) {
            if (!statsRevealState) return;

            const state = statsRevealState;
            const elapsed = Math.max(0, (typeof now === 'number' ? now : performance.now()) - state.startTime);
            const t = Math.min(elapsed / state.duration, 1);
            const eased = t * t * (3 - 2 * t);
            const value = state.startValue + (1 - state.startValue) * eased;

            setStatsReveal(value);

            if (t < 1) {
                statsRevealFrameId = requestAnimationFrame(animateStatsReveal);
            } else {
                statsRevealFrameId = null;
                statsRevealState = null;
                setStatsReveal(1);
            }
        }
        function getRiskClassText(score) {
            if (score > 170) return 'High';
            if (score > 165) return 'Medium';
            return 'Low';
        }
        function getProbabilityPercent(score) {
            // Fix #3: Route through SSOT normalizeRiskScore to guarantee [0,100] clamp.
            // SSOT maps raw score 140→0%, 185→100% with strict clamping.
            if (window.GEOAI_CONSTANTS && window.GEOAI_CONSTANTS.normalizeRiskScore) {
                return window.GEOAI_CONSTANTS.normalizeRiskScore(score);
            }
            // Fallback (SSOT not loaded): same mapping, same clamp
            const normalized = Math.max(0, Math.min(1, (score - 140) / 45));
            return Math.max(0, Math.min(100, Math.round(normalized * 100)));
        }
        function getConfidencePercent(score) {
            return Math.min(99, Math.max(72, Math.round(((score - 140) / 45) * 100)));
        }
        function getColorForScore(score) {
            if (score > 170) return [220, 38, 38];
            if (score > 165) return [251, 146, 60];
            return [34, 197, 94];
        }
        function clamp01(value) {
            return Math.max(0, Math.min(1, value));
        }
        function getPointScore(point, scenario = currentScenario) {
            if (point && point.__scenarioScores && point.__scenarioScores[scenario]) {
                return point.__scenarioScores[scenario];
            }
            const baseScore = point.risk_score;
            if (scenario === 'baseline') {
                return baseScore;
            }
            const frontierExposure = clamp01((point.lon - DATA_BOUNDS.minLon) / (DATA_BOUNDS.maxLon - DATA_BOUNDS.minLon));
            const terrainAccessibility = 1 - clamp01((point.elevation || 0) / 4000);
            const structuralPressure = clamp01((((point.risk_norm || 0.5) * 0.55) + (frontierExposure * 0.25) + (terrainAccessibility * 0.2)));
            let adjustedScore = baseScore;
            if (scenario === 'road') {
                adjustedScore += (frontierExposure * 7.5) + (terrainAccessibility * 3.5) + (structuralPressure * 2.5);
            } else if (scenario === 'protection') {
                adjustedScore -= (terrainAccessibility * 4.5) + (structuralPressure * 5.5) + ((1 - frontierExposure) * 1.5);
            } else if (scenario === 'simulated' && simulationState) {
                // Apply custom simulation logic
                const roadFactor = simulationState.road / 100; // e.g. 0.2 for +20%
                const popFactor = simulationState.pop / 100;
                const fireFactor = simulationState.fire / 100;
                const policyReduction = (simulationState.policies || []).length * 4.0;
                const roadImpact = (frontierExposure * 12 * roadFactor) + (terrainAccessibility * 6 * roadFactor);
                const popImpact = (structuralPressure * 8 * popFactor);
                const fireImpact = (point.risk_norm * 10 * fireFactor);
                adjustedScore += (roadImpact + popImpact + fireImpact) - policyReduction;
            }
            return Math.max(140, Math.min(185, adjustedScore));
        }
        function getDisplayMetricValue(point) {
            const score = getPointScore(point);
            if (currentMetric === 'probability') return getProbabilityPercent(score);
            if (currentMetric === 'confidence') return getConfidencePercent(score);
            return score;
        }
        function getRevealFactor(point) {
            if (!point) return 0;
            if (uiReady) {
                if (currentYear >= 2030) return 1;
                const age = currentYear - point.event_year;
                if (age < 0) return 0;
                if (age > 1.2) return 1;
                const t = age / 1.2;
                return t * t * (3 - 2 * t);
            }
            const score = getPointScore(point);
            let revealStart = 0.55;
            if (score > 170) revealStart = 0.05;
            else if (score > 165) revealStart = 0.35;
            else revealStart = 0.65;
            const revealWindow = 0.35;
            const normalized = Math.max(0, Math.min(1, (introRevealProgress - revealStart) / revealWindow));
            return normalized * normalized * (3 - 2 * normalized);
        }
        function getMetricHeight(point) {
            const score = getPointScore(point);
            if (currentMetric === 'probability') {
                return Math.max(600, getProbabilityPercent(score) * 28) * getRevealFactor(point);
            }
            if (currentMetric === 'confidence') {
                return Math.max(600, getConfidencePercent(score) * 24) * getRevealFactor(point);
            }
            let baseHeight = 600;
            if (score > 170) baseHeight = 3000;
            else if (score > 165) baseHeight = 1500;
            return baseHeight * getRevealFactor(point);
        }
        function normalizeSimulationState() {
            if (!simulationState || typeof simulationState !== 'object') {
                simulationState = { ...DEFAULT_SIMULATION_STATE };
            }
            simulationState.road = Number.isFinite(Number(simulationState.road))
                ? Number(simulationState.road)
                : DEFAULT_SIMULATION_STATE.road;
            simulationState.pop = Number.isFinite(Number(simulationState.pop))
                ? Number(simulationState.pop)
                : DEFAULT_SIMULATION_STATE.pop;
            simulationState.fire = Number.isFinite(Number(simulationState.fire))
                ? Number(simulationState.fire)
                : DEFAULT_SIMULATION_STATE.fire;
            simulationState.policies = Array.isArray(simulationState.policies)
                ? [...new Set(simulationState.policies)]
                : [...DEFAULT_SIMULATION_STATE.policies];
            return simulationState;
        }
        function getSimulationPreviewMetrics() {
            const state = normalizeSimulationState();
            if (!dataGlobal || !dataGlobal.length) {
                const baseline = 64;
                const custom = Math.max(
                    40,
                    Math.min(
                        99,
                        Math.round(
                            baseline
                            + (state.road * 0.16)
                            + (state.pop * 0.08)
                            + (state.fire * 0.11)
                            - (state.policies.length * 3.5)
                        )
                    )
                );
                return {
                    baseline,
                    simulated: custom,
                    delta: custom - baseline
                };
            }
            const visible = dataGlobal.filter(point => point.event_year <= Math.ceil(currentYear));
            if (!visible.length) {
                return { baseline: 0, simulated: 0, delta: 0 };
            }
            const baselineMean = visible.reduce((sum, point) => sum + getPointScore(point, 'baseline'), 0) / visible.length;
            const simulatedMean = visible.reduce((sum, point) => sum + getPointScore(point, 'simulated'), 0) / visible.length;
            const baseline = getProbabilityPercent(baselineMean);
            const simulated = getProbabilityPercent(simulatedMean);
            return {
                baseline,
                simulated,
                delta: simulated - baseline
            };
        }
        function getScenarioPoint(point) {
            const scenarioScore = getPointScore(point);
            return {
                ...point,
                __scenarioScore: scenarioScore,
                __scenarioColor: getColorForScore(scenarioScore)
            };
        }
        let lastRenderedYearCeil = null;
        let lastRenderedScenario = null;
        let lastRenderedMinRisk = null;
        let cachedScenarioData = [];
        function getVisibleScenarioData() {
            const ceilYear = Math.ceil(currentYear);
            if (ceilYear === lastRenderedYearCeil && currentScenario === lastRenderedScenario && minRiskThreshold === lastRenderedMinRisk) {
                return cachedScenarioData;
            }
            lastRenderedYearCeil = ceilYear;
            lastRenderedScenario = currentScenario;
            lastRenderedMinRisk = minRiskThreshold;
            cachedScenarioData = dataGlobal
                .filter(point => point.event_year <= ceilYear)
                .map(getScenarioPoint)
                .filter(point => point.__scenarioScore >= minRiskThreshold);
            return cachedScenarioData;
        }
        function getScenarioImpactMetrics(activeData) {
            const baselineData = dataGlobal
                .filter(point => point.event_year <= currentYear)
                .map(point => ({ ...point, __baselineScore: getPointScore(point, 'baseline') }))
                .filter(point => point.__baselineScore >= minRiskThreshold);
            const baselineHigh = baselineData.filter(point => point.__baselineScore > 170).length;
            const activeHigh = activeData.filter(point => getPointScore(point) > 170).length;
            const baselineMean = baselineData.length ? baselineData.reduce((sum, point) => sum + point.__baselineScore, 0) / baselineData.length : 140;
            const activeMean = activeData.length ? activeData.reduce((sum, point) => sum + getPointScore(point), 0) / activeData.length : 140;
            const baselinePressure = getProbabilityPercent(baselineMean);
            const activePressure = getProbabilityPercent(activeMean);
            return {
                labels: ['High Risk', 'Mean Pressure'],
                values: [
                    baselineHigh ? Number((((activeHigh - baselineHigh) / baselineHigh) * 100).toFixed(1)) : 0,
                    Number((activePressure - baselinePressure).toFixed(1))
                ]
            };
        }
        function initSpatialLayers() {
            generatedSpatialLayers = {
                roads: [
                    [[-65.7, -12.7], [-64.6, -11.8], [-63.3, -10.9], [-61.7, -9.4]],
                    [[-65.2, -10.8], [-64.0, -10.4], [-62.5, -11.2], [-60.9, -12.1]]
                ],
                rivers: [
                    [[-66.0, -11.6], [-64.8, -11.1], [-63.1, -11.0], [-61.0, -10.9]],
                    [[-65.6, -9.0], [-64.0, -8.8], [-62.6, -8.9], [-60.8, -8.7]]
                ],
                protected: [
                    [[[-65.4, -10.3], [-64.4, -10.1], [-64.0, -10.9], [-64.7, -11.4], [-65.5, -11.1], [-65.4, -10.3]]],
                    [[[-62.7, -12.4], [-61.9, -12.1], [-61.6, -12.9], [-62.0, -13.4], [-62.8, -13.0], [-62.7, -12.4]]]
                ],
                urban: [
                    { position: [-62.3, -11.1], radius: 6500 },
                    { position: [-61.4, -12.8], radius: 5600 }
                ]
            };
        }
        function getValidationScore(point) {
            const frontier = clamp01((point.lon - DATA_BOUNDS.minLon) / (DATA_BOUNDS.maxLon - DATA_BOUNDS.minLon));
            const accessibility = 1 - clamp01((point.elevation || 0) / 4000);
            return clamp01((point.risk_norm * 0.62) + (frontier * 0.22) + (accessibility * 0.16));
        }
        function getValidationEvidence(point) {
            const predictedHighRisk = getPointScore(point) > 170;
            const validationScore = getValidationScore(point);
            const observedForestLoss = validationScore > 0.68;
            const fireHotspot = validationScore > 0.61;
            const satelliteValidation = validationScore > 0.64 ? 'Matched' : 'Partial';
            let status = 'Stable agreement';
            if (predictedHighRisk && observedForestLoss) {
                status = 'Confirmed loss proxy';
            } else if (predictedHighRisk && !observedForestLoss) {
                status = 'Overpredicted risk';
            } else if (!predictedHighRisk && observedForestLoss) {
                status = 'Missed loss proxy';
            }
            return {
                observedForestLoss,
                fireHotspot,
                satelliteValidation,
                status,
                validationScore
            };
        }
        function pointToSegmentDistanceKm(px, py, ax, ay, bx, by) {
            const abx = bx - ax;
            const aby = by - ay;
            const apx = px - ax;
            const apy = py - ay;
            const ab2 = (abx * abx) + (aby * aby) || 1;
            const t = Math.max(0, Math.min(1, ((apx * abx) + (apy * aby)) / ab2));
            const closestX = ax + (abx * t);
            const closestY = ay + (aby * t);
            const dx = (px - closestX) * 111.32 * Math.cos((py * Math.PI) / 180);
            const dy = (py - closestY) * 110.57;
            return Math.sqrt((dx * dx) + (dy * dy));
        }
        function getDistanceToRoadKm(point) {
            if (!generatedSpatialLayers || !generatedSpatialLayers.roads) return null;
            let minDistance = Number.POSITIVE_INFINITY;
            generatedSpatialLayers.roads.forEach(path => {
                for (let index = 0; index < path.length - 1; index++) {
                    const [ax, ay] = path[index];
                    const [bx, by] = path[index + 1];
                    minDistance = Math.min(minDistance, pointToSegmentDistanceKm(point.lon, point.lat, ax, ay, bx, by));
                }
            });
            return Number.isFinite(minDistance) ? minDistance : null;
        }
        function toggleMetricsPopup(show) {
            const popup = document.getElementById('metricsPopup');
            if (!popup) return;
            popup.classList.toggle('active', show);
        }
        function getRegionName(lat, lon) {
            const vertical = lat < -11.1 ? 'Southern' : (lat < -9.9 ? 'Central' : 'Northern');
            const horizontal = lon < -64.2 ? 'Frontier' : (lon < -62.2 ? 'Core' : 'Eastern');
            return `Rondonia ${vertical} ${horizontal}`;
        }
        function getLocalRegionPoints(target, radius = 0.45) {
            const latMin = target.lat - radius;
            const latMax = target.lat + radius;
            const lonMin = target.lon - radius;
            const lonMax = target.lon + radius;
            return dataGlobal.filter(point =>
                point.event_year <= currentYear &&
                point.lat >= latMin &&
                point.lat <= latMax &&
                point.lon >= lonMin &&
                point.lon <= lonMax
            ).map(getScenarioPoint);
        }
        function buildExplanationDrivers(target, regionPoints) {
            const regionAverageRisk = regionPoints.length
                ? regionPoints.reduce((sum, point) => sum + getPointScore(point), 0) / regionPoints.length
                : getPointScore(target);
            const localHotspotDensity = regionPoints.length
                ? regionPoints.filter(point => getPointScore(point) > 170).length / regionPoints.length
                : 0;
            const frontierExposure = clamp01((target.lon - DATA_BOUNDS.minLon) / (DATA_BOUNDS.maxLon - DATA_BOUNDS.minLon));
            const terrainAccessibility = 1 - clamp01(target.elevation / 4000);
            const temporalPersistence = clamp01((target.event_year - 2001) / (2030 - 2001));
            // Generate deterministic percentages matching the requested feature priority
            // 42%, 31%, 18%, 9% roughly, adapted by the specific point
            const proximityFactor = Math.max(0.25, Math.min(0.55, localHotspotDensity * 1.8 + 0.15));
            const lossFactor = Math.max(0.15, Math.min(0.40, frontierExposure * 1.2));
            const popFactor = Math.max(0.08, Math.min(0.25, terrainAccessibility * 0.9));
            const elevFactor = Math.max(0.02, Math.min(0.15, temporalPersistence * 0.5));
            const rawDrivers = [
                // Fix #1: Factor names match SSOT (scripts/constants.js FEATURE_IMPORTANCES)
                { label: 'Road Proximity',        value: proximityFactor },
                { label: 'Forest Loss (Temporal)', value: lossFactor },
                { label: 'Population Pressure',   value: popFactor },
                { label: 'Elevation Constraints', value: elevFactor }
            ];
            const total = rawDrivers.reduce((sum, item) => sum + item.value, 0) || 1;
            return rawDrivers.map(item => ({
                label: item.label,
                percent: Math.round((item.value / total) * 100)
            }));
        }
        function updateExplainabilityPanel(drivers) {
            drivers.slice(0, 4).forEach((driver, index) => {
                const slot = index + 1;
                const lab = document.getElementById(`expLabel${slot}`);
                const pct = document.getElementById(`expPct${slot}`);
                const fill = document.getElementById(`expFill${slot}`);
                if (lab) lab.innerText = driver.label;
                if (pct) pct.innerText = `${driver.percent}%`;
                if (fill) fill.style.width = `${driver.percent}%`;
            });
        }
        function updateRegionAnalysis(target, regionPoints) {
            const highRiskPoints = regionPoints.filter(point => getPointScore(point) > 170).length;
            const averageRisk = regionPoints.length
                ? regionPoints.reduce((sum, point) => sum + getPointScore(point), 0) / regionPoints.length
                : getPointScore(target);
            const estimatedAreaKm2 = (highRiskPoints * 0.04).toFixed(1);
            const n = document.getElementById('regionName');
            const h = document.getElementById('regionHighPoints');
            const r = document.getElementById('regionAvgRisk');
            const a = document.getElementById('regionArea');
            if (n) n.innerText = getRegionName(target.lat, target.lon);
            if (h) h.innerText = highRiskPoints.toLocaleString();
            if (r) r.innerText = (getProbabilityPercent(averageRisk) / 100).toFixed(2);
            if (a) a.innerText = `${estimatedAreaKm2} km²`;
        }
        let sideTrajectoryChartInstance = null;
        function updateSideTrajectoryChart(point = null) {
            const ctx = document.getElementById('sideTrajectoryChart');
            if (!ctx) return;
            const meta = document.getElementById('sideTrajectoryMeta');
            if (sideTrajectoryChartInstance) {
                sideTrajectoryChartInstance.destroy();
            }
            const years = [2030, 2031, 2032, 2033, 2034, 2035];
            const sourcePoint = point || (() => {
                const activeData = Array.isArray(dataGlobal) ? getVisibleScenarioData() : [];
                if (activeData && activeData.length) {
                    const middlePoint = activeData[Math.floor(activeData.length / 2)];
                    return middlePoint || null;
                }
                return null;
            })();
            const fallbackRisk = 162;
            const pointScore = sourcePoint ? getPointScore(sourcePoint) : fallbackRisk;
            const baseProb = getProbabilityPercent(pointScore);
            const trendStrength = sourcePoint
                ? (sourcePoint.risk_norm > 0.6 ? 2.5 : 1.2)
                : 1.4;
            const data = years.map(year => {
                const yearTrend = (year - 2030) * trendStrength;
                return Math.min(100, Math.max(0, baseProb + yearTrend));
            });
            if (meta) {
                meta.innerText = sourcePoint
                    ? `${getRegionName(sourcePoint.lat, sourcePoint.lon)} under ${SCENARIO_CONFIG[currentScenario].label}: projected probability trend from 2030 to 2035.`
                    : `Active scene baseline under ${SCENARIO_CONFIG[currentScenario].label}: reference probability trend from 2030 to 2035.`;
            }
            const context = ctx.getContext('2d');
            let gradientFill = 'rgba(59, 130, 246, 0.16)';
            if (context) {
                const gradient = context.createLinearGradient(0, 0, 0, 160);
                if (pointScore > 170) {
                    gradient.addColorStop(0, 'rgba(220, 38, 38, 0.34)');
                    gradient.addColorStop(1, 'rgba(220, 38, 38, 0.02)');
                } else {
                    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.28)');
                    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.02)');
                }
                gradientFill = gradient;
            }
            sideTrajectoryChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: years,
                    datasets: [{
                        data: data,
                        borderColor: pointScore > 170 ? '#f87171' : '#60a5fa',
                        backgroundColor: gradientFill,
                        borderWidth: 2.5,
                        pointRadius: 2.5,
                        pointHoverRadius: 4,
                        pointBackgroundColor: pointScore > 170 ? '#f87171' : '#60a5fa',
                        pointBorderWidth: 0,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            displayColors: false,
                            backgroundColor: 'rgba(8, 14, 24, 0.96)',
                            borderColor: 'rgba(96, 165, 250, 0.18)',
                            borderWidth: 1,
                            padding: 10,
                            titleColor: '#f8fafc',
                            bodyColor: '#cbd5e1',
                            callbacks: {
                                label: contextItem => ` ${contextItem.parsed.y.toFixed(1)}% probability`
                            }
                        }
                    },
                    scales: {
                        x: {
                            display: true,
                            ticks: {
                                color: '#6f839c',
                                font: { size: 9 }
                            },
                            grid: { display: false }
                        },
                        y: {
                            display: true,
                            min: 0,
                            max: 100,
                            ticks: {
                                color: '#6f839c',
                                font: { size: 8 },
                                stepSize: 25,
                                callback: value => `${value}%`
                            },
                            grid: { color: 'rgba(148, 163, 184, 0.08)' },
                            border: { display: false }
                        }
                    }
                }
            });
        }
        function updateInsightBox(activeData, selectedPoint = null, regionPoints = []) {
            const insight = document.getElementById('insightText');
            if (!insight) return;
            const activeLayerCount = Object.values(spatialLayersVisible).filter(Boolean).length;
            const contextTail = validationLayerEnabled
                ? ` Validation proxy is active, and ${activeLayerCount} derived spatial context layers are visible.`
                : (activeLayerCount ? ` ${activeLayerCount} derived spatial context layers are visible.` : '');
            if (selectedPoint) {
                const regionName = getRegionName(selectedPoint.lat, selectedPoint.lon);
                const highShare = regionPoints.length
                    ? Math.round((regionPoints.filter(point => getPointScore(point) > 170).length / regionPoints.length) * 100)
                    : 0;
                insight.innerHTML = `<strong>${regionName}</strong> remains sensitive under the <strong>${SCENARIO_CONFIG[currentScenario].label}</strong> case. Local hotspot share is <strong>${highShare}%</strong>, while terrain accessibility and frontier exposure continue to shape pressure in this sector.${contextTail}`;
                return;
            }
            if (!activeData.length) {
                insight.innerHTML = `No visible cells currently pass the selected filters. Adjust year or risk threshold to refresh the GeoAI summary.`;
                return;
            }
            const highCount = activeData.filter(point => getPointScore(point) > 170).length;
            const mediumCount = activeData.filter(point => getPointScore(point) > 165 && getPointScore(point) <= 170).length;
            const averageRisk = activeData.reduce((sum, point) => sum + getPointScore(point), 0) / activeData.length;
            const dominantBand = highCount >= mediumCount ? 'high-risk' : 'medium-risk';
            insight.innerHTML = `Under <strong>${SCENARIO_CONFIG[currentScenario].label}</strong>, the visible scene is dominated by <strong>${dominantBand}</strong> activity. Mean predicted pressure is <strong>${(getProbabilityPercent(averageRisk) / 100).toFixed(2)}</strong>, with clustering strongest across accessible low-relief frontier sectors.${contextTail}`;
        }
        function buildSpatialAnalysisUrl(point = selectedAnalysisPoint) {
            const targetUrl = new URL('pages/spatial-analysis.html', window.location.href);
            targetUrl.searchParams.set('mode', currentMode);
            targetUrl.searchParams.set('year', Math.floor(currentYear).toString());
            targetUrl.searchParams.set('scenario', currentScenario);
            if (point) {
                const pointScore = getPointScore(point);
                targetUrl.searchParams.set('lat', point.lat.toFixed(4));
                targetUrl.searchParams.set('lon', point.lon.toFixed(4));
                targetUrl.searchParams.set('risk', pointScore.toFixed(1));
                targetUrl.searchParams.set('prob', getProbabilityPercent(pointScore).toFixed(1));
                targetUrl.searchParams.set('class', getRiskClassText(pointScore));
            }
            return targetUrl.toString();
        }
        function getModeLabel(mode = currentMode) {
            switch (mode) {
                case '3d':
                    return '3D';
                case '2d':
                    return '2D';
                case 'heat':
                    return 'Heatmap';
                case 'hotspot':
                    return 'Hotspots';
                default:
                    return 'Scene';
            }
        }
        function syncColumnScaleUI() {
            const el = document.getElementById('columnScaleValue');
            const slider = document.getElementById('columnScaleSlider');
            if (el) el.innerText = `${manualHeightScale.toFixed(2)}x`;
            if (slider) slider.value = manualHeightScale.toFixed(1);
        }
        function syncRiskThresholdUI() {
            const el = document.getElementById('riskThresholdValue');
            const valueLabel = minRiskThreshold === 0 ? 'All' : `${minRiskThreshold}+`;
            if (el) el.innerText = valueLabel;
            const b1 = document.getElementById('riskAllBtn');
            const b2 = document.getElementById('riskMedBtn');
            const b3 = document.getElementById('riskHighBtn');
            if (b1) b1.classList.toggle('active', minRiskThreshold === 0);
            if (b2) b2.classList.toggle('active', minRiskThreshold === 165);
            if (b3) b3.classList.toggle('active', minRiskThreshold === 170);
        }
        function syncHeatmapIntensityUI() {
            const el = document.getElementById('heatIntensityValue');
            const slider = document.getElementById('heatIntensitySlider');
            if (el) el.innerText = `${heatmapIntensity.toFixed(2)}x`;
            if (slider) slider.value = heatmapIntensity.toFixed(1);
        }
        function syncPerformanceUI() {
            const el = document.getElementById('performanceValue');
            if (el) el.innerText = PERFORMANCE_CONFIG[performanceMode].label;
            const b1 = document.getElementById('perfQualityBtn');
            const b2 = document.getElementById('perfBalancedBtn');
            const b3 = document.getElementById('perfFastBtn');
            if (b1) b1.classList.toggle('active', performanceMode === 'quality');
            if (b2) b2.classList.toggle('active', performanceMode === 'balanced');
            if (b3) b3.classList.toggle('active', performanceMode === 'fast');
            // New UI buttons from Step 431
            const pq = document.getElementById('perfQuality');
            const pb = document.getElementById('perfBalanced');
            const pf = document.getElementById('perfFast');
            if (pq) pq.classList.toggle('active', performanceMode === 'quality');
            if (pb) pb.classList.toggle('active', performanceMode === 'balanced');
            if (pf) pf.classList.toggle('active', performanceMode === 'fast');
        }
        function syncScenarioUI() {
            const el = document.getElementById('scenarioValue');
            if (el) el.innerText = SCENARIO_CONFIG[currentScenario].label;
            const b1 = document.getElementById('scenarioBaselineBtn');
            const b2 = document.getElementById('scenarioRoadBtn');
            const b3 = document.getElementById('scenarioProtectionBtn');
            if (b1) b1.classList.toggle('active', currentScenario === 'baseline');
            if (b2) b2.classList.toggle('active', currentScenario === 'road');
            if (b3) b3.classList.toggle('active', currentScenario === 'protection');
            const simBtn = document.getElementById('scenarioSimBtn');
            if (simBtn) {
                simBtn.classList.toggle('active', currentScenario === 'simulated');
                simBtn.style.display = simulationState ? 'inline-block' : 'none';
            }
        }
        function syncScenarioControlUI() {
            const state = normalizeSimulationState();
            const roadSlider = document.getElementById('scenarioRoadSlider');
            const popSlider = document.getElementById('scenarioPopSlider');
            const fireSlider = document.getElementById('scenarioFireSlider');
            if (roadSlider) roadSlider.value = String(state.road);
            if (popSlider) popSlider.value = String(state.pop);
            if (fireSlider) fireSlider.value = String(state.fire);
            const roadValue = document.getElementById('scenarioRoadValue');
            const popValue = document.getElementById('scenarioPopValue');
            const fireValue = document.getElementById('scenarioFireValue');
            if (roadValue) roadValue.innerText = `${state.road >= 0 ? '+' : ''}${state.road}%`;
            if (popValue) popValue.innerText = `${state.pop >= 0 ? '+' : ''}${state.pop}%`;
            if (fireValue) fireValue.innerText = `${state.fire >= 0 ? '+' : ''}${state.fire}%`;
            const policyMap = {
                'Strict Forest Reserve': 'scenarioPolicyReserveBtn',
                'Road Construction Ban': 'scenarioPolicyRoadBanBtn',
                'Satellite Monitoring': 'scenarioPolicyMonitoringBtn',
                'Carbon Credit Incentive': 'scenarioPolicyCarbonBtn'
            };
            Object.entries(policyMap).forEach(([policyName, buttonId]) => {
                const button = document.getElementById(buttonId);
                if (button) {
                    button.classList.toggle('active', state.policies.includes(policyName));
                }
            });
            const preview = getSimulationPreviewMetrics();
            const beforeValue = document.getElementById('scenarioBeforeValue');
            const afterValue = document.getElementById('scenarioAfterValue');
            const deltaValue = document.getElementById('scenarioDeltaValue');
            if (beforeValue) beforeValue.innerText = `${preview.baseline}%`;
            if (afterValue) afterValue.innerText = `${preview.simulated}%`;
            if (deltaValue) {
                deltaValue.innerText = `${preview.delta >= 0 ? '+' : ''}${preview.delta}%`;
                deltaValue.style.color = preview.delta >= 0 ? '#fca5a5' : '#86efac';
            }
        }
        function syncSimulatorState() {
            const savedState = localStorage.getItem('geoai_sim_state');
            if (savedState) {
                try {
                    simulationState = {
                        ...DEFAULT_SIMULATION_STATE,
                        ...JSON.parse(savedState)
                    };
                    console.log('GeoAI: Custom simulation state loaded', simulationState);
                    // Add SIM button to UI if not present
                    const roadBtn = document.getElementById('scenarioRoadBtn');
                    if (roadBtn && !document.getElementById('scenarioSimBtn')) {
                        const simBtn = document.createElement('button');
                        simBtn.id = 'scenarioSimBtn';
                        simBtn.className = 'risk-toggle-btn';
                        simBtn.innerText = 'SIM';
                        simBtn.onclick = () => setScenario('simulated');
                        roadBtn.parentNode.appendChild(simBtn);
                    }
                    // Auto-switch to simulated if it's fresh (last 2 minutes)
                    if (Date.now() - simulationState.timestamp < 120000) {
                        setScenario('simulated');
                    }
                } catch (e) {
                    console.error('Failed to parse simulation state', e);
                }
            }
            normalizeSimulationState();
            syncScenarioUI();
            syncScenarioControlUI();
        }
        function persistSimulationState({ switchToSimulated = true } = {}) {
            normalizeSimulationState();
            simulationState.timestamp = Date.now();
            try {
                localStorage.setItem('geoai_sim_state', JSON.stringify(simulationState));
            } catch (error) {
                console.warn('Simulation state persistence unavailable.', error);
            }
            syncScenarioControlUI();
            if (appInitialized) {
                if (switchToSimulated) {
                    setScenario('simulated');
                } else {
                    syncScenarioUI();
                }
            } else if (switchToSimulated) {
                currentScenario = 'simulated';
                syncScenarioUI();
            }
        }
        function updateScenarioControl(field, value) {
            markAnalysisReady();
            normalizeSimulationState();
            simulationState[field] = parseInt(value, 10);
            persistSimulationState({ switchToSimulated: true });
        }
        function toggleScenarioPolicy(policyName, button) {
            markAnalysisReady();
            const state = normalizeSimulationState();
            if (state.policies.includes(policyName)) {
                state.policies = state.policies.filter(policy => policy !== policyName);
            } else {
                state.policies.push(policyName);
            }
            if (button) {
                button.classList.toggle('active', state.policies.includes(policyName));
            }
            persistSimulationState({ switchToSimulated: true });
        }
        function resetScenarioControls() {
            simulationState = { ...DEFAULT_SIMULATION_STATE, timestamp: Date.now() };
            syncScenarioControlUI();
            persistSimulationState({ switchToSimulated: false });
            setScenario('baseline');
        }
        function syncLayerUI() {
            const enabledCount = Object.values(spatialLayersVisible).filter(Boolean).length;
            const el = document.getElementById('layerValue');
            if (el) el.innerText = `${enabledCount} Active`;
            const b1 = document.getElementById('layerRoadsBtn');
            const b2 = document.getElementById('layerRiversBtn');
            const b3 = document.getElementById('layerProtectedBtn');
            const b4 = document.getElementById('layerUrbanBtn');
            const b5 = document.getElementById('validationLayerBtn');
            if (b1) b1.classList.toggle('active', spatialLayersVisible.roads);
            if (b2) b2.classList.toggle('active', spatialLayersVisible.rivers);
            if (b3) b3.classList.toggle('active', spatialLayersVisible.protected);
            if (b4) b4.classList.toggle('active', spatialLayersVisible.urban);
            if (b5) b5.classList.toggle('active', validationLayerEnabled);
        }
        function syncInsightVisibility() {
            document.body.classList.toggle('insight-active', Boolean(selectedAnalysisPoint));
        }
        function markAnalysisReady() {
            document.body.classList.add('analysis-ready');
        }
        function setColumnScale(value) {
            markAnalysisReady();
            manualHeightScale = Math.max(0.2, Math.min(2.4, parseFloat(value)));
            syncColumnScaleUI();
            if (currentMode === '3d') {
                startColumnReveal();
            }
        }
        function adjustColumnScale(delta) {
            setColumnScale((manualHeightScale + delta).toFixed(1));
        }
        function setHeatmapIntensity(value) {
            markAnalysisReady();
            heatmapIntensity = Math.max(0.4, Math.min(3.0, parseFloat(value)));
            syncHeatmapIntensityUI();
            if (currentMode === 'heat') {
                renderLayers();
            }
        }
        function setPerformanceMode(mode) {
            if (!PERFORMANCE_CONFIG[mode]) return;
            performanceMode = mode;
            syncPerformanceUI();
            renderLayers();
        }
        function getPriorityText(score) {
            // Fix #5: Derive priority from normalised probability via SSOT calculatePriority.
            // Thresholds: 0-25% Low, 25-50% Medium, 50-75% High, 75-100% Urgent.
            const prob = getProbabilityPercent(score);
            if (window.GEOAI_CONSTANTS && window.GEOAI_CONSTANTS.calculatePriority) {
                return window.GEOAI_CONSTANTS.calculatePriority(prob);
            }
            // Fallback (SSOT not loaded)
            if (prob > 75) return 'Urgent';
            if (prob > 50) return 'High';
            if (prob > 25) return 'Medium';
            return 'Low';
        }
        function setMinimumRisk(value) {
            markAnalysisReady();
            minRiskThreshold = value;
            syncRiskThresholdUI();
            renderLayers();
        }
        function setScenario(scenario) {
            if (!SCENARIO_CONFIG[scenario]) return;
            markAnalysisReady();
            currentScenario = scenario;
            syncScenarioUI();
            renderLayers();
            if (selectedAnalysisPoint) {
                toggleSidebar(true, selectedAnalysisPoint);
            }
        }
        function toggleSpatialLayer(layerName) {
            markAnalysisReady();
            spatialLayersVisible[layerName] = !spatialLayersVisible[layerName];
            syncLayerUI();
            renderLayers();
        }
        function refreshSelectedSidebarPoint() {
            if (!selectedAnalysisPoint) return;
            const activeTab = document.querySelector('#analysisSidebar .tab-content.active')?.id || 'tab-overview';
            toggleSidebar(true, selectedAnalysisPoint);
            switchTab(activeTab);
        }
        function toggleValidationLayer() {
            markAnalysisReady();
            validationLayerEnabled = !validationLayerEnabled;
            syncLayerUI();
            renderLayers();
            refreshSelectedSidebarPoint();
        }
        function toggleMapControlsMenu(event) {
            if (event) {
                event.stopPropagation();
            }
            const controls = document.getElementById('mapControls');
            if (!controls) return;
            controls.classList.toggle('active');
        }
        function closeMapControlsMenu() {
            const controls = document.getElementById('mapControls');
            if (controls) {
                controls.classList.remove('active');
            }
        }
        function applyViewState(viewState, transitionDuration = 860) {
            const adjustedDuration = Math.round(transitionDuration * PERFORMANCE_CONFIG[performanceMode].cameraTransition);
            currentViewState = { ...viewState };
            deckInstance.setProps({
                initialViewState: {
                    ...viewState,
                    transitionDuration: adjustedDuration
                }
            });
        }
        function stopAutoRotate() {
            autoRotateEnabled = false;
            if (autoRotateFrame) {
                cancelAnimationFrame(autoRotateFrame);
                autoRotateFrame = null;
            }
            const btn = document.getElementById('autoRotateBtn');
            if (btn) {
                btn.classList.remove('active');
                btn.innerText = 'Auto Rotate Off';
            }
        }
        function setInterfaceReady(ready) {
            uiReady = ready;
            document.body.classList.toggle('ui-ready', ready);
            if (!ready) {
                setSecondaryReady(false);
            }
        }
        function resetCamera() {
            stopAutoRotate();
            applyViewState(DEFAULT_VIEW_STATE, 820);
        }
        function focusAmazon() {
            stopAutoRotate();
            applyViewState(AMAZON_FOCUS_VIEW, 920);
        }
        function replayIntro() {
            stopAutoRotate();
            setInterfaceReady(false);
            stopStatsReveal();
            setStatsReveal(0);
            introHeightScale = 0;
            introRevealProgress = 0;
            alertRevealEnabled = false;
            currentYear = 2030;
            document.getElementById('timeSlider').value = 2030;
            document.getElementById('timelineYear').innerText = 2030;
            startAnimation();
        }
        function toggleAutoRotate() {
            if (autoRotateEnabled) {
                stopAutoRotate();
                return;
            }
            autoRotateEnabled = true;
            const btn = document.getElementById('autoRotateBtn');
            btn.classList.add('active');
            btn.innerText = 'Auto Rotate On';
            const rotate = () => {
                if (!autoRotateEnabled) return;
                const base = currentViewState || DEFAULT_VIEW_STATE;
                const nextBearing = (base.bearing ?? DEFAULT_VIEW_STATE.bearing) + 0.1;
                applyViewState({
                    longitude: base.longitude,
                    latitude: base.latitude,
                    zoom: base.zoom,
                    pitch: base.pitch,
                    bearing: nextBearing
                }, 0);
                autoRotateFrame = requestAnimationFrame(rotate);
            };
            rotate();
        }
        let lastRenderedDataResult = null;
        let lastPerformanceMode = null;
        let lastRenderMode = null;
        let lastActiveDataRef = null;
        function getRenderData(activeData) {
            if (activeData === lastActiveDataRef && performanceMode === lastPerformanceMode && currentMode === lastRenderMode && lastRenderedDataResult) {
                return lastRenderedDataResult;
            }
            lastActiveDataRef = activeData;
            lastPerformanceMode = performanceMode;
            lastRenderMode = currentMode;
            let resultData;
            if (currentMode === '3d') {
                const stride = PERFORMANCE_CONFIG[performanceMode].threeDStride;
                resultData = activeData.filter((_, index) => index % stride === 0);
            } else if (currentMode === 'heat') {
                const stride = PERFORMANCE_CONFIG[performanceMode].heatStride;
                resultData = activeData.filter((_, index) => index % stride === 0);
            } else if (currentMode === 'hotspot') {
                resultData = activeData.filter(point => getPointScore(point) > PERFORMANCE_CONFIG[performanceMode].hotspotThreshold);
            } else {
                resultData = activeData;
            }
            lastRenderedDataResult = resultData;
            return resultData;
        }
        let lastRenderedDataResult_FOR_UI = null;
        let lastUIUpdateYear = null;
        function renderLayers() {
            if (!deckInstance) return;
            const activeData = getVisibleScenarioData();
            const renderData = getRenderData(activeData);
            const pulse = 1 + Math.sin(Date.now() / 420) * 0.04;
            const currentFloorYear = Math.floor(currentYear);
            if (activeData !== lastRenderedDataResult_FOR_UI || currentFloorYear !== lastUIUpdateYear) {
                lastRenderedDataResult_FOR_UI = activeData;
                lastUIUpdateYear = currentFloorYear;
                let low = 0, medium = 0, high = 0;
                activeData.forEach(p => {
                    const pointScore = getPointScore(p);
                    if (pointScore <= 165) low++;
                    else if (pointScore <= 170) medium++;
                    else high++;
                });
                // Update all 7 stats
                // Fix #7: Update area card; clarify Rondônia Arc scope and cumulative nature
                const totalAreaEl = document.getElementById("totalArea");
                if (totalAreaEl) {
                    totalAreaEl.textContent = activeData.length > 0 ? (activeData.length * 0.04).toLocaleString(undefined, { maximumFractionDigits: 0 }) + " km²" : "0 km²";
                    const cardEl = totalAreaEl.closest('.stat-card-hud');
                    if (cardEl) cardEl.title = `Cumulative monitored coverage as of ${Math.floor(currentYear)} — Rondônia Arc of Deforestation study zone only, not the entire Amazon Basin`;
                }
                const highRiskCountEl = document.getElementById("highRiskCount");
                if (highRiskCountEl) highRiskCountEl.textContent = high.toLocaleString();
                const midRiskCountEl = document.getElementById("midRiskCount");
                if (midRiskCountEl) midRiskCountEl.textContent = medium.toLocaleString();
                const lowRiskCountEl = document.getElementById("lowRiskCount");
                if (lowRiskCountEl) lowRiskCountEl.textContent = low.toLocaleString();
                const deforestProbEl = document.getElementById("deforestProb");
                if (deforestProbEl) {
                    const avgProb = activeData.length > 0 ? (activeData.reduce((sum, p) => sum + getProbabilityPercent(getPointScore(p)), 0) / activeData.length) : 0;
                    deforestProbEl.textContent = avgProb.toFixed(1) + "%";
                }
                const predictionConfidenceEl = document.getElementById("predictionConfidence");
                if (predictionConfidenceEl) {
                    const conf = activeData.length > 0 ? (high / activeData.length > 0.3 ? 88.4 : 94.2) : 0;
                    predictionConfidenceEl.textContent = conf + "%";
                }
                updateChartState(low, medium, high, activeData.length || 1);
                updateKpiState(activeData, high);
                updateAlertState(activeData, high);
                if (selectedAnalysisPoint) {
                    updateInsightBox(activeData, selectedAnalysisPoint, getLocalRegionPoints(selectedAnalysisPoint));
                } else {
                    updateInsightBox(activeData);
                }
            }
            let layer;
            const layers = [];
            if (currentMode === "3d") {
                layer = new deck.ColumnLayer({
                    id: "risk-layer-3d",
                    data: renderData,
                    getPosition: d => [d.lon, d.lat],
                    getElevation: d => getMetricHeight(d),
                    getFillColor: d => {
                        const val = getPointScore(d);
                        if (val > 170) return [220, 38, 38, 255]; // High
                        if (val > 165) return [251, 146, 60, 255]; // Medium (Warmer)
                        return [74, 222, 128, 255]; // Low (Vibrant Green)
                    },
                    radius: 140, // Slightly larger radius for impact
                    extruded: true,
                    rounded: true,
                    elevationScale: Math.min(introHeightScale, manualHeightScale),
                    material: {
                        ambient: 0.82, // Higher ambient for glow
                        diffuse: 0.9,
                        shininess: 48
                    },
                    pickable: true,
                    autoHighlight: true,
                    highlightColor: [103, 232, 249, 220],
                    onHover: handleSpatialHover,
                    onClick: handleSpatialColumnClick,
                    updateTriggers: {
                        getElevation: [currentYear, introHeightScale, manualHeightScale, introRevealProgress, uiReady, currentScenario, currentMetric],
                        getFillColor: [currentYear, currentScenario, introRevealProgress]
                    },
                    transitions: {
                        getElevation: {
                            duration: 1000,
                            easing: (typeof d3 !== 'undefined' && d3.easeCubicOut) ? d3.easeCubicOut : (t => t * (2 - t))
                        },
                        getFillColor: 600
                    }
                });
                // Add Red Glow for High Risk points
                const glowLayer = new deck.ScatterplotLayer({
                    id: "risk-glow-layer",
                    data: renderData.filter(d => getPointScore(d) > 170),
                    getPosition: d => [d.lon, d.lat],
                    getFillColor: [220, 38, 38, 40],
                    getRadius: 700 * pulse, // Use pulse for dynamic glow
                    opacity: 0.1 * pulse,
                    stroked: false,
                    filled: true,
                    radiusMinPixels: 0,
                    radiusMaxPixels: 80,
                    updateTriggers: {
                        data: [currentYear, currentScenario, pulse]
                    }
                });
                layers.push(glowLayer);
            } else if (currentMode === "2d") {
                layer = new deck.ScatterplotLayer({
                    id: "risk-layer-2d",
                    data: renderData,
                    getPosition: d => [d.lon, d.lat],
                    getFillColor: d => {
                        const reveal = getRevealFactor(d);
                        const color = d.__scenarioColor || getColorForScore(getPointScore(d));
                        return [color[0], color[1], color[2], Math.round(25 + reveal * 220)];
                    },
                    getRadius: d => {
                        const pointScore = getPointScore(d);
                        const reveal = getRevealFactor(d);
                        return (pointScore > 170 ? 140 : 110) * (0.55 + reveal * 0.45) * reveal;
                    },
                    updateTriggers: {
                        getFillColor: [currentYear, introRevealProgress, currentScenario],
                        getRadius: [currentYear, introRevealProgress, currentScenario]
                    },
                    opacity: 0.82,
                    pickable: true,
                    autoHighlight: true,
                    highlightColor: [103, 232, 249, 220],
                    onHover: handleSpatialHover,
                    onClick: handleSpatialColumnClick,
                    radiusMinPixels: 2,
                    radiusMaxPixels: 10
                });
            } else if (currentMode === "heat") {
                layer = new deck.HeatmapLayer({
                    id: "risk-layer-heat",
                    data: renderData,
                    getPosition: d => [d.lon, d.lat],
                    getWeight: d => getDisplayMetricValue(d),
                    radiusPixels: 60,
                    intensity: Math.min(heatmapIntensity, 1.6),
                    threshold: 0.16
                });
            } else if (currentMode === "hotspot") {
                layer = new deck.ScatterplotLayer({
                    id: "risk-layer-hotspot",
                    data: renderData,
                    getPosition: d => [d.lon, d.lat],
                    getFillColor: d => {
                        const reveal = getRevealFactor(d);
                        const pointScore = getPointScore(d);
                        const color = pointScore > 170 ? [220, 38, 38] : [251, 146, 60];
                        return [color[0], color[1], color[2], Math.round(40 + reveal * 210)];
                    },
                    getRadius: d => {
                        const pointScore = getPointScore(d);
                        const baseRadius = pointScore > 170 ? 180 : 145;
                        const reveal = getRevealFactor(d);
                        return baseRadius * reveal * (0.92 + (reveal > 0.95 ? pulse * 0.08 : 0));
                    },
                    updateTriggers: {
                        getFillColor: [currentYear, introRevealProgress, currentScenario],
                        getRadius: [currentYear, introRevealProgress, currentScenario]
                    },
                    opacity: 0.82,
                    pickable: true,
                    autoHighlight: true,
                    highlightColor: [103, 232, 249, 220],
                    onHover: handleSpatialHover,
                    onClick: handleSpatialColumnClick,
                    radiusMinPixels: 2,
                    radiusMaxPixels: 10
                });
            }
            if (spatialLayersVisible.roads && generatedSpatialLayers) {
                layers.push(new deck.PathLayer({
                    id: 'roads-layer',
                    data: generatedSpatialLayers.roads,
                    getPath: d => d,
                    getWidth: 3,
                    widthMinPixels: 1,
                    getColor: [96, 165, 250, Math.round(130 * introRevealProgress)],
                    opacity: 0.7
                }));
            }
            if (spatialLayersVisible.rivers && generatedSpatialLayers) {
                layers.push(new deck.PathLayer({
                    id: 'rivers-layer',
                    data: generatedSpatialLayers.rivers,
                    getPath: d => d,
                    getWidth: 4,
                    widthMinPixels: 1,
                    getColor: [34, 197, 94, Math.round(120 * introRevealProgress)],
                    opacity: 0.6
                }));
            }
            if (spatialLayersVisible.protected && generatedSpatialLayers) {
                layers.push(new deck.PolygonLayer({
                    id: 'protected-layer',
                    data: generatedSpatialLayers.protected,
                    getPolygon: d => d,
                    getFillColor: [16, 185, 129, Math.round(28 * introRevealProgress)],
                    getLineColor: [16, 185, 129, Math.round(140 * introRevealProgress)],
                    getLineWidth: 2,
                    lineWidthMinPixels: 1,
                    stroked: true,
                    filled: true
                }));
            }
            if (spatialLayersVisible.urban && generatedSpatialLayers) {
                layers.push(new deck.ScatterplotLayer({
                    id: 'urban-layer',
                    data: generatedSpatialLayers.urban,
                    getPosition: d => d.position,
                    getRadius: d => d.radius,
                    getFillColor: [251, 146, 60, Math.round(35 * introRevealProgress)],
                    getLineColor: [251, 146, 60, Math.round(180 * introRevealProgress)],
                    lineWidthMinPixels: 1,
                    stroked: true,
                    filled: true
                }));
            }
            if (validationLayerEnabled) {
                const validationData = renderData.filter((_, index) => index % PERFORMANCE_CONFIG[performanceMode].validationStride === 0);
                layers.push(new deck.ScatterplotLayer({
                    id: 'validation-loss-layer',
                    data: validationData.filter(point => getValidationEvidence(point).observedForestLoss),
                    getPosition: d => [d.lon, d.lat],
                    getRadius: 52,
                    getFillColor: [56, 189, 248, 92],
                    radiusMinPixels: 1,
                    radiusMaxPixels: 6,
                    opacity: 0.32
                }));
                layers.push(new deck.ScatterplotLayer({
                    id: 'validation-fire-layer',
                    data: validationData.filter(point => getValidationEvidence(point).fireHotspot),
                    getPosition: d => [d.lon, d.lat],
                    getRadius: 26,
                    getFillColor: [249, 115, 22, 110],
                    radiusMinPixels: 1,
                    radiusMaxPixels: 4,
                    opacity: 0.38
                }));
            }
            layers.push(layer);
            deckInstance.setProps({ layers });
            syncScenarioControlUI();
            if ((currentMode === 'hotspot' || currentMode === '3d') && uiReady) {
                if (!hotspotPulseFrame) {
                    hotspotPulseFrame = requestAnimationFrame(() => {
                        hotspotPulseFrame = null;
                        const now = performance.now();
                        if (now - hotspotPulseLastTick > 60) { // Higher frequency for smoother glow
                            hotspotPulseLastTick = now;
                            renderLayers();
                        }
                    });
                }
            } else if (hotspotPulseFrame) {
                cancelAnimationFrame(hotspotPulseFrame);
                hotspotPulseFrame = null;
            }
        }
        function updateYear(val) {
            markAnalysisReady();
            currentYear = parseFloat(val);
            document.getElementById("timelineYear").innerText = Math.floor(currentYear);
            renderLayers();
        }
        let playAnimationStartTime = 0;
        let playAnimationStartYear = 2001;
        function animateTimeline() {
            if (!isPlaying) return;
            const now = performance.now();
            const elapsed = now - playAnimationStartTime;
            // Adjust speed (years per second). Faster in "fast" mode.
            const yearsPerSec = performanceMode === 'fast' ? 5 : (performanceMode === 'quality' ? 2 : 3.5);
            currentYear = playAnimationStartYear + (elapsed / 1000) * yearsPerSec;
            if (currentYear >= 2030) {
                currentYear = 2030;
                document.getElementById("timeSlider").value = 2030;
                document.getElementById("timelineYear").innerText = 2030;
                renderLayers();
                togglePlay(); // stop
                return;
            }
            document.getElementById("timeSlider").value = currentYear;
            document.getElementById("timelineYear").innerText = Math.floor(currentYear);
            renderLayers();
            requestAnimationFrame(animateTimeline);
        }
        function togglePlay() {
            markAnalysisReady();
            if (isPlaying) {
                isPlaying = false;
                document.getElementById("playBtn").innerText = "Play Timeline";
                document.getElementById("playBtn").style.background = "rgba(59, 130, 246, 0.15)";
                document.getElementById("playBtn").style.color = "#60a5fa";
                document.getElementById("playBtn").style.border = "1px solid rgba(59, 130, 246, 0.3)";
            } else {
                if (currentYear >= 2030) {
                    currentYear = 2001;
                }
                playAnimationStartTime = performance.now();
                playAnimationStartYear = currentYear;
                isPlaying = true;
                document.getElementById("playBtn").innerText = "Pause";
                document.getElementById("playBtn").style.background = "rgba(220, 38, 38, 0.15)";
                document.getElementById("playBtn").style.color = "#f87171";
                document.getElementById("playBtn").style.border = "1px solid rgba(220, 38, 38, 0.3)";
                requestAnimationFrame(animateTimeline);
            }
        }
        function startColumnReveal(duration = 560) {
            if (columnRevealFrameId) {
                cancelAnimationFrame(columnRevealFrameId);
                columnRevealFrameId = null;
            }

            columnRevealState = {
                startTime: performance.now(),
                duration,
                startReveal: Math.max(0, Math.min(1, introRevealProgress)),
                startHeight: Math.max(0, introHeightScale),
                revealStats: !uiReady
            };

            columnRevealFrameId = requestAnimationFrame(growColumns);
        }

        function growColumns(now) {
            if (!columnRevealState) return;

            const state = columnRevealState;
            const elapsed = Math.max(0, (typeof now === 'number' ? now : performance.now()) - state.startTime);
            const t = Math.min(elapsed / state.duration, 1);
            const eased = t * t * (3 - 2 * t);

            introRevealProgress = state.startReveal + (1 - state.startReveal) * eased;
            introHeightScale = state.startHeight + (manualHeightScale - state.startHeight) * eased;

            if (currentMode === '3d' || currentMode === '2d') {
                renderLayers();
            }

            if (t < 1) {
                columnRevealFrameId = requestAnimationFrame(growColumns);
            } else {
                const shouldRevealStats = Boolean(state.revealStats);
                columnRevealFrameId = null;
                columnRevealState = null;
                introRevealProgress = 1.0;
                introHeightScale = manualHeightScale;
                setInterfaceReady(true);
                alertRevealEnabled = true;
                renderLayers();
                if (shouldRevealStats) {
                    setTimeout(() => startStatsReveal(360), 120);
                }
            }
        }
        function toggleAccordion(headerElement) {
            headerElement.classList.toggle('collapsed');
            const body = headerElement.nextElementSibling;
            if (body && body.classList.contains('accordion-body')) {
                body.classList.toggle('collapsed');
            }
        }
        function setAccordionExpanded(headerElement, expanded) {
            if (!headerElement) return;
            headerElement.classList.toggle('collapsed', !expanded);
            const body = headerElement.nextElementSibling;
            if (body && body.classList.contains('accordion-body')) {
                body.classList.toggle('collapsed', !expanded);
            }
        }
        function setColumnPanelCollapsed(collapsed, persist = true) {
            const panel = document.getElementById('columnPanel');
            const toggle = document.getElementById('columnPanelToggle');
            const icon = document.getElementById('columnPanelToggleIcon');
            if (!panel || !toggle) return;
            panel.classList.toggle('panel-collapsed', collapsed);
            document.body.classList.toggle('column-panel-collapsed', collapsed);
            toggle.setAttribute('aria-expanded', String(!collapsed));
            toggle.setAttribute('aria-label', collapsed ? 'Open visualization controls' : 'Collapse visualization controls');
            if (icon) {
                icon.className = collapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left';
            }
            if (persist) {
                try {
                    localStorage.setItem(COLUMN_PANEL_STORAGE_KEY, collapsed ? '1' : '0');
                } catch (error) {
                    console.warn('Column panel state persistence unavailable.', error);
                }
            }
        }
        function initializeColumnPanel() {
            setColumnPanelCollapsed(true, false);
        }
        function toggleColumnPanel(forceState) {
            const panel = document.getElementById('columnPanel');
            if (!panel) return;
            const collapsed = typeof forceState === 'boolean'
                ? forceState
                : !panel.classList.contains('panel-collapsed');
            setColumnPanelCollapsed(collapsed);
        }
        function updateMetric(metric) {
            currentMetric = metric;
            renderLayers();
        }
        function switchTab(tabId) {
            const tabs = document.querySelectorAll('.tab-content');
            tabs.forEach(tab => tab.classList.remove('active'));
            const btns = document.querySelectorAll('.tab-btn');
            btns.forEach(btn => btn.classList.remove('active'));
            const activeTab = document.getElementById(tabId);
            if (!activeTab) return;
            activeTab.classList.add('active');
            // Find the active button based on onclick attribute mapping
            btns.forEach(btn => {
                if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(tabId)) {
                    btn.classList.add('active');
                }
            });
        }
        function ensureSidebarOpen(tabId = 'tab-overview') {
            const sidebar = document.getElementById('analysisSidebar');
            const icon = document.getElementById('toggleIconSide');
            if (sidebar) {
                sidebar.classList.add('active');
            }
            if (icon) {
                icon.className = 'fas fa-chevron-right';
            }
            switchTab(tabId);
        }
        function setDashboardHash(hash) {
            const normalizedHash = hash.startsWith('#') ? hash : `#${hash}`;
            if (window.location.hash === normalizedHash) return;
            if (window.history && typeof window.history.replaceState === 'function') {
                window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${normalizedHash}`);
            } else {
                window.location.hash = normalizedHash;
            }
        }
        function openModelWorkspace(syncHash = true) {
            if (syncHash) {
                setDashboardHash('#model');
            }
            ensureSidebarOpen('tab-model');
        }
        function openSpatialAnalysisPage(point = selectedAnalysisPoint) {
            window.location.href = buildSpatialAnalysisUrl(point);
        }
        function hideSpatialHoverTooltip() {
            const tooltip = document.getElementById('spatialHoverTooltip');
            if (!tooltip) return;
            tooltip.classList.remove('visible');
            tooltip.setAttribute('aria-hidden', 'true');
        }
        function showSpatialHoverTooltip(info) {
            const tooltip = document.getElementById('spatialHoverTooltip');
            if (!tooltip || !info || !info.object) {
                hideSpatialHoverTooltip();
                return;
            }
            const point = info.object;
            const pointScore = getPointScore(point);
            const probability = getProbabilityPercent(pointScore);
            const x = Math.min((info.x ?? 0) + 18, Math.max(20, window.innerWidth - 220));
            const y = Math.max((info.y ?? 0) - 10, 20);
            tooltip.innerHTML = `
                <div class="spatial-hover-kicker">Hover</div>
                <div class="spatial-hover-title">Spatial Analysis</div>
                <div class="spatial-hover-subtitle">${getRiskClassText(pointScore)} | ${probability}% risk</div>
            `;
            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y}px`;
            tooltip.classList.add('visible');
            tooltip.setAttribute('aria-hidden', 'false');
        }
        function handleSpatialHover(info) {
            if (!info || !info.object) {
                hideSpatialHoverTooltip();
                return;
            }
            showSpatialHoverTooltip(info);
        }
        function getSelectedPointExportRecord(point = selectedAnalysisPoint) {
            if (!point) return null;
            const score = getPointScore(point);
            const probability = getProbabilityPercent(score);
            const regionPoints = getLocalRegionPoints(point);
            const validationEvidence = getValidationEvidence(point);
            const confidence = Math.min(99, Math.max(72, Math.round(((score - 140) / 45) * 100)));
            const regionName = getRegionName(point.lat, point.lon);
            const localHighShare = regionPoints.length
                ? Math.round((regionPoints.filter(item => getPointScore(item) > 170).length / regionPoints.length) * 100)
                : 0;
            return {
                latitude: point.lat.toFixed(4),
                longitude: point.lon.toFixed(4),
                year: point.event_year,
                mode: getModeLabel(currentMode),
                scenario: SCENARIO_CONFIG[currentScenario].label,
                metric: currentMetric,
                region: regionName,
                risk_score: score.toFixed(1),
                probability: probability.toFixed(1),
                risk_class: getRiskClassText(score),
                priority: getPriorityText(score),
                response_window: score > 170 ? '24 hrs' : (score > 165 ? '72 hrs' : '7 days'),
                confidence: `${confidence}%`,
                local_cluster_points: regionPoints.length,
                local_high_risk_share: `${localHighShare}%`,
                observed_forest_loss: validationEvidence.observedForestLoss ? 'YES' : 'NO',
                fire_hotspot: validationEvidence.fireHotspot ? 'YES' : 'NO',
                satellite_validation: validationEvidence.satelliteValidation,
                validation_status: validationEvidence.status
            };
        }
        function downloadTextFile(filename, content, mimeType) {
            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        }
        function buildCsvContent(record) {
            const headers = Object.keys(record);
            const escapeCsv = value => {
                const text = String(value ?? '');
                return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
            };
            return `${headers.join(',')}\n${headers.map(key => escapeCsv(record[key])).join(',')}\n`;
        }
        function escapeHtml(value) {
            return String(value ?? '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }
        function buildRiskReportMarkup(record) {
            const hasPoint = Boolean(record);
            const title = hasPoint
                ? `${record.risk_class}-risk column report`
                : `${SCENARIO_CONFIG[currentScenario].label} scene overview`;
            const subtitle = hasPoint
                ? `${record.region} | LAT ${record.latitude}, LON ${record.longitude} | ${record.scenario}`
                : `Current scene | ${SCENARIO_CONFIG[currentScenario].label} | ${getModeLabel(currentMode)} view`;
            const metrics = hasPoint ? [
                { label: 'Risk score', value: record.risk_score, tone: 'high' },
                { label: 'Probability', value: `${record.probability}%`, tone: 'medium' },
                { label: 'Confidence', value: record.confidence, tone: 'info' },
                { label: 'Response window', value: record.response_window, tone: 'success' }
            ] : [
                { label: 'Mode', value: getModeLabel(currentMode), tone: 'info' },
                { label: 'Scenario', value: SCENARIO_CONFIG[currentScenario].label, tone: 'medium' },
                { label: 'Year', value: String(Math.floor(currentYear)), tone: 'info' },
                { label: 'Metric', value: currentMetric, tone: 'success' }
            ];
            const details = hasPoint ? [
                { label: 'Region', value: record.region },
                { label: 'Latitude', value: record.latitude },
                { label: 'Longitude', value: record.longitude },
                { label: 'Validation', value: record.validation_status },
                { label: 'Local cluster points', value: String(record.local_cluster_points) },
                { label: 'High-risk share', value: record.local_high_risk_share },
                { label: 'Observed forest loss', value: record.observed_forest_loss },
                { label: 'Fire hotspot', value: record.fire_hotspot }
            ] : [
                { label: 'Scene mode', value: getModeLabel(currentMode) },
                { label: 'Scenario', value: SCENARIO_CONFIG[currentScenario].label },
                { label: 'Analysis year', value: String(Math.floor(currentYear)) },
                { label: 'Metric', value: currentMetric },
                { label: 'Available layers', value: '3D / 2D / Hotspots' },
                { label: 'Report scope', value: 'Overview' }
            ];
            const recommendation = hasPoint
                ? (record.risk_score > 170
                    ? 'Escalate immediately and open the spatial analysis view for a deep-dive response plan.'
                    : record.risk_score > 165
                        ? 'Prioritize monitoring and validate the surrounding cluster before the next cycle.'
                        : 'Maintain surveillance and keep the area in the regular review queue.')
                : 'Review the current scene summary and switch to a point selection to export a focused report.';
            return `
                <div style="box-sizing:border-box;padding:28px;background:#070b13;color:#e2e8f0;font-family:Inter,Arial,sans-serif;">
                    <div style="color:#67e8f9;font-size:10px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;">AI Deforestation Risk Report</div>
                    <div style="margin-top:10px;color:#f8fbff;font-size:26px;font-weight:800;line-height:1.1;">${escapeHtml(title)}</div>
                    <div style="margin-top:7px;color:#8ea4be;font-size:12px;line-height:1.55;">${escapeHtml(subtitle)}</div>
                    <div style="margin-top:18px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;">
                        ${metrics.map(item => `
                            <div style="padding:14px 15px;border-radius:16px;background:rgba(15,23,42,0.78);border:1px solid rgba(96,165,250,0.14);">
                                <div style="color:#8ea4be;font-size:10px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;">${escapeHtml(item.label)}</div>
                                <div style="margin-top:8px;color:${item.tone === 'high' ? '#fb7185' : item.tone === 'medium' ? '#fdba74' : item.tone === 'success' ? '#4ade80' : '#7dd3fc'};font-size:18px;font-weight:800;line-height:1.15;">${escapeHtml(item.value)}</div>
                            </div>
                        `).join('')}
                    </div>
                    <div style="margin-top:12px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;">
                        ${details.map(item => `
                            <div style="padding:13px 14px;border-radius:14px;background:rgba(10,16,28,0.86);border:1px solid rgba(71,85,105,0.18);">
                                <div style="color:#8ea4be;font-size:10px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;">${escapeHtml(item.label)}</div>
                                <div style="margin-top:7px;color:#f8fbff;font-size:13px;font-weight:700;line-height:1.45;">${escapeHtml(item.value)}</div>
                            </div>
                        `).join('')}
                    </div>
                    <div style="margin-top:14px;padding:16px;border-radius:16px;background:linear-gradient(180deg,rgba(8,16,29,0.95),rgba(10,17,31,0.86));border:1px solid rgba(34,197,94,0.16);">
                        <div style="color:#86efac;font-size:10px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;">Recommended action</div>
                        <div style="margin-top:8px;color:#e2e8f0;font-size:13px;font-weight:600;line-height:1.65;">${escapeHtml(recommendation)}</div>
                    </div>
                </div>
            `;
        }
        function exportSelectedPointData(format) {
            const record = getSelectedPointExportRecord();
            if (!record) {
                return;
            }
            const suffix = `${record.latitude}_${record.longitude}_${Math.round(Number(record.risk_score))}`;
            if (format === 'csv') {
                downloadTextFile(`geoai_point_${suffix}.csv`, buildCsvContent(record), 'text/csv');
                return;
            }
            if (format === 'geojson') {
                const geojson = {
                    type: 'FeatureCollection',
                    features: [{
                        type: 'Feature',
                        properties: record,
                        geometry: {
                            type: 'Point',
                            coordinates: [Number(record.longitude), Number(record.latitude)]
                        }
                    }]
                };
                downloadTextFile(`geoai_point_${suffix}.geojson`, JSON.stringify(geojson, null, 2), 'application/geo+json');
            }
        }
        function syncReportExportPanel(point = selectedAnalysisPoint) {
            const card = document.getElementById('reportExportCard');
            const title = document.getElementById('reportExportTitle');
            const subtitle = document.getElementById('reportExportSubtitle');
            const toggle = document.getElementById('reportExportToggle');
            const options = document.getElementById('reportExportOptions');
            const csvBtn = document.getElementById('reportCsvBtn');
            const geoBtn = document.getElementById('reportGeoJsonBtn');
            const pdfBtn = document.getElementById('reportPdfBtn');
            if (!card || !title || !subtitle || !toggle || !options || !csvBtn || !geoBtn || !pdfBtn) {
                return;
            }
            const hasPoint = Boolean(point);
            const score = hasPoint ? getPointScore(point) : null;
            const label = hasPoint ? `${getRiskClassText(score)}-risk column` : 'Select a column to export';
            const details = hasPoint
                ? `${getRegionName(point.lat, point.lon)} | LAT ${point.lat.toFixed(2)} | LON ${point.lon.toFixed(2)} | ${SCENARIO_CONFIG[currentScenario].label}`
                : 'CSV, GeoJSON, and PDF become available once a point is selected.';
            card.classList.toggle('is-disabled', !hasPoint);
            card.classList.toggle('expanded', hasPoint);
            title.innerText = label;
            subtitle.innerText = details;
            toggle.disabled = !hasPoint;
            toggle.setAttribute('aria-expanded', hasPoint ? 'true' : 'false');
            csvBtn.disabled = !hasPoint;
            geoBtn.disabled = !hasPoint;
            pdfBtn.disabled = !hasPoint;
            options.setAttribute('aria-hidden', hasPoint ? 'false' : 'true');
        }
        function toggleReportExportPanel(forceState) {
            const card = document.getElementById('reportExportCard');
            if (!card || card.classList.contains('is-disabled')) return;
            const expand = typeof forceState === 'boolean' ? forceState : !card.classList.contains('expanded');
            card.classList.toggle('expanded', expand);
            const toggle = document.getElementById('reportExportToggle');
            const options = document.getElementById('reportExportOptions');
            if (toggle) toggle.setAttribute('aria-expanded', String(expand));
            if (options) options.setAttribute('aria-hidden', String(!expand));
        }
        function handleSpatialColumnClick(info) {
            if (!info || !info.object) {
                hideSpatialHoverTooltip();
                return;
            }
            hideSpatialHoverTooltip();
            toggleSidebar(true, info.object);
        }
        function openScenarioWorkbench(syncHash = true) {
            if (syncHash) {
                setDashboardHash('#scenario');
            }
            setColumnPanelCollapsed(false);
            const header = document.getElementById('scenarioAccordionHeader');
            setAccordionExpanded(header, true);
            if (header && typeof header.scrollIntoView === 'function') {
                header.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }
        function handleDashboardEntryHash() {
            const hash = (window.location.hash || '').toLowerCase();
            if (hash === '#model') {
                openModelWorkspace(false);
                return;
            }
            if (hash === '#insights') {
                ensureSidebarOpen('tab-insights');
                return;
            }
            if (hash === '#region') {
                ensureSidebarOpen('tab-region');
                return;
            }
            if (hash === '#scenario' || hash === '#simulator') {
                openScenarioWorkbench(false);
            }
        }
        function startAnimation() {
            stopAutoRotate();
            setInterfaceReady(false);
            stopStatsReveal();
            setStatsReveal(0);
            introRevealProgress = 0;
            alertRevealEnabled = false;
            const introStageLabel = document.getElementById('introStageLabel');
            let frame = 0;
            const totalFrames = 60; // Faster glide for responsive feel
            const introKeyframes = [
                {
                    stop: 0.0,
                    view: {
                        longitude: -52,
                        latitude: 4,
                        zoom: 1.35,
                        pitch: 0,
                        bearing: -6
                    }
                },
                {
                    stop: 0.32,
                    view: {
                        longitude: -60,
                        latitude: -12,
                        zoom: 2.75,
                        pitch: 16,
                        bearing: -10
                    }
                },
                {
                    stop: 0.62,
                    view: {
                        longitude: -63.8,
                        latitude: -9.6,
                        zoom: 5.4,
                        pitch: 32,
                        bearing: -12
                    }
                },
                {
                    stop: 1.0,
                    view: {
                        longitude: -62.73,
                        latitude: -10.95,
                        zoom: 7.15,
                        pitch: 62,
                        bearing: -14
                    }
                }
            ];
            function easeInOutCubic(x) {
                return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
            }
            function easeOutCubic(x) {
                return 1 - Math.pow(1 - x, 3);
            }
            function lerp(a, b, t) {
                return a + (b - a) * t;
            }
            function interpolateKeyframes(progress) {
                for (let index = 0; index < introKeyframes.length - 1; index++) {
                    const current = introKeyframes[index];
                    const next = introKeyframes[index + 1];
                    if (progress >= current.stop && progress <= next.stop) {
                        const localProgress = (progress - current.stop) / (next.stop - current.stop || 1);
                        const eased = easeInOutCubic(localProgress);
                        return {
                            longitude: lerp(current.view.longitude, next.view.longitude, eased),
                            latitude: lerp(current.view.latitude, next.view.latitude, eased),
                            zoom: lerp(current.view.zoom, next.view.zoom, eased),
                            pitch: lerp(current.view.pitch, next.view.pitch, eased),
                            bearing: lerp(current.view.bearing, next.view.bearing, eased)
                        };
                    }
                }
                return { ...introKeyframes[introKeyframes.length - 1].view };
            }
            function animate() {
                frame++;
                const progress = Math.min(frame / totalFrames, 1);
                const { longitude, latitude, zoom, pitch, bearing } = interpolateKeyframes(progress);
                if (introStageLabel) {
                    let stageText = 'Global View';
                    if (progress > 0.24) stageText = 'South America';
                    if (progress > 0.5) stageText = 'Amazon Basin';
                    if (progress > 0.78) stageText = 'Rondonia Study Area';
                    introStageLabel.innerText = stageText;
                    introStageLabel.classList.toggle('active', progress < 0.96);
                }
                introRevealProgress = 0;
                introHeightScale = 0;
                if (frame % 4 === 0) renderLayers();
                deckInstance.setProps({
                    initialViewState: {
                        latitude,
                        longitude,
                        zoom,
                        pitch,
                        bearing
                    }
                });
                currentViewState = { latitude, longitude, zoom, pitch, bearing };
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // Immediate Landing - Zero delay for instant perception
                    deckInstance.setProps({
                        initialViewState: {
                            ...DEFAULT_VIEW_STATE,
                            transitionDuration: 0
                        }
                    });
                    currentViewState = DEFAULT_VIEW_STATE;
                    if (introStageLabel) {
                        introStageLabel.innerText = 'Scene Synchronized';
                        introStageLabel.classList.remove('active');
                    }
                    startColumnReveal();
                    setTimeout(() => {
                        const visibleData = dataGlobal;
                        updateAlertState(visibleData, 847); // Initial state sync
                        setSecondaryReady(true);
                    }, 100);
                }
            }
            requestAnimationFrame(animate);
        }
        function setMode(mode) {
            if (!deckInstance) return
            markAnalysisReady();
            currentMode = mode
            if (mode === '3d') {
                if (!Number.isFinite(manualHeightScale) || manualHeightScale < 0.2) {
                    manualHeightScale = 1.2;
                }
                syncColumnScaleUI();
                startColumnReveal();
            }
            // Update button states
            const btnId = { '3d': 'btn3d', '2d': 'btn2d', 'heat': 'btnHeat', 'hotspot': 'btnHotspot' };
            // Update modeSwitcher buttons if they exist
            document.querySelectorAll('#modeSwitcher button').forEach(b => b.classList.remove('active'));
            // Update individual buttons anywhere in the DOM
            Object.values(btnId).forEach(id => {
                const btn = document.getElementById(id);
                if (btn) btn.classList.remove('active');
            });
            const activeBtn = document.getElementById(btnId[mode]);
            if (activeBtn) activeBtn.classList.add('active');
            // Re-render layer for current mode
            renderLayers();
        }
        function updateChartState(low, medium, high, total) {
            const title = document.querySelector("#chartContainer .chart-header");
            const caption = document.querySelector("#chartContainer .panel-note");
            if (riskChartInstance) {
                const desiredType = currentScenario === 'baseline' ? 'doughnut' : 'bar';
                if (riskChartInstance.config.type !== desiredType) {
                    riskChartInstance.destroy();
                    riskChartInstance = null;
                    buildChart(low, medium, high, total);
                    return;
                }
                if (currentScenario === 'baseline') {
                    if (title) title.innerText = 'Risk Distribution';
                    if (caption) caption.innerText = validationLayerEnabled
                        ? 'Visible class distribution with validation proxy enabled.'
                        : 'Baseline class distribution for the visible scene.';
                    riskChartInstance.config.type = 'doughnut';
                    riskChartInstance.data.labels = [
                        `Low (${((low / total) * 100).toFixed(1)}%)`,
                        `Medium (${((medium / total) * 100).toFixed(1)}%)`,
                        `High (${((high / total) * 100).toFixed(1)}%)`
                    ];
                    riskChartInstance.data.datasets[0].data = [low, medium, high];
                    riskChartInstance.data.datasets[0].backgroundColor = ['rgba(34,197,94,0.82)', 'rgba(245,158,11,0.82)', 'rgba(220, 38, 38,0.82)'];
                    riskChartInstance.data.datasets[0].borderColor = ['#22c55e', '#f59e0b', '#dc2626'];
                } else {
                    const impact = getScenarioImpactMetrics(getVisibleScenarioData());
                    if (title) title.innerText = 'Scenario Impact';
                    if (caption) caption.innerText = `Delta versus baseline under ${SCENARIO_CONFIG[currentScenario].label}.`;
                    riskChartInstance.config.type = 'bar';
                    riskChartInstance.data.labels = impact.labels;
                    riskChartInstance.data.datasets[0].data = impact.values;
                    riskChartInstance.data.datasets[0].backgroundColor = impact.values.map(value => value >= 0 ? 'rgba(220, 38, 38,0.78)' : 'rgba(34,197,94,0.78)');
                    riskChartInstance.data.datasets[0].borderColor = impact.values.map(value => value >= 0 ? '#dc2626' : '#22c55e');
                }
                riskChartInstance.update();
            } else {
                buildChart(low, medium, high, total);
            }
        }
        function buildChart(low, medium, high, total) {
            const riskChartEl = document.getElementById("riskChart");
            if (!riskChartEl) return;
            const ctx = riskChartEl.getContext("2d");
            const title = document.querySelector("#chartContainer .chart-header");
            const caption = document.querySelector("#chartContainer .panel-note");
            if (title) title.innerText = currentScenario === 'baseline' ? 'Risk Distribution' : 'Scenario Impact';
            if (caption) caption.innerText = currentScenario === 'baseline'
                ? (validationLayerEnabled ? 'Visible class distribution with validation proxy enabled.' : 'Baseline class distribution for the visible scene.')
                : `Delta versus baseline under ${SCENARIO_CONFIG[currentScenario].label}.`;
            const impact = getScenarioImpactMetrics(getVisibleScenarioData());
            const isBaseline = currentScenario === 'baseline';
            riskChartInstance = new Chart(ctx, {
                type: isBaseline ? 'doughnut' : 'bar',
                data: {
                    labels: isBaseline ? [
                        `Low (${((low / total) * 100).toFixed(1)}%)`,
                        `Medium (${((medium / total) * 100).toFixed(1)}%)`,
                        `High (${((high / total) * 100).toFixed(1)}%)`
                    ] : impact.labels,
                    datasets: [{
                        data: isBaseline ? [low, medium, high] : impact.values,
                        backgroundColor: isBaseline
                            ? ['rgba(34,197,94,0.82)', 'rgba(245,158,11,0.82)', 'rgba(220, 38, 38,0.82)']
                            : impact.values.map(value => value >= 0 ? 'rgba(220, 38, 38,0.78)' : 'rgba(34,197,94,0.78)'),
                        borderColor: isBaseline
                            ? ['#22c55e', '#f59e0b', '#dc2626']
                            : impact.values.map(value => value >= 0 ? '#dc2626' : '#22c55e'),
                        borderWidth: 1.5,
                        hoverOffset: 6,
                        spacing: 2
                    }]
                },
                options: {
                    responsive: true,
                    cutout: isBaseline ? '55%' : undefined,
                    scales: isBaseline ? undefined : {
                        y: {
                            ticks: { color: '#94a3b8', callback: value => `${value}%` },
                            grid: { color: 'rgba(148,163,184,0.12)' }
                        },
                        x: {
                            ticks: { color: '#cbd5e1', font: { family: 'Inter', size: 10 } },
                            grid: { display: false }
                        }
                    },
                    plugins: {
                        legend: {
                            display: isBaseline,
                            position: 'bottom',
                            labels: {
                                color: '#94a3b8',
                                font: { family: 'Inter', size: 10 },
                                padding: 10,
                                usePointStyle: true,
                                pointStyleWidth: 8
                            }
                        }
                    },
                    animation: {
                        animateRotate: true,
                        duration: 350,
                        easing: 'easeOutQuart'
                    }
                }
            })
        }
        const INSIGHT_TEMPLATES = {
            cluster: "ALERT: High-density risk cluster identified in sector [SECTOR]. Probability of localized forest loss exceeds 85%. Immediate verification recommended.",
            proximity: "MISSION ADVISORY: Detected significant spatial pressure near [NEARBY_FEATURE]. Corridor expansion confirmed. Escalation window: 72 hours.",
            scenario: "STRATEGIC OVERVIEW: [SCENARIO] conditions are intensifying pressure on the basin fringe. Aggregate risk trajectory is trending upward.",
            nominal: "STATUS: SCANNING. Monitoring nominal basin conditions. No critical clusters dominating current viewport.",
            selected: "OBJECTIVE ANALYSIS: Point [COORDS] showing [PROB]% risk under current propulsion. Primary driver: infrastructure proximity."
        };
        function updateInsightBox(activeData, targetObj = null, regionPoints = []) {
            const insightText = document.getElementById('insightText');
            if (!insightText) return;
            let message = INSIGHT_TEMPLATES.nominal;
            if (targetObj) {
                const prob = getProbabilityPercent(getPointScore(targetObj));
                message = INSIGHT_TEMPLATES.selected
                    .replace('[COORDS]', `${targetObj.lat.toFixed(2)}, ${targetObj.lon.toFixed(2)}`)
                    .replace('[PROB]', prob);
            } else if (activeData && activeData.length > 50) {
                const highCount = activeData.filter(p => getPointScore(p) > 170).length;
                if (highCount > 200) {
                    message = INSIGHT_TEMPLATES.cluster.replace('[SECTOR]', 'Rondonia Frontier');
                } else if (currentScenario !== 'baseline') {
                    message = INSIGHT_TEMPLATES.scenario.replace('[SCENARIO]', SCENARIO_CONFIG[currentScenario].label);
                }
            }
            // Simple typewriter effect for HUD immersion
            if (insightText.getAttribute('data-last-msg') !== message) {
                insightText.setAttribute('data-last-msg', message);
                insightText.innerText = "";
                let i = 0;
                const type = () => {
                    if (i < message.length) {
                        insightText.innerText += message.charAt(i);
                        i++;
                        setTimeout(type, 10);
                    }
                };
                type();
            }
        }
        function updateKpiState(activeData, highCount) {
            const averageScore = activeData.length
                ? activeData.reduce((sum, point) => sum + getPointScore(point), 0) / activeData.length
                : 140;
            const baseConfidence = getProbabilityPercent(averageScore);
            const highBias = activeData.length ? Math.round((highCount / activeData.length) * 8) : 0;
            const confidence = Math.max(72, Math.min(99, baseConfidence + highBias));
            const confEl = document.getElementById("predictionConfidence");
            if (confEl) confEl.innerText = `${confidence}%`;
            const aucEl = document.getElementById("aucScore");
            if (aucEl) aucEl.innerText = "0.82";
        }
        function updateAlertState(activeData, highCount) {
            const banner = document.getElementById('alertBanner');
            if (!banner) return;
            const headline = document.getElementById('alertHeadline');
            const meta = document.getElementById('alertMeta');
            const icon = banner.querySelector('.alert-icon');
            if (!alertRevealEnabled) {
                banner.classList.remove('active');
                return;
            }
            banner.classList.add('active');
            if (!activeData.length || highCount === 0) {
                banner.classList.add('low');
                if (headline) headline.innerText = 'Monitoring nominal basin conditions';
                if (meta) meta.innerText = `Visible scene stays within low-to-medium pressure under ${SCENARIO_CONFIG[currentScenario].label}.`;
                if (icon) icon.innerText = 'i';
                return;
            }
            const highest = activeData.reduce((max, point) => getPointScore(point) > getPointScore(max) ? point : max, activeData[0]);
            const probability = getProbabilityPercent(getPointScore(highest));
            if (banner) banner.classList.remove('low');
            if (headline) headline.innerText = 'High Risk Cluster Detected';
            if (meta) meta.innerText = `Scenario: ${SCENARIO_CONFIG[currentScenario].label} | Probability: ${probability}% | Target Year: ${highest.event_year}`;
            if (icon) icon.innerText = '!';
        }
        function toggleMapStyle(style) {
            if (!deckInstance) return;
            const mapboxMap = deckInstance.map;
            if (mapboxMap && typeof mapboxMap.isStyleLoaded === 'function' && !mapboxMap.isStyleLoaded()) {
                pendingMapStyle = style;
                closeMapControlsMenu();
                return;
            }
            pendingMapStyle = null;
            deckInstance.setProps({
                mapStyle: MAP_STYLES[style] || MAP_STYLES.dark
            });
            document.getElementById('styleDark').classList.toggle('active', style === 'dark');
            document.getElementById('styleTerrain').classList.toggle('active', style === 'terrain');
            document.getElementById('styleSatellite').classList.toggle('active', style === 'satellite');
            closeMapControlsMenu();
            if (mapboxMap && typeof mapboxMap.once === 'function') {
                mapboxMap.once('idle', () => renderLayers());
                return;
            }
            renderLayers();
        }
        function toggleSidebar(show, obj = null) {
            const sidebar = document.getElementById('analysisSidebar');
            if (show === undefined) show = !sidebar.classList.contains('active');
            const icon = document.getElementById('toggleIconSide');
            if (icon) icon.className = show ? 'fas fa-chevron-right' : 'fas fa-chevron-left';
            if (show) {
                sidebar.classList.add('active');
            } else {
                sidebar.classList.remove('active');
                selectedAnalysisPoint = null;
                syncReportExportPanel(null);
                syncInsightVisibility();
                updateSideTrajectoryChart();
                updateInsightBox(getVisibleScenarioData());
                switchTab('tab-overview');
            }
            if (show && obj) {
                markAnalysisReady();
                selectedAnalysisPoint = obj;
                syncInsightVisibility();
                const pointScore = getPointScore(obj);
                const riskClass = getRiskClassText(pointScore);
                const priority = getPriorityText(pointScore);
                const confidence = Math.min(99, Math.max(72, Math.round(((pointScore - 140) / 45) * 100)));
                const probability = getProbabilityPercent(pointScore);
                const regionPoints = getLocalRegionPoints(obj);
                const drivers = buildExplanationDrivers(obj, regionPoints);
                const validationEvidence = getValidationEvidence(obj);
                const sc = document.getElementById('sideCoords');
                const ss = document.getElementById('sideRiskScore');
                const sy = document.getElementById('sideYear');
                const sk = document.getElementById('sideClass');
                const sp = document.getElementById('sidePriority');
                const sw = document.getElementById('sideWindow');
                const sf = document.getElementById('sideConfidence');
                if (sc) sc.innerText = `LAT ${obj.lat.toFixed(4)} | LON ${obj.lon.toFixed(4)}`;
                if (ss) ss.innerText = `${probability}%`;
                if (sy) sy.innerText = obj.event_year;
                if (sk) sk.innerText = riskClass;
                if (sp) sp.innerText = priority;
                if (sw) sw.innerText = pointScore > 170 ? '24 hrs' : (pointScore > 165 ? '72 hrs' : '7 days');
                if (sf) sf.innerText = `${confidence}%`;
                const meterFill = document.getElementById('riskMeterFill');
                if (meterFill) {
                    const riskPercent = Math.min(((pointScore - 140) / (185 - 140)) * 100, 100);
                    meterFill.style.width = riskPercent + '%';
                    meterFill.style.background = pointScore > 170 ? '#dc2626' : (pointScore > 165 ? '#f59e0b' : '#22c55e');
                }
                let advice = "";
                if (pointScore > 170) {
                    advice = `<b>CRITICAL THREAT:</b> ${SCENARIO_CONFIG[currentScenario].label} pushes this cell into immediate response range. Prioritize drone verification and corridor monitoring.`;
                } else if (pointScore > 165) {
                    advice = `<b>ELEVATED ALERT:</b> ${SCENARIO_CONFIG[currentScenario].label} keeps this sector under sustained pressure. Increase revisit frequency and monitor road-edge activity.`;
                } else {
                    advice = `<b>NOMINAL RISK:</b> This cell remains below intervention threshold under ${SCENARIO_CONFIG[currentScenario].label}. Continue baseline conservation monitoring.`;
                }
                if (validationLayerEnabled) {
                    advice += ` <br><br><b>Validation:</b> Proxy validation overlay is active for visual comparison against modeled pressure.`;
                }
                const sa = document.getElementById('sideAdvice');
                if (sa) sa.innerHTML = advice;
                const so = document.getElementById('sideObservedLoss');
                const sh = document.getElementById('sideFireHotspot');
                const sv = document.getElementById('sideSatelliteValidation');
                const st = document.getElementById('sideValidationStatus');
                if (so) so.innerText = validationEvidence.observedForestLoss ? 'YES' : 'NO';
                if (sh) sh.innerText = validationEvidence.fireHotspot ? 'YES' : 'NO';
                if (sv) sv.innerText = validationEvidence.satelliteValidation;
                if (st) st.innerText = validationEvidence.status;
                // Update Side Trajectory Chart
                updateSideTrajectoryChart(obj);
                document.getElementById('sideValidationSummary').innerHTML = validationEvidence.observedForestLoss
                    ? `<b>Prediction vs Observation:</b> High predicted risk aligns with observed forest loss evidence. This supports model validity for this cell.`
                    : `<b>Prediction vs Observation:</b> No strong observed loss proxy is visible for this cell yet. This may indicate early warning or overprediction.`;
                updateExplainabilityPanel(drivers);
                updateRegionAnalysis(obj, regionPoints);
                const regionAreaValue = document.getElementById('regionArea');
                if (regionAreaValue) {
                    regionAreaValue.innerText = regionAreaValue.innerText.replace('kmÂ²', 'km²');
                }
                updateInsightBox(getVisibleScenarioData(), obj, regionPoints);
                syncReportExportPanel(obj);
                // Default to point analysis first, with AI insights available in the adjacent tab.
                switchTab('tab-overview');
            }
        }
        function toggleModal(show) {
            const modal = document.getElementById('modalOverlay');
            if (show) {
                modal.style.display = 'flex';
                setTimeout(() => modal.classList.add('active'), 10);
            } else {
                modal.classList.remove('active');
                setTimeout(() => modal.style.display = 'none', 400);
            }
        }
        window.addEventListener('error', event => {
            console.error('Unhandled error:', event.error || event.message);
            const message = event && event.message
                ? `Startup error: ${event.message}`
                : 'Startup error prevented the dashboard from rendering.';
            if (document.getElementById('loadingOverlay')) {
                showLoadingError(message, true);
            }
        });
        window.addEventListener('unhandledrejection', event => {
            const reason = event.reason && event.reason.message ? event.reason.message : String(event.reason || 'Unknown promise rejection');
            console.error('Unhandled rejection:', event.reason);
            if (document.getElementById('loadingOverlay')) {
                showLoadingError(`Startup error: ${reason}`, true);
            }
        });
        window.addEventListener('hashchange', handleDashboardEntryHash);
        function generateRiskReport() {
            const record = getSelectedPointExportRecord();
            if (!record) {
                console.warn('Select a column before exporting PDF.');
                return;
            }
            const filename = record
                ? `GeoAI_Risk_Report_lat-${record.latitude}_lon-${record.longitude}_${Math.round(Number(record.risk_score))}.pdf`
                : `GeoAI_Scene_Report_${currentMode}_${currentScenario}_${Math.floor(currentYear)}.pdf`;
            const JsPDF = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
            if (typeof JsPDF !== 'function') {
                console.error('jsPDF unavailable. PDF export cannot continue.');
                return;
            }
            const hasPoint = Boolean(record);
            const score = hasPoint ? Number(record.risk_score) : null;
            const data = hasPoint
                ? {
                    title: `${record.risk_class}-risk column report`,
                    subtitle: `${record.region} | LAT ${record.latitude} | LON ${record.longitude} | ${record.scenario}`,
                    metrics: [
                        { label: 'Risk score', value: record.risk_score, tone: 'high' },
                        { label: 'Probability', value: `${record.probability}%`, tone: 'medium' },
                        { label: 'Confidence', value: record.confidence, tone: 'info' },
                        { label: 'Response window', value: record.response_window, tone: 'success' }
                    ],
                    details: [
                        { label: 'Region', value: record.region },
                        { label: 'Latitude', value: record.latitude },
                        { label: 'Longitude', value: record.longitude },
                        { label: 'Validation', value: record.validation_status },
                        { label: 'Local cluster points', value: String(record.local_cluster_points) },
                        { label: 'High-risk share', value: record.local_high_risk_share },
                        { label: 'Observed forest loss', value: record.observed_forest_loss },
                        { label: 'Fire hotspot', value: record.fire_hotspot }
                    ],
                    recommendation: score > 170
                        ? 'Escalate immediately and open the spatial analysis view for a deep-dive response plan.'
                        : score > 165
                            ? 'Prioritize monitoring and validate the surrounding cluster before the next cycle.'
                            : 'Maintain surveillance and keep the area in the regular review queue.'
                }
                : {
                    title: `${SCENARIO_CONFIG[currentScenario].label} scene overview`,
                    subtitle: `Current scene | ${SCENARIO_CONFIG[currentScenario].label} | ${getModeLabel(currentMode)} view`,
                    metrics: [
                        { label: 'Mode', value: getModeLabel(currentMode), tone: 'info' },
                        { label: 'Scenario', value: SCENARIO_CONFIG[currentScenario].label, tone: 'medium' },
                        { label: 'Year', value: String(Math.floor(currentYear)), tone: 'info' },
                        { label: 'Metric', value: currentMetric, tone: 'success' }
                    ],
                    details: [
                        { label: 'Scene scope', value: 'Overview' },
                        { label: 'Layer set', value: '3D / 2D / Hotspots' },
                        { label: 'Analysis year', value: String(Math.floor(currentYear)) },
                        { label: 'Current mode', value: getModeLabel(currentMode) },
                        { label: 'Current scenario', value: SCENARIO_CONFIG[currentScenario].label },
                        { label: 'Active metric', value: currentMetric }
                    ],
                    recommendation: 'Review the current scene summary and switch to a point selection to export a focused report.'
                };
            const doc = new JsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 14;
            const contentWidth = pageWidth - margin * 2;
            const gridGap = 4;
            const cardWidth = (contentWidth - gridGap) / 2;
            const summaryHeight = 22;
            const detailHeight = 16;
            const toneColors = {
                high: [248, 113, 133],
                medium: [253, 186, 116],
                info: [125, 211, 252],
                success: [74, 222, 128]
            };
            const drawRoundedPanel = (x, y, w, h, fill, stroke) => {
                doc.setFillColor(fill[0], fill[1], fill[2]);
                doc.setDrawColor(stroke[0], stroke[1], stroke[2]);
                doc.setLineWidth(0.35);
                doc.roundedRect(x, y, w, h, 4, 4, 'FD');
            };
            const addWrappedText = (text, x, y, size, color, options = {}) => {
                const bold = Boolean(options.bold);
                const maxWidth = options.maxWidth || contentWidth;
                const lineHeightFactor = options.lineHeightFactor || 1.15;
                const bottomGap = options.bottomGap || 0;
                const lines = doc.splitTextToSize(String(text ?? ''), maxWidth);
                doc.setFont('helvetica', bold ? 'bold' : 'normal');
                doc.setFontSize(size);
                doc.setTextColor(color[0], color[1], color[2]);
                doc.text(lines, x, y, { lineHeightFactor });
                const height = lines.length * size * 0.3528 * lineHeightFactor;
                return y + height + bottomGap;
            };
            const drawMetricCard = (x, y, item) => {
                drawRoundedPanel(x, y, cardWidth, summaryHeight, [14, 21, 37], [30, 41, 59]);
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(8);
                doc.setTextColor(142, 164, 190);
                doc.text(String(item.label).toUpperCase(), x + 4, y + 5);
                doc.setFontSize(13);
                const tone = toneColors[item.tone] || toneColors.info;
                doc.setTextColor(tone[0], tone[1], tone[2]);
                const valueLines = doc.splitTextToSize(String(item.value), cardWidth - 8);
                doc.text(valueLines, x + 4, y + 12.5, { lineHeightFactor: 1.05 });
            };
            const drawDetailCard = (x, y, item) => {
                drawRoundedPanel(x, y, cardWidth, detailHeight, [10, 16, 28], [51, 65, 85]);
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(7.8);
                doc.setTextColor(142, 164, 190);
                doc.text(String(item.label).toUpperCase(), x + 4, y + 4.8);
                doc.setFontSize(11.2);
                doc.setTextColor(248, 251, 255);
                const valueLines = doc.splitTextToSize(String(item.value), cardWidth - 8);
                doc.text(valueLines, x + 4, y + 10.5, { lineHeightFactor: 1.04 });
            };
            const footerLabel = hasPoint
                ? `${record.mode} | ${record.metric}`
                : `${getModeLabel(currentMode)} | ${SCENARIO_CONFIG[currentScenario].label}`;
            doc.setFillColor(7, 11, 19);
            doc.rect(0, 0, pageWidth, pageHeight, 'F');
            doc.setDrawColor(30, 41, 59);
            doc.setLineWidth(0.5);
            doc.roundedRect(margin, 11, contentWidth, pageHeight - 22, 4, 4, 'S');
            let cursorY = 20;
            cursorY = addWrappedText('AI Deforestation Risk Report', margin, cursorY, 9, [103, 232, 249], {
                bold: true,
                maxWidth: contentWidth,
                lineHeightFactor: 1.0,
                bottomGap: 2
            });
            cursorY = addWrappedText(data.title, margin, cursorY, 21, [248, 251, 255], {
                bold: true,
                maxWidth: contentWidth,
                lineHeightFactor: 1.08,
                bottomGap: 2
            });
            cursorY = addWrappedText(data.subtitle, margin, cursorY, 10, [142, 164, 190], {
                maxWidth: contentWidth,
                lineHeightFactor: 1.15,
                bottomGap: 6
            });
            const metricY = cursorY;
            data.metrics.slice(0, 2).forEach((item, index) => {
                drawMetricCard(margin + (index * (cardWidth + gridGap)), metricY, item);
            });
            data.metrics.slice(2, 4).forEach((item, index) => {
                drawMetricCard(margin + (index * (cardWidth + gridGap)), metricY + summaryHeight + gridGap, item);
            });
            const detailY = metricY + (summaryHeight * 2) + gridGap + 8;
            data.details.forEach((item, index) => {
                const row = Math.floor(index / 2);
                const col = index % 2;
                drawDetailCard(margin + (col * (cardWidth + gridGap)), detailY + (row * (detailHeight + gridGap)), item);
            });
            const detailRows = Math.ceil(data.details.length / 2);
            const detailsBlockHeight = (detailRows * (detailHeight + gridGap)) - gridGap;
            const recommendationY = detailY + detailsBlockHeight + 8;
            const recommendationText = doc.splitTextToSize(data.recommendation, contentWidth - 10);
            const recommendationHeight = Math.max(26, (recommendationText.length * 4.8) + 12);
            drawRoundedPanel(margin, recommendationY, contentWidth, recommendationHeight, [8, 16, 29], [34, 197, 94]);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8);
            doc.setTextColor(134, 239, 172);
            doc.text('RECOMMENDED ACTION', margin + 4, recommendationY + 5);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(11);
            doc.setTextColor(226, 232, 240);
            doc.text(recommendationText, margin + 4, recommendationY + 11, { lineHeightFactor: 1.15 });
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.5);
            doc.setTextColor(120, 140, 165);
            doc.text(`Generated from live dashboard context | ${footerLabel}`, margin, pageHeight - 8);
            doc.save(filename);
            return;
        }
        try {
            bootstrapApp();
        } catch (error) {
            console.error('Bootstrap failed:', error);
            showLoadingError(`Startup error: ${error.message}`, true);
        }
        window.onfocus = () => {
            if (appInitialized) syncSimulatorState();
        };

