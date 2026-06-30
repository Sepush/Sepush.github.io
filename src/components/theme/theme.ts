export type ThemePreference = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'artea-theme';
const TRANSITION_CLASS = 'is-transitioning';
const TRANSITION_DURATION_MS = 220;

function getStoredTheme(): ThemePreference | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === 'light' || raw === 'dark' || raw === 'system') {
    return raw;
  }
  return null;
}

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getResolvedTheme(): 'light' | 'dark' {
  const stored = getStoredTheme();
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  return getSystemTheme();
}

export function getThemePreference(): ThemePreference {
  return getStoredTheme() ?? 'system';
}

export function applyTheme(theme: 'light' | 'dark'): void {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.dispatchEvent(new CustomEvent('artea-theme-change', { detail: { theme } }));
}

export function setThemePreference(preference: ThemePreference): void {
  if (preference === 'system') {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, preference);
  }
  applyTheme(getResolvedTheme());
}

export function cycleThemePreference(): ThemePreference {
  const current = getThemePreference();
  const next: ThemePreference = current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';
  setThemePreference(next);
  return next;
}

export function withThemeTransition(action: () => void): void {
  const root = document.documentElement;
  root.classList.add(TRANSITION_CLASS);
  window.requestAnimationFrame(() => {
    action();
    window.setTimeout(() => {
      root.classList.remove(TRANSITION_CLASS);
    }, TRANSITION_DURATION_MS);
  });
}

export function initThemeSync(): () => void {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = (): void => {
    if (getStoredTheme() === null) {
      applyTheme(getSystemTheme());
    }
  };
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
}
