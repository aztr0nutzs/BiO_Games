
// Multiplayer Stats & Rewards
export function recordResult(db, playerId, result) {
  const ref = db.ref("stats/"+playerId);
  ref.transaction(cur=>{
    cur = cur || {wins:0,losses:0,games:0};
    cur.games++;
    if (result==="win") cur.wins++;
    if (result==="loss") cur.losses++;
    return cur;
  });
}
