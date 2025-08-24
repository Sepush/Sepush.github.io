// 网站作者的社交链接配置
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

// 社交分享平台配置
export const sharePlatforms = {
  twitter: 'twitter',
  facebook: 'facebook',
  linkedin: 'linkedin',
  email: 'email',
} as const;

export type SharePlatform = keyof typeof sharePlatforms;
