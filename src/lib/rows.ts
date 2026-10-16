import type { BlogPost } from "./blog";
import type { GardenNote } from "./garden";
import { localePath, gardenNotePath, slugFromNoteId } from "../i18n/utils";

/** Props for a `ListRow` showing a blog post. */
export function postRow(post: BlogPost, lang: string, { withTags = true } = {}) {
  return {
    href: localePath(lang, `/blog/${slugFromNoteId(post.id)}`),
    title: post.data.title,
    description: post.data.description,
    date: post.data.published,
    tags: withTags
      ? post.data.tags.map((tag) => ({ label: tag, href: localePath(lang, `/blog/tags/${tag}`) }))
      : [],
  };
}

/** Props for a `ListRow` showing a garden note. */
export function noteRow(note: GardenNote, lang: string, { withTags = true } = {}) {
  return {
    href: gardenNotePath(lang, slugFromNoteId(note.id)),
    title: note.data.title,
    description: note.data.description,
    date: note.data.created,
    status: note.data.status,
    tags: withTags
      ? note.data.tags.map((tag) => ({ label: tag, href: localePath(lang, `/garden/tags/${tag}`) }))
      : [],
  };
}
