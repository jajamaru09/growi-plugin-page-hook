/**
 * client-entry.tsx — GROWIスクリプトプラグインのエントリーポイント
 *
 * GROWIはビルド後のこのファイルをブラウザでロードする。
 * ファイル末尾で window.pluginActivators に { activate, deactivate } を登録すると
 * GROWIがプラグインとして認識し、適切なタイミングで呼び出す。
 */

import { createPageChangeListener } from './src/growiNavigation';
import type { GrowiPageContext } from './src/pageContext';

// ─── グローバル型宣言 ──────────────────────────────────────────────
// GROWI本体側で window.pluginActivators の型が公開されていないため、
// ここでプロジェクト内向けに宣言する。
declare global {
    interface Window {
        pluginActivators?: Record<string, { activate(): void; deactivate(): void }>;
    }
}

// ─── 定数 ────────────────────────────────────────────────────────
// package.json の name フィールドと一致させる（GROWIがキーとして使用する）
const PLUGIN_NAME = 'growi-plugin-practice2';

// ─── ページ遷移ハンドラ ───────────────────────────────────────────
/**
 * ページが切り替わるたびに呼ばれるコールバック。
 * このプラグインのメインロジックをここに実装する。
 *
 * @param ctx.pageId    - ページのURL（例: /6995d3fcf17c96c558f6b0ab）
 * @param ctx.mode      - 'view'（閲覧）または 'edit'（編集）
 * @param ctx.revisionId - 過去リビジョン表示時のみ存在。undefined なら最新版
 */
async function handlePageChange(ctx: GrowiPageContext): Promise<void> {
    console.log(`[${PLUGIN_NAME}]`, ctx);
    // 外部APIへの通知例:
    // await fetch('/your-api', {
    //   method: 'POST',
    //   body: JSON.stringify(ctx),
    //   headers: { 'Content-Type': 'application/json' },
    // });
}

// ─── リスナーの生成 ───────────────────────────────────────────────
// activate/deactivate で start/stop を呼ぶだけでよいよう、
// リスナーオブジェクトをモジュールスコープで作成しておく。
const { start, stop } = createPageChangeListener(handlePageChange);

// ─── プラグインライフサイクル ─────────────────────────────────────
/**
 * GROWIがプラグインをロードした直後に1回だけ呼ぶ。
 * リスナーを起動してページ遷移の監視を開始する。
 */
function activate(): void {
    console.log(`[${PLUGIN_NAME}] activated`);
    start();
}

/**
 * GROWIがプラグインをアンロードするときに呼ぶ。
 * リスナーを停止してイベントリスナーを解除する。
 */
function deactivate(): void {
    console.log(`[${PLUGIN_NAME}] deactivated`);
    stop();
}

// ─── GROWI への自己登録 ───────────────────────────────────────────
// GROWIは起動時に window.pluginActivators を走査し、
// 各エントリーの activate/deactivate を呼び出す。
if (window.pluginActivators == null) {
    window.pluginActivators = {};
}
window.pluginActivators[PLUGIN_NAME] = { activate, deactivate };
