import {
    extractPageId,
    type GrowiPageContext, type PageMode,
} from './pageContext';

function hashToMode(hash: string): PageMode {
    return hash === '#edit' ? 'edit' : 'view';
}

export type PageChangeCallback = (ctx: GrowiPageContext) => void;

export function createPageChangeListener(callback: PageChangeCallback): {
    start: () => void;
    stop: () => void;
} {
    let lastKey: string | null = null;

    function tryFire(pageId: string, mode: PageMode, revisionId?: string): void {
        const key = `${pageId}::${mode}::${revisionId ?? ''}`;
        if (key === lastKey) return;
        lastKey = key;
        try {
            callback({ pageId: `/${pageId}`, mode, revisionId });
        } catch (e) {
            console.error('[growiNavigation] callback error', e);
        }
    }

    function onNavigate(e: any): void {
        const dest = new URL(e.destination.url);
        const pageId = extractPageId(dest.pathname);
        if (!pageId) return;
        const revisionId = dest.searchParams.get('revisionId') ?? undefined;
        tryFire(pageId, hashToMode(dest.hash), revisionId);
    }

    function start(): void {
        const nav = (window as any).navigation;
        if (!nav) return;
        if (nav._growiPluginListening) return; // 二重起動防止
        nav._growiPluginListening = true;
        nav.addEventListener('navigate', onNavigate);

        // 初回ロード（navigate イベントは初回には発火しない）
        const { pathname, hash } = location;
        const pageId = extractPageId(pathname);
        if (pageId) {
            const revisionId = new URL(location.href).searchParams.get('revisionId') ?? undefined;
            tryFire(pageId, hashToMode(hash), revisionId);
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