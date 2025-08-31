import { type CollectionEntry, getCollection } from "astro:content";

export function isDevEnv(): boolean {
  return import.meta.env.DEV;
}

export async function getPosts(): Promise<CollectionEntry<"posts">[]> {
  const showDrafts = isDevEnv();

  return await getCollection("posts", ({ data }) => {
    return showDrafts || !data.draft;
  });
}

export async function getNotes(): Promise<CollectionEntry<"notes">[]> {
  const showDrafts = isDevEnv();

  return await getCollection("notes", ({ data }) => {
    return showDrafts || !data.draft;
  });
}

export enum ContentType {
  Posts = "posts",
  Notes = "notes",
}

export interface PostsContent extends CollectionEntry<"posts"> {
  type: ContentType.Posts;
}

export interface NotesContent extends CollectionEntry<"notes"> {
  type: ContentType.Notes;
}

export type ContentItem = PostsContent | NotesContent;

export async function getAllContent(): Promise<ContentItem[]> {
  const [posts, notes] = await Promise.all([
    getPosts(),
    getNotes(),
  ]);

  const allContent: ContentItem[] = [
    ...posts.map((post): ContentItem => ({
      ...post,
      type: ContentType.Posts,
    })),
    ...notes.map((note): ContentItem => ({
      ...note,
      type: ContentType.Notes,
    })),
  ];

  return allContent.sort((a, b) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime());
}
