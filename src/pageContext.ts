// src/pageContext.ts
// GROWI SPA の 2段 routeChangeComplete を処理するユーティリティ
// 他プラグインからも import して使う想定

export type PageMode = 'view' | 'edit';

export interface GrowiPageContext {
  pageId: string;
  path: string;
  mode: PageMode;
}

// ── 定数 ─────────────────────────────────────────────────────────
const PAGE_ID_RE = /^\/([0-9a-f]{24})$/i;
const SLUG_EXCLUDE_RE = /^\/(admin|_search|trash|me|user|_hackmd|_legacy)(\/|$)/;

// ── 判定ユーティリティ ─────────────────────────────────────────────

/** pathname が 24桁 hex pageId URL かどうか */
export function isPageIdUrl(pathname: string): boolean {
  return PAGE_ID_RE.test(pathname);
}

/** pathname が記事スラッグ URL かどうか（非記事・pageId URL を除く） */
export function isSlugUrl(pathname: string): boolean {
  // '/' はデフォルトで除外（ダッシュボード/ポータル想定）
  // GROWI の '/' が記事ページの場合はこの行を削除すれば発火するようになる
  if (!pathname || pathname === '/') return false;
  if (isPageIdUrl(pathname)) return false;
  if (SLUG_EXCLUDE_RE.test(pathname)) return false;
  return true;
}

/** pathname が記事系（slug or pageId）かどうか */
export function isArticlePath(pathname: string): boolean {
  return isSlugUrl(pathname) || isPageIdUrl(pathname);
}

/** asPath（Next.js router.asPath 形式）から pathname と mode を分解 */
export function parseAsPath(asPath: string): { pathname: string; mode: PageMode } {
  const [rawPath, rawHash = ''] = asPath.split('#');
  const pathname = rawPath.split('?')[0];
  const mode: PageMode = rawHash === 'edit' ? 'edit' : 'view';
  return { pathname, mode };
}

/** pageId URL から pageId を抽出。非 pageId URL の場合は null */
export function extractPageId(pathname: string): string | null {
  const m = pathname.match(PAGE_ID_RE);
  return m ? m[1] : null;
}

/** 重複発火防止用のコンテキストキー */
export function makeContextKey(ctx: GrowiPageContext): string {
  return `${ctx.pageId}::${ctx.mode}`;
}
