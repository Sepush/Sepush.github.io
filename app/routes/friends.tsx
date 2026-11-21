import { Heading } from '@pika-lab/react';
import type { MetaFunction } from 'react-router';
import { FriendCard } from '../components/friend-card';
import { friends } from '../config/social';

export const meta: MetaFunction = () => [{ title: '朋友 - Artea' }, { name: 'description', content: '朋友列表' }];

export default function Friends() {
  return (
    <div className='max-w-2xl mx-auto px-6 py-12'>
      <div className='mb-8'>
        <Heading level={1} className='text-4xl mb-4'>
          友人
        </Heading>
        <p className='text-gray-500 dark:text-gray-400'>这里记录着我的朋友们，排名不分先后</p>
      </div>
      <div className='space-y-3'>
        {friends.map(friend => (
          <FriendCard key={friend.name} friend={friend} />
        ))}
      </div>
    </div>
  );
}
