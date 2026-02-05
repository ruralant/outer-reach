// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import remarkWikiLinks from "./src/plugins/remarkWikiLinks.ts";

// https://astro.build/config
export default defineConfig({
  site: "https://www.outerreach.life",
  i18n: {
    locales: ["en", "it"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: false,
    },
    fallback: {
      it: "en",
    },
  },
  integrations: [mdx(), sitemap()],
  markdown: {
    syntaxHighlight: "prism",
    gfm: true,
    remarkPlugins: [remarkWikiLinks],
  },
});
