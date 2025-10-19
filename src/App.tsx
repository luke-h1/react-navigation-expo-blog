import {
  Montserrat_300Light,
  Montserrat_300Light_Italic,
  Montserrat_500Medium,
  Montserrat_500Medium_Italic,
  Montserrat_600SemiBold,
  Montserrat_600SemiBold_Italic,
  Montserrat_700Bold,
  Montserrat_700Bold_Italic,
  useFonts,
} from "@expo-google-fonts/montserrat";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator } from "./navigators/AppNavigator";
import { Providers } from "./providers";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 200,
  fade: true,
});

export function App() {
  const [fontsLoaded, fontError] = useFonts({
    "Montserrat-Light": Montserrat_300Light,
    "Montserrat-LightItalic": Montserrat_300Light_Italic,
    "Montserrat-Medium": Montserrat_500Medium,
    "Montserrat-MediumItalic": Montserrat_500Medium_Italic,
    "Montserrat-SemiBold": Montserrat_600SemiBold,
    "Montserrat-SemiBoldItalic": Montserrat_600SemiBold_Italic,
    "Montserrat-Bold": Montserrat_700Bold,
    "Montserrat-BoldItalic": Montserrat_700Bold_Italic,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Fonts are loaded or there was an error
      // The splash screen will be hidden by NavigationContainer's onReady
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null; // Keep splash screen visible while loading fonts
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Providers>
          <AppNavigator />
        </Providers>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
