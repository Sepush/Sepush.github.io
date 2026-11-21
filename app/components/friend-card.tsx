import { Card } from '@pika-lab/react';
import { useState } from 'react';
import type { Friend } from '../config/social';
import { SocialLinks } from './social-links';

const colors = [
  'text-amber-600',
  'text-blue-600',
  'text-emerald-600',
  'text-indigo-600',
  'text-rose-600',
  'text-cyan-600',
  'text-violet-600',
  'text-teal-600',
];

function nameColor(name: string): string {
  let hash = 0;
  for (let index = 0; index < name.length; index += 1) hash = name.charCodeAt(index) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length] ?? 'text-emerald-600';
}

export function FriendCard({ friend }: { friend: Friend }) {
  const [failed, setFailed] = useState(false);
  const github = friend.socialLinks.find(link => link.platform === 'github');
  const username = github ? /github\.com\/([^/]+)/.exec(github.url)?.[1] : undefined;
  return (
    <div className='flex gap-0'>
      <div className='flex-shrink-0 self-end z-10'>
        <div className='w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold text-gray-600 dark:text-gray-300 select-none overflow-hidden shadow-sm'>
          {username && !failed ? (
            <img
              src={`https://github.com/${username}.png`}
              alt={friend.name}
              className='w-full h-full object-cover'
              loading='lazy'
              onError={() => setFailed(true)}
            />
          ) : (
            <span>{friend.name.charAt(0).toUpperCase()}</span>
          )}
        </div>
      </div>
      <Card tag='article' size='small' className='flex-1 min-w-0 ml-3' bordered>
        <div className='flex items-start justify-between gap-3 mb-1'>
          <h2 className={`font-semibold text-[15px] ${nameColor(friend.name)}`}>{friend.name}</h2>
          <SocialLinks links={friend.socialLinks} size='sm' />
        </div>
        {friend.description && (
          <p className='text-gray-800 dark:text-gray-300 text-[15px] leading-snug'>{friend.description}</p>
        )}
      </Card>
    </div>
  );
}
