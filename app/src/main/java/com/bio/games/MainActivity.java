package com.bio.games;

import android.os.Bundle;
import android.util.Log;
import android.webkit.ConsoleMessage;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Debug;
import android.os.Process;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {

    private static final String TAG = "MainActivity";
    WebView webView;
    private boolean securityChecksPassed = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Set up crash handler
        Thread.setDefaultUncaughtExceptionHandler(new CrashHandler());

        // Perform security checks
        if (BuildConfig.ENABLE_SECURITY_CHECKS) {
            performSecurityChecks();
        }

        setTheme(R.style.AppTheme);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webView);

        // WebView performance optimizations
        WebSettings ws = webView.getSettings();
        ws.setJavaScriptEnabled(true);
        ws.setDomStorageEnabled(true);
        ws.setAllowFileAccess(true);
        ws.setAllowFileAccessFromFileURLs(true);
        ws.setAllowContentAccess(true);
        ws.setAllowUniversalAccessFromFileURLs(true);
        ws.setCacheMode(WebSettings.LOAD_DEFAULT);
        ws.setDatabaseEnabled(true);
        ws.setGeolocationEnabled(false); // Disable for security
        ws.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);

        // Memory optimization
        webView.setLayerType(WebView.LAYER_TYPE_HARDWARE, null);

        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                Log.d("WebViewConsole", consoleMessage.message() + " -- From line " + consoleMessage.lineNumber() + " of " + consoleMessage.sourceId());
                return true;
            }
        });

        BioGameBridge bridge = new BioGameBridge(this, webView);
        webView.addJavascriptInterface(bridge, "BioGameJS");

        webView.loadUrl("file:///android_asset/www/splash.html");
    }

    private void performSecurityChecks() {
        try {
            if (SecurityUtils.isRooted()) {
                Log.w(TAG, "Rooted device detected");
                // Disable rewards, flag account
                securityChecksPassed = false;
                Toast.makeText(this, "Security violation detected", Toast.LENGTH_LONG).show();
                finish();
                return;
            }

            if (SecurityUtils.isEmulator(this)) {
                Log.w(TAG, "Emulator detected");
                securityChecksPassed = false;
                Toast.makeText(this, "Emulator not supported", Toast.LENGTH_LONG).show();
                finish();
                return;
            }

            if (!IntegrityChecker.checkApkIntegrity(this)) {
                Log.w(TAG, "APK integrity check failed");
                securityChecksPassed = false;
                Toast.makeText(this, "App integrity compromised", Toast.LENGTH_LONG).show();
                finish();
                return;
            }

            SecurityUtils.killDebugger();

            if (SecurityUtils.isHooked()) {
                Log.w(TAG, "Hooking detected");
                securityChecksPassed = false;
                Toast.makeText(this, "Security violation detected", Toast.LENGTH_LONG).show();
                finish();
                return;
            }

            securityChecksPassed = true;
        } catch (Exception e) {
            Log.e(TAG, "Error during security checks", e);
            securityChecksPassed = false;
            finish();
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (webView != null) {
            webView.onPause();
            webView.pauseTimers();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) {
            webView.onResume();
            webView.resumeTimers();
        }
        // Periodic security check
        if (BuildConfig.ENABLE_SECURITY_CHECKS && !securityChecksPassed) {
            performSecurityChecks();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (webView != null) {
            webView.destroy();
            webView = null;
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public void onLowMemory() {
        super.onLowMemory();
        if (webView != null) {
            webView.freeMemory();
        }
    }

    private static class CrashHandler implements Thread.UncaughtExceptionHandler {
        @Override
        public void uncaughtException(Thread thread, Throwable throwable) {
            Log.e(TAG, "Uncaught exception", throwable);
            // Silent crash log - in production, send to server
            // For now, just log
            android.os.Process.killProcess(android.os.Process.myPid());
            System.exit(1);
        }
    }
}
