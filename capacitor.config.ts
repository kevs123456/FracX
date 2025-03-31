import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'FracX',
  webDir: 'www',

  server: {
    hostname: '192.168.1.200', // Dirección IP para desarrollo en red local
    androidScheme: 'http'       // Protocolo para Android (usar https en producción)
  }
};

export default config;
