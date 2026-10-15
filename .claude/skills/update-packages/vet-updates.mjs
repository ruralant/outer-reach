#!/usr/bin/env node
// Vet every outdated direct dependency before anything is installed.
// Read-only: it only asks the registry questions and reads node_modules, it never
// touches node_modules, package.json, pnpm-workspace.yaml or the lockfile.
//
//   node .claude/skills/update-packages/vet-updates.mjs [--min-age-days=7] [--node=24] [--json]
//
// For each package it reports the bump type, how long ago the target was published,
// provenance, deprecation, a change of publisher, install scripts, whether the target's
// `engines.node` still accepts the Node major the site builds on (--node, default: the
// local Node major; nothing in the repo pins it, Vercel's is a dashboard setting), and
// peer-range conflicts with the other direct dependencies (astro pins
// @astrojs/markdown-remark to an exact version, so those two must move together). When
// the latest release is younger than
// --min-age-days it falls back to the newest release on the same major that is old
// enough (the "safe target").

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  })
);
const MIN_AGE_DAYS = Number(args["min-age-days"] ?? 7);
const DAY = 86_400_000;

const run = (cmd, ...a) => {
  try {
    return execFileSync(cmd, a, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  } catch (e) {
    // `pnpm outdated` exits 1 whenever something is outdated; its stdout is still the answer.
    if (e.stdout) return e.stdout;
    throw e;
  }
};
const views = new Map();
const view = (spec, ...fields) => {
  const key = [spec, ...fields].join(" ");
  if (!views.has(key)) {
    const out = run("npm", "view", spec, ...fields, "--json");
    const json = out.trim() ? JSON.parse(out) : {};
    // npm 12 wraps a single-version answer in an array.
    views.set(key, (Array.isArray(json) ? json.at(-1) : json) ?? {});
  }
  return views.get(key);
};

const parse = (v) => v.split(/[.+-]/).slice(0, 3).map(Number);
const isPrerelease = (v) => v.includes("-");
const cmpT = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
const cmp = (a, b) => cmpT(parse(a), parse(b));
const bump = (from, to) => {
  const [a, b] = [parse(from), parse(to)];
  // Under 1.0 a minor is a major, and under 0.0 a patch is (semver caret rules).
  if (
    a[0] !== b[0] ||
    (a[0] === 0 && a[1] !== b[1]) ||
    (a[0] === 0 && a[1] === 0 && a[2] !== b[2])
  )
    return "MAJOR";
  return a[1] !== b[1] ? "minor" : "patch";
};
const sameLine = (from, to) => bump(from, to) !== "MAJOR";

// Enough of node-semver's range grammar for peer and engines fields: `||`, hyphen
// ranges, x-ranges, partial versions and the ^ ~ = < <= > >= operators.
const comparator = (v, c) => {
  const m = c.match(/^(>=|<=|>|<|=|\^|~)?v?(\d+|[xX*])(?:\.(\d+|[xX*]))?(?:\.(\d+|[xX*]))?/);
  if (!m) return true;
  const op = m[1] ?? "";
  const parts = [m[2], m[3], m[4]];
  const wild = parts.findIndex((p) => p === undefined || /[xX*]/.test(p));
  const n = wild === -1 ? 3 : wild;
  if (n === 0) return op !== "<" && op !== ">";
  const lo = parts.map((p, i) => (i < n ? Number(p) : 0));
  const next = (i) => lo.map((x, j) => (j < i ? x : j === i ? x + 1 : 0));
  const hi = n < 3 ? next(n - 1) : null;
  switch (op) {
    case "":
    case "=":
      return cmpT(v, lo) >= 0 && (hi ? cmpT(v, hi) < 0 : cmpT(v, lo) === 0);
    case ">=":
      return cmpT(v, lo) >= 0;
    case ">":
      return hi ? cmpT(v, hi) >= 0 : cmpT(v, lo) > 0;
    case "<":
      return cmpT(v, lo) < 0;
    case "<=":
      return hi ? cmpT(v, hi) < 0 : cmpT(v, lo) <= 0;
    case "~":
      return cmpT(v, lo) >= 0 && cmpT(v, next(n >= 2 ? 1 : 0)) < 0;
    case "^": {
      const i = lo[0] > 0 || n === 1 ? 0 : lo[1] > 0 || n === 2 ? 1 : 2;
      return cmpT(v, lo) >= 0 && cmpT(v, next(i)) < 0;
    }
  }
};
const satisfies = (version, range) => {
  const v = parse(version);
  return range.split("||").some((set) => {
    set = set.trim().replace(/(>=|<=|>|<|=|\^|~)\s+/g, "$1");
    const hyphen = set.match(/^(\S+)\s+-\s+(\S+)$/);
    const comps = hyphen ? [`>=${hyphen[1]}`, `<=${hyphen[2]}`] : set.split(/\s+/);
    return comps.filter(Boolean).every((c) => comparator(v, c));
  });
};

// The Node major the site builds on. No .nvmrc / engines field pins it — Vercel's Node version
// is a project setting in its dashboard — so default to the local major and let --node override.
// Vercel takes the newest N.x, so the local Node is a fair stand-in when its major matches.
const nodeMajor = Number(args.node ?? parse(process.versions.node)[0]);
const nodeProbe =
  parse(process.versions.node)[0] === nodeMajor ? process.versions.node : `${nodeMajor}.0.0`;
const nodeOk = (range) =>
  !range || Number.isNaN(nodeMajor) || satisfies(nodeProbe, range) ? "ok" : `NEEDS ${range}`;

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const direct = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
const installed = Object.fromEntries(
  direct.map((name) => {
    try {
      return [name, JSON.parse(readFileSync(`node_modules/${name}/package.json`, "utf8"))];
    } catch {
      return [name, null];
    }
  })
);

const outdated = JSON.parse(run("pnpm", "outdated", "--format", "json") || "{}");
const rows = [];

for (const [name, info] of Object.entries(outdated)) {
  const { current, latest } = info;
  if (!current || !latest || current === latest) continue;

  const meta = view(name, "time", "versions");
  const published = (v) => new Date(meta.time?.[v] ?? 0).getTime();
  const age = (v) => Math.floor((Date.now() - published(v)) / DAY);
  const stable = (meta.versions ?? []).filter((v) => !isPrerelease(v) && cmp(v, current) > 0);

  // Newest non-prerelease on the target's major line that has aged enough.
  const aged = stable.filter((v) => sameLine(latest, v) && age(v) >= MIN_AGE_DAYS).sort(cmp);
  let target = age(latest) >= MIN_AGE_DAYS ? latest : aged.at(-1);
  // Nothing on the new major is old enough yet: offer the newest aged release on the current line.
  if (!target) {
    target = stable
      .filter((v) => sameLine(current, v) && age(v) >= MIN_AGE_DAYS)
      .sort(cmp)
      .at(-1);
  }

  const flags = [];
  if (target !== latest)
    flags.push(`latest ${latest} is ${age(latest)}d old (< ${MIN_AGE_DAYS}d) — held back`);

  let detail = {};
  if (target) {
    const fields = ["_npmUser", "scripts", "gypfile", "license", "dist.attestations"];
    const [now, next] = [
      view(`${name}@${current}`, ...fields),
      view(
        `${name}@${target}`,
        ...fields,
        "deprecated",
        "engines",
        "peerDependencies",
        "repository.url"
      )
    ];
    // `gypfile: true` is the implicit `node-gyp rebuild` install step.
    const installScripts = (m) => [
      ...["preinstall", "install", "postinstall"].filter((k) => m.scripts?.[k]),
      ...(m.gypfile ? ["node-gyp"] : [])
    ];
    const [before, after] = [installScripts(now), installScripts(next)];

    if (next.deprecated) flags.push(`DEPRECATED: ${next.deprecated}`);
    // `_npmUser` is "name <email>" (a string on npm 12, an object on older CLIs).
    const who = (u) => (typeof u === "string" ? u.replace(/\s*<.*$/, "") : u?.name);
    if (who(now._npmUser) && who(next._npmUser) && who(now._npmUser) !== who(next._npmUser))
      flags.push(`publisher changed ${who(now._npmUser)} → ${who(next._npmUser)}`);
    // Trusted publishing that stops is the classic sign of a stolen token.
    if (now["dist.attestations"] && !next["dist.attestations"])
      flags.push("PROVENANCE LOST — current version was built with provenance, target was not");
    const added = after.filter((k) => !before.includes(k));
    if (added.length) flags.push(`NEW install script(s): ${added.join(", ")}`);
    if (now.license && next.license && now.license !== next.license)
      flags.push(`license ${now.license} → ${next.license}`);
    const engines = nodeOk(next.engines?.node);
    if (engines.startsWith("NEEDS"))
      flags.push(`engines.node ${engines} (the site builds on node ${nodeMajor})`);

    detail = {
      ageDays: age(target),
      provenance: next["dist.attestations"] ? "yes" : "no",
      installScripts: after,
      peerDependencies: next.peerDependencies ?? {},
      repository: next["repository.url"]
    };
  } else if (!flags.length) {
    flags.push(`nothing newer is ≥ ${MIN_AGE_DAYS}d old yet — skip this round`);
  }

  rows.push({
    name,
    current,
    latest,
    target: target ?? null,
    bump: target ? bump(current, target) : null,
    ...detail,
    flags
  });
}

// Peer ranges between direct dependencies, once every target is known, so a conflict that a
// coupled bump resolves says which bump.
// Snapshot each target's peers before the loop below deletes them from the rows; `npm view`
// with a single field returns the bare value, so re-querying `peerDependencies` alone would not.
const targetOf = Object.fromEntries(rows.filter((r) => r.target).map((r) => [r.name, r.target]));
const targetPeers = Object.fromEntries(
  rows.filter((r) => r.target).map((r) => [r.name, r.peerDependencies])
);
const peersAt = (name, version) =>
  version === installed[name]?.version
    ? (installed[name]?.peerDependencies ?? {})
    : (targetPeers[name] ?? {});

for (const r of rows.filter((r) => r.target)) {
  for (const [peer, range] of Object.entries(r.peerDependencies)) {
    const have = installed[peer]?.version;
    if (!have || satisfies(have, range)) continue;
    const t = targetOf[peer];
    r.flags.push(
      t && satisfies(t, range)
        ? `PEER needs ${peer} ${range} — bump ${peer} to ${t} with it`
        : `PEER needs ${peer} ${range} (installed ${have}${t ? `, safe target ${t}` : ""})`
    );
  }
  for (const dependent of direct) {
    const have = installed[dependent]?.version;
    if (!have || dependent === r.name) continue;
    const range = installed[dependent].peerDependencies?.[r.name];
    if (!range || satisfies(r.target, range)) continue;
    const t = targetOf[dependent];
    const later = t && peersAt(dependent, t)[r.name];
    r.flags.push(
      later && satisfies(r.target, later)
        ? `PEER ${dependent}@${have} accepts ${r.name} ${range} — bump ${dependent} to ${t} with it`
        : `PEER ${dependent}@${t ?? have} accepts ${r.name} ${later ?? range} — blocked until it widens`
    );
  }
  delete r.peerDependencies;
}

const order = { MAJOR: 0, minor: 1, patch: 2, null: 3 };
rows.sort((a, b) => order[a.bump] - order[b.bump] || a.name.localeCompare(b.name));

if (args.json) {
  console.log(JSON.stringify({ minAgeDays: MIN_AGE_DAYS, nodeMajor, rows }, null, 2));
} else if (!rows.length) {
  console.log("Everything is up to date.");
} else {
  console.log(`Min release age: ${MIN_AGE_DAYS}d · Node: ${nodeMajor}${args.node ? "" : " (local; pass --node=N if Vercel differs)"}\n`);
  for (const r of rows) {
    const head = r.target
      ? `${r.bump.padEnd(5)}  ${r.name}  ${r.current} → ${r.target}` +
        `  (${r.ageDays}d old, provenance: ${r.provenance}${r.installScripts.length ? `, install scripts: ${r.installScripts.join("/")}` : ""})`
      : `skip   ${r.name}  ${r.current} (latest ${r.latest})`;
    console.log(head);
    for (const f of r.flags) console.log(`         ⚠ ${f}`);
    if (r.repository && r.bump === "MAJOR") console.log(`         repo: ${r.repository}`);
  }
}
