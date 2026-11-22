import type { CodeHighlighter } from '@pika-lab/react';
import { codeTheme } from '@pika-lab/react/shiki';
import { createHighlighterCoreSync } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import astro from 'shiki/langs/astro.mjs';
import css from 'shiki/langs/css.mjs';
import diff from 'shiki/langs/diff.mjs';
import html from 'shiki/langs/html.mjs';
import javascript from 'shiki/langs/javascript.mjs';
import json from 'shiki/langs/json.mjs';
import markdown from 'shiki/langs/markdown.mjs';
import python from 'shiki/langs/python.mjs';
import shellscript from 'shiki/langs/shellscript.mjs';
import tsx from 'shiki/langs/tsx.mjs';
import typescript from 'shiki/langs/typescript.mjs';
import vue from 'shiki/langs/vue.mjs';
import yaml from 'shiki/langs/yaml.mjs';

const shikiHighlighter = createHighlighterCoreSync({
  themes: [codeTheme],
  langs: [astro, css, diff, html, javascript, json, markdown, python, shellscript, tsx, typescript, vue, yaml],
  engine: createJavaScriptRegexEngine(),
});

const loadedLanguages = new Set<string>(shikiHighlighter.getLoadedLanguages());

export const highlighter: CodeHighlighter = {
  codeToTokens: (code, options) => {
    const lang = options.lang.trim().toLowerCase();
    if (!loadedLanguages.has(lang)) {
      throw new Error(`Unsupported language: ${options.lang}`);
    }
    return shikiHighlighter.codeToTokens(code, {
      lang,
      theme: options.theme,
    });
  },
};
