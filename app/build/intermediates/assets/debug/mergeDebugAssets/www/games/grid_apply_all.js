
// Apply Grid Adapter to All Grid Games
import { GridGames } from "./grid_registry.js";

export function getGridAdapter(gameId) {
  return GridGames[gameId] || null;
}
