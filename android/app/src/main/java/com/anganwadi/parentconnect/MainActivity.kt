package com.anganwadi.parentconnect

import android.annotation.SuppressLint
import android.graphics.Bitmap
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.webkit.*
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.anganwadi.parentconnect.databinding.ActivityMainBinding
import com.anganwadi.parentconnect.model.ChildRecord
import com.anganwadi.parentconnect.util.DataExportHelper
import com.anganwadi.parentconnect.util.GrowthAssessmentCalculator
import com.anganwadi.parentconnect.util.NotificationHelper
import com.anganwadi.parentconnect.util.NetworkStatusReceiver
import java.io.File

/**
 * Main Activity for Anganwadi Parent Connect Android App.
 *
 * Implements:
 * - Hybrid WebView with hardware acceleration and offline web cache.
 * - Integration with Java NotificationHelper for immunization and ration alerts.
 * - Integration with Java GrowthAssessmentCalculator for nutritional grading.
 * - Integration with Java DataExportHelper for exporting centre records.
 * - Connectivity monitoring via Java NetworkStatusReceiver.
 */
class MainActivity : AppCompatActivity(), NetworkStatusReceiver.NetworkChangeListener {

    private lateinit var binding: ActivityMainBinding
    private val localDevUrl = "http://10.0.2.2:3000"
    private val sampleChildrenList = mutableListOf(
        ChildRecord("AW-042-01", "Aarav Sachin Gaikwad", "2023-08-14", "Sachin Gaikwad", "9890123456", "ACT-7842-AG", 12.8, 91.0, "Normal", true),
        ChildRecord("AW-042-02", "Ananya Rahul Meshram", "2024-02-05", "Snehal Meshram", "9765432109", "ACT-9912-AM", 8.5, 74.0, "MAM", true),
        ChildRecord("AW-042-03", "Vihaan Pramod Shinde", "2022-11-20", "Pramod Shinde", "9422187654", "ACT-3301-VS", 14.1, 98.0, "Normal", false)
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(binding.topAppBar)
        setupWebView()
        setupListeners()

        NetworkStatusReceiver.setNetworkChangeListener(this)
        updateNetworkUI(NetworkStatusReceiver.isNetworkAvailable(this))
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        val webSettings = binding.webView.settings
        webSettings.javaScriptEnabled = true
        webSettings.domStorageEnabled = true
        webSettings.databaseEnabled = true
        webSettings.cacheMode = WebSettings.LOAD_DEFAULT
        webSettings.allowFileAccess = true
        webSettings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW

        binding.webView.webViewClient = object : WebViewClient() {
            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                binding.progressBar.visibility = View.VISIBLE
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                binding.progressBar.visibility = View.GONE
                binding.swipeRefresh.isRefreshing = false
            }

            override fun onReceivedError(view: WebView?, request: WebResourceRequest?, error: WebResourceError?) {
                // If offline or cannot connect to dev server, provide native feedback
                if (request?.isForMainFrame == true) {
                    binding.progressBar.visibility = View.GONE
                    binding.swipeRefresh.isRefreshing = false
                    Toast.makeText(this@MainActivity, "Operating in Offline Cached Mode", Toast.LENGTH_SHORT).show()
                }
            }
        }

        binding.webView.webChromeClient = WebChromeClient()
        binding.webView.loadUrl(localDevUrl)
    }

    private fun setupListeners() {
        binding.swipeRefresh.setOnRefreshListener {
            binding.webView.reload()
        }

        binding.fabAddChild.setOnClickListener {
            showAddChildDialog()
        }
    }

    private fun showAddChildDialog() {
        val builder = AlertDialog.Builder(this)
        builder.setTitle("Enroll New Child (नवीन नोंदणी)")
        builder.setMessage("Anganwadi Worker can add records directly. Testing Java growth assessor...")
        builder.setPositiveButton("Test Status Calculation") { _, _ ->
            // Demonstrate calling Java GrowthAssessmentCalculator
            val category = GrowthAssessmentCalculator.assessNutritionStatus(18, 9.1, true)
            val advice = GrowthAssessmentCalculator.getNutritionalAdvice(category)

            AlertDialog.Builder(this)
                .setTitle("Growth Result: " + category.label)
                .setMessage(advice)
                .setPositiveButton("OK", null)
                .show()

            // Trigger Java Notification test
            NotificationHelper.showNutritionAlert(this, "New Enrolled Child", category.label)
        }
        builder.setNegativeButton("Cancel", null)
        builder.show()
    }

    override fun onCreateOptionsMenu(menu: Menu?): Boolean {
        menuInflater.inflate(R.menu.top_app_bar_menu, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.action_sync -> {
                binding.webView.reload()
                Toast.makeText(this, "Syncing records with server...", Toast.LENGTH_SHORT).show()
                NotificationHelper.showVaccinationReminder(this, "Aarav Gaikwad", "DPT Booster", "22 Oct 2026")
                true
            }
            R.id.action_export -> {
                exportDataToCsv()
                true
            }
            R.id.action_toggle_role -> {
                binding.webView.evaluateJavascript("window.location.reload();", null)
                Toast.makeText(this, "Reset session", Toast.LENGTH_SHORT).show()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    private fun exportDataToCsv() {
        try {
            val exportFile = File(getExternalFilesDir(null), "anganwadi_records.csv")
            val success = DataExportHelper.writeCsvToFile(exportFile, sampleChildrenList)
            if (success) {
                Toast.makeText(this, "Exported successfully: ${exportFile.name}", Toast.LENGTH_LONG).show()
            } else {
                Toast.makeText(this, "Failed to export CSV", Toast.LENGTH_SHORT).show()
            }
        } catch (e: Exception) {
            Toast.makeText(this, "Export error: ${e.message}", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onNetworkChanged(isConnected: Boolean) {
        runOnUiThread {
            updateNetworkUI(isConnected)
        }
    }

    private fun updateNetworkUI(isConnected: Boolean) {
        if (isConnected) {
            binding.offlineBanner.setBackgroundColor(0xFF065F46.toInt())
            binding.tvSyncStatus.text = "Connected · Ministry Server Online"
        } else {
            binding.offlineBanner.setBackgroundColor(0xFF92400E.toInt())
            binding.tvSyncStatus.text = "Offline Mode · Changes saved to device storage"
        }
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (binding.webView.canGoBack()) {
            binding.webView.goBack()
        } else {
            @Suppress("DEPRECATION")
            super.onBackPressed()
        }
    }
}
