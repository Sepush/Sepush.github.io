import { Card, Eyebrow, Heading, Link, Paragraph, Tag, Text, Timeline, TimelineItem } from '@pika-lab/react';
import { useLoaderData, type MetaFunction } from 'react-router';
import { EmptyState } from '../components/empty-state';
import { ArrowRight } from '../components/icons';
import { TagGroup } from '../components/tag-group';
import { getNoteSummaries } from '../lib/content.server';
import { formatDate, formatTime } from '../lib/format';

export const meta: MetaFunction = () => [{ title: '笔记 - Artea' }, { name: 'description', content: '笔记列表' }];

export function loader() {
  return { notes: getNoteSummaries() };
}

export default function Notes() {
  const { notes } = useLoaderData<typeof loader>();

  return (
    <div className='blog-container blog-container--narrow blog-page'>
      <header className='blog-page-header'>
        <Eyebrow>NOTES</Eyebrow>
        <div className='blog-page-header__row'>
          <Heading level={1} className='blog-page-header__title'>
            笔记
          </Heading>
          {notes.length > 0 ? (
            <Text depth={3} className='blog-tabular-num'>
              共 {notes.length} 条
            </Text>
          ) : null}
        </div>
        <Paragraph depth={2} className='blog-page-header__desc'>
          简短想法、片段记录与不成文的日常备忘。
        </Paragraph>
      </header>

      {notes.length === 0 ? (
        <EmptyState />
      ) : (
        <Timeline>
          {notes.map(note => (
            <TimelineItem key={note.slug} time={`${formatDate(note.pubDate)} ${formatTime(note.pubDate)}`}>
              <Card tag='article' size='small' hoverable className='blog-note-card'>
                <div className='blog-post-card__body'>
                  <div className='blog-post-card__head'>
                    <Heading level={3} className='blog-post-card__title'>
                      <Link href={`/notes/${note.slug}`} type='neutral' underline='none'>
                        {note.title}
                      </Link>
                    </Heading>
                    {import.meta.env.DEV && note.draft ? (
                      <Tag size='tiny' type='warning'>
                        草稿
                      </Tag>
                    ) : null}
                  </div>
                  {note.excerpt ? (
                    <Paragraph depth={2} className='blog-post-card__excerpt'>
                      {note.excerpt}
                    </Paragraph>
                  ) : null}
                  <div className='blog-post-card__footer'>
                    <div className='blog-post-card__meta'>
                      {note.mood ? (
                        <Tag size='tiny' type='primary'>
                          {note.mood}
                        </Tag>
                      ) : null}
                      {note.location ? <Text depth={3}>{note.location}</Text> : null}
                      <TagGroup tags={note.tags} showHash />
                    </div>
                    <Link href={`/notes/${note.slug}`} underline='none' className='blog-post-card__read'>
                      <span>查看</span>
                      <ArrowRight aria-hidden='true' size={13} strokeWidth={1.75} />
                    </Link>
                  </div>
                </div>
              </Card>
            </TimelineItem>
          ))}
        </Timeline>
      )}
    </div>
  );
}
