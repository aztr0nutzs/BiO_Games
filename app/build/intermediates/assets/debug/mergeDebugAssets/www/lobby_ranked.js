
// Lobby Ranked Queue Wiring
import { createPublicRoom } from "./multiplayer_matchmaking.js";

export function joinRankedQueue(db, gameId, playerId) {
  const roomId = "ranked_" + gameId + "_" + Date.now();
  return createPublicRoom(db, roomId, {
    game: gameId,
    ranked: true,
    created: Date.now(),
    host: playerId
  });
}
