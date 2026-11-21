import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export const contentRoot = path.resolve(process.cwd(), 'src/content');

export function markdownFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true, recursive: true })
    .filter(entry => entry.isFile() && /\.mdx?$/.test(entry.name))
    .map(entry => path.join(entry.parentPath, entry.name))
    .sort();
}

export function contentSlug(file: string, collection: 'posts' | 'notes'): string {
  return path
    .relative(path.join(contentRoot, collection), file)
    .replace(/\.mdx?$/, '')
    .split(path.sep)
    .join('/');
}

export function getStaticContentPaths(): string[] {
  const paths = ['/', '/posts', '/notes', '/about', '/friends', '/404'];
  for (const collection of ['posts', 'notes'] as const) {
    for (const file of markdownFiles(path.join(contentRoot, collection))) {
      const { data } = matter(readFileSync(file, 'utf8'));
      if (data.draft === true) continue;
      paths.push(`/${collection}/${contentSlug(file, collection)}`);
    }
  }
  return paths;
}
