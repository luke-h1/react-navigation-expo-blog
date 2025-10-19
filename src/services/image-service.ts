import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "./sanity-client";

// https://www.sanity.io/docs/image-url

interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: "webp" | "jpg" | "png";
}

const imageService = {
  urlFor: (source: SanityImageSource, options?: ImageOptions): string => {
    const builder = imageUrlBuilder(client);
    let imageBuilder = builder.image(source);

    // Apply width if specified
    if (options?.width) {
      imageBuilder = imageBuilder.width(options.width);
    }

    // Apply height if specified
    if (options?.height) {
      imageBuilder = imageBuilder.height(options.height);
    }

    // Apply quality (default to 75 for better balance between quality and size)
    const quality = options?.quality ?? 75;
    imageBuilder = imageBuilder.quality(quality);

    // Apply format (default to webp)
    const format = options?.format ?? "webp";
    imageBuilder = imageBuilder.format(format);

    return imageBuilder.url();
  },
};

export default imageService;
