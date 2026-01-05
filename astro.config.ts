import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import vue from '@astrojs/vue';

import { defineConfig } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import UnoCSS from 'unocss/astro';

export default defineConfig({
  site: 'https://sepush.github.io',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'load',
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'vue-vendor': ['vue'],
          },
        },
      },
    },
  },
  integrations: [
    react({
      include: ['**/react/**/*', '**/*.jsx', '**/*.tsx'],
    }),
    vue({
      include: ['**/vue/**/*.vue', '**/*.vue'],
    }),
    mdx({
      remarkPlugins: [remarkMath, remarkGfm],
      rehypePlugins: [[rehypeKatex]],
    }),
    UnoCSS({
      injectReset: true,
    }),
  ],
  markdown: {
    remarkPlugins: [remarkMath, remarkGfm],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      theme: 'vitesse-light',
    },
  },
});
