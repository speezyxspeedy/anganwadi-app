package com.anganwadi.parentconnect

import android.app.Application
import com.anganwadi.parentconnect.util.NotificationHelper

/**
 * Anganwadi Parent Connect Application entry point.
 * Initializes notification channels (via Java NotificationHelper)
 * and sets up offline caching configuration.
 */
class ParentConnectApplication : Application() {

    override fun onCreate() {
        super.onCreate()
        instance = this

        // Initialize Android notification channels using Java NotificationHelper
        NotificationHelper.createNotificationChannels(this)
    }

    companion object {
        lateinit var instance: ParentConnectApplication
            private set
    }
}
