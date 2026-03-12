import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const garden = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/garden" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    status: z
      .enum(["seed", "growing", "evergreen", "experimental"])
      .default("seed"),
    created: z.coerce.date(),
    updated: z.coerce.date().optional(),
    author: z.string().optional(),
    draft: z.boolean().optional().default(false),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    author: z.string().optional(),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { garden, blog };
