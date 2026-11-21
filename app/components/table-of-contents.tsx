import { Outline } from '@pika-lab/react';
import type { HeadingItem } from '../lib/headings';

export function TableOfContents({ headings }: { headings: HeadingItem[] }) {
  if (headings.length === 0) return null;
  return (
    <div className='max-xl:hidden'>
      <Outline
        aria-label='文章目录'
        items={headings.map(heading => ({
          key: heading.slug,
          label: heading.text,
          targetId: heading.slug,
          depth: heading.depth - 1,
        }))}
        closeOnSelect
        onSelect={key => window.history.pushState(null, '', `#${encodeURIComponent(key)}`)}
      />
    </div>
  );
}
