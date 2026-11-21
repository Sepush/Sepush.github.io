import { Button, Tooltip } from '@pika-lab/react';
import type { SocialLink } from '../config/social';

export function SocialLinks({ links, size = 'md' }: { links: SocialLink[]; size?: 'sm' | 'md' }) {
  return (
    <div className={`flex items-center ${size === 'sm' ? 'gap-1' : 'gap-2'}`}>
      {links.map(link => {
        const external = !link.url.startsWith('mailto:');
        return (
          <Tooltip key={`${link.platform}-${link.url}`} content={link.platform}>
            <Button
              tag='a'
              href={link.url}
              target={external ? '_blank' : undefined}
              rel={external ? 'noreferrer' : undefined}
              quaternary
              circle
              size={size === 'sm' ? 'tiny' : 'small'}
              aria-label={link.platform}
              icon={<span className={`${link.icon} ${size === 'sm' ? 'text-sm' : 'text-lg'}`} />}
            />
          </Tooltip>
        );
      })}
    </div>
  );
}

export function XShare({ title, url }: { title: string; url: string }) {
  const href = `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  return (
    <Button
      tag='a'
      href={href}
      target='_blank'
      rel='noreferrer'
      quaternary
      size='small'
      icon={<span className='i-tabler-brand-x' />}
    >
      分享到 X
    </Button>
  );
}
