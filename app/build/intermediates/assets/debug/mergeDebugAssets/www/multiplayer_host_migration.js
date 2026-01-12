
// Host Migration & Disconnect Recovery
export function electNewHost(players) {
  const sorted = Object.entries(players)
    .sort((a,b)=>a[1].lastPing-b[1].lastPing);
  return sorted[0]?.[0];
}
