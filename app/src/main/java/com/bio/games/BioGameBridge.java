package com.bio.games;

import android.content.Context;
import android.content.Intent;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.widget.Toast;

public class BioGameBridge {
    private Context context;
    private WebView webView;

    public BioGameBridge(Context context, WebView webView) {
        this.context = context;
        this.webView = webView;
    }

    @JavascriptInterface
    public void launchGame(String url) {
        Intent intent = new Intent(context, GameActivity.class);
        intent.putExtra("url", url);
        context.startActivity(intent);
    }

    @JavascriptInterface
    public void playSlotz() {
        launchGame("file:///android_asset/www/bio_slotz/BiO-Slotz_web_v1.1/index.html");
    }

    @JavascriptInterface
    public void playKNXT4() {
        launchGame("file:///android_asset/www/knxt4/knxt4_claude.html");
    }

    @JavascriptInterface
    public void playWheel() {
        launchGame("file:///android_asset/www/bio_wheel/wheel_game.html");
    }

    @JavascriptInterface
    public void playBioPetz() {
        launchGame("file:///android_asset/www/bio_petz/index.html");
    }

    @JavascriptInterface
    public void openStore() {
        launchGame("file:///android_asset/www/bio_store.html");
    }

    @JavascriptInterface
    public void testBridge() {
        Toast.makeText(context, "Bridge is working!", Toast.LENGTH_SHORT).show();
    }
}
