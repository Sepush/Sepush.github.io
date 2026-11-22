import { Button, Card, Empty } from '@pika-lab/react';
import type { ReactNode } from 'react';
import { StickyNote } from './icons';
import { RouterLink } from './router-link';

export function EmptyState({
  title = '暂无笔记',
  description = '笔记正在整理中，先去读几篇文章吧。',
  icon = <StickyNote aria-hidden='true' size={32} strokeWidth={1.5} />,
  actionLabel = '浏览文章',
  actionHref = '/posts',
}: {
  title?: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <Card className='blog-empty-card'>
      <Empty
        title={title}
        description={description}
        icon={icon}
        extra={
          <Button tag={RouterLink} href={actionHref} type='primary' size='small'>
            {actionLabel}
          </Button>
        }
      />
    </Card>
  );
}
