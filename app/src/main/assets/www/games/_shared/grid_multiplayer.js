
// Shared Grid Game Multiplayer Adapter (Knxt4 Pattern)
export function createGridAdapter(config) {
  return {
    initHost(players) {
      return {
        board: Array.from({length: config.cols}, () => []),
        players,
        currentTurn: players[0],
        winner: null,
        moveCount: 0
      };
    },
    validateMove(move, state, playerId) {
      if (state.winner) return false;
      if (playerId !== state.currentTurn) return false;
      if (move.col < 0 || move.col >= config.cols) return false;
      if (state.board[move.col].length >= config.rows) return false;
      return true;
    },
    applyMove(move, state) {
      state.board[move.col].push(state.currentTurn);
      state.moveCount++;
      if (config.checkWin(state.board, state.currentTurn)) {
        state.winner = state.currentTurn;
      } else {
        const idx = state.players.indexOf(state.currentTurn);
        state.currentTurn = state.players[(idx+1)%state.players.length];
      }
      return state;
    },
    serialize(s){return JSON.parse(JSON.stringify(s));},
    deserialize(s){return s;}
  };
}
