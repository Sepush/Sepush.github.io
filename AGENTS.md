# Artea Blog

Artea's personal blog for technical articles, notes, reading notes, and other writing. The site is deployed to GitHub Pages at `https://sepush.github.io`.

## Conventions

- Communicate with the user in Chinese.
- Write code, documentation, and comments in English.
- Use strict TypeScript, ESM, named exports, and kebab-case directories.
- Do not use `as any` or bypass type errors.
- Keep components cohesive, reusable, and readable.
- Keep styling simple. Do not add colorful gradients, hover scaling, or decorative effects.
- Style exclusively with Pika design tokens (`--pw-alias-*`, `--p-*`) in `app/styles/site.css` — do not introduce Tailwind or UnoCSS utilities.

## Stack

- React 19 and React Router framework mode
- Pika `@pika-lab/react` (pinned to `0.0.1`), including `@pika-lab/react/markdown` and `@pika-lab/react/shiki`
- `lucide-react` for UI icons
- KaTeX (`katex`) for math via Pika's `mathExtension` and `Equation`, and Shiki (`shiki`) for code highlighting via `ConfigProvider`
- Vite+ (`vp`) for formatting and Oxlint for linting
- pnpm 11.9.0 and Node 24.18.0

React Router prerenders all published routes into static HTML and client-navigation data. It is not a single-file SPA. The build also creates `404.html` from the route-agnostic SPA fallback for GitHub Pages; do not use the prerendered `/404` route as the fallback because its route-specific hydration data belongs only to that URL. Keep route discovery in `initial` mode because GitHub Pages cannot serve dynamic `/__manifest` requests.

## Structure

```text
app/
  components/       Shared React and Pika components
  config/           Social and friend data
  lib/              Content, formatting, Markdown helpers, and Shiki highlighter
  routes/           Route modules and page components
  styles/           Pure Pika token stylesheet (`site.css`)
  root.tsx          Document, zero-flash theme bootstrap, ConfigProvider, and Layout shell
  routes.ts         Route manifest
src/
  content/          Markdown posts, notes, about, and post images
  data/travel/      Travel places
public/             Static files copied without processing
scripts/            Static deployment preparation
```

## Content rules

Posts live in `src/content/posts/**/*.md`; their URLs preserve the relative path without the Markdown extension. Notes live in `src/content/notes/**/*.md`. About uses `src/content/about/index.md`.

Post frontmatter supports `title`, `description`, `pubDate`, `updatedDate`, `tags`, `draft`, and `author`. Note frontmatter supports `title`, `content`, `pubDate`, `mood`, `location`, `tags`, and `draft`. Dates are serialized as ISO strings and sorted descending.

Development includes drafts and displays draft badges. Production excludes drafts from prerender paths, loader data, search index, and generated content. Keep this behavior when changing the content layer.

Markdown renders directly through `@pika-lab/react/markdown` (`preset="document"`) with `gfmExtension`, `alertExtension`, and `mathExtension` (excluding chat reference extensions). Relative post images resolve through the Vite asset map in `app/components/markdown.tsx`. Heading extraction uses `@pika-lab/react/markdown`'s `extractHeadings` so table of contents entries and rendered heading IDs always stay in sync.

## UI behavior

Use Pika components for shared controls, navigation, drawers, command palette search, cards, tags, avatars, links, empty states, results, code, markdown, timelines, page navigation, scroll containers (`ScrollArea` + `LayoutContent nativeScrollbar={false}`), and document outlines (desktop edge `Outline` + mobile `Collapse`/`Anchor`). The home route (`/`) uses a full-viewport (`100dvh`) interactive MapLibre travel map inspired by `hyoban.cc/trip/`, with Chinese vector basemap labels, teardrop markers, zoom-aware clustering, region route overlays, floating glass chrome, and a collapsible floating side panel / mobile bottom sheet backed by `ScrollArea`. Keep the three-state theme cycle (`light -> dark -> system`) and the `artea-theme` storage key, syncing `data-p-theme-mode` in `<head>` before first paint. Browser-only map behavior must remain hydration-safe.

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
