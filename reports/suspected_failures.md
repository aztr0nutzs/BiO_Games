# Suspected Failures Report
## Post-Bio_Assets Migration Analysis

**Pessimistic Assumption**: All changes introduced regressions. Every component is suspect until proven functional.

### 1. Asset Path Failures (HIGH RISK)
- **HTML Script/Link References**: Migrated HTML files (bio_lobby3.html, bio_store.html, game indexes) likely contain hardcoded paths to old asset locations (e.g., `../assets/` instead of relative paths within `www/`). This will cause 404 errors for CSS, JS, and image files.
- **Image Sources**: Pet images, chip assets, and game symbols in bio_petz/, knxt4/, bio_slotz/, bio_wheel/ may reference incorrect paths post-move.
- **CSS Backgrounds**: Lobby background (lobby_bg.gif), store background (store_bg.gif) paths likely broken.
- **JavaScript Imports**: Game logic files importing data (specimens.js, items.js, mutations.js) may fail if paths not updated.

### 2. Bridge Layer Mismatches (CRITICAL RISK)
- **Method Signature Errors**: Newly added bridge methods in BioGameBridge.java (playBioPetz, playSlotz, playWheel, playKNXT4, openStore) may not match exact case/capitalization called from HTML onclick handlers.
- **Missing @JavascriptInterface**: Bridge methods might lack proper annotations, causing silent failures.
- **Namespace Errors**: HTML calling "BioGameJS.method()" but interface not properly injected as "BioGameJS" in MainActivity.
- **Thread Safety**: Bridge calls from JS to Java may cause UI thread blocking or crashes.

### 3. WebView Loading Failures (HIGH RISK)
- **Entry Point Path**: MainActivity loading "file:///android_asset/www/bio_lobby3.html" - confirm exact path exists and is correct.
- **WebView Configuration**: JavaScript enabled, DOM storage enabled, hardware acceleration - any missing will break games.
- **Caching Issues**: Old cached assets from previous loads may persist, showing stale content.

### 4. JavaScript Runtime Errors (MEDIUM RISK)
- **Syntax Errors**: Migrated JS files (game.js, bio_petz_game.js, etc.) may contain syntax issues preventing execution.
- **DOM Ready Events**: Games waiting for document.ready but event handlers broken.
- **Variable Scope**: Global variables or functions undefined due to path/import failures.
- **Canvas Rendering**: Games using HTML5 Canvas may fail if WebView version incompatible.

### 5. Native Layer Crashes (MEDIUM RISK)
- **NullPointerExceptions**: WebView or bridge objects null during lifecycle events.
- **Permission Denials**: INTERNET permission missing, causing network-dependent features to fail.
- **Activity Lifecycle**: No onPause/onResume handling for game audio/loops - may continue playing when app minimized.
- **Memory Leaks**: WebView not properly destroyed on onDestroy, leading to ANRs.

### 6. Game-Specific Integration Failures (HIGH RISK)
- **Bio_Petz**: Mutation system, pet care mechanics may fail if data files (specimens.js, mutations.js) not loaded.
- **KNXT 4**: Connect 4 logic in knxt4_claude.html may have broken piece placement or win detection.
- **Slot Game**: Reel spinning, symbol payout calculations may be incorrect.
- **Wheel Game**: Prize calculation and animation may fail.
- **Store**: Purchase logic, item unlocking may not work.

### 7. Multiplayer Infrastructure (UNKNOWN RISK)
- **Firebase Config**: firebase-config.js is placeholder - real config missing, breaking online features.
- **Room Management**: multiplayer_core.js may have untested connection logic.
- **Matchmaking**: Player matching and ranked systems likely non-functional without backend.

### 8. Build/Deployment Issues (MEDIUM RISK)
- **APK Packaging**: Assets in www/ may not be included if build.gradle not configured properly.
- **ProGuard**: Obfuscation may break JS bridge method names.
- **Version Fragmentation**: Different WebView versions across devices may cause inconsistent behavior.

### 9. UI/UX Regressions (MEDIUM RISK)
- **CSS Z-Index**: Button clicks blocked by overlapping elements.
- **Responsive Design**: Games not adapting to different screen sizes.
- **Touch Events**: Haptic feedback or gesture handling broken.

### 10. Performance Bottlenecks (LOW RISK)
- **Asset Loading**: Large images/chips causing slow load times.
- **Memory Usage**: Multiple games loaded simultaneously causing OOM.
- **Animation Frame Rate**: Canvas games running at inconsistent FPS.

**Overall Assessment**: Migration likely introduced widespread path reference errors. Bridge methods unverified. Multiplayer features completely untested. Expect white screens, unresponsive buttons, and runtime errors across all games.
