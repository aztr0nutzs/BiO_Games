package com.bio.games;

import android.content.Context;
import android.os.Looper;
import android.util.Log;
import android.content.Intent;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.widget.Toast;
import java.security.MessageDigest;
import java.nio.charset.StandardCharsets;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class BioGameBridge {
    private static final String ENCRYPTION_KEY = "BioGamesSecureKey12345";
    private static final String ENCRYPTION_ALGORITHM = "AES";
    private Context context;
    private WebView webView;
    private GameServer gameServer;
    private String playerId;
    private String sessionToken;

    public BioGameBridge(Context context, WebView webView) {
        this.context = context;
        this.webView = webView;
        this.gameServer = new GameServer(context);
        this.playerId = encryptString("player_" + System.currentTimeMillis());
        this.sessionToken = encryptString(gameServer.generateSessionToken(playerId));
    }

    private String encryptString(String input) {
        try {
            SecretKeySpec keySpec = new SecretKeySpec(ENCRYPTION_KEY.getBytes(StandardCharsets.UTF_8), ENCRYPTION_ALGORITHM);
            Cipher cipher = Cipher.getInstance(ENCRYPTION_ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, keySpec);
            byte[] encryptedBytes = cipher.doFinal(input.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encryptedBytes);
        } catch (Exception e) {
            Log.e("BioGameBridge", "Encryption failed", e);
            return input;
        }
    }

    private String decryptString(String input) {
        try {
            SecretKeySpec keySpec = new SecretKeySpec(ENCRYPTION_KEY.getBytes(StandardCharsets.UTF_8), ENCRYPTION_ALGORITHM);
            Cipher cipher = Cipher.getInstance(ENCRYPTION_ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, keySpec);
            byte[] decodedBytes = Base64.getDecoder().decode(input);
            byte[] decryptedBytes = cipher.doFinal(decodedBytes);
            return new String(decryptedBytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            Log.e("BioGameBridge", "Decryption failed", e);
            return input;
        }
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
        // Control flow flattening for obfuscation
        boolean canPlay = false;
        int step = 0;
        while (true) {
            switch (step) {
                case 0:
                    assertMainThread();
                    step = 1;
                    break;
                case 1:
                    if (SecurityUtils.isRooted() || SecurityUtils.isEmulator(context) || SecurityUtils.isHooked()) {
                        Toast.makeText(context, encryptString("Security violation detected"), Toast.LENGTH_SHORT).show();
                        step = 4;
                        break;
                    }
                    step = 2;
                    break;
                case 2:
                    canPlay = gameServer.validateGameActionWithFlattening(decryptString(playerId), decryptString(sessionToken), encryptString("playSlotz"), 100);
                    step = 3;
                    break;
                case 3:
                    if (canPlay) {
                        launchGame(encryptString("file:///android_asset/www/bio_slotz/BiO-Slotz_web_v1.1/index.html"));
                    } else {
                        Toast.makeText(context, encryptString("Insufficient credits to play Slotz!"), Toast.LENGTH_SHORT).show();
                    }
                    step = 4;
                    break;
                case 4:
                    return;
            }
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
        return decryptString(sessionToken);
    }

    @JavascriptInterface
    public String getPlayerId() {
        assertMainThread();
        return decryptString(playerId);
    }

    @JavascriptInterface
    public String getDeviceHash() {
        assertMainThread();
        return gameServer.generateDeviceHash();
    }
}
