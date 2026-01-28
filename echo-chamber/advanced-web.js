#!/usr/bin/env node

/**
 * ENHANCED ECHO CHAMBER WEB SERVER
 * Advanced pattern recognition with beautiful Echo Castle theme
 */

const express = require('express');
const path = require('path');
const { EnhancedEchoChamber } = require('./advanced-patterns');

// Logger utility
const logger = {
  log: (msg, type = 'INFO') => {
    const timestamp = new Date().toISOString();
    const colors = {
      INFO: '\x1b[36m',
      ERROR: '\x1b[31m',
      SUCCESS: '\x1b[32m',
      WARN: '\x1b[33m',
      RESET: '\x1b[0m'
    };
    console.log(`${colors[type]}[${type}] ${timestamp}: ${msg}${colors.RESET}`);
  }
};

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize chamber
const chamber = new EnhancedEchoChamber();

// Error handling wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ==================== API ENDPOINTS ====================

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Echo Chamber is running',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    features: ['arithmetic', 'geometric', 'polynomial', 'fibonacci']
  });
});

/**
 * Analyze a sequence (no storage)
 */
app.post('/api/predict', asyncHandler(async (req, res) => {
  const { sequence } = req.body;

  if (!Array.isArray(sequence)) {
    return res.status(400).json({
      success: false,
      error: 'Sequence must be an array',
      nextNumber: null
    });
  }

  try {
    const result = chamber.analyze(sequence, false);
    
    res.json({
      success: result.success,
      sequence: sequence,
      nextNumber: result.nextNumber,
      pattern: result.pattern,
      error: result.error,
      suggestions: result.suggestions
    });

    if (result.success) {
      logger.log(`Predicted pattern type: ${result.pattern.type}`, 'SUCCESS');
    }
  } catch (error) {
    logger.log(`Prediction error: ${error.message}`, 'ERROR');
    res.status(500).json({
      success: false,
      error: 'Internal server error during prediction',
      nextNumber: null
    });
  }
}));

/**
 * Analyze and store a sequence (with memory)
 */
app.post('/api/echo', asyncHandler(async (req, res) => {
  const { sequence } = req.body;

  if (!Array.isArray(sequence)) {
    return res.status(400).json({
      success: false,
      error: 'Sequence must be an array',
      nextNumber: null
    });
  }

  try {
    const result = chamber.analyze(sequence, true);

    res.json({
      success: result.success,
      sequence: sequence,
      nextNumber: result.nextNumber,
      pattern: result.pattern,
      error: result.error,
      stored: result.success,
      memoryCount: chamber.getMemories().length
    });

    if (result.success) {
      logger.log(`Echoed and stored: ${result.pattern.type} pattern`, 'SUCCESS');
    }
  } catch (error) {
    logger.log(`Echo error: ${error.message}`, 'ERROR');
    res.status(500).json({
      success: false,
      error: 'Internal server error during echo',
      nextNumber: null
    });
  }
}));

/**
 * Get all stored memories
 */
app.get('/api/memories', (req, res) => {
  try {
    const memories = chamber.getMemories();
    const stats = chamber.getMemoryStats();

    res.json({
      success: true,
      memories: memories,
      statistics: stats,
      totalMemories: memories.length
    });

    logger.log(`Retrieved ${memories.length} memories`, 'INFO');
  } catch (error) {
    logger.log(`Memory retrieval error: ${error.message}`, 'ERROR');
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve memories'
    });
  }
});

/**
 * Get memory by ID
 */
app.get('/api/memories/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const memories = chamber.getMemories();
    const memory = memories[id];

    if (!memory) {
      return res.status(404).json({
        success: false,
        error: 'Memory not found'
      });
    }

    res.json({
      success: true,
      memory: memory,
      id: id
    });
  } catch (error) {
    logger.log(`Memory lookup error: ${error.message}`, 'ERROR');
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve memory'
    });
  }
});

/**
 * Get historical analysis
 */
app.get('/api/history', (req, res) => {
  try {
    const analysis = chamber.getHistoryAnalysis();
    const history = chamber.getFullHistory();

    res.json({
      success: true,
      analysis: analysis,
      history: history
    });

    logger.log('Retrieved historical analysis', 'INFO');
  } catch (error) {
    logger.log(`History error: ${error.message}`, 'ERROR');
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve history'
    });
  }
});

/**
 * Clear all memories
 */
app.post('/api/memories/clear', (req, res) => {
  try {
    chamber.clearMemories();

    res.json({
      success: true,
      message: 'All memories cleared',
      memoriesRemaining: chamber.getMemories().length
    });

    logger.log('Cleared all memories', 'WARN');
  } catch (error) {
    logger.log(`Clear error: ${error.message}`, 'ERROR');
    res.status(500).json({
      success: false,
      error: 'Failed to clear memories'
    });
  }
});

/**
 * Get demo sequences
 */
app.get('/api/demo', (req, res) => {
  const demos = [
    {
      name: 'Arithmetic Progression',
      sequence: [2, 4, 6, 8, 10],
      description: 'Constant difference of 2'
    },
    {
      name: 'Geometric Progression',
      sequence: [2, 6, 18, 54, 162],
      description: 'Constant ratio of 3'
    },
    {
      name: 'Perfect Squares (Quadratic)',
      sequence: [1, 4, 9, 16, 25],
      description: 'n² progression'
    },
    {
      name: 'Fibonacci Sequence',
      sequence: [1, 1, 2, 3, 5, 8, 13],
      description: 'Each term is sum of previous two'
    },
    {
      name: 'Cubic Sequence',
      sequence: [1, 8, 27, 64],
      description: 'n³ progression'
    },
    {
      name: 'Powers of 2',
      sequence: [1, 2, 4, 8, 16],
      description: 'Exponential growth'
    },
    {
      name: 'Declining Geometric',
      sequence: [100, 50, 25, 12.5],
      description: 'Constant ratio of 0.5'
    },
    {
      name: 'Mixed Arithmetic',
      sequence: [10, 7, 4, 1, -2],
      description: 'Negative constant difference'
    }
  ];

  res.json({
    success: true,
    demos: demos,
    total: demos.length
  });

  logger.log('Returned demo sequences', 'INFO');
});

/**
 * Pattern information endpoint
 */
app.get('/api/patterns', (req, res) => {
  const patterns = {
    arithmetic: {
      name: 'Arithmetic Progression',
      description: 'Sequence with constant difference between consecutive terms',
      formula: 'a_n = a_1 + (n-1)d',
      example: [2, 4, 6, 8],
      properties: ['Linear growth', 'Constant difference', 'a_n - a_(n-1) = d']
    },
    geometric: {
      name: 'Geometric Progression',
      description: 'Sequence with constant ratio between consecutive terms',
      formula: 'a_n = a_1 × r^(n-1)',
      example: [2, 6, 18, 54],
      properties: ['Exponential growth', 'Constant ratio', 'a_n / a_(n-1) = r']
    },
    polynomial: {
      name: 'Polynomial Sequence',
      description: 'Sequence with nth-order polynomial differences',
      formula: 'a_n = c_n × n^k + ...',
      example: [1, 4, 9, 16, 25],
      properties: ['Non-linear growth', 'Constant nth differences', 'Degree detection']
    },
    fibonacci: {
      name: 'Fibonacci-like',
      description: 'Sequence where each term is sum of previous two',
      formula: 'a_n = a_(n-1) + a_(n-2)',
      example: [1, 1, 2, 3, 5, 8],
      properties: ['Recursive definition', 'Natural growth', 'Golden ratio convergence']
    }
  };

  res.json({
    success: true,
    patterns: patterns
  });
});

/**
 * Test multiple sequences
 */
app.post('/api/batch-predict', asyncHandler(async (req, res) => {
  const { sequences } = req.body;

  if (!Array.isArray(sequences)) {
    return res.status(400).json({
      success: false,
      error: 'sequences must be an array of arrays',
      results: []
    });
  }

  try {
    const results = sequences.map((seq, index) => {
      const result = chamber.analyze(seq, false);
      return {
        index: index,
        success: result.success,
        sequence: seq,
        nextNumber: result.nextNumber,
        pattern: result.pattern,
        error: result.error
      };
    });

    res.json({
      success: true,
      totalProcessed: sequences.length,
      successfulPredictions: results.filter(r => r.success).length,
      results: results
    });

    logger.log(`Batch processed ${sequences.length} sequences`, 'SUCCESS');
  } catch (error) {
    logger.log(`Batch error: ${error.message}`, 'ERROR');
    res.status(500).json({
      success: false,
      error: 'Batch processing failed',
      results: []
    });
  }
}));

// ==================== ERROR HANDLING ====================

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
  logger.log(`Unhandled error: ${err.message}`, 'ERROR');
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Unknown error'
  });
});

// ==================== SERVER STARTUP ====================

const server = app.listen(PORT, () => {
  console.clear();
  console.log('');
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║      🏛️  ECHO CASTLE - ADVANCED PATTERNS  🏛️         ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`✨ Server running at: http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs.html`);
  console.log(`🎯 Web Interface: http://localhost:${PORT}`);
  console.log('');
  console.log('📊 Supported Patterns:');
  console.log('   • Arithmetic Progressions (constant difference)');
  console.log('   • Geometric Progressions (constant ratio)');
  console.log('   • Polynomial Sequences (quadratic, cubic, etc.)');
  console.log('   • Fibonacci-like Sequences (sum of previous two)');
  console.log('');
  console.log('📌 Available Endpoints:');
  console.log('   POST   /api/predict          - Predict next number');
  console.log('   POST   /api/echo             - Predict and store');
  console.log('   GET    /api/memories         - Get stored sequences');
  console.log('   GET    /api/history          - Get historical analysis');
  console.log('   POST   /api/memories/clear   - Clear all memories');
  console.log('   GET    /api/demo             - Get demo sequences');
  console.log('   GET    /api/patterns         - Get pattern info');
  console.log('   POST   /api/batch-predict    - Analyze multiple sequences');
  console.log('   GET    /api/health           - Health check');
  console.log('');
  console.log('💾 Press Ctrl+C to stop');
  console.log('');
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('');

  logger.log(`Echo Castle initialized on port ${PORT}`, 'SUCCESS');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n');
  logger.log('Shutting down Echo Castle...', 'WARN');
  server.close(() => {
    logger.log('Server stopped', 'INFO');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  logger.log('SIGTERM received, shutting down', 'WARN');
  server.close(() => {
    process.exit(0);
  });
});

module.exports = app;
