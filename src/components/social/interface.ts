export type SocialPlatform = 'x' | 'telegram' | 'linkedin' | 'email'|'github'|'rss';

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  icon: string;
}

export interface ShareLink extends SocialLink {
  color: string;
}

export type ShareConfig = Partial<Record<SocialPlatform, string>>;

export type PlatformConfig = Partial<Record<SocialPlatform, Omit<ShareLink, "url">>>;