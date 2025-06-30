import react from '@astrojs/react'
import vue from '@astrojs/vue'

import { defineConfig } from 'astro/config'
import UnoCSS from 'unocss/astro'

export default defineConfig({
  integrations: [
    react({
      include: ['**/react/**/*', '**/*.jsx', '**/*.tsx'],
    }),
    vue({
      include: ['**/vue/**/*.vue', '**/*.vue'],
    }),
    UnoCSS({
      injectReset: true,
    }),
  ],
})
