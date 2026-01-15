package com.bio.games;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.content.Intent;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.widget.Toast;
import java.security.MessageDigest;
import java.nio.charset.StandardCharsets;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

public class BioGameBridge {
    private static final String ENCRYPTION_KEY = "aSecretKey123456";
    private static final String ENCRYPTION_ALGORITHM = "AES";
    private Context context;
    private WebView webView;
    private GameServer gameServer;
    private String playerId;
    private String sessionToken;
    private Handler mainHandler;

    public BioGameBridge(Context context, WebView webView) {
        this.context = context;
        this.webView = webView;
        this.gameServer = new GameServer(context);
        this.playerId = encryptString("player_" + System.currentTimeMillis());
        this.sessionToken = encryptString(gameServer.generateSessionToken(playerId));
        this.mainHandler = new Handler(Looper.getMainLooper());
    }

    private String encryptString(String input) {
        try {
            SecretKeySpec keySpec = new SecretKeySpec(ENCRYPTION_KEY.getBytes(StandardCharsets.UTF_8), ENCRYPTION_ALGORITHM);
            Cipher cipher = Cipher.getInstance(ENCRYPTION_ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, keySpec);
            byte[] encryptedBytes = cipher.doFinal(input.getBytes(StandardCharsets.UTF_8));
            return Base64.encodeToString(encryptedBytes, Base64.DEFAULT);
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
            byte[] decodedBytes = Base64.decode(input, Base64.DEFAULT);
            byte[] decryptedBytes = cipher.doFinal(decodedBytes);
            return new String(decryptedBytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            Log.e("BioGameBridge", "Decryption failed", e);
            return input;
        }
    }

    @JavascriptInterface
    public void launchGame(String url) {
        Log.d("BioGameBridge", "launchGame called with url: " + url);
        mainHandler.post(() -> {
            Intent intent = new Intent(context, GameActivity.class);
            intent.putExtra("url", url);
            context.startActivity(intent);
        });
    }

    @JavascriptInterface
    public void playSlotz() {
        Log.d("BioGameBridge", "playSlotz called");
        mainHandler.post(() -> {
            if (SecurityUtils.isRooted() || SecurityUtils.isEmulator(context) || SecurityUtils.isHooked()) {
                Log.w("BioGameBridge", "playSlotz: Security violation detected");
                Toast.makeText(context, encryptString("Security violation detected"), Toast.LENGTH_SHORT).show();
                return;
            }
            if (gameServer.validateGameActionWithFlattening(decryptString(playerId), decryptString(sessionToken), encryptString("playSlotz"), 100)) {
                Log.d("BioGameBridge", "playSlotz: Validation successful, launching game");
                launchGame(encryptString("file:///android_asset/www/bio_slotz/BiO-Slotz_web_v1.1/index.html"));
            } else {
                Log.w("BioGameBridge", "playSlotz: Insufficient credits");
                Toast.makeText(context, encryptString("Insufficient credits to play Slotz!"), Toast.LENGTH_SHORT).show();
            }
        });
    }

    @JavascriptInterface
    public void playKNXT4() {
        Log.d("BioGameBridge", "playKNXT4 called");
        mainHandler.post(() -> {
            if (gameServer.validateGameAction(playerId, sessionToken, "playKNXT4", 50)) {
                Log.d("BioGameBridge", "playKNXT4: Validation successful, loading game");
                launchGame("file:///android_asset/www/knxt4/knxt4_claude.html");
            } else {
                Log.w("BioGameBridge", "playKNXT4: Insufficient credits");
                Toast.makeText(context, "Insufficient credits to play KNXT4!", Toast.LENGTH_SHORT).show();
            }
        });
    }

    @JavascriptInterface
    public void playWheel() {
        Log.d("BioGameBridge", "playWheel called");
        mainHandler.post(() -> {
            if (gameServer.validateGameAction(playerId, sessionToken, "playWheel", 200)) {
                Log.d("BioGameBridge", "playWheel: Validation successful, launching game");
                launchGame("file:///android_asset/www/bio_wheel/wheel_index.html");
            } else {
                Log.w("BioGameBridge", "playWheel: Insufficient credits");
                Toast.makeText(context, "Insufficient credits to play Wheel!", Toast.LENGTH_SHORT).show();
            }
        });
    }

    @JavascriptInterface
    public void playBioPetz() {
        Log.d("BioGameBridge", "playBioPetz called");
        mainHandler.post(() -> {
            if (gameServer.validateGameAction(playerId, sessionToken, "playBioPetz", 0)) {
                Log.d("BioGameBridge", "playBioPetz: Validation successful, launching game");
                launchGame("file:///android_asset/www/bio_petz/index.html");
            } else {
                Log.w("BioGameBridge", "playBioPetz: Insufficient credits");
                Toast.makeText(context, "Insufficient credits to play BioPetz!", Toast.LENGTH_SHORT).show();
            }
        });
    }

    @JavascriptInterface
    public void openStore() {
        Log.d("BioGameBridge", "openStore called");
        mainHandler.post(() -> {
            launchGame("file:///android_asset/www/bio_store.html");
        });
    }

    @JavascriptInterface
    public void testBridge() {
        Log.d("BioGameBridge", "testBridge called");
        mainHandler.post(() -> {
            Toast.makeText(context, "Bridge is working!", Toast.LENGTH_SHORT).show();
        });
    }

    @JavascriptInterface
    public int getCredits() {
        Log.d("BioGameBridge", "getCredits called");
        int credits = gameServer.getPlayerCredits(playerId);
        Log.d("BioGameBridge", "getCredits: returning " + credits);
        return credits;
    }

    @JavascriptInterface
    public int getToxins() {
        Log.d("BioGameBridge", "getToxins called");
        int toxins = gameServer.getPlayerToxins(playerId);
        Log.d("BioGameBridge", "getToxins: returning " + toxins);
        return toxins;
    }

    @JavascriptInterface
    public void addCredits(int amount) {
        Log.d("BioGameBridge", "addCredits called with amount: " + amount);
        gameServer.addCredits(playerId, amount);
    }

    @JavascriptInterface
    public void addToxins(int amount) {
        Log.d("BioGameBridge", "addToxins called with amount: " + amount);
        gameServer.addToxins(playerId, amount);
    }

    @JavascriptInterface
    public String getSessionToken() {
        Log.d("BioGameBridge", "getSessionToken called");
        return decryptString(sessionToken);
    }

    @JavascriptInterface
    public String getPlayerId() {
        Log.d("BioGameBridge", "getPlayerId called");
        return decryptString(playerId);
    }

    @JavascriptInterface
    public String getDeviceHash() {
        Log.d("BioGameBridge", "getDeviceHash called");
        return gameServer.generateDeviceHash();
    }

    @JavascriptInterface
    public void goBackToLobby() {
        Log.d("BioGameBridge", "goBackToLobby called");
        mainHandler.post(() -> {
            webView.loadUrl("file:///android_asset/www/bio_lobby3.html");
        });
    }

    @JavascriptInterface
    public void openChipsMenu() {
        Log.d("BioGameBridge", "openChipsMenu called");
        mainHandler.post(() -> {
            launchGame("file:///android_asset/www/chips_menu.html");
        });
    }
}