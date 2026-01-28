/**
 * Test Suite for Echo Chamber Application
 * 
 * This file contains comprehensive tests for all core functionality
 * including arithmetic progression validation, predictions, and error handling
 */

const { EchoChamber } = require('./index.js');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m'
};

// Test counter
let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

/**
 * Assert function for testing
 */
function assert(condition, testName, expected, actual) {
  testsRun++;
  if (condition) {
    console.log(`${colors.green}✓${colors.reset} ${testName}`);
    testsPassed++;
  } else {
    console.log(`${colors.red}✗${colors.reset} ${testName}`);
    console.log(`  Expected: ${expected}`);
    console.log(`  Actual: ${actual}`);
    testsFailed++;
  }
}

/**
 * Test Suite: Arithmetic Progression Validation
 */
function testValidation() {
  console.log(`\n${colors.blue}=== Testing Validation ===${colors.reset}\n`);
  const chamber = new EchoChamber();

  // Valid progressions
  const test1 = chamber.validateArithmeticProgression([3, 6, 9, 12]);
  assert(test1.isValid === true, 'Valid progression: [3, 6, 9, 12]', true, test1.isValid);
  assert(test1.difference === 3, 'Correct difference: 3', 3, test1.difference);

  const test2 = chamber.validateArithmeticProgression([1, 2, 3, 4, 5]);
  assert(test2.isValid === true, 'Valid progression: [1, 2, 3, 4, 5]', true, test2.isValid);
  assert(test2.difference === 1, 'Correct difference: 1', 1, test2.difference);

  const test3 = chamber.validateArithmeticProgression([10, 5, 0, -5]);
  assert(test3.isValid === true, 'Valid progression with negative difference', true, test3.isValid);
  assert(test3.difference === -5, 'Correct negative difference: -5', -5, test3.difference);

  const test4 = chamber.validateArithmeticProgression([5, 5, 5, 5]);
  assert(test4.isValid === true, 'Valid progression with zero difference', true, test4.isValid);
  assert(test4.difference === 0, 'Correct zero difference', 0, test4.difference);

  // Invalid progressions
  const test5 = chamber.validateArithmeticProgression([2, 3, 5, 7]);
  assert(test5.isValid === false, 'Invalid progression: [2, 3, 5, 7]', false, test5.isValid);

  const test6 = chamber.validateArithmeticProgression([1, 2, 4, 8]);
  assert(test6.isValid === false, 'Invalid progression: [1, 2, 4, 8]', false, test6.isValid);

  // Edge cases
  const test7 = chamber.validateArithmeticProgression([5, 10]);
  assert(test7.isValid === true, 'Valid progression with 2 elements', true, test7.isValid);

  const test8 = chamber.validateArithmeticProgression([5]);
  assert(test8.isValid === false, 'Invalid progression with 1 element', false, test8.isValid);

  const test9 = chamber.validateArithmeticProgression([]);
  assert(test9.isValid === false, 'Invalid progression with empty array', false, test9.isValid);

  const test10 = chamber.validateArithmeticProgression([1, 'a', 3]);
  assert(test10.isValid === false, 'Invalid progression with non-numeric element', false, test10.isValid);

  const test11 = chamber.validateArithmeticProgression('not an array');
  assert(test11.isValid === false, 'Invalid input: not an array', false, test11.isValid);
}

/**
 * Test Suite: Sequence Predictions
 */
function testPredictions() {
  console.log(`\n${colors.blue}=== Testing Predictions ===${colors.reset}\n`);
  const chamber = new EchoChamber();

  // Sample sequences
  const test1 = chamber.predictNextNumber([3, 6, 9, 12]);
  assert(test1.nextNumber === 15, 'Predict next in [3, 6, 9, 12]', 15, test1.nextNumber);
  assert(test1.success === true, 'Prediction successful', true, test1.success);

  const test2 = chamber.predictNextNumber([2, 4, 6, 8]);
  assert(test2.nextNumber === 10, 'Predict next in [2, 4, 6, 8]', 10, test2.nextNumber);

  const test3 = chamber.predictNextNumber([10, 5, 0, -5]);
  assert(test3.nextNumber === -10, 'Predict next in [10, 5, 0, -5]', -10, test3.nextNumber);

  const test4 = chamber.predictNextNumber([5, 5, 5]);
  assert(test4.nextNumber === 5, 'Predict next in [5, 5, 5]', 5, test4.nextNumber);

  const test5 = chamber.predictNextNumber([1, 1]);
  assert(test5.nextNumber === 1, 'Predict next in [1, 1]', 1, test5.nextNumber);

  // Invalid sequences
  const test6 = chamber.predictNextNumber([2, 3, 5, 7]);
  assert(test6.success === false, 'Prediction fails for non-arithmetic sequence', false, test6.success);

  const test7 = chamber.predictNextNumber([100]);
  assert(test7.success === false, 'Prediction fails for single-element sequence', false, test7.success);
}

/**
 * Test Suite: Memory Management
 */
function testMemory() {
  console.log(`\n${colors.blue}=== Testing Memory Management ===${colors.reset}\n`);
  const chamber = new EchoChamber();

  assert(chamber.getMemories().length === 0, 'Chamber starts with empty memory', 0, chamber.getMemories().length);

  // Echo first sequence
  const echo1 = chamber.echo([3, 6, 9, 12]);
  assert(chamber.getMemories().length === 1, 'Memory contains 1 echo after first sequence', 1, chamber.getMemories().length);
  assert(echo1.prediction === 15, 'First echo prediction is 15', 15, echo1.prediction);

  // Echo second sequence
  const echo2 = chamber.echo([2, 4, 6]);
  assert(chamber.getMemories().length === 2, 'Memory contains 2 echoes after second sequence', 2, chamber.getMemories().length);
  assert(echo2.prediction === 8, 'Second echo prediction is 8', 8, echo2.prediction);

  // Echo invalid sequence
  const echo3 = chamber.echo([1, 2, 4]);
  assert(chamber.getMemories().length === 3, 'Invalid echo is still stored', 3, chamber.getMemories().length);
  assert(echo3.success === false, 'Invalid echo marked as unsuccessful', false, echo3.success);

  // Clear memories
  chamber.clearMemories();
  assert(chamber.getMemories().length === 0, 'Memories cleared successfully', 0, chamber.getMemories().length);
}

/**
 * Test Suite: Floating Point Numbers
 */
function testFloatingPoint() {
  console.log(`\n${colors.blue}=== Testing Floating Point Numbers ===${colors.reset}\n`);
  const chamber = new EchoChamber();

  const test1 = chamber.predictNextNumber([1.5, 3.0, 4.5, 6.0]);
  assert(test1.nextNumber === 7.5, 'Predict next in floating point sequence', 7.5, test1.nextNumber);

  const test2 = chamber.predictNextNumber([0.1, 0.2, 0.3]);
  // Due to floating point precision, we check within tolerance
  const test2Pass = test2.success && Math.abs(test2.nextNumber - 0.4) < 0.000001;
  assert(test2Pass, 'Floating point precision handled', 0.4, test2.nextNumber);

  const test3 = chamber.predictNextNumber([1.1, 2.2, 3.3]);
  assert(test3.success === true, 'Floating point sequence validated', true, test3.success);
}

/**
 * Test Suite: Large Numbers
 */
function testLargeNumbers() {
  console.log(`\n${colors.blue}=== Testing Large Numbers ===${colors.reset}\n`);
  const chamber = new EchoChamber();

  const test1 = chamber.predictNextNumber([1000000, 2000000, 3000000]);
  assert(test1.nextNumber === 4000000, 'Predict next with large numbers', 4000000, test1.nextNumber);

  const test2 = chamber.predictNextNumber([1000000000, 1000000001, 1000000002]);
  assert(test2.nextNumber === 1000000003, 'Predict next with very large numbers', 1000000003, test2.nextNumber);
}

/**
 * Test Suite: Metadata and Timestamps
 */
function testMetadata() {
  console.log(`\n${colors.blue}=== Testing Metadata ===${colors.reset}\n`);
  const chamber = new EchoChamber();

  const echo = chamber.echo([3, 6, 9, 12]);
  assert('timestamp' in echo, 'Echo contains timestamp', true, 'timestamp' in echo);
  assert('sequence' in echo, 'Echo contains sequence', true, 'sequence' in echo);
  assert('prediction' in echo, 'Echo contains prediction', true, 'prediction' in echo);
  assert('success' in echo, 'Echo contains success flag', true, 'success' in echo);
}

/**
 * Run all tests
 */
function runAllTests() {
  console.log('\n' + '='.repeat(60));
  console.log('    🧪 ECHO CHAMBER TEST SUITE 🧪');
  console.log('='.repeat(60));

  testValidation();
  testPredictions();
  testMemory();
  testFloatingPoint();
  testLargeNumbers();
  testMetadata();

  // Summary
  console.log(`\n${colors.blue}=== Test Summary ===${colors.reset}\n`);
  console.log(`Total Tests: ${testsRun}`);
  console.log(`${colors.green}Passed: ${testsPassed}${colors.reset}`);
  if (testsFailed > 0) {
    console.log(`${colors.red}Failed: ${testsFailed}${colors.reset}`);
  }

  const successRate = ((testsPassed / testsRun) * 100).toFixed(2);
  const statusColor = testsFailed === 0 ? colors.green : colors.red;
  console.log(`${statusColor}Success Rate: ${successRate}%${colors.reset}\n`);

  // Exit with appropriate code
  process.exit(testsFailed > 0 ? 1 : 0);
}

// Run tests if this file is executed directly
runAllTests();
