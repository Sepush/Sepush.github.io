import { defineConfig } from 'vite-plus';

export default defineConfig({
  fmt: {
    singleQuote: true,
    jsxSingleQuote: true,
    arrowParens: 'avoid',
    printWidth: 120,
    ignorePatterns: [
      'node_modules/',
      'dist/',
      '.astro/',
      'public/',
      'src/data/',
      'src/content/',
      'pnpm-lock.yaml',
      'package-lock.json',
      'yarn.lock',
      'bun.lock',
    ],
  },
});
