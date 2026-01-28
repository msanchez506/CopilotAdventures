/**
 * Echo Chamber Web Interface - Client-side JavaScript
 * Handles all interactions and API calls
 */

// DOM Elements
const sequenceInput = document.getElementById('sequenceInput');
const predictBtn = document.getElementById('predictBtn');
const echoBtn = document.getElementById('echoBtn');
const resultContainer = document.getElementById('resultContainer');
const resultContent = document.getElementById('resultContent');
const errorContainer = document.getElementById('errorContainer');
const errorContent = document.getElementById('errorContent');
const runDemoBtn = document.getElementById('runDemoBtn');
const demoContainer = document.getElementById('demoContainer');
const demoResults = document.getElementById('demoResults');
const loadMemoriesBtn = document.getElementById('loadMemoriesBtn');
const clearMemoriesBtn = document.getElementById('clearMemoriesBtn');
const memoriesContainer = document.getElementById('memoriesContainer');
const memoriesSummary = document.getElementById('memoriesSummary');
const memoriesList = document.getElementById('memoriesList');
const emptyMemories = document.getElementById('emptyMemories');
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

/**
 * API Base URL
 */
const API_BASE = '/api';

/**
 * Tab Navigation
 */
tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const tabName = button.getAttribute('data-tab');
    
    // Update active tab button
    tabButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Update active tab content
    tabContents.forEach(content => content.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
  });
});

/**
 * Parse sequence string to array of numbers
 */
function parseSequence(input) {
  if (!input || typeof input !== 'string') {
    throw new Error('Invalid input');
  }

  const numbers = input
    .split(',')
    .map(str => {
      const num = parseFloat(str.trim());
      if (isNaN(num)) {
        throw new Error(`"${str.trim()}" is not a valid number`);
      }
      return num;
    });

  if (numbers.length === 0) {
    throw new Error('Please enter at least one number');
  }

  return numbers;
}

/**
 * Format number for display
 */
function formatNumber(num) {
  return typeof num === 'number' ? num.toLocaleString() : 'N/A';
}

/**
 * Show result message
 */
function showResult(success, nextNumber, difference) {
  hideErrors();
  
  if (success) {
    resultContent.innerHTML = `
      <h3>✨ The Chamber Echoes ✨</h3>
      <p>The next number in your sequence is:</p>
      <p class="next-number">${formatNumber(nextNumber)}</p>
      <p>Pattern confirmed! Each step changes by <span class="difference">${formatNumber(difference)}</span></p>
    `;
    resultContainer.classList.remove('hidden');
  }
}

/**
 * Show error message
 */
function showError(message) {
  hideResults();
  
  errorContent.innerHTML = `
    <h3>⚠️ Chamber Cannot Predict</h3>
    <p>${message}</p>
  `;
  errorContainer.classList.remove('hidden');
}

/**
 * Hide result container
 */
function hideResults() {
  resultContainer.classList.add('hidden');
}

/**
 * Hide error container
 */
function hideErrors() {
  errorContainer.classList.add('hidden');
}

/**
 * Predict next number (without storing)
 */
async function predict() {
  try {
    hideResults();
    hideErrors();
    
    const input = sequenceInput.value.trim();
    if (!input) {
      showError('Please enter a sequence');
      return;
    }

    const sequence = parseSequence(input);

    // Show loading state
    predictBtn.disabled = true;
    predictBtn.innerHTML = '<span class="spinner"></span> Predicting...';

    const response = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sequence })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      showResult(true, data.nextNumber, data.difference);
    } else {
      showError(data.error || 'Unable to predict');
    }
  } catch (error) {
    showError(error.message);
  } finally {
    predictBtn.disabled = false;
    predictBtn.innerHTML = 'Predict';
  }
}

/**
 * Echo and store sequence
 */
async function echo() {
  try {
    hideResults();
    hideErrors();
    
    const input = sequenceInput.value.trim();
    if (!input) {
      showError('Please enter a sequence');
      return;
    }

    const sequence = parseSequence(input);

    // Show loading state
    echoBtn.disabled = true;
    echoBtn.innerHTML = '<span class="spinner"></span> Echoing...';

    const response = await fetch(`${API_BASE}/echo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sequence })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      showResult(true, data.echo.prediction, null);
      resultContent.innerHTML += `<p><small>✓ Sequence stored in memory (${data.memoryCount} total)</small></p>`;
      sequenceInput.value = '';
    } else {
      showError(data.error || 'Unable to echo');
    }
  } catch (error) {
    showError(error.message);
  } finally {
    echoBtn.disabled = false;
    echoBtn.innerHTML = 'Echo & Store';
  }
}

/**
 * Run demo with sample sequences
 */
async function runDemo() {
  try {
    demoContainer.classList.add('hidden');
    runDemoBtn.disabled = true;
    runDemoBtn.innerHTML = '<span class="spinner"></span> Running Demo...';

    const response = await fetch(`${API_BASE}/demo`);
    const data = await response.json();

    if (response.ok && data.demos) {
      demoResults.innerHTML = '';
      
      data.demos.forEach((demo, index) => {
        const statusClass = demo.success ? 'success' : 'error';
        const statusIcon = demo.success ? '✓' : '✗';
        const resultText = demo.success 
          ? `→ <strong>${formatNumber(demo.prediction)}</strong>`
          : `⚠ ${demo.error}`;

        const demoItem = document.createElement('div');
        demoItem.className = 'demo-item';
        demoItem.innerHTML = `
          <h4>${statusIcon} ${demo.name}</h4>
          <div class="sequence">[${demo.sequence.join(', ')}]</div>
          <div class="result ${statusClass}">${resultText}</div>
        `;
        demoResults.appendChild(demoItem);
      });

      demoContainer.classList.remove('hidden');
    } else {
      showError('Unable to load demo data');
    }
  } catch (error) {
    showError('Error running demo: ' + error.message);
  } finally {
    runDemoBtn.disabled = false;
    runDemoBtn.innerHTML = 'Run Demo';
  }
}

/**
 * Load and display memories
 */
async function loadMemories() {
  try {
    loadMemoriesBtn.disabled = true;
    loadMemoriesBtn.innerHTML = '<span class="spinner"></span> Loading...';

    const response = await fetch(`${API_BASE}/memories`);
    const data = await response.json();

    if (response.ok) {
      if (data.count === 0) {
        emptyMemories.classList.remove('hidden');
        memoriesContainer.classList.add('hidden');
      } else {
        emptyMemories.classList.add('hidden');
        memoriesSummary.innerHTML = `
          <h3>✨ ${data.count} Echo${data.count !== 1 ? 's' : ''}</h3>
          <p>The Chamber holds these memories</p>
        `;

        memoriesList.innerHTML = '';
        data.memories.forEach((memory, index) => {
          const statusIcon = memory.success ? '✓' : '✗';
          const resultText = memory.success
            ? `→ <strong>${formatNumber(memory.prediction)}</strong>`
            : `⚠ ${memory.error}`;
          
          const memoryItem = document.createElement('div');
          memoryItem.className = 'memory-item';
          memoryItem.innerHTML = `
            <div style="margin-bottom: 8px;">
              <strong>${statusIcon} Echo ${index + 1}</strong>
            </div>
            <div class="sequence">[${memory.sequence.join(', ')}]</div>
            <div class="prediction">${resultText}</div>
            <div class="timestamp">📅 ${new Date(memory.timestamp).toLocaleString()}</div>
          `;
          memoriesList.appendChild(memoryItem);
        });

        memoriesContainer.classList.remove('hidden');
      }
    } else {
      showError('Unable to load memories');
    }
  } catch (error) {
    showError('Error loading memories: ' + error.message);
  } finally {
    loadMemoriesBtn.disabled = false;
    loadMemoriesBtn.innerHTML = 'Load Memories';
  }
}

/**
 * Clear all memories
 */
async function clearMemories() {
  try {
    if (!confirm('Are you sure? This will clear all stored memories.')) {
      return;
    }

    clearMemoriesBtn.disabled = true;
    clearMemoriesBtn.innerHTML = '<span class="spinner"></span> Clearing...';

    const response = await fetch(`${API_BASE}/memories/clear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (response.ok) {
      emptyMemories.classList.remove('hidden');
      memoriesContainer.classList.add('hidden');
    } else {
      showError('Unable to clear memories');
    }
  } catch (error) {
    showError('Error clearing memories: ' + error.message);
  } finally {
    clearMemoriesBtn.disabled = false;
    clearMemoriesBtn.innerHTML = 'Clear All';
  }
}

/**
 * Event Listeners
 */
predictBtn.addEventListener('click', predict);
echoBtn.addEventListener('click', echo);
runDemoBtn.addEventListener('click', runDemo);
loadMemoriesBtn.addEventListener('click', loadMemories);
clearMemoriesBtn.addEventListener('click', clearMemories);

/**
 * Allow Enter key in input
 */
sequenceInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    predict();
  }
});

/**
 * Initialize
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('🏛️ Echo Chamber Web Interface loaded');
  // Load memories on startup
  loadMemories();
});
