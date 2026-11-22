import type { AnchorHTMLAttributes, Ref } from 'react';
import { Link } from 'react-router';

export type RouterLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href?: string;
  to?: string;
  ref?: Ref<HTMLAnchorElement>;
};

function isExternal(destination: string): boolean {
  return /^[a-z][a-z\d+.-]*:/i.test(destination) || destination.startsWith('//') || destination.startsWith('#');
}

/**
 * Router adapter for Pika components (`ConfigProvider` `componentOptions.Link.as`,
 * `Button` `tag`, `Menu` `renderLink`, and `PageNav` `renderLink`).
 */
export function RouterLink({ href, to, ...props }: RouterLinkProps) {
  const destination = to ?? href ?? '';
  if (!destination || isExternal(destination)) {
    return <a href={destination || undefined} {...props} />;
  }
  return <Link prefetch='intent' to={destination} {...props} />;
}
