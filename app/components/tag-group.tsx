import { Tag } from '@pika-lab/react';

export function TagGroup({ tags, showHash = false }: { tags: string[]; showHash?: boolean }) {
  if (tags.length === 0) return null;
  return (
    <div className='flex flex-wrap items-center gap-2'>
      {tags.map(tag => (
        <Tag key={tag} size='tiny' round>
          {showHash ? `#${tag}` : tag}
        </Tag>
      ))}
    </div>
  );
}
