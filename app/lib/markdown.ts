import {
  alertExtension,
  extractHeadings,
  gfmExtension,
  markdownToPlainText,
  mathExtension,
  type MarkdownExtension,
  type MarkdownExtensions,
} from '@pika-lab/react/markdown';

export interface HeadingItem {
  depth: number;
  slug: string;
  text: string;
}

const BLOG_MARKDOWN_EXTENSIONS: MarkdownExtension[] = [gfmExtension, alertExtension, mathExtension];

/**
 * Blog Markdown extensions: GFM, GitHub alerts, and KaTeX math.
 * Explicitly excludes chat-oriented reference extensions.
 */
export const blogMarkdownExtensions: MarkdownExtensions = () => BLOG_MARKDOWN_EXTENSIONS;

export function extractPostHeadings(source: string, maxDepth = 3): HeadingItem[] {
  return extractHeadings(source, { extensions: blogMarkdownExtensions })
    .filter(heading => heading.depth <= maxDepth && heading.id.length > 0)
    .map(heading => ({
      depth: heading.depth,
      slug: heading.id,
      text: heading.text,
    }));
}

const CJK_RE = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/g;

export function estimateReadingMinutes(source: string): number {
  const plain = markdownToPlainText(source, { extensions: blogMarkdownExtensions });
  const cjkCount = plain.match(CJK_RE)?.length ?? 0;
  const nonCjk = plain.replace(CJK_RE, ' ').trim();
  const wordCount = nonCjk.length > 0 ? nonCjk.split(/\s+/).length : 0;
  const minutes = cjkCount / 350 + wordCount / 220;
  return Math.max(1, Math.round(minutes));
}

export function extractExcerpt(source: string, maxLength = 140): string {
  const withoutHeadings = source.replace(/^#{1,6}\s+.*$/gm, '');
  const plain = markdownToPlainText(withoutHeadings, { extensions: blogMarkdownExtensions })
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength).trimEnd()}…`;
}
