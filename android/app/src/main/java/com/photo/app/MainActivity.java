package com.example.photoapp;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import java.util.ArrayList;
import android.webkit.WebView;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Register any plugins here
        // Example:
        // Plugin myPlugin = new MyPlugin();
        // this.getPluginRegistry().addPlugin(myPlugin);

        WebView.setWebContentsDebuggingEnabled(true); // Aktiviert das Debugging im Chrome DevTools
    }
}