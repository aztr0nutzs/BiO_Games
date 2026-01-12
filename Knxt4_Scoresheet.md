# Knxt4 Scoresheet

## Overview
This scoresheet evaluates the Knxt4 game (Connect 4 with specimens) located at `app/src/main/assets/www/knxt4/knxt4_claude.html`. The game features dropping pieces, winning by connecting four, and unlocking new specimens by winning games in a hybrid Android WebView environment.

## Scoresheet

| Category | Criteria | Score (1-5) | Notes |
|----------|----------|-------------|-------|
| **Gameplay Mechanics** | Piece dropping and board interaction |  | |
| | Win detection (4 in a row) |  | |
| | Specimen unlocking system |  | |
| | Turn-based gameplay |  | |
| | Game reset/restart |  | |
| **Visuals** | Specimen piece graphics quality |  | |
| | Board design and layout |  | |
| | Animations for drops/wins |  | |
| | UI elements (buttons, displays) |  | |
| **Audio** | Sound effects for drops/wins |  | |
| | Background music |  | |
| | Audio balance and quality |  | |
| **User Experience** | Controls intuitiveness |  | |
| | Feedback on wins/unlocks |  | |
| | Loading times |  | |
| | Error handling |  | |
| **Balance** | Difficulty progression |  | |
| | Unlock fairness |  | |
| | Replay value |  | |
| **Performance** | Frame rate stability |  | |
| | Memory usage |  | |
| | Battery impact |  | |

**Scoring Guide:** 1 = Poor, 2 = Below Average, 3 = Average, 4 = Good, 5 = Excellent

## Critical Checklist

### Pre-Deployment Verification
- [ ] All specimen assets (s03.png, s04.png, etc.) are present in `assets/knxt4_chips/`
- [ ] knxt4_claude.html and game.js files are intact and error-free
- [ ] JavaScript console shows no errors on game load
- [ ] Piece dropping works without glitches
- [ ] Win detection triggers correctly
- [ ] Specimen unlocking after wins
- [ ] Game saves/loads state correctly (if applicable)

### Android Integration Checks
- [ ] WebView loads the game without white screen or 404 errors
- [ ] JavaScript is enabled in WebView configuration
- [ ] Hardware acceleration is enabled for smooth animations
- [ ] INTERNET permission is granted in AndroidManifest.xml
- [ ] Game responds correctly to Android lifecycle events (pause/resume)
- [ ] No memory leaks during extended play sessions
- [ ] Compatible with target Android API levels (minimum SDK check)
- [ ] Touch events register accurately on different screen sizes

### Bridge and Native Integration (if applicable)
- [ ] BioGameJS interface is properly injected (if used)
- [ ] Native methods (haptic feedback, sound control) work correctly
- [ ] No bridge method signature mismatches
- [ ] Logcat shows no JavaScript interface errors

### Performance and Compatibility
- [ ] Game runs smoothly on low-end devices
- [ ] No ANRs (App Not Responding) during gameplay
- [ ] WebView version compatibility (Chromium engine)
- [ ] Tested on various Android versions and devices
- [ ] Battery usage is reasonable during play

### Final Deployment Steps
- [ ] Build APK successfully without errors
- [ ] Install and test on physical device
- [ ] Verify all assets are included in APK
- [ ] Check for any missing dependencies or libraries
- [ ] Update version numbers and changelogs
