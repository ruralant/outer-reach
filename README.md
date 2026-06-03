# Outer Reach

A static, bilingual (English / Italian) site built with **Astro v6**. It combines a **digital garden** of interlinked, evergreen notes, a **blog**, an EXIF-driven **photos** gallery, and standalone `now` / `manifesto` pages — with a light/dark theme. Output is fully static.

Live at [outerreach.life](https://www.outerreach.life).

## Quick Start

Uses **pnpm** (version pinned in `package.json`).

```bash
pnpm install         # Install dependencies
pnpm dev             # Dev server at http://localhost:4321
pnpm build           # Build static site to ./dist/
pnpm preview         # Preview the production build
pnpm astro check     # Type-check (strict TypeScript)
```

There is no test suite; `pnpm astro check` is the correctness gate. Run `pnpm build` after content or routing changes — backlinks, the note graph, and photo EXIF all resolve at build time.

## Project Structure

```
src/
├── content/
│   ├── garden/{en,it}/      # Garden notes (.md / .mdx), one file per locale
│   ├── blog/{en,it}/        # Blog posts
│   ├── now/{en,it}.md       # "Now" page content
│   └── manifesto/{en,it}.md # Manifesto content
├── content.config.ts        # Content Collection schemas (garden, blog)
├── i18n/
│   ├── ui.ts                # All UI strings (en + it)
│   └── utils.ts             # Translation + locale-path helpers
├── lib/
│   ├── garden.ts            # Backlinks, related notes, note graph
│   ├── blog.ts              # Post fetching / sorting
│   └── photos.ts            # EXIF extraction from public/photos
├── plugins/
│   └── remarkWikiLinks.ts   # Renders [[wiki-links]] in note bodies
├── layouts/                 # BaseLayout, BlogPostLayout, GardenNoteLayout
├── components/              # TopNav, Footer, LanguageSwitcher, Backlinks, …
├── pages/                   # English routes (Italian mirror under pages/it/)
└── styles/                  # Per-page CSS
public/photos/               # Drop .jpg/.jpeg here to add to the gallery
```

## Internationalisation

Two locales are configured in `astro.config.mjs`: `en` (default, no URL prefix) and `it` (served under `/it/`).

- **Routes** are mirrored: English under `src/pages/`, Italian under `src/pages/it/`.
- **Content** is split by directory (`garden/en/`, `garden/it/`, …); add a note in both locales to have it in both.
- **UI strings** live in `src/i18n/ui.ts` under `ui.en` and `ui.it`. The `en` set must be complete; other locales fall back to `en` per key.

## Content

### Garden notes — `src/content/garden/{locale}/`

```markdown
---
title: "Degrowth"
description: "A short summary used in listings and meta tags"
tags: ["economics", "ecology"]   # optional
status: growing                  # seed | growing | evergreen | experimental (default: seed)
created: 2026-01-15
updated: 2026-02-01              # optional
author: "Your Name"              # optional
draft: false                     # optional, hides from listings when true
---

Note body. Link to other notes with [[other-note-slug]]
or [[other-note-slug|Custom display text]].
```

Notes grow through statuses (`seed` → `growing` → `evergreen`, plus `experimental`). `[[wiki-links]]` connect notes; the site computes **backlinks**, **related notes** (by shared tags), and a note **graph** (`/garden/graph.json`) at build time.

### Blog posts — `src/content/blog/{locale}/`

Same frontmatter as garden notes, except the date field is **`published`** (not `created`) and there is no `status`:

```markdown
---
title: "January Roundup"
description: "Monthly dispatch"
tags: ["roundup"]   # optional
published: 2026-01-31
updated: 2026-02-02 # optional
author: "Your Name" # optional
draft: false        # optional
---
```

### Photos — `public/photos/`

Drop `.jpg` / `.jpeg` files into `public/photos/`. Camera, lens, exposure, and date are read from EXIF at build time, and photos are sorted newest-first. The filename (without extension) becomes the slug.

### Now / Manifesto

`src/content/now/{locale}.md` and `src/content/manifesto/{locale}.md` are plain markdown files (not collections), rendered by their respective pages.

> The canonical schema is `src/content.config.ts` — consult it if frontmatter validation fails.

## Theme

Light/dark theme with OS-preference detection and a toggle (top-right). The choice persists in `localStorage` and is applied via a `data-theme` attribute. Colours are CSS variables defined in `src/layouts/BaseLayout.astro`.

## Configuration

Key settings in `astro.config.mjs`:

- `site` — production domain (`https://www.outerreach.life`); RSS and sitemap depend on it.
- `i18n` — locales and routing.
- `fonts` — local variable font (Roboto Serif) from `src/assets/fonts/`.
- `markdown.remarkPlugins` — includes the wiki-links plugin.

## Deployment

Run `pnpm build` and deploy the `dist/` folder to any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages, etc.). After deploying, verify `/rss.xml`, `/it/rss.xml`, and `/sitemap-index.xml` are reachable.

## Resources

- [Astro Documentation](https://docs.astro.build)
- [Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro i18n](https://docs.astro.build/en/guides/internationalization/)
- [RSS Integration](https://docs.astro.build/en/guides/rss/)
