import { Avatar, Card, Eyebrow, Heading, Separator, Text } from '@pika-lab/react';
import { useLoaderData, type MetaFunction } from 'react-router';
import { MarkdownContent } from '../components/markdown';
import { SocialLinks } from '../components/social-links';
import { arteaSocialLinks } from '../config/social';
import { getAbout } from '../lib/content.server';

export const meta: MetaFunction = () => [{ title: '关于 - Artea' }, { name: 'description', content: '关于 Artea' }];

export function loader() {
  return getAbout();
}

export default function About() {
  const { body } = useLoaderData<typeof loader>();
  return (
    <div className='blog-container blog-container--narrow blog-page'>
      <header className='blog-page-header'>
        <Eyebrow>ABOUT</Eyebrow>
        <div className='blog-about-profile'>
          <Avatar src='/avatar.svg' alt='Artea' size={56} round bordered />
          <div className='blog-about-profile__info'>
            <Heading level={1} className='blog-about-profile__name'>
              Artea
            </Heading>
            <Text depth={3}>@Sepush · Frontend Developer</Text>
          </div>
          <SocialLinks links={arteaSocialLinks} />
        </div>
      </header>

      <Card tag='article' size='large'>
        <MarkdownContent source={body} />
        <Separator />
        <Text depth={3}>欢迎通过上方社交链接随时交流技术或闲聊。</Text>
      </Card>
    </div>
  );
}
