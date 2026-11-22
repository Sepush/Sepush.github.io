import { Anchor, Collapse, CollapseItem, Eyebrow, type AnchorItem, type CollapseName } from '@pika-lab/react';
import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent, type TransitionEvent } from 'react';
import { useLocation } from 'react-router';
import type { HeadingItem } from '../lib/markdown';

function buildAnchorTree(headings: HeadingItem[]): AnchorItem[] {
  const roots: AnchorItem[] = [];
  const stack: Array<{ depth: number; item: AnchorItem }> = [];

  for (const heading of headings) {
    const item: AnchorItem = {
      key: heading.slug,
      href: `#${heading.slug}`,
      title: heading.text,
    };

    while (stack.length > 0 && stack[stack.length - 1]!.depth >= heading.depth) {
      stack.pop();
    }

    const parent = stack[stack.length - 1]?.item;
    if (parent) {
      parent.children ??= [];
      parent.children.push(item);
    } else {
      roots.push(item);
    }
    stack.push({ depth: heading.depth, item });
  }

  return roots;
}

function scrollToHash(href: string) {
  const id = decodeURIComponent(href.replace(/^#/, ''));
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.history.pushState(null, '', `#${encodeURIComponent(id)}`);
}

const OUTLINE_BOUND = 24;

export function TableOfContents({ headings }: { headings: HeadingItem[] }) {
  const { pathname } = useLocation();
  const items = useMemo(() => buildAnchorTree(headings), [headings]);

  if (items.length === 0) return null;

  return (
    <aside className='blog-toc' aria-label='文章目录'>
      <div className='blog-toc__sticky'>
        <Eyebrow className='blog-toc__title'>目录</Eyebrow>
        <Anchor
          key={pathname}
          aria-label='文章目录'
          bound={OUTLINE_BOUND}
          className='blog-toc__anchor'
          ignoreGap
          items={items}
          showBackground={false}
        />
      </div>
    </aside>
  );
}

const MOBILE_OUTLINE_NAME = 'outline';
const CLOSE_FALLBACK_MS = 350;

export function MobileTableOfContents({ headings }: { headings: HeadingItem[] }) {
  const { pathname } = useLocation();
  const items = useMemo(() => buildAnchorTree(headings), [headings]);
  const [expanded, setExpanded] = useState<CollapseName[]>([]);
  const pendingHref = useRef<string | null>(null);
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const flush = useCallback(() => {
    clearTimeout(fallbackTimer.current);
    const href = pendingHref.current;
    pendingHref.current = null;
    if (href) scrollToHash(href);
  }, []);

  const handleClickCapture = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[href^='#']");
      if (!link || !event.currentTarget.querySelector('.p-anchor')?.contains(link)) return;
      event.preventDefault();
      pendingHref.current = link.getAttribute('href');
      setExpanded([]);
      clearTimeout(fallbackTimer.current);
      fallbackTimer.current = setTimeout(flush, CLOSE_FALLBACK_MS);
    },
    [flush],
  );

  const handleTransitionEnd = useCallback(
    (event: TransitionEvent<HTMLElement>) => {
      if (pendingHref.current && event.propertyName === 'grid-template-rows') flush();
    },
    [flush],
  );

  useEffect(() => () => clearTimeout(fallbackTimer.current), []);
  useEffect(() => {
    setExpanded([]);
  }, [pathname]);

  if (items.length === 0) return null;

  return (
    <div className='blog-toc-mobile' onClickCapture={handleClickCapture} onTransitionEnd={handleTransitionEnd}>
      <Collapse expandedNames={expanded} onUpdateExpandedNames={setExpanded}>
        <CollapseItem name={MOBILE_OUTLINE_NAME} title='文章目录'>
          <Anchor
            key={pathname}
            aria-label='文章目录'
            bound={OUTLINE_BOUND}
            className='blog-toc__anchor'
            ignoreGap
            items={items}
            showBackground={false}
          />
        </CollapseItem>
      </Collapse>
    </div>
  );
}
