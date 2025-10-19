import { Button, Host, Image } from "@expo/ui/swift-ui";
import { frame } from "@expo/ui/swift-ui/modifiers";
import { useAppNavigation } from "@src/hooks/useAppNavigation";
import { PostWithAuthor } from "@src/services/blog-service";
import { theme } from "@src/theme";
import { format } from "date-fns";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Author } from "../types/sanity.types";
import { AuthorDetails } from "./AuthorDetails";
import { ThemedText, ThemedView } from "./Themed";

interface Props {
  post: PostWithAuthor;
}

export function PostCard({ post }: Props) {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const navigate = useAppNavigation();

  const gesturePostTap = useMemo(
    () =>
      Gesture.Tap()
        .maxDistance(10)
        .runOnJS(true)
        .onEnd(() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          navigate.navigate("Article", { id: post._id });
        }),
    [navigate, post._id]
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
    setIsBookmarked(!isBookmarked);
  };

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

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      <GestureDetector gesture={gesturePostTap}>
        <ThemedView style={styles.container}>
          <ThemedView
            color={theme.color.backgroundSecondary}
            style={styles.content}
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
              <Host matchContents style={styles.bookmarkHost}>
                <Button variant="plain" onPress={handleBookmark}>
                  <Image
                    systemName={isBookmarked ? "bookmark.fill" : "bookmark"}
                    size={20}
                    color="primary"
                    modifiers={[frame({ height: 28, width: 28 })]}
                  />
                </Button>
              </Host>
            </View>

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
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Author Section */}
            <GestureDetector
              key={post.author?._id}
              gesture={createAuthorTapGesture(post.author as unknown as Author)}
            >
              <View style={styles.authorContainer}>
                <AuthorDetails author={post.author} />
              </View>
            </GestureDetector>

            {/* Read More */}
            <View style={styles.readMoreContainer}>
              <ThemedText
                fontSize={theme.fontSize14}
                fontWeight="semiBold"
                color={theme.color.reactBlue}
              >
                Read Article →
              </ThemedText>
            </View>
          </ThemedView>
        </ThemedView>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: theme.space12,
  },
  title: {
    flex: 1,
    marginRight: theme.space8,
  },
  bookmarkHost: {
    height: 28,
    width: 28,
    marginTop: -4,
    marginRight: -4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space8,
    marginBottom: theme.space16,
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
});
