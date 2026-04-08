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

    // Homepage manifesto
    "home.intro":
      "It's the decision to step away from the gravitational pull of the centre — from the noise, speed, and expectations of what is often called the imperial core — and to explore what a good life might look like at the edges.",
    "home.intro2": "This site is a record of that exploration.",
    "home.whatTitle": 'What I Mean by "Outer Reach"',
    "home.what1":
      "From a general perspective, the outer reach is where systems thin out. It's where complexity gives way to simplicity, where scale shrinks, and where life becomes more tangible.",
    "home.what2":
      "Geographically, it might be rural, mountainous, marginal, or sparsely populated. Economically, it often sits outside extractive growth logic. Culturally, it values autonomy, skill, community, and sufficiency over status and consumption.",
    "home.what3":
      "The outer reach isn't about dropping out or rejecting society entirely. It's about choosing distance — enough distance to see clearly, to breathe, and to live deliberately.",
    "home.whatPull":
      "It's the difference between being carried by the current and learning how to navigate your own river.",
    "home.swTitle": "The Star Wars Meaning",
    "home.swAside": "(Because Stories Matter)",
    "home.sw1":
      "In Star Wars, the galaxy is divided between the Core Worlds and the Outer Rim.",
    "home.sw2":
      "The Core is wealthy, bureaucratic, and powerful. It benefits most from the Empire's stability and extraction. The Outer Rim is rougher, less predictable, often ignored — but also freer. It's where smugglers, farmers, mechanics, rebels, and odd communities carve out lives on their own terms.",
    "home.sw3":
      "The Empire rarely understands the Outer Rim — and that's precisely why resistance, creativity, and alternative futures emerge there.",
    "home.sw4": "Outer Reach borrows from this idea.",
    "home.sw5":
      "I'm not interested in becoming a hero or fighting an empire with blasters. I'm interested in building a quiet rebellion: a life that is resilient, grounded, and human-scaled.",
    "home.coreTitle": "What Is the Imperial Core?",
    "home.core1":
      "In the real world, the imperial core isn't a single country or government. It's a system.",
    "home.core2":
      "It's the dense concentration of capital, power, infrastructure, attention, and decision-making that shapes how most of us are expected to live:",
    "home.coreList": [
      "Endless productivity and optimisation",
      "Growth without a clear purpose",
      "Disconnection from land, energy, and materials",
      "Lives mediated almost entirely through abstract systems",
    ],
    "home.core3":
      "Life in the core can be comfortable — but it often comes at the cost of autonomy, meaning, and ecological sanity.",
    "home.core4":
      "Outer Reach is not about moral superiority or escape fantasies. It's about asking a simple question:",
    "home.corePull":
      "What if a good life doesn't require being at the centre of everything?",
    "home.lifeTitle": "My Life Idea",
    "home.life1":
      "I believe life is still an adventure worth living — especially now.",
    "home.life2":
      "Not because things are easy, but because meaning emerges when we engage honestly with limits: ecological limits, social limits, personal limits.",
    "home.life3": "I'm interested in:",
    "home.lifeList": [
      "Living closer to land, climate, and seasons",
      "Retrofitting old things instead of endlessly building new ones",
      "Energy sufficiency rather than energy excess",
      "Skill, repair, and learning over convenience",
      "Community over scale",
      "Curiosity over certainty",
    ],
    "home.life4":
      "Outer Reach is where experimentation happens. It's where you're allowed to try, fail, adapt, and try again — without the constant pressure to perform for an invisible audience.",
    "home.findTitle": "What You'll Find Here",
    "home.find1": "This site is a living journal.",
    "home.find2": "You'll find reflections on:",
    "home.findList": [
      "Off-grid and low-energy living",
      "Place, landscape, and bioregions",
      "Work, value, and post-growth futures",
      "Learning, unlearning, and long transitions",
      "Building a life that feels coherent rather than impressive",
    ],
    "home.find3":
      "Outer Reach isn't about going backwards. It's about going sideways — into spaces where other futures are still possible.",
    "home.find4": "If you're here, you might already feel it too.",
    "home.findPull": "Welcome to the edge.",

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
    "rss.title": "Giardino Digitale",
    "rss.description": "Un giardino digitale di note e idee interconnesse",

    // Accessibility
    "a11y.toggleTheme": "Cambia tema",
    "a11y.switchLang": "Cambia lingua",

    // Homepage manifesto
    "home.intro":
      "È la decisione di allontanarsi dalla forza gravitazionale del centro — dal rumore, dalla velocità e dalle aspettative di ciò che viene spesso chiamato il nucleo imperiale — e di esplorare come potrebbe essere una bella vita ai margini.",
    "home.intro2": "Questo sito è un resoconto di quell'esplorazione.",
    "home.whatTitle": 'Cosa Intendo per "Outer Reach"',
    "home.what1":
      "Da una prospettiva generale, l'outer reach è dove i sistemi si assottigliano. È dove la complessità lascia spazio alla semplicità, dove la scala si riduce e dove la vita diventa più tangibile.",
    "home.what2":
      "Geograficamente, potrebbe essere rurale, montuoso, marginale o scarsamente popolato. Economicamente, spesso si colloca al di fuori della logica della crescita estrattiva. Culturalmente, valorizza l'autonomia, l'abilità, la comunità e la sufficienza rispetto allo status e al consumo.",
    "home.what3":
      "L'outer reach non significa abbandonare o rifiutare completamente la società. Significa scegliere la distanza — abbastanza distanza per vedere chiaramente, per respirare e per vivere deliberatamente.",
    "home.whatPull":
      "È la differenza tra essere trasportati dalla corrente e imparare a navigare il proprio fiume.",
    "home.swTitle": "Il Significato Star Wars",
    "home.swAside": "(Perché le Storie Contano)",
    "home.sw1":
      "In Star Wars, la galassia è divisa tra i Mondi del Nucleo e l'Orlo Esterno.",
    "home.sw2":
      "Il Nucleo è ricco, burocratico e potente. Beneficia maggiormente della stabilità e dell'estrazione dell'Impero. L'Orlo Esterno è più ruvido, meno prevedibile, spesso ignorato — ma anche più libero. È dove contrabbandieri, contadini, meccanici, ribelli e strane comunità si costruiscono vite alle proprie condizioni.",
    "home.sw3":
      "L'Impero raramente comprende l'Orlo Esterno — e proprio per questo la resistenza, la creatività e i futuri alternativi emergono lì.",
    "home.sw4": "Outer Reach prende in prestito questa idea.",
    "home.sw5":
      "Non mi interessa diventare un eroe o combattere un impero con i blaster. Mi interessa costruire una ribellione silenziosa: una vita resiliente, radicata e a misura d'uomo.",
    "home.coreTitle": "Cos'è il Nucleo Imperiale?",
    "home.core1":
      "Nel mondo reale, il nucleo imperiale non è un singolo paese o governo. È un sistema.",
    "home.core2":
      "È la densa concentrazione di capitale, potere, infrastrutture, attenzione e processo decisionale che modella il modo in cui la maggior parte di noi dovrebbe vivere:",
    "home.coreList": [
      "Produttività e ottimizzazione senza fine",
      "Crescita senza uno scopo chiaro",
      "Disconnessione dalla terra, dall'energia e dai materiali",
      "Vite mediate quasi interamente attraverso sistemi astratti",
    ],
    "home.core3":
      "La vita nel nucleo può essere comoda — ma spesso ha un costo in termini di autonomia, significato e sanità ecologica.",
    "home.core4":
      "Outer Reach non riguarda la superiorità morale o le fantasie di fuga. Si tratta di porre una semplice domanda:",
    "home.corePull":
      "E se una bella vita non richiedesse di essere al centro di tutto?",
    "home.lifeTitle": "La Mia Idea di Vita",
    "home.life1":
      "Credo che la vita sia ancora un'avventura che vale la pena vivere — specialmente ora.",
    "home.life2":
      "Non perché le cose siano facili, ma perché il significato emerge quando ci confrontiamo onestamente con i limiti: limiti ecologici, sociali, personali.",
    "home.life3": "Mi interessa:",
    "home.lifeList": [
      "Vivere più vicino alla terra, al clima e alle stagioni",
      "Ristrutturare le cose vecchie invece di costruirne sempre di nuove",
      "Sufficienza energetica piuttosto che eccesso energetico",
      "Abilità, riparazione e apprendimento rispetto alla comodità",
      "Comunità piuttosto che scala",
      "Curiosità piuttosto che certezza",
    ],
    "home.life4":
      "Outer Reach è dove avviene la sperimentazione. È dove ti è permesso provare, fallire, adattarti e riprovare — senza la pressione costante di esibirti per un pubblico invisibile.",
    "home.findTitle": "Cosa Troverai Qui",
    "home.find1": "Questo sito è un diario vivente.",
    "home.find2": "Troverai riflessioni su:",
    "home.findList": [
      "Vita off-grid e a basso consumo energetico",
      "Luogo, paesaggio e bioregioni",
      "Lavoro, valore e futuri post-crescita",
      "Imparare, disimparare e lunghe transizioni",
      "Costruire una vita che sia coerente piuttosto che impressionante",
    ],
    "home.find3":
      "Outer Reach non significa tornare indietro. Significa andare di lato — in spazi dove altri futuri sono ancora possibili.",
    "home.find4": "Se sei qui, forse lo senti anche tu.",
    "home.findPull": "Benvenuto ai margini.",

    // Now page
    "now.title": "Ora",
    "now.lastUpdated": "Ultimo aggiornamento",
  },
} as const;
