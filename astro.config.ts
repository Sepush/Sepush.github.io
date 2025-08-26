import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import vue from "@astrojs/vue";

import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: "https://sepush.github.io",
  integrations: [
    react({
      include: ["**/react/**/*", "**/*.jsx", "**/*.tsx"],
    }),
    vue({
      include: ["**/vue/**/*.vue", "**/*.vue"],
    }),
    mdx({
      remarkPlugins: [remarkMath],
      rehypePlugins: [[rehypeKatex]],
    }),
    UnoCSS({
      injectReset: true,
    }),
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      theme: "vitesse-light",
    },
  },
});
