package com.bio.games;

import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Debug;
import android.os.Process;
import android.util.Log;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;

public class SecurityUtils {
    private static final String TAG = "SecurityUtils";
    private static final List<String> ROOT_INDICATORS = Arrays.asList(
        "/system/bin/su", "/system/xbin/su", "/sbin/su", "/system/su",
        "/system/bin/.ext/.su", "/system/usr/we-need-root/su-backup",
        "/system/xbin/mu"
    );
    private static final List<String> MAGISK_INDICATORS = Arrays.asList(
        "/sbin/.magisk", "/data/adb/magisk", "/data/adb/modules"
    );
    private static final List<String> XPOSED_INDICATORS = Arrays.asList(
        "de.robv.android.xposed", "com.saurik.substrate"
    );
    private static final List<String> EMULATOR_INDICATORS = Arrays.asList(
        "goldfish", "ranchu", "sdk", "emulator", "generic", "vbox86p"
    );
    private static final List<String> GENYMOTION_PACKAGES = Arrays.asList(
        "com.genymotion.superuser", "com.genymobile.genymotion.lib"
    );
    private static final List<String> BLUESTACKS_PACKAGES = Arrays.asList(
        "com.bluestacks", "com.bluestacks.appmart"
    );

    public static boolean isRooted() {
        return checkRootFiles() || checkRootPackages() || checkMagisk() || checkXposed();
    }

    public static boolean isEmulator(Context context) {
        return checkEmulatorBuild() || checkEmulatorPackages(context) || checkEmulatorFiles();
    }

    public static boolean isDebuggerAttached() {
        return Debug.isDebuggerConnected() || checkJdwp() || checkGdb();
    }

    public static boolean isHooked() {
        return checkFrida() || checkSubstrate() || checkPtrace();
    }

    public static void killDebugger() {
        if (isDebuggerAttached()) {
            Log.w(TAG, "Debugger detected, terminating process");
            Process.killProcess(Process.myPid());
            System.exit(1);
        }
    }

    private static boolean checkRootFiles() {
        for (String path : ROOT_INDICATORS) {
            if (new File(path).exists()) {
                Log.w(TAG, "Root indicator found: " + path);
                return true;
            }
        }
        return false;
    }

    private static boolean checkRootPackages() {
        try {
            java.lang.Process process = Runtime.getRuntime().exec("which su");
            return process.waitFor() == 0;
        } catch (Exception e) {
            return false;
        }
    }

    private static boolean checkMagisk() {
        for (String path : MAGISK_INDICATORS) {
            if (new File(path).exists()) {
                Log.w(TAG, "Magisk indicator found: " + path);
                return true;
            }
        }
        return false;
    }

    private static boolean checkXposed() {
        for (String pkg : XPOSED_INDICATORS) {
            try {
                Class.forName(pkg + ".XposedBridge");
                Log.w(TAG, "Xposed detected: " + pkg);
                return true;
            } catch (ClassNotFoundException e) {
                // Not found
            }
        }
        return false;
    }

    private static boolean checkEmulatorBuild() {
        String manufacturer = Build.MANUFACTURER.toLowerCase();
        String model = Build.MODEL.toLowerCase();
        String product = Build.PRODUCT.toLowerCase();
        String brand = Build.BRAND.toLowerCase();

        for (String indicator : EMULATOR_INDICATORS) {
            if (manufacturer.contains(indicator) || model.contains(indicator) ||
                product.contains(indicator) || brand.contains(indicator)) {
                Log.w(TAG, "Emulator indicator in build: " + indicator);
                return true;
            }
        }
        return false;
    }

    private static boolean checkEmulatorPackages(Context context) {
        PackageManager pm = context.getPackageManager();
        for (String pkg : GENYMOTION_PACKAGES) {
            try {
                pm.getPackageInfo(pkg, 0);
                Log.w(TAG, "Genymotion package found: " + pkg);
                return true;
            } catch (PackageManager.NameNotFoundException e) {
                // Not found
            }
        }
        for (String pkg : BLUESTACKS_PACKAGES) {
            try {
                pm.getPackageInfo(pkg, 0);
                Log.w(TAG, "BlueStacks package found: " + pkg);
                return true;
            } catch (PackageManager.NameNotFoundException e) {
                // Not found
            }
        }
        return false;
    }

    private static boolean checkEmulatorFiles() {
        return new File("/system/lib/libbluestacks.so").exists() ||
               new File("/system/lib/libgenymotion.so").exists();
    }

    private static boolean checkJdwp() {
        try {
            BufferedReader reader = new BufferedReader(new FileReader("/proc/" + Process.myPid() + "/status"));
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.startsWith("TracerPid:") && !line.contains("0")) {
                    Log.w(TAG, "JDWP tracer detected");
                    return true;
                }
            }
            reader.close();
        } catch (IOException e) {
            // Ignore
        }
        return false;
    }

    private static boolean checkGdb() {
        try {
            java.lang.Process process = Runtime.getRuntime().exec("ps");
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.contains("gdb") || line.contains("lldb")) {
                    Log.w(TAG, "GDB/LLDB detected");
                    return true;
                }
            }
            reader.close();
        } catch (Exception e) {
            // Ignore
        }
        return false;
    }

    private static boolean checkFrida() {
        try {
            Class.forName("frida.java.Bridge");
            Log.w(TAG, "Frida detected");
            return true;
        } catch (ClassNotFoundException e) {
            return false;
        }
    }

    private static boolean checkSubstrate() {
        try {
            Class.forName("com.saurik.substrate.MS");
            Log.w(TAG, "Substrate detected");
            return true;
        } catch (ClassNotFoundException e) {
            return false;
        }
    }

    private static boolean checkPtrace() {
        try {
            Method ptrace = Class.forName("android.os.Process").getMethod("ptrace", int.class, int.class);
            Log.w(TAG, "Ptrace method available");
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}