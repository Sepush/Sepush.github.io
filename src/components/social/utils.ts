import type { ShareConfig, SharePlatform } from './interface';

export function createShareUrl(
  platform: SharePlatform,
  title: string,
  url: string,
): string {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const shareConfig: ShareConfig = {
    x: `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
  };

  return shareConfig[platform] || shareConfig.x!;
}
