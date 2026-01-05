import { type CollectionEntry, getCollection } from 'astro:content';

export enum ContentType {
  Posts = 'posts',
  Notes = 'notes',
  About = 'about',
}

export interface PostsContent extends CollectionEntry<'posts'> {
  type: ContentType.Posts;
}

export interface NotesContent extends CollectionEntry<'notes'> {
  type: ContentType.Notes;
}

export interface AboutContent extends CollectionEntry<'about'> {
  type: ContentType.About;
}

export type ContentItem = PostsContent | NotesContent | AboutContent;

export function isDevEnv(): boolean {
  return import.meta.env.DEV;
}

function includeDraft(draft: boolean | undefined): boolean {
  return isDevEnv() || !draft;
}

function compareByPubDateDesc<T extends { data: { pubDate: Date } }>(
  a: T,
  b: T,
): number {
  return b.data.pubDate.getTime() - a.data.pubDate.getTime();
}

export async function getPosts(): Promise<CollectionEntry<'posts'>[]> {
  return await getCollection('posts', ({ data }) => {
    return includeDraft(data.draft);
  });
}

export async function getSortedPosts(): Promise<CollectionEntry<'posts'>[]> {
  const posts = await getPosts();
  return [...posts].sort(compareByPubDateDesc);
}

export async function getNotes(): Promise<CollectionEntry<'notes'>[]> {
  return await getCollection('notes', ({ data }) => {
    return includeDraft(data.draft);
  });
}

export async function getSortedNotes(): Promise<CollectionEntry<'notes'>[]> {
  const notes = await getNotes();
  return [...notes].sort(compareByPubDateDesc);
}

export async function getAbout(): Promise<CollectionEntry<'about'>> {
  const aboutItems = await getCollection('about');
  const about = aboutItems[0];
  if (!about) {
    throw new Error(
      'Missing "about" content. Add a file under src/content/about/ (e.g. src/content/about/index.md).',
    );
  }
  return about;
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

  return allContent.sort(compareByPubDateDesc);
}
