import { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "react-navigation-expo-blog",
  slug: "react-navigation-expo-blog",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "reactnavigationexpoblog",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  extra: {
    eas: {
      projectId: "186f41e1-595a-497e-8ce6-f0481420e9f6",
    },
  },
  ios: {
    supportsTablet: true,
    userInterfaceStyle: "automatic",
    config: {
      usesNonExemptEncryption: false,
    },
    bundleIdentifier: "com.lukehowsam123.exporouterblog",
  },
  android: {
    package: "com.lukehowsam123.exporouterblog",
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    softwareKeyboardLayoutMode: "pan",
  },
  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
    bundler: "webpack",
  },
  plugins: [
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#000000",
        },
      },
    ],
    ["expo-font"],
  ],
  experiments: {
    reactCompiler: true,
  },
};

export default config;
