import { Avatar, Card, Heading, Paragraph } from '@pika-lab/react';
import type { Friend } from '../config/social';
import { SocialLinks } from './social-links';

function githubUsername(friend: Friend): string | undefined {
  const github = friend.socialLinks.find(link => link.platform === 'github');
  return github ? /github\.com\/([^/]+)/.exec(github.url)?.[1] : undefined;
}

export function FriendCard({ friend }: { friend: Friend }) {
  const username = githubUsername(friend);
  return (
    <Card tag='article' size='medium' hoverable className='blog-friend-card'>
      <div className='blog-friend-card__row'>
        <Avatar
          src={username ? `https://github.com/${username}.png?size=96` : undefined}
          alt={friend.name}
          size={44}
          round
          bordered
          lazy
        >
          {friend.name.slice(0, 2).toUpperCase()}
        </Avatar>
        <div className='blog-friend-card__body'>
          <div className='blog-friend-card__head'>
            <Heading level={4} className='blog-friend-card__name'>
              {friend.name}
            </Heading>
            <SocialLinks links={friend.socialLinks} size='small' />
          </div>
          {friend.description ? (
            <Paragraph depth={2} className='blog-friend-card__desc'>
              {friend.description}
            </Paragraph>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
