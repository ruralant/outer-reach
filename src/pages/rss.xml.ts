import rss from "@astrojs/rss";
import { getNotesForLocale } from "../lib/garden";
import { slugFromNoteId } from "../i18n/utils";

export async function GET(context) {
  const notes = await getNotesForLocale("en");
  const publishedNotes = notes.sort(
    (a, b) => b.data.created.valueOf() - a.data.created.valueOf(),
  );

  return rss({
    title: "Digital Garden",
    description: "A digital garden of interconnected notes and ideas",
    site: context.site,
    items: publishedNotes.map((note) => ({
      title: note.data.title,
      pubDate: note.data.created,
      description: note.data.description,
      link: `/garden/${slugFromNoteId(note.id)}/`,
      author: note.data.author,
    })),
    customData: `<language>en-us</language>`,
  });
}
