import type { MetaFunction } from 'react-router';
import { SocialLinks } from '../components/social-links';
import { arteaSocialLinks } from '../config/social';

export const meta: MetaFunction = () => [{ title: 'Artea' }, { name: 'description', content: "Artea's blog" }];

export default function Home() {
  return (
    <div className='relative z-10 px-8 md:px-12 min-h-[calc(100vh-4rem)] flex flex-col items-end justify-end pb-12 md:pb-16 gap-4 pointer-events-none'>
      <img src='/avatar.svg' alt='Artea Avatar' className='w-24 h-24 rounded-full ring-4 ring-white/80 shadow-float' />
      <h1 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight'>Hi, I'm Artea</h1>
      <div className='rounded-full bg-white/45 dark:bg-gray-900/50 backdrop-blur-md border border-white/35 dark:border-gray-700/40 shadow-elegant px-4 py-2 pointer-events-auto'>
        <SocialLinks links={arteaSocialLinks} />
      </div>
    </div>
  );
}
