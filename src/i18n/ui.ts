export const languages = {
  en: "English",
  it: "Italiano",
} as const;

export const defaultLang = "en" as const;

export type Lang = keyof typeof languages;

/**
 * All translatable UI strings, keyed by dotted path.
 * The `en` locale must be complete; other locales fall back to `en` for missing keys.
 */
export const ui = {
  en: {
    // Site-wide
    "site.title": "Outer Reach",
    "site.tagline": "A way of living, not a place on a map.",
    "site.footer": `© 2025-2026 · Outer Reach · Made with ❤️ and care for the 🌍`,

    // Navigation
    "nav.garden": "Garden",
    "nav.blog": "Blog",
    "nav.now": "Now",
    "nav.photos": "Photos",
    "nav.home": "Home",
    "nav.rss": "RSS",
    "nav.backToGarden": "← Garden",
    "nav.backToGardenLong": "← Back to Garden",
    "nav.backToBlog": "← Blog",
    "nav.backToBlogLong": "← Back to Blog",
    "nav.backToTags": "← Tags",
    "nav.exploreGarden": "Explore the Garden →",
    "nav.manifesto": "Read the manifesto →",

    // Homepage
    "home.recentPhotos": "Recent Photos",

    // Photos
    "photos.title": "Photos",
    "photos.description": "A collection of photographs.",
    "photos.empty": "No photos yet.",

    // Garden index
    "garden.title": "Garden",
    "garden.subtitle":
      "A collection of interconnected notes, ideas, and evergreen content. Notes grow over time — from seeds to evergreen.",
    "garden.recentNotes": "Recent Notes",
    "garden.filterStatus": "Status",
    "garden.filterTags": "Tags",
    "garden.randomNote": "🎲 Random Note",
    "garden.noNotes": "No notes yet. Start planting seeds.",
    "garden.noNotesStatus": "No notes with this status yet.",
    "garden.withThisTag": "with this tag",

    // Blog
    "blog.title": "Blog",
    "blog.subtitle":
      "Monthly reflections, updates, and dispatches from the edge.",
    "blog.published": "Published",
    "blog.updated": "Updated",
    "blog.noPosts": "No posts yet.",
    "blog.post": "post",
    "blog.posts": "posts",
    "blog.tagsSubtitle": "Browse blog posts by topic",
    "blog.postsTagged": "Posts tagged",
    "blog.recentPosts": "Recent Posts",

    // Note meta
    "note.by": "By",
    "note.planted": "Planted",
    "note.tended": "Tended",
    "note.contents": "Contents",
    "note.linkedFrom": "Linked From",
    "note.relatedNotes": "Related Notes",
    "note.note": "note",
    "note.notes": "notes",

    // Tags page
    "tags.title": "Tags",
    "tags.subtitle": "Browse notes by topic",

    // Status labels
    "status.seed": "Seed",
    "status.growing": "Growing",
    "status.evergreen": "Evergreen",
    "status.experimental": "Experimental",
    "status.seed.description": "An early idea, just planted",
    "status.growing.description": "Developing, still being refined",
    "status.evergreen.description": "Mature, well-developed content",
    "status.experimental.description": "Exploratory, may change significantly",

    // RSS
    "rss.title": "Outer Reach",
    "rss.description":
      "A journey towards a rural and sufficient life at the far edge of society.",

    // Accessibility
    "a11y.toggleTheme": "Toggle theme",
    "a11y.switchLang": "Switch language",

    // Now page
    "now.title": "Now",
    "now.lastUpdated": "Last updated",
  },
  it: {
    // Site-wide
    "site.title": "Outer Reach",
    "site.tagline": "Un modo di vivere, non un punto sulla mappa.",
    "site.footer": `© 2025-2026 · Outer Reach · Realizzato con ❤️ da... me`,

    // Navigation
    "nav.garden": "Giardino",
    "nav.blog": "Blog",
    "nav.now": "Ora",
    "nav.photos": "Foto",
    "nav.home": "Home",
    "nav.rss": "RSS",
    "nav.backToGarden": "← Giardino",
    "nav.backToGardenLong": "← Torna al Giardino",
    "nav.backToBlog": "← Blog",
    "nav.backToBlogLong": "← Torna al Blog",
    "nav.backToTags": "← Tag",
    "nav.exploreGarden": "Esplora il Giardino →",
    "nav.manifesto": "Leggi il manifesto →",

    // Homepage
    "home.recentPhotos": "Foto Recenti",

    // Photos
    "photos.title": "Foto",
    "photos.description": "Una raccolta di fotografie.",
    "photos.empty": "Ancora nessuna foto.",

    // Garden index
    "garden.title": "Giardino",
    "garden.subtitle":
      "Una raccolta di note interconnesse, idee e contenuti sempreverdi. Le note crescono nel tempo — da semi a sempreverdi.",
    "garden.recentNotes": "Note Recenti",
    "garden.filterStatus": "Stato",
    "garden.filterTags": "Tag",
    "garden.randomNote": "🎲 Nota Casuale",
    "garden.noNotes": "Ancora nessuna nota. Inizia a piantare semi.",
    "garden.noNotesStatus": "Ancora nessuna nota con questo stato.",
    "garden.withThisTag": "con questo tag",

    // Blog
    "blog.title": "Blog",
    "blog.subtitle":
      "Riflessioni mensili, aggiornamenti e dispacci dal margine.",
    "blog.published": "Pubblicato",
    "blog.updated": "Aggiornato",
    "blog.noPosts": "Ancora nessun articolo.",
    "blog.post": "articolo",
    "blog.posts": "articoli",
    "blog.tagsSubtitle": "Esplora gli articoli per argomento",
    "blog.postsTagged": "Articoli con tag",
    "blog.recentPosts": "Articoli Recenti",

    // Note meta
    "note.by": "Di",
    "note.planted": "Piantato",
    "note.tended": "Curato",
    "note.contents": "Indice",
    "note.linkedFrom": "Collegato Da",
    "note.relatedNotes": "Note Correlate",
    "note.note": "nota",
    "note.notes": "note",

    // Tags page
    "tags.title": "Tag",
    "tags.subtitle": "Esplora le note per argomento",

    // Status labels
    "status.seed": "Seme",
    "status.growing": "In Crescita",
    "status.evergreen": "Sempreverde",
    "status.experimental": "Sperimentale",
    "status.seed.description": "Un'idea iniziale, appena piantata",
    "status.growing.description": "In sviluppo, ancora in fase di rifinitura",
    "status.evergreen.description": "Maturo, contenuto ben sviluppato",
    "status.experimental.description":
      "Esplorativo, potrebbe cambiare significativamente",

    // RSS
    "rss.title": "Note del giardino e articoli del blog",
    "rss.description":
      "Feed RSS con le note del giardino e gli articoli del blog in italiano.",

    // Accessibility
    "a11y.toggleTheme": "Cambia tema",
    "a11y.switchLang": "Cambia lingua",

    // Now page
    "now.title": "Ora",
    "now.lastUpdated": "Ultimo aggiornamento",
  },
} as const;
