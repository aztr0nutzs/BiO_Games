# Bio-Pet Gradle Configuration Guide

## Overview
The bio-Pet Android project is located in `/home/aztr0nutzs/StudioProjects/bio_pet/BIO_PET` and requires proper gradle configuration for Android Studio integration.

## Current Setup Status

### ✓ Configured Files
- `settings.gradle.kts` - Root project configuration
- `build.gradle.kts` - Top-level gradle file with Android plugin versions
- `app/build.gradle.kts` - App module configuration with proper dependencies
- `gradle.properties` - Build properties and JVM options
- `gradle/wrapper/gradle-wrapper.properties` - Gradle wrapper configuration (v8.6)
- `gradlew` - Unix/Linux gradle wrapper script
- `gradlew.bat` - Windows gradle wrapper script

### ✓ Recent Updates
1. Added `kotlin("kapt")` plugin for Room database annotation processing
2. Added `kapt("androidx.room:room-compiler:2.6.1")` dependency

### ⚠ Required Manual Steps

#### Option 1: Using Android Studio (Recommended)
1. **Open the project in Android Studio**
   - File > Open > Navigate to `/home/aztr0nutzs/StudioProjects/bio_pet/BIO_PET`
   - Select the BIO_PET folder and click OK

2. **Sync Gradle**
   - Android Studio will prompt to sync gradle
   - Or manually: File > Sync Now
   - Or keyboard shortcut: Ctrl+Alt+Shift+S (Windows/Linux) or Cmd+Shift+;, Cmd+Shift+; (Mac)

#### Option 2: Command Line Gradle Sync
```bash
cd /home/aztr0nutzs/StudioProjects/bio_pet/BIO_PET

# Ensure java is installed
java -version

# Sync gradle dependencies
./gradlew sync

# Or build the project
./gradlew build

# Or build the APK
./gradlew assemble
```

#### Option 3: Setup Missing gradle-wrapper.jar
If gradle sync fails due to missing `gradle-wrapper.jar`:

```bash
cd /home/aztr0nutzs/StudioProjects/bio_pet/BIO_PET

# Download gradle wrapper jar (method 1: using gradle itself)
gradle wrapper --gradle-version 8.6

# Or method 2: using downloaded zip
wget https://services.gradle.org/distributions/gradle-8.6-bin.zip
unzip gradle-8.6-bin.zip
cp gradle-8.6/lib/gradle-*.jar gradle/wrapper/gradle-wrapper.jar
rm -rf gradle-8.6 gradle-8.6-bin.zip
```

## Project Structure

```
BIO_PET/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── AndroidManifest.xml
│   │       ├── java/com/biopet/
│   │       │   ├── MainActivity.kt
│   │       │   ├── analytics/
│   │       │   ├── core/
│   │       │   ├── mutation/
│   │       │   └── settings/
│   │       └── res/
│   │           ├── mipmap-mdpi/
│   │           └── values/
│   └── build.gradle.kts
├── gradle/
│   └── wrapper/
│       ├── gradle-wrapper.jar (may need to download)
│       └── gradle-wrapper.properties
├── build.gradle.kts
├── gradle.properties
├── settings.gradle.kts
├── gradlew
├── gradlew.bat
└── .gradle/ (auto-generated after first sync)
```

## Build Configuration

### Android Configuration (app/build.gradle.kts)
- **Namespace**: com.biopet
- **Compile SDK**: 34 (Android 14)
- **Min SDK**: 26 (Android 8.0)
- **Target SDK**: 34 (Android 14)
- **Kotlin Version**: 1.9.22
- **Java Version**: 11
- **Compose**: Enabled (1.6.0)

### Key Dependencies
- Android X Libraries
- Jetpack Compose UI
- Room Database (with kapt)
- Navigation Compose
- DataStore Preferences

### Testing Dependencies
- JUnit 4
- Android Test Runner
- Espresso

## Gradle Wrapper Properties

**File**: `gradle/wrapper/gradle-wrapper.properties`
```
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-8.6-bin.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
```

## Common Issues & Solutions

### Issue: "Could not find gradle-wrapper.jar"
**Solution**: Download it manually using the command above or Android Studio will auto-download it on first sync.

### Issue: "JAVA_HOME not set"
**Solution**: 
```bash
# Find java
which java
# Set JAVA_HOME
export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))
# Verify
echo $JAVA_HOME
```

### Issue: "Cannot find Android SDK"
**Solution**: 
```bash
# Set Android SDK path
export ANDROID_HOME=~/.android/sdk
# Or in Android Studio: File > Project Structure > SDK Location
```

### Issue: "Sync appears to work in Android Studio but no gradle sync button"
**Solution**: 
1. The gradle sync completes automatically in Android Studio
2. Check the "Messages" or "Event Log" tab for sync status
3. Rebuild the project: Build > Clean Project > Rebuild Project

## Verification

After syncing gradle, verify the setup:

```bash
cd /home/aztr0nutzs/StudioProjects/bio_pet/BIO_PET

# Should show gradle version without errors
./gradlew --version

# Should list available gradle tasks
./gradlew tasks

# Should build the app
./gradlew build
```

## Next Steps

1. **Open in Android Studio**
   - Open the BIO_PET folder as a project
   - Wait for gradle sync to complete

2. **Configure Emulator/Device**
   - Android Studio > AVD Manager
   - Create or select an Android Virtual Device
   - Or connect a physical device via USB

3. **Run the App**
   - Run > Run 'app'
   - Or press Shift+F10 (Windows/Linux) or Ctrl+R (Mac)

## Additional Resources

- [Gradle Documentation](https://docs.gradle.org/)
- [Android Gradle Plugin Documentation](https://developer.android.com/studio/releases/gradle-plugin)
- [Gradle Wrapper Documentation](https://docs.gradle.org/current/userguide/gradle_wrapper.html)
- [Android Studio Sync Issues](https://developer.android.com/studio/build#sync-issues)

