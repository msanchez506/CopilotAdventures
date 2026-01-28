#!/usr/bin/env node

/**
 * ================================
 * ADVANCED PATTERN RECOGNITION SYSTEM
 * ================================
 * 
 * Enhanced Echo Chamber with support for:
 * - Arithmetic Progressions (constant difference)
 * - Geometric Progressions (constant ratio)
 * - Polynomial Sequences (quadratic, cubic, etc.)
 * - Fibonacci-like sequences
 * - Custom patterns
 * 
 * Author: GitHub Copilot Adventures
 */

const EPSILON = 1e-10;

/**
 * SequenceAnalyzer - Advanced pattern recognition for mathematical sequences
 */
class SequenceAnalyzer {
  constructor() {
    this.patterns = [];
  }

  /**
   * Detect the type of sequence and return pattern info
   * @param {number[]} sequence
   * @returns {object} - Pattern details including type and parameters
   */
  detectPattern(sequence) {
    if (!Array.isArray(sequence) || sequence.length < 2) {
      return { type: 'invalid', error: 'Sequence too short' };
    }

    // Try Fibonacci FIRST (before polynomial)
    const fibonacci = this.analyzeFibonacci(sequence);
    if (fibonacci.isValid) return fibonacci;

    // Try arithmetic second
    const arithmetic = this.analyzeArithmetic(sequence);
    if (arithmetic.isValid) return arithmetic;

    // Try geometric
    const geometric = this.analyzeGeometric(sequence);
    if (geometric.isValid) return geometric;

    // Try polynomial last
    const polynomial = this.analyzePolynomial(sequence);
    if (polynomial.isValid) return polynomial;

    return { type: 'unknown', error: 'No pattern detected' };
  }

  /**
   * Analyze arithmetic progression (constant difference)
   * @param {number[]} sequence
   * @returns {object}
   */
  analyzeArithmetic(sequence) {
    if (sequence.length < 2) {
      return { isValid: false };
    }

    const differences = [];
    for (let i = 1; i < sequence.length; i++) {
      differences.push(sequence[i] - sequence[i - 1]);
    }

    // Check if all differences are equal (within EPSILON for floats)
    const firstDiff = differences[0];
    const isArithmetic = differences.every(d => Math.abs(d - firstDiff) < EPSILON);

    if (isArithmetic) {
      return {
        type: 'arithmetic',
        isValid: true,
        commonDifference: firstDiff,
        nextNumber: sequence[sequence.length - 1] + firstDiff,
        firstTerm: sequence[0],
        lastTerm: sequence[sequence.length - 1],
        termCount: sequence.length,
        formula: `a_n = ${sequence[0]} + (n-1) × ${firstDiff}`,
        description: `Arithmetic progression with common difference: ${firstDiff}`
      };
    }

    return { isValid: false };
  }

  /**
   * Analyze geometric progression (constant ratio)
   * @param {number[]} sequence
   * @returns {object}
   */
  analyzeGeometric(sequence) {
    if (sequence.length < 2) {
      return { isValid: false };
    }

    // Avoid division by zero
    if (sequence.some(n => Math.abs(n) < EPSILON)) {
      return { isValid: false };
    }

    const ratios = [];
    for (let i = 1; i < sequence.length; i++) {
      ratios.push(sequence[i] / sequence[i - 1]);
    }

    // Check if all ratios are equal
    const firstRatio = ratios[0];
    const isGeometric = ratios.every(r => Math.abs(r - firstRatio) < EPSILON);

    if (isGeometric) {
      return {
        type: 'geometric',
        isValid: true,
        commonRatio: firstRatio,
        nextNumber: sequence[sequence.length - 1] * firstRatio,
        firstTerm: sequence[0],
        lastTerm: sequence[sequence.length - 1],
        termCount: sequence.length,
        formula: `a_n = ${sequence[0]} × ${firstRatio}^(n-1)`,
        description: `Geometric progression with common ratio: ${firstRatio}`
      };
    }

    return { isValid: false };
  }

  /**
   * Analyze polynomial sequences (differences of differences)
   * @param {number[]} sequence
   * @returns {object}
   */
  analyzePolynomial(sequence) {
    if (sequence.length < 3) {
      return { isValid: false };
    }

    const analysis = this.findDifferencePattern(sequence, 0);

    if (analysis.degree > 0 && analysis.degree < 6) {
      const nextNum = this.predictPolynomial(sequence, analysis);
      return {
        type: 'polynomial',
        isValid: true,
        degree: analysis.degree,
        nextNumber: nextNum,
        differences: analysis.differences,
        description: `Polynomial sequence of degree ${analysis.degree}`,
        explanation: this.getPolynomialExplanation(analysis.degree)
      };
    }

    return { isValid: false };
  }

  /**
   * Recursively find difference pattern
   * @param {number[]} sequence
   * @param {number} depth - Current depth of differences
   * @returns {object}
   */
  findDifferencePattern(sequence, depth = 0) {
    if (sequence.length < 2 || depth > 5) {
      return { degree: 0, differences: [] };
    }

    const differences = [];
    for (let i = 1; i < sequence.length; i++) {
      differences.push(sequence[i] - sequence[i - 1]);
    }

    // Check if all differences are constant
    const firstDiff = differences[0];
    const isConstant = differences.every(d => Math.abs(d - firstDiff) < EPSILON);

    if (isConstant) {
      return {
        degree: depth + 1,
        differences: [sequence, ...Array(depth).fill(null).map((_, i) => differences)]
      };
    }

    // Recurse on differences
    return this.findDifferencePattern(differences, depth + 1);
  }

  /**
   * Predict next value in polynomial sequence
   * @param {number[]} sequence
   * @param {object} analysis - Result from findDifferencePattern
   * @returns {number}
   */
  predictPolynomial(sequence, analysis) {
    // Build the difference table
    const table = [sequence];
    let current = sequence;

    for (let i = 0; i < analysis.degree; i++) {
      const next = [];
      for (let j = 1; j < current.length; j++) {
        next.push(current[j] - current[j - 1]);
      }
      table.push(next);
      current = next;
    }

    // Extend the last row (all same values)
    const lastRow = table[table.length - 1];
    if (lastRow.length > 0) {
      lastRow.push(lastRow[lastRow.length - 1]);
    }

    // Work backwards to fill in the next value
    for (let i = table.length - 2; i >= 0; i--) {
      const lastVal = table[i][table[i].length - 1];
      const diffVal = table[i + 1][table[i + 1].length - 1];
      table[i].push(lastVal + diffVal);
    }

    return table[0][table[0].length - 1];
  }

  /**
   * Analyze Fibonacci-like sequences
   * @param {number[]} sequence
   * @returns {object}
   */
  analyzeFibonacci(sequence) {
    if (sequence.length < 3) {
      return { isValid: false };
    }

    // Check if each term is sum of previous two
    let isFibonacci = true;
    for (let i = 2; i < sequence.length; i++) {
      if (Math.abs(sequence[i] - (sequence[i - 1] + sequence[i - 2])) > EPSILON) {
        isFibonacci = false;
        break;
      }
    }

    if (isFibonacci) {
      const nextNumber = sequence[sequence.length - 1] + sequence[sequence.length - 2];
      return {
        type: 'fibonacci',
        isValid: true,
        nextNumber: nextNumber,
        description: 'Fibonacci-like sequence (each term is sum of previous two)',
        formula: 'a_n = a_(n-1) + a_(n-2)'
      };
    }

    return { isValid: false };
  }

  /**
   * Get human-readable explanation for polynomial degree
   * @param {number} degree
   * @returns {string}
   */
  getPolynomialExplanation(degree) {
    const explanations = {
      1: 'Linear sequence (first differences are constant)',
      2: 'Quadratic sequence (second differences are constant)',
      3: 'Cubic sequence (third differences are constant)',
      4: 'Quartic sequence (fourth differences are constant)',
      5: 'Quintic sequence (fifth differences are constant)'
    };
    return explanations[degree] || `Polynomial of degree ${degree}`;
  }
}

/**
 * HistoricalAnalyzer - Track and analyze sequences over time
 */
class HistoricalAnalyzer {
  constructor() {
    this.history = [];
  }

  /**
   * Record a sequence analysis
   * @param {number[]} sequence
   * @param {object} pattern
   * @param {object} prediction
   */
  recordAnalysis(sequence, pattern, prediction) {
    this.history.push({
      timestamp: new Date().toISOString(),
      sequence: sequence,
      pattern: pattern,
      prediction: prediction,
      id: this.history.length + 1
    });
  }

  /**
   * Get statistics about analyzed sequences
   * @returns {object}
   */
  getStatistics() {
    const patternTypes = {};
    let totalSequences = this.history.length;
    let avgLength = 0;

    this.history.forEach(entry => {
      const type = entry.pattern.type;
      patternTypes[type] = (patternTypes[type] || 0) + 1;
      avgLength += entry.sequence.length;
    });

    avgLength = totalSequences > 0 ? avgLength / totalSequences : 0;

    return {
      totalAnalyzed: totalSequences,
      patternDistribution: patternTypes,
      averageSequenceLength: avgLength.toFixed(2),
      mostCommonPattern: Object.entries(patternTypes).sort((a, b) => b[1] - a[1])[0]?.[0],
      successRate: totalSequences > 0 ? 
        (this.history.filter(e => e.pattern.isValid).length / totalSequences * 100).toFixed(2) + '%' : 
        'N/A'
    };
  }

  /**
   * Get all history
   */
  getHistory() {
    return this.history;
  }

  /**
   * Get history filtered by pattern type
   */
  getHistoryByType(type) {
    return this.history.filter(e => e.pattern.type === type);
  }

  /**
   * Clear history
   */
  clearHistory() {
    this.history = [];
  }
}

/**
 * EnhancedEchoChamber - Main class combining all features
 */
class EnhancedEchoChamber {
  constructor() {
    this.analyzer = new SequenceAnalyzer();
    this.historian = new HistoricalAnalyzer();
    this.memories = [];
  }

  /**
   * Analyze and predict the next number in a sequence
   * @param {number[]} sequence
   * @param {boolean} storeMemory - Whether to store in memory
   * @returns {object}
   */
  analyze(sequence, storeMemory = true) {
    // Validate input
    if (!Array.isArray(sequence) || sequence.length < 2) {
      return {
        success: false,
        error: 'Sequence must be an array with at least 2 numbers',
        nextNumber: null,
        pattern: null
      };
    }

    // Check all values are numbers
    if (!sequence.every(n => typeof n === 'number' && !isNaN(n))) {
      return {
        success: false,
        error: 'All sequence values must be valid numbers',
        nextNumber: null,
        pattern: null
      };
    }

    // Detect pattern
    const pattern = this.analyzer.detectPattern(sequence);

    if (!pattern.isValid && pattern.type === 'unknown') {
      return {
        success: false,
        error: 'Could not detect a mathematical pattern in this sequence',
        nextNumber: null,
        pattern: null,
        suggestions: 'Try sequences with: constant differences (arithmetic), constant ratios (geometric), or polynomial patterns'
      };
    }

    const result = {
      success: true,
      sequence: sequence,
      nextNumber: pattern.nextNumber,
      pattern: pattern,
      error: null
    };

    // Store memory if requested
    if (storeMemory) {
      this.memories.push({
        timestamp: new Date().toISOString(),
        sequence: sequence,
        prediction: pattern.nextNumber,
        patternType: pattern.type
      });
      this.historian.recordAnalysis(sequence, pattern, pattern.nextNumber);
    }

    return result;
  }

  /**
   * Get all memories
   */
  getMemories() {
    return this.memories;
  }

  /**
   * Get memory statistics
   */
  getMemoryStats() {
    return {
      totalMemories: this.memories.length,
      patterns: this.memories.reduce((acc, m) => {
        acc[m.patternType] = (acc[m.patternType] || 0) + 1;
        return acc;
      }, {})
    };
  }

  /**
   * Clear all memories
   */
  clearMemories() {
    this.memories = [];
    this.historian.clearHistory();
  }

  /**
   * Get historical analysis
   */
  getHistoryAnalysis() {
    return this.historian.getStatistics();
  }

  /**
   * Get full history
   */
  getFullHistory() {
    return this.historian.getHistory();
  }
}

// Export classes
if (require.main === module) {
  // Demo mode
  console.log('🏛️ Enhanced Echo Chamber - Advanced Patterns Demo\n');

  const chamber = new EnhancedEchoChamber();

  // Test arithmetic
  console.log('📊 Arithmetic Progression: [2, 4, 6, 8]');
  let result = chamber.analyze([2, 4, 6, 8]);
  console.log(`   Next number: ${result.nextNumber} ✨\n`);

  // Test geometric
  console.log('📊 Geometric Progression: [2, 6, 18, 54]');
  result = chamber.analyze([2, 6, 18, 54]);
  console.log(`   Next number: ${result.nextNumber} ✨\n`);

  // Test quadratic
  console.log('📊 Quadratic Sequence: [1, 4, 9, 16, 25]');
  result = chamber.analyze([1, 4, 9, 16, 25]);
  console.log(`   Next number: ${result.nextNumber} ✨\n`);

  // Test Fibonacci
  console.log('📊 Fibonacci-like: [1, 1, 2, 3, 5, 8]');
  result = chamber.analyze([1, 1, 2, 3, 5, 8]);
  console.log(`   Next number: ${result.nextNumber} ✨\n`);

  // Show statistics
  console.log('📈 Historical Statistics:');
  console.log(JSON.stringify(chamber.getHistoryAnalysis(), null, 2));
} else {
  module.exports = {
    SequenceAnalyzer,
    HistoricalAnalyzer,
    EnhancedEchoChamber
  };
}
