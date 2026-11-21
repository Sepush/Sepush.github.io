import { Button, Empty } from '@pika-lab/react';
import { Link as RouterLink } from 'react-router';

export function EmptyState({
  title = '暂无笔记',
  description = '笔记正在整理中～先去读几篇文章吧！',
  icon = 'i-tabler-note',
}: {
  title?: string;
  description?: string;
  icon?: string;
}) {
  return (
    <Empty
      className='py-20'
      title={title}
      description={description}
      icon={<span className={`${icon} text-4xl`} />}
      extra={
        <Button tag={RouterLink} to='/posts' quaternary size='small'>
          浏览文章
        </Button>
      }
    />
  );
}
