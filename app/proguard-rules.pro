# Add project-specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Enable obfuscation, optimization, and shrinking for hardening
-obfuscate
-optimizationpasses 5
-allowaccessmodification
-dontpreverify
-repackageclasses ''
-flattenpackagehierarchy ''
-mergeinterfacesaggressively

# String encryption
-encryptstrings

# Control flow flattening
-flattenpackagehierarchy

# Keep WebView JavaScript interface
-keepclassmembers class com.bio.games.BioGameBridge {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep necessary classes for security
-keep class com.bio.games.SecurityUtils { *; }
-keep class com.bio.games.IntegrityChecker { *; }
-keep class com.bio.games.SSLPinner { *; }

# Keep GameServer for functionality
-keep class com.bio.games.GameServer {
    *;
}

# Keep Firebase Crashlytics
-keep class com.google.firebase.crashlytics.** { *; }
-keep class com.google.firebase.** { *; }

# Keep Android support classes
-keep class androidx.** { *; }

# Remove logging in release
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}

# Keep attributes for debugging (optional, remove for full hardening)
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile