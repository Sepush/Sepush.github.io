import { Button, Result } from '@pika-lab/react';
import type { MetaFunction } from 'react-router';
import { RouterLink } from '../components/router-link';

export const meta: MetaFunction = () => [
  { title: '页面不存在 - Artea' },
  { name: 'description', content: '页面不存在' },
];

export default function NotFound() {
  return (
    <div className='blog-not-found'>
      <Result
        status='404'
        title='页面不存在'
        description='你访问的页面可能已移动，或者地址有误。'
        footer={
          <Button tag={RouterLink} href='/' type='primary'>
            返回首页
          </Button>
        }
      />
    </div>
  );
}
