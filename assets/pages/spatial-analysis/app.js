// Map initialization
        function createRasterStyle(tileUrl) {
            return {
                version: 8,
                sources: { "raster-tiles": { type: "raster", tiles: [tileUrl], tileSize: 256, attribution: "CARTO" } },
                layers: [{ id: "raster-layer", type: "raster", source: "raster-tiles", minzoom: 0, maxzoom: 22 }]
            };
        }

        // Token injected at build time via Vercel build script (see package.json build command).
        // DO NOT hardcode a real token here — set MAPBOX_TOKEN in Vercel Environment Variables.
        mapboxgl.accessToken = "___MAPBOX_TOKEN_PLACEHOLDER___";
        const map = new mapboxgl.Map({
            container: 'spatialMap',
            style: "mapbox://styles/mapbox/dark-v11",
            center: [-60.0, -5.0],
            zoom: 3.5,
            attributionControl: false
        });
        map.addControl(new mapboxgl.NavigationControl(), 'top-left');

        const analysisParams = new URLSearchParams(window.location.search);
        const focusLat = Number.parseFloat(analysisParams.get('lat'));
        const focusLon = Number.parseFloat(analysisParams.get('lon'));
        const focusYear = analysisParams.get('year');
        const focusMode = analysisParams.get('mode');
        const focusScenario = analysisParams.get('scenario');
        const focusRiskRaw = analysisParams.get('risk');
        let focusRisk = focusRiskRaw;
        // If passed from main dashboard, it might be the raw >100 score
        if (focusRiskRaw && Number(focusRiskRaw) > 100 && window.GEOAI_CONSTANTS) {
            focusRisk = window.GEOAI_CONSTANTS.normalizeRiskScore(Number(focusRiskRaw));
        }
        const hasFocusPoint = Number.isFinite(focusLat) && Number.isFinite(focusLon);
        let focusMarker = null;

        function capitalizeLabel(value) {
            if (!value) return '';
            return value.charAt(0).toUpperCase() + value.slice(1);
        }

        function modeLabel(value) {
            if (!value) return 'Dashboard';
            if (value === '3d') return '3D';
            if (value === '2d') return '2D';
            if (value === 'heat') return 'Heatmap';
            if (value === 'hotspot') return 'Hotspots';
            return capitalizeLabel(value);
        }


        function getAnalysisPointRisk(point) {
            let raw;
            if (point.type === 'hotspot') {
                const intensity = Number.isFinite(point.intensity) ? point.intensity : 0.85;
                raw = Math.round(171 + (intensity * 8) + ((point.id || 0) % 2));
            } else {
                const radius = Number.isFinite(point.radius) ? point.radius : 30000;
                raw = Math.round(156 + Math.min(9, radius / 9000));
            }
            return window.GEOAI_CONSTANTS ? window.GEOAI_CONSTANTS.normalizeRiskScore(raw) : Math.max(0, Math.min(100, Math.round(((raw - 140) / 45) * 100)));
        }

        function getAnalysisPointBand(score) {
            if (window.GEOAI_CONSTANTS && window.GEOAI_CONSTANTS.calculatePriority) {
                 return window.GEOAI_CONSTANTS.calculatePriority(score).toLowerCase();
            }
            if (score > 75) return 'urgent';
            if (score > 50) return 'high';
            if (score > 25) return 'medium';
            return 'low';
        }

        function getRiskFilterLabel(value) {
            if (value === 'high') return 'High Risk';
            if (value === 'medium') return 'Medium Risk';
            if (value === 'low') return 'Low Risk';
            return 'All Risk Levels';
        }

        function haversineKm(lat1, lon1, lat2, lon2) {
            const toRad = degrees => (degrees * Math.PI) / 180;
            const earthRadiusKm = 6371;
            const deltaLat = toRad(lat2 - lat1);
            const deltaLon = toRad(lon2 - lon1);
            const a = Math.sin(deltaLat / 2) ** 2
                + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(deltaLon / 2) ** 2;
            return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        }

        function getSpatialQueryCenter() {
            if (hasFocusPoint) {
                return { lat: focusLat, lon: focusLon, label: 'Focused point' };
            }

            const centroid = ANALYSIS_POINTS.reduce((acc, point) => ({
                lat: acc.lat + point.lat,
                lon: acc.lon + point.lon
            }), { lat: 0, lon: 0 });

            return {
                lat: centroid.lat / ANALYSIS_POINTS.length,
                lon: centroid.lon / ANALYSIS_POINTS.length,
                label: 'Analysis centroid'
            };
        }

        function updateSpatialQuerySource(results) {
            const source = map.getSource('query-results');
            if (!source) return;

            source.setData({
                type: 'FeatureCollection',
                features: results.map((item, index) => ({
                    type: 'Feature',
                    geometry: { type: 'Point', coordinates: [item.lon, item.lat] },
                    properties: {
                        label: `#${index + 1}`,
                        band: item.band,
                        score: item.score,
                        distance: item.distanceKm.toFixed(1),
                        type: item.type
                    }
                }))
            });
        }

        function updateSpatialQueryPanel(results, center, radiusKm, filterValue, fallbackUsed) {
            const summary = document.getElementById('querySummary');
            const regionStats = document.getElementById('regionStats');
            const filterLabel = getRiskFilterLabel(filterValue);
            const centerLabel = `${center.lat.toFixed(2)}, ${center.lon.toFixed(2)}`;

            if (summary) {
                if (results.length) {
                    summary.textContent = `${results.length} matching sample point${results.length === 1 ? '' : 's'} found near ${center.label} within ${radiusKm} km.`;
                    if (fallbackUsed) {
                        summary.textContent += ' Showing the nearest eligible zones instead.';
                    }
                } else {
                    summary.textContent = 'No zones matched the selected filter inside the current radius.';
                }
            }

            if (!regionStats) return;

            const existing = regionStats.querySelector('.query-result-card');
            if (existing) existing.remove();

            const card = document.createElement('div');
            card.className = 'cluster-card query-result-card';

            if (results.length) {
                const topSignal = results[0];
                card.innerHTML = `
                    <div class="query-result-head">
                        <div>
                            <div class="cluster-name">Filtered scan</div>
                            <div class="query-result-title">${results.length} matched zone${results.length === 1 ? '' : 's'}</div>
                            <div class="query-result-meta">${filterLabel} | Radius ${radiusKm} km | Center ${centerLabel}</div>
                        </div>
                        <div class="map-overlay-badge">SCAN</div>
                    </div>
                    <div class="cluster-stats">
                        <div><div class="cluster-stat-label">Top signal</div><div class="cluster-stat-val">${capitalizeLabel(topSignal.type)} ${topSignal.score}%</div></div>
                        <div><div class="cluster-stat-label">Distance</div><div class="cluster-stat-val">${topSignal.distanceKm.toFixed(1)} km</div></div>
                        <div><div class="cluster-stat-label">Center</div><div class="cluster-stat-val">${centerLabel}</div></div>
                        <div><div class="cluster-stat-label">Band</div><div class="cluster-stat-val">${filterLabel}</div></div>
                    </div>
                    <div class="query-result-list">
                        ${results.slice(0, 3).map(item => `
                            <div class="query-result-item">
                                <span>${capitalizeLabel(item.type)}</span>
                                <strong>${item.score}%</strong>
                                <em>${item.distanceKm.toFixed(1)} km</em>
                            </div>
                        `).join('')}
                    </div>
                `;
            } else {
                card.innerHTML = `
                    <div class="cluster-name">Filtered scan</div>
                    <div class="query-result-empty">No zones matched the selected filter inside the current radius.</div>
                    <div class="query-result-meta" style="margin-top:10px;">${filterLabel} | Radius ${radiusKm} km | Center ${centerLabel}</div>
                `;
            }

            regionStats.prepend(card);
            updateSpatialBriefPanel(results, center, radiusKm, filterValue, fallbackUsed);
        }

        function updateSpatialBriefPanel(results, center, radiusKm, filterValue, fallbackUsed) {
            const title = document.getElementById('analysisBriefTitle');
            const badge = document.getElementById('analysisBriefBadge');
            const copy = document.getElementById('analysisBriefCopy');
            const focus = document.getElementById('analysisBriefFocus');
            const scan = document.getElementById('analysisBriefScan');
            const signal = document.getElementById('analysisBriefSignal');
            const status = document.getElementById('analysisBriefStatus');
            const topSignal = results.length ? results[0] : null;
            const centerLabel = `${center.lat.toFixed(2)}, ${center.lon.toFixed(2)}`;
            const filterLabel = getRiskFilterLabel(filterValue);

            if (title) {
                title.textContent = results.length ? 'Filtered scan' : 'Spatial brief';
            }
            if (badge) {
                badge.textContent = `${filterLabel} · ${radiusKm} km`;
            }
            if (copy) {
                copy.textContent = results.length
                    ? `${results.length} matching point${results.length === 1 ? '' : 's'} found near ${center.label}. ${fallbackUsed ? 'Nearest eligible zones are shown as a fallback.' : 'All matches are inside the active radius.'}`
                    : `No zones matched ${filterLabel.toLowerCase()} inside the current radius.`;
            }
            if (focus) {
                focus.textContent = `${center.label} • ${centerLabel}`;
            }
            if (scan) {
                scan.textContent = results.length ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'Idle';
            }
            if (signal) {
                signal.textContent = topSignal ? `${capitalizeLabel(topSignal.type)} ${topSignal.score}%` : 'None';
            }
            if (status) {
                status.textContent = results.length ? (fallbackUsed ? 'Fallback' : 'Exact') : 'Awaiting scan';
            }
        }

        function runSpatialQuery() {
            const filterSelect = document.getElementById('riskFilter');
            const radiusSlider = document.getElementById('bufferRadius');
            const filterValue = filterSelect ? filterSelect.value : 'all';
            const radiusKm = Number.parseFloat(radiusSlider ? radiusSlider.value : '10') || 10;
            const center = getSpatialQueryCenter();

            const scoredPoints = ANALYSIS_POINTS.map(point => {
                const score = getAnalysisPointRisk(point);
                return {
                    ...point,
                    score,
                    band: getAnalysisPointBand(score),
                    distanceKm: haversineKm(center.lat, center.lon, point.lat, point.lon)
                };
            });

            let results = scoredPoints.filter(item => (filterValue === 'all' || item.band === filterValue) && item.distanceKm <= radiusKm);
            let fallbackUsed = false;

            if (!results.length) {
                results = scoredPoints
                    .filter(item => filterValue === 'all' || item.band === filterValue)
                    .sort((a, b) => a.distanceKm - b.distanceKm || b.score - a.score)
                    .slice(0, 3);
                fallbackUsed = results.length > 0;
            } else {
                results.sort((a, b) => a.distanceKm - b.distanceKm || b.score - a.score);
            }

            updateSpatialQuerySource(results);
            updateSpatialQueryPanel(results, center, radiusKm, filterValue, fallbackUsed);
        }

        function bindSpatialQueryControls() {
            const runBtn = document.getElementById('runSpatialQueryBtn');
            const filterSelect = document.getElementById('riskFilter');
            const radiusSlider = document.getElementById('bufferRadius');

            if (runBtn && !runBtn.dataset.bound) {
                runBtn.dataset.bound = '1';
                runBtn.addEventListener('click', runSpatialQuery);
            }

            if (filterSelect && !filterSelect.dataset.bound) {
                filterSelect.dataset.bound = '1';
                filterSelect.addEventListener('change', runSpatialQuery);
            }

            if (radiusSlider && !radiusSlider.dataset.bound) {
                radiusSlider.dataset.bound = '1';
                radiusSlider.addEventListener('input', runSpatialQuery);
                radiusSlider.addEventListener('change', runSpatialQuery);
            }
        }

        window.runSpatialQuery = runSpatialQuery;
        bindSpatialQueryControls();

        function applyFocusContext() {
            if (!hasFocusPoint) return;

            const header = document.querySelector('.page-header h1');
            const subheader = document.querySelector('.page-header p');
            if (header) header.textContent = 'Focused Spatial Analysis';
            if (subheader) {
                const contextBits = [`LAT ${focusLat.toFixed(3)}, LON ${focusLon.toFixed(3)}`];
                if (focusYear) contextBits.push(`Year ${focusYear}`);
                contextBits.push(`Mode ${modeLabel(focusMode)}`);
                if (focusScenario) contextBits.push(`Scenario ${capitalizeLabel(focusScenario)}`);
                if (focusRisk) contextBits.push(`Risk ${focusRisk}%`);
                subheader.textContent = `Selected from the dashboard | ${contextBits.join(' | ')}`;
            }

            const overlayTitle = document.getElementById('mapOverlayTitle');
            const overlayBadge = document.getElementById('mapOverlayBadge');
            const overlayMode = document.getElementById('mapOverlayMode');
            const overlayYear = document.getElementById('mapOverlayYear');
            const overlayFocus = document.getElementById('mapOverlayFocus');
            if (overlayTitle) {
                overlayTitle.textContent = focusScenario ? `${capitalizeLabel(focusScenario)} focus` : 'Focused spatial context';
            }
            if (overlayBadge) overlayBadge.textContent = 'FOCUSED';
            if (overlayMode) overlayMode.textContent = modeLabel(focusMode);
            if (overlayYear) overlayYear.textContent = focusYear || '2030';
            if (overlayFocus) overlayFocus.textContent = `${focusLat.toFixed(2)}, ${focusLon.toFixed(2)}`;

            const regionStats = document.getElementById('regionStats');
            if (regionStats) {
                const existing = regionStats.querySelector('.focus-point-card');
                if (existing) existing.remove();

                const card = document.createElement('div');
                card.className = 'cluster-card focus-point-card';
                card.style.borderLeft = '3px solid #22d3ee';
                card.innerHTML = `
                    <div class="cluster-name">Focused Point</div>
                    <div class="cluster-stats">
                        <div><div class="cluster-stat-label">Coordinates</div><div class="cluster-stat-val">${focusLat.toFixed(3)}, ${focusLon.toFixed(3)}</div></div>
                        <div><div class="cluster-stat-label">Scenario</div><div class="cluster-stat-val">${focusScenario ? capitalizeLabel(focusScenario) : 'Active'}</div></div>
                        <div><div class="cluster-stat-label">Mode</div><div class="cluster-stat-val">${modeLabel(focusMode)}</div></div>
                        <div><div class="cluster-stat-label">Risk</div><div class="cluster-stat-val" style="color:#22d3ee;">${focusRisk ? `${focusRisk}%` : '—'}</div></div>
                    </div>
                `;
                regionStats.prepend(card);
            }

            if (focusMarker) {
                focusMarker.remove();
            }
            focusMarker = new mapboxgl.Marker({ color: '#22d3ee' }).setLngLat([focusLon, focusLat]).addTo(map);
            map.flyTo({ center: [focusLon, focusLat], zoom: 7.8, essential: true });
        }

        // Curated showcase sample points for 2D spatial sandbox inspection (5 sample hotspots, 2 buffer zones).
        // Representative spatial samples derived from forest_data_clean.json for lightweight client-side Mapbox GL rendering.
        const ANALYSIS_POINTS = [
            { id: 1, lat: -11.918, lon: -63.872, type: 'hotspot', intensity: 0.94 },
            { id: 2, lat: -12.405, lon: -60.806, type: 'hotspot', intensity: 0.88 },
            { id: 3, lat: -10.181, lon: -62.633, type: 'hotspot', intensity: 0.99 },
            { id: 4, lat: -9.665, lon: -64.961, type: 'cluster', radius: 45000 },
            { id: 5, lat: -11.557, lon: -60.952, type: 'hotspot', intensity: 0.82 },
            { id: 6, lat: -10.351, lon: -65.207, type: 'cluster', radius: 35000 },
            { id: 7, lat: -8.5, lon: -63.1, type: 'hotspot', intensity: 0.95 }
        ];

        function addAnalysisLayers() {
            // Hotspots Source
            map.addSource('hotspots', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: ANALYSIS_POINTS.filter(p => p.type === 'hotspot').map(p => ({
                        type: 'Feature',
                        geometry: { type: 'Point', coordinates: [p.lon, p.lat] },
                        properties: { intensity: p.intensity }
                    }))
                }
            });

            // Clusters Source
            map.addSource('clusters', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: ANALYSIS_POINTS.filter(p => p.type === 'cluster').map(p => ({
                        type: 'Feature',
                        geometry: { type: 'Point', coordinates: [p.lon, p.lat] },
                        properties: { radius: p.radius }
                    }))
                }
            });

            // Corridors (Lines between hotspots)
            map.addSource('corridors', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [
                        {
                            type: 'Feature',
                            geometry: {
                                type: 'LineString',
                                coordinates: [
                                    [-63.872, -11.918], [-62.633, -10.181], [-63.1, -8.5]
                                ]
                            }
                        },
                        {
                            type: 'Feature',
                            geometry: {
                                type: 'LineString',
                                coordinates: [
                                    [-60.806, -12.405], [-60.952, -11.557]
                                ]
                            }
                        }
                    ]
                }
            });

            // Add Layers
            map.addLayer({
                id: 'corridor-lines',
                type: 'line',
                source: 'corridors',
                paint: {
                    'line-color': '#3b82f6',
                    'line-width': 2,
                    'line-opacity': 0.4,
                    'line-dasharray': [2, 1]
                }
            });

            map.addLayer({
                id: 'cluster-circles',
                type: 'circle',
                source: 'clusters',
                paint: {
                    'circle-radius': ['interpolate', ['linear'], ['zoom'], 4, 20, 10, 80],
                    'circle-color': '#f59e0b',
                    'circle-opacity': 0.15,
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#f59e0b'
                }
            });

            map.addLayer({
                id: 'hotspot-pulse',
                type: 'circle',
                source: 'hotspots',
                paint: {
                    'circle-radius': 12,
                    'circle-color': '#ef4444',
                    'circle-opacity': 0.6,
                    'circle-blur': 0.5
                }
            });

            map.addLayer({
                id: 'hotspot-points',
                type: 'circle',
                source: 'hotspots',
                paint: {
                    'circle-radius': 5,
                    'circle-color': '#ef4444',
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#fff'
                }
            });

            map.addLayer({
                id: 'heatmap-layer',
                type: 'heatmap',
                source: 'hotspots',
                layout: { 'visibility': 'none' },
                paint: {
                    'heatmap-weight': ['interpolate', ['linear'], ['get', 'risk_score'], 0, 0, 180, 1],
                    'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
                    'heatmap-color': [
                        'interpolate', ['linear'], ['heatmap-density'],
                        0, 'rgba(33,102,172,0)',
                        0.2, 'rgb(103,169,207)',
                        0.4, 'rgb(209,229,240)',
                        0.6, 'rgb(253,219,199)',
                        0.8, 'rgb(239,138,98)',
                        1, 'rgb(178,24,43)'
                    ],
                    'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
                    'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0]
                }
                        });

            map.addSource('query-results', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: []
                }
            });

            map.addLayer({
                id: 'query-results-layer',
                type: 'circle',
                source: 'query-results',
                paint: {
                    'circle-radius': ['interpolate', ['linear'], ['zoom'], 4, 9, 10, 18],
                    'circle-color': [
                        'match',
                        ['get', 'band'],
                        'high', '#ef4444',
                        'medium', '#f59e0b',
                        '#22c55e'
                    ],
                    'circle-opacity': 0.88,
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#ffffff'
                }
            });

            // Animation loop for pulse
            let step = 0;
            function animatePulse() {
                step += 0.05;
                const scale = 10 + Math.sin(step) * 5;
                const opacity = 0.6 - Math.sin(step) * 0.2;
                if (map.getLayer('hotspot-pulse')) {
                    map.setPaintProperty('hotspot-pulse', 'circle-radius', scale);
                    map.setPaintProperty('hotspot-pulse', 'circle-opacity', opacity);
                }
                requestAnimationFrame(animatePulse);
            }
            animatePulse();
        }

        function setView(view, btn) {
            document.querySelectorAll('.toolbar-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Layer IDs
            const hotspotLayers = ['hotspot-pulse', 'hotspot-points'];
            const clusterLayers = ['cluster-circles'];
            const corridorLayers = ['corridor-lines'];
            const heatmapLayers = ['heatmap-layer'];

            const allLayers = [...hotspotLayers, ...clusterLayers, ...corridorLayers, ...heatmapLayers];
            
            // Hide all first
            allLayers.forEach(lyr => {
                if (map.getLayer(lyr)) map.setLayoutProperty(lyr, 'visibility', 'none');
            });

            // Show selected
            if (view === 'hotspots') {
                hotspotLayers.forEach(lyr => {
                    if (map.getLayer(lyr)) map.setLayoutProperty(lyr, 'visibility', 'visible');
                });
            } else if (view === 'clusters') {
                clusterLayers.forEach(lyr => {
                    if (map.getLayer(lyr)) map.setLayoutProperty(lyr, 'visibility', 'visible');
                });
            } else if (view === 'corridors') {
                corridorLayers.forEach(lyr => {
                    if (map.getLayer(lyr)) map.setLayoutProperty(lyr, 'visibility', 'visible');
                });
            } else if (view === 'heatmap') {
                heatmapLayers.forEach(lyr => {
                    if (map.getLayer(lyr)) map.setLayoutProperty(lyr, 'visibility', 'visible');
                });
            }
        }

        // Risk Distribution Chart
        new Chart(document.getElementById('riskDistChart'), {
            type: 'bar',
            data: {
                labels: ['Rondônia', 'Pará', 'Mato Grosso', 'Amazonas', 'Acre', 'Maranhão'],
                datasets: [
                    { label: 'High', data: [42, 38, 35, 18, 28, 32], backgroundColor: 'rgba(239, 68, 68, 0.7)', borderRadius: 4 },
                    { label: 'Medium', data: [28, 32, 30, 25, 22, 28], backgroundColor: 'rgba(245, 158, 11, 0.6)', borderRadius: 4 },
                    { label: 'Low', data: [30, 30, 35, 57, 50, 40], backgroundColor: 'rgba(34, 197, 94, 0.5)', borderRadius: 4 }
                ]
            },
            options: {
                responsive: true,
                plugins: { legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 } } } },
                scales: {
                    x: { stacked: true, grid: { display: false }, ticks: { color: '#64748b', font: { size: 10 } } },
                    y: { stacked: true, grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', font: { size: 10 } } }
                }
            }
        });

        // Temporal Chart
        new Chart(document.getElementById('temporalChart'), {
            type: 'line',
            data: {
                labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
                datasets: [{
                    label: 'Deforestation Rate (km²/yr)',
                    data: [7500, 9800, 11010, 10670, 11480, 9080, 8600, 7800],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 4,
                    pointBackgroundColor: '#ef4444'
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 } } } },
                scales: {
                    x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b' } },
                    y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b' } }
                }
            }
        });

        // Hide loading with fallback
        const clearLoader = () => {
            const loader = document.getElementById('loadingOverlay');
            if (loader && !loader.classList.contains('fade-out')) {
                loader.classList.add('fade-out');
            }
        };

        map.on('load', () => {
            addAnalysisLayers();
            applyFocusContext();
            runSpatialQuery();
            setTimeout(clearLoader, 800);
        });

        // Resilience: Force clear loader if map takes too long
        setTimeout(clearLoader, 5000);

















