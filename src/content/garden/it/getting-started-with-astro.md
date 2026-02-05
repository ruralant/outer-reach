---
title: "Iniziare con Astro"
description: "Impara a costruire siti web veloci e moderni con Astro e markdown"
created: 2026-01-15
author: "Antonio Rossi"
tags: ["astro", "sviluppo web", "markdown"]
status: evergreen
draft: false
---

## Introduzione

Astro è un framework web moderno che rende facile costruire siti web veloci e focalizzati sui contenuti. In questo articolo esploreremo le basi per costruire un blog con Astro.

## Perché Astro?

Astro porta diversi vantaggi allo sviluppo web:

- **Zero JavaScript di default** — Il tuo sito viene distribuito senza JavaScript a meno che tu non lo aggiunga esplicitamente
- **Contenuto al centro** — Progettato per contenuti guidati da markdown come i blog
- **Framework multipli** — Usa componenti React, Vue, Svelte o altri senza problemi
- **Ottime prestazioni** — Ottimizzazione automatica e overhead minimo

## Per Iniziare

Per creare un nuovo progetto Astro:

```bash
npm create astro@latest il-mio-blog
cd il-mio-blog
npm run dev
```

## Content Collections

L'API Content Collections di Astro rende facile organizzare e interrogare i tuoi contenuti:

```typescript
const posts = await getCollection("blog");
const publishedPosts = posts.filter((p) => !p.data.draft);
```

## Conclusione

Astro è un'ottima scelta per costruire blog e siti di contenuti moderni. Con la sua attenzione alle prestazioni e all'esperienza di sviluppo, vale la pena esplorarlo per il tuo prossimo progetto.

Una volta che hai preso confidenza con le basi, scopri come arricchire i tuoi contenuti con [[mdx-interactive-components|componenti interattivi MDX]].
