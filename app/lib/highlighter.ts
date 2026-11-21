import type { CodeHighlighter } from '@pika-lab/react';
import { codeTheme } from '@pika-lab/react/shiki';
import { createHighlighter, type BundledLanguage, type BundledTheme } from 'shiki';

const shikiHighlighter = await createHighlighter({
  themes: [codeTheme],
  langs: ['astro', 'bash', 'css', 'html', 'javascript', 'json', 'markdown', 'python', 'tsx', 'typescript', 'vue'],
});

export const highlighter: CodeHighlighter = {
  codeToTokens: (code, options) =>
    shikiHighlighter.codeToTokens(code, {
      lang: options.lang as BundledLanguage,
      theme: options.theme as BundledTheme,
    }),
};
