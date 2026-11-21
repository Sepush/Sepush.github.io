import { Card, Link } from '@pika-lab/react';
import { Link as RouterLink, useLoaderData, type MetaFunction } from 'react-router';
import { EmptyState } from '../components/empty-state';
import { TagGroup } from '../components/tag-group';
import { getNotes } from '../lib/content.server';
import { formatDate } from '../lib/format';

export const meta: MetaFunction = () => [{ title: '笔记 - Artea' }, { name: 'description', content: '笔记列表' }];

export function loader() {
  return { notes: getNotes() };
}

export default function Notes() {
  const { notes } = useLoaderData<typeof loader>();
  return (
    <div className='max-w-4xl mx-auto px-6 py-12'>
      {notes.length === 0 ? (
        <EmptyState />
      ) : (
        <div className='space-y-6'>
          {notes.map(note => (
            <Card key={note.slug} tag='article' size='small' hoverable>
              <h2 className='text-xl font-semibold mb-3'>
                <Link as={RouterLink} to={`/notes/${note.slug}`} underline='none' type='neutral'>
                  {note.title}
                </Link>
              </h2>
              {note.content && (
                <p className='text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2'>{note.content}</p>
              )}
              <div className='flex flex-wrap items-center justify-between gap-3 text-sm pt-4'>
                <div className='flex flex-wrap items-center gap-3'>
                  <TagGroup tags={note.tags} />
                  {note.mood && <span className='text-xs text-gray-500'>{note.mood}</span>}
                  <time dateTime={note.pubDate} className='text-gray-500'>
                    {formatDate(note.pubDate)}
                  </time>
                </div>
                <Link
                  as={RouterLink}
                  to={`/notes/${note.slug}`}
                  underline='none'
                  className='inline-flex items-center gap-1 text-sm'
                >
                  阅读笔记
                  <span className='i-tabler-arrow-right text-xs' />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
