import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.duocassistv2',
  appName: 'DuocAssistV2',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_notification', // Icono pequeño
      iconColor: '#488AFF',         // Color del icono
      sound: 'beep.wav',            // Sonido opcional
    },
  },
};

export default config;
