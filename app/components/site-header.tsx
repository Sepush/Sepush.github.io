import {
  Avatar,
  Button,
  Drawer,
  DrawerContent,
  LayoutHeader,
  Menu,
  type MenuLinkProps,
  type MenuOption,
} from '@pika-lab/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router';
import { arteaSocialLinks } from '../config/social';
import type { SearchEntry } from '../lib/content.server';
import { BookOpen, Home, Menu as MenuIcon, StickyNote, User, Users } from './icons';
import { RouterLink } from './router-link';
import { SiteSearch } from './site-search';
import { SocialLinks } from './social-links';
import { ThemeToggle } from './theme';

const navItems = [
  { name: '首页', href: '/', icon: <Home aria-hidden='true' size={15} strokeWidth={1.75} /> },
  { name: '文章', href: '/posts', icon: <BookOpen aria-hidden='true' size={15} strokeWidth={1.75} /> },
  { name: '笔记', href: '/notes', icon: <StickyNote aria-hidden='true' size={15} strokeWidth={1.75} /> },
  { name: '友人', href: '/friends', icon: <Users aria-hidden='true' size={15} strokeWidth={1.75} /> },
  { name: '关于', href: '/about', icon: <User aria-hidden='true' size={15} strokeWidth={1.75} /> },
] as const;

function isRouteActive(pathname: string, href: string): boolean {
  return pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));
}

function activeNavKey(pathname: string): string | null {
  const match = navItems.find(item => isRouteActive(pathname, item.href));
  return match?.href ?? null;
}

function renderMenuLink({ href, ...props }: MenuLinkProps) {
  return <RouterLink href={href} {...props} />;
}

export function SiteHeader({ searchEntries }: { searchEntries: SearchEntry[] }) {
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  useEffect(() => {
    closeDrawer();
  }, [closeDrawer, pathname]);

  const menuOptions = useMemo<MenuOption[]>(
    () =>
      navItems.map(item => ({
        key: item.href,
        label: item.name,
        href: item.href,
        icon: item.icon,
      })),
    [],
  );

  const activeKey = activeNavKey(pathname);

  return (
    <LayoutHeader as='header' bordered className='blog-header'>
      <div className='blog-header__inner'>
        <RouterLink href='/' className='blog-brand'>
          <Avatar src='/avatar.svg' alt='Artea' size={26} round bordered />
          <span className='blog-brand__name'>Artea</span>
        </RouterLink>

        <nav aria-label='主导航' className='blog-nav'>
          {navItems.map(item => {
            const current = isRouteActive(pathname, item.href);
            return (
              <RouterLink
                key={item.href}
                href={item.href}
                aria-current={current ? 'page' : undefined}
                className={current ? 'blog-nav__link blog-nav__link--current' : 'blog-nav__link'}
              >
                {item.name}
              </RouterLink>
            );
          })}
        </nav>

        <div className='blog-header__tools'>
          <SiteSearch entries={searchEntries} />
          <ThemeToggle />
          <Button
            attrType='button'
            quaternary
            size='small'
            className='blog-nav__icon-button blog-header__menu-btn'
            aria-label='打开导航菜单'
            aria-expanded={drawerOpen}
            onClick={openDrawer}
            icon={<MenuIcon aria-hidden='true' size={17} strokeWidth={1.75} />}
          />
        </div>
      </div>

      <Drawer placement='right' width={268} show={drawerOpen} onUpdateShow={setDrawerOpen}>
        <DrawerContent closable title='Artea' footer={<SocialLinks links={arteaSocialLinks} size='small' />}>
          <Menu
            aria-label='移动端导航'
            className='blog-drawer-menu'
            options={menuOptions}
            value={activeKey}
            renderLink={renderMenuLink}
          />
        </DrawerContent>
      </Drawer>
    </LayoutHeader>
  );
}
