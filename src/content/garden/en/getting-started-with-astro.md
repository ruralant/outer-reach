---
title: "Getting Started with Astro"
description: "Learn how to build fast, modern websites with Astro and markdown"
created: 2026-01-15
author: "Antonio Rossi"
tags: ["astro", "web development", "markdown"]
status: evergreen
draft: false
---

## Introduction

Astro is a modern web framework that makes it easy to build fast, content-focused websites. In this post, we'll explore the basics of building a blog with Astro.

## Why Astro?

Astro brings several advantages to web development:

- **Zero JavaScript by default** - Your site ships with zero JavaScript unless you explicitly opt-in
- **Content-first** - Built for markdown-driven content like blogs
- **Multiple frameworks** - Use React, Vue, Svelte, or other components seamlessly
- **Great performance** - Automatic optimization and minimal overhead

## Getting Started

To create a new Astro project:

```bash
npm create astro@latest my-blog
cd my-blog
npm run dev
```

## Content Collections

Astro's Content Collections API makes it easy to organize and query your content:

```typescript
const posts = await getCollection("blog");
const publishedPosts = posts.filter((p) => !p.data.draft);
```

## Conclusion

Astro is an excellent choice for building modern blogs and content sites. With its focus on performance and developer experience, it's worth exploring for your next project.

Once you're comfortable with the basics, check out how to enhance your content with [[mdx-interactive-components|interactive MDX components]].
