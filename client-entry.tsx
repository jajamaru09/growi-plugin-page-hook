import { createPageChangeListener } from './src/growiNavigation';
import type { GrowiPageContext } from './src/pageContext';

const PLUGIN_NAME = 'growi-plugin-practice2';

async function handlePageChange(ctx: GrowiPageContext): Promise<void> {
    console.log(`[${PLUGIN_NAME}]`, ctx);
    // await fetch('/your-api', {
    //   method: 'POST',
    //   body: JSON.stringify(ctx),
    //   headers: { 'Content-Type': 'application/json' },
    // });
}

const { start, stop } = createPageChangeListener(handlePageChange);

function activate(): void {
    console.log(`[${PLUGIN_NAME}] activated`);
    start();
}

function deactivate(): void {
    console.log(`[${PLUGIN_NAME}] deactivated`);
    stop();
}

// GROWI 仕様: window.pluginActivators に自己登録
if ((window as any).pluginActivators == null) {
    (window as any).pluginActivators = {};
}
(window as any).pluginActivators[PLUGIN_NAME] = { activate, deactivate };