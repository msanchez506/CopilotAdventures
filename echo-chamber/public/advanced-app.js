/**
 * ADVANCED ECHO CASTLE - FRONTEND JAVASCRIPT
 * Pattern recognition and visualization
 */

// Global state
const app = {
    currentChart: null,
    currentDemoChart: null,
    memories: [],
    isLoading: false
};

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadDemoSequences();
    loadPatterns();
});

// ==================== EVENT LISTENERS ====================

function initializeEventListeners() {
    // Tab Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', switchTab);
    });

    // Predict Tab
    document.getElementById('predict-btn').addEventListener('click', predictSequence);
    document.getElementById('echo-btn').addEventListener('click', echoSequence);
    document.getElementById('sequence-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') predictSequence();
    });

    // History Tab
    document.getElementById('load-memories-btn').addEventListener('click', loadMemories);
    document.getElementById('clear-memories-btn').addEventListener('click', clearMemories);
}

// ==================== TAB SWITCHING ====================

function switchTab(event) {
    const btn = event.currentTarget;
    const tabName = btn.getAttribute('data-tab');

    // Update active button
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Update active content
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab-content="${tabName}"]`).classList.add('active');
}

// ==================== PREDICTION ====================

async function predictSequence() {
    const input = document.getElementById('sequence-input').value;
    const sequence = parseSequence(input);

    if (!sequence) {
        showError('Invalid input format. Use comma-separated numbers (e.g., 1, 2, 3, 4)');
        return;
    }

    showLoading(true);

    try {
        const response = await fetch('/api/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sequence })
        });

        const result = await response.json();
        showLoading(false);

        if (result.success) {
            displayPredictionResult(result);
        } else {
            showError(result.error, result.suggestions);
        }
    } catch (error) {
        showLoading(false);
        showError('Network error: ' + error.message);
    }
}

async function echoSequence() {
    const input = document.getElementById('sequence-input').value;
    const sequence = parseSequence(input);

    if (!sequence) {
        showError('Invalid input format. Use comma-separated numbers');
        return;
    }

    showLoading(true);

    try {
        const response = await fetch('/api/echo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sequence })
        });

        const result = await response.json();
        showLoading(false);

        if (result.success) {
            displayPredictionResult(result);
            showNotification(`✨ Echoed and stored! (${result.memoryCount} memories)`);
        } else {
            showError(result.error);
        }
    } catch (error) {
        showLoading(false);
        showError('Network error: ' + error.message);
    }
}

// ==================== PARSING & VALIDATION ====================

function parseSequence(input) {
    try {
        const nums = input
            .split(',')
            .map(s => s.trim())
            .map(Number)
            .filter(n => !isNaN(n));

        if (nums.length < 2) return null;
        return nums;
    } catch (error) {
        return null;
    }
}

// ==================== RESULT DISPLAY ====================

function displayPredictionResult(result) {
    const container = document.getElementById('predict-result');
    const errorContainer = document.getElementById('predict-error');

    errorContainer.classList.add('hidden');
    container.classList.remove('hidden');

    // Update values
    document.getElementById('next-number').textContent = 
        typeof result.nextNumber === 'number' ? result.nextNumber.toFixed(2) : 'N/A';

    const patternType = result.pattern.type;
    const badge = document.getElementById('pattern-type');
    badge.textContent = formatPatternName(patternType);
    badge.className = `pattern-badge ${patternType}`;

    // Pattern details
    const detailsDiv = document.getElementById('pattern-details');
    detailsDiv.innerHTML = generatePatternDetailsHTML(result.pattern);

    // Draw chart
    drawPredictionChart(result.sequence, result.nextNumber, patternType);
}

function generatePatternDetailsHTML(pattern) {
    let html = `<h4>${formatPatternName(pattern.type)}</h4>`;
    html += `<p><strong>Description:</strong> ${pattern.description}</p>`;

    if (pattern.formula) {
        html += `<p><strong>Formula:</strong> <code>${pattern.formula}</code></p>`;
    }

    if (pattern.type === 'arithmetic' && pattern.commonDifference !== undefined) {
        html += `<p><strong>Common Difference:</strong> ${pattern.commonDifference}</p>`;
    }

    if (pattern.type === 'geometric' && pattern.commonRatio !== undefined) {
        html += `<p><strong>Common Ratio:</strong> ${pattern.commonRatio.toFixed(4)}</p>`;
    }

    if (pattern.type === 'polynomial') {
        html += `<p><strong>Degree:</strong> ${pattern.degree}</p>`;
        html += `<p><strong>Explanation:</strong> ${pattern.explanation}</p>`;
    }

    return html;
}

function showError(message, suggestion = '') {
    const errorContainer = document.getElementById('predict-error');
    const resultContainer = document.getElementById('predict-result');

    resultContainer.classList.add('hidden');
    errorContainer.classList.remove('hidden');

    document.getElementById('error-message').textContent = message;
    if (suggestion) {
        document.getElementById('error-suggestion').textContent = suggestion;
    }
}

// ==================== CHARTING ====================

function drawPredictionChart(sequence, nextNumber, patternType) {
    const ctx = document.getElementById('prediction-chart').getContext('2d');

    if (app.currentChart) {
        app.currentChart.destroy();
    }

    const extendedSequence = [...sequence, nextNumber];
    const labels = Array.from({length: extendedSequence.length}, (_, i) => `n=${i+1}`);

    const colorMap = {
        arithmetic: 'rgba(16, 185, 129, 0.7)',
        geometric: 'rgba(245, 158, 11, 0.7)',
        polynomial: 'rgba(6, 182, 212, 0.7)',
        fibonacci: 'rgba(236, 72, 153, 0.7)',
        unknown: 'rgba(107, 114, 128, 0.7)'
    };

    const borderColorMap = {
        arithmetic: 'rgb(16, 185, 129)',
        geometric: 'rgb(245, 158, 11)',
        polynomial: 'rgb(6, 182, 212)',
        fibonacci: 'rgb(236, 72, 153)',
        unknown: 'rgb(107, 114, 128)'
    };

    app.currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Sequence',
                data: sequence,
                borderColor: borderColorMap[patternType] || borderColorMap.unknown,
                backgroundColor: colorMap[patternType] || colorMap.unknown,
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7
            }, {
                label: 'Next Number',
                data: [...Array(sequence.length), nextNumber],
                borderColor: 'rgba(245, 158, 11, 1)',
                borderDash: [5, 5],
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                borderWidth: 2,
                fill: false,
                pointRadius: 8,
                pointBackgroundColor: 'rgba(245, 158, 11, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: { color: '#e5e7eb' }
                },
                title: {
                    display: true,
                    text: 'Sequence Visualization',
                    color: '#e5e7eb'
                }
            },
            scales: {
                y: {
                    ticks: { color: '#9ca3af' },
                    grid: { color: 'rgba(107, 114, 128, 0.2)' }
                },
                x: {
                    ticks: { color: '#9ca3af' },
                    grid: { color: 'rgba(107, 114, 128, 0.2)' }
                }
            }
        }
    });
}

// ==================== DEMO SEQUENCES ====================

async function loadDemoSequences() {
    try {
        const response = await fetch('/api/demo');
        const data = await response.json();

        const grid = document.getElementById('demo-grid');
        grid.innerHTML = '';

        data.demos.forEach((demo, index) => {
            const card = document.createElement('div');
            card.className = 'demo-card';
            card.innerHTML = `
                <h4>${demo.name}</h4>
                <p>${demo.description}</p>
                <div class="demo-sequence">${demo.sequence.join(', ')}</div>
            `;
            card.addEventListener('click', () => analyzeDemo(demo.sequence));
            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading demos:', error);
    }
}

async function analyzeDemo(sequence) {
    showLoading(true);

    try {
        const response = await fetch('/api/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sequence })
        });

        const result = await response.json();
        showLoading(false);

        if (result.success) {
            document.getElementById('sequence-input').value = sequence.join(', ');
            displayPredictionResult(result);
            switchTab({ currentTarget: document.querySelector('[data-tab="predict"]') });
        }
    } catch (error) {
        showLoading(false);
        showError('Error analyzing demo: ' + error.message);
    }
}

// ==================== PATTERNS INFO ====================

async function loadPatterns() {
    try {
        const response = await fetch('/api/patterns');
        const data = await response.json();

        const container = document.getElementById('patterns-container');
        container.innerHTML = '';

        Object.entries(data.patterns).forEach(([key, pattern]) => {
            const card = document.createElement('div');
            card.className = `pattern-card ${key}`;
            
            let html = `
                <h3>${pattern.name}</h3>
                <p>${pattern.description}</p>
                <div class="formula">${pattern.formula}</div>
                <p><strong>Example:</strong> ${pattern.example.join(', ')}</p>
                <h4>Key Properties</h4>
                <ul>
            `;

            pattern.properties.forEach(prop => {
                html += `<li>${prop}</li>`;
            });

            html += '</ul>';
            card.innerHTML = html;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading patterns:', error);
    }
}

// ==================== MEMORY MANAGEMENT ====================

async function loadMemories() {
    showLoading(true);

    try {
        const response = await fetch('/api/memories');
        const data = await response.json();

        showLoading(false);

        const memories = data.memories;
        const stats = data.statistics;

        // Show stats
        const statsDiv = document.getElementById('memories-stats');
        statsDiv.classList.remove('hidden');
        
        let statsHTML = '<div class="stats-grid">';
        statsHTML += `<div class="stat-item"><div class="stat-value">${memories.length}</div><div class="stat-label">Stored</div></div>`;
        
        Object.entries(stats.patterns).forEach(([type, count]) => {
            statsHTML += `<div class="stat-item"><div class="stat-value">${count}</div><div class="stat-label">${formatPatternName(type)}</div></div>`;
        });
        
        statsHTML += '</div>';
        document.getElementById('stats-content').innerHTML = statsHTML;

        // Show memories
        const memoriesList = document.getElementById('memories-list');
        const memoriesContent = document.getElementById('memories-content');
        const emptyState = document.getElementById('history-empty');

        if (memories.length === 0) {
            memoriesList.classList.add('hidden');
            emptyState.classList.remove('hidden');
        } else {
            memoriesList.classList.remove('hidden');
            emptyState.classList.add('hidden');

            let html = '';
            memories.forEach((memory, index) => {
                html += `
                    <div class="memory-item">
                        <div class="memory-sequence">[${memory.sequence.join(', ')}] → ${memory.prediction}</div>
                        <div class="memory-meta">
                            <span>Pattern: <strong>${formatPatternName(memory.patternType)}</strong></span>
                            <span>Time: ${new Date(memory.timestamp).toLocaleString()}</span>
                        </div>
                    </div>
                `;
            });
            memoriesContent.innerHTML = html;
        }
    } catch (error) {
        showLoading(false);
        showError('Error loading memories: ' + error.message);
    }
}

async function clearMemories() {
    if (!confirm('Are you sure? This will delete all stored sequences.')) {
        return;
    }

    showLoading(true);

    try {
        const response = await fetch('/api/memories/clear', {
            method: 'POST'
        });

        const data = await response.json();
        showLoading(false);

        if (data.success) {
            showNotification('🔥 All memories cleared');
            loadMemories();
        }
    } catch (error) {
        showLoading(false);
        showError('Error clearing memories: ' + error.message);
    }
}

// ==================== UI HELPERS ====================

function formatPatternName(type) {
    const names = {
        arithmetic: '📈 Arithmetic',
        geometric: '📊 Geometric',
        polynomial: '📐 Polynomial',
        fibonacci: '🔗 Fibonacci'
    };
    return names[type] || type;
}

function showLoading(show) {
    const loading = document.getElementById('loading');
    app.isLoading = show;
    
    if (show) {
        loading.classList.remove('hidden');
    } else {
        loading.classList.add('hidden');
    }
}

function showNotification(message) {
    // Simple notification (could be enhanced)
    console.log('✅ ' + message);
}

// ==================== UTILITY ====================

function getPatternColor(type) {
    const colors = {
        arithmetic: '--pattern-arithmetic',
        geometric: '--pattern-geometric',
        polynomial: '--pattern-polynomial',
        fibonacci: '--pattern-fibonacci'
    };
    return colors[type] || '--castle-stone';
}
