plugins {
  id("com.android.application")
  id("org.jetbrains.kotlin.android")
  id("com.margelo.reactnitro")
}

android {
  namespace = "com.margelo.mmkvexample"
  compileSdk = 36
  ndkVersion = "29.0.14206865"
  defaultConfig {
    applicationId = "com.margelo.mmkvexample"
    minSdk = 26
    targetSdk = 36
    versionCode = 1
    versionName = "1.0"
  }
  signingConfigs {
    getByName("debug") {
      storeFile = file("debug.keystore")
      storePassword = "android"
      keyAlias = "androiddebugkey"
      keyPassword = "android"
    }
  }
  buildTypes {
    getByName("debug") {
      signingConfig = signingConfigs.getByName("debug")
    }
    getByName("release") {
      // Caution! In production, you need to generate your own keystore file.
      // See https://developer.android.com/studio/publish/app-signing.
      signingConfig = signingConfigs.getByName("debug")
    }
  }
}

dependencies {
  val runtime = project(":runtime")
  implementation(runtime)
}
