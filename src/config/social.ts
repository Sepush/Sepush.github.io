import type { SocialLink } from "../components/social";

interface Friend {
  name: string;
  description?: string;
  socialLinks: SocialLink[];
}

export const arteaSocialLinks: SocialLink[] = [
  {
    platform: "github",
    url: "https://github.com/sepush",
    icon: "i-tabler-brand-github",
  },
  {
    platform: "x",
    url: "https://x.com/Sepush2",
    icon: "i-tabler-brand-x",
  },
  {
    platform: "telegram",
    url: "https://t.me/SepushZhang",
    icon: "i-tabler-brand-telegram",
  },
  {
    platform: "email",
    url: "mailto:sepush@outlook.com",
    icon: "i-tabler-mail",
  },
];

export const friends: Friend[] = [
  {
    name: "Cee",
    description: "前端工程师 擅长数据可视化",
    socialLinks: [
      {
        platform: "github",
        url: "https://github.com/zqqcee",
        icon: "i-tabler-brand-github",
      },
      {
        platform: "website",
        url: "https://luckycc.cc/",
        icon: "i-tabler-link",
      },
      {
        platform: "x",
        url: "https://x.com/zqqcee",
        icon: "i-tabler-brand-x",
      },
    ],
  },
  {
    name: "Hong97",
    description: "前端工程师 喜欢 Coding 做好看的东西",
    socialLinks: [
      {
        platform: "github",
        url: "https://github.com/hongding0211",
        icon: "i-tabler-brand-github",
      },
      {
        platform: "website",
        url: "https://hong97.ltd",
        icon: "i-tabler-link",
      },
    ],
  },
];
