export type SocialPlatform = 'github' | 'x' | 'telegram' | 'email' | 'website';

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  url: string;
}

export interface Friend {
  name: string;
  description?: string;
  socialLinks: SocialLink[];
}

export const arteaSocialLinks: SocialLink[] = [
  { platform: 'github', label: 'GitHub', url: 'https://github.com/sepush' },
  { platform: 'x', label: 'X', url: 'https://x.com/Artea4096' },
  { platform: 'telegram', label: 'Telegram', url: 'https://t.me/Artea4096' },
  { platform: 'email', label: 'Email', url: 'mailto:sepush@outlook.com' },
];

export const friends: Friend[] = [
  {
    name: 'Cee',
    description: '前端工程师 擅长数据可视化',
    socialLinks: [
      { platform: 'github', label: 'GitHub', url: 'https://github.com/zqqcee' },
      { platform: 'website', label: 'Website', url: 'https://luckycc.cc/' },
      { platform: 'x', label: 'X', url: 'https://x.com/zqqcee' },
    ],
  },
  {
    name: 'Hong97',
    description: '前端工程师 喜欢 Coding 做好看的东西',
    socialLinks: [
      { platform: 'github', label: 'GitHub', url: 'https://github.com/hongding0211' },
      { platform: 'website', label: 'Website', url: 'https://hong97.ltd' },
    ],
  },
  {
    name: 'SoonIter',
    description: 'Hello world! Today I will make you even better.',
    socialLinks: [
      { platform: 'website', label: 'Website', url: 'https://sooniter.site/' },
      { platform: 'github', label: 'GitHub', url: 'https://github.com/sooniter' },
      { platform: 'x', label: 'X', url: 'https://twitter.com/Soon_Iter' },
    ],
  },
  {
    name: 'SkyWT',
    description: 'Passionate software designer & engineer. Big Tech employee by day, freelance developer by night.',
    socialLinks: [
      { platform: 'website', label: 'Website', url: 'https://skywt.net/' },
      { platform: 'github', label: 'GitHub', url: 'https://github.com/Skywt2003' },
      { platform: 'x', label: 'X', url: 'https://x.com/skywt2003' },
      { platform: 'telegram', label: 'Telegram', url: 'https://t.me/skywt2003' },
      { platform: 'email', label: 'Email', url: 'mailto:me@skywt.cn' },
    ],
  },
  {
    name: 'Cyan',
    description: 'A random guy on the internet, and a software engineer.',
    socialLinks: [
      { platform: 'website', label: 'Website', url: 'https://cyandev.app/' },
      { platform: 'github', label: 'GitHub', url: 'https://github.com/unixzii' },
      { platform: 'x', label: 'X', url: 'https://twitter.com/unixzii' },
    ],
  },
];
