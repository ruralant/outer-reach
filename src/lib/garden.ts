import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import { slugFromNoteId } from "../i18n/utils";

export type GardenNote = CollectionEntry<"garden">;

export type NoteStatus = "seed" | "growing" | "evergreen" | "experimental";

/**
 * Get all published (non-draft) garden notes.
 */
export async function getAllNotes(): Promise<GardenNote[]> {
  const notes = await getCollection("garden");
  return notes.filter((note) => !note.data.draft);
}

/**
 * Get all published notes for a specific locale.
 */
export async function getNotesForLocale(locale: string): Promise<GardenNote[]> {
  const notes = await getAllNotes();
  return notes.filter((note) => note.id.startsWith(`${locale}/`));
}

/**
 * Extract wiki-link slugs from raw markdown body.
 *
 * Matches:
 *   [[slug]]
 *   [[slug|Display Text]]
 *
 * Returns an array of unique slugs (lowercased, trimmed).
 */
export function extractWikiLinks(body: string): string[] {
  const regex = /\[\[([^\]|]+?)(?:\|[^\]]+?)?\]\]/g;
  const slugs = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = regex.exec(body)) !== null) {
    slugs.add(match[1].trim());
  }

  return Array.from(slugs);
}

/**
 * Compute backlinks for a given note.
 *
 * Scans all published notes' raw markdown bodies for wiki-links
 * pointing to `currentId`. This is an O(n²) operation but runs
 * only at build time.
 */
export function getBacklinks(
  currentId: string,
  allNotes: GardenNote[],
): GardenNote[] {
  const currentSlug = slugFromNoteId(currentId);
  return allNotes.filter((note) => {
    if (note.id === currentId) return false;
    const links = extractWikiLinks(note.body ?? "");
    return links.includes(currentSlug);
  });
}

/**
 * Find notes that share at least one tag with the current note.
 * Sorted by number of shared tags (descending), then alphabetically.
 */
export function getRelatedNotes(
  currentNote: GardenNote,
  allNotes: GardenNote[],
  limit = 5,
): GardenNote[] {
  const currentTags = new Set(currentNote.data.tags);
  if (currentTags.size === 0) return [];

  const scored = allNotes
    .filter((note) => note.id !== currentNote.id)
    .map((note) => {
      const shared = note.data.tags.filter((t) => currentTags.has(t)).length;
      return { note, shared };
    })
    .filter(({ shared }) => shared > 0)
    .sort((a, b) => {
      if (b.shared !== a.shared) return b.shared - a.shared;
      return a.note.data.title.localeCompare(b.note.data.title);
    });

  return scored.slice(0, limit).map(({ note }) => note);
}

/**
 * Build a graph of notes and their wiki-link edges.
 * Used by the /garden/graph.json endpoint.
 */
export function getNoteGraph(allNotes: GardenNote[]) {
  const slugSet = new Set(allNotes.map((n) => slugFromNoteId(n.id)));

  const nodes = allNotes.map((note) => ({
    id: slugFromNoteId(note.id),
    title: note.data.title,
    status: note.data.status,
    tags: note.data.tags,
  }));

  const edges: { source: string; target: string }[] = [];

  for (const note of allNotes) {
    const links = extractWikiLinks(note.body ?? "");
    const sourceSlug = slugFromNoteId(note.id);
    for (const target of links) {
      // Only include edges to notes that actually exist
      if (slugSet.has(target)) {
        edges.push({ source: sourceSlug, target });
      }
    }
  }

  return { nodes, edges };
}

/**
 * Collect all unique tags across published notes.
 */
export function getAllTags(notes: GardenNote[]): string[] {
  const tagSet = new Set<string>();
  for (const note of notes) {
    for (const tag of note.data.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort();
}

/**
 * All valid note statuses in display order.
 */
export const ALL_STATUSES: NoteStatus[] = [
  "evergreen",
  "growing",
  "seed",
  "experimental",
];

/**
 * Status display metadata.
 */
export const STATUS_META: Record<
  NoteStatus,
  { label: string; emoji: string; description: string }
> = {
  seed: {
    label: "Seed",
    emoji: "🌱",
    description: "An early idea, just planted",
  },
  growing: {
    label: "Growing",
    emoji: "🌿",
    description: "Developing, still being refined",
  },
  evergreen: {
    label: "Evergreen",
    emoji: "🌳",
    description: "Mature, well-developed content",
  },
  experimental: {
    label: "Experimental",
    emoji: "🧪",
    description: "Exploratory, may change significantly",
  },
};
