#!/usr/bin/env node

/**
 * ================================
 * ECHO CHAMBER - WEB SERVER
 * ================================
 * 
 * A web-based interface for the Echo Chamber of Sequences.
 * Provides a RESTful API and modern HTML/CSS/JS frontend.
 * 
 * Run with: npm run web
 * Access at: http://localhost:3000
 */

const express = require('express');
const path = require('path');
const { EchoChamber } = require('./index.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Create a global chamber instance
const chamber = new EchoChamber();

/**
 * API Routes
 */

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Echo Chamber is running' });
});

/**
 * POST /api/predict
 * Predict the next number in a sequence
 * Request body: { sequence: [number, ...] }
 * Response: { success: boolean, nextNumber: number|null, difference: number|null, error: string|null }
 */
app.post('/api/predict', (req, res) => {
  try {
    const { sequence } = req.body;

    // Validate input
    if (!sequence) {
      return res.status(400).json({
        success: false,
        error: 'Sequence is required'
      });
    }

    if (!Array.isArray(sequence)) {
      return res.status(400).json({
        success: false,
        error: 'Sequence must be an array'
      });
    }

    if (sequence.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Sequence cannot be empty'
      });
    }

    // Validate all elements are numbers
    if (!sequence.every(num => typeof num === 'number' && isFinite(num))) {
      return res.status(400).json({
        success: false,
        error: 'All elements must be valid numbers'
      });
    }

    // Validate and predict
    const validation = chamber.validateArithmeticProgression(sequence);
    const prediction = chamber.predictNextNumber(sequence);

    res.json({
      success: prediction.success,
      nextNumber: prediction.nextNumber,
      difference: validation.difference,
      error: prediction.error,
      isValid: validation.isValid
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/echo
 * Store a sequence in memory and predict
 * Request body: { sequence: [number, ...] }
 * Response: { success: boolean, echo: object, memories: array }
 */
app.post('/api/echo', (req, res) => {
  try {
    const { sequence } = req.body;

    if (!sequence || !Array.isArray(sequence) || sequence.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid sequence array is required'
      });
    }

    // Process the sequence
    const echo = chamber.echo(sequence);

    res.json({
      success: echo.success,
      echo: {
        sequence: echo.sequence,
        prediction: echo.prediction,
        success: echo.success,
        error: echo.error,
        timestamp: echo.timestamp
      },
      memoryCount: chamber.getMemories().length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/memories
 * Get all stored memories
 * Response: { memories: array, count: number }
 */
app.get('/api/memories', (req, res) => {
  try {
    const memories = chamber.getMemories();
    res.json({
      memories: memories.map(m => ({
        sequence: m.sequence,
        prediction: m.prediction,
        success: m.success,
        error: m.error,
        timestamp: m.timestamp
      })),
      count: memories.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/memories/clear
 * Clear all stored memories
 * Response: { success: boolean, message: string }
 */
app.post('/api/memories/clear', (req, res) => {
  try {
    chamber.clearMemories();
    res.json({
      success: true,
      message: 'Memories cleared successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/demo
 * Get demo data with sample sequences
 * Response: { demos: array }
 */
app.get('/api/demo', (req, res) => {
  try {
    const demoSequences = [
      { sequence: [3, 6, 9, 12, 15], name: 'Multiples of 3' },
      { sequence: [2, 4, 6, 8], name: 'Even Numbers' },
      { sequence: [10, 20, 30, 40, 50], name: 'Tens' },
      { sequence: [5, 10, 15, 20], name: 'Multiples of 5' },
      { sequence: [1, 1, 1, 1], name: 'Constant Sequence' },
      { sequence: [100, 90, 80, 70], name: 'Decreasing by 10' },
      { sequence: [-5, -3, -1, 1, 3], name: 'Negative to Positive' },
      { sequence: [2, 3, 5, 7], name: 'Invalid (Fibonacci-like)' }
    ];

    const demos = demoSequences.map(demo => {
      const prediction = chamber.predictNextNumber(demo.sequence);
      return {
        name: demo.name,
        sequence: demo.sequence,
        prediction: prediction.nextNumber,
        success: prediction.success,
        error: prediction.error
      };
    });

    res.json({ demos });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET / (serves index.html)
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found'
  });
});

/**
 * Start the server
 */
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('    🏛️  ECHO CHAMBER WEB SERVER  🏛️');
  console.log('='.repeat(60) + '\n');
  console.log(`✨ Server running at: http://localhost:${PORT}`);
  console.log(`📊 API Documentation: http://localhost:${PORT}/api-docs.html`);
  console.log(`\n Press Ctrl+C to stop\n`);
  console.log('='.repeat(60) + '\n');
});

module.exports = app;
