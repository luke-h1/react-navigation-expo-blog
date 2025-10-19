import { useAppNavigation } from "@src/hooks/useAppNavigation";
import { AppStackScreenProps } from "@src/navigators/AppNavigator";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Image } from "expo-image";
import { lazy, Suspense } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { AuthorDetails } from "../components/AuthorDetails";
import { ThemedText, ThemedView } from "../components/Themed";
import { blogService } from "../services/blog-service";
import imageService from "../services/image-service";
import { theme } from "../theme";

const PortableText = lazy(() =>
  import("@portabletext/react-native").then((module) => ({
    default: module.PortableText,
  }))
);

// export async function generateStaticParams(): Promise<
//   Record<string, string>[]
// > {
//   const posts = await blogService.getAllPosts();
//   // Return an array of params to generate static HTML files for.
//   // Each entry in the array will be a new page.
//   return posts.map((post) => ({ id: post._id }));
// }

export default function BlogScreen({ route }: AppStackScreenProps<"Article">) {
  const navigate = useAppNavigation();

  const borderColor = theme.color.border.dark;
  const backgroundColorSecondary = theme.color.backgroundSecondary.dark;

  const {
    data: post,
    isPending,
    error,
  } = useQuery({
    queryKey: ["post", route.params.id],
    queryFn: () => blogService.getPostById(route.params.id as string),
  });

  return (
    <>
      <ThemedView
        style={styles.container}
        color={{
          light: theme.color.background.light,
          dark: isPreview
            ? backgroundColorSecondary
            : theme.color.background.dark,
        }}
      >
        {isPending ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" />
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <ThemedText fontSize={theme.fontSize16} fontWeight="medium">
              Error loading post
            </ThemedText>
          </View>
        ) : post ? (
          <ScrollView
            style={styles.container}
            contentContainerStyle={[
              styles.contentContainer,
              isPreview && styles.previewContent,
            ]}
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
          >
            <ThemedText
              fontSize={isPreview ? theme.fontSize20 : theme.fontSize24}
              fontWeight="bold"
              style={styles.title}
            >
              {post.title}
            </ThemedText>

            {post.publishedAt && (
              <ThemedText
                fontSize={theme.fontSize14}
                fontWeight="medium"
                color={theme.color.textSecondary}
                style={styles.date}
              >
                {format(post.publishedAt as unknown as number, "MMMM d, yyyy")}
              </ThemedText>
            )}

            {post.author && (
              <View style={styles.authorContainer}>
                <AuthorDetails author={post.author} />
              </View>
            )}

            <View
              style={[styles.separator, { borderBottomColor: borderColor }]}
            />

            {post.mainImage?.asset && (
              <Image
                source={{
                  uri: imageService.urlFor(post.mainImage.asset.url as string, {
                    width: 800,
                    height: 500,
                  }),
                }}
                style={styles.mainImage}
                contentFit="cover"
                transition={500}
                cachePolicy="memory-disk"
                priority="high"
                placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
                accessibilityLabel={`Featured image for ${post.title}`}
              />
            )}

            {post.body && (
              <View style={styles.bodyContainer}>
                <Suspense
                  fallback={
                    <View style={{ padding: theme.space16 }}>
                      <ActivityIndicator />
                    </View>
                  }
                >
                  <PortableText
                    value={post.body}
                    components={{
                      block: {
                        normal: ({ children }) => (
                          <ThemedText
                            fontSize={theme.fontSize16}
                            fontWeight="medium"
                            style={styles.paragraph}
                          >
                            {children}
                          </ThemedText>
                        ),
                        h1: ({ children }) => (
                          <ThemedText
                            fontSize={theme.fontSize28}
                            fontWeight="bold"
                            style={styles.heading1}
                          >
                            {children}
                          </ThemedText>
                        ),
                        h2: ({ children }) => (
                          <ThemedText
                            fontSize={theme.fontSize24}
                            fontWeight="bold"
                            style={styles.heading2}
                          >
                            {children}
                          </ThemedText>
                        ),
                        h3: ({ children }) => (
                          <ThemedText
                            fontSize={theme.fontSize20}
                            fontWeight="semiBold"
                            style={styles.heading3}
                          >
                            {children}
                          </ThemedText>
                        ),
                        h4: ({ children }) => (
                          <ThemedText
                            fontSize={theme.fontSize18}
                            fontWeight="semiBold"
                            style={styles.heading4}
                          >
                            {children}
                          </ThemedText>
                        ),
                        blockquote: ({ children }) => (
                          <View
                            style={[
                              styles.blockquote,
                              { borderLeftColor: borderColor },
                            ]}
                          >
                            <ThemedText
                              fontSize={theme.fontSize16}
                              fontWeight="medium"
                              color={theme.color.textSecondary}
                              style={styles.blockquoteText}
                            >
                              {children}
                            </ThemedText>
                          </View>
                        ),
                      },
                      list: {
                        bullet: ({ children }) => (
                          <View style={styles.list}>{children}</View>
                        ),
                      },
                      listItem: {
                        bullet: ({ children }) => (
                          <View style={styles.listItem}>
                            <ThemedText
                              fontSize={theme.fontSize16}
                              style={styles.bullet}
                            >
                              •
                            </ThemedText>
                            <ThemedText
                              fontSize={theme.fontSize16}
                              fontWeight="medium"
                              style={styles.listItemText}
                            >
                              {children}
                            </ThemedText>
                          </View>
                        ),
                      },
                      marks: {
                        strong: ({ children }) => (
                          <ThemedText fontWeight="bold">{children}</ThemedText>
                        ),
                        em: ({ children }) => (
                          <ThemedText style={styles.italic}>
                            {children}
                          </ThemedText>
                        ),
                        link: ({ children, value }) => (
                          <ThemedText
                            color={theme.color.reactBlue}
                            style={styles.link}
                          >
                            {children}
                          </ThemedText>
                        ),
                      },
                      types: {
                        image: ({ value }) => {
                          if (!value?.asset?.url) return null;
                          return (
                            <Image
                              source={{
                                uri: imageService.urlFor(
                                  value.asset.url as string,
                                  { width: 800, height: 400 } // Responsive size for inline images
                                ),
                              }}
                              style={styles.inlineImage}
                              contentFit="cover"
                              transition={200}
                              cachePolicy="memory-disk"
                              priority="normal"
                              accessibilityLabel={value.alt || "Article image"}
                            />
                          );
                        },
                      },
                    }}
                  />
                </Suspense>
              </View>
            )}
          </ScrollView>
        ) : (
          <View style={styles.centerContainer}>
            <ThemedText fontSize={theme.fontSize16} fontWeight="medium">
              Post not found
            </ThemedText>
          </View>
        )}
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    borderBottomLeftRadius: theme.borderRadius20,
    borderBottomRightRadius: theme.borderRadius20,
    padding: theme.space16,
    paddingTop: theme.space24,
  },
  previewContent: {
    paddingHorizontal: theme.space16,
    paddingVertical: theme.space24,
    width: "90%",
    alignSelf: "center",
  },
  title: {
    marginBottom: theme.space12,
  },
  date: {
    marginBottom: theme.space16,
  },
  authorContainer: {
    marginBottom: theme.space16,
  },
  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: theme.space24,
    width: "100%",
  },
  mainImage: {
    width: "100%",
    height: 250,
    borderRadius: theme.borderRadius12,
    marginBottom: theme.space24,
  },
  bodyContainer: {
    marginBottom: theme.space24,
  },
  paragraph: {
    lineHeight: theme.fontSize16 * 1.6,
    marginBottom: theme.space16,
  },
  heading1: {
    marginTop: theme.space24,
    marginBottom: theme.space16,
    lineHeight: theme.fontSize28 * 1.3,
  },
  heading2: {
    marginTop: theme.space16,
    marginBottom: theme.space12,
    lineHeight: theme.fontSize24 * 1.3,
  },
  heading3: {
    marginTop: theme.space16,
    marginBottom: theme.space12,
    lineHeight: theme.fontSize20 * 1.3,
  },
  heading4: {
    marginTop: theme.space16,
    marginBottom: theme.space8,
    lineHeight: theme.fontSize18 * 1.3,
  },
  blockquote: {
    borderLeftWidth: 4,
    paddingLeft: theme.space16,
    marginVertical: theme.space16,
    marginLeft: theme.space8,
  },
  blockquoteText: {
    fontStyle: "italic",
    lineHeight: theme.fontSize16 * 1.5,
  },
  list: {
    marginBottom: theme.space16,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: theme.space8,
  },
  bullet: {
    marginRight: theme.space8,
    width: 20,
  },
  listItemText: {
    flex: 1,
    lineHeight: theme.fontSize16 * 1.5,
  },
  italic: {
    fontStyle: "italic",
  },
  link: {
    textDecorationLine: "underline",
  },
  inlineImage: {
    width: "100%",
    height: 200,
    borderRadius: theme.borderRadius12,
    marginVertical: theme.space16,
  },
});
