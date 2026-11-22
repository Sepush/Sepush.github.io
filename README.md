# Artea Blog

Artea's personal blog, built with React 19, React Router, and Pika (`@pika-lab/react`). Markdown is rendered natively through `@pika-lab/react/markdown` with GFM, GitHub alerts, KaTeX math, Shiki code highlighting, and synchronized heading anchors.

## Commands

```bash
vp install
vp run dev
vp run typecheck
vp run fmt:check
vp run lint
vp run build
vp run preview:static
```

The production build prerenders every published route into `build/client`, including nested post URLs and a GitHub Pages `404.html`.

## Content

- Posts: `src/content/posts/**/*.md`
- Notes: `src/content/notes/**/*.md`
- About: `src/content/about/index.md`

Post URLs follow their relative file paths without the `.md` extension. Set `draft: true` to keep content visible only during development. Relative post images are resolved and emitted by Vite.
