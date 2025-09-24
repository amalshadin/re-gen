import 'dotenv/config';

export default {
  expo: {
    name: "ReGen",
    slug: "ReGen",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon-android.png",
    splash: {
      image: "./assets/icon-android.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icon-android.png",
        backgroundColor: "#ffffff"
      },
      package: "com.amalshadin.regen"
    },
    web: {
      favicon: "./assets/icon-android.png"
    },
    // 👇 This plugins array is required for the image picker to work 👇
    plugins: [
      [
        "expo-image-picker",
        {
          "photosPermission": "The app needs to access your photos so you can select one for analysis."
        }
      ]
    ],
    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      geminiApiKey: process.env.GEMINI_API_KEY,
      eas: {
        "projectId": "41621d82-d074-4b54-bd00-dc71448e98c7"
      }
    }
  }
};