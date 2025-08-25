export const authorSocialLinks = [
  {
    platform: "GitHub",
    url: "https://github.com/sepush",
    icon: "i-tabler-brand-github",
  },
  {
    platform: "Twitter",
    url: "https://x.com/Sepush2",
    icon: "i-tabler-brand-x",
  },
  {
    platform: "Telegram",
    url: "https://t.me/SepushZhang",
    icon: "i-tabler-brand-telegram",
  },
  {
    platform: "Email",
    url: "mailto:sepush@outlook.com",
    icon: "i-tabler-mail",
  },
  {
    platform: "RSS",
    url: "/rss.xml",
    icon: "i-tabler-rss",
  },
];

export const sharePlatforms = {
  twitter: 'twitter',
  facebook: 'facebook',
  linkedin: 'linkedin',
  email: 'email',
} as const;

export type SharePlatform = keyof typeof sharePlatforms;
