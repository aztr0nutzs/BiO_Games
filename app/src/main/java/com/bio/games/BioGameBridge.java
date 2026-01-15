package com.bio.games;

import android.content.Context;
import android.os.Looper;
import android.util.Log;
import android.content.Intent;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.widget.Toast;

public class BioGameBridge {
    private Context context;
    private WebView webView;
    private GameServer gameServer;
    private String playerId;
    private String sessionToken;

    public BioGameBridge(Context context, WebView webView) {
        this.context = context;
        this.webView = webView;
        this.gameServer = new GameServer(context);
        this.playerId = "player_" + System.currentTimeMillis();
        this.sessionToken = gameServer.generateSessionToken(playerId);
    }

    private void assertMainThread() {
        if (Looper.myLooper() != Looper.getMainLooper()) {
            throw new RuntimeException("Bridge not on UI thread");
        }
    }

    @JavascriptInterface
    public void launchGame(String url) {
        Intent intent = new Intent(context, GameActivity.class);
        intent.putExtra("url", url);
        context.startActivity(intent);
    }

    @JavascriptInterface
    public void playSlotz() {
        assertMainThread();
        if (gameServer.validateGameAction(playerId, sessionToken, "playSlotz", 100)) {
            launchGame("file:///android_asset/www/bio_slotz/BiO-Slotz_web_v1.1/index.html");
        } else {
            Toast.makeText(context, "Insufficient credits to play Slotz!", Toast.LENGTH_SHORT).show();
        }
    }

    @JavascriptInterface
    public void playKNXT4() {
        assertMainThread();
        if (gameServer.validateGameAction(playerId, sessionToken, "playKNXT4", 50)) {
            webView.loadUrl("file:///android_asset/www/knxt4_claude.html");
        } else {
            Toast.makeText(context, "Insufficient credits to play KNXT4!", Toast.LENGTH_SHORT).show();
        }
    }

    @JavascriptInterface
    public void playWheel() {
        assertMainThread();
        if (gameServer.validateGameAction(playerId, sessionToken, "playWheel", 200)) {
            launchGame("file:///android_asset/www/bio_wheel/wheel_game.html");
        } else {
            Toast.makeText(context, "Insufficient credits to play Wheel!", Toast.LENGTH_SHORT).show();
        }
    }

    @JavascriptInterface
    public void playBioPetz() {
        assertMainThread();
        if (gameServer.validateGameAction(playerId, sessionToken, "playBioPetz", 0)) {
            launchGame("file:///android_asset/www/bio_petz/index.html");
        } else {
            Toast.makeText(context, "Insufficient credits to play BioPetz!", Toast.LENGTH_SHORT).show();
        }
    }

    @JavascriptInterface
    public void openStore() {
        assertMainThread();
        launchGame("file:///android_asset/www/bio_store.html");
    }

    @JavascriptInterface
    public void testBridge() {
        assertMainThread();
        Toast.makeText(context, "Bridge is working!", Toast.LENGTH_SHORT).show();
    }

    @JavascriptInterface
    public int getCredits() {
        assertMainThread();
        return gameServer.getPlayerCredits(playerId);
    }

    @JavascriptInterface
    public int getToxins() {
        assertMainThread();
        return gameServer.getPlayerToxins(playerId);
    }

    @JavascriptInterface
    public void addCredits(int amount) {
        assertMainThread();
        gameServer.addCredits(playerId, amount);
    }

    @JavascriptInterface
    public void addToxins(int amount) {
        assertMainThread();
        gameServer.addToxins(playerId, amount);
    }

    @JavascriptInterface
    public String getSessionToken() {
        assertMainThread();
        return sessionToken;
    }

    @JavascriptInterface
    public String getPlayerId() {
        assertMainThread();
        return playerId;
    }

    @JavascriptInterface
    public String getDeviceHash() {
        assertMainThread();
        return gameServer.generateDeviceHash();
    }
}
