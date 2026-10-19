# Proguard rules for Anganwadi Parent Connect
-keep class com.anganwadi.parentconnect.model.** { *; }
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}
