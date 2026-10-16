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
    "footer.carbon.perView": "/view",
    "footer.carbon.cleaner": "Cleaner than {pct}% of pages tested",

    // Navigation
    "nav.garden": "Garden",
    "nav.blog": "Blog",
    "nav.now": "Now",
    "nav.photos": "Photos",
    "nav.home": "Home",
    "nav.rss": "RSS",
    "nav.exploreGarden": "Explore the garden",
    "nav.manifesto": "Read the manifesto",
    "nav.main": "Main",
    "menu.open": "Menu",
    "menu.close": "Close",

    // Footer
    "footer.site": "Site",
    "footer.elsewhere": "Elsewhere",
    "footer.rss": "RSS feed",

    // Homepage
    "home.recentPhotos": "Recent photos",
    "home.eyebrowWriting": "Writing",
    "home.illustration":
      "Illustration of a solarpunk house on a floating island: a rammed-earth cottage with solar panels on its roof, a glass dome greenhouse, a wind turbine, fruit trees and cypresses, raised vegetable beds, a beehive and a pond that spills over the edge as a waterfall",

    // Photos
    "photos.title": "Photos",
    "photos.description": "A collection of photographs.",
    "photos.empty": "No photos yet.",
    "photos.heading": "Seen along the way",
    "photos.all": "All photos",
    "exif.camera": "Camera",
    "exif.lens": "Lens",
    "exif.focalLength": "Focal length",
    "exif.aperture": "Aperture",
    "exif.shutter": "Shutter",
    "exif.iso": "ISO",
    "exif.date": "Taken",

    // Garden index
    "garden.title": "Garden",
    "garden.subtitle":
      "A collection of interconnected notes, ideas, and evergreen content. Notes grow over time — from seeds to evergreen.",
    "garden.heading": "Notes that grow over time",
    "garden.recentNotes": "Recent notes",
    "garden.all": "All notes",
    "garden.filterStatus": "Status",
    "garden.filterTags": "Tags",
    "garden.randomNote": "Random note",
    "garden.noNotes": "No notes yet. Start planting seeds.",
    "garden.noNotesStatus": "No notes with this status yet.",
    "garden.withThisTag": "with this tag",

    // Blog
    "blog.title": "Blog",
    "blog.subtitle":
      "Monthly reflections, updates, and dispatches from the edge.",
    "blog.heading": "Dispatches from the edge",
    "blog.all": "All posts",
    "blog.published": "Published",
    "blog.updated": "Updated",
    "blog.noPosts": "No posts yet.",
    "blog.post": "post",
    "blog.posts": "posts",
    "blog.tagsSubtitle": "Browse blog posts by topic",
    "blog.recentPosts": "Recent posts",

    // Note meta
    "note.author": "Author",
    "note.planted": "Planted",
    "note.tended": "Tended",
    "note.contents": "Contents",
    "note.linkedFrom": "Linked from",
    "note.relatedNotes": "Related notes",
    "note.note": "note",
    "note.notes": "notes",

    // Tags page
    "tags.title": "Tags",
    "tags.subtitle": "Browse notes by topic",
    "tags.tag": "Tag",
    "tags.all": "All tags",

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
    "footer.carbon.perView": "/visita",
    "footer.carbon.cleaner": "Più pulito di {pct} pagine testate su 100",

    // Navigation
    "nav.garden": "Giardino",
    "nav.blog": "Blog",
    "nav.now": "Ora",
    "nav.photos": "Foto",
    "nav.home": "Home",
    "nav.rss": "RSS",
    "nav.exploreGarden": "Esplora il giardino",
    "nav.manifesto": "Leggi il manifesto",
    "nav.main": "Principale",
    "menu.open": "Menu",
    "menu.close": "Chiudi",

    // Footer
    "footer.site": "Sito",
    "footer.elsewhere": "Altrove",
    "footer.rss": "Feed RSS",

    // Homepage
    "home.recentPhotos": "Foto recenti",
    "home.eyebrowWriting": "Scritti",
    "home.illustration":
      "Illustrazione di una casa solarpunk su un'isola sospesa: un cottage in terra cruda con pannelli solari sul tetto, una serra a cupola di vetro, una turbina eolica, alberi da frutto e cipressi, orti rialzati, un alveare e uno stagno che trabocca dal bordo in una cascata",

    // Photos
    "photos.title": "Foto",
    "photos.description": "Una raccolta di fotografie.",
    "photos.empty": "Ancora nessuna foto.",
    "photos.heading": "Visto lungo la strada",
    "photos.all": "Tutte le foto",
    "exif.camera": "Fotocamera",
    "exif.lens": "Obiettivo",
    "exif.focalLength": "Lunghezza focale",
    "exif.aperture": "Apertura",
    "exif.shutter": "Tempo di scatto",
    "exif.iso": "ISO",
    "exif.date": "Scattata",

    // Garden index
    "garden.title": "Giardino",
    "garden.subtitle":
      "Una raccolta di note interconnesse, idee e contenuti sempreverdi. Le note crescono nel tempo — da semi a sempreverdi.",
    "garden.heading": "Note che crescono nel tempo",
    "garden.recentNotes": "Note recenti",
    "garden.all": "Tutte le note",
    "garden.filterStatus": "Stato",
    "garden.filterTags": "Tag",
    "garden.randomNote": "Nota casuale",
    "garden.noNotes": "Ancora nessuna nota. Inizia a piantare semi.",
    "garden.noNotesStatus": "Ancora nessuna nota con questo stato.",
    "garden.withThisTag": "con questo tag",

    // Blog
    "blog.title": "Blog",
    "blog.subtitle":
      "Riflessioni mensili, aggiornamenti e dispacci dal margine.",
    "blog.heading": "Dispacci dal margine",
    "blog.all": "Tutti gli articoli",
    "blog.published": "Pubblicato",
    "blog.updated": "Aggiornato",
    "blog.noPosts": "Ancora nessun articolo.",
    "blog.post": "articolo",
    "blog.posts": "articoli",
    "blog.tagsSubtitle": "Esplora gli articoli per argomento",
    "blog.recentPosts": "Articoli recenti",

    // Note meta
    "note.author": "Autore",
    "note.planted": "Piantato",
    "note.tended": "Curato",
    "note.contents": "Indice",
    "note.linkedFrom": "Collegato da",
    "note.relatedNotes": "Note correlate",
    "note.note": "nota",
    "note.notes": "note",

    // Tags page
    "tags.title": "Tag",
    "tags.subtitle": "Esplora le note per argomento",
    "tags.tag": "Tag",
    "tags.all": "Tutti i tag",

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
