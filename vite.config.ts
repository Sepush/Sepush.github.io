import { reactRouter } from '@react-router/dev/vite';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  plugins: [reactRouter(), UnoCSS()],
  ssr: {
    noExternal: ['@pika-lab/react'],
  },
  fmt: {
    singleQuote: true,
    jsxSingleQuote: true,
    arrowParens: 'avoid',
    printWidth: 120,
    ignorePatterns: [
      'node_modules/',
      'build/',
      'dist/',
      '.react-router/',
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
