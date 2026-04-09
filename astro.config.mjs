// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import remarkWikiLinks from "./src/plugins/remarkWikiLinks.ts";
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
    fallback: {
      it: "en",
    },
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Roboto Serif",
      cssVariable: "--font-roboto-serif",
      fallbacks: ["serif"],
      options: {
        variants: [
          {
            weight: "100 900",
            style: "normal",
            src: ["./src/assets/fonts/RobotoSerif-VariableFont_GRAD,opsz,wdth,wght.ttf"],
          },
          {
            weight: "100 900",
            style: "italic",
            src: ["./src/assets/fonts/RobotoSerif-Italic-VariableFont_GRAD,opsz,wdth,wght.ttf"],
          },
        ],
      },
    },
  ],
  integrations: [mdx(), sitemap()],
  markdown: {
    gfm: true,
    remarkPlugins: [remarkWikiLinks],
  },
  vite: {
    define: {
      __APP_VERSION__: JSON.stringify(version),
    },
  },
});
