# Theme System Architecture

## 🏗️ Component Structure

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

## 🔄 Data Flow Diagram

```
PAGE LOAD
   │
   ▼
[Theme Script Initializes]
   │
   ├─► Check localStorage.getItem('theme')
   │   │
   │   ├─► Theme Found? ────► YES ──► Apply Saved Theme ──┐
   │   │                                                   │
   │   └─► No Theme? ────► Check System Preference         │
   │                       │                               │
   │                       ├─► prefers-color-scheme: dark? │
   │                       │   │                           │
   │                       │   ├─► YES ──► Apply Dark ────┤
   │                       │   │                           │
   │                       │   └─► NO ──► Apply Light ────┤
   │                                                       │
   ▼───────────────────────────────────────────────────────┘
[Apply Theme]
   │
   ├─► Set data-theme attribute on <html>
   │
   ├─► Set body class (light-mode or dark-mode)
   │
   ├─► CSS Variables resolve to theme colors
   │
   ▼
[User Sees Page in Correct Theme]

───────────────────────────────────────────────────

USER CLICKS TOGGLE
   │
   ▼
[Get Current Theme]
   │
   ▼
[Determine New Theme]
   │  (light ↔ dark)
   │
   ▼
[Update data-theme attribute]
   │
   ├─► HTML attribute changes
   │
   ├─► CSS Variables switch
   │
   ├─► Colors fade smoothly (0.3s)
   │
   ▼
[Save to localStorage]
   │
   └─► localStorage.setItem('theme', newTheme)

───────────────────────────────────────────────────

NEXT PAGE VISIT
   │
   ▼
[Theme Script Runs Again]
   │
   ▼
[Check localStorage]
   │
   └─► Saved Preference Found ──► Apply It Immediately
```

## 📁 File Dependencies

```
BaseLayout.astro
├── Imports ThemeToggle.astro
│   └── Contains theme script
│       ├── Reads/Writes localStorage
│       └── Listens for media query changes
│
└── Defines CSS Variables (Global Styles)
    ├── Light mode variables (:root)
    └── Dark mode variables ([data-theme='dark'])


All Pages (index, blog/index, blog posts)
├── Import BaseLayout
├── Receive theme support automatically
├── Use CSS variables for colors
└── Render with ThemeToggle button
```

## 🎨 CSS Variable Hierarchy

```
BaseLayout.astro (Global Scope)
│
├─ :root selector
│  └─ Light mode defaults
│     ├─ --color-text-primary: #333
│     ├─ --color-background: #ffffff
│     └─ ... 10 more variables
│
└─ [data-theme='dark'] selector
   └─ Dark mode overrides
      ├─ --color-text-primary: #e0e0e0
      ├─ --color-background: #1a1a1a
      └─ ... 10 more variables

        ↓ USED IN ↓

Component Styles
├─ .content { color: var(--color-text-primary); }
├─ .header { background: var(--color-background); }
├─ .link { color: var(--color-accent); }
└─ ... all pages inherit these

        ↓ RESULT ↓

Light Mode Colors
├─ Text appears dark
├─ Background appears light
└─ Links appear purple

Dark Mode Colors
├─ Text appears light
├─ Background appears dark
└─ Links appear light-purple
```

## 🔌 JavaScript Integration Points

```
ThemeToggle.astro
│
├─ Script Block
│  ├─ initializeTheme()
│  │  └─ Runs on page load
│  │
│  ├─ applyTheme(theme)
│  │  ├─ Updates HTML attribute
│  │  ├─ Updates body class
│  │  ├─ Saves to localStorage
│  │  └─ Triggers CSS transition
│  │
│  ├─ toggleTheme()
│  │  └─ Switches light ↔ dark
│  │
│  └─ Event Listeners
│     ├─ Button click → toggleTheme()
│     └─ System change → applyTheme() [if no manual override]
│
└─ HTML/SVG Elements
   ├─ <button id="theme-toggle">
   │  ├─ .sun-icon (visible in light mode)
   │  └─ .moon-icon (visible in dark mode)
   │
   └─ CSS Transitions
      └─ Smooth fade on toggle
```

## 💾 Storage Schema

```
LOCALSTORAGE
└─ theme: string
   ├─ Value: "light" (9 bytes)
   │  └─ Result: Light theme applied
   │
   ├─ Value: "dark" (8 bytes)
   │  └─ Result: Dark theme applied
   │
   └─ Undefined/Null
      └─ Result: Use system preference
```

## 🌐 Browser API Usage

```
APIs Used:
├─ localStorage
│  ├─ getItem('theme')
│  └─ setItem('theme', value)
│
├─ matchMedia()
│  └─ window.matchMedia('(prefers-color-scheme: dark)')
│     ├─ .matches - Get current preference
│     └─ .addEventListener('change', ...) - Listen for changes
│
├─ DOM API
│  ├─ document.documentElement.setAttribute('data-theme', ...)
│  ├─ document.body.classList.add/remove(...)
│  └─ document.getElementById('theme-toggle')
│
└─ CSS API
   └─ CSS Custom Properties (--variable-name)
```

## 🎯 Flow Summary

```
[1] PAGE LOADS
    ↓
[2] Theme script checks localStorage
    ↓
[3] If not found, checks system preference
    ↓
[4] Applies theme via data-theme attribute
    ↓
[5] CSS variables resolve to correct colors
    ↓
[6] Page renders in correct theme
    ↓
[7] User sees correct colors
    ↓
[8] User can click toggle button
    ↓
[9] Theme switches, preference saved
    ↓
[10] Next visit: Go back to step 2
     (User's preference is used)
```

---

**This architecture ensures**:

- ✅ No flickering on load
- ✅ System preference respected
- ✅ User preferences persist
- ✅ Simple to customize
- ✅ No external dependencies
- ✅ Excellent performance
