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
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Roboto Serif",
      cssVariable: "--font-roboto-serif",
      fallbacks: ["serif"],
      // Trimmed from the full variable fonts (opsz 8–144, wght 100–900) to cut
      // page weight: opsz pinned at 20, upright keeps wght 400–700 (all the CSS
      // uses), italic is a static 400. Regenerate with fonttools:
      //   fonttools varLib.instancer RobotoSerif-Variable.woff2 opsz=20 wght=400:700 -o up.ttf
      //   fonttools varLib.instancer RobotoSerif-Italic-Variable.woff2 opsz=20 wght=400 -o it.ttf
      //   pyftsubset <ttf> --unicodes='*' --layout-features='*' --flavor=woff2 --output-file=<woff2>
      options: {
        variants: [
          {
            weight: "400 700",
            style: "normal",
            src: ["./src/assets/fonts/RobotoSerif-Wght400-700.woff2"],
          },
          {
            weight: "400",
            style: "italic",
            src: ["./src/assets/fonts/RobotoSerif-Italic-400.woff2"],
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
