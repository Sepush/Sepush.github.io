import { Eyebrow, Heading, Paragraph } from '@pika-lab/react';
import type { MetaFunction } from 'react-router';
import { FriendCard } from '../components/friend-card';
import { friends } from '../config/social';

export const meta: MetaFunction = () => [{ title: '友人 - Artea' }, { name: 'description', content: '朋友列表' }];

export default function Friends() {
  return (
    <div className='blog-container blog-container--narrow blog-page'>
      <header className='blog-page-header'>
        <Eyebrow>FRIENDS</Eyebrow>
        <Heading level={1} className='blog-page-header__title'>
          友人
        </Heading>
        <Paragraph depth={2} className='blog-page-header__desc'>
          这里记录着我的朋友们，排名不分先后。
        </Paragraph>
      </header>

      <div className='blog-friends-grid'>
        {friends.map(friend => (
          <FriendCard key={friend.name} friend={friend} />
        ))}
      </div>
    </div>
  );
}
