import {
  CommandPalette,
  commandPaletteShortcutKeys,
  Kbd,
  useCommandPaletteShortcut,
  type CommandPaletteGroup,
  type CommandPaletteItem,
  type CommandPaletteSelectEvent,
} from '@pika-lab/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import type { SearchEntry } from '../lib/content.server';
import { formatDate } from '../lib/format';
import { BookOpen, FileText, Home, Search, StickyNote, Sun, User, Users } from './icons';
import { useTheme } from './theme';

const SHORTCUT = 'mod+k';
const THEME_ACTION_KEY = 'action:cycle-theme';

export function SiteSearch({ entries }: { entries: SearchEntry[] }) {
  const navigate = useNavigate();
  const { cycle } = useTheme();
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [keys, setKeys] = useState<string[]>(['Ctrl', 'K']);

  useEffect(() => {
    setKeys(commandPaletteShortcutKeys(SHORTCUT));
  }, []);

  const open = useCallback(() => {
    setMounted(true);
    setShow(true);
  }, []);

  const toggle = useCallback(() => {
    setMounted(true);
    setShow(current => !current);
  }, []);

  useCommandPaletteShortcut(toggle, SHORTCUT);

  const items = useMemo<CommandPaletteGroup[]>(() => {
    const pages: CommandPaletteGroup = {
      type: 'group',
      key: 'pages',
      label: '页面导航',
      children: [
        {
          key: 'page:/',
          label: '首页',
          description: '个人简介与足迹地图',
          href: '/',
          keywords: ['home', 'map', '地图'],
          icon: <Home aria-hidden='true' size={15} strokeWidth={1.75} />,
        },
        {
          key: 'page:/posts',
          label: '文章',
          description: '技术文章、踩坑记录与生活随笔',
          href: '/posts',
          keywords: ['posts', 'blog', 'writing'],
          icon: <BookOpen aria-hidden='true' size={15} strokeWidth={1.75} />,
        },
        {
          key: 'page:/notes',
          label: '笔记',
          description: '简短想法与随手记录',
          href: '/notes',
          keywords: ['notes', 'memo'],
          icon: <StickyNote aria-hidden='true' size={15} strokeWidth={1.75} />,
        },
        {
          key: 'page:/friends',
          label: '友人',
          description: '朋友们的站点与链接',
          href: '/friends',
          keywords: ['friends', 'links', '友链'],
          icon: <Users aria-hidden='true' size={15} strokeWidth={1.75} />,
        },
        {
          key: 'page:/about',
          label: '关于',
          description: '关于 Artea',
          href: '/about',
          keywords: ['about', 'artea', 'sepush'],
          icon: <User aria-hidden='true' size={15} strokeWidth={1.75} />,
        },
      ],
    };

    const posts: CommandPaletteItem[] = entries
      .filter(entry => entry.kind === 'post')
      .map(entry => ({
        key: entry.href,
        label: entry.title,
        description: `${formatDate(entry.pubDate)}${entry.tags.length > 0 ? ` · ${entry.tags.join(' / ')}` : ''}`,
        href: entry.href,
        keywords: [...entry.tags, entry.description],
        icon: <FileText aria-hidden='true' size={15} strokeWidth={1.75} />,
      }));

    const notes: CommandPaletteItem[] = entries
      .filter(entry => entry.kind === 'note')
      .map(entry => ({
        key: entry.href,
        label: entry.title,
        description: `${formatDate(entry.pubDate)}${entry.tags.length > 0 ? ` · ${entry.tags.join(' / ')}` : ''}`,
        href: entry.href,
        keywords: [...entry.tags, entry.description],
        icon: <StickyNote aria-hidden='true' size={15} strokeWidth={1.75} />,
      }));

    const actions: CommandPaletteGroup = {
      type: 'group',
      key: 'actions',
      label: '快捷操作',
      children: [
        {
          key: THEME_ACTION_KEY,
          label: '切换浅色 / 深色 / 跟随系统主题',
          keywords: ['theme', 'dark', 'light', '主题', '暗色', '浅色'],
          icon: <Sun aria-hidden='true' size={15} strokeWidth={1.75} />,
        },
      ],
    };

    const groups: CommandPaletteGroup[] = [];
    if (posts.length > 0) groups.push({ type: 'group', key: 'posts', label: '文章', children: posts });
    if (notes.length > 0) groups.push({ type: 'group', key: 'notes', label: '笔记', children: notes });
    groups.push(pages, actions);
    return groups;
  }, [entries]);

  const handleSelect = useCallback(
    (item: CommandPaletteItem, event: CommandPaletteSelectEvent) => {
      if (item.key === THEME_ACTION_KEY) {
        cycle();
        return;
      }
      if (!item.href) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey) return;
      event.preventDefault();
      void navigate(item.href);
    },
    [cycle, navigate],
  );

  const handleUpdateShow = useCallback((next: boolean) => {
    setShow(next);
    if (!next) setQuery('');
  }, []);

  return (
    <>
      <button
        type='button'
        aria-keyshortcuts='Meta+K Control+K'
        aria-label='搜索文章与页面'
        className='blog-search-trigger'
        onClick={open}
      >
        <Search aria-hidden='true' size={14} strokeWidth={1.75} className='blog-search-trigger__icon' />
        <span className='blog-search-trigger__placeholder'>搜索…</span>
        <Kbd className='blog-search-trigger__kbd' keys={keys} separator='' size='small' />
      </button>
      {mounted ? (
        <CommandPalette
          show={show}
          query={query}
          items={items}
          placeholder='搜索文章、标签或页面…'
          label='站内搜索'
          onSelect={handleSelect}
          onUpdateQuery={setQuery}
          onUpdateShow={handleUpdateShow}
        />
      ) : null}
    </>
  );
}
