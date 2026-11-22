import { Button, Tooltip, type ThemeMode } from '@pika-lab/react';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { Monitor, Moon, Sun } from './icons';

export type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  preference: ThemePreference;
  resolved: ThemeMode;
  hydrated: boolean;
  cycle: () => void;
}

const STORAGE_KEY = 'artea-theme';

/**
 * Runs synchronously in `<head>` before first paint so Pika tokens (`data-p-theme-mode`)
 * and native form/scrollbar colors match the stored preference without flashing.
 */
export const THEME_BOOTSTRAP_SCRIPT = `(function(){try{var s=localStorage.getItem('${STORAGE_KEY}');var pref=s==='light'||s==='dark'?s:'system';var mode=pref==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):pref;var root=document.documentElement;root.dataset.pThemeMode=mode;root.dataset.blogThemePref=pref;root.classList.toggle('dark',mode==='dark');root.style.colorScheme=mode}catch(e){}})();`;

const ThemeContext = createContext<ThemeContextValue>({
  preference: 'system',
  resolved: 'light',
  hydrated: false,
  cycle: () => undefined,
});

function getSystemTheme(): ThemeMode {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function readStoredPreference(): ThemePreference {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : 'system';
  } catch {
    return 'system';
  }
}

function applyDocumentTheme(preference: ThemePreference, mode: ThemeMode) {
  const root = document.documentElement;
  root.dataset.pThemeMode = mode;
  root.dataset.blogThemePref = preference;
  root.classList.toggle('dark', mode === 'dark');
  root.style.colorScheme = mode;
  document.dispatchEvent(new CustomEvent('artea-theme-change', { detail: { theme: mode, preference } }));
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<ThemePreference>('system');
  const [resolved, setResolved] = useState<ThemeMode>('light');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sync = () => {
      const nextPreference = readStoredPreference();
      const nextResolved = nextPreference === 'system' ? getSystemTheme() : nextPreference;
      setPreference(nextPreference);
      setResolved(nextResolved);
      setHydrated(true);
      applyDocumentTheme(nextPreference, nextResolved);
    };
    sync();
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  const cycle = useCallback(() => {
    const nextPreference: ThemePreference =
      preference === 'light' ? 'dark' : preference === 'dark' ? 'system' : 'light';
    try {
      if (nextPreference === 'system') window.localStorage.removeItem(STORAGE_KEY);
      else window.localStorage.setItem(STORAGE_KEY, nextPreference);
    } catch {
      // Theme still applies for the active session when storage is unavailable.
    }
    const nextResolved = nextPreference === 'system' ? getSystemTheme() : nextPreference;
    setPreference(nextPreference);
    setResolved(nextResolved);
    applyDocumentTheme(nextPreference, nextResolved);
  }, [preference]);

  return <ThemeContext.Provider value={{ preference, resolved, hydrated, cycle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

const themeLabels: Record<ThemePreference, string> = {
  light: '浅色模式',
  dark: '深色模式',
  system: '跟随系统',
};

function ThemeIcon({ preference }: { preference: ThemePreference }) {
  switch (preference) {
    case 'light':
      return <Sun aria-hidden='true' size={16} strokeWidth={1.75} />;
    case 'dark':
      return <Moon aria-hidden='true' size={16} strokeWidth={1.75} />;
    case 'system':
      return <Monitor aria-hidden='true' size={16} strokeWidth={1.75} />;
  }
}

export function ThemeToggle({ variant = 'header' }: { variant?: 'header' | 'pill' }) {
  const { preference, cycle } = useTheme();
  const label = themeLabels[preference];
  if (variant === 'pill') {
    return (
      <Tooltip content={`主题：${label}（点击切换）`}>
        <button type='button' className='trip-icon-pill' aria-label={`切换主题，当前${label}`} onClick={cycle}>
          <ThemeIcon preference={preference} />
        </button>
      </Tooltip>
    );
  }
  return (
    <Tooltip content={`主题：${label}（点击切换）`}>
      <Button
        attrType='button'
        quaternary
        size='small'
        className='blog-nav__icon-button'
        aria-label={`切换主题，当前${label}`}
        onClick={cycle}
        icon={<ThemeIcon preference={preference} />}
      />
    </Tooltip>
  );
}
