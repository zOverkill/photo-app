import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.photoapp',
  appName: 'photo-app',
  webDir: 'dist', // Korrekter Pfad zum Build-Verzeichnis
  server: {
    androidScheme: 'https'
  },
};

export default config;