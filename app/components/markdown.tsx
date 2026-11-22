import { Markdown, type MarkdownImageTransform } from '@pika-lab/react/markdown';
import { useMemo } from 'react';
import { blogMarkdownExtensions } from '../lib/markdown';

const postAssets = import.meta.glob('/src/content/posts/**/*.{png,jpg,jpeg,webp,gif,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

function resolvePostImage(src: string, postSlug?: string): string {
  if (!src.startsWith('./') && !src.startsWith('../')) return src;
  const segments = postSlug ? postSlug.split('/').slice(0, -1) : [];
  const relativeParts = src.split('/');
  const resolvedParts = [...segments];
  for (const part of relativeParts) {
    if (part === '' || part === '.') continue;
    if (part === '..') resolvedParts.pop();
    else resolvedParts.push(part);
  }
  const key = `/src/content/posts/${resolvedParts.join('/')}`;
  const assetUrl = postAssets[key];
  if (!assetUrl) {
    throw new Error(`Unresolved Markdown image: ${src} in ${postSlug ?? 'content'}`);
  }
  return assetUrl;
}

export function MarkdownContent({ source, postSlug }: { source: string; postSlug?: string }) {
  const imageTransform = useMemo<MarkdownImageTransform>(() => src => resolvePostImage(src, postSlug), [postSlug]);

  return (
    <Markdown
      className='blog-markdown'
      preset='document'
      extensions={blogMarkdownExtensions}
      imageTransform={imageTransform}
      source={source}
    />
  );
}
