// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import remarkWikiLinks from "./src/plugins/remarkWikiLinks.ts";
import { unified } from "@astrojs/markdown-remark";
import { readFileSync } from "node:fs";

const { version } = JSON.parse(readFileSync("./package.json", "utf-8"));

// https://astro.build/config
export default defineConfig({
  site: "https://www.outerreach.life",
  i18n: {
    locales: ["en", "it"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: false,
    },
    // No `fallback`: every route is physically duplicated under pages/it/, so
    // locale fallback is redundant. Enabling it injected a synthetic `/it`
    // redirect that collided with the real pages/it/index.astro and emitted
    // empty routes for the (shared, unprefixed) /photos pages.
  },
  // Same type as antoniorossi.net: Instrument Serif for titles, Geist for text. The files are
  // the portfolio's latin subsets, vendored. The italic is Basic Latin only (no à/è/ì/ò/ù), so
  // keep it to short English accents such as the homepage title.
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Instrument Serif",
      cssVariable: "--font-serif",
      fallbacks: ["Georgia", "serif"],
      options: {
        variants: [
          {
            weight: "400",
            style: "normal",
            src: ["./src/assets/fonts/instrument-serif-latin-400-subset.woff2"],
          },
          {
            weight: "400",
            style: "italic",
            src: ["./src/assets/fonts/instrument-serif-latin-400-italic-subset.woff2"],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Geist",
      cssVariable: "--font-sans",
      fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
      options: {
        variants: [
          {
            weight: "400 600",
            style: "normal",
            src: ["./src/assets/fonts/geist-latin-400-600-subset.woff2"],
          },
        ],
      },
    },
  ],
  integrations: [mdx(), sitemap()],
  markdown: {
    processor: unified({
      gfm: true,
      remarkPlugins: [remarkWikiLinks],
    }),
  },
  vite: {
    define: {
      __APP_VERSION__: JSON.stringify(version),
    },
  },
});
