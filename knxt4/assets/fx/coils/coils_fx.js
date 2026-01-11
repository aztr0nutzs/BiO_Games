/* Coils FX
   - Built from the provided coils.zip idea (ZIM / CreateJS)
   - Trimmed to be a non-interactive overlay (pointer-events handled by parent)
*/
(function () {
  "use strict";

  // If ZIM didn't load (offline / blocked), fail silently.
  if (typeof Frame === "undefined") return;

  const scaling = "coilsTag"; // use tagID mode by providing canvas id as scaling (ZIM feature)
  const width = 1024;
  const height = 768;
  const color = "rgba(0,0,0,0)";
  const outerColor = "rgba(0,0,0,0)";

  // Some ZIM builds use scaling constants; others allow "tagID" scaling by passing the tag ID as scaling.
  // This avoids full-window takeovers and keeps the canvas inside this iframe only.
  new Frame(scaling, width, height, color, outerColor, ready);

  function ready() {
    // given F (Frame), S (Stage), W (width), H (height)
    const S = window.S;
    const W = window.W;
    const H = window.H;

    // Keep the overlay subtle and "clean" (your words), not a rave.
    const FX_ALPHA = 0.85;

    // Helper: build a coil "spring" container
    function makeCoil(w, h) {
      const c = new Container(w, h).centerReg();
      const background = new Rectangle(w, h, "rgba(0,0,0,0)", "rgba(0,255,255,.18)", 2, 12).centerReg(c);

      // Spring lines
      const lines = 13;
      for (let i = 0; i < lines; i++) {
        const y = (i + 0.5) * (h / lines);
        const offset = (i % 2 === 0) ? w * 0.15 : w * 0.85;
        new Squiggle({
          points: [[w * 0.15, y], [offset, y], [w * 0.85, y]],
          thickness: 3,
          color: "rgba(0,255,255,.55)",
          length: 20,
          gap: 5,
          curved: false
        }).addTo(c);
      }

      // Inner glow
      new Rectangle(w * 0.82, h * 0.92, "rgba(0,0,0,0)", "rgba(0,255,170,.22)", 1, 18)
        .centerReg(c)
        .alp(0.6);

      c.alp(FX_ALPHA);
      return c;
    }

    // Build coils around the frame edges (acts like "around the board/tubes")
    const pad = Math.min(W, H) * 0.06;
    const coilW = Math.max(70, W * 0.12);
    const coilH = Math.max(160, H * 0.38);

    const coils = [
      makeCoil(coilW, coilH).pos(pad, H * 0.22),
      makeCoil(coilW, coilH).pos(pad, H * 0.58),
      makeCoil(coilW, coilH).pos(W - pad - coilW, H * 0.22),
      makeCoil(coilW, coilH).pos(W - pad - coilW, H * 0.58)
    ];

    // Subtle top "rail" electricity across the top third
    const zapLayer = new Container(W, H).addTo(S).alp(0.9);

    function makeZap(y) {
      // randomized jagged polyline from left to right
      const pts = [];
      const x0 = W * 0.18;
      const x1 = W * 0.82;
      const steps = 9;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = x0 + (x1 - x0) * t;
        const jitter = (Math.random() - 0.5) * (H * 0.03);
        pts.push([x, y + jitter]);
      }
      return new Squiggle({
        points: pts,
        thickness: 5,
        color: "rgba(0,255,170,.80)",
        length: 18,
        gap: 6,
        curved: false
      });
    }

    let zap = makeZap(pad * 0.9).addTo(zapLayer);
    let zap2 = makeZap(pad * 1.5).alp(0.55).addTo(zapLayer);

    // Animate by regenerating zaps
    interval(160, function () {
      zapLayer.removeChild(zap);
      zapLayer.removeChild(zap2);
      zap = makeZap(pad * 0.9).addTo(zapLayer);
      zap2 = makeZap(pad * 1.5).alp(0.55).addTo(zapLayer);

      // flicker
      zapLayer.alp(0.65 + Math.random() * 0.35);
      S.update();
    });

    // Stage update ticker
    Ticker.add(function () {
      S.update();
    });

    // Ensure transparency
    S.alpha = 1;
    S.update();
  }
})();
