# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Dense reference — read top-to-bottom once, then jump by section. Goal: act without re-exploring the tree.

## Commands

pnpm only (pinned in `package.json`). No tests, no separate lint.

| Task | Command |
|---|---|
| Install | `pnpm install` |
| Dev server (`:4321`) | `pnpm dev` |
| Build → `dist/` | `pnpm build` |
| Preview build | `pnpm preview` |
| **Type-check (the gate)** | `pnpm astro check` |

`pnpm astro check` is the only correctness gate (strict TS). **Run `pnpm build` after any content/routing change** — backlinks, the note graph, and EXIF all resolve at build time, so errors only surface there.

## What it is

Static, bilingual (en/it) **Astro v6** site = digital **garden** (interlinked evergreen notes) + **blog** + EXIF-driven **photos** + `now`/`manifesto` pages. Fully static output.

## File map

```
src/
  content.config.ts        Zod schemas for `garden` + `blog` collections (SOURCE OF TRUTH)
  content/
    garden/{en,it}/*.md     notes — id = "<locale>/<slug>"
    blog/{en,it}/*.md       posts
    now/{en,it}.md          loose files, imported directly (not a collection)
    manifesto/{en,it}.md    loose files
  i18n/
    ui.ts                   ALL UI strings: ui.en + ui.it (en must be complete)
    utils.ts                useTranslations, localePath, slugFromNoteId, getAlternateLocaleUrl, dates
  lib/
    garden.ts               backlinks, related-notes, note-graph (re-parses [[ ]] at build)
    blog.ts                 per-locale fetch + sort
    photos.ts               reads src/photos/*.jpg EXIF + attaches ImageMetadata (via import.meta.glob) at build
    navigation.ts           header / mobile menu / footer links, one list
    rows.ts                 postRow / noteRow → props for a ListRow
  plugins/
    remarkWikiLinks.ts      renders [[ ]] → <a class="wiki-link"> (wired in astro.config)
  layouts/                  BaseLayout (head, theme, Header + <main> + Footer), Longform (article grid:
                            side column + body), BlogPostLayout / GardenNoteLayout (fill Longform's meta)
  components/views/         ONE view per page (HomeView, BlogIndexView, GardenIndexView, TagsView, TaggedView,
                            GardenStatusView, PhotosView, PhotoView, NowView, ManifestoView) — markup + styles
  components/               Header, Footer, PageHeader, SectionHead, ListRow, Tag, StatusBadge, NoteLinks,
                            PhotoGrid, SolarpunkHouse, LanguageSwitcher, ThemeToggle
  pages/                    thin route wrappers: EN at root, IT mirror under pages/it/ (see i18n rule)
  styles/global.css         design tokens, reset, .container/.eyebrow/.link/.btn/.section-title/.prose
  assets/solarpunk.svg      homepage illustration, copied from the portfolio (see Design)
  photos/*.jpg              photo gallery source (filename = slug); optimized via astro:assets <Image>
  assets/images/            CMS media uploads (relative public_folder; see Content editing)
astro.config.mjs            site URL, i18n, local fonts, remark plugin, __APP_VERSION__
public/admin/               Sveltia CMS: index.html + config.yml + vendored bundle
```

## The four rules that govern every change

**1. i18n duplication is the backbone.** Default locale `en` has no URL prefix; `it` lives under `/it/`.
- Routes are physically duplicated: `pages/blog/...` (en) **and** `pages/it/blog/...` (it). Same for `garden/`, `rss.xml.ts`, `manifesto`, `now`. Each route file is a thin wrapper: `getStaticPaths` (which must live in the page, with its locale hard-coded) plus one `<XView lang="en|it" …/>`. Markup and styles live once in `components/views/`, so a design change touches the view, not both trees; adding a route still means adding **both** wrapper files.
- Content is duplicated by directory, so collection `id` = `en/degrowth` / `it/degrowth`. Use `slugFromNoteId()` to get the bare slug for URLs and wiki-links.
- Per-locale filtering = `id.startsWith(\`${locale}/\`)` (see `getNotesForLocale`).

**2. New UI string → add to BOTH `ui.en` and `ui.it`** in `src/i18n/ui.ts`. Read via `useTranslations(lang)` → `t("key")`. Never hand-build locale paths — use `localePath` / `gardenNotePath` / `getAlternateLocaleUrl`.

**3. Wiki-links `[[slug]]` / `[[slug|Display]]` are parsed in TWO places — keep them in sync.**
- `plugins/remarkWikiLinks.ts` — render-time, infers locale from file path.
- `lib/garden.ts` — build-time, its own regex for backlinks / related / `getNoteGraph` (served at `/garden/graph.json`).
Changing the link format means editing both.

**4. Schema field names differ — `content.config.ts` is the source of truth (README is informational only).**
- `garden`: `created`, plus `status` ∈ `seed|growing|evergreen|experimental` (default `seed`).
- `blog`: uses **`published`** (not `created`).
- Both: `title`, `description`, `tags[]`, `updated?`, `author?`, `draft?`. `draft:true` hides from listings.

## Adding things (checklists)

- **Garden note / blog post:** create the `.md` under **both** `content/<coll>/en/` and `.../it/` (content is per-locale, no auto-fallback for files). Match the schema for that collection.
- **New page/route:** write a view in `components/views/` that takes `lang`, wraps itself in `BaseLayout` (which already renders the header and footer) and keeps its CSS in a scoped `<style>`; then add a wrapper under `pages/` **and** `pages/it/`.
- **New UI text:** rule 2.
- **Photo:** drop a `.jpg`/`.jpeg` into `src/photos/` — EXIF + sort + image optimization (WebP/responsive via `<Image>`) are automatic; slug = filename. Grids go through `PhotoGrid`; anything else uses `photo.image` with `astro:assets` `<Picture>` (AVIF + WebP fallback), never a raw `<img src>`.

## Design

Same visual system as antoniorossi.net (`../portfolio`, Tailwind there, plain CSS here — no CSS framework, no new deps). Read before styling:

- **Tokens** live on `:root` in `styles/global.css` and are redefined under `:root[data-theme="dark"]`, so write `var(--color-muted)`, never a dark-mode override: `paper` (bg), `surface`, `ink`, `ink-soft` (body copy), `muted` (meta), `line` / `line-strong` (hairlines), one terracotta `accent`, and `seed|growing|evergreen|experimental` for status dots. Hairlines, not shadows. The reset gives every element `border: 0 solid var(--color-line)`, so `border-top-width: 1px` alone draws a hairline.
- **Type:** `var(--font-serif)` (Instrument Serif, single weight — never bold it) for titles; `var(--font-sans)` (Geist 400–600) for everything else. Both are vendored latin subsets loaded through Astro's `fonts` config. The serif has no arrow glyphs, so put `→ ←` in sans text; the serif **italic** is Basic Latin only (no à/è/ì/ò/ù), so keep it to fixed English words such as "Outer *Reach*".
- **Shared classes:** `.container` (64rem page width, shared by header/main/footer), `.eyebrow`, `.link`, `.btn` (+ `.btn-outline`), `.section-title`, `.rows`, `.prose` (all rendered markdown; `a.wiki-link` gets a dotted underline).
- **Breakpoints** (min-width): 600px (inline nav replaces the menu button), 800px (side columns, list grids), 1000px, 1385px.
- **Patterns:** `PageHeader` (eyebrow + serif h1 + lede slot) opens every non-article page. Lists are `<ul class="rows">` of `ListRow`, whose title link is stretched over the row while tag pills sit above it — never nest links. Articles go through `Longform`; its `meta` slot is rendered twice (side column on wide screens, after the body on narrow), so keep it to `<div><dt class="eyebrow">…</dt><dd>…</dd></div>` rows.
- **Whitespace gotcha:** Astro drops the space between back-to-back expressions in slotted text (`{n} {unit}` → "3notes"). Build such sentences as one template string.
- **Mobile menu** is a `popover` sheet (no JS). **Theme:** `data-theme` on `<html>`, set before paint in `BaseLayout`, toggled by `ThemeToggle`.
- **Solarpunk house** (`SolarpunkHouse.astro` + `assets/solarpunk.svg`) is copied from the portfolio, where `scripts/solarpunk-house.js` generates both the SVG and the `layout` block. To change it, regenerate there and copy the SVG and the block between the `// generated` markers here; never hand-edit either. The SVG's night palette is picked by its `#night` fragment.

## Content editing (Sveltia CMS)

Non-code content is edited through **Sveltia CMS** at `/admin/`, which commits markdown straight to `main` on `ruralant/outer-reach`. Two decoupled pieces:

- **`public/admin/`** (this repo) — `index.html` (loader) + `config.yml` (the whole CMS definition) + **vendored** `sveltia-cms.js` (~1.9 MB, committed, no CDN at runtime). Astro copies `public/` verbatim: no build step, and nothing in `src/` or `astro.config.mjs` references it. Upgrade = re-download the bundle per the `curl` comment in `index.html`, then bump the version in that comment.
- **`../sveltia-auth`** (separate repo `ruralant/sveltia-auth`) — single-file, zero-dependency Cloudflare Worker at `https://sveltia-auth.outerreach.workers.dev` running the GitHub OAuth popup handshake (`/auth` → GitHub → `/callback` → `postMessage`). Self-hosted so login touches no third-party broker; shared with other sites and gated by `ALLOWED_DOMAINS` in its `wrangler.toml`. Client id/secret are wrangler secrets, in neither repo.

**`config.yml` mirrors `content.config.ts`, which stays the source of truth (rule 4)** — change the Zod schema first, then the CMS fields; a field in one but not the other is a bug. Also:

- `i18n: { structure: multiple_folders, locales: [en, it], default_locale: en }` matches the on-disk layout (rule 1). Per field: `i18n: true` = translated (title/description/body, garden `tags`), `i18n: duplicate` = copied across locales (dates, `status`, `author`, `draft`).
- Uploads go to `src/assets/images`, **not** `public/` — and `public_folder` is deliberately *relative* (`../../../assets/images`), because only relative paths trigger Astro's build-time markdown image optimization.
- `now` / `manifesto` are body-only entries in the `pages` file collection: those files have no frontmatter and must stay plain markdown on save.
- `output.omit_empty_optional_fields` + double-quote / 2-space YAML keep CMS commits from churning diffs against hand-written files.
- No editorial workflow (Sveltia has no draft-as-PR before v1.0) — saves land on `main`; `draft: true` is the stand-in, and the opt-in line sits commented at the bottom of `config.yml`.
- Wiki-links are plain text to the CMS. Backlinks and the graph resolve at build, so a `[[slug]]` typed in the CMS only materializes on the next deploy.
- Local editing needs none of the auth stack: `pnpm dev`, open `/admin/`, choose **Work with Local Repository** (Chrome/Edge, File System Access API).

## Notable details

- `__APP_VERSION__` global = `version` from `package.json` (Vite `define`).
- `photos.ts` `lite` mode reads only the first 64 KB for the date (listings) vs full EXIF (detail pages).
- Production domain `https://www.outerreach.life` (`astro.config.mjs`) — RSS + sitemap depend on it.
