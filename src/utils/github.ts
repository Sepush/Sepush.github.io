import type { SocialLink } from '../components/social/interface';

export function getGithubUsername(socialLinks: SocialLink[]): string | null {
  const githubLink = socialLinks.find(link => link.platform === 'github');
  if (!githubLink) return null;

  const match = githubLink.url.match(/github\.com\/([^/]+)/);
  if (!match) return null;

  return match[1];
}

export function getGithubAvatar(username: string): string {
  return `https://github.com/${username}.png`;
}
