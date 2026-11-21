import { readFileSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { contentRoot, contentSlug, markdownFiles } from './content-paths';

export interface Post {
  slug: string;
  title: string;
  description?: string;
  pubDate: string;
  updatedDate?: string;
  tags: string[];
  draft: boolean;
  author: string;
  body: string;
}

export interface Note {
  slug: string;
  title: string;
  content?: string;
  pubDate: string;
  mood?: string;
  location?: string;
  tags: string[];
  draft: boolean;
  body: string;
}

export interface About {
  body: string;
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
      return {
        slug: contentSlug(file, 'posts'),
        title: requiredString(data.title, 'title', file),
        description: optionalString(data.description, 'description', file),
        pubDate: isoDate(data.pubDate, 'pubDate', file),
        updatedDate: data.updatedDate ? isoDate(data.updatedDate, 'updatedDate', file) : undefined,
        tags: stringList(data.tags, file),
        draft: data.draft === true,
        author: optionalString(data.author, 'author', file) ?? 'Artea',
        body: content,
      } satisfies Post;
    })
    .filter(post => includeDrafts() || !post.draft)
    .sort((a, b) => Date.parse(b.pubDate) - Date.parse(a.pubDate));
}

export function getPost(slug: string): Post | undefined {
  const normalized = slug.replace(/\/+$/, '');
  return getPosts().find(post => post.slug === normalized);
}

export function getNotes(): Note[] {
  const directory = path.join(contentRoot, 'notes');
  return markdownFiles(directory)
    .map(file => {
      const { data, content } = matter(readFileSync(file, 'utf8'));
      return {
        slug: contentSlug(file, 'notes'),
        title: requiredString(data.title, 'title', file),
        content: optionalString(data.content, 'content', file),
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

export function getNote(slug: string): Note | undefined {
  const normalized = slug.replace(/\/+$/, '');
  return getNotes().find(note => note.slug === normalized);
}

export function getAbout(): About {
  const file = path.join(contentRoot, 'about', 'index.md');
  const { content } = matter(readFileSync(file, 'utf8'));
  return { body: content };
}
