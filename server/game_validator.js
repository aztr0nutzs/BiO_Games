/**
 * Authoritative Game Logic - Phase 3
 * Server-side validation for all game outcomes
 */

const crypto = require('crypto');

/**
 * Slot machine outcome generator (server-authoritative)
 */
class SlotMachine {
  constructor() {
    this.symbols = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣', '⭐'];
    this.weights = [30, 25, 20, 15, 7, 2, 1]; // Probability weights
  }

  /**
   * Generate weighted random symbol
   */
  getRandomSymbol() {
    const totalWeight = this.weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < this.symbols.length; i++) {
      random -= this.weights[i];
      if (random <= 0) {
        return this.symbols[i];
      }
    }
    
    return this.symbols[0];
  }

  /**
   * Generate slot spin result
   * @param {number} bet - Bet amount
   * @returns {Object} Spin result with outcome and payout
   */
  spin(bet) {
    const reels = [
      this.getRandomSymbol(),
      this.getRandomSymbol(),
      this.getRandomSymbol()
    ];

    const payout = this.calculatePayout(reels, bet);
    const spinId = crypto.randomBytes(16).toString('hex');

    return {
      spinId,
      reels,
      bet,
      payout,
      timestamp: Date.now()
    };
  }

  /**
   * Calculate payout based on reel results
   */
  calculatePayout(reels, bet) {
    // Three of a kind
    if (reels[0] === reels[1] && reels[1] === reels[2]) {
      const symbol = reels[0];
      const multipliers = {
        '🍒': 5,
        '🍋': 10,
        '🍊': 15,
        '🍇': 20,
        '💎': 50,
        '7️⃣': 100,
        '⭐': 200
      };
      return bet * (multipliers[symbol] || 5);
    }

    // Two of a kind
    if (reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2]) {
      return bet * 2;
    }

    return 0;
  }
}

/**
 * Wheel spinner (server-authoritative)
 */
class WheelSpinner {
  constructor() {
    this.segments = [
      { value: 10, weight: 30 },
      { value: 20, weight: 25 },
      { value: 50, weight: 20 },
      { value: 100, weight: 15 },
      { value: 200, weight: 7 },
      { value: 500, weight: 2 },
      { value: 1000, weight: 1 }
    ];
  }

  /**
   * Spin the wheel
   * @returns {Object} Spin result
   */
  spin() {
    const totalWeight = this.segments.reduce((sum, seg) => sum + seg.weight, 0);
    let random = Math.random() * totalWeight;

    for (const segment of this.segments) {
      random -= segment.weight;
      if (random <= 0) {
        const spinId = crypto.randomBytes(16).toString('hex');
        return {
          spinId,
          value: segment.value,
          timestamp: Date.now()
        };
      }
    }

    return {
      spinId: crypto.randomBytes(16).toString('hex'),
      value: this.segments[0].value,
      timestamp: Date.now()
    };
  }
}

/**
 * KNXT4 game validator (server-authoritative)
 */
class KNXT4Validator {
  /**
   * Validate a KNXT4 move
   * @param {Array} board - Current board state
   * @param {number} column - Column to place piece
   * @param {string} player - Player ID
   * @returns {Object} Validation result
   */
  validateMove(board, column, player) {
    if (column < 0 || column >= 7) {
      return { valid: false, error: 'Invalid column' };
    }

    // Find lowest empty row in column
    for (let row = 5; row >= 0; row--) {
      if (!board[row][column]) {
        return {
          valid: true,
          row,
          column,
          player
        };
      }
    }

    return { valid: false, error: 'Column is full' };
  }

  /**
   * Check for winner
   * @param {Array} board - Current board state
   * @param {number} row - Last move row
   * @param {number} col - Last move column
   * @param {string} player - Player ID
   * @returns {boolean} True if player won
   */
  checkWinner(board, row, col, player) {
    const directions = [
      [[0, 1], [0, -1]],   // Horizontal
      [[1, 0], [-1, 0]],   // Vertical
      [[1, 1], [-1, -1]],  // Diagonal \
      [[1, -1], [-1, 1]]   // Diagonal /
    ];

    for (const [dir1, dir2] of directions) {
      let count = 1;
      count += this.countDirection(board, row, col, dir1[0], dir1[1], player);
      count += this.countDirection(board, row, col, dir2[0], dir2[1], player);
      
      if (count >= 4) {
        return true;
      }
    }

    return false;
  }

  countDirection(board, row, col, dRow, dCol, player) {
    let count = 0;
    let r = row + dRow;
    let c = col + dCol;

    while (r >= 0 && r < 6 && c >= 0 && c < 7 && board[r][c] === player) {
      count++;
      r += dRow;
      c += dCol;
    }

    return count;
  }
}

/**
 * Anti-cheat validator
 */
class AntiCheatValidator {
  constructor() {
    this.playerActions = new Map();
    this.suspiciousPlayers = new Set();
  }

  /**
   * Detect speed hacks
   * @param {string} playerId - Player ID
   * @param {string} action - Action type
   * @returns {boolean} True if suspicious
   */
  detectSpeedHack(playerId, action) {
    const now = Date.now();
    const key = `${playerId}:${action}`;
    
    if (!this.playerActions.has(key)) {
      this.playerActions.set(key, []);
    }

    const actions = this.playerActions.get(key);
    actions.push(now);

    // Keep only last 10 actions
    if (actions.length > 10) {
      actions.shift();
    }

    // Check if more than 5 actions in 1 second
    const recentActions = actions.filter(time => now - time < 1000);
    if (recentActions.length > 5) {
      this.suspiciousPlayers.add(playerId);
      return true;
    }

    return false;
  }

  /**
   * Check if player is flagged as suspicious
   */
  isSuspicious(playerId) {
    return this.suspiciousPlayers.has(playerId);
  }

  /**
   * Clear player flags
   */
  clearFlags(playerId) {
    this.suspiciousPlayers.delete(playerId);
    this.playerActions.delete(playerId);
  }
}

module.exports = {
  SlotMachine,
  WheelSpinner,
  KNXT4Validator,
  AntiCheatValidator
};
