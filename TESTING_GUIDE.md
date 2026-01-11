# BiO Games - Testing & Features Guide

## 🎮 How to Test Each Screen

### 1. Boot Screen
- App launches to boot.html
- Shows animated loading screen with spinner and progress bar
- Automatically transitions to lobby after 1.5 seconds
- ✅ **Status:** Fully functional

### 2. Lobby Screen
- Main menu with 3 buttons
- Click any button to navigate to that game mode
- Shows online status and version number
- ✅ **Status:** Fully functional

### 3. Knxt 4 Game
**How to Play:**
1. Click any column (0-6) to place your magenta piece (●)
2. AI automatically plays with green pieces (●)
3. Connect 4 pieces in a row to win (horizontal, vertical, or diagonal)
4. Full game mechanics:
   - Pieces fall to the bottom of selected column
   - Win detection across all directions
   - Draw detection when board fills
   - "New Game" button to restart
   - "Back to Lobby" button to return

**Features:**
- Turn indicator showing whose turn it is
- AI strategy: Tries to win, blocks your wins, or plays random
- Smooth animations and visual feedback
- ✅ **Status:** Fully functional with complete game logic

### 4. Ranked Queue
**Features:**
- Shows player stats:
  - Tier: Silver II
  - ELO: 1250
  - Win Rate: 52%
  - Total Games: 48
- "Join Ranked Queue" button toggles queue status
- When queuing:
  - Shows animated "Searching..." status
  - Updates wait time every 3 seconds
  - Simulates match found after 3-5 seconds
  - Shows opponent info when match is found
- Next tier progression at 1500 ELO
- ✅ **Status:** Fully functional with simulation

### 5. Bio Store
**Features:**
- Currency Display:
  - Bio Coins: 0
  - Bio Gems: 0
  - Battle Pass: Free
- Featured Items:
  - Golden Theme (500 💎) - Buyable
  - Aqua Theme (500 💎) - Buyable
  - Electric Skin (750 💎) - Coming Soon
  - Fire Skin (750 💎) - Coming Soon
- Currency Packs:
  - Starter Pack ($4.99)
  - Pro Pack ($9.99)
- Click "Buy" buttons to see purchase confirmation
- ✅ **Status:** Fully functional interface

---

## 🎨 Visual Features

### Color Scheme
- Primary: Cyan (#0ff) - Main accent color
- Secondary: Magenta (#f0f) - Player 1 pieces
- Tertiary: Green (#0f0) - Player 2/AI pieces
- Background: Dark gradient (#050510 to #0a0a15)

### Animations
- Glowing title effects on all screens
- Hover effects on buttons with scale and glow
- Smooth transitions between states
- Pulsing animation for active queue status
- Loading spinner on boot screen
- Progress bar on boot screen

### Responsive Design
- All screens optimized for mobile portrait orientation
- Max-width containers for proper viewing on larger screens
- Touch-friendly button sizes
- Proper spacing and padding

---

## 🔧 Technical Details

### No External Dependencies
- Pure HTML5/CSS3/JavaScript
- No jQuery or other libraries needed
- Firebase adapter available but not required (placeholder implementation)
- Works offline except for actual Firebase sync

### File Structure
```
/app/src/main/assets/www/
├── boot.html                 (Loading screen)
├── bio_lobby3.html          (Main lobby)
├── js/
│   └── firebase_adapter.js  (Firebase integration - optional)
└── screens/
    ├── knxt4.html           (Connect 4 game)
    ├── ranked.html          (Ranked matchmaking)
    └── store.html           (Shop interface)
```

---

## ✅ Verification Checklist

- [x] Boot screen has loading animation
- [x] Lobby screen is visually appealing with proper buttons
- [x] Can navigate from lobby to all game screens
- [x] Knxt 4 has working game board and AI opponent
- [x] Ranked queue shows stats and matchmaking UI
- [x] Bio Store displays shop items and currency
- [x] Back buttons work on all game screens
- [x] Consistent styling across all screens
- [x] Responsive mobile design
- [x] Smooth animations and transitions

---

## 🚀 Running the App

1. Build and deploy via Android Studio/Gradle
2. App will load boot.html automatically
3. Loading screen transitions to lobby
4. Explore all game modes!

The app is now fully functional with professional UI/UX! 🎉

