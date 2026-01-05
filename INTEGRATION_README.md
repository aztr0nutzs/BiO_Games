# Bio Games Integration Documentation

## Overview

This document describes the integration of all Bio Games components into a cohesive project with persistent data storage via the MemoryBank system.

## Project Structure

```
bio_games/
├── main_lobby.html              # Main hub/lobby screen
├── memory-bank.js               # Core persistent storage system
├── bioslotz-integration.js      # Bio_Slotz MemoryBank integration
├── knxt4-integration.js         # KNXT4 MemoryBank integration
├── Bio_Slotz_web_v1.1/         # Web version of Bio_Slotz
│   ├── index.html               # (Updated with integration scripts)
│   ├── game.js                  # (Original, unmodified)
│   └── assets/                   # (Original, unmodified)
├── Bio_Slotz_Android/          # Android version
│   └── app/src/main/assets/www/  # (Updated with integration scripts)
│       ├── index.html           # (Updated with integration scripts)
│       ├── memory-bank.js       # (Copied)
│       ├── bioslotz-integration.js # (Copied)
│       └── game.js              # (Original, unmodified)
└── KNXT4/                       # KNXT4 game
    ├── bio_knxt4.html          # (Updated with integration scripts)
    └── assets/                   # (Original, unmodified)
```

## MemoryBank System

### Purpose
The MemoryBank provides persistent cross-session data storage for:
- Player profile (username, avatar, level, XP)
- Currencies (credits, tickets, bio-coins)
- Inventory (items, unlocks)
- Game statistics (per-game stats)
- Settings (audio, theme, preferences)

### Implementation
- Uses `localStorage` for web and Android compatibility
- Auto-saves on data changes (debounced)
- Auto-saves on page unload
- Periodic auto-save every 30 seconds
- Event system for real-time updates

### Data Schema

```javascript
{
  version: "1.0.0",
  profile: {
    username: string,
    avatar: string,
    level: number,
    xp: number,
    xpToNext: number,
    joinDate: ISO string,
    lastLogin: ISO string
  },
  currencies: {
    credits: number,
    tickets: number,
    bioCoins: number
  },
  inventory: {
    items: array,
    unlocks: array
  },
  gameStats: {
    bioslotz: {
      totalSpins: number,
      totalWins: number,
      totalLosses: number,
      highestWin: number,
      totalCreditsWon: number,
      totalCreditsSpent: number,
      freeSpinsEarned: number,
      lastPlayed: ISO string
    },
    knxt4: {
      gamesPlayed: number,
      gamesWon: number,
      gamesLost: number,
      winStreak: number,
      bestWinStreak: number,
      totalMoves: number,
      lastPlayed: ISO string
    }
  },
  settings: {
    audio: { enabled, musicVolume, sfxVolume },
    theme: string,
    preferences: { autoSave, showTutorials }
  }
}
```

## Navigation Flow

1. **Lobby → Games**: 
   - User clicks game card
   - Session flag set: `sessionStorage.setItem('returnToLobby', 'true')`
   - Navigate to game HTML
   - MemoryBank saves current state

2. **Games → Lobby**:
   - "Return to Lobby" button appears (if session flag exists)
   - MemoryBank saves game state
   - Navigate back to `main_lobby.html`
   - Lobby loads and displays updated data

## Integration Details

### Main Lobby (main_lobby.html)
- Loads `memory-bank.js` on page load
- Displays user profile and currencies from MemoryBank
- Updates UI when MemoryBank data changes
- Saves state before navigation

### Bio_Slotz Integration
- **Non-invasive**: Does not modify `game.js`
- Hooks into HUD updates to track credits
- Tracks spins, wins, and losses via button clicks
- Saves credits to MemoryBank after each spin
- Updates game statistics

### KNXT4 Integration
- **Non-invasive**: Does not modify core game logic
- Hooks into game win/loss events
- Tracks games played, wins, losses, streaks
- Updates game statistics

### Android Build
- All integration scripts copied to `app/src/main/assets/www/`
- `index.html` updated to include integration scripts
- Original game files remain unmodified
- MemoryBank uses localStorage (works in Android WebView)

## Usage

### Accessing MemoryBank

```javascript
// Get all data
const data = window.memoryBank.getAll();

// Get specific section
const profile = window.memoryBank.get('profile');
const credits = window.memoryBank.get('currencies', 'credits');

// Update data
window.memoryBank.set('currencies', 'credits', 5000);
window.memoryBank.update('profile', { level: 5, xp: 200 });

// Add currency
window.memoryBank.addCurrency('credits', 100);

// Update game stats
window.memoryBank.updateGameStats('bioslotz', {
  totalSpins: 10,
  totalWins: 3
});

// Listen for updates
window.memoryBank.on('update', (data) => {
  console.log('Data updated:', data);
});
```

### Building Android App

1. Ensure all integration files are in `app/src/main/assets/www/`
2. Build normally with Android Studio or Gradle
3. MemoryBank will work automatically via localStorage in WebView

## File Modifications Summary

### Modified Files (Non-Core)
- `main_lobby.html` - Added MemoryBank integration and navigation
- `Bio_Slotz_web_v1.1/index.html` - Added integration script tags
- `Bio_Slotz_Android/app/src/main/assets/www/index.html` - Added integration script tags
- `KNXT4/bio_knxt4.html` - Added integration script tags

### New Files
- `memory-bank.js` - Core storage system
- `bioslotz-integration.js` - Bio_Slotz integration wrapper
- `knxt4-integration.js` - KNXT4 integration wrapper

### Unmodified Files (Core Functionality)
- All `game.js` files
- All `style.css` files
- All asset files
- All other game logic files

## Testing

1. Open `main_lobby.html` in browser
2. Verify user data loads and displays
3. Navigate to Bio_Slotz
4. Play game, verify credits persist
5. Return to lobby, verify updated credits
6. Navigate to KNXT4
7. Play game, verify stats track
8. Return to lobby, verify stats updated

## Troubleshooting

### MemoryBank not loading
- Check file paths are correct
- Verify `memory-bank.js` is accessible
- Check browser console for errors

### Data not persisting
- Verify localStorage is enabled
- Check browser storage limits
- Verify auto-save is working (check console logs)

### Navigation not working
- Verify sessionStorage flag is set
- Check file paths in integration scripts
- Verify return button is created

## Future Enhancements

- Cloud sync support
- Export/import save data
- Achievement system
- Leaderboards
- Multiplayer data sync

