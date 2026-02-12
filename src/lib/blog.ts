import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

/**
 * Get all published (non-draft) blog posts.
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  const posts = await getCollection("blog");
  return posts.filter((post) => !post.data.draft);
}

/**
 * Get all published posts sorted by published date (newest first).
 */
export async function getSortedPosts(): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.sort(
    (a, b) => b.data.published.valueOf() - a.data.published.valueOf(),
  );
}

/**
 * Get all unique tags from blog posts.
 */
export function getAllBlogTags(posts: BlogPost[]): string[] {
  const tagSet = new Set<string>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort();
}
