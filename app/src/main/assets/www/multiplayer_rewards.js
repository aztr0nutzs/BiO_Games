
// Stats to Bio Store Rewards Bridge
export function evaluateRewards(stats) {
  const rewards = [];
  if (stats.wins >= 10) rewards.push("bio_skin_1");
  if (stats.wins >= 50) rewards.push("bio_skin_2");
  if (stats.games >= 100) rewards.push("bio_badge_veteran");
  return rewards;
}
