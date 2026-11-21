# Artea Blog

Artea's personal blog for technical articles, notes, reading notes, and other writing. The site is deployed to GitHub Pages at `https://sepush.github.io`.

## Conventions

- Communicate with the user in Chinese.
- Write code, documentation, and comments in English.
- Use strict TypeScript, ESM, named exports, and kebab-case directories.
- Do not use `as any` or bypass type errors.
- Keep components cohesive, reusable, and readable.
- Keep styling simple. Do not add colorful gradients, hover scaling, or decorative effects.

## Stack

- React 19 and React Router framework mode
- Pika `@pika-lab/react`, pinned to `0.0.1`
- Vite and UnoCSS
- `react-markdown` with unified/remark/rehype plugins
- KaTeX for math and Shiki for code highlighting
- Vite+ (`vp`) for formatting and Oxlint for linting
- pnpm 11.9.0 and Node 24.18.0

React Router prerenders all published routes into static HTML and client-navigation data. It is not a single-file SPA. The build also creates `404.html` for GitHub Pages. Keep route discovery in `initial` mode because GitHub Pages cannot serve dynamic `/__manifest` requests.

## Structure

```text
app/
  components/       Shared React and Pika components
  config/          Social and friend data
  lib/             Content, formatting, headings, and highlighting
  routes/          Route modules and page components
  root.tsx         Document, providers, and shared shell
  routes.ts        Route manifest
src/
  content/         Markdown posts, notes, about, and post images
  data/travel/     Travel places
  styles/          Global and Markdown styles
public/            Static files copied without processing
scripts/           Static deployment preparation
```

## Content rules

Posts live in `src/content/posts/**/*.md`; their URLs preserve the relative path without the Markdown extension. Notes live in `src/content/notes/**/*.md`. About uses `src/content/about/index.md`.

Post frontmatter supports `title`, `description`, `pubDate`, `updatedDate`, `tags`, `draft`, and `author`. Note frontmatter supports `title`, `content`, `pubDate`, `mood`, `location`, `tags`, and `draft`. Dates are serialized as ISO strings and sorted descending.

Development includes drafts and displays draft badges. Production excludes drafts from prerender paths, loader data, and generated content. Keep this behavior when changing the content layer.

Markdown uses `remark-gfm`, `remark-math`, `rehype-raw`, `rehype-katex`, and `rehype-slug`. Render elements through the Pika mappings in `app/components/markdown.tsx`. Relative post images must resolve through the Vite asset map rather than raw relative browser URLs. Table of contents entries and heading IDs must continue to share GitHub-compatible slugs.

The content is author-owned and trusted. Review sanitization requirements before accepting outside contributions with raw HTML.

## UI behavior

Use Pika components for shared controls, navigation, cards, tags, links, empty states, results, code, and document outlines. Keep the existing three-state theme cycle (`light -> dark -> system`) and the `artea-theme` storage key. Browser-only map and canvas behavior must remain hydration-safe.

Preserve public URLs, nested post routes, the depth-three table of contents, social links, friend avatars, and the interactive travel map. Direct requests to every published route must work on GitHub Pages.

## Commands

```bash
vp install --frozen-lockfile
vp run dev
vp run typecheck
vp run fmt
vp run fmt:check
vp run lint
vp run build
vp run preview:static
```

Run typecheck, format checking, lint, and the production build before submitting changes. Exercise the generated static site for route, Markdown, theme, image, and responsive behavior changes.

## Deployment

`.github/workflows/deploy.yml` installs dependencies, runs checks, builds the site, uploads `build/client`, and deploys it with GitHub Pages. Do not commit `build/`, `dist/`, `.react-router/`, dependencies, local credentials, or verification output.
