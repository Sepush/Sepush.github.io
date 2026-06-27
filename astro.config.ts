import mdx from '@astrojs/mdx';
import { satteri } from '@astrojs/markdown-satteri';
import { katex as satteriKatex } from '@nullpinter/satteri-katex';
import react from '@astrojs/react';
import vue from '@astrojs/vue';

import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro';

export default defineConfig({
  site: 'https://sepush.github.io',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'load',
  },
  integrations: [
    react({
      include: ['**/react/**/*', '**/*.jsx', '**/*.tsx'],
    }),
    vue({
      include: ['**/vue/**/*.vue', '**/*.vue'],
    }),
    mdx(),
    UnoCSS({
      injectReset: true,
    }),
  ],
  markdown: {
    processor: satteri({
      features: {
        math: true,
      },
      mdastPlugins: [satteriKatex()],
    }),
    shikiConfig: {
      theme: 'vitesse-light',
    },
  },
});
