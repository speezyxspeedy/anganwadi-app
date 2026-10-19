# 📱 Anganwadi Parent Connect — Android Project (Kotlin & Java)

This directory contains the native Android project for **Anganwadi Parent Connect**, configured with both **Kotlin** and **Java** interoperability.

---

## 🛠️ Technology Stack & Architecture

- **Language Support**: 
  - **Kotlin (v2.0.0)**: Used for modern Android architecture, ViewModels, Coroutines, Network API, and `MainActivity.kt`.
  - **Java (JDK 17 / 21)**: Used for specialized utility services, WHO Z-score malnutrition assessment algorithms, notification helpers, and data export.
- **Android Target**: SDK 34 (Android 14) with backward compatibility down to Android 7.0 (API 24).
- **Gradle**: Gradle 8.7 with Kotlin DSL (`build.gradle.kts`, `settings.gradle.kts`).
- **UI Framework**: Material Design 3 (`Theme.Material3.Light.NoActionBar`), CoordinatorLayout, Extended FAB, SwipeRefreshLayout.
- **Offline & Hybrid Sync**: Android WebKit hardware-accelerated WebView paired with native SQLite/SharedPreferences cache and background sync.

---

## 📂 Project Structure

```
android/
├── build.gradle.kts                        # Root Gradle build script
├── settings.gradle.kts                     # Project configuration
├── gradle.properties                       # AndroidX & JVM optimization
├── gradle/wrapper/                         # Gradle 8.7 wrapper
└── app/
    ├── build.gradle.kts                    # App module dependencies (Kotlin + Java)
    └── src/main/
        ├── AndroidManifest.xml             # Permissions, Application & Activities
        ├── java/com/anganwadi/parentconnect/
        │   ├── ParentConnectApplication.kt  # [Kotlin] Application class & init
        │   ├── MainActivity.kt              # [Kotlin] Main activity, WebView bridge & menus
        │   ├── model/
        │   │   └── ChildRecord.kt           # [Kotlin] Data models (Gson serialized)
        │   ├── network/
        │   │   └── AnganwadiApiService.kt   # [Kotlin] Retrofit 2 REST API client
        │   └── util/
        │       ├── NotificationHelper.java  # [Java] Notification channels & alert dispatcher
        │       ├── GrowthAssessmentCalculator.java # [Java] WHO MAM/SAM Z-score calculation
        │       ├── DataExportHelper.java    # [Java] CSV record generator & file exporter
        │       └── NetworkStatusReceiver.java # [Java] Real-time online/offline detector
        └── res/
            ├── layout/activity_main.xml     # Material 3 responsive layout
            ├── menu/top_app_bar_menu.xml    # Sync, Export CSV, and Switch Role actions
            ├── values/strings.xml           # Trilingual (English, Hindi, Marathi) strings
            ├── values/colors.xml            # Poshan Abhiyaan saffron/emerald palette
            ├── values/themes.xml            # Modern Android Material3 theme
            └── xml/network_security_config.xml # Local development & emulator network security
```

---

## 🚀 How to Open and Run in Android Studio

1. Open **Android Studio** (installed at `C:\Program Files\Android\Android Studio`).
2. Click **Open** and select the `android` folder:
   ```
   c:\Users\speedy\Downloads\anganwadi-parent-connect-development\android
   ```
3. Android Studio will automatically recognize Gradle and sync the Kotlin and Java source sets.
4. To test against the Next.js local server:
   - Run `npm run dev` in the root web project (starts at `http://localhost:3000`).
   - Start an Android Emulator or connect an Android device via USB debugging.
   - Click **Run 'app'** (`Shift + F10`) in Android Studio.
5. The Android app connects to `http://10.0.2.2:3000` (the Android Emulator alias for localhost), delivering full live sync, offline caching, native notifications, and CSV export.
