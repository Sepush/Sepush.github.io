import { Card, Link } from '@pika-lab/react';
import { Link as RouterLink, useLoaderData, type MetaFunction } from 'react-router';
import { EmptyState } from '../components/empty-state';
import { TagGroup } from '../components/tag-group';
import { getPosts } from '../lib/content.server';
import { formatDate } from '../lib/format';

export const meta: MetaFunction = () => [{ title: '文章 - Artea' }, { name: 'description', content: '文章列表' }];

export function loader() {
  return { posts: getPosts() };
}

export default function Posts() {
  const { posts } = useLoaderData<typeof loader>();
  return (
    <div className='max-w-4xl mx-auto px-6 py-12'>
      {posts.length === 0 ? (
        <EmptyState
          title='暂无文章'
          description='文章正在创作中～敬请期待精彩内容，或者先看看其他页面吧！'
          icon='i-tabler-article'
        />
      ) : (
        <div className='space-y-6'>
          {posts.map(post => (
            <Card key={post.slug} tag='article' size='small' hoverable className='group' bordered={false}>
              <div className='flex flex-col gap-3'>
                <h2 className='text-xl font-semibold'>
                  <Link
                    as={RouterLink}
                    to={`/posts/${post.slug}`}
                    underline='none'
                    type='neutral'
                    className='flex items-center gap-2'
                  >
                    <span>{post.title}</span>
                    {import.meta.env.DEV && post.draft && (
                      <span className='text-xs text-orange-700 dark:text-orange-300'>草稿</span>
                    )}
                  </Link>
                </h2>
                {post.description && (
                  <p className='text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2'>{post.description}</p>
                )}
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 text-sm pt-2'>
                  <div className='flex flex-wrap items-center gap-2 sm:gap-3'>
                    <TagGroup tags={post.tags} />
                    <time dateTime={post.pubDate} className='text-gray-500 dark:text-gray-500 flex-shrink-0 order-last'>
                      {formatDate(post.pubDate)}
                    </time>
                  </div>
                  <Link
                    as={RouterLink}
                    to={`/posts/${post.slug}`}
                    underline='none'
                    className='inline-flex items-center gap-1 text-sm font-medium'
                  >
                    <span>阅读文章</span>
                    <span className='i-tabler-arrow-right text-xs' />
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
