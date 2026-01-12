
// Seasonal Ranked Reset & Rewards
const SEASON_LENGTH_DAYS = 90;

export function isSeasonReset(lastReset) {
  return Date.now() - lastReset > SEASON_LENGTH_DAYS * 86400000;
}

export function resetSeason(db) {
  const ref = db.ref("ranked");
  ref.once("value", snap => {
    const data = snap.val() || {};
    Object.keys(data).forEach(pid => {
      ref.child(pid).update({
        elo: 1000,
        lastReset: Date.now()
      });
    });
  });
}
