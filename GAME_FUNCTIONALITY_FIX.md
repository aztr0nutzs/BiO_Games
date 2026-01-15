# Game Functionality Fix Plan

## Current Issues

### 1. BiO-SLoTz
- **Issue:** Wrong cabinet or no reels showing
- **Cause:** game.js may not be initializing properly
- **Files exist:** ✅ game.js, style.css, all assets
- **Fix needed:** Verify game initialization

### 2. BiO-Wheel  
- **Issue:** Blank screen with octopuses
- **Cause:** wheel_script.js using React/external dependencies that may not load
- **Files exist:** ✅ wheel_script.js, wheel_style.css, wheel assets
- **Fix needed:** Simplify to vanilla JS or ensure dependencies load

### 3. BiO-Petz
- **Issue:** Zero functionality, tabs do nothing
- **Cause:** Loading external imgur images, game.js may not be connecting to UI
- **Files exist:** ✅ game.js, all data files, styles
- **Fix needed:** Replace external images, connect game logic to UI

## Verification Steps

### BiO-SLoTz Checklist
- [ ] game.js loads and executes
- [ ] Canvas initializes
- [ ] Symbols load from assets/symbols/
- [ ] Buttons are clickable
- [ ] Spin functionality works
- [ ] HUD updates

### BiO-Wheel Checklist
- [ ] wheel_script.js loads
- [ ] React components render
- [ ] Wheel canvas draws
- [ ] Prize images load from assets/
- [ ] Spin button works
- [ ] Win detection works

### BiO-Petz Checklist
- [ ] game.js connects to DOM
- [ ] Pet stats update
- [ ] Feed/Play/Clean buttons work
- [ ] Navigation tabs switch screens
- [ ] Inventory populates
- [ ] Shop displays items

## Quick Fixes

### For BiO-SLoTz
The game.js is complete with embedded layout data. Issue is likely:
1. Canvas not sizing correctly
2. Button hitboxes not positioned
3. Initial credits not set

**Solution:** Add initialization check and default credits

### For BiO-Wheel
The wheel uses React from CDN which may not load in WebView.

**Solution:** Either:
1. Bundle React locally
2. Create vanilla JS version
3. Use simpler wheel implementation

### For BiO-Petz
Game logic exists but UI connections may be broken.

**Solution:**
1. Replace imgur URLs with local assets
2. Ensure navigation works
3. Connect Pet object to UI properly
4. Add console logging for debugging

## Implementation Priority

1. **BiO-SLoTz** (Highest) - Should work, just needs verification
2. **BiO-Petz** (Medium) - Has logic, needs UI fixes
3. **BiO-Wheel** (Complex) - May need rewrite due to React dependency

## Testing Commands

```javascript
// BiO-SLoTz
console.log('Game loaded:', typeof game !== 'undefined');
console.log('Canvas:', document.getElementById('reels'));

// BiO-Wheel  
console.log('React loaded:', typeof React !== 'undefined');
console.log('Root:', document.getElementById('root'));

// BiO-Petz
console.log('Pet object:', typeof Pet !== 'undefined');
console.log('Game object:', typeof game !== 'undefined');
```
