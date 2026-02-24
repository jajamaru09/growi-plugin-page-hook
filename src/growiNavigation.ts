import {
  isPageIdUrl, extractPageId,
  type GrowiPageContext, type PageMode,
} from './pageContext';

export type PageChangeCallback = (ctx: GrowiPageContext) => void;

export function createPageChangeListener(callback: PageChangeCallback): {
  start: () => void;
  stop: () => void;
} {
  let lastKey: string | null = null;

  function tryFire(pageId: string, mode: PageMode): void {
    const key = `${pageId}::${mode}`;
    if (key === lastKey) return;
    lastKey = key;
    try {
      callback({ pageId, path: `/${pageId}`, mode });
    } catch (e) {
      console.error('[growiNavigation] callback error', e);
    }
  }

  function onNavigate(e: any): void {
    const dest = new URL(e.destination.url);
    if (!isPageIdUrl(dest.pathname)) return;
    const pageId = extractPageId(dest.pathname)!;
    const mode: PageMode = dest.hash === '#edit' ? 'edit' : 'view';
    tryFire(pageId, mode);
  }

  function start(): void {
    const nav = (window as any).navigation;
    if (!nav) return;
    if (nav._growiPluginListening) return; // 二重起動防止
    nav._growiPluginListening = true;
    nav.addEventListener('navigate', onNavigate);

    // 初回ロード（navigate イベントは初回には発火しない）
    const { pathname, hash } = location;
    if (isPageIdUrl(pathname)) {
      const pageId = extractPageId(pathname)!;
      const mode: PageMode = hash === '#edit' ? 'edit' : 'view';
      tryFire(pageId, mode);
    }
  }

  function stop(): void {
    const nav = (window as any).navigation;
    nav?.removeEventListener('navigate', onNavigate);
    nav && delete nav._growiPluginListening;
    lastKey = null;
  }

  return { start, stop };
}