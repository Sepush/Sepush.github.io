import { readFileSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { contentRoot, contentSlug, markdownFiles } from './content-paths';
import { estimateReadingMinutes, extractExcerpt } from './markdown';

export interface PostSummary {
  slug: string;
  title: string;
  description?: string;
  excerpt: string;
  pubDate: string;
  updatedDate?: string;
  tags: string[];
  draft: boolean;
  author: string;
  readingMinutes: number;
}

export interface Post extends PostSummary {
  body: string;
}

export interface NoteSummary {
  slug: string;
  title: string;
  content?: string;
  excerpt: string;
  pubDate: string;
  mood?: string;
  location?: string;
  tags: string[];
  draft: boolean;
}

export interface Note extends NoteSummary {
  body: string;
}

export interface About {
  body: string;
}

export interface SearchEntry {
  kind: 'post' | 'note';
  href: string;
  title: string;
  description: string;
  tags: string[];
  pubDate: string;
}

function requiredString(value: unknown, field: string, file: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Missing ${field} in ${file}`);
  }
  return value;
}

function optionalString(value: unknown, field: string, file: string): string | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value !== 'string') throw new Error(`Invalid ${field} in ${file}`);
  return value;
}

function isoDate(value: unknown, field: string, file: string): string {
  const date = value instanceof Date ? value : new Date(requiredString(value, field, file));
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid ${field} in ${file}`);
  return date.toISOString();
}

function stringList(value: unknown, file: string): string[] {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.some(item => typeof item !== 'string')) {
    throw new Error(`Invalid tags in ${file}`);
  }
  return value;
}

function includeDrafts(): boolean {
  return process.env.NODE_ENV !== 'production';
}

export function getPosts(): Post[] {
  const directory = path.join(contentRoot, 'posts');
  return markdownFiles(directory)
    .map(file => {
      const { data, content } = matter(readFileSync(file, 'utf8'));
      const description = optionalString(data.description, 'description', file);
      return {
        slug: contentSlug(file, 'posts'),
        title: requiredString(data.title, 'title', file),
        description,
        excerpt: description ?? extractExcerpt(content),
        pubDate: isoDate(data.pubDate, 'pubDate', file),
        updatedDate: data.updatedDate ? isoDate(data.updatedDate, 'updatedDate', file) : undefined,
        tags: stringList(data.tags, file),
        draft: data.draft === true,
        author: optionalString(data.author, 'author', file) ?? 'Artea',
        readingMinutes: estimateReadingMinutes(content),
        body: content,
      } satisfies Post;
    })
    .filter(post => includeDrafts() || !post.draft)
    .sort((a, b) => Date.parse(b.pubDate) - Date.parse(a.pubDate));
}

export function getPostSummaries(): PostSummary[] {
  return getPosts().map(({ body: _body, ...summary }) => summary);
}

export function getPostWithAdjacent(slug: string): {
  post: Post;
  prev?: { title: string; href: string };
  next?: { title: string; href: string };
} | null {
  const normalized = slug.replace(/\/+$/, '');
  const posts = getPosts();
  const index = posts.findIndex(post => post.slug === normalized);
  const post = posts[index];
  if (!post) return null;
  const newer = index > 0 ? posts[index - 1] : undefined;
  const older = index + 1 < posts.length ? posts[index + 1] : undefined;
  return {
    post,
    prev: newer ? { title: newer.title, href: `/posts/${newer.slug}` } : undefined,
    next: older ? { title: older.title, href: `/posts/${older.slug}` } : undefined,
  };
}

export function getNotes(): Note[] {
  const directory = path.join(contentRoot, 'notes');
  return markdownFiles(directory)
    .map(file => {
      const { data, content } = matter(readFileSync(file, 'utf8'));
      const summaryContent = optionalString(data.content, 'content', file);
      return {
        slug: contentSlug(file, 'notes'),
        title: requiredString(data.title, 'title', file),
        content: summaryContent,
        excerpt: summaryContent ?? extractExcerpt(content),
        pubDate: isoDate(data.pubDate, 'pubDate', file),
        mood: optionalString(data.mood, 'mood', file),
        location: optionalString(data.location, 'location', file),
        tags: stringList(data.tags, file),
        draft: data.draft === true,
        body: content,
      } satisfies Note;
    })
    .filter(note => includeDrafts() || !note.draft)
    .sort((a, b) => Date.parse(b.pubDate) - Date.parse(a.pubDate));
}

export function getNoteSummaries(): NoteSummary[] {
  return getNotes().map(({ body: _body, ...summary }) => summary);
}

export function getNote(slug: string): Note | undefined {
  const normalized = slug.replace(/\/+$/, '');
  return getNotes().find(note => note.slug === normalized);
}

export function getAbout(): About {
  const file = path.join(contentRoot, 'about', 'index.md');
  const { content } = matter(readFileSync(file, 'utf8'));
  return { body: content };
}

export function getSearchIndex(): SearchEntry[] {
  const posts: SearchEntry[] = getPostSummaries().map(post => ({
    kind: 'post',
    href: `/posts/${post.slug}`,
    title: post.title,
    description: post.excerpt,
    tags: post.tags,
    pubDate: post.pubDate,
  }));
  const notes: SearchEntry[] = getNoteSummaries().map(note => ({
    kind: 'note',
    href: `/notes/${note.slug}`,
    title: note.title,
    description: note.excerpt,
    tags: note.tags,
    pubDate: note.pubDate,
  }));
  return [...posts, ...notes];
}
