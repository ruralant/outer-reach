# Outer Reach Life - Astro Blog

A static blog built with **Astro v5**, featuring markdown/MDX content, RSS feeds, sitemap, and a light/dark theme system.

## Quick Start

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:4321
npm run build        # Build static site to ./dist/
npm run preview      # Preview production build
npm run astro check  # Check for TypeScript errors
```

## Project Structure

```
src/
├── components/
│   └── ThemeToggle.astro          # Light/dark theme toggle button
├── content/
│   ├── config.ts                  # Content Collections schema
│   └── blog/                      # Blog posts (.md and .mdx files)
├── layouts/
│   ├── BaseLayout.astro           # Shared layout with theme support
│   └── BlogPostLayout.astro       # Blog post wrapper layout
└── pages/
    ├── index.astro                # Home page
    ├── blog/
    │   ├── index.astro            # Blog listing
    │   └── [...slug].astro        # Dynamic post routes
    └── rss.xml.ts                 # RSS feed endpoint
```

## Creating Blog Posts

Add `.md` or `.mdx` files to `src/content/blog/`:

```markdown
---
title: "My Post Title"
description: "A short description"
pubDate: 2026-01-15
updatedDate: 2026-01-16  # optional
author: "Your Name"
tags: ["astro", "blog"]  # optional
draft: false              # set true to hide from listings
---

Your markdown content here...
```

For interactive components, use `.mdx` files and import React/Astro components directly.

### Frontmatter Fields

| Field         | Type     | Required | Description                          |
| ------------- | -------- | -------- | ------------------------------------ |
| `title`       | string   | Yes      | Post title                           |
| `description` | string   | Yes      | Used in meta tags and listings       |
| `pubDate`     | date     | Yes      | Publication date                     |
| `updatedDate` | date     | No       | Last update date                     |
| `author`      | string   | Yes      | Author name                          |
| `tags`        | string[] | No       | Tags/categories                      |
| `draft`       | boolean  | No       | Hide from listings (default: false)  |

## Theme System

The site includes a light/dark theme with automatic OS preference detection, a toggle button (top-right corner), and persistent user preference via `localStorage`.

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Your Astro Blog                          │
└─────────────────────────────────────────────────────────────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
         ┌──────▼────────┐  ┌────▼──────────┐  ┌─▼────────────┐
         │  index.astro  │  │ blog/index    │  │ [...slug]    │
         │  (Home Page)  │  │ (Blog List)   │  │ (Blog Post)  │
         └──────┬────────┘  └────┬──────────┘  └─┬────────────┘
                │                │              │
                └────────────────┼──────────────┘
                                 │
                        ┌────────▼─────────┐
                        │ BaseLayout.astro │
                        │                  │
                        │ ┌──────────────┐ │
                        │ │ CSS Variables│ │
                        │ │   (Colors)   │ │
                        │ └──────────────┘ │
                        │ ┌──────────────┐ │
                        │ │  ThemeToggle │ │
                        │ │  (Component) │ │
                        │ └──────────────┘ │
                        └────────┬─────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
            ┌───────▼────────┐      ┌────────▼──────┐
            │  Theme Script  │      │ CSS Vars      │
            │                │      │               │
            │ • Detect OS    │      │ Light Theme:  │
            │ • Check Store  │      │ • #333 text   │
            │ • Apply Theme  │      │ • #fff bg     │
            │ • Save Pref    │      │               │
            │ • Toggle on    │      │ Dark Theme:   │
            │   click        │      │ • #e0e0e0 txt │
            └────────┬───────┘      │ • #1a1a1a bg  │
                     │              └────────┬──────┘
                     │                       │
            ┌────────▼───────────────────────▼─────────┐
            │     localStorage (Browser)                │
            │                                           │
            │  Key: 'theme'                             │
            │  Value: 'light' or 'dark'                │
            │  (Persists across sessions)               │
            └───────────────────────────────────────────┘
```

### Theme Data Flow

```
PAGE LOAD → Check localStorage → Theme found? → Apply saved theme
                                → No theme?   → Check OS preference → Apply matching theme

USER CLICKS TOGGLE → Switch theme → Update data-theme attribute
                                   → CSS variables resolve to new colors (0.3s transition)
                                   → Save to localStorage

NEXT VISIT → localStorage has saved preference → Apply immediately
```

### Customising Colours

Edit CSS variables in `src/layouts/BaseLayout.astro`:

```css
/* Light mode */
:root {
  --color-text-primary: #333;
  --color-background: #ffffff;
  --color-accent: #667eea;
}

/* Dark mode */
[data-theme="dark"] {
  --color-text-primary: #e0e0e0;
  --color-background: #1a1a1a;
  --color-accent: #8b9eff;
}
```

### Adding Theme to New Pages

Wrap content with `BaseLayout` - theme applies automatically:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="My Page">
  Your content here
</BaseLayout>
```

## Configuration

Update `astro.config.mjs` before deploying:

```javascript
export default defineConfig({
  site: "https://yourdomain.com", // Change this to your domain
  integrations: [mdx(), sitemap()],
  markdown: {
    syntaxHighlight: "prism",
    gfm: true,
  },
});
```

## Deployment

Build with `npm run build`, then deploy the `dist/` folder. Works with any static host:

- **Vercel** - Import repo, auto-detects Astro, deploy
- **Netlify** - New site from Git, build command: `npm run build`, publish dir: `dist`
- **GitHub Pages** - Add a CI/CD workflow (see [Astro docs](https://docs.astro.build/en/guides/deploy/github/))
- **Cloudflare Pages / AWS Amplify** - Similar flow, set build output to `dist`

After deploying, verify `/rss.xml` and `/sitemap-index.xml` are accessible.

## Troubleshooting

**Posts not appearing** - Check the file is in `src/content/blog/`, frontmatter is valid YAML, and `draft` is not `true`.

**RSS feed empty** - Ensure `site` URL is set in `astro.config.mjs` and rebuild.

**Theme not persisting** - Check that localStorage and JavaScript are enabled in the browser.

**Build errors** - Run `npm install` and `npm run astro check`.

## Resources

- [Astro Documentation](https://docs.astro.build)
- [Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [MDX in Astro](https://docs.astro.build/en/guides/markdown-content/#mdx-only-features)
- [RSS Integration](https://docs.astro.build/en/guides/rss/)
