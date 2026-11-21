import { Blockquote, Code, Heading, Link, List, ListItem, Paragraph, Separator, Table } from '@pika-lab/react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import { Link as RouterLink } from 'react-router';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

const postAssets = import.meta.glob('/src/content/posts/**/*.{png,jpg,jpeg,webp,gif,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

function MarkdownLink({ href, children, type: _type, color: _color, ...props }: ComponentPropsWithoutRef<'a'>) {
  if (href?.startsWith('/')) {
    return (
      <Link as={RouterLink} to={href} underline='hover' {...props}>
        {children}
      </Link>
    );
  }
  const external = href?.startsWith('http');
  return (
    <Link href={href} underline='hover' target={external ? '_blank' : undefined} {...props}>
      {children}
    </Link>
  );
}

function heading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  return function MarkdownHeading({
    children,
    node: _node,
    prefix: _prefix,
    ...props
  }: ComponentPropsWithoutRef<'h2'> & { node?: unknown }) {
    return (
      <Heading level={level} {...props}>
        {children}
      </Heading>
    );
  };
}

function createComponents(postSlug?: string): Components {
  return {
    h1: heading(1),
    h2: heading(2),
    h3: heading(3),
    h4: heading(4),
    h5: heading(5),
    h6: heading(6),
    p({ node: _node, ...props }) {
      return <Paragraph {...props} />;
    },
    a({ node: _node, ...props }) {
      return <MarkdownLink {...props} />;
    },
    blockquote({ node: _node, ...props }) {
      return <Blockquote {...props} />;
    },
    ul({ node: _node, ...props }) {
      return <List ordered={false} {...props} />;
    },
    ol({ node: _node, ...props }) {
      return <List ordered {...props} />;
    },
    li({ node: _node, ...props }) {
      return <ListItem {...props} />;
    },
    hr({ node: _node, ...props }) {
      return <Separator {...props} />;
    },
    table({ node: _node, ...props }) {
      return <Table bordered singleLine {...props} />;
    },
    pre({ node: _node, children }) {
      return <>{children}</>;
    },
    code({ node: _node, className, children, ...props }) {
      const language = /language-([\w-]+)/.exec(className ?? '')?.[1];
      const source = (typeof children === 'string' || typeof children === 'number' ? String(children) : '').replace(
        /\n$/,
        '',
      );
      return language ? (
        <Code className={className} code={source} language={language} copyable showLineNumbers {...props} />
      ) : (
        <code className={`p-code p-code--inline ${className ?? ''}`} {...props}>
          {source}
        </code>
      );
    },
    img({ node: _node, src, alt, ...props }) {
      const source = String(src ?? '');
      const assetBase = postSlug?.split('/').slice(0, -1).join('/');
      const key = assetBase && source.startsWith('./') ? `/src/content/posts/${assetBase}/${source.slice(2)}` : null;
      const resolved = key ? postAssets[key] : source;
      if (!resolved) throw new Error(`Unresolved Markdown image: ${source} in ${postSlug ?? 'about'}`);
      return <img src={resolved} alt={alt ?? ''} loading='lazy' {...props} />;
    },
  };
}

export function MarkdownContent({ source, postSlug }: { source: string; postSlug?: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeRaw, rehypeKatex, rehypeSlug]}
      components={createComponents(postSlug)}
    >
      {source}
    </ReactMarkdown>
  );
}

export function MarkdownWrapper({ children }: { children: ReactNode }) {
  return <div className='prose max-w-none min-w-0'>{children}</div>;
}
