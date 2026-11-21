import { Button } from '@pika-lab/react';
import { Link as RouterLink, useLoaderData, type MetaFunction } from 'react-router';
import { MarkdownContent } from '../components/markdown';
import { getAbout } from '../lib/content.server';

export const meta: MetaFunction = () => [{ title: '关于 - Artea' }, { name: 'description', content: '关于 Artea' }];

export function loader() {
  return getAbout();
}

export default function About() {
  const { body } = useLoaderData<typeof loader>();
  return (
    <div className='max-w-3xl mx-auto px-6 py-12'>
      <nav className='mb-8'>
        <Button tag={RouterLink} to='/' quaternary size='small' icon={<span className='i-tabler-arrow-left' />}>
          返回首页
        </Button>
      </nav>
      <article className='prose max-w-none'>
        <MarkdownContent source={body} />
      </article>
    </div>
  );
}
