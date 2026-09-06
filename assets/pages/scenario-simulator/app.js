let projChart;
        function initChart() {
            const ctx = document.getElementById('projectionChart').getContext('2d');
            projChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033', '2034', '2035'],
                    datasets: [
                        {
                            label: 'Baseline',
                            data: [63.8, 64.2, 64.8, 65.3, 65.9, 66.4, 67.0, 67.5, 68.1, 68.6, 69.2],
                            borderColor: '#3b82f6',
                            borderWidth: 2,
                            borderDash: [6, 3],
                            pointRadius: 0,
                            fill: false,
                            tension: 0.3
                        },
                        {
                            label: 'Simulated',
                            data: [63.8, 65.5, 67.8, 69.8, 71.4, 73.0, 74.2, 75.1, 75.8, 76.0, 76.2],
                            borderColor: '#ef4444',
                            backgroundColor: 'rgba(239, 68, 68, 0.08)',
                            borderWidth: 3,
                            pointRadius: 3,
                            pointBackgroundColor: '#ef4444',
                            fill: true,
                            tension: 0.3
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 } } }
                    },
                    scales: {
                        x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', font: { size: 10 } } },
                        y: {
                            title: { display: true, text: 'High Risk Area %', color: '#64748b', font: { family: 'Inter', size: 11 } },
                            grid: { color: 'rgba(255,255,255,0.04)' },
                            ticks: { color: '#64748b', font: { size: 10 } },
                            min: 50, max: 100
                        }
                    }
                }
            });
        }

        // Heuristic policy sensitivity simulation:
        // Calculates projected percentage risk shifts using model-derived SHAP feature importance
        // weights (Road 41%, Forest Loss 23%, Population 21%) combined with policy mitigation factors,
        // rather than live re-inference of the offline-trained XGBoost model.
        function updateScenario() {
            const road = parseInt(document.getElementById('roadSlider').value);
            const pop = parseInt(document.getElementById('popSlider').value);
            const fire = parseInt(document.getElementById('fireSlider').value);
            document.getElementById('roadVal').textContent = (road >= 0 ? '+' : '') + road + '%';
            document.getElementById('popVal').textContent = (pop >= 0 ? '+' : '') + pop + '%';
            document.getElementById('fireVal').textContent = (fire >= 0 ? '+' : '') + fire + '%';

            const activePolicies = document.querySelectorAll('.policy-option.active').length;
            const policyReduction = activePolicies * 3.5;
            // Fix #4: Use SSOT-consistent weights (Road 41%, Forest Loss 23%, Population 21%)
            // fire slider maps to Forest Loss temporal component (closest proxy available)
            const impact = (road * 0.41 + fire * 0.23 + pop * 0.21) * 0.15 - policyReduction;
            const change = Math.round(impact * 10) / 10;
            const baseline = 63.8;
            const simulated = Math.round((baseline + change) * 10) / 10;

            const resultBox = document.getElementById('resultBox');
            const resultVal = document.getElementById('resultValue');
            resultVal.textContent = (change >= 0 ? '+' : '') + change + '%';
            resultVal.style.color = change >= 0 ? '#ef4444' : '#22c55e';
            resultBox.className = 'scenario-result-box' + (change < 0 ? ' positive' : '');

            document.getElementById('simValue').textContent = simulated + '%';
            document.getElementById('simValue').style.color = change >= 0 ? '#ef4444' : '#22c55e';

            const highChange = Math.round(change * 680);
            const medChange = Math.round(change * 260);
            const lowChange = -(highChange + medChange);
            document.getElementById('highZones').textContent = (highChange >= 0 ? '+' : '') + highChange.toLocaleString() + ' cells';
            document.getElementById('medZones').textContent = (medChange >= 0 ? '+' : '') + medChange.toLocaleString() + ' cells';
            document.getElementById('lowZones').textContent = lowChange.toLocaleString() + ' cells';
            document.getElementById('forestArea').textContent = '~' + Math.round(Math.abs(change) * 1960).toLocaleString() + ' km²';

            // Update chart
            if (projChart) {
                const simData = [baseline];
                for (let i = 1; i <= 10; i++) {
                    const progress = i / 10;
                    simData.push(Math.round((baseline + change * (0.3 + 0.7 * Math.pow(progress, 0.7))) * 10) / 10);
                }
                projChart.data.datasets[1].data = simData;
                projChart.data.datasets[1].borderColor = change >= 0 ? '#ef4444' : '#22c55e';
                projChart.data.datasets[1].backgroundColor = change >= 0 ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)';
                projChart.data.datasets[1].pointBackgroundColor = change >= 0 ? '#ef4444' : '#22c55e';
                projChart.update('none');
            }
        }

        function togglePolicy(el) {
            el.classList.toggle('active');
            el.querySelector('.toggle-switch').classList.toggle('active');
            updateScenario();
        }

        function setPreset(type) {
            const road = document.getElementById('roadSlider');
            const pop = document.getElementById('popSlider');
            const fire = document.getElementById('fireSlider');
            const policies = document.querySelectorAll('.policy-option');

            if (type === 'worst') {
                road.value = 80; pop.value = 60; fire.value = 50;
                policies.forEach(p => { p.classList.remove('active'); p.querySelector('.toggle-switch').classList.remove('active'); });
            } else if (type === 'best') {
                road.value = -40; pop.value = -20; fire.value = -30;
                policies.forEach(p => { p.classList.add('active'); p.querySelector('.toggle-switch').classList.add('active'); });
            } else if (type === 'current') {
                road.value = 20; pop.value = 15; fire.value = 10;
                policies[0].classList.add('active'); policies[0].querySelector('.toggle-switch').classList.add('active');
                for (let i = 1; i < policies.length; i++) { policies[i].classList.remove('active'); policies[i].querySelector('.toggle-switch').classList.remove('active'); }
            } else {
                road.value = 0; pop.value = 0; fire.value = 0;
                policies.forEach(p => { p.classList.remove('active'); p.querySelector('.toggle-switch').classList.remove('active'); });
            }
            updateScenario();
        }

        function applyToDashboard() {
            const road = parseInt(document.getElementById('roadSlider').value);
            const pop = parseInt(document.getElementById('popSlider').value);
            const fire = parseInt(document.getElementById('fireSlider').value);
            const policies = Array.from(document.querySelectorAll('.policy-option.active')).map(p => p.querySelector('.policy-label').textContent.trim());
            
            const simulationState = {
                road,
                pop,
                fire,
                policies,
                timestamp: Date.now()
            };
            
            localStorage.setItem('geoai_sim_state', JSON.stringify(simulationState));
            
            const btn = event.currentTarget;
            const originalText = btn.innerHTML;
            btn.innerHTML = '✅ Applied Successfully!';
            btn.style.background = '#22c55e';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                // Optional: redirect to dashboard
                // window.location.href = 'index.html';
            }, 2000);
        }

        initChart();
        updateScenario();

        // Hide loading
        window.addEventListener('load', () => {
            setTimeout(() => {
                const overlay = document.getElementById('loadingOverlay');
                if (overlay) overlay.classList.add('fade-out');
            }, 800);
        });
