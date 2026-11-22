import { Card, Eyebrow, Heading, Link, Paragraph, Tag, Text } from '@pika-lab/react';
import { useMemo, useState } from 'react';
import { useLoaderData, type MetaFunction } from 'react-router';
import { EmptyState } from '../components/empty-state';
import { ArrowRight, BookOpen } from '../components/icons';
import { TagGroup } from '../components/tag-group';
import { getPostSummaries, type PostSummary } from '../lib/content.server';
import { formatMonthDay, getYear } from '../lib/format';

export const meta: MetaFunction = () => [{ title: '文章 - Artea' }, { name: 'description', content: '文章列表' }];

export function loader() {
  return { posts: getPostSummaries() };
}

function groupByYear(posts: PostSummary[]): Array<{ year: number; items: PostSummary[] }> {
  const map = new Map<number, PostSummary[]>();
  for (const post of posts) {
    const year = getYear(post.pubDate);
    const list = map.get(year);
    if (list) list.push(post);
    else map.set(year, [post]);
  }
  return Array.from(map.entries()).map(([year, items]) => ({ year, items }));
}

export default function Posts() {
  const { posts } = useLoaderData<typeof loader>();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) {
      for (const tag of post.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [posts]);

  const filteredPosts = useMemo(
    () => (selectedTag ? posts.filter(post => post.tags.includes(selectedTag)) : posts),
    [posts, selectedTag],
  );

  const groups = useMemo(() => groupByYear(filteredPosts), [filteredPosts]);

  return (
    <div className='blog-container blog-container--narrow blog-page'>
      <header className='blog-page-header'>
        <Eyebrow>WRITING</Eyebrow>
        <div className='blog-page-header__row'>
          <Heading level={1} className='blog-page-header__title'>
            文章
          </Heading>
          <Text depth={3} className='blog-tabular-num'>
            共 {filteredPosts.length} 篇
          </Text>
        </div>
        <Paragraph depth={2} className='blog-page-header__desc'>
          记录前端工程、组件设计、踩坑实录与阶段性思考。
        </Paragraph>
      </header>

      {tagCounts.length > 0 ? (
        <div className='blog-filter-bar' role='group' aria-label='按标签筛选文章'>
          <Tag
            checkable
            round
            size='small'
            checked={selectedTag === null}
            onCheckedChange={checked => {
              if (checked) setSelectedTag(null);
            }}
          >
            全部 ({posts.length})
          </Tag>
          {tagCounts.map(([tag, count]) => (
            <Tag
              key={tag}
              checkable
              round
              size='small'
              checked={selectedTag === tag}
              onCheckedChange={checked => setSelectedTag(checked ? tag : null)}
            >
              {tag} ({count})
            </Tag>
          ))}
        </div>
      ) : null}

      {filteredPosts.length === 0 ? (
        <EmptyState
          title='暂无文章'
          description='当前筛选下还没有文章，试试切换其他标签或先看看别的页面。'
          icon={<BookOpen aria-hidden='true' size={32} strokeWidth={1.5} />}
          actionLabel='返回首页'
          actionHref='/'
        />
      ) : (
        <div className='blog-archive'>
          {groups.map(group => (
            <section key={group.year} className='blog-archive__group' aria-label={`${group.year} 年文章`}>
              <Eyebrow as='h2' mono className='blog-archive__year'>
                {group.year}
              </Eyebrow>
              <div className='blog-archive__list'>
                {group.items.map(post => (
                  <Card key={post.slug} tag='article' size='medium' hoverable className='blog-post-card'>
                    <div className='blog-post-card__body'>
                      <div className='blog-post-card__head'>
                        <Heading level={3} className='blog-post-card__title'>
                          <Link href={`/posts/${post.slug}`} type='neutral' underline='none'>
                            {post.title}
                          </Link>
                        </Heading>
                        {import.meta.env.DEV && post.draft ? (
                          <Tag size='tiny' type='warning'>
                            草稿
                          </Tag>
                        ) : null}
                      </div>

                      {post.excerpt ? (
                        <Paragraph depth={2} className='blog-post-card__excerpt'>
                          {post.excerpt}
                        </Paragraph>
                      ) : null}

                      <div className='blog-post-card__footer'>
                        <div className='blog-post-card__meta'>
                          <Text as='time' depth={3} className='blog-tabular-num'>
                            {group.year}-{formatMonthDay(post.pubDate)}
                          </Text>
                          <Text depth={3} aria-hidden='true'>
                            ·
                          </Text>
                          <Text depth={3} className='blog-tabular-num'>
                            约 {post.readingMinutes} 分钟
                          </Text>
                          <TagGroup tags={post.tags} />
                        </div>
                        <Link href={`/posts/${post.slug}`} underline='none' className='blog-post-card__read'>
                          <span>阅读</span>
                          <ArrowRight aria-hidden='true' size={13} strokeWidth={1.75} />
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
