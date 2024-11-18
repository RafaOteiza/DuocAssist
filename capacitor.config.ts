import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.duocassistv2',
  appName: 'DuocAssist',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_notification',
      iconColor: '#488AFF',
      sound: 'beep.wav',
    },
    SplashScreen: {
      launchShowDuration: 3000,           // Duración del splash en ms
      launchAutoHide: true,               // Ocultar automáticamente después del tiempo definido
      backgroundColor: '#ffffff',         // Fondo blanco
      androidScaleType: 'CENTER_INSIDE',  // Centrar la imagen sin distorsionarla
      showSpinner: false,                 // Sin spinner
      androidSplashResourceName: 'launch_screen', // Recurso de la imagen splash
    },    
  },
};

export default config;
