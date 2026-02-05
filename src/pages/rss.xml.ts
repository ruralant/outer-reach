import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const blog = await getCollection("blog");
  const publishedPosts = blog
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: "My Blog",
    description: "A blog about web development and technology",
    site: context.site,
    items: publishedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}/`,
      author: post.data.author,
    })),
    customData: `<language>en-us</language>`,
  });
}
