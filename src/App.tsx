import * as SplashScreen from "expo-splash-screen";
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
