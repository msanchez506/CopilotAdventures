#!/usr/bin/env node

/**
 * ================================
 * THE ECHO CHAMBER OF SEQUENCES
 * ================================
 * 
 * A magical number sequence prediction puzzle that teaches pattern recognition
 * and arithmetic progression analysis. The Chamber echoes memories of previous
 * number patterns and reveals the next number in the sequence.
 * 
 * Author: GitHub Copilot Adventures
 * Theme: Magical Number Sequences and Pattern Recognition
 */

const readline = require('readline');

/**
 * EchoChamber class - The core logic for sequence prediction
 * Manages arithmetic progression sequences and stores memories of past echoes
 */
class EchoChamber {
  constructor() {
    // Array to store memories of all processed sequences (echoes)
    this.memories = [];
  }

  /**
   * Validates if a sequence forms a valid arithmetic progression
   * An arithmetic progression has a constant difference between consecutive numbers
   * 
   * @param {number[]} sequence - The sequence to validate
   * @returns {object} - { isValid: boolean, difference: number, error: string }
   */
  validateArithmeticProgression(sequence) {
    if (!Array.isArray(sequence)) {
      return {
        isValid: false,
        difference: null,
        error: 'Sequence must be an array'
      };
    }

    if (sequence.length < 2) {
      return {
        isValid: false,
        difference: null,
        error: 'Sequence must have at least 2 numbers'
      };
    }

    if (!sequence.every(num => typeof num === 'number' && isFinite(num))) {
      return {
        isValid: false,
        difference: null,
        error: 'All elements must be valid numbers'
      };
    }

    // Calculate the common difference
    const firstDifference = sequence[1] - sequence[0];
    const EPSILON = 1e-10; // Tolerance for floating-point precision

    // Verify all consecutive differences are equal (with floating-point tolerance)
    for (let i = 2; i < sequence.length; i++) {
      const currentDifference = sequence[i] - sequence[i - 1];
      if (Math.abs(currentDifference - firstDifference) > EPSILON) {
        return {
          isValid: false,
          difference: null,
          error: `Not an arithmetic progression. Found difference of ${currentDifference} but expected ${firstDifference}`
        };
      }
    }

    return {
      isValid: true,
      difference: firstDifference,
      error: null
    };
  }

  /**
   * Predicts the next number in an arithmetic progression
   * 
   * @param {number[]} sequence - The sequence to extend
   * @returns {object} - { nextNumber: number, success: boolean, error: string }
   */
  predictNextNumber(sequence) {
    const validation = this.validateArithmeticProgression(sequence);

    if (!validation.isValid) {
      return {
        nextNumber: null,
        success: false,
        error: validation.error
      };
    }

    // The next number is the last number plus the common difference
    const nextNumber = sequence[sequence.length - 1] + validation.difference;

    return {
      nextNumber: nextNumber,
      success: true,
      error: null
    };
  }

  /**
   * Processes a sequence and stores it in memory (an "echo")
   * 
   * @param {number[]} sequence - The sequence to echo
   * @returns {object} - Echo memory object with metadata
   */
  echo(sequence) {
    const prediction = this.predictNextNumber(sequence);

    const echo = {
      timestamp: new Date().toISOString(),
      sequence: [...sequence],
      prediction: prediction.nextNumber,
      success: prediction.success,
      error: prediction.error
    };

    this.memories.push(echo);
    return echo;
  }

  /**
   * Retrieves all stored memories
   * @returns {array} - Array of all echo memories
   */
  getMemories() {
    return this.memories;
  }

  /**
   * Clears all stored memories
   */
  clearMemories() {
    this.memories = [];
  }

  /**
   * Gets a summary of all memories
   * @returns {string} - Formatted summary of memories
   */
  getMemoriesSummary() {
    if (this.memories.length === 0) {
      return 'The Chamber is silent... no echoes yet.';
    }

    let summary = `✨ The Chamber holds ${this.memories.length} echo(es):\n`;
    summary += '='.repeat(50) + '\n';

    this.memories.forEach((memory, index) => {
      const status = memory.success ? '✓' : '✗';
      const sequence = memory.sequence.join(', ');
      summary += `${status} Echo ${index + 1}: [${sequence}]`;
      if (memory.success) {
        summary += ` → ${memory.prediction}`;
      } else {
        summary += ` ⚠ ${memory.error}`;
      }
      summary += '\n';
    });

    summary += '='.repeat(50);
    return summary;
  }
}

/**
 * User Interface Manager - Handles console interaction and storytelling
 */
class ChamberUI {
  constructor(chamber) {
    this.chamber = chamber;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * Display the opening story and welcome message
   */
  displayWelcome() {
    console.clear();
    console.log('\n' + '='.repeat(60));
    console.log('    🏛️  WELCOME TO THE ECHO CHAMBER OF SEQUENCES  🏛️');
    console.log('='.repeat(60) + '\n');

    console.log('📖 THE LEGEND:');
    console.log('You have entered an ancient magical chamber where numbers');
    console.log('echo in perfect patterns. The Chamber remembers every sequence');
    console.log('you feed it, and reveals the next number in the pattern.\n');

    console.log('✨ THE CHALLENGE:');
    console.log('Test the Chamber with number sequences. If the numbers follow');
    console.log('an arithmetic pattern (constant difference between each pair),');
    console.log('the Chamber will predict the next number with magical precision!\n');

    console.log('Example: [3, 6, 9, 12] → The Chamber echoes: 15');
    console.log('(Each number increases by 3)\n');

    console.log('='.repeat(60) + '\n');
  }

  /**
   * Display the main menu
   */
  displayMenu() {
    console.log('\n📜 CHAMBER MENU:');
    console.log('1. Test a sequence');
    console.log('2. View all memories');
    console.log('3. Clear memories');
    console.log('4. Run demo with sample sequences');
    console.log('5. Exit the Chamber\n');
  }

  /**
   * Prompt user for a sequence input
   */
  promptSequence(callback) {
    this.rl.question('Enter numbers separated by commas (e.g., 3,6,9,12): ', (input) => {
      try {
        // Parse the input and convert to numbers
        const sequence = input
          .split(',')
          .map(num => {
            const parsed = parseFloat(num.trim());
            if (isNaN(parsed)) throw new Error(`"${num.trim()}" is not a valid number`);
            return parsed;
          });

        callback(sequence);
      } catch (error) {
        console.log(`\n❌ Error parsing input: ${error.message}`);
        console.log('Please enter numbers separated by commas (e.g., 3,6,9,12)\n');
        callback(null);
      }
    });
  }

  /**
   * Process and display a sequence prediction
   */
  processSequence(sequence) {
    const echo = this.chamber.echo(sequence);

    console.log(`\n🔮 The Chamber is processing: [${sequence.join(', ')}]`);
    console.log('...');

    if (echo.success) {
      console.log(`✨ The Chamber echoes: ${echo.prediction}`);
      console.log(`💫 Pattern confirmed! Each step increases by ${sequence[1] - sequence[0]}`);
    } else {
      console.log(`⚠️  The Chamber cannot find a pattern:`);
      console.log(`   ${echo.error}`);
    }
  }

  /**
   * Display all stored memories with summary
   */
  displayMemories() {
    console.log('\n' + this.chamber.getMemoriesSummary() + '\n');
  }

  /**
   * Run demo with pre-defined sequences
   */
  runDemo() {
    console.log('\n🎭 DEMO MODE: Testing the Chamber with magical sequences...\n');

    const demoSequences = [
      [3, 6, 9, 12, 15],
      [2, 4, 6, 8],
      [10, 20, 30, 40, 50],
      [5, 10, 15, 20],
      [1, 1, 1, 1],
      [100, 90, 80, 70],
      [-5, -3, -1, 1, 3],
      [2, 3, 5, 7],  // This one should fail - not arithmetic progression
    ];

    demoSequences.forEach((sequence, index) => {
      const echo = this.chamber.echo(sequence);
      console.log(`Demo ${index + 1}: [${sequence.join(', ')}]`);

      if (echo.success) {
        console.log(`✓ Prediction: ${echo.prediction}`);
      } else {
        console.log(`✗ Error: ${echo.error}`);
      }
      console.log('');
    });

    console.log('🎭 Demo complete!\n');
    console.log(this.chamber.getMemoriesSummary() + '\n');
  }

  /**
   * Close the readline interface
   */
  close() {
    this.rl.close();
  }

  /**
   * Main interactive loop
   */
  async startInteractiveMode() {
    this.displayWelcome();

    const askMenu = () => {
      this.displayMenu();
      this.rl.question('Choose an option (1-5): ', (choice) => {
        switch (choice.trim()) {
          case '1':
            this.promptSequence((sequence) => {
              if (sequence) {
                this.processSequence(sequence);
              }
              askMenu();
            });
            break;

          case '2':
            this.displayMemories();
            askMenu();
            break;

          case '3':
            this.chamber.clearMemories();
            console.log('\n✨ Memories cleared. The Chamber is now empty.\n');
            askMenu();
            break;

          case '4':
            this.runDemo();
            askMenu();
            break;

          case '5':
            console.log('\n👋 Farewell! The Echo Chamber rests until your return...\n');
            this.close();
            process.exit(0);
            break;

          default:
            console.log('\n⚠️  Invalid choice. Please select 1-5.\n');
            askMenu();
        }
      });
    };

    askMenu();
  }
}

/**
 * Application Entry Point
 * Initializes the Echo Chamber and starts the UI
 */
async function main() {
  const chamber = new EchoChamber();
  const ui = new ChamberUI(chamber);

  ui.startInteractiveMode();
}

// Export classes for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EchoChamber, ChamberUI };
}

// Run the application if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
