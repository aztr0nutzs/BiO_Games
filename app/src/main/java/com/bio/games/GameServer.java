package com.bio.games;

import android.content.Context;
import android.util.Log;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class GameServer {
    private static final String TAG = "GameServer";
    private Context context;
    private Map<String, String> sessionTokens;
    private Map<String, Integer> playerCredits;
    private Map<String, Integer> playerToxins;

    public GameServer(Context context) {
        this.context = context;
        this.sessionTokens = new HashMap<>();
        this.playerCredits = new HashMap<>();
        this.playerToxins = new HashMap<>();
    }

    // Generate a session token for a player
    public String generateSessionToken(String playerId) {
        String sessionToken = UUID.randomUUID().toString();
        sessionTokens.put(playerId, sessionToken);
        playerCredits.put(playerId, 1000); // Initial credits
        playerToxins.put(playerId, 0); // Initial toxins
        return sessionToken;
    }

    // Validate a session token
    public boolean validateSessionToken(String playerId, String sessionToken) {
        String storedToken = sessionTokens.get(playerId);
        return storedToken != null && storedToken.equals(sessionToken);
    }

    // Validate a game action (e.g., spinning the wheel, playing slots)
    public boolean validateGameAction(String playerId, String sessionToken, String action, int amount) {
        if (!validateSessionToken(playerId, sessionToken)) {
            Log.e(TAG, "Invalid session token for player: " + playerId);
            return false;
        }

        // Check if the player has enough credits
        Integer credits = playerCredits.get(playerId);
        if (credits == null || credits < amount) {
            Log.e(TAG, "Insufficient credits for player: " + playerId);
            return false;
        }

        // Deduct the credits
        playerCredits.put(playerId, credits - amount);
        Log.d(TAG, "Game action validated for player: " + playerId + ", action: " + action + ", amount: " + amount);
        return true;
    }

    // Generate a device hash for security
    public String generateDeviceHash() {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest((System.currentTimeMillis() + "").getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            Log.e(TAG, "Error generating device hash: " + e.getMessage());
            return "";
        }
    }

    // Get player credits
    public int getPlayerCredits(String playerId) {
        Integer credits = playerCredits.get(playerId);
        return credits != null ? credits : 0;
    }

    // Get player toxins
    public int getPlayerToxins(String playerId) {
        Integer toxins = playerToxins.get(playerId);
        return toxins != null ? toxins : 0;
    }

    // Add credits to a player
    public void addCredits(String playerId, int amount) {
        Integer credits = playerCredits.get(playerId);
        if (credits != null) {
            playerCredits.put(playerId, credits + amount);
        }
    }

    // Add toxins to a player
    public void addToxins(String playerId, int amount) {
        Integer toxins = playerToxins.get(playerId);
        if (toxins != null) {
            playerToxins.put(playerId, toxins + amount);
        }
    }

    // Log a game action
    public void logGameAction(String playerId, String action, String result) {
        Log.d(TAG, "Game action logged: playerId=" + playerId + ", action=" + action + ", result=" + result);
    }
}