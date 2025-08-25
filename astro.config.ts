import react from '@astrojs/react'
import vue from '@astrojs/vue'
import mdx from '@astrojs/mdx'

import { defineConfig } from 'astro/config'
import UnoCSS from 'unocss/astro'

export default defineConfig({
  site: 'https://sepush.github.io',
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
  markdown:{
    shikiConfig:{
      theme: 'vitesse-light'
    }
  }
})
