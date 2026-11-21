import GithubSlugger from 'github-slugger';
import { toString } from 'mdast-util-to-string';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

export interface HeadingItem {
  depth: number;
  slug: string;
  text: string;
}

export function extractHeadings(source: string, maxDepth = 3): HeadingItem[] {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(source);
  const slugger = new GithubSlugger();
  const headings: HeadingItem[] = [];
  visit(tree, 'heading', node => {
    if (node.depth > maxDepth) return;
    const text = toString(node);
    headings.push({ depth: node.depth, slug: slugger.slug(text), text });
  });
  return headings;
}
