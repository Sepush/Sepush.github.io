import {
  Button,
  Heading,
  PageNav,
  Paragraph,
  Separator,
  Tag,
  Text,
  type PageNavLinkRenderProps,
} from '@pika-lab/react';
import { useLoaderData, type LoaderFunctionArgs, type MetaFunction } from 'react-router';
import { ArrowLeft, Calendar, Clock } from '../components/icons';
import { MarkdownContent } from '../components/markdown';
import { RouterLink } from '../components/router-link';
import { ArticleShare } from '../components/social-links';
import { MobileTableOfContents, TableOfContents } from '../components/table-of-contents';
import { TagGroup } from '../components/tag-group';
import { getPostWithAdjacent } from '../lib/content.server';
import { formatDate } from '../lib/format';
import { extractPostHeadings } from '../lib/markdown';

export function loader({ params }: LoaderFunctionArgs) {
  const slug = params['*'];
  const result = slug ? getPostWithAdjacent(slug) : null;
  if (!result) throw new Response('Post not found', { status: 404 });
  return {
    post: result.post,
    prev: result.prev,
    next: result.next,
    headings: extractPostHeadings(result.post.body, 3),
  };
}

export const meta: MetaFunction<typeof loader> = ({ loaderData }) => [
  { title: `${loaderData?.post.title ?? '文章'} - Artea` },
  { name: 'description', content: loaderData?.post.description ?? loaderData?.post.excerpt ?? "Artea's blog" },
];

function renderPageNavLink({ href, ...props }: PageNavLinkRenderProps) {
  return <RouterLink href={href} {...props} />;
}

export default function PostPage() {
  const { post, prev, next, headings } = useLoaderData<typeof loader>();
  const url = `https://sepush.github.io/posts/${post.slug}`;

  return (
    <div className='blog-container blog-container--narrow blog-page'>
      <article className='blog-article'>
        <nav className='blog-back-nav' aria-label='返回导航'>
          <Button
            tag={RouterLink}
            href='/posts'
            quaternary
            size='small'
            icon={<ArrowLeft aria-hidden='true' size={15} strokeWidth={1.75} />}
          >
            返回文章
          </Button>
        </nav>

        <header className='blog-article__header'>
          <div className='blog-article__title-row'>
            <Heading level={1} className='blog-article__title'>
              {post.title}
            </Heading>
            {import.meta.env.DEV && post.draft ? (
              <Tag size='small' type='warning'>
                草稿
              </Tag>
            ) : null}
          </div>

          {post.description ? (
            <Paragraph depth={2} className='blog-article__lead'>
              {post.description}
            </Paragraph>
          ) : null}

          <div className='blog-article__meta'>
            <span className='blog-meta-item'>
              <Calendar aria-hidden='true' size={14} strokeWidth={1.75} />
              <Text as='time' depth={3} className='blog-tabular-num'>
                {formatDate(post.pubDate)}
              </Text>
            </span>
            {post.updatedDate ? (
              <Text depth={3} className='blog-tabular-num'>
                更新于 {formatDate(post.updatedDate)}
              </Text>
            ) : null}
            <span className='blog-meta-item'>
              <Clock aria-hidden='true' size={14} strokeWidth={1.75} />
              <Text depth={3} className='blog-tabular-num'>
                约 {post.readingMinutes} 分钟阅读
              </Text>
            </span>
          </div>

          <TagGroup tags={post.tags} size='small' />
        </header>

        <MobileTableOfContents headings={headings} />

        <Separator />

        <div className='blog-article__body'>
          <MarkdownContent source={post.body} postSlug={post.slug} />
        </div>

        <Separator />

        {prev || next ? (
          <div className='blog-article__nav'>
            <PageNav prev={prev} next={next} prevLabel='上一篇' nextLabel='下一篇' renderLink={renderPageNavLink} />
          </div>
        ) : null}

        <footer className='blog-article__footer'>
          <Text depth={3}>如果觉得这篇文章有点意思，欢迎分享给更多人。</Text>
          <ArticleShare title={post.title} url={url} />
        </footer>
      </article>

      <TableOfContents headings={headings} />
    </div>
  );
}
