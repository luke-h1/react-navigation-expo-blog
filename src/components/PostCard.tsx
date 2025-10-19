import { useAppNavigation } from "@src/hooks/useAppNavigation";
import { PostWithAuthor } from "@src/services/blog-service";
import { theme } from "@src/theme";
import { format } from "date-fns";
import * as Haptics from "expo-haptics";
import { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Author } from "../types/sanity.types";
import { AuthorDetails } from "./AuthorDetails";
import { ThemedText } from "./Themed";

interface Props {
  post: PostWithAuthor;
}

export function PostCard({ post }: Props) {
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

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      <GestureDetector gesture={gesturePostTap}>
        <View
          style={[
            styles.container,
            { backgroundColor: theme.color.background.dark },
          ]}
        >
          <View
            style={[
              styles.content,
              { backgroundColor: theme.color.backgroundSecondary.dark },
            ]}
          >
            <View
              style={{
                marginHorizontal: -theme.space16,
                paddingHorizontal: theme.space16,
                marginVertical: -theme.space8,
                paddingVertical: theme.space8,
              }}
            >
              <View style={styles.titleAndBookmark}>
                <ThemedText
                  fontSize={theme.fontSize18}
                  fontWeight="semiBold"
                  style={styles.title}
                >
                  {post.title}
                  {}
                </ThemedText>
              </View>
              <View style={styles.time}>
                <ThemedText
                  fontSize={theme.fontSize14}
                  fontWeight="medium"
                  color={theme.color.textSecondary}
                >
                  {/* {post.publishedAt} */}

                  {format(post.publishedAt as unknown as number, "MMM d, yyyy")}
                </ThemedText>
                <ThemedText
                  fontSize={theme.fontSize14}
                  fontWeight="medium"
                  color={theme.color.textSecondary}
                >
                  By {post.author?.name}
                </ThemedText>
              </View>
            </View>
            <GestureDetector
              key={post.author?._id}
              gesture={createAuthorTapGesture(post.author as unknown as Author)}
            >
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  navigate.navigate("Author", { id: post.author?._id });
                }}
              >
                <View
                  style={{
                    marginHorizontal: -theme.space16,
                    paddingHorizontal: theme.space16,
                    marginVertical: -theme.space8,
                    paddingVertical: theme.space8,
                    borderRadius: theme.borderRadius32,
                  }}
                >
                  <AuthorDetails author={post.author} />
                </View>
              </Pressable>
            </GestureDetector>
          </View>
        </View>
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bookmarkContainer: {
    position: "absolute",
    right: theme.space24,
    top: theme.space24,
  },
  container: {
    borderRadius: theme.borderRadius10,
    marginBottom: theme.space24,
    marginHorizontal: theme.space16,
  },
  content: {
    borderRadius: theme.borderRadius32,
    gap: theme.space24,
    padding: theme.space24,
  },
  time: {
    borderRadius: theme.borderRadius10,
    flexDirection: "row",
    gap: theme.space8,
  },
  title: {
    flex: 1,
    marginRight: 40,
    marginBottom: theme.space4,
  },
  titleAndBookmark: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.space8,
    justifyContent: "space-between",
  },
});
