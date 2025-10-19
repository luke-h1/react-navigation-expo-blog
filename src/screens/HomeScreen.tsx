import { useFocusEffect, useScrollToTop } from "@react-navigation/native";
import { queryClient } from "@src/lib/query-client";
import { useQuery } from "@tanstack/react-query";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PostCard } from "../components/PostCard";
import { PostWithAuthor, blogService } from "../services/blog-service";
import { theme } from "../theme";

const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList<PostWithAuthor>
);

const HEADER_SCROLL_OFFSET = isLiquidGlassAvailable() ? 110 : 90;

export default function HomeScreen() {
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: () => blogService.getAllPosts(),
  });

  const scrollRef = useRef<FlatList>(null);
  useScrollToTop(scrollRef as any);
  const backgroundColor = theme.color.background.dark;
  const isLiquidGlass = isLiquidGlassAvailable();
  const [isRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const animatedTranslateY = useSharedValue(0);
  const isScrolledDown = useSharedValue(false);

  // Sticky header animation for iOS
  useAnimatedStyle(() => {
    if (Platform.OS !== "ios") {
      return {};
    }

    return {
      transform: [{ translateY: animatedTranslateY.value }],
      backgroundColor: isLiquidGlass ? "transparent" : backgroundColor,
    };
  });

  const renderItem: ListRenderItem<PostWithAuthor> = useCallback(({ item }) => {
    return <PostCard post={item} key={item._id} />;
  }, []);

  useFocusEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  });

  const scrollHandler = useAnimatedScrollHandler((event) => {
    animatedTranslateY.value = interpolate(
      event.contentOffset.y,
      [-HEADER_SCROLL_OFFSET, 0],
      [0, HEADER_SCROLL_OFFSET],
      Extrapolation.CLAMP
    );

    isScrolledDown.value = event.contentOffset.y > 10;
  });

  if (isPending) {
    return (
      <View style={[styles.centerContainer, { backgroundColor }]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading posts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centerContainer, { backgroundColor }]}>
        <Text style={styles.errorText}>Error loading posts</Text>
        <Text style={styles.errorDetail}>{error.message}</Text>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={[styles.centerContainer, { backgroundColor }]}>
        <Text style={styles.emptyText}>No posts found</Text>
      </View>
    );
  }

  return (
    <>
      {/* <Head>
        <title>Expo Router Blog - Latest Posts</title>
        <meta
          name="description"
          content="Discover the latest articles and posts on Expo Router Blog. Stay updated with modern React Native development and best practices."
        />
      </Head> */}
      <AnimatedFlatList
        ref={scrollRef}
        data={data}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refetch} />
        }
        style={{ backgroundColor }}
        contentContainerStyle={{
          paddingBottom: Platform.select({
            android: 100 + insets.bottom,
            default: 0,
          }),
        }}
        contentInsetAdjustmentBehavior="automatic"
        scrollToOverflowEnabled
        onScroll={scrollHandler}
        stickyHeaderIndices={[0]}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    color: "#fff",
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  errorDetail: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
  },
  emptyText: {
    color: "#fff",
    fontSize: 16,
  },
});
