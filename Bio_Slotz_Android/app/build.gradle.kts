plugins {
    id("com.android.application")
}

android {
    namespace = "com.bioslotz.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.bioslotz.app"
        minSdk = 24
        targetSdk = 34
        versionCode = 2
        versionName = "1.1"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {
            isMinifyEnabled = false
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    // If you want true immersive full screen on older devices, keep this.
    buildFeatures {
        viewBinding = true
    }
}

dependencies {
    // No extra deps required for WebView.
    implementation("com.google.android.material:material:1.11.0")
}
