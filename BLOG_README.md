# Astro Markdown Blog

A modern, performant blog built with **Astro v5** featuring markdown and MDX support with built-in RSS feeds and sitemap generation.

## Features

✨ **Core Features**

- ⚡ **Zero JavaScript by default** - Maximum performance, only JavaScript where needed
- 📝 **Content Collections API** - Type-safe markdown/MDX content management
- 🎨 **MDX Support** - Use interactive React components within markdown posts
- 📰 **RSS Feed** - Automatic RSS feed generation at `/rss.xml`
- 🗺️ **Sitemap** - Auto-generated sitemap for SEO at `/sitemap-index.xml`
- 💅 **Scoped CSS** - Component-scoped styling prevents conflicts

## Project Structure

```
src/
├── content/
│   ├── config.ts              # Content collections configuration
│   └── blog/                  # Blog posts collection
│       ├── getting-started-with-astro.md
│       └── mdx-interactive-components.mdx
├── layouts/
│   └── BlogPostLayout.astro   # Blog post wrapper layout
├── pages/
│   ├── index.astro            # Home page
│   ├── blog/
│   │   ├── index.astro        # Blog listing page
│   │   └── [...slug].astro    # Individual post dynamic route
│   └── rss.xml.ts            # RSS feed endpoint
├── styles/                    # (Optional) Global styles
└── components/                # (Optional) Reusable components
```

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The development server runs at `http://localhost:3000` by default.

## Creating Blog Posts

### Markdown Posts

Create files in `src/content/blog/` with `.md` extension:

```markdown
---
title: "My First Post"
description: "A short description of the post"
pubDate: 2026-01-15
updatedDate: 2026-01-16
author: "Your Name"
tags: ["astro", "markdown"]
draft: false
---

Your markdown content here...
```

### MDX Posts

For interactive components, use `.mdx` files in the same directory:

```mdx
---
title: "Interactive Post"
description: "Post with React components"
pubDate: 2026-01-15
author: "Your Name"
tags: ["mdx", "interactive"]
draft: false
---

Regular markdown content...

<InteractiveComponent />

More content...
```

### Frontmatter Fields

| Field         | Type     | Required | Description                                          |
| ------------- | -------- | -------- | ---------------------------------------------------- |
| `title`       | string   | Yes      | Post title                                           |
| `description` | string   | Yes      | Post description (used in meta and listing)          |
| `pubDate`     | date     | Yes      | Publication date (ISO format or parseable date)      |
| `updatedDate` | date     | No       | Last update date                                     |
| `author`      | string   | Yes      | Author name                                          |
| `tags`        | string[] | No       | Array of tags/categories                             |
| `draft`       | boolean  | No       | Set to `true` to hide from listings (default: false) |

## Configuration

### `astro.config.mjs`

Configure your site URL for RSS and sitemap:

```javascript
export default defineConfig({
  site: "https://yourdomain.com",
  integrations: [mdx(), sitemap()],
  markdown: {
    syntaxHighlight: "prism",
    gfm: true,
  },
});
```

### Content Collections Schema

Edit `src/content/config.ts` to customize post metadata validation:

```typescript
const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    // Add custom fields here
  }),
});
```

## Pages

### Home Page (`/`)

Landing page with navigation to blog and RSS feed.

### Blog Listing (`/blog`)

Displays all published posts in a grid, sorted by publication date (newest first).

### Individual Post (`/blog/[slug]`)

Full post view with:

- Metadata (author, date, tags)
- Markdown/MDX content with syntax highlighting
- Table of contents (auto-generated from headings)
- Responsive layout with sidebar TOC

### RSS Feed (`/rss.xml`)

Standard RSS feed containing all published posts. Subscribe using your favorite RSS reader.

### Sitemap (`/sitemap-index.xml`)

Auto-generated sitemap for search engines.

## Styling

All styling uses **Astro's built-in scoped CSS**, preventing style conflicts across components:

```astro
<style>
  /* Scoped to this component only */
  .my-class {
    color: blue;
  }
</style>
```

To style global elements, use `:global()`:

```astro
<style>
  :global(body) {
    font-family: system-ui;
  }
</style>
```

## Publishing

### Build

```bash
npm run build
```

The static site is generated in the `dist/` directory.

### Deployment

The blog can be deployed to any static hosting service:

- **Vercel** - `vercel deploy`
- **Netlify** - `netlify deploy`
- **GitHub Pages** - Push to `gh-pages` branch
- **Any static host** - Upload `dist/` folder

### Update Site URL

Before deploying, update the `site` URL in `astro.config.mjs`:

```javascript
export default defineConfig({
  site: "https://yourdomain.com",
  // ...
});
```

This ensures RSS feed links and sitemap URLs are correct.

## Performance Tips

1. **Keep MDX usage minimal** - Use markdown by default, MDX only for interactive elements
2. **Optimize images** - Use Astro's built-in image optimization
3. **Lazy load components** - Use the `client:lazy` directive in MDX
4. **Monitor bundle size** - Check component imports in MDX

## Advanced Usage

### Custom Components in MDX

Create reusable components in `src/components/`:

```astro
// src/components/CodeDemo.astro
---
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<div class="demo">
  <h3>{title}</h3>
  <slot />
</div>

<style>
  .demo {
    border: 1px solid #ddd;
    padding: 1rem;
    border-radius: 4px;
  }
</style>
```

Use in MDX:

```mdx
---
title: "My Post"
---

<CodeDemo title="Example">Some content here</CodeDemo>
```

### Querying Posts Programmatically

Get posts in any page:

```astro
---
import { getCollection } from 'astro:content';

// Get all published posts
const posts = (await getCollection('blog'))
  .filter(p => !p.data.draft)
  .sort((a, b) => b.data.pubDate - a.data.pubDate);
---
```

## Troubleshooting

### Posts not appearing

- Check the `.md` or `.mdx` file is in `src/content/blog/`
- Ensure frontmatter is valid YAML
- Verify `draft: false` or remove the field

### RSS feed empty

- Confirm posts have `draft: false` or no draft field
- Check `site` URL is set in `astro.config.mjs`

### Build errors

- Run `npm install` to ensure all dependencies are installed
- Check for TypeScript errors: `npm run check`

## Resources

- [Astro Documentation](https://docs.astro.build)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [MDX in Astro](https://docs.astro.build/en/guides/markdown-content/#mdx-only-features)
- [Astro RSS Integration](https://docs.astro.build/en/guides/rss/)

## License

MIT - Feel free to use this template for your own projects.
