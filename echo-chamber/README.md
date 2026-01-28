# Echo Chamber of Sequences 🏛️✨

A magical number sequence prediction puzzle that teaches pattern recognition and arithmetic progressions. Journey into an ancient chamber where numbers echo in perfect patterns!

## 📖 Overview

The Echo Chamber is an interactive educational application that helps developers understand:
- **Arithmetic Progressions**: Sequences where the difference between consecutive numbers is constant
- **Pattern Recognition**: Identifying mathematical patterns in data
- **Input Validation**: Ensuring data meets specific criteria
- **Error Handling**: Gracefully managing invalid inputs
- **Memory Management**: Storing and retrieving historical data

## 🚀 Quick Start

### Two Interfaces Available

The Echo Chamber offers both **console** and **web** interfaces:

```bash
# Console interface (interactive terminal)
npm start

# Web interface (modern HTML5 interface)
npm run web
# Then open: http://localhost:3000
```

### Installation

```bash
cd echo-chamber
npm install
```

### Running Tests

```bash
npm test
```

## 🌐 Web Interface Guide

For detailed web interface documentation, see [WEB-GUIDE.md](WEB-GUIDE.md)

### Starting the Web Server

```bash
npm run web
```

Opens at `http://localhost:3000` with:
- Modern, responsive HTML5 interface
- Real-time API-based predictions
- Interactive demo mode
- Memory management dashboard
- Beautiful gradient design

## 📚 Mathematical Concepts

### Arithmetic Progressions

An arithmetic progression is a sequence where the difference between consecutive terms is constant.

**Formula:**
```
a_n = a_1 + (n-1)d
```

Where:
- `a_n` = the nth term
- `a_1` = the first term
- `d` = common difference
- `n` = term position

**Examples:**
- `[3, 6, 9, 12]` → difference = 3, next = 15
- `[2, 4, 6, 8]` → difference = 2, next = 10
- `[10, 5, 0, -5]` → difference = -5, next = -10

### Non-Arithmetic Sequences

The Chamber will reject sequences that don't follow arithmetic patterns:
- `[2, 3, 5, 7]` → differences are 1, 2, 2 (not constant)
- `[1, 2, 4, 8]` → differences are 1, 2, 4 (exponential, not arithmetic)

## 🎮 Console Interface

When you start the console application with `npm start`, you'll see the Chamber menu:

```
📜 CHAMBER MENU:
1. Test a sequence
2. View all memories
3. Clear memories
4. Run demo with sample sequences
5. Exit the Chamber
```

### Example Session

**Test a sequence manually:**
```
Choose an option (1-5): 1
Enter numbers separated by commas (e.g., 3,6,9,12): 3,6,9,12

🔮 The Chamber is processing: [3, 6, 9, 12]
...
✨ The Chamber echoes: 15
💫 Pattern confirmed! Each step increases by 3
```

**View memories:**
```
Choose an option (1-5): 2

✨ The Chamber holds 1 echo(es):
==================================================
✓ Echo 1: [3, 6, 9, 12] → 15
==================================================
```

**Run the demo:**
```
Choose an option (1-5): 4
🎭 DEMO MODE: Testing the Chamber with magical sequences...

Demo 1: [3, 6, 9, 12, 15]
✓ Prediction: 18
...
```

## 🌐 Web Interface

The web interface provides a modern, responsive alternative with:
- Real-time predictions via REST API
- Interactive tabs for Predict, Demo, and Memories
- Beautiful gradient design with smooth animations
- Mobile-friendly responsive layout
- Keyboard support and accessibility features

See [WEB-GUIDE.md](WEB-GUIDE.md) for complete web interface documentation.

```
📜 CHAMBER MENU:
1. Test a sequence
2. View all memories
3. Clear memories
4. Run demo with sample sequences
5. Exit the Chamber
```

## 📚 Mathematical Concepts

### Arithmetic Progressions

An arithmetic progression is a sequence where the difference between consecutive terms is constant.

**Formula:**
```
a_n = a_1 + (n-1)d
```

Where:
- `a_n` = the nth term
- `a_1` = the first term
- `d` = common difference
- `n` = term position

**Examples:**
- `[3, 6, 9, 12]` → difference = 3, next = 15
- `[2, 4, 6, 8]` → difference = 2, next = 10
- `[10, 5, 0, -5]` → difference = -5, next = -10

### Non-Arithmetic Sequences

The Chamber will reject sequences that don't follow arithmetic patterns:
- `[2, 3, 5, 7]` → differences are 1, 2, 2 (not constant)
- `[1, 2, 4, 8]` → differences are 1, 2, 4 (exponential, not arithmetic)

## 🔧 Core Features

### 1. Sequence Prediction
```javascript
const chamber = new EchoChamber();
const result = chamber.predictNextNumber([3, 6, 9, 12]);
console.log(result);
// { nextNumber: 15, success: true, error: null }
```

### 2. Validation
```javascript
const validation = chamber.validateArithmeticProgression([3, 6, 9, 12]);
console.log(validation);
// { isValid: true, difference: 3, error: null }
```

### 3. Memory Management
```javascript
chamber.echo([3, 6, 9, 12]);
chamber.echo([2, 4, 6, 8]);
const memories = chamber.getMemories();
console.log(memories.length); // 2
```

### 4. Error Handling
The Chamber handles:
- Non-numeric inputs
- Single or empty sequences
- Non-arithmetic progressions
- Floating-point precision issues
- Invalid data types

## 🧪 Testing

The application includes comprehensive tests covering:

```
=== Testing Validation ===
- Valid progressions
- Invalid progressions
- Edge cases
- Non-numeric inputs

=== Testing Predictions ===
- Various sequence types
- Negative differences
- Zero differences

=== Testing Memory Management ===
- Memory storage
- Memory retrieval
- Memory clearing

=== Testing Floating Point Numbers ===
- Decimal sequences
- Floating-point precision

=== Testing Large Numbers ===
- Very large number sequences
- Integer overflow handling

=== Testing Metadata ===
- Timestamp tracking
- Sequence preservation
```

**Test Results:** 40/40 tests passing (100% success rate)

Run tests:
```bash
npm test
```
## 🔌 REST API (Web Server)

The web server (`npm run web`) provides a complete REST API:

### Endpoints

- **POST /api/predict** - Predict next number (no storage)
- **POST /api/echo** - Predict and store in memory  
- **GET /api/memories** - Retrieve all stored sequences
- **POST /api/memories/clear** - Clear all memories
- **GET /api/demo** - Get demo data

### Example Usage

```bash
# Predict next number
curl -X POST http://localhost:3000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"sequence": [3, 6, 9, 12]}'

# Response:
# {"success": true, "nextNumber": 15, "difference": 3, ...}
```

Full API documentation: [WEB-GUIDE.md](WEB-GUIDE.md)
## � Core Features

### EchoChamber Class

#### `validateArithmeticProgression(sequence)`
Validates if a sequence is an arithmetic progression.

**Parameters:**
- `sequence` (Array<number>): The sequence to validate

**Returns:**
```javascript
{
  isValid: boolean,
  difference: number | null,
  error: string | null
}
```

#### `predictNextNumber(sequence)`
Predicts the next number in a sequence.

**Parameters:**
- `sequence` (Array<number>): The sequence to extend

**Returns:**
```javascript
{
  nextNumber: number | null,
  success: boolean,
  error: string | null
}
```

#### `echo(sequence)`
Processes a sequence and stores it in memory.

**Parameters:**
- `sequence` (Array<number>): The sequence to process

**Returns:**
```javascript
{
  timestamp: string,
  sequence: Array<number>,
  prediction: number | null,
  success: boolean,
  error: string | null
}
```

#### `getMemories()`
Retrieves all stored memories.

**Returns:** `Array<object>` - Array of echo objects

#### `clearMemories()`
Clears all stored memories.

#### `getMemoriesSummary()`
Gets a formatted summary of all memories.

**Returns:** `string` - Formatted summary

## 📊 Usage Examples

### Example 1: Simple Prediction
```javascript
const { EchoChamber } = require('./index.js');

const chamber = new EchoChamber();
const result = chamber.predictNextNumber([5, 10, 15, 20]);
console.log(`Next number: ${result.nextNumber}`); // 25
```

### Example 2: Validating Multiple Sequences
```javascript
const sequences = [
  [1, 2, 3, 4],
  [2, 3, 5, 7],
  [10, 20, 30, 40]
];

sequences.forEach(seq => {
  const validation = chamber.validateArithmeticProgression(seq);
  console.log(`${seq}: ${validation.isValid ? '✓' : '✗'}`);
});
```

### Example 3: Batch Processing with Memory
```javascript
const testSeqs = [
  [3, 6, 9, 12],
  [1, 1, 1, 1],
  [100, 90, 80, 70]
];

testSeqs.forEach(seq => chamber.echo(seq));

console.log(chamber.getMemoriesSummary());
```

## 🛠️ Customization

### Adding Custom Sequences to Demo
Edit the `demoSequences` array in `index.js`:

```javascript
const demoSequences = [
  [3, 6, 9, 12, 15],
  [2, 4, 6, 8],
  // Add your sequences here!
  [100, 200, 300, 400],
];
```

### Changing Floating-Point Tolerance
In `validateArithmeticProgression()`, adjust the EPSILON value:

```javascript
const EPSILON = 1e-10; // Increase for more tolerance
```

## 📝 Architecture

### File Structure
```
echo-chamber/
├── index.js           # Main application with EchoChamber and ChamberUI classes
├── test.js            # Comprehensive test suite
├── package.json       # Project metadata and dependencies
└── README.md          # This file
```

### Class Diagram
```
EchoChamber
├── validateArithmeticProgression(sequence)
├── predictNextNumber(sequence)
├── echo(sequence)
├── getMemories()
├── clearMemories()
└── getMemoriesSummary()

ChamberUI
├── displayWelcome()
├── displayMenu()
├── promptSequence(callback)
├── processSequence(sequence)
├── displayMemories()
├── runDemo()
└── startInteractiveMode()
```

## 🎓 Learning Objectives

After using the Echo Chamber, you'll understand:

1. **Arithmetic Progressions**: How to identify and work with sequences that have constant differences
2. **Pattern Recognition**: Methods for analyzing data to find patterns
3. **Input Validation**: Techniques for ensuring data integrity
4. **Error Messages**: How to provide helpful feedback when validation fails
5. **State Management**: Storing and retrieving historical data
6. **Floating-Point Arithmetic**: Handling precision issues in decimal calculations
7. **Console UI Design**: Creating user-friendly interactive applications

## 🔗 Related Concepts

- **Geometric Progressions**: Sequences with constant ratio (e.g., 1, 2, 4, 8)
- **Fibonacci Sequences**: Each term is sum of previous two
- **Polynomial Sequences**: Differences form patterns (quadratic, cubic, etc.)
- **Regression Analysis**: Fitting mathematical models to data

## 🐛 Troubleshooting

### Issue: "Cannot find module 'readline'"
**Solution:** The `readline` module is built-in to Node.js. Ensure you're using Node.js v14 or later.

### Issue: Floating-point predictions seem off
**Solution:** This is expected with decimal numbers due to floating-point precision. The Chamber uses an EPSILON tolerance to handle this.

### Issue: Interactive mode doesn't work on Windows
**Solution:** The application works on all platforms. If you have issues, try:
```bash
node index.js < input.txt  # Redirect input from a file
```

## 📦 Dependencies

- **Node.js 14+**: Runtime environment
- **readline**: Built-in Node.js module for interactive input

No external npm packages required!

## 📄 License

MIT License - Feel free to use, modify, and distribute this project.

## 🤝 Contributing

Found a bug or have an idea for improvement? Feel free to:
1. Test the application thoroughly
2. Document your findings
3. Suggest enhancements
4. Share creative arithmetic sequences

## 🎭 The Story

In ancient times, there existed a magical chamber deep within a forgotten library. This chamber had a peculiar gift: it could sense patterns in numbers and predict what comes next. Legends say that only those who understand the flow of arithmetic progressions can truly master the Chamber's magic.

You have been chosen as the new Guardian of the Echo Chamber. Your quest is to feed it various number sequences and learn from its responses. Will you master the art of pattern recognition?

---

**Happy Pattern Hunting!** 🔮✨
