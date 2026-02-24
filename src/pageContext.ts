export type PageMode = 'view' | 'edit';

export interface GrowiPageContext {
  pageId: string;
  mode: PageMode;
}

const PAGE_ID_RE = /^\/([0-9a-f]{24})$/i;

/** pathname が 24桁 hex pageId URL かどうか */
export function isPageIdUrl(pathname: string): boolean {
  return PAGE_ID_RE.test(pathname);
}

/** pageId URL から pageId を抽出。非 pageId URL の場合は null */
export function extractPageId(pathname: string): string | null {
  const m = pathname.match(PAGE_ID_RE);
  return m ? m[1] : null;
}
