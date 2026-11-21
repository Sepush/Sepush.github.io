import { Button, Tooltip } from '@pika-lab/react';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeValue {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  cycle: () => void;
}

const STORAGE_KEY = 'artea-theme';
const ThemeContext = createContext<ThemeValue>({ preference: 'system', resolved: 'light', cycle: () => undefined });

function systemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function storedPreference(): ThemePreference {
  const value = localStorage.getItem(STORAGE_KEY);
  return value === 'light' || value === 'dark' ? value : 'system';
}

function applyDocumentTheme(theme: ResolvedTheme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.dispatchEvent(new CustomEvent('artea-theme-change', { detail: { theme } }));
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<ThemePreference>('system');
  const [resolved, setResolved] = useState<ResolvedTheme>('light');

  useEffect(() => {
    const update = () => {
      const nextPreference = storedPreference();
      const nextResolved = nextPreference === 'system' ? systemTheme() : nextPreference;
      setPreference(nextPreference);
      setResolved(nextResolved);
      applyDocumentTheme(nextResolved);
    };
    update();
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const cycle = () => {
    const next = preference === 'light' ? 'dark' : preference === 'dark' ? 'system' : 'light';
    const root = document.documentElement;
    root.classList.add('is-transitioning');
    window.requestAnimationFrame(() => {
      if (next === 'system') localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, next);
      const nextResolved = next === 'system' ? systemTheme() : next;
      setPreference(next);
      setResolved(nextResolved);
      applyDocumentTheme(nextResolved);
      window.setTimeout(() => root.classList.remove('is-transitioning'), 220);
    });
  };

  return <ThemeContext.Provider value={{ preference, resolved, cycle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

const icons = {
  light: 'i-tabler-sun',
  dark: 'i-tabler-moon',
  system: 'i-tabler-device-desktop',
} as const;

const labels = {
  light: '浅色模式',
  dark: '深色模式',
  system: '跟随系统',
} as const;

export function ThemeToggle() {
  const { preference, cycle } = useTheme();
  return (
    <Tooltip content={`当前：${labels[preference]}（点击切换）`}>
      <Button
        attrType='button'
        quaternary
        circle
        size='small'
        aria-label={`切换主题，当前${labels[preference]}`}
        onClick={cycle}
        icon={<span className={`${icons[preference]} text-lg`} />}
      />
    </Tooltip>
  );
}
