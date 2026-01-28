#!/usr/bin/env node

/**
 * ADVANCED TEST SUITE
 * Comprehensive testing for all pattern recognition features
 */

const { EnhancedEchoChamber, SequenceAnalyzer, HistoricalAnalyzer } = require('./advanced-patterns');

// Test counter
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

/**
 * Simple assertion function
 */
function assert(condition, testName) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✅ ${testName}`);
  } else {
    failedTests++;
    console.log(`❌ ${testName}`);
  }
}

/**
 * Assert with tolerance for floating point
 */
function assertClose(actual, expected, tolerance = 1e-10, testName = '') {
  assert(Math.abs(actual - expected) < tolerance, testName);
}

console.log('🧪 ADVANCED ECHO CHAMBER TEST SUITE\n');
console.log('='.repeat(60) + '\n');

// ===== ARITHMETIC TESTS =====
console.log('📊 ARITHMETIC PROGRESSION TESTS');
console.log('-'.repeat(40));

const chamber = new EnhancedEchoChamber();

let result = chamber.analyze([2, 4, 6, 8], false);
assert(result.success && result.nextNumber === 10, 'Arithmetic: [2,4,6,8] → 10');

result = chamber.analyze([10, 7, 4, 1], false);
assert(result.success && result.nextNumber === -2, 'Arithmetic: [10,7,4,1] → -2');

result = chamber.analyze([0.5, 1.5, 2.5, 3.5], false);
assertClose(result.nextNumber, 4.5, 1e-10, 'Arithmetic: [0.5,1.5,2.5,3.5] → 4.5');

result = chamber.analyze([-5, -3, -1, 1], false);
assert(result.success && result.nextNumber === 3, 'Arithmetic: [-5,-3,-1,1] → 3');

result = chamber.analyze([100, 100, 100, 100], false);
assert(result.success && result.nextNumber === 100, 'Arithmetic: [100,100,100,100] → 100 (zero difference)');

console.log();

// ===== GEOMETRIC TESTS =====
console.log('📊 GEOMETRIC PROGRESSION TESTS');
console.log('-'.repeat(40));

result = chamber.analyze([2, 6, 18, 54], false);
assertClose(result.nextNumber, 162, 1e-10, 'Geometric: [2,6,18,54] → 162');

result = chamber.analyze([1, 2, 4, 8, 16], false);
assert(result.success && result.nextNumber === 32, 'Geometric: [1,2,4,8,16] → 32');

result = chamber.analyze([100, 50, 25, 12.5], false);
assertClose(result.nextNumber, 6.25, 1e-10, 'Geometric: [100,50,25,12.5] → 6.25');

result = chamber.analyze([1, -2, 4, -8], false);
assert(result.success && result.nextNumber === 16, 'Geometric: [1,-2,4,-8] → 16 (negative ratio)');

console.log();

// ===== POLYNOMIAL TESTS =====
console.log('📊 POLYNOMIAL SEQUENCE TESTS');
console.log('-'.repeat(40));

// Quadratic: 1, 4, 9, 16, 25 (squares)
result = chamber.analyze([1, 4, 9, 16, 25], false);
assert(result.success && result.pattern.degree === 2, 'Polynomial: [1,4,9,16,25] detected as degree 2');
assert(result.nextNumber === 36, 'Polynomial: [1,4,9,16,25] → 36');

// Cubic sequence: 1, 8, 27, 64 (cubes)
result = chamber.analyze([1, 8, 27, 64], false);
assert(result.success && result.pattern.degree === 3, 'Polynomial: [1,8,27,64] detected as degree 3');

// Quadratic: 2, 5, 10, 17, 26
result = chamber.analyze([2, 5, 10, 17, 26], false);
assert(result.nextNumber === 37, 'Polynomial: [2,5,10,17,26] → 37');

console.log();

// ===== FIBONACCI TESTS =====
console.log('📊 FIBONACCI-LIKE SEQUENCE TESTS');
console.log('-'.repeat(40));

result = chamber.analyze([1, 1, 2, 3, 5, 8], false);
assert(result.success && result.pattern.type === 'fibonacci', 'Fibonacci: [1,1,2,3,5,8] detected');
assert(result.nextNumber === 13, 'Fibonacci: [1,1,2,3,5,8] → 13');

result = chamber.analyze([0, 1, 1, 2, 3, 5, 8, 13], false);
assert(result.nextNumber === 21, 'Fibonacci: [0,1,1,2,3,5,8,13] → 21');

result = chamber.analyze([2, 3, 5, 8, 13, 21], false);
assert(result.nextNumber === 34, 'Fibonacci-like: [2,3,5,8,13,21] → 34');

console.log();

// ===== MEMORY TESTS =====
console.log('📊 MEMORY & HISTORICAL TRACKING TESTS');
console.log('-'.repeat(40));

const chamber2 = new EnhancedEchoChamber();
chamber2.analyze([2, 4, 6, 8], true);
chamber2.analyze([1, 2, 4, 8], true);
chamber2.analyze([1, 4, 9, 16], true);

assert(chamber2.getMemories().length === 3, 'Memory: Stored 3 sequences');
assert(chamber2.getMemoryStats().totalMemories === 3, 'Memory: Stats show 3 memories');

const stats = chamber2.getHistoryAnalysis();
assert(stats.totalAnalyzed === 3, 'History: Recorded 3 analyses');
assert(stats.successRate === '100.00%', 'History: 100% success rate');

chamber2.clearMemories();
assert(chamber2.getMemories().length === 0, 'Memory: Cleared successfully');

console.log();

// ===== PATTERN DETECTION TESTS =====
console.log('📊 PATTERN DETECTION TESTS');
console.log('-'.repeat(40));

const analyzer = new SequenceAnalyzer();

let pattern = analyzer.detectPattern([3, 6, 9, 12]);
assert(pattern.type === 'arithmetic', 'Detects: Arithmetic pattern');

pattern = analyzer.detectPattern([2, 8, 32, 128]);
assert(pattern.type === 'geometric', 'Detects: Geometric pattern');

pattern = analyzer.detectPattern([1, 4, 9, 16, 25]);
assert(pattern.type === 'polynomial', 'Detects: Polynomial pattern');

pattern = analyzer.detectPattern([1, 1, 2, 3, 5]);
assert(pattern.type === 'fibonacci', 'Detects: Fibonacci pattern');

pattern = analyzer.detectPattern([1, 5, 11, 19, 29]);
assert(pattern.type === 'polynomial', 'Detects: Polynomial (degree 2)');

console.log();

// ===== EDGE CASES =====
console.log('📊 EDGE CASE TESTS');
console.log('-'.repeat(40));

result = chamber.analyze([5], false);
assert(!result.success, 'Edge case: Single number fails');

result = chamber.analyze([], false);
assert(!result.success, 'Edge case: Empty array fails');

result = chamber.analyze([1, 'two', 3], false);
assert(!result.success, 'Edge case: Non-numeric values fail');

result = chamber.analyze([1, 2, NaN, 4], false);
assert(!result.success, 'Edge case: NaN values fail');

result = chamber.analyze([1e10, 2e10, 3e10], false);
assert(result.success, 'Edge case: Large numbers work');

result = chamber.analyze([0.0001, 0.0002, 0.0003], false);
assert(result.success, 'Edge case: Very small numbers work');

result = chamber.analyze([-1e10, -2e10, -3e10], false);
assert(result.success, 'Edge case: Negative large numbers work');

console.log();

// ===== PERFORMANCE TESTS =====
console.log('📊 PERFORMANCE TESTS');
console.log('-'.repeat(40));

// Large arithmetic sequence
const largeArithmetic = Array.from({length: 10000}, (_, i) => i * 2);
const start1 = Date.now();
result = chamber.analyze(largeArithmetic.slice(0, 100), false);
const time1 = Date.now() - start1;
assert(result.success && time1 < 100, `Performance: 100 numbers analyzed in ${time1}ms`);

// Large geometric sequence
const largeGeometric = Array.from({length: 1000}, (_, i) => Math.pow(2, i));
const start2 = Date.now();
result = chamber.analyze(largeGeometric.slice(0, 20), false);
const time2 = Date.now() - start2;
assert(result.success && time2 < 100, `Performance: Geometric (20 numbers) in ${time2}ms`);

console.log();

// ===== PRECISION TESTS =====
console.log('📊 FLOATING POINT PRECISION TESTS');
console.log('-'.repeat(40));

result = chamber.analyze([0.1, 0.2, 0.3, 0.4], false);
assertClose(result.nextNumber, 0.5, 1e-10, 'Precision: [0.1,0.2,0.3,0.4] → 0.5');

result = chamber.analyze([1.1, 2.2, 3.3, 4.4], false);
assertClose(result.nextNumber, 5.5, 1e-10, 'Precision: [1.1,2.2,3.3,4.4] → 5.5');

const decimalSeq = [Math.PI * 0.5, Math.PI, Math.PI * 1.5, Math.PI * 2];
result = chamber.analyze(decimalSeq, false);
assert(result.success, 'Precision: Irrational multiples work');

console.log();

// ===== MIXED PATTERN TESTS =====
console.log('📊 PATTERN PRIORITY TESTS');
console.log('-'.repeat(40));

// Should detect arithmetic first
result = chamber.analyze([1, 2, 3, 4], false);
assert(result.pattern.type === 'arithmetic', 'Priority: Arithmetic detected before polynomial');

// Should detect geometric
result = chamber.analyze([1, 2, 4, 8, 16], false);
assert(result.pattern.type === 'geometric', 'Priority: Geometric correctly identified');

// Should detect fibonacci
result = chamber.analyze([1, 1, 2, 3, 5, 8, 13], false);
assert(result.pattern.type === 'fibonacci', 'Priority: Fibonacci correctly identified');

console.log();

// ===== FORMULA TESTS =====
console.log('📊 FORMULA GENERATION TESTS');
console.log('-'.repeat(40));

result = chamber.analyze([2, 4, 6, 8], false);
assert(result.pattern.formula !== undefined, 'Formula: Arithmetic has formula');
assert(result.pattern.formula.includes('a_n'), 'Formula: Uses standard notation');

result = chamber.analyze([1, 2, 4, 8], false);
assert(result.pattern.formula !== undefined, 'Formula: Geometric has formula');

result = chamber.analyze([1, 4, 9, 16, 25], false);
assert(result.pattern.description !== undefined, 'Formula: Polynomial has description');

console.log();

// ===== SUMMARY =====
console.log('='.repeat(60));
console.log('\n📊 TEST SUMMARY');
console.log('-'.repeat(40));
console.log(`Total Tests:     ${totalTests}`);
console.log(`Passed Tests:    ${passedTests} ✅`);
console.log(`Failed Tests:    ${failedTests} ❌`);
console.log(`Success Rate:    ${(passedTests / totalTests * 100).toFixed(2)}%`);

if (failedTests === 0) {
  console.log('\n🎉 ALL TESTS PASSED! 🎉');
} else {
  console.log(`\n⚠️  ${failedTests} test(s) failed`);
  process.exit(1);
}
