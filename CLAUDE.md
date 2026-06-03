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
    photos.ts               reads public/photos/*.jpg EXIF at build
  plugins/
    remarkWikiLinks.ts      renders [[ ]] → <a class="wiki-link"> (wired in astro.config)
  layouts/                  BaseLayout (shell+theme), BlogPostLayout, GardenNoteLayout
  components/               TopNav, Footer, LanguageSwitcher, ThemeToggle, Backlinks, RelatedNotes, StatusBadge
  pages/                    EN routes at root; IT mirror under pages/it/ (see i18n rule)
  styles/*.css              per-page CSS, imported by its page
public/photos/*.jpg         photo gallery source (filename = slug)
astro.config.mjs            site URL, i18n, local fonts, remark plugin, __APP_VERSION__
```

## The four rules that govern every change

**1. i18n duplication is the backbone.** Default locale `en` has no URL prefix; `it` lives under `/it/`.
- Routes are physically duplicated: `pages/blog/...` (en) **and** `pages/it/blog/...` (it). Same for `garden/`, `rss.xml.ts`, `manifesto`, `now`. Adding/changing a page → edit **both** trees; `it/` pages call the same `lib/` helpers but pass `"it"`.
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
- **New page/route:** create it under `pages/` and mirror under `pages/it/`; thread `Astro.currentLocale` → `useTranslations` + `localePath`. Wrap in `BaseLayout`. Import any page CSS from `styles/`.
- **New UI text:** rule 2.
- **Photo:** drop a `.jpg`/`.jpeg` into `public/photos/` — EXIF + sort are automatic; slug = filename.

## Notable details

- Theme: light/dark via OS detection + `localStorage`, applied as `data-theme` in `BaseLayout`.
- Fonts: local variable Roboto Serif (`src/assets/fonts/*.woff2`) via Astro `fonts` config, not a CDN.
- `__APP_VERSION__` global = `version` from `package.json` (Vite `define`).
- `photos.ts` `lite` mode reads only the first 64 KB for the date (listings) vs full EXIF (detail pages).
- Production domain `https://www.outerreach.life` (`astro.config.mjs`) — RSS + sitemap depend on it.
