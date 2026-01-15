package com.bio.games;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.os.Build;
import android.util.Log;

import java.io.File;
import java.io.FileInputStream;
import java.security.MessageDigest;
import java.security.cert.Certificate;
import java.security.cert.CertificateFactory;
import java.util.Arrays;

public class IntegrityChecker {
    private static final String TAG = "IntegrityChecker";
    private static final String EXPECTED_SIGNATURE_SHA256 = "YOUR_EXPECTED_SHA256_SIGNATURE"; // Replace with actual
    private static final String EXPECTED_APK_HASH = "YOUR_EXPECTED_APK_SHA256_HASH"; // Replace with actual

    public static boolean checkApkIntegrity(Context context) {
        return checkSignature(context) && checkApkHash(context) && checkInstallSource(context);
    }

    private static boolean checkSignature(Context context) {
        try {
            PackageManager pm = context.getPackageManager();
            PackageInfo packageInfo = pm.getPackageInfo(context.getPackageName(), PackageManager.GET_SIGNATURES);
            Signature[] signatures = packageInfo.signatures;

            if (signatures != null && signatures.length > 0) {
                byte[] cert = signatures[0].toByteArray();
                MessageDigest md = MessageDigest.getInstance("SHA-256");
                byte[] hash = md.digest(cert);
                StringBuilder hexString = new StringBuilder();
                for (byte b : hash) {
                    String hex = Integer.toHexString(0xff & b);
                    if (hex.length() == 1) hexString.append('0');
                    hexString.append(hex);
                }
                String signatureHash = hexString.toString();
                boolean valid = signatureHash.equals(EXPECTED_SIGNATURE_SHA256);
                if (!valid) {
                    Log.w(TAG, "Signature mismatch: " + signatureHash);
                }
                return valid;
            }
        } catch (Exception e) {
            Log.e(TAG, "Error checking signature", e);
        }
        return false;
    }

    private static boolean checkApkHash(Context context) {
        try {
            String apkPath = context.getPackageManager().getApplicationInfo(context.getPackageName(), 0).sourceDir;
            File apkFile = new File(apkPath);
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            FileInputStream fis = new FileInputStream(apkFile);
            byte[] buffer = new byte[8192];
            int bytesRead;
            while ((bytesRead = fis.read(buffer)) != -1) {
                md.update(buffer, 0, bytesRead);
            }
            fis.close();
            byte[] hash = md.digest();
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            String apkHash = hexString.toString();
            boolean valid = apkHash.equals(EXPECTED_APK_HASH);
            if (!valid) {
                Log.w(TAG, "APK hash mismatch: " + apkHash);
            }
            return valid;
        } catch (Exception e) {
            Log.e(TAG, "Error checking APK hash", e);
        }
        return false;
    }

    private static boolean checkInstallSource(Context context) {
        try {
            PackageManager pm = context.getPackageManager();
            String installer = pm.getInstallerPackageName(context.getPackageName());
            // Allow Google Play, Amazon Appstore, etc.
            if (installer == null) {
                Log.w(TAG, "Unknown install source");
                return false;
            }
            boolean valid = "com.android.vending".equals(installer) ||
                           "com.amazon.venezia".equals(installer) ||
                           "com.sec.android.app.samsungapps".equals(installer);
            if (!valid) {
                Log.w(TAG, "Untrusted install source: " + installer);
            }
            return valid;
        } catch (Exception e) {
            Log.e(TAG, "Error checking install source", e);
        }
        return false;
    }
}