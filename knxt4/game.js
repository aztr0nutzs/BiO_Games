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
    boardEl.innerHTML = '';
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = createCell(r, c);
        boardEl.appendChild(cell);
      }
    }
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
  // Event Listeners
  // ─────────────────────────────────────────────────────────────
  function attachEventListeners() {
    boardEl.addEventListener('click', handleCellClick);
    boardEl.addEventListener('mouseover', handleCellHover);
    boardEl.addEventListener('mouseout', handleCellOut);

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

  function handleCellClick(e) {
    if (gameOver) return;
    if (aiMode && currentPlayer === PLAYER2) return;

    const cell = e.target.closest('.cell');
    if (!cell) return;

    const col = parseInt(cell.dataset.col);
    dropChip(col);
  }

  function handleCellHover(e) {
    if (gameOver) return;
    const cell = e.target.closest('.cell');
    if (!cell) return;

    const col = parseInt(cell.dataset.col);
    highlightColumn(col, true);
  }

  function handleCellOut(e) {
    const cell = e.target.closest('.cell');
    if (!cell) return;

    const col = parseInt(cell.dataset.col);
    highlightColumn(col, false);
  }

  function highlightColumn(col, on) {
    const cells = boardEl.querySelectorAll(`.cell[data-col="${col}"]`);
    cells.forEach(cell => {
      if (on) {
        cell.classList.add('colHint');
      } else {
        cell.classList.remove('colHint');
      }
    });
  }

  // ─────────────────────────────────────────────────────────────
  // Game Logic
  // ─────────────────────────────────────────────────────────────
  function dropChip(col) {
    if (gameOver) return false;

    const row = getLowestEmptyRow(col);
    if (row === -1) {
      setMessage('Column full. Choose another.');
      return false;
    }

    board[row][col] = currentPlayer;
    moveHistory.push({ row, col, player: currentPlayer });

    // Re-render board with animation
    const cell = boardEl.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (cell) {
      cell.innerHTML = '';
      const chip = createChip(currentPlayer, true);
      cell.appendChild(chip);
    }

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
    cells.forEach(([r, c]) => {
      const cell = boardEl.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
      if (cell) {
        const chip = cell.querySelector('.chip');
        if (chip) chip.classList.add('win');
      }
    });
  }

  function isBoardFull() {
    for (let c = 0; c < COLS; c++) {
      if (board[0][c] === 0) return false;
    }
    return true;
  }

  function endGame(winner) {
    gameOver = true;
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