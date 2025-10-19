import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../navigators/AppNavigator";

export function useAppNavigation<
  TParam extends ParamListBase = AppStackParamList
>() {
  const navigation = useNavigation<NativeStackNavigationProp<TParam>>();
  return navigation;
}
