import { createContext, useContext, useEffect, useLayoutEffect, useRef, type RefObject } from 'react';
import { useLocation, useNavigationType } from 'react-router';

const noScroller: RefObject<HTMLElement | null> = { current: null };

export const BlogScrollerContext = createContext<RefObject<HTMLElement | null>>(noScroller);

export function useBlogScroller(): RefObject<HTMLElement | null> {
  return useContext(BlogScrollerContext);
}

export function findHashTarget(hash: string): HTMLElement | null {
  if (!hash.startsWith('#') || hash.length < 2) return null;
  let id = hash.slice(1);
  try {
    id = decodeURIComponent(id);
  } catch {
    // Keep raw hash if not percent-encoded.
  }
  return document.getElementById(id);
}

function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export function scrollToHash(href: string): void {
  const target = findHashTarget(href);
  if (!target) return;
  target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  if (window.location.hash !== href) {
    window.history.replaceState(window.history.state, '', href);
  }
}

function isIdleFocus(): boolean {
  const active = document.activeElement;
  return !active || active === document.body || !active.isConnected;
}

function focusScroller(scroller: HTMLElement, newPage: boolean): void {
  scroller.tabIndex = -1;
  if (newPage || isIdleFocus()) {
    scroller.focus({ preventScroll: true });
  }
}

function scrollDelta(event: KeyboardEvent, scroller: HTMLElement): number | null {
  if (event.altKey || event.ctrlKey || event.metaKey) return null;
  const page = scroller.clientHeight * 0.875;
  switch (event.key) {
    case 'ArrowDown':
      return 40;
    case 'ArrowUp':
      return -40;
    case 'PageDown':
      return page;
    case 'PageUp':
      return -page;
    case ' ':
      return event.shiftKey ? -page : page;
    case 'Home':
      return -scroller.scrollHeight;
    case 'End':
      return scroller.scrollHeight;
    default:
      return null;
  }
}

function useIdleScrollKeys(scrollerRef: RefObject<HTMLElement | null>, enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      const scroller = scrollerRef.current;
      if (!scroller || event.defaultPrevented || !isIdleFocus()) return;
      const delta = scrollDelta(event, scroller);
      if (delta === null) return;
      event.preventDefault();
      scroller.tabIndex = -1;
      scroller.focus({ preventScroll: true });
      scroller.scrollBy({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', top: delta });
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enabled, scrollerRef]);
}

export function useScrollerRouting(scrollerRef: RefObject<HTMLElement | null>, enabled: boolean): void {
  const { hash, key, pathname } = useLocation();
  const navigationType = useNavigationType();
  const positions = useRef(new Map<string, number>());
  const currentKey = useRef(key);
  const shownPath = useRef<string | null>(null);

  useIdleScrollKeys(scrollerRef, enabled);

  useEffect(() => {
    if (!enabled) return undefined;
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;
    let frame = 0;
    const save = () => {
      frame = 0;
      positions.current.set(currentKey.current, scroller.scrollTop);
    };
    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(save);
    };
    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      scroller.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [enabled, scrollerRef]);

  useLayoutEffect(() => {
    currentKey.current = key;
    if (!enabled) return undefined;
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    if (shownPath.current !== null) focusScroller(scroller, shownPath.current !== pathname);
    else scroller.tabIndex = -1;
    shownPath.current = pathname;

    const saved = positions.current.get(key);
    if (navigationType === 'POP' && saved !== undefined) {
      scroller.scrollTop = saved;
      return undefined;
    }

    const target = findHashTarget(hash);
    if (!target) {
      scroller.scrollTop = 0;
      return undefined;
    }

    target.scrollIntoView({ block: 'start' });
    const landed = scroller.scrollTop;
    let cancelled = false;
    void document.fonts?.ready.then(() => {
      if (!cancelled && scroller.scrollTop === landed) {
        target.scrollIntoView({ block: 'start' });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [enabled, hash, key, navigationType, pathname, scrollerRef]);
}
