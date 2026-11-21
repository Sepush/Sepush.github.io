import { Button, LayoutHeader, Link } from '@pika-lab/react';
import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router';
import { ThemeToggle } from './theme';

const navItems = [
  { name: 'Home', href: '/', icon: 'i-tabler-home' },
  { name: 'Posts', href: '/posts', icon: 'i-tabler-article' },
  { name: 'Notes', href: '/notes', icon: 'i-tabler-note' },
  { name: 'About', href: '/about', icon: 'i-tabler-user' },
  { name: 'Friends', href: '/friends', icon: 'i-tabler-users' },
] as const;

function active(pathname: string, href: string): boolean {
  return pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));
}

export function SiteHeader() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 10);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('click', close);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('click', close);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  return (
    <LayoutHeader
      ref={headerRef}
      as='header'
      position='sticky'
      stickyOffset={0}
      className={`w-full backdrop-blur-xl border-b border-white/20 dark:border-gray-700/30 z-50 pointer-events-auto transition-all duration-300 ${
        scrolled ? 'bg-white/70 dark:bg-gray-900/80 shadow-sm' : 'bg-white/25 dark:bg-gray-900/40'
      }`}
    >
      <div className='max-w-6xl mx-auto px-6 py-1.5'>
        <div className='flex items-center justify-between'>
          <Link as={RouterLink} to='/' underline='none' type='neutral' className='font-semibold text-base'>
            Artea
          </Link>
          <div className='flex items-center gap-2'>
            <nav aria-label='主导航' className='hidden md:flex items-center gap-2'>
              {navItems.map(item => (
                <Link
                  key={item.href}
                  as={RouterLink}
                  to={item.href}
                  underline='none'
                  type={active(pathname, item.href) ? 'primary' : 'neutral'}
                  aria-current={active(pathname, item.href) ? 'page' : undefined}
                  className='flex items-center gap-1 px-2 py-1 text-sm rounded-md'
                >
                  <span className={`${item.icon} text-base`} />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
            <div className='hidden md:block w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1' />
            <ThemeToggle />
            <div className='md:hidden'>
              <Button
                attrType='button'
                quaternary
                circle
                size='small'
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                aria-controls='mobile-menu'
                onClick={() => setOpen(value => !value)}
                icon={<span className={`${open ? 'i-tabler-x' : 'i-tabler-menu-2'} text-base`} />}
              />
            </div>
          </div>
        </div>
      </div>
      {open && (
        <div
          id='mobile-menu'
          className='md:hidden bg-white/60 dark:bg-gray-900/80 backdrop-blur-md border-t border-white/20 dark:border-gray-700/30'
        >
          <nav aria-label='移动端导航' className='max-w-6xl mx-auto px-6 py-2 space-y-1'>
            {navItems.map(item => (
              <Link
                key={item.href}
                as={RouterLink}
                to={item.href}
                underline='none'
                type={active(pathname, item.href) ? 'primary' : 'neutral'}
                aria-current={active(pathname, item.href) ? 'page' : undefined}
                className='flex items-center gap-2.5 px-3 py-2 text-sm rounded-md'
              >
                <span className={`${item.icon} text-base`} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </LayoutHeader>
  );
}
