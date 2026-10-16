/** The header, mobile menu and footer links, in one list. Paths are locale-free; wrap them with `localePath`. */
export const navigation = [
  { key: "nav.blog", path: "/blog/" },
  { key: "nav.garden", path: "/garden/" },
  { key: "nav.photos", path: "/photos/" },
  { key: "nav.now", path: "/now/" },
] as const;

/** True when `pathname` is the section at `path` or a page inside it, for either locale. */
export function isCurrentSection(pathname: string, path: string, lang: string): boolean {
  const section = path.replace(/\/$/, "");
  const prefixed = lang === "en" ? section : `/${lang}${section}`;
  return pathname === prefixed || pathname.startsWith(`${prefixed}/`);
}
