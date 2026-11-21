import { Button, Card, Heading } from '@pika-lab/react';
import { Link as RouterLink, useLoaderData, type LoaderFunctionArgs, type MetaFunction } from 'react-router';
import { MarkdownContent } from '../components/markdown';
import { TagGroup } from '../components/tag-group';
import { getNote } from '../lib/content.server';
import { formatDate, formatTime } from '../lib/format';

export function loader({ params }: LoaderFunctionArgs) {
  const note = params.slug ? getNote(params.slug) : undefined;
  if (!note) throw new Response('Note not found', { status: 404 });
  return { note };
}

export const meta: MetaFunction<typeof loader> = ({ loaderData }) => [
  { title: `${loaderData?.note.title ?? '笔记'} - Artea` },
  { name: 'description', content: '随笔笔记' },
];

export default function NotePage() {
  const { note } = useLoaderData<typeof loader>();
  return (
    <div className='max-w-4xl mx-auto px-4 py-12'>
      <nav className='mb-12'>
        <Button
          tag={RouterLink}
          to='/notes'
          quaternary
          circle
          size='small'
          aria-label='返回笔记列表'
          icon={<span className='i-tabler-arrow-left text-lg' />}
        />
      </nav>
      <Card tag='article' size='large' className='card-modern overflow-hidden'>
        <header className='mb-6'>
          <Heading level={1} className='text-3xl md:text-4xl mb-6 leading-tight'>
            {note.title}
          </Heading>
          <div className='flex flex-wrap items-center gap-5 text-sm text-gray-600 dark:text-gray-400 mb-6'>
            <time dateTime={note.pubDate}>{formatDate(note.pubDate)}</time>
            {note.mood && <span>{note.mood}</span>}
            {note.location && <span>{note.location}</span>}
            <span>{formatTime(note.pubDate)}</span>
          </div>
          <TagGroup tags={note.tags} showHash />
        </header>
        <div className='prose max-w-none'>
          <MarkdownContent source={note.body} />
        </div>
      </Card>
    </div>
  );
}
