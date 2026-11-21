import { Button, Heading, Paragraph } from '@pika-lab/react';
import { Link as RouterLink, useLoaderData, type LoaderFunctionArgs, type MetaFunction } from 'react-router';
import { MarkdownContent } from '../components/markdown';
import { XShare } from '../components/social-links';
import { TableOfContents } from '../components/table-of-contents';
import { TagGroup } from '../components/tag-group';
import { getPost } from '../lib/content.server';
import { formatDate } from '../lib/format';
import { extractHeadings } from '../lib/headings';

export function loader({ params }: LoaderFunctionArgs) {
  const slug = params['*'];
  const post = slug ? getPost(slug) : undefined;
  if (!post) throw new Response('Post not found', { status: 404 });
  return { post, headings: extractHeadings(post.body) };
}

export const meta: MetaFunction<typeof loader> = ({ loaderData }) => [
  { title: `${loaderData?.post.title ?? '文章'} - Artea` },
  { name: 'description', content: loaderData?.post.description ?? "Artea's blog" },
];

export default function PostPage() {
  const { post, headings } = useLoaderData<typeof loader>();
  const url = `https://sepush.github.io/posts/${post.slug}`;
  return (
    <div className='min-h-screen'>
      <div className='max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-6 xl:pr-20 py-8 sm:py-12'>
        <article className='min-w-0 overflow-hidden'>
          <header className='flex flex-col gap-y-4'>
            <nav>
              <Button
                tag={RouterLink}
                to='/posts'
                quaternary
                circle
                size='small'
                aria-label='返回文章列表'
                icon={<span className='i-tabler-arrow-left text-lg' />}
              />
            </nav>
            <Heading level={1} className='text-2xl sm:text-4xl md:text-5xl leading-tight tracking-tight break-words'>
              {post.title}
            </Heading>
            {post.description && (
              <Paragraph className='text-lg sm:text-xl max-w-3xl' depth={2}>
                {post.description}
              </Paragraph>
            )}
            <div className='flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-500'>
              <div className='flex items-center gap-2'>
                <span className='i-tabler-calendar text-gray-400' />
                <time dateTime={post.pubDate}>{formatDate(post.pubDate)}</time>
              </div>
              {post.updatedDate && <span>更新于 {formatDate(post.updatedDate)}</span>}
            </div>
            <TagGroup tags={post.tags} />
          </header>
          <div className='prose max-w-none min-w-0'>
            <MarkdownContent source={post.body} postSlug={post.slug} />
          </div>
          <footer className='pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <span className='text-sm text-gray-500 dark:text-gray-400'>
              如果觉得这篇文章有点意思，欢迎分享给更多人！
            </span>
            <XShare title={post.title} url={url} />
          </footer>
        </article>
      </div>
      <TableOfContents headings={headings} />
    </div>
  );
}
