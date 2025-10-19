import { useQuery } from "@tanstack/react-query";
import { AuthorImage } from "../components/AuthorImage";
import { ThemedText, ThemedView } from "../components/Themed";
import { blogService } from "../services/blog-service";
import imageService from "../services/image-service";
import { theme } from "../theme";

import { useAppNavigation } from "@src/hooks/useAppNavigation";
import { AppStackScreenProps } from "@src/navigators/AppNavigator";
import { lazy, Suspense } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

const PortableText = lazy(() =>
  import("@portabletext/react-native").then((module) => ({
    default: module.PortableText,
  }))
);

// export async function generateStaticParams(): Promise<
//   Record<string, string>[]
// > {
//   const authors = await blogService.getAllAuthors();
//   // Return an array of params to generate static HTML files for.
//   // Each entry in the array will be a new page.
//   return authors.map((author) => ({ id: author._id }));
// }

export default function AuthorScreen({ route }: AppStackScreenProps<"Author">) {
  const navigate = useAppNavigation();
  const borderColor = theme.color.border.dark;
  const backgroundColorSecondary = theme.color.backgroundSecondary.dark;

  const { data: author } = useQuery({
    queryKey: ["author", route.params.id],
    queryFn: () => blogService.getAuthor(route.params.id),
  });

  return (
    <>
      <ThemedView
        style={styles.container}
        color={{
          light: theme.color.background.light,
          dark: theme.color.background.dark,
        }}
      >
        {author ? (
          <ScrollView
            style={styles.container}
            contentContainerStyle={[
              styles.contentContainer,
              styles.previewContent,
              { borderColor },
            ]}
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.centered}>
              <AuthorImage
                style={styles.speakerImage}
                profilePicture={imageService.urlFor(
                  author.image?.asset?.url as string,
                  {
                    width: 192,
                    height: 192,
                  }
                )}
                size={"large"}
                authorName={author.name}
              />
              <ThemedText
                fontSize={theme.fontSize18}
                fontWeight="medium"
                numberOfLines={2}
                style={styles.authorName}
              >
                {author.name}
              </ThemedText>
            </View>
            {author.bio ? (
              <Suspense
                fallback={
                  <View style={{ padding: theme.space16 }}>
                    <ActivityIndicator />
                  </View>
                }
              >
                <PortableText
                  value={author.bio}
                  components={{
                    block: {
                      normal: ({ children }) => (
                        <ThemedText
                          fontSize={theme.fontSize14}
                          fontWeight="medium"
                          style={{
                            marginBottom: theme.space16,
                            lineHeight: theme.fontSize14 * 1.6,
                          }}
                        >
                          {children}
                        </ThemedText>
                      ),
                      h1: ({ children }) => (
                        <ThemedText
                          fontSize={theme.fontSize24}
                          fontWeight="bold"
                          style={{ marginBottom: theme.space16 }}
                        >
                          {children}
                        </ThemedText>
                      ),
                      h2: ({ children }) => (
                        <ThemedText
                          fontSize={theme.fontSize20}
                          fontWeight="bold"
                          style={{ marginBottom: theme.space12 }}
                        >
                          {children}
                        </ThemedText>
                      ),
                      blockquote: ({ children }) => (
                        <View
                          style={{
                            borderLeftWidth: 4,
                            borderLeftColor: borderColor,
                            paddingLeft: theme.space16,
                            marginVertical: theme.space16,
                          }}
                        >
                          <ThemedText
                            fontSize={theme.fontSize14}
                            fontWeight="light"
                            style={{ fontStyle: "italic" }}
                            color={theme.color.textSecondary}
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
                        <ThemedText style={{ fontStyle: "italic" }}>
                          {children}
                        </ThemedText>
                      ),
                      link: ({ value, children }) => (
                        <ThemedText
                          style={{ textDecorationLine: "underline" }}
                          color={{
                            light: theme.color.reactBlue.light,
                            dark: theme.color.reactBlue.dark,
                          }}
                        >
                          {children}
                        </ThemedText>
                      ),
                    },
                    list: {
                      bullet: ({ children }) => (
                        <View style={{ marginBottom: theme.space16 }}>
                          {children}
                        </View>
                      ),
                      number: ({ children }) => (
                        <View style={{ marginBottom: theme.space16 }}>
                          {children}
                        </View>
                      ),
                    },
                    listItem: {
                      bullet: ({ children }) => (
                        <View
                          style={{
                            flexDirection: "row",
                            marginBottom: theme.space8,
                          }}
                        >
                          <ThemedText style={{ marginRight: theme.space8 }}>
                            •
                          </ThemedText>
                          <ThemedText
                            fontSize={theme.fontSize14}
                            fontWeight="medium"
                            style={{
                              flex: 1,
                              lineHeight: theme.fontSize14 * 1.6,
                            }}
                          >
                            {children}
                          </ThemedText>
                        </View>
                      ),
                      number: ({ children, index }) => (
                        <View
                          style={{
                            flexDirection: "row",
                            marginBottom: theme.space8,
                          }}
                        >
                          <ThemedText style={{ marginRight: theme.space8 }}>
                            {index + 1}.
                          </ThemedText>
                          <ThemedText
                            fontSize={theme.fontSize14}
                            fontWeight="medium"
                            style={{
                              flex: 1,
                              lineHeight: theme.fontSize14 * 1.6,
                            }}
                          >
                            {children}
                          </ThemedText>
                        </View>
                      ),
                    },
                  }}
                />
              </Suspense>
            ) : null}
            {author.bio ? (
              <Suspense fallback={null}>
                <ThemedText
                  fontSize={theme.fontSize12}
                  fontWeight="light"
                  numberOfLines={2}
                  style={styles.previewBio}
                  color={theme.color.textSecondary}
                >
                  <PortableText value={author.bio} />
                </ThemedText>
              </Suspense>
            ) : null}
          </ScrollView>
        ) : (
          <View>
            <ThemedText>Author not found</ThemedText>
          </View>
        )}
      </ThemedView>
    </>
  );
}
const styles = StyleSheet.create({
  centered: {
    alignItems: "center",
  },
  container: {
    flex: 1,
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
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: theme.borderRadius20,
  },
  authorName: {
    textAlign: "center",
  },
  previewBio: {
    textAlign: "center",
  },
  icon: {
    height: theme.fontSize20,
    width: theme.fontSize20,
  },
  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: theme.space24,
    width: "100%",
  },
  socials: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: theme.space24,
  },
  speakerImage: {
    marginBottom: theme.space24,
  },
  tagLine: {
    textAlign: "center",
  },
});
