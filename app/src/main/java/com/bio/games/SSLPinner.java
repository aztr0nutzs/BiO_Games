package com.bio.games;

import android.content.Context;
import android.util.Log;

import java.io.IOException;
import java.net.URL;
import java.security.KeyStore;
import java.security.cert.Certificate;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.TrustManagerFactory;
import javax.net.ssl.X509TrustManager;

public class SSLPinner {
    private static final String TAG = "SSLPinner";
    private static final String[] EXPECTED_PINS = {
        "sha256/YOUR_PUBLIC_KEY_PIN_1",
        "sha256/YOUR_PUBLIC_KEY_PIN_2"
    };

    public static boolean validateSSLPinning(String urlString) {
        try {
            URL url = new URL(urlString);
            HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
            connection.setSSLSocketFactory(getPinnedSocketFactory());
            connection.connect();

            Certificate[] serverCertificates = connection.getServerCertificates();
            if (serverCertificates != null && serverCertificates.length > 0) {
                X509Certificate serverCert = (X509Certificate) serverCertificates[0];
                String serverPin = "sha256/" + getCertificatePin(serverCert);

                for (String expectedPin : EXPECTED_PINS) {
                    if (expectedPin.equals(serverPin)) {
                        Log.d(TAG, "SSL Pinning successful for " + urlString);
                        return true;
                    }
                }
                Log.w(TAG, "SSL Pin mismatch for " + urlString + ": " + serverPin);
            }
            connection.disconnect();
        } catch (Exception e) {
            Log.e(TAG, "SSL Pinning failed for " + urlString, e);
        }
        return false;
    }

    private static SSLSocketFactory getPinnedSocketFactory() throws Exception {
        SSLContext sslContext = SSLContext.getInstance("TLS");
        sslContext.init(null, new TrustManager[]{new PinningTrustManager()}, null);
        return sslContext.getSocketFactory();
    }

    private static String getCertificatePin(X509Certificate certificate) throws Exception {
        byte[] publicKey = certificate.getPublicKey().getEncoded();
        java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
        byte[] hash = md.digest(publicKey);
        return android.util.Base64.encodeToString(hash, android.util.Base64.NO_WRAP);
    }

    private static class PinningTrustManager implements X509TrustManager {
        private X509TrustManager defaultTrustManager;

        public PinningTrustManager() throws Exception {
            TrustManagerFactory tmf = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
            tmf.init((KeyStore) null);
            TrustManager[] trustManagers = tmf.getTrustManagers();
            this.defaultTrustManager = (X509TrustManager) trustManagers[0];
        }

        @Override
        public void checkClientTrusted(X509Certificate[] chain, String authType) throws java.security.cert.CertificateException {
            defaultTrustManager.checkClientTrusted(chain, authType);
        }

        @Override
        public void checkServerTrusted(X509Certificate[] chain, String authType) throws java.security.cert.CertificateException {
            defaultTrustManager.checkServerTrusted(chain, authType);

            if (chain.length > 0) {
                try {
                    String serverPin = "sha256/" + getCertificatePin(chain[0]);
                    for (String expectedPin : EXPECTED_PINS) {
                        if (expectedPin.equals(serverPin)) {
                            return;
                        }
                    }
                    throw new java.security.cert.CertificateException("Certificate pinning failure");
                } catch (Exception e) {
                    throw new java.security.cert.CertificateException("Certificate pinning failure", e);
                }
            }
        }

        @Override
        public X509Certificate[] getAcceptedIssuers() {
            return defaultTrustManager.getAcceptedIssuers();
        }
    }
}