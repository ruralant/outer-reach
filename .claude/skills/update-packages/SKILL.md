---
name: update-packages
description: Update outer-reach's pnpm dependencies to their latest safe versions — vet every candidate (release age, provenance, deprecation, publisher change, new install scripts, Node engine, peer ranges between astro and its integrations), apply patch/minor bumps, and ask the user before any major upgrade. Use whenever the user asks to update/upgrade/bump packages or dependencies, run pnpm update/outdated, check for outdated or vulnerable packages, or says something like "are my deps up to date?". Also use to answer questions about how dependency updates are done here.
---

# Update pnpm packages (safely)

The goal is "latest", but only a latest that has earned some trust. A hijacked
maintainer token or a poisoned release is usually caught and yanked within
days, so a release must be **at least 7 days old** before it goes in, and every
candidate is vetted before anything is installed. **Major upgrades are never
applied without asking the user first.**

pnpm 11 enforces the age floor itself, tree-wide and cheaply: pass
`--config.minimum-release-age=10080` (minutes) to every `pnpm add` / `pnpm audit
--fix` in this procedure, and transitive packages resolved fresh get the same
7 days. Without the flag pnpm's default floor is 1 day.

This skill touches only `package.json` and `pnpm-lock.yaml` (and source files
when a major upgrade requires it). It never commits, never pushes (a push to
`main` *is* a Vercel deploy), and never uses `npm install` — pnpm is the
package manager. `npm view` is fine for read-only registry questions. A run
that changed dependencies ends by bumping the site's own `"version"` — at least
a minor (step 8).

The Sveltia CMS bundle in `public/admin/` is vendored, not a package: upgrading
it is a separate job (the `curl` comment in `public/admin/index.html`). Out of
scope here.

## Project rules that override "latest"

- **`astro` pins `@astrojs/markdown-remark` to an exact version** in its
  `peerDependencies`, so the two always move together, and `@astrojs/mdx` /
  `@astrojs/rss` / `@astrojs/sitemap` / `@astrojs/check` declare ranges on
  `astro`. Treat the whole Astro set as one decision. The vetting script checks
  peer ranges both ways and says when a coupled bump resolves a conflict.
  "Blocked until it widens" means: don't offer it, report it. pnpm only *warns*
  on peer mismatches here (no `strictPeerDependencies`), so don't rely on the
  install to catch them.
- **TypeScript stays on 6.x** until `@astrojs/check` widens its peer range
  (`^5.0.0 || ^6.0.0` today). The script reports it as blocked; patch/minor
  inside 6.x is fine.
- **0.x packages: a minor is a major.** `sharp` (`0.35`) and `@astrojs/check`
  (`0.9`) are on `0.x`, so `0.35 → 0.36` is a breaking-change release and goes
  through the major path. The script already classifies them that way. `sharp`
  is also astro's own optional dependency (`^0.35.x`), so a sharp major has to
  wait for astro to accept it.
- **Node isn't pinned in the repo.** No `.nvmrc`, no `engines`: Vercel's Node
  version is a setting in its dashboard. The script checks `engines.node`
  against the local Node major; if the user says Vercel runs a different one,
  pass `--node=N`. A target that excludes it would break the deploy — skip and
  report it. Bumping Node is out of scope.
- **Dependency build scripts are blocked unless `allowBuilds` in
  `pnpm-workspace.yaml` allows them.** `esbuild` (`postinstall` checks its
  binary), `exifreader` (`postinstall` that only builds when a custom config is
  present in `package.json`, a no-op here) and `sharp` (prebuilt
  `@img/sharp-*` binaries, no script today) are allowed. A package whose new
  version *gains* an install script is new surface (step 5).
- **`minimumReleaseAgeExclude`** in `pnpm-workspace.yaml` lists exact versions
  that were let in under the age floor. Never add to it on your own. An entry
  whose version is no longer in `pnpm-lock.yaml` does nothing; mention it in the
  report so the user can drop it.
- **`dependencies` vs `devDependencies` both exist.** `pnpm add` without `-D`
  can move a dev dependency into `dependencies`, so install the two groups in
  separate commands (step 3).

## Procedure

### 1. Preflight

```bash
git status --short package.json pnpm-lock.yaml pnpm-workspace.yaml
git branch --show-current
node -v && pnpm -v
```

Updates land through a PR, on a branch named like
`chore/packages-update-15-october-2026`. If the user is on `main` or an
unrelated branch, offer to create one before installing anything.

`package.json` may already carry uncommitted work, so **don't use `git
checkout` to roll back** — snapshot the files instead and restore from the
snapshot:

```bash
mkdir -p /tmp/outer-reach-pkg-backup && cp package.json pnpm-lock.yaml pnpm-workspace.yaml /tmp/outer-reach-pkg-backup/
```

### 2. Vet every outdated package (read-only)

```bash
node .claude/skills/update-packages/vet-updates.mjs          # human-readable
node .claude/skills/update-packages/vet-updates.mjs --json   # if you need to parse it
```

`--min-age-days=N` changes the age floor (default 7). Don't lower it on your own;
only if the user asks, and never below 3. Change the `minimum-release-age` flag
to match (`N × 1440`).

For each outdated direct dependency it prints the bump type, the **safe target**
(latest if it is old enough, otherwise the newest release on that line that is),
its age, whether it has npm provenance, its install scripts, and warnings:

| Warning | Meaning | What to do |
| --- | --- | --- |
| `held back` / `skip this round` | latest is younger than the age floor | take the older safe target, or skip; mention it in the report |
| `DEPRECATED` | the target itself is deprecated | don't install; tell the user |
| `PROVENANCE LOST` | current was built with provenance, target wasn't | **stop** — classic sign of a stolen publish token; tell the user, don't install |
| `publisher changed` | a different npm account published the target | check the repo's releases/maintainers for a legitimate handover before installing; if unexplained, treat like provenance lost |
| `NEW install script(s)` | target adds `preinstall`/`install`/`postinstall` | read the script (`npm view <pkg>@<ver> scripts`) and tell the user; don't approve it silently |
| `license A → B` | license changed | mention it; ask if it's a move to a non-permissive licence |
| `engines.node NEEDS …` | target won't install on the site's Node major | skip, report |
| `PEER … bump X to Y with it` | needs a coupled bump to satisfy peer ranges | install both together in one command |
| `PEER … blocked until it widens` | another dependency's peer range rejects the target | skip, report which package holds it back |

### 3. Patch and minor bumps with no warnings

Install them at their exact safe targets, `dependencies` and `devDependencies`
in separate commands; pnpm writes the caret range `^x.y.z`:

```bash
pnpm add --config.minimum-release-age=10080 astro@7.3.7 @astrojs/markdown-remark@7.3.2 …
pnpm add -D --config.minimum-release-age=10080 typescript@6.0.4 …
```

A coupled pair (the script's `PEER … with it` lines) goes in the same command,
even when it's only a minor — `astro` + `@astrojs/markdown-remark` is the usual
one. Afterwards, confirm only one copy of the pair is in the tree
(`pnpm why @astrojs/markdown-remark`).

If pnpm reports `ERR_PNPM_NO_MATURE_MATCHING_VERSION` for a transitive package,
something in the new tree needs a release younger than the floor: drop the
direct bump that pulled it in and report it.

Anything else with a warning from the table above is handled individually, not
batched.

### 4. Major bumps — ask first

For each major (including 0.x minors), **before installing anything**:

1. Read what breaks. Open the GitHub releases/CHANGELOG for every version between
   current and target (the script prints the repo URL; `gh release list -R
   owner/repo` / `gh release view <tag> -R owner/repo` or WebFetch the releases
   page). The `@astrojs/*` integrations live in the `withastro/astro` monorepo:
   read `packages/integrations/<name>/CHANGELOG.md` there. Look for removed APIs,
   changed defaults, new peer ranges, Node floor.
2. Check how this repo uses it: `grep -rn "<pkg>" src astro.config.mjs
   tsconfig.json` and compare against the breaking changes. Say concretely which
   files would need edits. Where things are wired:
   - `astro.config.mjs` — i18n, fonts, the remark plugin, mdx/sitemap
     integrations, `__APP_VERSION__`
   - `src/plugins/remarkWikiLinks.ts` — `unist-util-visit` and the remark/mdast
     types
   - `src/lib/photos.ts` — `exifreader`
   - `src/content.config.ts` — content collections and Zod (both from `astro`)
   - `src/pages/rss.xml.ts` and `src/pages/it/rss.xml.ts` — `@astrojs/rss`
3. Check peers: the script's `PEER` lines, plus `pnpm view <pkg>@<target>
   peerDependencies` for anything transitive it can't see.
4. Ask the user with **AskUserQuestion** — one question per major (or per
   coupled set), up to four per call. Put the summary in the question: current →
   target, age, the breaking changes that actually touch this repo, and the
   files that would change. Options:
   - **Upgrade** — install it and fix whatever breaks in the code
   - **Skip for now** — leave it on the current major

Only upgrade the ones the user approved, each separately (so a failure is
attributable), and fix any code the upgrade breaks. If `CLAUDE.md` describes
behaviour or config that moved (Astro version, content-collection API, the
image pipeline), update it in the same change.

### 5. Install scripts (`allowBuilds`)

```bash
pnpm ignored-builds
```

Anything under "Automatically ignored builds" is a package whose install script
was skipped because `allowBuilds` doesn't mention it: new install-script
surface. Show the user the script (`npm view <pkg>@<ver> scripts`, and
`gypfile`), explain what it does and whether the package works without it, and
ask before running `pnpm approve-builds <pkg>` (or `pnpm approve-builds
'!<pkg>'` to deny it explicitly). Never use `pnpm approve-builds --all`.

If `sharp`, `esbuild` or `exifreader` changed version (`pnpm why <pkg>`), the
build in step 7 is what proves they still work: Vite bundles with esbuild,
`astro:assets` runs sharp on every photo in `src/photos/`, and `lib/photos.ts`
reads their EXIF with exifreader.

### 6. Security checks on the resulting tree

```bash
pnpm audit                # known vulnerabilities, including transitive deps
pnpm audit signatures     # registry signatures of everything installed
```

- `pnpm audit` findings with a fix inside the current ranges:
  `pnpm audit --fix update --config.minimum-release-age=10080`. **Never plain
  `--fix`**: its default method writes `overrides`, which pin transitive
  versions in config and silently outlive the advisory. Findings that need a
  major go back through step 4. Findings with no fix: report them, with the
  dependency path (`pnpm why <pkg>`), and whether it only affects the build
  (the site ships fully static HTML; nothing runs server-side).
- `pnpm audit signatures` must report no invalid signatures. An invalid one
  means a tampered tarball — restore the snapshot and stop.

### 7. Verify — hard gate

```bash
pnpm install --frozen-lockfile
pnpm astro check && pnpm build
```

There are no tests and no linter: `astro check` (strict TS) and the build are
the whole gate, and Vercel runs the same build. `--frozen-lockfile` fails if
`package.json` and the lockfile drifted. The build is where backlinks, the
note graph, EXIF and image optimization all resolve, so it must pass, not just
the type-check.

After an Astro bump, also start the dev server (`preview_start` with
`outer-reach-dev`) and load `/`, a garden note, `/photos` and `/it/` to check
nothing regressed at runtime.

If something fails, find which upgrade caused it: fix the code if it's a
straightforward API change, otherwise put that package back (`pnpm add [-D]
<pkg>@<old version>`) — or restore the three files from
`/tmp/outer-reach-pkg-backup/` and run `pnpm install` to roll everything back —
and report it.

### 8. Bump the site version

Only once step 7 has passed, and only if something was actually upgraded (a run
that changed nothing leaves the version alone). The site's `"version"` is what
`astro.config.mjs` bakes into the build as `__APP_VERSION__` (shown in the
footer), so a dependency update is a release like any other. Pick the level
from what went in:

- **Major** (`1.10.1 → 2.0.0`) — the site's platform moved: a major of `astro`,
  or an upgrade that forced a content/schema migration or a visible change in
  the rendered site (URLs, markup, image output).
- **Minor** (`1.10.1 → 1.11.0`) — everything else, including majors of tooling
  and libraries (`typescript`, `sharp`, `@astrojs/check`, `exifreader`…) and
  plain patch/minor batches. Never a patch bump.

Bump once per run, against the version at `HEAD`: if `package.json` already
carries an uncommitted bump (`git diff HEAD -- package.json | grep '"version"'`),
don't stack another on it — raise it only if this run needs a higher level.

```bash
pnpm version minor --no-git-tag-version   # or: major
```

That rewrites `"version"` in `package.json` only (`pnpm-lock.yaml` doesn't
record the root package's version), and with `--no-git-tag-version` makes no
commit and no tag. Add `--dry-run` first if you want to see the plan.

### 9. Report

A short table: package, from → to, bump type, and anything skipped or held back
with the reason (too young, peer-blocked, user declined, warning). Plus the site
version (old → new, and why that level), `pnpm audit`'s result, stale
`minimumReleaseAgeExclude` entries, and anything the user must decide. Then offer — don't do — a commit (this repo's convention is
`chore: update packages`) and a PR to `main`.

Leave `/tmp/outer-reach-pkg-backup/` alone until the user is happy; it's their undo.
