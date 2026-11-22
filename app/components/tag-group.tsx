import { Tag } from '@pika-lab/react';

export function TagGroup({
  tags,
  showHash = false,
  size = 'tiny',
}: {
  tags: string[];
  showHash?: boolean;
  size?: 'tiny' | 'small';
}) {
  if (tags.length === 0) return null;
  return (
    <div className='blog-tag-group'>
      {tags.map(tag => (
        <Tag key={tag} size={size} round>
          {showHash ? `#${tag}` : tag}
        </Tag>
      ))}
    </div>
  );
}
