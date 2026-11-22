import { Button, CopyButton, Tooltip } from '@pika-lab/react';
import type { SocialLink } from '../config/social';
import { renderSocialIcon, XIcon } from './icons';

export function SocialLinks({ links, size = 'medium' }: { links: SocialLink[]; size?: 'small' | 'medium' }) {
  const iconSize = size === 'small' ? 14 : 16;
  const buttonSize = size === 'small' ? 'tiny' : 'small';
  return (
    <div className={`blog-social-links blog-social-links--${size}`}>
      {links.map(link => {
        const external = !link.url.startsWith('mailto:');
        return (
          <Tooltip key={`${link.platform}-${link.url}`} content={link.label}>
            <Button
              tag='a'
              href={link.url}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              quaternary
              circle
              size={buttonSize}
              aria-label={link.label}
              icon={renderSocialIcon(link.platform, iconSize)}
            />
          </Tooltip>
        );
      })}
    </div>
  );
}

export function ArticleShare({ title, url }: { title: string; url: string }) {
  const xHref = `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  return (
    <div className='blog-article-share'>
      <Tooltip content='复制文章链接'>
        <CopyButton size='small' text={url} />
      </Tooltip>
      <Button
        tag='a'
        href={xHref}
        target='_blank'
        rel='noopener noreferrer'
        quaternary
        size='small'
        icon={<XIcon size={14} />}
      >
        分享到 X
      </Button>
    </div>
  );
}
