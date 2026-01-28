# Quick Start Guide - Echo Chamber 🏛️

## ⚡ 5-Minute Setup

### Step 1: Navigate to the Project
```bash
cd /workspaces/CopilotAdventures/echo-chamber
npm install
```

### Step 2: Choose Your Interface

#### Option A: Console Interface (Classic)
```bash
npm start
```

When prompted, select option 1 and enter:
```
3,6,9,12
```

The Chamber will predict: **15** ✨

#### Option B: Web Interface (Modern)
```bash
npm run web
```

Then open in your browser:
```
http://localhost:3000
```

Enter the sequence `3, 6, 9, 12` and click **Predict** to get: **15** ✨

## 🎯 What Just Happened?

The sequence `[3, 6, 9, 12]` is an arithmetic progression:
- Each number increases by 3
- Pattern: 3 → 6 (+3) → 9 (+3) → 12 (+3) → **15 (+3)**

## 🧪 Try Running Tests

```bash
npm test
```

**Expected Result:** 40/40 tests passing (100%) ✓

## 📜 Menu Options

| Option | Action |
|--------|--------|
| 1 | Test a custom sequence |
| 2 | View all memories |
| 3 | Clear memories |
| 4 | Run demo with samples |
| 5 | Exit |

## 🔥 Quick Examples to Try

Paste these sequences when prompted:

```
2,4,6,8
```
→ Chamber predicts: **10** (difference: 2)

```
10,20,30,40,50
```
→ Chamber predicts: **60** (difference: 10)

```
100,90,80,70
```
→ Chamber predicts: **60** (difference: -10, decreasing)

```
1,1,1,1
```
→ Chamber predicts: **1** (difference: 0, constant)

```
2,3,5,7
```
→ Chamber echoes: **⚠ Error** (not arithmetic progression)

## 📁 Project Files

```
echo-chamber/
├── index.js              # Main application (387 lines)
├── test.js              # Test suite (228 lines)
├── package.json         # Project config
└── README.md            # Full documentation (403 lines)
```

## 🎓 Core Concepts Covered

✅ Arithmetic progression validation
✅ Pattern recognition and prediction
✅ Memory management with echoes
✅ Comprehensive error handling
✅ Floating-point precision tolerance
✅ Interactive console UI
✅ Complete test coverage (40 tests)

## 💻 Using in Your Code

```javascript
const { EchoChamber } = require('./index.js');

const chamber = new EchoChamber();
const prediction = chamber.predictNextNumber([5, 10, 15, 20]);

console.log(`Next number: ${prediction.nextNumber}`); // 25
```

## 🚀 Run the Demo Mode

```
npm start
> Choose option 4
> Watch the Chamber process 8 different sequences
> See successful predictions and error handling in action
```

## ✨ Features at a Glance

- 🎭 **Interactive Console UI** with magical theming
- 🔮 **Smart Predictions** for arithmetic sequences
- 💾 **Memory System** stores all echoes with timestamps
- ⚡ **Instant Validation** checks for valid progressions
- 🛡️ **Error Handling** gracefully manages invalid input
- 🧪 **100% Test Coverage** with comprehensive test suite
- 📊 **Floating-Point Safe** handles decimal arithmetic
- 📈 **Demo Mode** with 8 pre-configured test sequences

## 🎯 Learning Path

1. **Start:** Run the app and test with the example [3,6,9,12]
2. **Explore:** Try the demo mode to see 8 different sequences
3. **Experiment:** Test your own sequences
4. **Verify:** Check memory with option 2
5. **Test:** Run npm test to see 40 automated tests
6. **Understand:** Read the full README.md for deep dive

---

**Ready?** Start with: `npm start` 🚀
