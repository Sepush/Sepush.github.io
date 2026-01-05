export type SocialPlatform = 'x' | 'telegram' | 'linkedin' | 'email' | 'github' | 'blog' | 'website';
export type SharePlatform = 'x' | 'telegram' | 'linkedin' | 'email';

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  icon: string;
}

export interface ShareLink extends Omit<SocialLink, 'platform'> {
  platform: SharePlatform;
  color: string;
}

export type ShareConfig = Partial<Record<SharePlatform, string>>;

export type PlatformConfig = Partial<Record<SharePlatform, Omit<ShareLink, 'url'>>>;
