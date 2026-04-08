import rss from "@astrojs/rss";
import { getNotesForLocale } from "../lib/garden";
import { getSortedPostsForLocale } from "../lib/blog";
import { useTranslations, slugFromNoteId } from "../i18n/utils";

export async function GET(context) {
  const t = useTranslations("en");
  const notes = await getNotesForLocale("en");
  const publishedNotes = notes.sort(
    (a, b) => b.data.created.valueOf() - a.data.created.valueOf(),
  );
  const posts = await getSortedPostsForLocale("en");

  return rss({
    title: t("rss.title") as string,
    description: t("rss.description") as string,
    site: context.site,
    items: [
      ...publishedNotes.map((note) => ({
        title: note.data.title,
        pubDate: note.data.created,
        description: note.data.description,
        link: `/garden/${slugFromNoteId(note.id)}/`,
        author: note.data.author,
      })),
      ...posts.map((post) => ({
        title: post.data.title,
        pubDate: post.data.published,
        description: post.data.description,
        link: `/blog/${slugFromNoteId(post.id)}/`,
        author: post.data.author,
      })),
    ],
    customData: `<language>en-us</language>`,
  });
}
