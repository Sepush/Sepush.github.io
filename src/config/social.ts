import type { SocialLink } from '../components/social';

interface Friend {
  name: string;
  description?: string;
  socialLinks: SocialLink[];
}

export const arteaSocialLinks: SocialLink[] = [
  {
    platform: 'github',
    url: 'https://github.com/sepush',
    icon: 'i-tabler-brand-github',
  },
  {
    platform: 'x',
    url: 'https://x.com/Artea4096',
    icon: 'i-tabler-brand-x',
  },
  {
    platform: 'telegram',
    url: 'https://t.me/Artea4096',
    icon: 'i-tabler-brand-telegram',
  },
  {
    platform: 'email',
    url: 'mailto:sepush@outlook.com',
    icon: 'i-tabler-mail',
  },
];

export const friends: Friend[] = [
  {
    name: 'Cee',
    description: '前端工程师 擅长数据可视化',
    socialLinks: [
      {
        platform: 'github',
        url: 'https://github.com/zqqcee',
        icon: 'i-tabler-brand-github',
      },
      {
        platform: 'website',
        url: 'https://luckycc.cc/',
        icon: 'i-tabler-link',
      },
      {
        platform: 'x',
        url: 'https://x.com/zqqcee',
        icon: 'i-tabler-brand-x',
      },
    ],
  },
  {
    name: 'Hong97',
    description: '前端工程师 喜欢 Coding 做好看的东西',
    socialLinks: [
      {
        platform: 'github',
        url: 'https://github.com/hongding0211',
        icon: 'i-tabler-brand-github',
      },
      {
        platform: 'website',
        url: 'https://hong97.ltd',
        icon: 'i-tabler-link',
      },
    ],
  },
  {
    name: 'SoonIter',
    description: 'Hello world! Today I will make you even better.',
    socialLinks: [
      {
        platform: 'website',
        url: 'https://sooniter.site/',
        icon: 'i-tabler-link',
      },
      {
        platform: 'github',
        url: 'https://github.com/sooniter',
        icon: 'i-tabler-brand-github',
      },
      {
        platform: 'x',
        url: 'https://twitter.com/Soon_Iter',
        icon: 'i-tabler-brand-x',
      },
    ],
  },
  {
    name: 'SkyWT',
    description: 'Passionate software designer & engineer. Big Tech employee by day, freelance developer by night.',
    socialLinks: [
      {
        platform: 'website',
        url: 'https://skywt.net/',
        icon: 'i-tabler-link',
      },
      {
        platform: 'github',
        url: 'https://github.com/Skywt2003',
        icon: 'i-tabler-brand-github',
      },
      {
        platform: 'x',
        url: 'https://x.com/skywt2003',
        icon: 'i-tabler-brand-x',
      },
      {
        platform: 'telegram',
        url: 'https://t.me/skywt2003',
        icon: 'i-tabler-brand-telegram',
      },
      {
        platform: 'email',
        url: 'mailto:me@skywt.cn',
        icon: 'i-tabler-mail',
      },
    ],
  },
  {
    name: 'Cyan',
    description: 'A random guy on the internet, and a software engineer.',
    socialLinks: [
      {
        platform: 'website',
        url: 'https://cyandev.app/',
        icon: 'i-tabler-link',
      },
      {
        platform: 'github',
        url: 'https://github.com/unixzii',
        icon: 'i-tabler-brand-github',
      },
      {
        platform: 'x',
        url: 'https://twitter.com/unixzii',
        icon: 'i-tabler-brand-x',
      },
    ],
  },
];
