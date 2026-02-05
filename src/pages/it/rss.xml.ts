import rss from "@astrojs/rss";
import { getNotesForLocale } from "../../lib/garden";
import { slugFromNoteId } from "../../i18n/utils";

export async function GET(context) {
  const notes = await getNotesForLocale("it");
  const publishedNotes = notes.sort(
    (a, b) => b.data.created.valueOf() - a.data.created.valueOf(),
  );

  return rss({
    title: "Giardino Digitale",
    description: "Un giardino digitale di note e idee interconnesse",
    site: context.site,
    items: publishedNotes.map((note) => ({
      title: note.data.title,
      pubDate: note.data.created,
      description: note.data.description,
      link: `/it/garden/${slugFromNoteId(note.id)}/`,
      author: note.data.author,
    })),
    customData: `<language>it</language>`,
  });
}
