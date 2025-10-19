import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useAppNavigation } from "@src/hooks/useAppNavigation";
import { PostWithAuthor } from "@src/services/blog-service";
import { theme } from "@src/theme";
import { format } from "date-fns";
import * as Haptics from "expo-haptics";
import { useMemo, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Author } from "../types/sanity.types";
import { AuthorDetails } from "./AuthorDetails";
import { ThemedText, ThemedView, useThemeColor } from "./Themed";

interface Props {
  post: PostWithAuthor;
}

export function PostCard({ post }: Props) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const scale = useSharedValue(1);
  const bookmarkScale = useSharedValue(1);
  const navigate = useAppNavigation();

  const textSecondaryColor = useThemeColor(theme.color.textSecondary);
  const reactBlueColor = useThemeColor(theme.color.reactBlue);

  const gesturePostTap = useMemo(
    () =>
      Gesture.Tap()
        .maxDistance(10)
        .runOnJS(true)
        .onStart(() => {
          scale.value = withSpring(0.98);
        })
        .onEnd(() => {
          scale.value = withSpring(1);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          navigate.navigate("Article", { id: post._id });
        })
        .onFinalize(() => {
          scale.value = withSpring(1);
        }),
    [scale, navigate, post._id]
  );

  const createAuthorTapGesture = (author: Author) =>
    Gesture.Tap()
      .maxDistance(10)
      .runOnJS(true)
      .onEnd(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigate.navigate("Author", { id: author._id });
      });

  const handleBookmark = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    bookmarkScale.value = withSpring(0.8, {}, () => {
      bookmarkScale.value = withSpring(1);
    });
    setIsBookmarked(!isBookmarked);
  };

  const bookmarkGesture = Gesture.Tap()
    .maxDistance(10)
    .runOnJS(true)
    .onEnd(handleBookmark);

  // Calculate estimated read time
  const estimatedReadTime = useMemo(() => {
    if (!post.body) return 1;
    const wordCount = post.body
      .filter((block) => block._type === "block")
      .reduce((count, block: any) => {
        const text = block.children
          ?.map((child: any) => child.text || "")
          .join(" ");
        return count + (text?.split(/\s+/).length || 0);
      }, 0);
    return Math.max(1, Math.ceil(wordCount / 200));
  }, [post.body]);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedBookmarkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bookmarkScale.value }],
  }));

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      <GestureDetector gesture={gesturePostTap}>
        <Animated.View style={animatedCardStyle}>
          <ThemedView
            style={styles.container}
            color={theme.color.backgroundSecondary}
          >
            <ThemedView
              color={theme.color.backgroundSecondary}
              style={[
                styles.content,
                Platform.OS === "android" && styles.androidElevation,
              ]}
            >
              {/* Title and Bookmark Row */}
              <View style={styles.headerRow}>
                <ThemedText
                  fontSize={theme.fontSize18}
                  fontWeight="semiBold"
                  style={styles.title}
                >
                  {post.title}
                </ThemedText>
                <GestureDetector gesture={bookmarkGesture}>
                  <Animated.View
                    style={[styles.bookmarkButton, animatedBookmarkStyle]}
                  >
                    <MaterialCommunityIcons
                      name={isBookmarked ? "bookmark" : "bookmark-outline"}
                      size={24}
                      color={isBookmarked ? reactBlueColor : textSecondaryColor}
                    />
                  </Animated.View>
                </GestureDetector>
              </View>

              {/* Date and Read Time Row */}
              <View style={styles.metaRow}>
                <ThemedText
                  fontSize={theme.fontSize14}
                  fontWeight="medium"
                  color={theme.color.textSecondary}
                >
                  {format(post.publishedAt as unknown as number, "MMM d, yyyy")}
                </ThemedText>
                <ThemedText
                  fontSize={theme.fontSize14}
                  fontWeight="medium"
                  color={theme.color.textSecondary}
                >
                  •
                </ThemedText>
                <ThemedText
                  fontSize={theme.fontSize14}
                  fontWeight="medium"
                  color={theme.color.textSecondary}
                >
                  {estimatedReadTime} min read
                </ThemedText>
                <View style={styles.spacer} />
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={16}
                  color={textSecondaryColor}
                />
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Author Section */}
              <GestureDetector
                key={post.author?._id}
                gesture={createAuthorTapGesture(
                  post.author as unknown as Author
                )}
              >
                <View style={styles.authorContainer}>
                  <AuthorDetails author={post.author} />
                </View>
              </GestureDetector>

              {/* Read More Button */}
              <View style={styles.readMoreContainer}>
                <ThemedText
                  fontSize={theme.fontSize14}
                  fontWeight="semiBold"
                  color={theme.color.reactBlue}
                  style={styles.readMoreText}
                >
                  Read Article →
                </ThemedText>
              </View>
            </ThemedView>
          </ThemedView>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius32,
    marginBottom: theme.space24,
    marginHorizontal: theme.space16,
  },
  content: {
    borderRadius: theme.borderRadius32,
    padding: theme.space24,
  },
  androidElevation: {
    elevation: 4,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: theme.space12,
  },
  title: {
    flex: 1,
    marginRight: theme.space12,
  },
  bookmarkButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -8,
    marginRight: -8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space8,
    marginBottom: theme.space16,
  },
  spacer: {
    flex: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#00000020",
    marginVertical: theme.space16,
  },
  authorContainer: {
    marginBottom: theme.space16,
  },
  readMoreContainer: {
    alignItems: "flex-end",
  },
  readMoreText: {
    letterSpacing: 0.5,
  },
});
