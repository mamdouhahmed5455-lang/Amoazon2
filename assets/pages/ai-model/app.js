// ===== Feature Importance Bars =====
        // Values sourced from SSOT: scripts/constants.js GEOAI_CONSTANTS.FEATURE_IMPORTANCES
        // 41 + 23 + 21 + 15 = 100 (exactly)
        const features = (window.GEOAI_CONSTANTS && window.GEOAI_CONSTANTS.FEATURE_IMPORTANCES)
            ? window.GEOAI_CONSTANTS.FEATURE_IMPORTANCES
            : [
                { name: 'Road Proximity',        value: 41, color: '#ef4444' },
                { name: 'Forest Loss (Temporal)', value: 23, color: '#f97316' },
                { name: 'Population Pressure',   value: 21, color: '#eab308' },
                { name: 'Elevation Constraints', value: 15, color: '#3b82f6' }
            ];
        const sortedFeatures = [...features].sort((a, b) => b.value - a.value);

        const container = document.getElementById('featureBars');
        sortedFeatures.forEach((f, i) => {
            const row = document.createElement('div');
            row.className = 'feature-bar';
            row.innerHTML = `
                <div class="feature-bar-name">${f.name}</div>
                <div class="feature-bar-track">
                    <div class="feature-bar-fill" style="width: 0%; background: ${f.color};" data-width="${f.value}%"></div>
                </div>
                <div class="feature-bar-val">${f.value}%</div>
            `;
            container.appendChild(row);
        });

        // Animate bars
        setTimeout(() => {
            document.querySelectorAll('.feature-bar-fill').forEach(bar => {
                bar.style.width = bar.dataset.width;
            });
        }, 300);

        // ===== ROC Curve =====
        const rocCtx = document.getElementById('rocChart').getContext('2d');
        new Chart(rocCtx, {
            type: 'line',
            data: {
                labels: Array.from({length: 21}, (_, i) => (i * 0.05).toFixed(2)),
                datasets: [
                    {
                        label: 'ROC Curve (AUC = 0.82)',
                        data: [0, 0.15, 0.32, 0.48, 0.58, 0.65, 0.71, 0.76, 0.80, 0.83, 0.86, 0.88, 0.90, 0.92, 0.93, 0.95, 0.96, 0.97, 0.98, 0.99, 1.0],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 3,
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: '#3b82f6',
                    },
                    {
                        label: 'Random Classifier',
                        data: Array.from({length: 21}, (_, i) => i * 0.05),
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                        borderDash: [8, 4],
                        borderWidth: 1,
                        pointRadius: 0,
                        fill: false,
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: '#94a3b8',
                            font: { family: 'Inter', size: 11 }
                        }
                    }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'False Positive Rate', color: '#64748b', font: { family: 'Inter', size: 11 } },
                        grid: { color: 'rgba(255, 255, 255, 0.04)' },
                        ticks: { color: '#64748b', font: { size: 10 }, maxTicksLimit: 6 }
                    },
                    y: {
                        title: { display: true, text: 'True Positive Rate', color: '#64748b', font: { family: 'Inter', size: 11 } },
                        grid: { color: 'rgba(255, 255, 255, 0.04)' },
                        ticks: { color: '#64748b', font: { size: 10 } }
                    }
                }
            }
        });

        // ===== Neural Network Connections =====
        function drawNN() {
            const canvas = document.getElementById('nnCanvas');
            const ctx = canvas.getContext('2d');
            const wrapper = document.getElementById('nnWrapper');
            
            canvas.width = wrapper.clientWidth;
            canvas.height = wrapper.clientHeight;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.lineWidth = 1;
            
            const layers = document.querySelectorAll('.nn-layer');
            for (let i = 0; i < layers.length - 1; i++) {
                const nodes1 = layers[i].querySelectorAll('.nn-node');
                const nodes2 = layers[i+1].querySelectorAll('.nn-node');
                
                nodes1.forEach(n1 => {
                    const r1 = n1.getBoundingClientRect();
                    const rW = wrapper.getBoundingClientRect();
                    const x1 = r1.left - rW.left + r1.width / 2;
                    const y1 = r1.top - rW.top + r1.height / 2;
                    
                    nodes2.forEach(n2 => {
                        const r2 = n2.getBoundingClientRect();
                        const x2 = r2.left - rW.left + r2.width / 2;
                        const y2 = r2.top - rW.top + r2.height / 2;
                        
                        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
                        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
                        gradient.addColorStop(1, 'rgba(139, 92, 246, 0.1)');
                        
                        ctx.strokeStyle = gradient;
                        ctx.beginPath();
                        ctx.moveTo(x1, y1);
                        ctx.lineTo(x2, y2);
                        ctx.stroke();
                    });
                });
            }
        }

        window.addEventListener('load', () => {
            setTimeout(drawNN, 1000);
            setTimeout(() => {
                const overlay = document.getElementById('loadingOverlay');
                if (overlay) overlay.classList.add('fade-out');
            }, 500);
        });
        window.addEventListener('resize', drawNN);
        // Initialize Data Stream Background
        const dsCanvas = document.getElementById('dataStreamCanvas');
        if (dsCanvas) {
            const dctx = dsCanvas.getContext('2d');
            let dwidth, dheight;
            const columns = [];
            
            const resizeDS = () => {
                dwidth = dsCanvas.width = window.innerWidth;
                dheight = dsCanvas.height = window.innerHeight;
                columns.length = 0;
                for (let i = 0; i < dwidth / 20; i++) columns.push(Math.random() * dheight);
            };

            const drawDS = () => {
                dctx.fillStyle = 'rgba(3, 7, 18, 0.15)';
                dctx.fillRect(0, 0, dwidth, dheight);
                dctx.fillStyle = '#3b82f6';
                dctx.font = '10px monospace';
                columns.forEach((y, i) => {
                    const text = Math.random() > 0.5 ? '1' : '0';
                    dctx.fillText(text, i * 20, y);
                    columns[i] = y > dheight && Math.random() > 0.975 ? 0 : y + 15;
                });
                requestAnimationFrame(drawDS);
            };

            window.addEventListener('resize', resizeDS);
            resizeDS();
            drawDS();
        }
