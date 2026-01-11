
// Ranked Matchmaking & ELO System
const K = 32;

export function calculateElo(rA, rB, scoreA) {
  const EA = 1 / (1 + Math.pow(10, (rB - rA) / 400));
  return Math.round(rA + K * (scoreA - EA));
}

export function updateRankedResult(db, pA, pB, result) {
  const refA = db.ref("ranked/" + pA);
  const refB = db.ref("ranked/" + pB);

  refA.once("value", snapA => {
    refB.once("value", snapB => {
      const rA = snapA.val()?.elo || 1000;
      const rB = snapB.val()?.elo || 1000;

      const scoreA = result === "A" ? 1 : result === "draw" ? 0.5 : 0;
      const scoreB = 1 - scoreA;

      refA.update({ elo: calculateElo(rA, rB, scoreA) });
      refB.update({ elo: calculateElo(rB, rA, scoreB) });
    });
  });
}
