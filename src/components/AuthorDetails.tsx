import { PostWithAuthor } from "@src/services/blog-service";
import imageService from "@src/services/image-service";
import { theme } from "@src/theme";
import { StyleSheet, View } from "react-native";
import { AuthorImage } from "./AuthorImage";
import { ThemedText } from "./Themed";

interface Props {
  author: PostWithAuthor["author"];
}

export function AuthorDetails({ author }: Props) {
  return (
    <View style={styles.speaker}>
      <AuthorImage
        profilePicture={imageService.urlFor(
          author?.image?.asset?.url as string,
          { width: 84, height: 84 }
        )}
        animated
        size="small"
        authorName={author?.name}
      />
      <View style={styles.speakerDetails}>
        <ThemedText fontSize={theme.fontSize16}>{author.name}</ThemedText>
        {author.bio ? (
          <ThemedText
            fontSize={theme.fontSize14}
            fontWeight="medium"
            color={theme.color.textSecondary}
          >
            bio
          </ThemedText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  speaker: {
    alignItems: "center",
    flexDirection: "row",
  },
  speakerDetails: {
    flex: 1,
    gap: theme.space2,
    justifyContent: "center",
  },
});
