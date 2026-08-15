import path from 'node:path';

const fmtIgnoredPrefixes = ['src/content/'];

const filterIgnoredFiles = (files) =>
  files.filter((file) => {
    const relative = path.relative(process.cwd(), file);
    return !fmtIgnoredPrefixes.some((prefix) => relative.startsWith(prefix));
  });

export default {
  '*.{js,jsx,ts,tsx,vue}': [
    'vp lint --type-aware --tsconfig ./tsconfig.json --fix',
    'vp fmt --write',
  ],
  '*.astro': ['vp lint --type-aware --tsconfig ./tsconfig.json --fix'],
  '*.{css,md,mdx,json,jsonc,yaml,yml,toml}': (files) => {
    const filtered = filterIgnoredFiles(files);
    if (filtered.length === 0) return [];
    return `vp fmt --write ${filtered.join(' ')}`;
  },
};
