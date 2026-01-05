
(() => {
  const $ = (s) => document.querySelector(s);

  const cabinetImg = $("#cabinet");
  const screenWrap = $("#screenWrap");
  const canvas = $("#reels");
  const gridOverlay = $("#gridOverlay");
  const frameOverlay = $("#frameOverlay");

  const btnSpin = $("#btn-spin");
  const btnAuto = $("#btn-auto");
  const btnBet  = $("#btn-bet");
  const toastEl = $("#toast");

  const DPR = () => Math.max(1, Math.min(3, window.devicePixelRatio || 1));

  const state = {
    layout: null,
    symbols: [],
    credits: 1000,
    bet: 25,
    auto: false,
    spinning: false,
    reels: [],
    t0: 0,
    calib: false,
    // reel visuals
    zoom: 1.06, // slightly closer like reference
    // animation
    spinDurBase: 950,
    spinDurStep: 160,
  };

  function showToast(text, ms = 1100) {
    toastEl.textContent = text;
    toastEl.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toastEl.classList.remove("show"), ms);
  }

  async function loadJSON(url) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load ${url}`);
    return res.json();
  }

  function rectToPx(normRect, wrapRect) {
    return {
      left: wrapRect.width * normRect.x,
      top: wrapRect.height * normRect.y,
      width: wrapRect.width * normRect.w,
      height: wrapRect.height * normRect.h
    };
  }

  function applyLayout() {
    if (!state.layout) return;

    const wrapRect = cabinetImg.getBoundingClientRect();
    const scr = state.layout.screen;
    const scrPx = rectToPx(scr, wrapRect);

    // Place the screen overlay group
    screenWrap.style.left = `${scrPx.left}px`;
    screenWrap.style.top = `${scrPx.top}px`;
    screenWrap.style.width = `${scrPx.width}px`;
    screenWrap.style.height = `${scrPx.height}px`;

    // Resize canvas backing store
    const dpr = DPR();
    canvas.width = Math.floor(scrPx.width * dpr);
    canvas.height = Math.floor(scrPx.height * dpr);
    canvas.style.width = `${scrPx.width}px`;
    canvas.style.height = `${scrPx.height}px`;

    // Position hitboxes
    const setHB = (el, r) => {
      const px = rectToPx(r, wrapRect);
      el.style.left = `${px.left}px`;
      el.style.top = `${px.top}px`;
      el.style.width = `${px.width}px`;
      el.style.height = `${px.height}px`;
    };
    setHB(btnSpin, state.layout.buttons.spin);
    setHB(btnAuto, state.layout.buttons.auto);
    setHB(btnBet,  state.layout.buttons.bet);
  }

  function makeReels() {
    // Build reel strips from symbol IDs
    const symCount = state.symbols.length;
    const reelLen = 24;
    state.reels = Array.from({ length: 5 }, (_, i) => {
      const strip = Array.from({ length: reelLen }, () => Math.floor(Math.random() * symCount));
      // Ensure initial visible 3 match reference by seeding with first row cells from layout symbol grid
      // layout symbols are ordered row-major 0..14
      const ref = [
        [0,1,2,3,4],
        [5,6,7,8,9],
        [10,11,12,13,14],
      ];
      for (let r = 0; r < 3; r++) {
        strip[(2 + r) % reelLen] = ref[r][i];
      }
      return {
        strip,
        pos: 2,        // top visible index
        offset: 0,     // px offset inside a cell
        spinning: false,
        tStart: 0,
        dur: 0,
        v0: 0,
        targetPos: 0,
      };
    });
  }

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function startSpin() {
    if (state.spinning) return;
    if (state.credits < state.bet) {
      showToast("INSUFFICIENT CREDITS", 1200);
      return;
    }

    state.credits -= state.bet;
    state.spinning = true;
    state.spinningAt = performance.now();

    const symCount = state.symbols.length;
    const now = performance.now();

    state.reels.forEach((reel, i) => {
      reel.spinning = true;
      reel.tStart = now;
      reel.dur = state.spinDurBase + i * state.spinDurStep;
      // choose a stop such that visible center row lands on a random symbol
      const stopSym = Math.floor(Math.random() * symCount);
      // we want the middle visible row (row 1) to land on stopSym
      // top visible index = pos; middle shows pos+1
      const reelLen = reel.strip.length;
      // choose a future index far enough ahead
      const spins = 3 + i; // extra wraps
      const base = (reel.pos + spins * reelLen) % reelLen;
      const targetMiddleIndex = (base + 1) % reelLen;
      // set symbol at targetMiddleIndex to stopSym
      reel.strip[targetMiddleIndex] = stopSym;
      reel.targetPos = base; // top index at stop
      reel.v0 = 2.2 + i * 0.35;
    });

    showToast("SPINNING...", 800);
    requestAnimationFrame(tick);
  }

  function stopAutoIfNeeded() {
    if (!state.auto) return;
    setTimeout(() => {
      if (state.auto) startSpin();
    }, 480);
  }

  function toggleAuto() {
    state.auto = !state.auto;
    showToast(state.auto ? "AUTO ON" : "AUTO OFF", 900);
    if (state.auto && !state.spinning) startSpin();
  }

  function cycleBet() {
    const bets = [10, 25, 50, 100, 200];
    const idx = bets.indexOf(state.bet);
    state.bet = bets[(idx + 1) % bets.length];
    showToast(`BET ${state.bet}`, 800);
  }

  function evaluatePayout() {
    // Very simple: pay for 3+ of a kind on middle row only
    const mid = state.reels.map((reel) => reel.strip[(reel.pos + 1) % reel.strip.length]);
    // count matches
    const counts = {};
    for (const id of mid) counts[id] = (counts[id] || 0) + 1;
    const best = Object.values(counts).reduce((a,b)=>Math.max(a,b),0);
    let win = 0;
    if (best >= 3) win = state.bet * (best === 3 ? 3 : best === 4 ? 8 : 20);
    if (win > 0) {
      state.credits += win;
      showToast(`WIN +${win}`, 1100);
    } else {
      showToast("NO WIN", 700);
    }
  }

  function draw() {
    const ctx = canvas.getContext("2d");
    const dpr = DPR();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const W = canvas.clientWidth;
    const H = canvas.clientHeight;

    // Clear
    ctx.clearRect(0, 0, W, H);

    // Fetch viewport region within canvas
    const scr = state.layout.screen;
    const vp = scr.viewport;

    const vx = W * vp.x;
    const vy = H * vp.y;
    const vw = W * vp.w;
    const vh = H * vp.h;

    // Dark well to cover underlying static symbols
    ctx.save();
    const grd = ctx.createLinearGradient(0, vy, 0, vy + vh);
    grd.addColorStop(0, "#030615");
    grd.addColorStop(0.35, "#040013");
    grd.addColorStop(1, "#000000");
    ctx.fillStyle = grd;
    ctx.fillRect(vx, vy, vw, vh);
    ctx.restore();

    // Subtle stars
    ctx.save();
    ctx.globalAlpha = 0.16;
    for (let i = 0; i < 120; i++) {
      const x = vx + (i * 37 % 997) / 997 * vw;
      const y = vy + (i * 91 % 991) / 991 * vh;
      const r = (i % 3 === 0) ? 1.2 : 0.8;
      ctx.fillStyle = (i % 7 === 0) ? "rgba(0,255,255,0.9)" : "rgba(255,255,255,0.85)";
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    const colW = vw / 5;
    const rowH = vh / 3;

    // Draw each reel (3 visible rows)
    for (let c = 0; c < 5; c++) {
      const reel = state.reels[c];
      // clip to column
      ctx.save();
      ctx.beginPath();
      ctx.rect(vx + c * colW, vy, colW, vh);
      ctx.clip();

      // Draw 4 rows to cover movement
      for (let r = -1; r < 4; r++) {
        const idx = (reel.pos + r + reel.strip.length) % reel.strip.length;
        const symId = reel.strip[idx];
        const sym = state.symbols[symId];

        // center in cell, zoom slightly
        const cellX = vx + c * colW;
        const cellY = vy + (r * rowH) + reel.offset;

        const targetW = colW * 0.88 * state.zoom;
        const targetH = rowH * 0.88 * state.zoom;

        const dx = cellX + (colW - targetW) / 2;
        const dy = cellY + (rowH - targetH) / 2;

        ctx.drawImage(sym.img, dx, dy, targetW, targetH);
      }

      ctx.restore();
    }

    // Cyan/purple field edge around viewport
    ctx.save();
    ctx.strokeStyle = "#26fff6";
    ctx.lineWidth = 4;
    ctx.shadowColor = "#7f2bff";
    ctx.shadowBlur = 18;
    ctx.strokeRect(vx + 4, vy + 4, vw - 8, vh - 8);
    ctx.restore();

    // Pulsing containment dashed frame
    const tPulse = (performance.now() * 0.001) % 1;
    ctx.save();
    ctx.globalAlpha = 0.26 + 0.18 * Math.sin(tPulse * Math.PI * 2);
    ctx.strokeStyle = "#7f2bff";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(vx + 10, vy + 10, vw - 20, vh - 20);
    ctx.restore();

    // Cyan scanlines over viewport
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = "rgba(0, 255, 255, 0.5)";
    for (let y = vy; y < vy + vh; y += 3) {
      ctx.fillRect(vx, y, vw, 1);
    }
    ctx.restore();

    // Animated ooze drips (top + bottom)
    ctx.save();
    const oozeCount = 10;
    const baseTop = vy;
    const baseBot = vy + vh - 6;
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < oozeCount; i++) {
        const phase = (i * 97.37 + performance.now() * 0.08) * 0.002;
        const x = vx + ((i + 0.5) / oozeCount) * vw;
        const len = (pass === 0 ? (18 + 22 * (0.5 + 0.5 * Math.sin(phase * 2 * Math.PI))) : (10 + 12 * (0.5 + 0.5 * Math.sin(phase * 2 * Math.PI))));
        const wobble = 4 * Math.sin(phase * 4 * Math.PI);

        const yBase = pass === 0 ? baseTop : baseBot - len;
        const grdOoze = ctx.createLinearGradient(x, yBase, x, yBase + len);
        grdOoze.addColorStop(0, "rgba(0, 255, 220, 0.0)");
        grdOoze.addColorStop(0.2, "rgba(0, 255, 220, 0.7)");
        grdOoze.addColorStop(1, "rgba(145, 0, 255, 0.95)");

        ctx.beginPath();
        ctx.moveTo(x - 3 + wobble, yBase);
        ctx.quadraticCurveTo(x + wobble * 0.7, yBase + len * 0.65, x + 3 + wobble, yBase + len);
        ctx.quadraticCurveTo(x + wobble * 0.4, yBase + len * 0.5, x - 3 + wobble, yBase);
        ctx.closePath();

        ctx.fillStyle = grdOoze;
        ctx.shadowColor = "rgba(0, 255, 220, 0.7)";
        ctx.shadowBlur = 12;
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function tick(now) {
    // Update reel offsets
    let anySpinning = false;

    for (let i = 0; i < state.reels.length; i++) {
      const reel = state.reels[i];
      if (!reel.spinning) continue;

      anySpinning = true;
      const t = Math.min(1, (now - reel.tStart) / reel.dur);
      const e = easeOutCubic(t);

      // travel distance in rows (wraps)
      const wraps = 10 + i * 3;
      const travelRows = wraps * 3 + 3; // plenty
      const vpH = canvas.clientHeight * state.layout.screen.viewport.h;
      const rowH = vpH / 3;

      const yTravel = travelRows * rowH;
      const y = yTravel * (1 - e);

      // Convert y into pos + offset
      const rowsPassed = Math.floor(y / rowH);
      reel.offset = -(y % rowH);

      // Update pos as we pass rows
      reel.pos = (reel.targetPos + rowsPassed) % reel.strip.length;

      if (t >= 1) {
        reel.spinning = false;
        reel.pos = reel.targetPos % reel.strip.length;
        reel.offset = 0;
      }
    }

    draw();

    if (anySpinning) {
      requestAnimationFrame(tick);
    } else {
      state.spinning = false;
      evaluatePayout();
      stopAutoIfNeeded();
    }
  }

  function bindUI() {
    btnSpin.addEventListener("click", () => startSpin(), { passive: true });
    btnAuto.addEventListener("click", () => toggleAuto(), { passive: true });
    btnBet.addEventListener("click", () => cycleBet(), { passive: true });

    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") { e.preventDefault(); startSpin(); }
      if (e.key === "c" || e.key === "C") toggleCalib();
    });

    // Mobile-friendly: three-finger tap toggles calibration
    let touches = 0;
    window.addEventListener("touchstart", (e) => {
      touches = e.touches.length;
      if (touches >= 3) toggleCalib();
    }, { passive: true });
  }

  function toggleCalib() {
    state.calib = !state.calib;
    document.body.classList.toggle("calib", state.calib);
    showToast(state.calib ? "CALIB ON" : "CALIB OFF", 900);
  }

  async function init() {
    bindUI();
    // Ensure layout is loaded even if assets are slow
    state.layout = await loadJSON("assets/layout.json?v=2");

    // Load symbol images
    state.symbols = await Promise.all(state.layout.symbols.map(async (s) => {
      const img = new Image();
      img.src = s.file + "?v=2";
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = () => rej(new Error("Failed to load " + img.src));
      });
      return { id: s.id, img };
    }));

    makeReels();

    // When cabinet renders, position overlays
    const relayout = () => { applyLayout(); draw(); };

    // Wait for cabinet to layout
    if (!cabinetImg.complete) {
      cabinetImg.addEventListener("load", relayout, { once: true });
    }
    window.addEventListener("resize", () => { applyLayout(); draw(); }, { passive: true });
    // First layout
    applyLayout();
    draw();

    showToast("BiO-Slotz READY", 1000);
  }

  init().catch((err) => {
    console.error(err);
    showToast("INIT ERROR", 2000);
  });
})();
