import type { ShareConfig, SocialPlatform } from "./interface";

export function createShareUrl(
  platform: SocialPlatform,
  title: string,
  url: string
): string {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const shareConfig: ShareConfig = {
    x: `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
  };

  return shareConfig[platform] || shareConfig.x!;
};