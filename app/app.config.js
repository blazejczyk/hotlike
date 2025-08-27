import 'dotenv/config';

const appConfig = {
  expo: {
    name: 'HotLike',
    slug: 'hotlike',
    version: '1.0.3',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#fff8fc',
    },
    assetBundlePatterns: [
      '**/*',
    ],
    android: {
      package: 'com.hotlike.hotlike',
      versionCode: 4,
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_KEY,
        },
      },
    },
    ios: {
      supportsTablet: true,
    },
    extra: {
      eas: {
        projectId: '7c2cba61-6aeb-442c-b284-cefcab4a2ab3',
      },
      env: {
        apiUrl: process.env.EXPO_PUBLIC_API_URL,
      },
    },
    owner: 'eryk.blazejczyk',
  },
}

export default appConfig;
