const fmtIgnoredPrefixes = ['src/content/'];

const filterIgnoredFiles = (files) =>
  files.filter((file) => !fmtIgnoredPrefixes.some((prefix) => file.startsWith(prefix)));

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
