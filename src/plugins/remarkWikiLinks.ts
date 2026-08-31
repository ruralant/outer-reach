import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Root, Text, PhrasingContent } from "mdast";
import type { VFile } from "vfile";

/**
 * Remark plugin that converts [[wiki-links]] into anchor elements.
 *
 * Supports:
 *   [[slug]]            → links to /garden/slug with title-cased slug as text
 *   [[slug|Display]]    → links to /garden/slug with "Display" as text
 *
 * Locale-aware: detects the content locale from the file path
 * (e.g. src/content/garden/it/slug.md → /it/garden/slug).
 * The default locale ("en") gets no prefix.
 */
const remarkWikiLinks: Plugin<[], Root> = () => {
  return (tree: Root, file: VFile) => {
    // Detect locale from file path: .../content/garden/<locale>/slug.md
    const filePath = file.history?.[0] || file.path || "";
    const localeMatch = filePath.match(/\/content\/garden\/([a-z]{2})\//);
    const locale = localeMatch?.[1] || "en";
    const gardenBase = locale === "en" ? "/garden" : `/${locale}/garden`;

    visit(tree, "text", (node: Text, index, parent) => {
      if (!parent || index === undefined) return;

      const wikiLinkRegex = /\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g;
      const value = node.value;

      if (!wikiLinkRegex.test(value)) return;

      // Reset regex after test
      wikiLinkRegex.lastIndex = 0;

      const children: PhrasingContent[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = wikiLinkRegex.exec(value)) !== null) {
        const [fullMatch, rawSlug, displayText] = match;
        const slug = rawSlug.trim();
        const text = displayText?.trim() || titleCase(slug);

        // Add any text before this match
        if (match.index > lastIndex) {
          children.push({
            type: "text",
            value: value.slice(lastIndex, match.index),
          });
        }

        // Add the wiki link as an anchor
        children.push({
          type: "link",
          url: `${gardenBase}/${slug}`,
          data: {
            hProperties: { className: ["wiki-link"] },
          },
          children: [{ type: "text", value: text }],
        });

        lastIndex = match.index + fullMatch.length;
      }

      // Add any remaining text after the last match
      if (lastIndex < value.length) {
        children.push({
          type: "text",
          value: value.slice(lastIndex),
        });
      }

      // Replace the text node with our new nodes
      if (children.length > 0) {
        parent.children.splice(index, 1, ...children);
      }
    });
  };
};

function titleCase(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default remarkWikiLinks;
