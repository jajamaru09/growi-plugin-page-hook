const PLUGIN_NAME = 'growi-plugin-practice2';

function activate(): void { 
    console.log(`[${PLUGIN_NAME}] activated`);
};

function deactivate(): void { }

// GROWI 仕様: window.pluginActivators に自己登録
if ((window as any).pluginActivators == null) {
    (window as any).pluginActivators = {};
}
(window as any).pluginActivators[PLUGIN_NAME] = { activate, deactivate };