
// KNXT 4 Multiplayer Adapter – Phase 2 Final
export default {
  initHost(players) {
    return {
      board: [[], [], [], [], [], [], []],
      players: { p1: players[0], p2: players[1] },
      currentTurn: players[0],
      winner: null,
      moveCount: 0
    };
  },

  validateMove(move, state, playerId) {
    if (state.winner) return false;
    if (playerId !== state.currentTurn) return false;
    if (move.col < 0 || move.col > 6) return false;
    if (state.board[move.col].length >= 6) return false;
    return true;
  },

  applyMove(move, state) {
    const col = move.col;
    state.board[col].push(state.currentTurn);
    state.moveCount++;

    const win = this.checkWin(state.board, state.currentTurn);
    if (win) {
      state.winner = state.currentTurn;
    } else if (state.moveCount >= 42) {
      state.winner = "draw";
    } else {
      state.currentTurn =
        state.currentTurn === state.players.p1
          ? state.players.p2
          : state.players.p1;
    }
    return state;
  },

  checkWin(board, player) {
    const rows = 6, cols = 7;
    const grid = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => board[c][r] || null)
    );

    const directions = [
      [1,0],[0,1],[1,1],[1,-1]
    ];

    for (let r=0;r<rows;r++) {
      for (let c=0;c<cols;c++) {
        if (grid[r][c] !== player) continue;
        for (const [dr,dc] of directions) {
          let count = 0;
          for (let i=0;i<4;i++) {
            const nr=r+dr*i, nc=c+dc*i;
            if (nr<0||nr>=rows||nc<0||nc>=cols) break;
            if (grid[nr][nc]===player) count++;
          }
          if (count===4) return true;
        }
      }
    }
    return false;
  },

  serialize(state) { return JSON.parse(JSON.stringify(state)); },
  deserialize(state) { return state; }
};
