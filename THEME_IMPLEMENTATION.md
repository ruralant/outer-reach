# Light & Dark Theme Implementation

## Overview

I've successfully added a light and dark theme system to your Astro blog with the following features:

✅ **Default to system preference** - Automatically detects user's OS theme preference
✅ **Theme toggle button** - Fixed position icon in the top-right corner
✅ **Persistent user choice** - Theme preference saved to localStorage
✅ **Smooth transitions** - CSS transitions for color changes
✅ **Full page coverage** - All pages (home, blog index, blog posts) support themes

## Files Created

### 1. **src/components/ThemeToggle.astro**

A reusable theme toggle component that:

- Displays sun/moon icons that animate when clicked
- Manages theme switching logic with localStorage
- Listens for system theme changes
- Applies theme on page load

### 2. **src/layouts/BaseLayout.astro**

A base layout wrapper that:

- Defines CSS custom properties (variables) for both themes
- Includes the ThemeToggle component
- Provides consistent head/meta setup for all pages
- Handles global styling

## Color Schemes

### Light Mode (Default)

- Text: Dark gray (#333)
- Background: White (#ffffff)
- Accents: Purple (#667eea)
- Cards: White with subtle shadows

### Dark Mode

- Text: Light gray (#e0e0e0)
- Background: Very dark (#1a1a1a)
- Accents: Light purple (#8b9eff)
- Cards: Dark gray with stronger shadows

## How It Works

### Theme Detection Flow

1. **Page Load**: Script checks localStorage for saved theme

   - If saved theme exists → Apply it
   - If no saved theme → Check system preference
   - If system prefers dark → Apply dark mode
   - Otherwise → Apply light mode

2. **User Toggle**: Clicking the toggle button

   - Switches to opposite theme
   - Saves preference to localStorage
   - Persists across sessions

3. **System Changes**: If user changes OS theme
   - Auto-applied if no manual theme was saved
   - Manual selection always takes priority

## Updated Files

All pages have been updated to use the new BaseLayout and CSS variables:

1. **src/pages/index.astro** - Home page
2. **src/pages/blog/index.astro** - Blog listing page
3. **src/layouts/BlogPostLayout.astro** - Individual blog post layout

## CSS Variables Used

```css
/* Light mode defaults */
--color-text-primary: #333
--color-text-secondary: #666
--color-background: #ffffff
--color-background-secondary: #fafafa
--color-border: #e0e0e0
--color-accent: #667eea
--color-card-background: #ffffff
--color-link-hover: #667eea

/* Dark mode overrides */
[data-theme='dark'] {
  --color-text-primary: #e0e0e0
  --color-text-secondary: #b0b0b0
  --color-background: #1a1a1a
  --color-background-secondary: #2d2d2d
  --color-border: #404040
  --color-accent: #8b9eff
  --color-card-background: #2d2d2d
  --color-link-hover: #8b9eff
}
```

## Implementation Details

### Theme Toggle Component

- Located in top-right corner (fixed position)
- Sun icon shows in light mode
- Moon icon shows in dark mode
- Icons smoothly animate on transition
- Hover effects for better UX

### LocalStorage Key

- Key: `theme`
- Values: `'light'` or `'dark'`
- Persists indefinitely until manually changed

### System Preference Detection

Uses the standard Media Query API:

```javascript
window.matchMedia("(prefers-color-scheme: dark)").matches;
```

## Testing the Implementation

1. **First Visit**:

   - Theme matches your OS preference
   - Toggle button visible in top-right

2. **Click Toggle**:

   - Theme switches immediately
   - Colors fade smoothly
   - Preference saves to localStorage

3. **Page Reload**:

   - Your selected theme persists
   - No flash of wrong color

4. **Change OS Theme**:
   - If no manual preference saved, theme auto-updates
   - If you manually selected a theme, it won't change

## Browser Support

Works in all modern browsers that support:

- CSS Custom Properties (CSS Variables)
- localStorage API
- Media Queries (prefers-color-scheme)

## Performance Notes

- Minimal JavaScript (theme script is tiny)
- No external dependencies needed
- CSS transitions are GPU-accelerated
- Theme preference loaded before page renders (prevents flashing)

---

All changes are production-ready and tested with `npm run build` ✓
