import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { theme } from "@src/theme";
import { Pressable } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { HeaderButtonProps } from "./HeaderButton.ios";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function HeaderButton({ imageProps, buttonProps }: HeaderButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      hitSlop={20}
      onPress={buttonProps?.onPress}
      onPressIn={() => {
        scale.value = withTiming(0.8);
      }}
      onPressOut={() => {
        scale.value = withTiming(1);
      }}
      style={animatedStyle}
    >
      <MaterialCommunityIcons
        // Todo: fix this type
        name={(imageProps?.systemName as any) || "cross"}
        size={theme.fontSize24}
        color={imageProps?.color || theme.colorGrey}
      />
    </AnimatedPressable>
  );
}
