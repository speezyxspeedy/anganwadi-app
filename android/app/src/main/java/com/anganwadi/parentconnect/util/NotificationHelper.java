package com.anganwadi.parentconnect.util;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import com.anganwadi.parentconnect.MainActivity;

/**
 * Java helper for managing Android notification channels and alert dispatches.
 * Handles immunization alerts, ration distribution reminders, and severe malnutrition alerts.
 */
public class NotificationHelper {

    public static final String CHANNEL_IMMUNIZATION = "anganwadi_immunization_channel";
    public static final String CHANNEL_RATION = "anganwadi_ration_channel";
    public static final String CHANNEL_GROWTH_ALERTS = "anganwadi_growth_channel";

    /**
     * Creates notification channels for Android 8.0 (API level 26) and above.
     */
    public static void createNotificationChannels(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager manager = context.getSystemService(NotificationManager.class);
            if (manager == null) return;

            NotificationChannel immunChannel = new NotificationChannel(
                    CHANNEL_IMMUNIZATION,
                    "Immunization Due Alerts (टीकाकरण सूचना)",
                    NotificationManager.IMPORTANCE_HIGH
            );
            immunChannel.setDescription("Reminders for upcoming vaccines (DPT, Measles, Polio)");

            NotificationChannel rationChannel = new NotificationChannel(
                    CHANNEL_RATION,
                    "Ration & Poshan Distribution (पोषण आहार वितरण)",
                    NotificationManager.IMPORTANCE_DEFAULT
            );
            rationChannel.setDescription("Take-home ration (THR) and egg/milk distribution days");

            NotificationChannel growthChannel = new NotificationChannel(
                    CHANNEL_GROWTH_ALERTS,
                    "Child Growth Alerts (वाढ व पोषण तपासणी)",
                    NotificationManager.IMPORTANCE_HIGH
            );
            growthChannel.setDescription("Follow-up notifications for MAM/SAM growth monitoring");

            manager.createNotificationChannel(immunChannel);
            manager.createNotificationChannel(rationChannel);
            manager.createNotificationChannel(growthChannel);
        }
    }

    /**
     * Triggers a local notification for an upcoming vaccination milestone.
     */
    public static void showVaccinationReminder(Context context, String childName, String vaccineName, String dueDate) {
        Intent intent = new Intent(context, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(
                context, 0, intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_IMMUNIZATION)
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentTitle("Vaccination Due: " + childName)
                .setContentText(vaccineName + " is scheduled on " + dueDate + " at AWC-042.")
                .setStyle(new NotificationCompat.BigTextStyle()
                        .bigText(childName + " is due for " + vaccineName + " on " + dueDate + 
                                ". Please visit Shivaji Nagar Anganwadi Centre between 10:00 AM and 1:00 PM."))
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setContentIntent(pendingIntent)
                .setAutoCancel(true);

        NotificationManager manager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (manager != null) {
            manager.notify((int) System.currentTimeMillis(), builder.build());
        }
    }

    /**
     * Triggers a notification when a child's nutrition status requires follow-up.
     */
    public static void showNutritionAlert(Context context, String childName, String status) {
        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_GROWTH_ALERTS)
                .setSmallIcon(android.R.drawable.ic_dialog_alert)
                .setContentTitle("Poshan Alert: " + childName)
                .setContentText("Nutrition status marked as " + status + ". Special diet and energy paste recommended.")
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setAutoCancel(true);

        NotificationManager manager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (manager != null) {
            manager.notify((int) System.currentTimeMillis() + 1, builder.build());
        }
    }
}
