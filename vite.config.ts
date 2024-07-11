import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [vue(), visualizer({ open: true })],
  plugins: [
    vue(),
    visualizer({
      open: false,
    }),
  ],
  base: './',
  resolve: {
    // 配置路径别名
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (
            id.includes('node_modules/highlight.js') ||
            id.includes('node_modules/marked') ||
            id.includes('node_modules/lodash-es') ||
            id.includes('node_modules/dayjs')
          ) {
            return 'vendor-utils';
          } else if (id.includes('node_modules/naive-ui')) {
            return 'vendor-ui';
          } else if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
  },
});
