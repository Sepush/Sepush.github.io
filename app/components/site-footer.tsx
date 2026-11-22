import { LayoutFooter, Text } from '@pika-lab/react';
import { arteaSocialLinks } from '../config/social';
import { SocialLinks } from './social-links';

export function SiteFooter() {
  return (
    <LayoutFooter as='footer' bordered className='blog-footer'>
      <div className='blog-footer__inner'>
        <Text depth={3} className='blog-footer__copy'>
          © Artea · Built with Pika
        </Text>
        <SocialLinks links={arteaSocialLinks} size='small' />
      </div>
    </LayoutFooter>
  );
}
