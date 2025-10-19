import * as AC from "@bacons/apple-colors";
import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { ComponentType, FC } from "react";
import BlurTabBarBackground from "../components/BlurTabBackground";
import { HapticTab } from "../components/HapticTab";
import { IconSymbol, IconSymbolName } from "../components/IconSymbol";
import AuthorsScreen from "../screens/AuthorsScreen";
import HomeScreen from "../screens/HomeScreen";
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator";

export type TabParamList = {
  Home: undefined;
  Authors: undefined;
  Article: { id: string };
};

export type TabScreenProps<TParam extends keyof TabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<TabParamList, TParam>,
    AppStackScreenProps<keyof AppStackParamList>
  >;

const Tab = createBottomTabNavigator<TabParamList>();

type ScreenComponentType =
  | FC<TabScreenProps<"Home">>
  | FC<TabScreenProps<"Authors">>;

interface Screen {
  name: keyof TabParamList;
  component: ScreenComponentType;
  symbol: IconSymbolName;
}

const screens: Screen[] = [
  {
    name: "Home",
    component: HomeScreen,
    symbol: "person.2",
  },
  {
    name: "Authors",
    component: AuthorsScreen,
    symbol: "chart.bar",
  },
];

export function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarButton: HapticTab,
        headerShown: false,
        tabBarBackground: BlurTabBarBackground,
        tabBarInactiveTintColor: AC.label as unknown as string,
        tabBarStyle:
          process.env.EXPO_OS === "ios" ? { position: "absolute" } : {},
      }}
    >
      {screens.map((screen) => {
        return (
          <Tab.Screen
            key={screen.name}
            name={screen.name}
            component={screen.component as ComponentType}
            options={{
              lazy: true,
              headerShown: false,

              tabBarIcon: ({ focused, color, size }) => (
                <IconSymbol
                  name={screen.symbol}
                  color={color}
                  size={size}
                  weight={focused ? "semibold" : "regular"}
                />
              ),
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
}
