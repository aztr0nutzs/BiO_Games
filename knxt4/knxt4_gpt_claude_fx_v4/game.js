// ═══════════════════════════════════════════════════════════════
// KnXT 4 - Enhanced Bio-Lab Connect 4
// Game logic with chip selection and unlocking
// ═══════════════════════════════════════════════════════════════

(function() {
  'use strict';

  // ─────────────────────────────────────────────────────────────
  // Constants
  // ─────────────────────────────────────────────────────────────
  const COLS = 7;
  const ROWS = 6;
  const PLAYER1 = 1;
  const PLAYER2 = 2;
  const STORAGE_KEY = 'knxt4_save';

  // Chip files from window.KNXT4_CHIPS
  const CHIP_FILES = window.KNXT4_CHIPS || [];
  const CHIP_FOLDER = 'assets/chips/';

  // ─────────────────────────────────────────────────────────────
  // State
  // ─────────────────────────────────────────────────────────────
  let board = [];
  let currentPlayer = PLAYER1;
  let gameOver = false;
  let moveHistory = [];
  let aiMode = false;

  // Progress tracking
  let gamesPlayed = 0;
  let totalWins = 0;
  let unlockedCount = 2; // Start with 2 unlocked

  // Selected chips for each player
  let selectedChips = {
    p1: CHIP_FILES[0] || 's03.png',
    p2: CHIP_FILES[1] || 's04.png'
  };

  // Which player is selecting a chip (for modal)
  let selectingPlayer = null;

  // ─────────────────────────────────────────────────────────────
  // DOM Elements
  // ─────────────────────────────────────────────────────────────
  const boardEl = document.getElementById('board');
  const canvasWrapEl = document.getElementById('canvasWrap');
  const canvasEl = document.getElementById('gameCanvas');

  const turnPillEl = document.getElementById('turnPill');
  const gamesPillEl = document.getElementById('gamesPill');
  const winsPillEl = document.getElementById('winsPill');
  const unlockBarEl = document.getElementById('unlockBar');
  const messageEl = document.getElementById('message');
  const messageTextEl = messageEl.querySelector('.statusBox__text');
  
  const newGameBtn = document.getElementById('newGameBtn');
  const undoBtn = document.getElementById('undoBtn');
  const aiBtn = document.getElementById('aiBtn');
  const resetProgressBtn = document.getElementById('resetProgressBtn');
  
  const selectP1Btn = document.getElementById('selectP1Btn');
  const selectP2Btn = document.getElementById('selectP2Btn');
  const chipBarGridEl = document.getElementById('chipBarGrid');
  
  const p1ActivePreviewEl = document.getElementById('p1ActivePreview');
  const p2ActivePreviewEl = document.getElementById('p2ActivePreview');
  
  const modalEl = document.getElementById('modal');
  const modalTitleEl = document.getElementById('modalTitle');
  const modalBodyEl = document.getElementById('modalBody');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalCancelBtn = document.getElementById('modalCancelBtn');

  // ─────────────────────────────────────────────────────────────
  // Initialize
  // ─────────────────────────────────────────────────────────────
  function init() {
    loadProgress();
    initBoard();
    renderBoard();
    updateUI();
    renderChipBar();
    updateActivePreviews();
    attachEventListeners();
  }

  function initBoard() {
    board = [];
    for (let r = 0; r < ROWS; r++) {
      board[r] = [];
      for (let c = 0; c < COLS; c++) {
        board[r][c] = 0;
      }
    }
    currentPlayer = PLAYER1;
    gameOver = false;
    moveHistory = [];

    // renderer state reset
    winnerState = 0;
    winningCells = null;
    animChip = null;
    hoverCol = -1;
    needsRedraw = true;
  }

  // ─────────────────────────────────────────────────────────────
  // Local Storage
  // ─────────────────────────────────────────────────────────────
  function saveProgress() {
    const data = {
      gamesPlayed,
      totalWins,
      unlockedCount,
      selectedChips
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        gamesPlayed = data.gamesPlayed || 0;
        totalWins = data.totalWins || 0;
        unlockedCount = data.unlockedCount || 2;
        selectedChips = data.selectedChips || {
          p1: CHIP_FILES[0],
          p2: CHIP_FILES[1]
        };
      }
    } catch(e) {
      console.error('Failed to load progress', e);
    }
  }

  function resetProgress() {
    if (!confirm('Reset all progress and unlocks? This cannot be undone.')) return;
    gamesPlayed = 0;
    totalWins = 0;
    unlockedCount = 2;
    selectedChips = {
      p1: CHIP_FILES[0],
      p2: CHIP_FILES[1]
    };
    // Canvas board needs to refresh to reflect new chip symbols
    try { getChipImage(file); } catch (_) {}
    needsRedraw = true;

    saveProgress();
    updateUI();
    renderChipBar();
    updateActivePreviews();
    setMessage('Progress reset. All unlocks cleared.');
  }

  // ─────────────────────────────────────────────────────────────
  // UI Updates
  // ─────────────────────────────────────────────────────────────
  function updateUI() {
    // Turn pill
    turnPillEl.textContent = currentPlayer === PLAYER1 ? 'P1' : 'P2';
    turnPillEl.className = currentPlayer === PLAYER1 ? 'pill' : 'pill p2';

    // Stats
    gamesPillEl.textContent = gamesPlayed;
    winsPillEl.textContent = totalWins;

    // Unlock bar
    const nextUnlock = getNextUnlockRequirement();
    const progress = getUnlockProgress();
    unlockBarEl.style.width = progress + '%';

    // Undo button
    undoBtn.disabled = moveHistory.length === 0 || gameOver;

    // AI button
    const aiText = aiMode ? 'Solo: ON' : 'Solo: OFF';
    aiBtn.querySelector('.btn__text').textContent = aiText;
    aiBtn.setAttribute('aria-pressed', aiMode.toString());
  }

  function setMessage(text) {
    messageTextEl.textContent = text;
  }

  function getNextUnlockRequirement() {
    const unlocked = unlockedCount;
    if (unlocked < 3) return { games: 2, wins: 0 };
    if (unlocked < 4) return { games: 0, wins: 1 };
    // 5th+ every 2 wins
    const winsNeeded = Math.max(0, (unlocked - 2) * 2 - totalWins);
    return { games: 0, wins: winsNeeded > 0 ? winsNeeded : 2 };
  }

  function getUnlockProgress() {
    const unlocked = unlockedCount;
    if (unlocked >= CHIP_FILES.length) return 100;

    if (unlocked < 3) {
      return Math.min(100, (gamesPlayed / 2) * 100);
    }
    if (unlocked < 4) {
      return Math.min(100, (totalWins / 1) * 100);
    }
    // 5th+ every 2 wins
    const winsForCurrent = (unlocked - 2) * 2;
    const winsProgress = totalWins - winsForCurrent;
    return Math.min(100, (winsProgress / 2) * 100);
  }

  function checkUnlocks() {
    const before = unlockedCount;
    
    // 3rd chip after 2 games
    if (unlockedCount < 3 && gamesPlayed >= 2) {
      unlockedCount = 3;
    }
    // 4th chip after 1 win
    if (unlockedCount < 4 && totalWins >= 1) {
      unlockedCount = 4;
    }
    // 5th+ every 2 wins
    while (unlockedCount < CHIP_FILES.length) {
      const winsNeeded = (unlockedCount - 2) * 2;
      if (totalWins >= winsNeeded) {
        unlockedCount++;
      } else {
        break;
      }
    }

    if (unlockedCount > before) {
      const newChip = CHIP_FILES[unlockedCount - 1];
      setMessage(`New specimen unlocked: ${newChip.replace(/\.[^/.]+$/, '')}!`);
      renderChipBar();
    }
  }

  function updateActivePreviews() {
    const p1Chip = selectedChips.p1;
    const p2Chip = selectedChips.p2;
    
    p1ActivePreviewEl.style.backgroundImage = `url('${CHIP_FOLDER}${p1Chip}')`;
    p1ActivePreviewEl.style.backgroundSize = 'cover';
    p1ActivePreviewEl.style.backgroundPosition = 'center';
    
    p2ActivePreviewEl.style.backgroundImage = `url('${CHIP_FOLDER}${p2Chip}')`;
    p2ActivePreviewEl.style.backgroundSize = 'cover';
    p2ActivePreviewEl.style.backgroundPosition = 'center';
  }

  // ─────────────────────────────────────────────────────────────
  // Board Rendering
  // ─────────────────────────────────────────────────────────────
  function renderBoard() {
    ensureCanvasRenderer();
    needsRedraw = true;
  }

  function createCell(row, col) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.row = row;
    cell.dataset.col = col;
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', `Row ${row + 1}, Column ${col + 1}`);

    const player = board[row][col];
    if (player !== 0) {
      const chip = createChip(player);
      cell.appendChild(chip);
    }

    return cell;
  }

  function createChip(player, animate = false) {
    const chip = document.createElement('div');
    chip.className = 'chip' + (player === PLAYER1 ? ' p1' : ' p2');
    if (animate) chip.classList.add('drop');

    const img = document.createElement('div');
    img.className = 'img';
    const chipFile = player === PLAYER1 ? selectedChips.p1 : selectedChips.p2;
    img.style.backgroundImage = `url('${CHIP_FOLDER}${chipFile}')`;
    chip.appendChild(img);

    const sheen = document.createElement('div');
    sheen.className = 'sheen';
    chip.appendChild(sheen);

    return chip;
  }

  // ─────────────────────────────────────────────────────────────
  // Perp6 Canvas Board Renderer (transplanted board-only)
  // Keeps Claude game logic/state; renders board + chips + FX on canvas.
  // ─────────────────────────────────────────────────────────────
  const ASPECT = 16 / 9;
  const VW = 1600;
  const VH = 900;

  let rendererReady = false;
  let needsRedraw = true;

  const ambientFx = true; // keep ambient tube/gadget animations running

  // Interaction / FX state
  let hoverCol = -1;
  let winnerState = 0;       // 0 = none/draw, 1 = P1, 2 = P2
  let winningCells = null;   // [[r,c],...]
  let animChip = null;       // {row,col,player,t0,dur,fromY,shake}
  let shaking = 0;
  let particles = [];
  let ambientParticles = [];

  // Renderer tuning (safe defaults). 0..1
  const settings = {
    fxDensity: 0.85
  };


  // Canvas state
  let ctx = null;
  let W = 0, H = 0, dpr = 1;

  // Offscreen layers (background/board/fx) for crispness
  let bgCanvas = null, bgCtx = null;
  let boardCanvas = null, boardCtx = null;
  let fxCanvas = null, fxCtx = null;

  // Layout
  let boardX = 0, boardY = 0, boardW = 0, boardH = 0, cellSize = 0, holeR = 0;

  // Chip image cache
  const chipImages = new Map();

  function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function easeOutBack(t) { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }

  function getChipFileForPlayer(p) {
    return (p === PLAYER1 ? selectedChips.p1 : selectedChips.p2) || (CHIP_FILES[0] || 's03.png');
  }

  function getChipImage(file) {
    const key = String(file || '');
    if (!key) return null;
    let img = chipImages.get(key);
    if (img) return img;
    img = new Image();
    img.decoding = 'async';
    img.loading = 'eager';
    img.src = `${CHIP_FOLDER}${key}`;
    img.onload = () => { needsRedraw = true; };
    img.onerror = () => { /* ignore */ };
    chipImages.set(key, img);
    return img;
  }

  function ensureCanvasRenderer() {
    if (rendererReady) return;
    if (!canvasEl) {
      console.warn('[knxt4] gameCanvas not found; falling back to DOM board (not expected).');
      return;
    }

    ctx = canvasEl.getContext('2d', { alpha: false });

    bgCanvas = document.createElement('canvas');
    bgCtx = bgCanvas.getContext('2d', { alpha: true });

    boardCanvas = document.createElement('canvas');
    boardCtx = boardCanvas.getContext('2d', { alpha: true });

    fxCanvas = document.createElement('canvas');
    fxCtx = fxCanvas.getContext('2d', { alpha: true });

    // Preload the currently selected chip images (and whatever is unlocked)
    try {
      CHIP_FILES.forEach(f => { if (f) getChipImage(f); });
      getChipImage(selectedChips.p1);
      getChipImage(selectedChips.p2);
    } catch (_) {}

    window.addEventListener('resize', () => {
      resizeCanvas();
      needsRedraw = true;
    });

    resizeCanvas();
    rendererReady = true;
    requestAnimationFrame(tick);
  }

  function resizeCanvas() {
    if (!canvasEl || !canvasWrapEl) return;

    const rect = canvasWrapEl.getBoundingClientRect();
    const cssW = Math.max(1, rect.width);
    const cssH = Math.max(1, rect.height);

    // Fit a 16:9 stage inside available space
    let fitW = cssW;
    let fitH = fitW / ASPECT;
    if (fitH > cssH) {
      fitH = cssH;
      fitW = fitH * ASPECT;
    }

    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    canvasEl.style.width = `${fitW}px`;
    canvasEl.style.height = `${fitH}px`;

    W = Math.floor(fitW * dpr);
    H = Math.floor(fitH * dpr);

    canvasEl.width = W;
    canvasEl.height = H;

    [bgCanvas, boardCanvas, fxCanvas].forEach(c => {
      c.width = W;
      c.height = H;
    });

    computeLayout();
    renderBackgroundLayer();
    renderBoardLayer();
    seedAmbientParticles();
    needsRedraw = true;
  }

  function computeLayout() {
    const pad = 6 * dpr;
    const usableW = W - pad * 2;
    const usableH = H - pad * 2;

    // Board ratio is COLS/ROWS, but we keep the 16:9 stage with some margins
    const boardRatio = COLS / ROWS;
    let bw = usableW;
    let bh = bw / boardRatio;
    if (bh > usableH) {
      bh = usableH;
      bw = bh * boardRatio;
    }

    boardW = bw;
    boardH = bh;
    boardX = (W - bw) / 2;
    boardY = (H - bh) / 2;

    cellSize = boardH / ROWS;
    holeR = cellSize * 0.58;
  }

  function drawRoundedRect(c, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    c.beginPath();
    c.moveTo(x + rr, y);
    c.arcTo(x + w, y, x + w, y + h, rr);
    c.arcTo(x + w, y + h, x, y + h, rr);
    c.arcTo(x, y + h, x, y, rr);
    c.arcTo(x, y, x + w, y, rr);
    c.closePath();
  }

  function renderBackgroundLayer() {
    if (!bgCtx) return;
    bgCtx.setTransform(1, 0, 0, 1, 0, 0);
    bgCtx.clearRect(0, 0, W, H);
    bgCtx.fillStyle = '#000000';
    bgCtx.fillRect(0, 0, W, H);

    // subtle vignette
    const vg = bgCtx.createRadialGradient(W * 0.5, H * 0.4, 10, W * 0.5, H * 0.5, Math.max(W, H) * 0.65);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(0,0,0,0.65)');
    bgCtx.fillStyle = vg;
    bgCtx.fillRect(0, 0, W, H);

    // floating lab specks
    bgCtx.globalAlpha = 0.12;
    for (let i = 0; i < 60; i++) {
      const x = rand(0, W), y = rand(0, H);
      const r = rand(0.6, 2.0) * dpr;
      bgCtx.fillStyle = `rgba(255,255,255,${rand(0.015, 0.05)})`;
      bgCtx.beginPath();
      bgCtx.arc(x, y, r, 0, Math.PI * 2);
      bgCtx.fill();
    }    bgCtx.globalAlpha = 1;

    // Tube-stand supports + cyber gadgets around the board (static geometry)
    drawTubeStands(bgCtx);
    drawBoardGadgets(bgCtx);

  }

  function renderBoardLayer() {
    if (!boardCtx) return;
    boardCtx.setTransform(1, 0, 0, 1, 0, 0);
    boardCtx.clearRect(0, 0, W, H);

    // outer panel
    const px = boardX - cellSize * 0.35;
    const py = boardY - cellSize * 0.25;
    const pw = boardW + cellSize * 0.70;
    const ph = boardH + cellSize * 0.50;

    // panel fill
    const pg = boardCtx.createLinearGradient(px, py, px, py + ph);
    pg.addColorStop(0, 'rgba(24,28,40,0.98)');
    pg.addColorStop(1, 'rgba(6,7,10,0.98)');
    boardCtx.fillStyle = pg;
    drawRoundedRect(boardCtx, px, py, pw, ph, 24 * dpr);
    boardCtx.fill();

    // neon rim
    boardCtx.save();
    boardCtx.lineWidth = 2.2 * dpr;
    boardCtx.strokeStyle = 'rgba(0,255,255,0.35)';
    boardCtx.shadowColor = 'rgba(0,255,255,0.55)';
    boardCtx.shadowBlur = 18 * dpr;
    drawRoundedRect(boardCtx, px, py, pw, ph, 24 * dpr);
    boardCtx.stroke();
    boardCtx.restore();

    // holes (visible cavities so they don't disappear on a black stage)
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cx = boardX + (c + 0.5) * (boardW / COLS);
        const cy = boardY + (r + 0.5) * (boardH / ROWS);

        // cavity core
        const hg = boardCtx.createRadialGradient(
          cx - holeR * 0.25, cy - holeR * 0.25, holeR * 0.20,
          cx, cy, holeR * 1.15
        );
        hg.addColorStop(0, 'rgba(0,0,0,0.20)');
        hg.addColorStop(0.45, 'rgba(0,0,0,0.70)');
        hg.addColorStop(1, 'rgba(0,0,0,0.98)');
        boardCtx.fillStyle = hg;
        boardCtx.beginPath();
        boardCtx.arc(cx, cy, holeR, 0, Math.PI * 2);
        boardCtx.fill();

        // bevel rim (subtle but visible)
        boardCtx.save();
        boardCtx.lineWidth = 2.1 * dpr;
        boardCtx.strokeStyle = 'rgba(220,235,255,0.14)';
        boardCtx.shadowColor = 'rgba(0,255,255,0.20)';
        boardCtx.shadowBlur = 10 * dpr;
        boardCtx.beginPath();
        boardCtx.arc(cx, cy, holeR * 1.02, 0, Math.PI * 2);
        boardCtx.stroke();
        boardCtx.restore();
      }
    }

    // inner rim around holes
    boardCtx.save();
    boardCtx.globalAlpha = 0.9;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cx = boardX + (c + 0.5) * (boardW / COLS);
        const cy = boardY + (r + 0.5) * (boardH / ROWS);
        const rg = boardCtx.createRadialGradient(cx - holeR * 0.25, cy - holeR * 0.25, holeR * 0.1, cx, cy, holeR * 1.25);
        rg.addColorStop(0, 'rgba(0,255,255,0.18)');
        rg.addColorStop(0.45, 'rgba(0,0,0,0.55)');
        rg.addColorStop(1, 'rgba(0,0,0,0.95)');
        boardCtx.fillStyle = rg;
        boardCtx.beginPath();
        boardCtx.arc(cx, cy, holeR * 1.08, 0, Math.PI * 2);
        boardCtx.fill();
      }
    }
    boardCtx.restore();
  }

  function drawScanlines(c) {
    c.save();
    c.globalAlpha = 0.10;
    c.fillStyle = 'rgba(255,255,255,0.08)';
    const step = 3 * dpr;
    for (let y = 0; y < H; y += step) {
      c.fillRect(0, y, W, 1 * dpr);
    }
    c.restore();
  }


  // ─────────────────────────────────────────────────────────────
  // Decorative hardware: tube-stands + gadgets (visual only)
  // ─────────────────────────────────────────────────────────────
  function getStandGeom() {
    const tubeW = 34 * dpr;
    const tubeGap = 16 * dpr;
    const tubeTop = boardY - 22 * dpr;
    const tubeBottom = boardY + boardH + 150 * dpr;
    const leftX = boardX - tubeGap - tubeW / 2;
    const rightX = boardX + boardW + tubeGap + tubeW / 2;
    const clampYs = [
      boardY + boardH * 0.22,
      boardY + boardH * 0.55,
      boardY + boardH * 0.82
    ];
    return { tubeW, tubeGap, tubeTop, tubeBottom, leftX, rightX, clampYs };
  }

  function drawTubeOne(c, xCenter, yTop, yBottom, tubeW, liquidRGBA, glowRGBA, isLeft) {
    const x = xCenter - tubeW / 2;
    const h = yBottom - yTop;
    const r = tubeW / 2;

    // glass body
    drawRoundedRect(c, x, yTop, tubeW, h, r);
    c.fillStyle = 'rgba(6,8,12,0.92)';
    c.fill();

    // glass rim
    c.lineWidth = 2 * dpr;
    c.strokeStyle = 'rgba(220,235,255,0.22)';
    c.stroke();

    // liquid (static base)
    c.save();
    c.clip();
    const lg = c.createLinearGradient(0, yBottom, 0, yTop);
    lg.addColorStop(0, liquidRGBA);
    lg.addColorStop(0.55, liquidRGBA.replace('0.85', '0.45'));
    lg.addColorStop(1, 'rgba(0,0,0,0)');
    c.globalAlpha = 0.95;
    c.fillStyle = lg;
    c.fillRect(x, yTop, tubeW, h);
    c.globalAlpha = 1;

    // inner core highlight
    const core = c.createLinearGradient(x + tubeW * 0.35, yTop, x + tubeW * 0.65, yBottom);
    core.addColorStop(0, 'rgba(255,255,255,0.18)');
    core.addColorStop(0.5, glowRGBA);
    core.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = core;
    c.fillRect(x + tubeW * 0.28, yTop + 8 * dpr, tubeW * 0.44, h - 16 * dpr);

    // grime / micro scratches
    c.globalAlpha = 0.12;
    c.fillStyle = 'rgba(255,255,255,0.4)';
    for (let i = 0; i < 18; i++) {
      const yy = yTop + (i / 18) * h;
      c.fillRect(x + rand(2, tubeW - 3) * dpr, yy, 1 * dpr, rand(10, 30) * dpr);
    }
    c.globalAlpha = 1;
    c.restore();

    // clamps to "hold" the board
    const { clampYs } = getStandGeom();
    clampYs.forEach((cy, idx) => {
      const clampH = 18 * dpr;
      const clampW = 22 * dpr;
      const clampX = x + tubeW * 0.15;
      const clampY = cy - clampH / 2;

      // tube clamp collar
      drawRoundedRect(c, clampX, clampY, tubeW * 0.7, clampH, 8 * dpr);
      const mg = c.createLinearGradient(clampX, 0, clampX + tubeW * 0.7, 0);
      mg.addColorStop(0, 'rgba(40,44,58,0.98)');
      mg.addColorStop(0.5, 'rgba(110,125,150,0.75)');
      mg.addColorStop(1, 'rgba(18,20,28,0.98)');
      c.fillStyle = mg;
      c.fill();
      c.lineWidth = 1 * dpr;
      c.strokeStyle = 'rgba(255,255,255,0.18)';
      c.stroke();

      // bridge arm into board edge
      const armY = cy - 6 * dpr;
      const armH = 12 * dpr;
      if (isLeft) {
        const armX = x + tubeW - 1 * dpr;
        const armW = (boardX - armX) + 8 * dpr;
        drawRoundedRect(c, armX, armY, armW, armH, 6 * dpr);
        c.fillStyle = 'rgba(14,16,24,0.96)';
        c.fill();
        c.strokeStyle = 'rgba(67,244,255,0.22)';
        c.stroke();
      } else {
        const armX = boardX + boardW - 8 * dpr;
        const armW = (x - armX) + 1 * dpr;
        drawRoundedRect(c, armX, armY, armW, armH, 6 * dpr);
        c.fillStyle = 'rgba(14,16,24,0.96)';
        c.fill();
        c.strokeStyle = 'rgba(255,75,216,0.18)';
        c.stroke();
      }

      // tiny screws
      c.fillStyle = 'rgba(255,255,255,0.25)';
      c.beginPath();
      c.arc(clampX + 6 * dpr, clampY + 6 * dpr, 1.4 * dpr, 0, Math.PI * 2);
      c.arc(clampX + tubeW * 0.7 - 6 * dpr, clampY + clampH - 6 * dpr, 1.4 * dpr, 0, Math.PI * 2);
      c.fill();
    });

    // base foot
    const footW = tubeW * 1.9;
    const footH = 24 * dpr;
    const footX = xCenter - footW / 2;
    const footY = yBottom - 2 * dpr;
    drawRoundedRect(c, footX, footY, footW, footH, 12 * dpr);
    const fg = c.createLinearGradient(footX, 0, footX + footW, 0);
    fg.addColorStop(0, 'rgba(12,14,20,0.98)');
    fg.addColorStop(0.5, 'rgba(90,110,140,0.55)');
    fg.addColorStop(1, 'rgba(10,12,18,0.98)');
    c.fillStyle = fg;
    c.fill();
    c.strokeStyle = 'rgba(255,255,255,0.14)';
    c.lineWidth = 1 * dpr;
    c.stroke();
  }

  function drawTubeStands(c) {
    const g = getStandGeom();
    // Left: lime biofluid
    drawTubeOne(c, g.leftX, g.tubeTop, g.tubeBottom, g.tubeW, 'rgba(155,247,59,0.85)', 'rgba(67,244,255,0.22)', true);
    // Right: cyan/magenta coolant
    drawTubeOne(c, g.rightX, g.tubeTop, g.tubeBottom, g.tubeW, 'rgba(67,244,255,0.78)', 'rgba(255,75,216,0.18)', false);

    // subtle shadow under the board to sell "mounted into stand"
    c.save();
    c.globalAlpha = 0.35;
    const sh = c.createRadialGradient(boardX + boardW / 2, boardY + boardH * 0.9, 10, boardX + boardW / 2, boardY + boardH * 1.08, boardW * 0.75);
    sh.addColorStop(0, 'rgba(0,0,0,0.0)');
    sh.addColorStop(1, 'rgba(0,0,0,0.85)');
    c.fillStyle = sh;
    c.fillRect(boardX - 60 * dpr, boardY + boardH - 20 * dpr, boardW + 120 * dpr, 220 * dpr);
    c.restore();
  }

  function drawBoardGadgets(c) {
    // Top rail gadget
    const railW = boardW * 0.62;
    const railH = 34 * dpr;
    const railX = boardX + (boardW - railW) / 2;
    const railY = boardY - railH - 18 * dpr;

    drawRoundedRect(c, railX, railY, railW, railH, 12 * dpr);
    const rg = c.createLinearGradient(railX, 0, railX + railW, 0);
    rg.addColorStop(0, 'rgba(12,14,22,0.98)');
    rg.addColorStop(0.45, 'rgba(95,110,140,0.55)');
    rg.addColorStop(1, 'rgba(10,12,18,0.98)');
    c.fillStyle = rg;
    c.fill();
    c.strokeStyle = 'rgba(255,255,255,0.16)';
    c.lineWidth = 1 * dpr;
    c.stroke();

    // vents + micro panels
    c.globalAlpha = 0.9;
    c.fillStyle = 'rgba(0,0,0,0.55)';
    for (let i = 0; i < 10; i++) {
      const vx = railX + 16 * dpr + i * (railW - 32 * dpr) / 10;
      c.fillRect(vx, railY + 10 * dpr, 8 * dpr, 3 * dpr);
      c.fillRect(vx, railY + 18 * dpr, 8 * dpr, 3 * dpr);
    }
    c.globalAlpha = 1;

    // Corner sensor pods (left/right)
    const podW = 58 * dpr;
    const podH = 34 * dpr;
    const podY = boardY + 18 * dpr;
    const pods = [
      { x: boardX - podW - 18 * dpr, y: podY, accent: 'rgba(155,247,59,0.35)' },
      { x: boardX + boardW + 18 * dpr, y: podY, accent: 'rgba(255,75,216,0.25)' }
    ];
    pods.forEach(p => {
      drawRoundedRect(c, p.x, p.y, podW, podH, 12 * dpr);
      c.fillStyle = 'rgba(10,12,18,0.96)';
      c.fill();
      c.strokeStyle = 'rgba(255,255,255,0.14)';
      c.stroke();
      // accent strip
      c.fillStyle = p.accent;
      c.fillRect(p.x + 10 * dpr, p.y + podH - 8 * dpr, podW - 20 * dpr, 3 * dpr);
      // tiny screen
      c.fillStyle = 'rgba(67,244,255,0.10)';
      c.fillRect(p.x + 10 * dpr, p.y + 8 * dpr, 18 * dpr, 10 * dpr);
    });

    // cables to tube stands
    c.save();
    c.lineWidth = 2 * dpr;
    c.strokeStyle = 'rgba(67,244,255,0.10)';
    c.beginPath();
    c.moveTo(railX + railW * 0.22, railY + railH);
    c.bezierCurveTo(railX, railY + railH + 30 * dpr, boardX - 30 * dpr, boardY + boardH * 0.2, getStandGeom().leftX, boardY + boardH * 0.3);
    c.stroke();
    c.strokeStyle = 'rgba(255,75,216,0.10)';
    c.beginPath();
    c.moveTo(railX + railW * 0.78, railY + railH);
    c.bezierCurveTo(railX + railW, railY + railH + 30 * dpr, boardX + boardW + 30 * dpr, boardY + boardH * 0.2, getStandGeom().rightX, boardY + boardH * 0.3);
    c.stroke();
    c.restore();
  }

  function renderTubeAndGadgetFx(c, now) {
    const g = getStandGeom();
    const tubeH = g.tubeBottom - g.tubeTop;

    function bubbleStream(xCenter, tintA, tintB) {
      const tubeW = g.tubeW;
      const x = xCenter - tubeW / 2;
      const r = tubeW / 2;

      // clip to tube interior
      c.save();
      drawRoundedRect(c, x + 2 * dpr, g.tubeTop + 2 * dpr, tubeW - 4 * dpr, tubeH - 4 * dpr, r - 2 * dpr);
      c.clip();

      // moving shimmer
      const phase = (now * 0.00045) % 1;
      const shimmerY = g.tubeBottom - phase * (tubeH + 60 * dpr);
      const sg = c.createLinearGradient(0, shimmerY, 0, shimmerY + 90 * dpr);
      sg.addColorStop(0, 'rgba(0,0,0,0)');
      sg.addColorStop(0.45, tintB);
      sg.addColorStop(1, 'rgba(0,0,0,0)');
      c.globalAlpha = 0.35;
      c.fillStyle = sg;
      c.fillRect(x, shimmerY, tubeW, 90 * dpr);
      c.globalAlpha = 1;

      // bubbles
      const count = 10;
      for (let i = 0; i < count; i++) {
        const p = ((now * 0.00055) + i * 0.14) % 1;
        const yy = g.tubeBottom - 10 * dpr - p * (tubeH - 24 * dpr);
        const xx = xCenter + Math.sin(now * 0.002 + i * 1.7) * (3.5 * dpr);
        const rr = (1.6 + (i % 3) * 0.9) * dpr;
        c.globalAlpha = 0.55;
        c.fillStyle = tintA;
        c.beginPath();
        c.arc(xx, yy, rr, 0, Math.PI * 2);
        c.fill();
        // spec highlight
        c.globalAlpha = 0.35;
        c.fillStyle = 'rgba(255,255,255,0.35)';
        c.beginPath();
        c.arc(xx - rr * 0.25, yy - rr * 0.35, rr * 0.35, 0, Math.PI * 2);
        c.fill();
      }
      c.globalAlpha = 1;
      c.restore();
    }

    // Left lime stream, right cyan stream
    bubbleStream(g.leftX, 'rgba(155,247,59,0.9)', 'rgba(155,247,59,0.35)');
    bubbleStream(g.rightX, 'rgba(67,244,255,0.85)', 'rgba(255,75,216,0.22)');

    // Gadget LEDs (blink)
    const railW = boardW * 0.62;
    const railH = 34 * dpr;
    const railX = boardX + (boardW - railW) / 2;
    const railY = boardY - railH - 18 * dpr;
    const ledCount = 7;
    for (let i = 0; i < ledCount; i++) {
      const x = railX + 22 * dpr + i * ((railW - 44 * dpr) / (ledCount - 1));
      const y = railY + railH - 10 * dpr;
      const a = 0.25 + 0.65 * (0.5 + 0.5 * Math.sin(now * 0.006 + i * 1.4));
      c.save();
      c.globalAlpha = a;
      c.shadowBlur = 10 * dpr;
      c.shadowColor = i % 2 ? 'rgba(255,75,216,0.7)' : 'rgba(67,244,255,0.7)';
      c.fillStyle = i % 2 ? 'rgba(255,75,216,0.95)' : 'rgba(67,244,255,0.95)';
      c.beginPath();
      c.arc(x, y, 2.2 * dpr, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }

    // Small HUD blips on corner pods
    const podY = boardY + 18 * dpr;
    const podW = 58 * dpr;
    const podH = 34 * dpr;
    const blips = [
      { x: boardX - podW - 18 * dpr + 40 * dpr, y: podY + 12 * dpr, col: 'rgba(155,247,59,0.85)' },
      { x: boardX + boardW + 18 * dpr + 40 * dpr, y: podY + 12 * dpr, col: 'rgba(255,75,216,0.75)' }
    ];
    blips.forEach((b, i) => {
      const a = 0.15 + 0.65 * (0.5 + 0.5 * Math.sin(now * 0.008 + i * 2.0));
      c.save();
      c.globalAlpha = a;
      c.shadowBlur = 8 * dpr;
      c.shadowColor = b.col;
      c.fillStyle = b.col;
      c.fillRect(b.x, b.y, 6 * dpr, 6 * dpr);
      c.restore();
    });
  }

  function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.age += dt;
      if (p.age >= p.life) {
        particles.splice(i, 1);
        continue;
      }
      p.vy += 220 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
    const maxParticles = 120;
    if (particles.length > maxParticles) particles.length = maxParticles;
  }
  function seedAmbientParticles() {
    // Soft floating motes across the whole stage (separate from burst particles)
    const density = clamp((settings && typeof settings.fxDensity === 'number') ? settings.fxDensity : 0.85, 0, 1);
    const target = Math.floor(160 + density * 320);
    ambientParticles.length = 0;
    const cols = ['rgba(0,255,255,', 'rgba(255,43,214,', 'rgba(57,255,20,'];
    for (let i = 0; i < target; i++) {
      const c = cols[(Math.random() * cols.length) | 0];
      ambientParticles.push({
        x: rand(0, W),
        y: rand(0, H),
        vx: rand(-10, 10) * dpr,
        vy: rand(-8, 8) * dpr,
        r: rand(0.7, 2.2) * dpr,
        a: rand(0.04, 0.16),
        col: c
      });
    }
  }

  function updateAmbientParticles(dt) {
    for (const p of ambientParticles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // gentle random walk
      p.vx += rand(-1.5, 1.5) * dt * dpr;
      p.vy += rand(-1.2, 1.2) * dt * dpr;
      p.vx = clamp(p.vx, -14 * dpr, 14 * dpr);
      p.vy = clamp(p.vy, -12 * dpr, 12 * dpr);

      // wrap
      if (p.x < -20) p.x = W + 20;
      if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20;
      if (p.y > H + 20) p.y = -20;
    }
  }

  function drawAmbientParticles(c) {
    if (!ambientParticles.length) return;
    c.save();
    c.globalCompositeOperation = 'lighter';
    // Keep it subtle so the background still reads as BLACK.
    for (const p of ambientParticles) {
      const density = clamp((settings && typeof settings.fxDensity === 'number') ? settings.fxDensity : 0.85, 0, 1);
      c.globalAlpha = p.a * (0.85 + density * 0.75);
      c.fillStyle = `${p.col}${0.9})`;
      c.beginPath();
      c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      c.fill();
    }
    c.restore();
  }


  function emitBurst(x, y, strength) {
    const n = Math.floor(18 + strength * 18);
    for (let i = 0; i < n; i++) {
      const a = rand(0, Math.PI * 2);
      const sp = rand(120, 320) * dpr * (0.7 + strength);
      particles.push({
        x, y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - rand(60, 180) * dpr,
        age: 0,
        life: rand(0.35, 0.9),
        r: rand(1.0, 2.6) * dpr,
        col: (Math.random() < 0.55) ? 'rgba(0,255,255,' : 'rgba(255,43,214,'
      });
    }
  }

  function drawChipCore(c, cx, cy, r, player, glow = 1) {
    // Base colors similar to perp6: cyan-ish P1, magenta-ish P2
    const baseA = player === PLAYER1 ? [0, 255, 255] : [255, 43, 214];
    const baseB = player === PLAYER1 ? [57, 255, 20] : [120, 0, 255];

    // body
    const rg = c.createRadialGradient(cx - r * 0.25, cy - r * 0.25, r * 0.15, cx, cy, r * 1.1);
    rg.addColorStop(0, `rgba(${baseA[0]},${baseA[1]},${baseA[2]},0.92)`);
    rg.addColorStop(0.45, `rgba(${baseB[0]},${baseB[1]},${baseB[2]},0.72)`);
    rg.addColorStop(1, 'rgba(0,0,0,0.85)');
    c.fillStyle = rg;
    c.beginPath();
    c.arc(cx, cy, r, 0, Math.PI * 2);
    c.fill();

    // rim
    c.save();
    c.lineWidth = 2 * dpr;
    c.strokeStyle = player === PLAYER1 ? 'rgba(0,255,255,0.65)' : 'rgba(255,43,214,0.65)';
    c.shadowColor = c.strokeStyle;
    c.shadowBlur = 14 * dpr * glow;
    c.beginPath();
    c.arc(cx, cy, r * 0.98, 0, Math.PI * 2);
    c.stroke();
    c.restore();

    // sheen
    c.save();
    c.globalAlpha = 0.25;
    c.fillStyle = 'rgba(255,255,255,0.55)';
    c.beginPath();
    c.arc(cx - r * 0.25, cy - r * 0.35, r * 0.42, 0, Math.PI * 2);
    c.fill();
    c.restore();
  }

  function drawChipSymbol(c, cx, cy, r, player) {
    const file = getChipFileForPlayer(player);
    const img = getChipImage(file);
    if (img && img.complete && img.naturalWidth > 0) {
      c.save();
      c.beginPath();
      c.arc(cx, cy, r * 0.58, 0, Math.PI * 2);
      c.clip();
      const s = r * 1.25;
      c.drawImage(img, cx - s / 2, cy - s / 2, s, s);
      c.restore();
      return;
    }

    // fallback glyph
    c.save();
    c.globalAlpha = 0.85;
    c.fillStyle = 'rgba(0,0,0,0.55)';
    c.beginPath();
    c.arc(cx, cy, r * 0.52, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = 'rgba(255,255,255,0.9)';
    c.font = `${Math.floor(r * 0.7)}px ui-sans-serif, system-ui`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText(player === PLAYER1 ? 'X' : 'O', cx, cy + 1 * dpr);
    c.restore();
  }

  function renderChipsLayer(c, now) {
    const cellW = boardW / COLS;
    const cellH = boardH / ROWS;

    // draw placed chips (skip animating chip cell until animation ends)
    for (let r = 0; r < ROWS; r++) {
      for (let col = 0; col < COLS; col++) {
        if (animChip && animChip.row === r && animChip.col === col && animChip.active) continue;
        const p = board[r][col];
        if (!p) continue;

        const cx = boardX + (col + 0.5) * cellW;
        const cy = boardY + (r + 0.5) * cellH;
        const rr = holeR * 0.86;

        drawChipCore(c, cx, cy, rr, p, 0.9);
        drawChipSymbol(c, cx, cy, rr, p);
      }
    }

    // animating falling chip
    if (animChip && animChip.active) {
      const t = clamp((now - animChip.t0) / animChip.dur, 0, 1);
      const eased = easeOutCubic(t);

      const cx = boardX + (animChip.col + 0.5) * cellW;
      const toY = boardY + (animChip.row + 0.5) * cellH;
      let cy = lerp(animChip.fromY, toY, eased);

      // bounce near end
      if (t > 0.85) {
        const bt = (t - 0.85) / 0.15;
        cy = toY + Math.sin(bt * Math.PI) * (holeR * 0.18) * (1 - bt);
      }

      const rr = holeR * 0.92;
      drawChipCore(c, cx, cy, rr, animChip.player, 1.1);
      drawChipSymbol(c, cx, cy, rr, animChip.player);

      // impact
      if (!animChip.impactDone && t >= 0.92) {
        animChip.impactDone = true;
        shaking = 1;
        emitBurst(cx, toY + rr * 0.35, 0.85);
        needsRedraw = true;
      }

      if (t >= 1) {
        animChip.active = false;
        animChip = null;
        needsRedraw = true;
      }
    }
  }

  function renderFxLayer(now, dt) {
    fxCtx.setTransform(1, 0, 0, 1, 0, 0);
    fxCtx.clearRect(0, 0, W, H);

    // Animated tube liquids + gadget LEDs (ambient)
    renderTubeAndGadgetFx(fxCtx, now);

    // Ambient floating particles (global)
    updateAmbientParticles(dt);
    drawAmbientParticles(fxCtx);

    // Hover column glow
    if (!gameOver && hoverCol >= 0 && hoverCol < COLS) {
      const cellW = boardW / COLS;
      const x = boardX + hoverCol * cellW;
      const g = fxCtx.createLinearGradient(x, boardY, x, boardY + boardH);
      g.addColorStop(0, 'rgba(0,255,255,0.00)');
      g.addColorStop(0.35, 'rgba(0,255,255,0.16)');
      g.addColorStop(1, 'rgba(255,43,214,0.00)');
      fxCtx.fillStyle = g;
      fxCtx.fillRect(x, boardY, cellW, boardH);
    }

    // Particles
    updateParticles(dt);
    for (const p of particles) {
      const k = 1 - (p.age / p.life);
      fxCtx.fillStyle = `${p.col}${0.55 * k})`;
      fxCtx.beginPath();
      fxCtx.arc(p.x, p.y, p.r * k, 0, Math.PI * 2);
      fxCtx.fill();
    }

    // Win highlight
    if (winningCells && winningCells.length >= 4) {
      fxCtx.save();
      fxCtx.globalAlpha = 0.9;
      fxCtx.lineWidth = 6 * dpr;
      fxCtx.strokeStyle = winnerState === PLAYER2 ? 'rgba(255,43,214,0.75)' : 'rgba(0,255,255,0.75)';
      fxCtx.shadowColor = fxCtx.strokeStyle;
      fxCtx.shadowBlur = 22 * dpr;
      fxCtx.beginPath();

      const cellW = boardW / COLS;
      const cellH = boardH / ROWS;

      // draw through the first and last cells (sorted by projection)
      const pts = winningCells.map(([r, c]) => ({
        x: boardX + (c + 0.5) * cellW,
        y: boardY + (r + 0.5) * cellH
      }));
      pts.sort((a, b) => (a.x + a.y) - (b.x + b.y));
      fxCtx.moveTo(pts[0].x, pts[0].y);
      fxCtx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      fxCtx.stroke();
      fxCtx.restore();
    }

    // CRT scanlines
    drawScanlines(fxCtx);
  }

  function tick(now) {
    if (!rendererReady) return;
    const t = now || performance.now();
    if (!tick._last) tick._last = t;
    const dt = Math.min(0.05, (t - tick._last) / 1000);
    tick._last = t;

    // decay shaking
    if (shaking > 0) shaking = Math.max(0, shaking - dt * 3.2);

    if (ambientFx || needsRedraw || animChip || particles.length || hoverCol >= 0 || winningCells) {
      drawFrame(t, dt);
      needsRedraw = false;
    }

    requestAnimationFrame(tick);
  }

  function drawFrame(now, dt) {
    if (!ctx) return;

    // subtle camera shake on impact
    const shakeMag = shaking * 6 * dpr;
    const sx = (Math.random() - 0.5) * shakeMag;
    const sy = (Math.random() - 0.5) * shakeMag;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, H);

    // base layers
    ctx.drawImage(bgCanvas, 0, 0);
    ctx.save();
    ctx.translate(sx, sy);
    ctx.drawImage(boardCanvas, 0, 0);

    // chips
    renderChipsLayer(ctx, now);

    ctx.restore();

    // fx overlay
    renderFxLayer(now, dt);
    ctx.drawImage(fxCanvas, 0, 0);
  }

  function canvasPointToCol(clientX, clientY) {
    if (!canvasEl) return -1;
    const rect = canvasEl.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) return -1;

    // Map CSS pixels -> internal layout (boardX is in device pixels)
    const scaleX = (W / rect.width);
    const scaleY = (H / rect.height);
    const px = x * scaleX;
    const py = y * scaleY;

    if (px < boardX || px > boardX + boardW || py < boardY || py > boardY + boardH) return -1;
    const col = Math.floor(((px - boardX) / boardW) * COLS);
    return clamp(col, 0, COLS - 1);
  }

  function startDropAnimation(row, col, player) {
    if (!rendererReady) ensureCanvasRenderer();
    if (!rendererReady) return;
    const cellH = boardH / ROWS;
    const toY = boardY + (row + 0.5) * cellH;
    const fromY = boardY - cellH * 0.85;

    animChip = {
      row, col, player,
      t0: performance.now(),
      dur: 520,
      fromY,
      active: true,
      impactDone: false
    };
    needsRedraw = true;
  }

  // ─────────────────────────────────────────────────────────────
  // Event Listeners
  // ─────────────────────────────────────────────────────────────
  function attachEventListeners() {    const boardTarget = canvasEl || boardEl;
    boardTarget.addEventListener('click', handleBoardClick);
    boardTarget.addEventListener('mousemove', handleBoardMove);
    boardTarget.addEventListener('mouseleave', handleBoardLeave);

    newGameBtn.addEventListener('click', newGame);
    undoBtn.addEventListener('click', undoMove);
    aiBtn.addEventListener('click', toggleAI);
    resetProgressBtn.addEventListener('click', resetProgress);

    selectP1Btn.addEventListener('click', () => openChipModal(PLAYER1));
    selectP2Btn.addEventListener('click', () => openChipModal(PLAYER2));

    closeModalBtn.addEventListener('click', closeModal);
    modalCancelBtn.addEventListener('click', closeModal);
    modalEl.addEventListener('click', (e) => {
      if (e.target === modalEl) closeModal();
    });
  }

  function handleBoardClick(e) {
    if (gameOver) return;
    if (animChip && animChip.active) return;
    if (aiMode && currentPlayer === PLAYER2) return;

    const col = canvasPointToCol(e.clientX, e.clientY);
    if (col < 0) return;

    dropChip(col);
  }

  function handleBoardMove(e) {
    if (gameOver) return;
    const col = canvasPointToCol(e.clientX, e.clientY);
    const next = (col >= 0 ? col : -1);
    if (next !== hoverCol) {
      hoverCol = next;
      needsRedraw = true;
    }
  }

  function handleBoardLeave() {
    if (hoverCol !== -1) {
      hoverCol = -1;
      needsRedraw = true;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Game Logic
  // ─────────────────────────────────────────────────────────────
  function dropChip(col) {
    if (gameOver) return false;

    if (animChip && animChip.active) return false;

    const row = getLowestEmptyRow(col);
    if (row === -1) {
      setMessage('Column full. Choose another.');
      return false;
    }

    board[row][col] = currentPlayer;
    moveHistory.push({ row, col, player: currentPlayer });

    // Perp6 canvas: animate the drop on the renderer
    startDropAnimation(row, col, currentPlayer);
    renderBoard();

    if (checkWin(row, col)) {
      endGame(currentPlayer);
      return true;
    }

    if (isBoardFull()) {
      endGame(0); // Draw
      return true;
    }

    switchPlayer();
    updateUI();

    // AI move
    if (aiMode && currentPlayer === PLAYER2 && !gameOver) {
      setTimeout(() => {
        aiMove();
      }, 600);
    }

    return true;
  }

  function getLowestEmptyRow(col) {
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][col] === 0) return r;
    }
    return -1;
  }

  function switchPlayer() {
    currentPlayer = currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1;
  }

  function checkWin(row, col) {
    const player = board[row][col];
    return (
      checkDirection(row, col, player, 0, 1) ||  // horizontal
      checkDirection(row, col, player, 1, 0) ||  // vertical
      checkDirection(row, col, player, 1, 1) ||  // diagonal \
      checkDirection(row, col, player, 1, -1)    // diagonal /
    );
  }

  function checkDirection(row, col, player, dRow, dCol) {
    let count = 1;
    const winCells = [[row, col]];

    // Check positive direction
    let r = row + dRow;
    let c = col + dCol;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
      count++;
      winCells.push([r, c]);
      r += dRow;
      c += dCol;
    }

    // Check negative direction
    r = row - dRow;
    c = col - dCol;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
      count++;
      winCells.push([r, c]);
      r -= dRow;
      c -= dCol;
    }

    if (count >= 4) {
      highlightWinningCells(winCells);
      return true;
    }
    return false;
  }

  function highlightWinningCells(cells) {
    winningCells = Array.isArray(cells) ? cells.slice() : null;
    winnerState = currentPlayer;
    needsRedraw = true;
  }

  function isBoardFull() {
    for (let c = 0; c < COLS; c++) {
      if (board[0][c] === 0) return false;
    }
    return true;
  }

  function endGame(winner) {
    gameOver = true;
    winnerState = winner;
    hoverCol = -1;
    needsRedraw = true;
    gamesPlayed++;

    if (winner === 0) {
      setMessage('Draw! Board full. No winner.');
    } else {
      totalWins++;
      const winnerName = winner === PLAYER1 ? 'Player 1' : 'Player 2';
      setMessage(`${winnerName} wins! Specimen analysis complete.`);
    }

    checkUnlocks();
    saveProgress();
    updateUI();
  }

  function newGame() {
    initBoard();
    renderBoard();
    updateUI();
    setMessage('New game initiated. Deploy your specimens.');
  }

  function undoMove() {
    if (moveHistory.length === 0 || gameOver) return;

    const lastMove = moveHistory.pop();
    board[lastMove.row][lastMove.col] = 0;
    currentPlayer = lastMove.player;

    winningCells = null;
    winnerState = 0;
    animChip = null;
    hoverCol = -1;
    needsRedraw = true;

    renderBoard();
    updateUI();
    setMessage('Move undone.');
  }

  function toggleAI() {
    aiMode = !aiMode;
    updateUI();
    setMessage(aiMode ? 'Solo mode activated. Lab Drone deployed.' : 'Solo mode deactivated.');
  }

  // ─────────────────────────────────────────────────────────────
  // AI Logic
  // ─────────────────────────────────────────────────────────────
  function aiMove() {
    if (gameOver) return;

    // Strategy: Try to win, then block, then smart move
    const col = findWinningMove(PLAYER2) ??
                findWinningMove(PLAYER1) ??
                findSmartMove();

    if (col !== null) {
      dropChip(col);
    }
  }

  function findWinningMove(player) {
    for (let c = 0; c < COLS; c++) {
      const r = getLowestEmptyRow(c);
      if (r === -1) continue;
      
      board[r][c] = player;
      const wins = checkWin(r, c);
      board[r][c] = 0;
      
      if (wins) return c;
    }
    return null;
  }

  function findSmartMove() {
    // Prefer center columns
    const colPriority = [3, 2, 4, 1, 5, 0, 6];
    for (const c of colPriority) {
      if (getLowestEmptyRow(c) !== -1) return c;
    }
    return null;
  }

  // ─────────────────────────────────────────────────────────────
  // Chip Bar
  // ─────────────────────────────────────────────────────────────
  function renderChipBar() {
    chipBarGridEl.innerHTML = '';

    CHIP_FILES.forEach((file, index) => {
      const isUnlocked = index < unlockedCount;
      const card = createChipCard(file, index, isUnlocked);
      chipBarGridEl.appendChild(card);
    });
  }

  function createChipCard(file, index, isUnlocked) {
    const card = document.createElement('div');
    card.className = 'chipCard';
    if (!isUnlocked) card.classList.add('locked');

    const isSelectedP1 = selectedChips.p1 === file;
    const isSelectedP2 = selectedChips.p2 === file;
    if (isSelectedP1 || isSelectedP2) {
      card.classList.add('selected');
    }

    const img = document.createElement('div');
    img.className = 'chipCard__img';
    img.style.backgroundImage = `url('${CHIP_FOLDER}${file}')`;
    card.appendChild(img);

    const ring = document.createElement('div');
    ring.className = 'chipCard__ring';
    card.appendChild(ring);

    if (index < 2) {
      const badge = document.createElement('div');
      badge.className = 'chipCard__badge';
      badge.textContent = `#${index + 1}`;
      card.appendChild(badge);
    }

    if (isUnlocked) {
      card.addEventListener('click', () => selectChipFromBar(file));
    }

    return card;
  }

  function selectChipFromBar(file) {
    // Quick select for current selecting player, or default to P1
    if (selectingPlayer === PLAYER1) {
      selectedChips.p1 = file;
    } else if (selectingPlayer === PLAYER2) {
      selectedChips.p2 = file;
    } else {
      // If no modal open, toggle between P1 and P2
      if (selectedChips.p1 === file) {
        selectedChips.p2 = file;
      } else {
        selectedChips.p1 = file;
      }
    }

    saveProgress();
    updateActivePreviews();
    renderChipBar();
    setMessage(`Specimen selected: ${file.replace(/\.[^/.]+$/, '')}`);
  }

  // ─────────────────────────────────────────────────────────────
  // Modal
  // ─────────────────────────────────────────────────────────────
  function openChipModal(player) {
    selectingPlayer = player;
    const playerName = player === PLAYER1 ? 'Player 1' : 'Player 2';
    modalTitleEl.textContent = `Select Specimen for ${playerName}`;

    modalBodyEl.innerHTML = '';
    CHIP_FILES.forEach((file, index) => {
      const isUnlocked = index < unlockedCount;
      const card = createModalChipCard(file, index, isUnlocked, player);
      modalBodyEl.appendChild(card);
    });

    modalEl.classList.add('show');
    modalEl.setAttribute('aria-hidden', 'false');
  }

  function createModalChipCard(file, index, isUnlocked, player) {
    const card = document.createElement('div');
    card.className = 'chipCard';
    if (!isUnlocked) card.classList.add('locked');

    const currentSelection = player === PLAYER1 ? selectedChips.p1 : selectedChips.p2;
    if (currentSelection === file) {
      card.classList.add('selected');
    }

    const img = document.createElement('div');
    img.className = 'chipCard__img';
    img.style.backgroundImage = `url('${CHIP_FOLDER}${file}')`;
    card.appendChild(img);

    const ring = document.createElement('div');
    ring.className = 'chipCard__ring';
    card.appendChild(ring);

    if (index < 2) {
      const badge = document.createElement('div');
      badge.className = 'chipCard__badge';
      badge.textContent = `#${index + 1}`;
      card.appendChild(badge);
    }

    if (isUnlocked) {
      card.addEventListener('click', () => {
        if (player === PLAYER1) {
          selectedChips.p1 = file;
        } else {
          selectedChips.p2 = file;
        }
        // Canvas board needs to refresh to reflect new chip symbols
        try { getChipImage(file); } catch (_) {}
        needsRedraw = true;

        saveProgress();
        updateActivePreviews();
        renderChipBar();
        setMessage(`Specimen selected for ${player === PLAYER1 ? 'Player 1' : 'Player 2'}: ${file.replace(/\.[^/.]+$/, '')}`);
        closeModal();
      });
    }

    return card;
  }

  function closeModal() {
    modalEl.classList.remove('show');
    modalEl.setAttribute('aria-hidden', 'true');
    selectingPlayer = null;
  }

  // ─────────────────────────────────────────────────────────────
  // Start
  // ─────────────────────────────────────────────────────────────
  init();
})();

