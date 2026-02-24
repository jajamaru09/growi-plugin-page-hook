// vite.config.ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    manifest: true,
    rollupOptions: {
      input: ['client-entry.tsx'], // 先頭の / は不要（プロジェクトルート相対）
      // ↓ これが無いと activate/deactivate が tree-shake で消えて空ファイルになる
      preserveEntrySignatures: 'strict',
    },
  },
});