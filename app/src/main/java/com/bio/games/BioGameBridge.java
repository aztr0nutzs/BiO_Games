package com.bio.games;

import android.webkit.JavascriptInterface;
import android.util.Log;
import android.webkit.WebView;

public class BioGameBridge {

    private WebView webView;

    public BioGameBridge(WebView webView) {
        this.webView = webView;
    }

    @JavascriptInterface
    public void selectChip(String chip) {
        Log.d("BioGameDebug", "selectChip called with: " + chip);
        // Implement chip selection logic here
        // For example, store the selected chip or notify the game
    }

    @JavascriptInterface
    public void playKNXT4() {
        Log.d("BioGameDebug", "playKNXT4 called");
        webView.loadUrl("file:///android_asset/www/knxt4/knxt4_claude.html");
    }

    @JavascriptInterface
    public void openStore() {
        Log.d("BioGameDebug", "openStore called");
        webView.loadUrl("file:///android_asset/www/bio_store.html");
    }

    @JavascriptInterface
    public void playBioPetz() {
        Log.d("BioGameDebug", "playBioPetz called");
        webView.loadUrl("file:///android_asset/www/bio_petz/index.html");
    }

    @JavascriptInterface
    public void playSlotz() {
        Log.d("BioGameDebug", "playSlotz called");
        webView.loadUrl("file:///android_asset/www/bio_slotz/BiO-Slotz_web_v1.1/index.html");
    }

    @JavascriptInterface
    public void playWheel() {
        Log.d("BioGameDebug", "playWheel called");
        webView.loadUrl("file:///android_asset/www/bio_wheel/wheel_game.html");
    }
}
