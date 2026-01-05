# BiO-Slotz (Android Studio)

This is a WebView-wrapped Android project that packages the BiO-Slotz cabinet slot game as an APK.

## What you get
- `/app/src/main/assets/www/` contains the full web game (HTML/CSS/JS + images)
- `MainActivity.java` loads `file:///android_asset/www/index.html` in a full-screen WebView

## Important note (wrapper jar)
This zip **does not** include `gradle/wrapper/gradle-wrapper.jar` because it's a binary that isn't available to generate in this environment.

### Easiest way to build an APK
1. Open **Android Studio**
2. **New Project → Empty Views Activity** (Java), name it `BiO-Slotz`
3. Close the new project.
4. Copy THIS zip's `app/` folder over the new project's `app/` folder (overwrite).
5. Re-open the project in Android Studio.
6. Let it sync, then **Build → Build Bundle(s) / APK(s) → Build APK(s)**

If you insist on importing this folder directly, Android Studio may prompt you to regenerate wrapper files. Do that.

## Game rules
See `app/src/main/assets/www/RULES.md`
