import { type CollectionEntry, getCollection } from "astro:content";

export enum ContentType {
  Posts = "posts",
  Notes = "notes",
  About = "about",
}

export interface PostsContent extends CollectionEntry<"posts"> {
  type: ContentType.Posts;
}

export interface NotesContent extends CollectionEntry<"notes"> {
  type: ContentType.Notes;
}

export interface AboutContent extends CollectionEntry<"about"> {
  type: ContentType.About;
}

export type ContentItem = PostsContent | NotesContent | AboutContent;

export function isDevEnv(): boolean {
  return import.meta.env.DEV;
}

export async function getPosts(): Promise<CollectionEntry<"posts">[]> {
  const showDrafts = isDevEnv();

  return await getCollection("posts", ({ data }) => {
    return showDrafts || !data.draft;
  });
}

export async function getSortedPosts(): Promise<CollectionEntry<"posts">[]> {
  const posts = await getPosts();
  return posts.sort(
    (a, b) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime(),
  );
}

export async function getNotes(): Promise<CollectionEntry<"notes">[]> {
  const showDrafts = isDevEnv();

  return await getCollection("notes", ({ data }) => {
    return showDrafts || !data.draft;
  });
}

export async function getAbout(): Promise<CollectionEntry<"about">> {
  const aboutItems = await getCollection("about");
  return aboutItems[0];
}

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
