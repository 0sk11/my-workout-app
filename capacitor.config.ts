import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kinetic.workoutapp',
  appName: 'Kinetic',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
