import { authorsFixture } from "../fixtures/authors.fixture";
import { postsFixture } from "../fixtures/posts.fixture";
import { Author, BlockContent, Post } from "../types/sanity.types";
import { client } from "./sanity-client";

const USE_FIXTURES = process.env.EXPO_PUBLIC_USE_FIXTURES;

console.log("USE_FIXTURES", USE_FIXTURES);

export type BlockContentWithResolvedImages = (
  | Extract<BlockContent[number], { _type: "block" }>
  | (Omit<Extract<BlockContent[number], { _type: "image" }>, "asset"> & {
      asset?: {
        url?: string;
      };
    })
)[];

export type PostWithAuthor = Omit<Post, "author" | "mainImage" | "body"> & {
  _originalId?: string;
  _system?: {
    base?: {
      id?: string;
      rev?: string;
    };
  };
  author: Omit<Author, "image"> & {
    _originalId?: string;
    _system?: {
      base?: {
        id?: string;
        rev?: string;
      };
    };
    image: Omit<NonNullable<Author["image"]>, "asset"> & {
      asset: {
        url: string;
      };
    };
  };
  mainImage?: Omit<NonNullable<Post["mainImage"]>, "asset"> & {
    asset?: {
      url?: string;
    };
  };
  body?: BlockContentWithResolvedImages;
};

export const blogService = {
  getAllAuthors: async () => {
    if (USE_FIXTURES) {
      return authorsFixture;
    }

    const authors = await client.fetch<PostWithAuthor["author"][]>(`
      *[ _type == "author"] {
        ...,
        image{
          _type,
          asset->{
            url
          }
        }
      }
      |order(name asc)
    `);
    return authors;
  },
  getAuthor: async (id: string) => {
    if (USE_FIXTURES) {
      return authorsFixture.find((author) => author._id === id);
    }

    const author = await client.fetch<PostWithAuthor["author"]>(
      `
    *[ _type == "author" && _id == $id][0] {
        ...,
        image{
          _type,
          asset->{
            url
          }
        }
      }
    `,
      { id }
    );
    return author;
  },
  getAllPosts: async () => {
    if (USE_FIXTURES) {
      return postsFixture;
    }

    const posts = await client.fetch<PostWithAuthor[]>(`
*[_type == "post"] {
  ...,
  author->{
    ...,
    image {
      _type,
      asset->{
        url
      }
    }
  },
  mainImage {
    _type,
    asset->{
      url
    }
  },
  body[]{
    ...,
    _type == "image" => {
      ...,
      asset->{
        url
      }
    }
  }
}
| order(publishedAt desc)

    `);

    return posts;
  },

  getPostBySlug: async (slug: string) => {
    if (USE_FIXTURES) {
      return postsFixture.find((post) => post.slug?.current === slug);
    }

    const post = await client.fetch<PostWithAuthor>(
      `
        *[ _type == "post" && slug.current == $slug][0] {
          ...,
          author->{
            ...,
            image{
              _type,
              asset->{
                url
              }
            }
          },
          mainImage{
            _type,
            asset->{
              url
            }
          },
          body[]{
            ...,
            _type == "image" => {
              ...,
              asset->{
                url
              }
            }
          }
        }`,
      { slug }
    );

    return post;
  },

  getPostById: async (id: string) => {
    if (USE_FIXTURES) {
      return postsFixture.find((post) => post._id === id);
    }

    const post = await client.fetch<PostWithAuthor>(
      `
        *[ _type == "post" && _id == $id][0] {
          ...,
          author->{
            ...,
            image{
              _type,
              asset->{
                url
              }
            }
          },
          mainImage{
            _type,
            asset->{
              url
            }
          },
          body[]{
            ...,
            _type == "image" => {
              ...,
              asset->{
                url
              }
            }
          }
        }`,
      { id }
    );

    return post;
  },
} as const;
