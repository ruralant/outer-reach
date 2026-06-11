---
name: translate-blog
description: Translate an English blog post in this Astro garden site into its Italian mirror. Use when the user asks to translate a blog post to Italian, create the IT version of a post, or localize content under src/content/blog/. Handles the en→it file mirror, frontmatter rules, wiki-links, glossary, and the post-build check.
---

# Translate blog post (EN → IT)

Translates a post in `src/content/blog/en/<slug>.md` into its Italian mirror at
`src/content/blog/it/<slug>.md`. Same filename = same slug = paired routes.

## Procedure

1. **Identify the source.** Read `src/content/blog/en/<slug>.md`. If the user gave a
   title or partial name, `ls src/content/blog/en/` and match. The IT file will use the
   **identical filename**.
2. **Translate** following the rules below.
3. **Write** `src/content/blog/it/<slug>.md` (overwrite if it already exists — assume the
   user wants a refresh unless they say otherwise).
4. **Build:** run `pnpm build`. Backlinks, the note graph, and wiki-links resolve at build
   time, so a broken link only surfaces here. Fix and rebuild until clean.
5. **Report:** the IT path, build result (pass/fail), and any terms you were unsure about
   so the user can correct them. Hands-off — don't wait for approval before writing.

## Frontmatter rules

`src/content.config.ts` is the schema source of truth. For the `blog` collection:

| Field | Action |
|---|---|
| `title` | **Translate** |
| `description` | **Translate** |
| `tags` | **Keep in English, identical to the source** (they're shared keys, not display text) |
| `published` | Copy unchanged |
| `author` | Copy unchanged (e.g. `"Outer Reach"`) |
| `updated` | Copy unchanged if present |
| `draft` | Copy unchanged |

Keep frontmatter **keys** in English always; only translate the *values* of `title` and
`description`.

## Translation rules

- **Register: informal `tu` form.** Match the existing IT posts — personal, reflective,
  not formal. (e.g. "un futuro che puoi assaggiare", "mi frulla in testa da gennaio").
- **Structure is preserved exactly:** heading levels (`##`), list structure, bold/italic,
  blockquotes, line breaks, em-dashes (—). Translate heading *text*, keep the markers.
- **Code blocks, inline code, and URLs: never translate** — copy verbatim.
- **Wiki-links `[[slug]]` / `[[slug|Display]]`:** keep the `slug` (link target) **exactly
  as-is** — it's a content id, not prose. Translate **only** the `|Display` portion if one
  is present. `[[degrowth]]` → `[[degrowth]]`; `[[degrowth|Degrowth basics]]` →
  `[[degrowth|Basi della decrescita]]`.
- **Loanwords stay** where they already read as established in Italian usage:
  "repair café", "compost", "SSD".
- **Book / work titles:** use the title of the **published Italian edition** when one
  exists (e.g. *The Unsettling of America* → *La risurrezione della terra*). If no Italian
  edition exists, keep the original title and add a brief gloss only if the EN text relied
  on the meaning.
- **Dates written in prose:** localize naturally ("the 8th" → "l'8", "by mid-February" →
  "verso metà febbraio").

## Glossary (recurring core vocabulary → Italian equivalents)

Translate these consistently across all posts:

| English | Italian |
|---|---|
| degrowth | decrescita |
| sovereignty | sovranità |
| self-reliance | autosufficienza |
| sufficiency | sufficienza |
| energy sufficiency | sufficienza energetica |
| energy abundance | abbondanza energetica |
| resilience | resilienza |
| community infrastructure | infrastruttura comunitaria |
| raised beds | aiuole rialzate |
| seed trays | semenzai |

Add new recurring terms to this table as they come up, so future translations stay
consistent. If you coin a translation for a loaded/movement term not listed here, flag it
in the report.

## Don't

- Don't touch the EN source file.
- Don't translate `tags`, frontmatter keys, wiki-link targets, code, or URLs.
- Don't skip `pnpm build` — it's the only gate that catches link/graph breakage.
- Don't translate garden notes or other collections unless asked (this skill is scoped to
  `blog`; the same rules mostly apply but garden uses `created`/`status`, not `published`).
