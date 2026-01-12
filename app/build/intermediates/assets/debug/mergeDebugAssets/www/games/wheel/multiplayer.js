
// WHEEL Multiplayer Adapter – Phase 2 Final
export default {
  initHost(players) {
    return {
      spinning: false,
      angle: 0,
      result: null,
      locked: false
    };
  },

  validateMove(move, state, playerId) {
    if (state.locked) return false;
    if (move.type !== "SPIN") return false;
    return true;
  },

  applyMove(move, state) {
    state.locked = true;
    state.spinning = true;

    const seed = Date.now() % 360;
    state.angle = seed;
    state.result = Math.floor(seed / 45); // 8 segments
    state.spinning = false;

    return state;
  },

  serialize(state) { return JSON.parse(JSON.stringify(state)); },
  deserialize(state) { return state; }
};
