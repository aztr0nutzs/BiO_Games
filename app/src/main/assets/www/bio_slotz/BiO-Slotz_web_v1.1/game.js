(() => {
  "use strict";
  const $ = (s) => document.querySelector(s);

  // ===== Embedded layout + symbol metadata (no fetch required) =====
  const LAYOUT = {
  "cabinet": {
    "w": 1170,
    "h": 2048
  },
  "screen": {
    "x": 0.05982905982905983,
    "y": 0.2978515625,
    "w": 0.8803418803418803,
    "h": 0.33203125,
    "viewport": {
      "x": 0.03398058252427184,
      "y": 0.1323529411764706,
      "w": 0.9320388349514563,
      "h": 0.6470588235294118
    }
  },
  "buttons": {
    "spin": {
      "x": 0.039316239316239315,
      "y": 0.7353515625,
      "w": 0.2931623931623932,
      "h": 0.1865234375
    },
    "auto": {
      "x": 0.39829059829059826,
      "y": 0.74169921875,
      "w": 0.2282051282051282,
      "h": 0.18017578125
    },
    "bet": {
      "x": 0.6726495726495727,
      "y": 0.77392578125,
      "w": 0.3264957264957265,
      "h": 0.19140625
    }
  },
  "symbols": [
    {
      "id": 0,
      "file": "assets/symbols/s00.png"
    },
    {
      "id": 1,
      "file": "assets/symbols/s01.png"
    },
    {
      "id": 2,
      "file": "assets/symbols/s02.png"
    },
    {
      "id": 3,
      "file": "assets/symbols/s03.png"
    },
    {
      "id": 4,
      "file": "assets/symbols/s04.png"
    },
    {
      "id": 5,
      "file": "assets/symbols/s05.png"
    },
    {
      "id": 6,
      "file": "assets/symbols/s06.png"
    },
    {
      "id": 7,
      "file": "assets/symbols/s07.png"
    },
    {
      "id": 8,
      "file": "assets/symbols/s08.png"
    },
    {
      "id": 9,
      "file": "assets/symbols/s09.png"
    },
    {
      "id": 10,
      "file": "assets/symbols/s10.png"
    },
    {
      "id": 11,
      "file": "assets/symbols/s11.png"
    },
    {
      "id": 12,
      "file": "assets/symbols/s12.png"
    },
    {
      "id": 13,
      "file": "assets/symbols/s13.png"
    },
    {
      "id": 14,
      "file": "assets/symbols/s14.png"
    },
    {
      "id": 15,
      "file": "assets/symbols/s15.png"
    },
    {
      "id": 16,
      "file": "assets/symbols/s16.png"
    },
    {
      "id": 18,
      "file": "assets/symbols/s18.png"
    },
    {
      "id": 19,
      "file": "assets/symbols/s19.png"
    },
    {
      "id": 20,
      "file": "assets/symbols/s20.png"
    },
    {
      "id": 21,
      "file": "assets/symbols/s21.png"
    },
    {
      "id": 22,
      "file": "assets/symbols/s22.png"
    },
    {
      "id": 23,
      "file": "assets/symbols/s23.png"
    },
    {
      "id": 24,
      "file": "assets/symbols/s24.png"
    },
    {
      "id": 25,
      "file": "assets/symbols/s25.png"
    },
    {
      "id": 26,
      "file": "assets/symbols/s26.png"
    },
    {
      "id": 27,
      "file": "assets/symbols/s27.png"
    },
    {
      "id": 28,
      "file": "assets/symbols/s28.png"
    }
  ],
  "title": "BiO-Slotz"
};

  const SYMBOLS = [
  {
    "id": 0,
    "code": "s00",
    "name": "Skull",
    "file": "assets/symbols/s00.png",
    "wild": false,
    "scatter": false,
    "pay3": 6,
    "pay4": 15,
    "pay5": 80,
    "weight": 4
  },
  {
    "id": 1,
    "code": "s01",
    "name": "DVD",
    "file": "assets/symbols/s01.png",
    "wild": false,
    "scatter": false,
    "pay3": 3,
    "pay4": 8,
    "pay5": 40,
    "weight": 6
  },
  {
    "id": 2,
    "code": "s02",
    "name": "Bottle",
    "file": "assets/symbols/s02.png",
    "wild": false,
    "scatter": false,
    "pay3": 3,
    "pay4": 8,
    "pay5": 40,
    "weight": 6
  },
  {
    "id": 3,
    "code": "s03",
    "name": "Money Bag",
    "file": "assets/symbols/s03.png",
    "wild": false,
    "scatter": false,
    "pay3": 30,
    "pay4": 120,
    "pay5": 600,
    "weight": 2
  },
  {
    "id": 4,
    "code": "s04",
    "name": "Lightning",
    "file": "assets/symbols/s04.png",
    "wild": false,
    "scatter": false,
    "pay3": 5,
    "pay4": 12,
    "pay5": 60,
    "weight": 5
  },
  {
    "id": 5,
    "code": "s05",
    "name": "Duck Grenade",
    "file": "assets/symbols/s05.png",
    "wild": false,
    "scatter": false,
    "pay3": 16,
    "pay4": 60,
    "pay5": 300,
    "weight": 3
  },
  {
    "id": 6,
    "code": "s06",
    "name": "Diamond",
    "file": "assets/symbols/s06.png",
    "wild": false,
    "scatter": false,
    "pay3": 50,
    "pay4": 200,
    "pay5": 1000,
    "weight": 1
  },
  {
    "id": 7,
    "code": "s07",
    "name": "Biohazard",
    "file": "assets/symbols/s07.png",
    "wild": false,
    "scatter": false,
    "pay3": 6,
    "pay4": 15,
    "pay5": 80,
    "weight": 4
  },
  {
    "id": 8,
    "code": "s08",
    "name": "Bot Head",
    "file": "assets/symbols/s08.png",
    "wild": false,
    "scatter": false,
    "pay3": 2,
    "pay4": 6,
    "pay5": 30,
    "weight": 7
  },
  {
    "id": 9,
    "code": "s09",
    "name": "Teddy",
    "file": "assets/symbols/s09.png",
    "wild": false,
    "scatter": false,
    "pay3": 3,
    "pay4": 8,
    "pay5": 40,
    "weight": 6
  },
  {
    "id": 10,
    "code": "s10",
    "name": "Bat",
    "file": "assets/symbols/s10.png",
    "wild": false,
    "scatter": false,
    "pay3": 18,
    "pay4": 70,
    "pay5": 350,
    "weight": 3
  },
  {
    "id": 11,
    "code": "s11",
    "name": "Bunny",
    "file": "assets/symbols/s11.png",
    "wild": false,
    "scatter": false,
    "pay3": 10,
    "pay4": 30,
    "pay5": 150,
    "weight": 4
  },
  {
    "id": 12,
    "code": "s12",
    "name": "Mystery",
    "file": "assets/symbols/s12.png",
    "wild": false,
    "scatter": true,
    "pay3": 0,
    "pay4": 0,
    "pay5": 0,
    "weight": 2
  },
  {
    "id": 13,
    "code": "s13",
    "name": "Crown",
    "file": "assets/symbols/s13.png",
    "wild": false,
    "scatter": false,
    "pay3": 40,
    "pay4": 150,
    "pay5": 750,
    "weight": 1
  },
  {
    "id": 14,
    "code": "s14",
    "name": "Spider",
    "file": "assets/symbols/s14.png",
    "wild": false,
    "scatter": false,
    "pay3": 5,
    "pay4": 12,
    "pay5": 60,
    "weight": 5
  },
  {
    "id": 15,
    "code": "s15",
    "name": "Shark",
    "file": "assets/symbols/s15.png",
    "wild": false,
    "scatter": false,
    "pay3": 2,
    "pay4": 6,
    "pay5": 30,
    "weight": 7
  },
  {
    "id": 16,
    "code": "s16",
    "name": "Star",
    "file": "assets/symbols/s16.png",
    "wild": false,
    "scatter": false,
    "pay3": 2,
    "pay4": 6,
    "pay5": 30,
    "weight": 7
  },
  {
    "id": 18,
    "code": "s18",
    "name": "Prism Cube",
    "file": "assets/symbols/s18.png",
    "wild": false,
    "scatter": false,
    "pay3": 2,
    "pay4": 6,
    "pay5": 30,
    "weight": 7
  },
  {
    "id": 19,
    "code": "s19",
    "name": "Planet Ring",
    "file": "assets/symbols/s19.png",
    "wild": false,
    "scatter": false,
    "pay3": 4,
    "pay4": 10,
    "pay5": 50,
    "weight": 5
  },
  {
    "id": 20,
    "code": "s20",
    "name": "Rose",
    "file": "assets/symbols/s20.png",
    "wild": false,
    "scatter": false,
    "pay3": 9,
    "pay4": 25,
    "pay5": 120,
    "weight": 4
  },
  {
    "id": 21,
    "code": "s21",
    "name": "Gengar",
    "file": "assets/symbols/s21.png",
    "wild": false,
    "scatter": false,
    "pay3": 7,
    "pay4": 18,
    "pay5": 90,
    "weight": 4
  },
  {
    "id": 22,
    "code": "s22",
    "name": "Alien",
    "file": "assets/symbols/s22.png",
    "wild": true,
    "scatter": false,
    "pay3": 25,
    "pay4": 100,
    "pay5": 500,
    "weight": 2
  },
  {
    "id": 23,
    "code": "s23",
    "name": "Controller",
    "file": "assets/symbols/s23.png",
    "wild": false,
    "scatter": false,
    "pay3": 8,
    "pay4": 20,
    "pay5": 100,
    "weight": 4
  },
  {
    "id": 24,
    "code": "s24",
    "name": "Gift",
    "file": "assets/symbols/s24.png",
    "wild": false,
    "scatter": false,
    "pay3": 14,
    "pay4": 50,
    "pay5": 250,
    "weight": 3
  },
  {
    "id": 25,
    "code": "s25",
    "name": "Rocket",
    "file": "assets/symbols/s25.png",
    "wild": false,
    "scatter": false,
    "pay3": 12,
    "pay4": 40,
    "pay5": 200,
    "weight": 3
  },
  {
    "id": 26,
    "code": "s26",
    "name": "Ghost",
    "file": "assets/symbols/s26.png",
    "wild": false,
    "scatter": false,
    "pay3": 2,
    "pay4": 6,
    "pay5": 30,
    "weight": 7
  },
  {
    "id": 27,
    "code": "s27",
    "name": "Skull Patch",
    "file": "assets/symbols/s27.png",
    "wild": false,
    "scatter": false,
    "pay3": 20,
    "pay4": 80,
    "pay5": 400,
    "weight": 2
  },
  {
    "id": 28,
    "code": "s28",
    "name": "Vault Boy",
    "file": "assets/symbols/s28.png",
    "wild": false,
    "scatter": false,
    "pay3": 1,
    "pay4": 4,
    "pay5": 20,
    "weight": 8
  }
];

  const WILD_ID = 22;      // Alien
  const SCATTER_ID = 12;   // Mystery (?)
  const SCATTER_PAYS = {3: 2, 4: 10, 5: 50}; // x Total Bet
  const SCATTER_FS   = {3: 5, 4: 10, 5: 20}; // Free Spins

  const PAYLINES = [0, 1, 2]; // top/mid/bot

  // ===== DOM =====
  const cabinetWrap = $("#cabinetWrap");
  const screenWrap = $("#screenWrap");
  const reelCanvas = $("#reels");
  const fxCanvas = $("#fx");

  const btnSpin = $("#btn-spin");
  const btnAuto = $("#btn-auto");
  const btnBet  = $("#btn-bet");
  const toastEl = $("#toast");

  const hudCredits = $("#hudCredits");
  const hudBet = $("#hudBet");
  const hudLines = $("#hudLines");
  const hudWin = $("#hudWin");
  const hudFS = $("#hudFS");

  const DPR = () => Math.max(1, Math.min(3, window.devicePixelRatio || 1));

  // ===== State =====
  const state = {
    credits: 2000,
    betPerLine: 10,
    lines: 3,
    lastWin: 0,
    freeSpins: 0,
    auto: false,
    spinning: false,
    reels: [],
    symbolById: new Map(),
    pending: null,
    winFx: null,
    calib: false,

    zoom: 1.10,
    spinDurBase: 980,
    spinDurStep: 170,
    _consumedFreeSpin: false,
  };

  function showToast(text, ms = 1100) {
    toastEl.textContent = text;
    toastEl.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toastEl.classList.remove("show"), ms);
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function now() { return performance.now(); }

  function totalBet() { return state.betPerLine * state.lines; }

  function setReadyGlow() {
    const canSpin = (!state.spinning) && (state.freeSpins > 0 || state.credits >= totalBet());
    btnSpin.classList.toggle("ready", canSpin);
  }

  function updateHUD() {
    hudCredits.textContent = String(state.credits);
    hudBet.textContent = String(totalBet());
    hudLines.textContent = String(state.lines);
    hudWin.textContent = String(state.lastWin);
    hudFS.textContent = String(state.freeSpins);
    setReadyGlow();
  }

  function rectToPx(normRect, wrapRect) {
    return {
      left: wrapRect.width * normRect.x,
      top: wrapRect.height * normRect.y,
      width: wrapRect.width * normRect.w,
      height: wrapRect.height * normRect.h,
    };
  }

  function applyLayout() {
    const wrapRect = cabinetWrap.getBoundingClientRect();

    const s = rectToPx(LAYOUT.screen, wrapRect);
    screenWrap.style.left = s.left + "px";
    screenWrap.style.top = s.top + "px";
    screenWrap.style.width = s.width + "px";
    screenWrap.style.height = s.height + "px";

    const dpr = DPR();
    for (const c of [reelCanvas, fxCanvas]) {
      c.width = Math.floor(s.width * dpr);
      c.height = Math.floor(s.height * dpr);
      c.style.width = s.width + "px";
      c.style.height = s.height + "px";
    }

    const b = LAYOUT.buttons;
    const spin = rectToPx(b.spin, wrapRect);
    const auto = rectToPx(b.auto, wrapRect);
    const bet  = rectToPx(b.bet,  wrapRect);

    Object.assign(btnSpin.style, { left: spin.left + "px", top: spin.top + "px", width: spin.width + "px", height: spin.height + "px" });
    Object.assign(btnAuto.style, { left: auto.left + "px", top: auto.top + "px", width: auto.width + "px", height: auto.height + "px" });
    Object.assign(btnBet.style,  { left: bet.left + "px",  top: bet.top + "px",  width: bet.width + "px",  height: bet.height + "px" });

    draw();
  }

  // ===== Symbols =====
  function preloadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  async function loadSymbols() {
    for (const s of SYMBOLS) {
      const img = await preloadImage(s.file);
      state.symbolById.set(s.id, { ...s, img });
    }
  }

  // ===== Reel strips =====
  function buildStrip(seedOffset = 0) {
    const pool = [];
    for (const s of SYMBOLS) {
      const w = Math.max(1, (s.weight | 0));
      for (let i = 0; i < w; i++) pool.push(s.id);
    }
    const stripLen = 60;
    const strip = [];
    let t = 0;
    while (strip.length < stripLen) {
      const idx = Math.floor((Math.sin((t + 1 + seedOffset) * 999.13) * 100000) % pool.length);
      strip.push(pool[(idx + pool.length) % pool.length]);
      t++;
    }
    const rot = (seedOffset * 7) % stripLen;
    return strip.slice(rot).concat(strip.slice(0, rot));
  }

  function makeReels() {
    state.reels = Array.from({ length: 5 }, (_, i) => {
      const strip = buildStrip(i * 13);
      return {
        strip,
        pos: 2,
        spinning: false,
        tStart: 0,
        dur: 0,
        targetPos: 0,
      };
    });
  }

  // ===== RNG helpers =====
  function rand() { return Math.random(); }
  function pickWeighted(items) {
    let total = 0;
    for (const it of items) total += it.w;
    let r = rand() * total;
    for (const it of items) {
      r -= it.w;
      if (r <= 0) return it.id;
    }
    return items[items.length - 1].id;
  }

  function randomSymbolId(exclude = new Set()) {
    const items = [];
    for (const s of SYMBOLS) {
      if (exclude.has(s.id)) continue;
      items.push({ id: s.id, w: s.weight });
    }
    return pickWeighted(items);
  }

  function buildRandomGrid() {
    const g = Array.from({ length: 3 }, () => Array(5).fill(0));
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 5; c++) {
        g[r][c] = randomSymbolId();
      }
    }
    return g;
  }

  function forceLineWin(grid, row, symId, count) {
    for (let c = 0; c < count; c++) grid[row][c] = symId;
    for (let c = count; c < 5; c++) grid[row][c] = randomSymbolId(new Set([symId]));
  }

  function maybeAddWilds(grid, row, count) {
    if (rand() < 0.35) {
      const howMany = rand() < 0.6 ? 1 : 2;
      for (let k = 0; k < Math.min(howMany, count); k++) {
        const pos = Math.floor(rand() * count);
        grid[row][pos] = WILD_ID;
      }
    }
  }

  function maybeScatter(grid) {
    if (rand() < 0.12) {
      const count = rand() < 0.75 ? 3 : (rand() < 0.92 ? 4 : 5);
      for (let i = 0; i < count; i++) {
        const r = Math.floor(rand() * 3);
        const c = Math.floor(rand() * 5);
        grid[r][c] = SCATTER_ID;
      }
    }
  }

  function generateOutcome() {
    const r = rand();
    let tier = "lose";
    if (r < 0.27) tier = "small";
    if (r < 0.09) tier = "med";
    if (r < 0.018) tier = "big";
    if (r < 0.004) tier = "jackpot";

    const grid = buildRandomGrid();
    let forced = null;

    if (tier !== "lose") {
      const row = PAYLINES[Math.floor(rand() * PAYLINES.length)];
      const count = tier === "small" ? 3 : tier === "med" ? 4 : 5;

      const candidates = SYMBOLS
        .filter(s => !s.scatter)
        .map(s => {
          const base = (s.pay3 + s.pay4 + s.pay5) || 1;
          const w = (tier === "small") ? (1 / Math.pow(base, 0.35))
                  : (tier === "med")   ? (1 / Math.pow(base, 0.15))
                  :                     Math.pow(base, 0.18);
          return { id: s.id, w: Math.max(0.5, Math.min(6, w * 3)) };
        });

      let symId = pickWeighted(candidates);
      if (tier === "jackpot") symId = (rand() < 0.55) ? 6 : 13;

      forceLineWin(grid, row, symId, count);
      maybeAddWilds(grid, row, count);
      forced = { row, symId, count, tier };
    }

    maybeScatter(grid);
    return { grid, forced };
  }

  // ===== Evaluation =====
  function resolveBaseSymbol(line) {
    for (let i = 0; i < line.length; i++) {
      const id = line[i];
      if (id !== WILD_ID) return id;
    }
    return WILD_ID;
  }

  function lineWin(line) {
    const base = resolveBaseSymbol(line);
    if (base === SCATTER_ID) return null;

    let count = 0;
    for (let i = 0; i < line.length; i++) {
      const id = line[i];
      if (id === base || id === WILD_ID) count++;
      else break;
    }
    if (count < 3) return null;

    const sym = state.symbolById.get(base);
    if (!sym) return null;
    const payUnits = (count === 3) ? sym.pay3 : (count === 4) ? sym.pay4 : sym.pay5;
    if (!payUnits) return null;

    return { symId: base, count, payUnits };
  }

  function countScatters(grid) {
    let n = 0;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 5; c++) {
        if (grid[r][c] === SCATTER_ID) n++;
      }
    }
    return n;
  }

  function evaluateGrid(grid) {
    const lineResults = [];
    let unitsTotal = 0;
    const winningRows = new Set();

    for (const row of PAYLINES) {
      const line = [grid[row][0], grid[row][1], grid[row][2], grid[row][3], grid[row][4]];
      const w = lineWin(line);
      if (w) {
        lineResults.push({ row, ...w });
        unitsTotal += w.payUnits;
        winningRows.add(row);
      }
    }

    const scat = countScatters(grid);
    let scatterMult = 0;
    let freeAdd = 0;
    if (scat >= 3) {
      const k = clamp(scat, 3, 5);
      scatterMult = SCATTER_PAYS[k];
      freeAdd = SCATTER_FS[k];
    }

    return {
      lineResults,
      winningRows: Array.from(winningRows),
      unitsTotal,
      scatters: scat,
      scatterMult,
      freeAdd,
    };
  }

  // ===== Apply outcome to reels =====
  function applyOutcomeToReels(outcome) {
    const grid = outcome.grid;
    const t0 = now();
    state.reels.forEach((reel, i) => {
      reel.spinning = true;
      reel.tStart = t0;
      reel.dur = state.spinDurBase + i * state.spinDurStep;

      const reelLen = reel.strip.length;
      const wraps = 4 + i;
      const base = (reel.pos + wraps * reelLen) % reelLen;

      reel.strip[(base + 0) % reelLen] = grid[0][i];
      reel.strip[(base + 1) % reelLen] = grid[1][i];
      reel.strip[(base + 2) % reelLen] = grid[2][i];

      reel.targetPos = base;
    });
  }

  // ===== Drawing =====
  function drawReels() {
    const ctx = reelCanvas.getContext("2d");
    const dpr = DPR();
    const W = reelCanvas.width;
    const H = reelCanvas.height;
    ctx.clearRect(0, 0, W, H);

    const vp = LAYOUT.screen.viewport || { x: 0, y: 0, w: 1, h: 1 };
    const vx = Math.floor(vp.x * W);
    const vy = Math.floor(vp.y * H);
    const vw = Math.floor(vp.w * W);
    const vh = Math.floor(vp.h * H);

    // Dark bio-lab well
    ctx.save();
    const grd = ctx.createLinearGradient(0, 0, 0, H);
    grd.addColorStop(0, "#030615");
    grd.addColorStop(0.35, "#040013");
    grd.addColorStop(1, "#000000");
    ctx.fillStyle = grd;
    ctx.fillRect(vx, vy, vw, vh);
    ctx.restore();

    const colW = vw / 5;
    const rowH = vh / 3;

    for (let c = 0; c < 5; c++) {
      const reel = state.reels[c];

      ctx.save();
      ctx.beginPath();
      ctx.rect(vx + c * colW, vy, colW, vh);
      ctx.clip();

      let prog = 1;
      if (reel.spinning) {
        const t = clamp((now() - reel.tStart) / reel.dur, 0, 1);
        prog = easeOutCubic(t);
      }
      const travel = (1 - prog) * (rowH * 9);

      for (let r = -2; r < 5; r++) {
        const idx = (reel.pos + r + reel.strip.length) % reel.strip.length;
        const symId = reel.strip[idx];
        const sym = state.symbolById.get(symId);
        if (!sym) continue;

        const cellX = vx + c * colW;
        const cellY = vy + r * rowH - (travel % (rowH * 3));

        const pad = Math.min(colW, rowH) * 0.06;
        const drawW = colW * state.zoom - pad * 2;
        const drawH = rowH * state.zoom - pad * 2;
        const dx = cellX + (colW - drawW) * 0.5;
        const dy = cellY + (rowH - drawH) * 0.5;

        ctx.globalAlpha = reel.spinning ? 0.96 : 1;
        ctx.drawImage(sym.img, dx, dy, drawW, drawH);
      }

      ctx.restore();
    }

    // Cyan/purple field edges
    ctx.save();
    ctx.strokeStyle = "#26fff6";
    ctx.lineWidth = 4 * dpr;
    ctx.shadowColor = "#7f2bff";
    ctx.shadowBlur = 18 * dpr;
    ctx.strokeRect(vx + 4 * dpr, vy + 4 * dpr, vw - 8 * dpr, vh - 8 * dpr);
    ctx.restore();

    // Pulsing containment lines
    const tPulse = (now() * 0.001) % 1;
    ctx.save();
    ctx.globalAlpha = 0.26 + 0.18 * Math.sin(tPulse * Math.PI * 2);
    ctx.strokeStyle = "#7f2bff";
    ctx.lineWidth = 2 * dpr;
    ctx.setLineDash([8 * dpr, 6 * dpr]);
    ctx.strokeRect(vx + 10 * dpr, vy + 10 * dpr, vw - 20 * dpr, vh - 20 * dpr);
    ctx.restore();

    // Scanlines
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = "rgba(0, 255, 255, 0.5)";
    for (let y = vy; y < vy + vh; y += 3 * dpr) {
      ctx.fillRect(vx, y, vw, 1 * dpr);
    }
    ctx.restore();
  }

  function drawFx() {
    const ctx = fxCanvas.getContext("2d");
    const dpr = DPR();
    const W = fxCanvas.width;
    const H = fxCanvas.height;
    ctx.clearRect(0, 0, W, H);

    const vp = LAYOUT.screen.viewport || { x: 0, y: 0, w: 1, h: 1 };
    const vx = Math.floor(vp.x * W);
    const vy = Math.floor(vp.y * H);
    const vw = Math.floor(vp.w * W);
    const vh = Math.floor(vp.h * H);

    if (state.winFx && now() < state.winFx.until) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const rowH = vh / 3;
      for (const r of state.winFx.rows) {
        const y = vy + (r + 0.5) * rowH;
        ctx.strokeStyle = "rgba(0,255,255,0.85)";
        ctx.lineWidth = 4 * dpr;
        ctx.shadowColor = "rgba(127,43,255,0.9)";
        ctx.shadowBlur = 16 * dpr;
        ctx.beginPath();
        ctx.moveTo(vx + 10 * dpr, y);
        ctx.lineTo(vx + vw - 10 * dpr, y);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  function draw() {
    drawReels();
    drawFx();
  }

  // ===== Spin =====
  function finishSpin() {
    const pending = state.pending;
    state.pending = null;

    // snap
    state.reels.forEach((reel) => {
      reel.spinning = false;
      reel.pos = reel.targetPos;
    });

    const res = evaluateGrid(pending.grid);

    let win = 0;
    win += res.unitsTotal * state.betPerLine;

    if (res.scatterMult) {
      win += res.scatterMult * totalBet();
      state.freeSpins += res.freeAdd;
    }

    state.lastWin = win;
    if (win > 0) {
      state.credits += win;
      state.winFx = { rows: res.winningRows, until: now() + 1400 };
      showToast("WIN +" + win, 1200);
    } else {
      showToast("NO WIN", 700);
    }

    updateHUD();
    state.spinning = false;

    if (state.auto) {
      setTimeout(() => {
        if (state.auto && !state.spinning) startSpin();
      }, 420);
    }
  }

  function tick() {
    if (!state.spinning) return;
    let any = false;
    for (const reel of state.reels) {
      if (!reel.spinning) continue;
      const t = clamp((now() - reel.tStart) / reel.dur, 0, 1);
      if (t >= 1) {
        reel.spinning = false;
        reel.pos = reel.targetPos;
      } else {
        any = true;
      }
    }
    draw();
    if (any) requestAnimationFrame(tick);
    else finishSpin();
  }

  function startSpin() {
    if (state.spinning) return;

    const usingFree = state.freeSpins > 0;
    const bet = totalBet();

    if (!usingFree && state.credits < bet) {
      showToast("INSUFFICIENT CREDITS", 1200);
      return;
    }

    if (usingFree) {
      state.freeSpins -= 1;
      showToast("FREE SPIN", 700);
    } else {
      state.credits -= bet;
      showToast("SPINNING...", 700);
    }

    state.lastWin = 0;
    updateHUD();

    const outcome = generateOutcome();
    state.pending = outcome;
    applyOutcomeToReels(outcome);

    state.spinning = true;
    requestAnimationFrame(tick);
  }

  function toggleAuto() {
    state.auto = !state.auto;
    showToast(state.auto ? "AUTO ON" : "AUTO OFF", 900);
    if (state.auto && !state.spinning) startSpin();
  }

  function cycleBet() {
    const bets = [10, 20, 50, 100, 200, 500];
    const idx = bets.indexOf(state.betPerLine);
    state.betPerLine = bets[(idx + 1) % bets.length];
    showToast("BET " + totalBet(), 800);
    updateHUD();
  }

  // ===== UI =====
  function bindUI() {
    btnSpin.addEventListener("click", (e) => { e.preventDefault(); startSpin(); });
    btnAuto.addEventListener("click", (e) => { e.preventDefault(); toggleAuto(); });
    btnBet.addEventListener("click", (e) => { e.preventDefault(); cycleBet(); });

    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") { e.preventDefault(); startSpin(); }
      if (e.key && e.key.toLowerCase() === "c") toggleCalib();
    }, { passive: false });

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
    await loadSymbols();
    makeReels();
    updateHUD();
    applyLayout();
    window.addEventListener("resize", () => applyLayout(), { passive: true });
    showToast("BiO-Slotz READY", 1000);
  }

  init().catch((err) => {
    console.error(err);
    showToast("INIT ERROR", 2200);
  });
})();
