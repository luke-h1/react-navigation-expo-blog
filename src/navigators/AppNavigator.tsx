import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StackScreenProps } from "@react-navigation/stack";
import * as SplashScreen from "expo-splash-screen";
import { ComponentProps, useMemo } from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import { useBackButtonHandler } from "../navigationUtilities";
import ArticleScreen from "../screens/ArticleScreen";
import AuthorScreen from "../screens/AuthorSlugScreen";
import { TabNavigator, TabParamList } from "./TabNavigator";

/**
 * This type allows TypeScript to know what routes are defined in this navigator as
 * well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`.
 *  * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */

export type AppStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  Author: { id: string };
  Article: { id: string };
};

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = ["Tabs"];

export type AppStackScreenProps<T extends keyof AppStackParamList> =
  StackScreenProps<AppStackParamList, T>;

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Tabs"
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Tab stack */}
      <Stack.Screen name="Tabs" component={TabNavigator} />

      {/* Author screen */}
      <Stack.Screen name="Author" component={AuthorScreen} />

      {/* Article screen */}
      <Stack.Screen name="Article" component={ArticleScreen} />
    </Stack.Navigator>
  );
};

type NavigationProps = Partial<ComponentProps<typeof NavigationContainer>>;

export const AppNavigator = (props: NavigationProps) => {
  const colorScheme = useColorScheme();

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName));

  const navTheme = useMemo(() => {
    const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

    return {
      ...theme,
      colors: {
        ...theme.colors,
      },
    };
  }, [colorScheme]);

  return (
    <NavigationContainer
      theme={navTheme}
      {...props}
      onReady={() => {
        SplashScreen.hideAsync();
      }}
    >
      <View style={styles.container}>
        <AppStack />
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
