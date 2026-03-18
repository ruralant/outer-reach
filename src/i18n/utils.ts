import { ui, defaultLang, type Lang } from "./ui";

/**
 * Returns a `t(key)` function bound to a specific language.
 * Falls back to `defaultLang` for missing keys.
 */
export function useTranslations(lang: Lang | string | undefined) {
  const l = (lang && lang in ui ? lang : defaultLang) as Lang;
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return (ui[l] as Record<string, unknown>)[key] ?? ui[defaultLang][key];
  };
}

/**
 * Build a locale-aware path.
 * English (default locale) → no prefix: `/garden/slug`
 * Italian → prefixed: `/it/garden/slug`
 */
export function localePath(
  lang: Lang | string | undefined,
  path: string,
): string {
  const l = lang ?? defaultLang;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (l === defaultLang) return cleanPath;
  return `/${l}${cleanPath}`;
}

/**
 * Format a date using the appropriate locale.
 */
export function localeDateString(
  date: Date,
  lang: Lang | string | undefined,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
): string {
  const localeMap: Record<string, string> = {
    en: "en-GB",
    it: "it-IT",
  };
  const l = lang ?? defaultLang;
  return date.toLocaleDateString(localeMap[l] || "en-GB", options);
}

/**
 * Format a date in short format (for listings).
 */
export function localeDateShort(
  date: Date,
  lang: Lang | string | undefined,
): string {
  return localeDateString(date, lang, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Get the URL for the same page in the other language.
 * Swaps the locale prefix.
 */
export function getAlternateLocaleUrl(url: URL, currentLang: Lang): string {
  const targetLang: Lang = currentLang === "en" ? "it" : "en";
  const path = url.pathname;

  if (currentLang === defaultLang) {
    // English page has no prefix → add /it
    return `/${targetLang}${path}`;
  } else {
    // Non-default language → strip the prefix
    const withoutLocale = path.replace(new RegExp(`^/${currentLang}`), "");
    return withoutLocale || "/";
  }
}

/**
 * Strip the locale prefix (e.g. "en/" or "it/") from a note ID.
 * "en/degrowth" → "degrowth"
 */
export function slugFromNoteId(noteId: string): string {
  const slashIdx = noteId.indexOf("/");
  return slashIdx !== -1 ? noteId.slice(slashIdx + 1) : noteId;
}

/**
 * Build a garden note URL.
 */
export function gardenNotePath(
  lang: Lang | string | undefined,
  slug: string,
): string {
  return localePath(lang, `/garden/${slug}`);
}
