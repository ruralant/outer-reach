# Quick Start Guide

## What's Included

Your Astro blog is ready to use with:

✅ **Astro v5** - Latest version with Content Collections API  
✅ **Markdown & MDX** - Write content in markdown, add interactivity with MDX  
✅ **Type Safety** - Content Collections with TypeScript validation  
✅ **RSS Feed** - Automatic RSS generation at `/rss.xml`  
✅ **Sitemap** - Auto-generated SEO sitemap  
✅ **Scoped CSS** - Component-scoped styling with no conflicts  
✅ **Sample Posts** - Two example posts to get you started

## Next Steps

### 1. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your blog.

### 2. Create Your First Post

Add a new file to `src/content/blog/`:

```markdown
---
title: "My Awesome Post"
description: "An interesting blog post"
pubDate: 2026-01-15
author: "Your Name"
tags: ["astro", "blog"]
draft: false
---

Write your markdown content here!
```

### 3. Customize Configuration

Edit `astro.config.mjs` and update:

- `site: 'https://yourdomain.com'` - Your blog's domain
- Add more integrations as needed

### 4. Update Home Page

Edit `src/pages/index.astro` to customize the landing page with your own bio and links.

### 5. Deploy

Build and deploy your static site:

```bash
npm run build
```

## File Structure Reference

| File                               | Purpose                         |
| ---------------------------------- | ------------------------------- |
| `src/content/config.ts`            | Content Collections schema      |
| `src/content/blog/`                | Blog posts (markdown/MDX files) |
| `src/pages/index.astro`            | Home page                       |
| `src/pages/blog/index.astro`       | Blog listing page               |
| `src/pages/blog/[...slug].astro`   | Individual post pages           |
| `src/pages/rss.xml.ts`             | RSS feed generator              |
| `src/layouts/BlogPostLayout.astro` | Blog post layout                |
| `astro.config.mjs`                 | Astro configuration             |

## Common Tasks

### Add a New Blog Post

Create `src/content/blog/your-post-title.md`:

```markdown
---
title: "Your Post Title"
description: "Short description"
pubDate: 2026-01-15
author: "Your Name"
tags: ["tag1", "tag2"]
draft: false
---

Your content here...
```

### Add an Interactive Component (MDX)

Create `src/content/blog/interactive-post.mdx` and use React components:

```mdx
---
title: "Interactive Example"
...

---

<MyComponent prop="value" />
```

### Hide a Post as Draft

Set `draft: true` in the post's frontmatter. It won't appear in listings or RSS.

### Access RSS Feed

The RSS feed is available at `/rss.xml`

### Access Sitemap

The sitemap is generated at `/sitemap-index.xml` for SEO.

## Tips

- 📝 **Writing**: Use markdown for content, MDX only for interactive elements
- 🎨 **Styling**: Each component has scoped styles to avoid conflicts
- 📱 **Responsive**: All pages are mobile-friendly out of the box
- ⚡ **Performance**: Zero JavaScript by default - no bloat!
- 🔍 **SEO**: Automatic sitemap and proper meta tags

## Useful Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build static site
npm run preview      # Preview production build

# Maintenance
npm run check        # Check TypeScript errors
```

## Need Help?

- 📖 Read [BLOG_README.md](./BLOG_README.md) for detailed documentation
- 🌐 Visit [astro.build](https://docs.astro.build)
- 💬 Ask questions in [Astro Discord](https://astro.build/chat)

---

**Happy blogging!** 🚀
