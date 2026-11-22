import { Button, Card, Heading, Separator, Tag, Text } from '@pika-lab/react';
import { useLoaderData, type LoaderFunctionArgs, type MetaFunction } from 'react-router';
import { ArrowLeft, Calendar, Clock } from '../components/icons';
import { MarkdownContent } from '../components/markdown';
import { RouterLink } from '../components/router-link';
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
  { name: 'description', content: loaderData?.note.content ?? '随笔笔记' },
];

export default function NotePage() {
  const { note } = useLoaderData<typeof loader>();
  return (
    <div className='blog-container blog-container--narrow blog-page'>
      <nav className='blog-back-nav' aria-label='返回导航'>
        <Button
          tag={RouterLink}
          href='/notes'
          quaternary
          size='small'
          icon={<ArrowLeft aria-hidden='true' size={15} strokeWidth={1.75} />}
        >
          返回笔记
        </Button>
      </nav>

      <Card tag='article' size='large'>
        <header className='blog-article__header'>
          <div className='blog-article__title-row'>
            <Heading level={1} className='blog-article__title'>
              {note.title}
            </Heading>
            {import.meta.env.DEV && note.draft ? (
              <Tag size='small' type='warning'>
                草稿
              </Tag>
            ) : null}
          </div>
          <div className='blog-article__meta'>
            <span className='blog-meta-item'>
              <Calendar aria-hidden='true' size={14} strokeWidth={1.75} />
              <Text as='time' depth={3} className='blog-tabular-num'>
                {formatDate(note.pubDate)}
              </Text>
            </span>
            <span className='blog-meta-item'>
              <Clock aria-hidden='true' size={14} strokeWidth={1.75} />
              <Text depth={3} className='blog-tabular-num'>
                {formatTime(note.pubDate)}
              </Text>
            </span>
            {note.mood ? (
              <Tag size='tiny' type='primary'>
                {note.mood}
              </Tag>
            ) : null}
            {note.location ? <Text depth={3}>{note.location}</Text> : null}
          </div>
          <TagGroup tags={note.tags} showHash size='small' />
        </header>

        <Separator />

        <MarkdownContent source={note.body} />
      </Card>
    </div>
  );
}
