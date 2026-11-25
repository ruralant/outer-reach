import fs from "node:fs";
import path from "node:path";
import ExifReader from "exifreader";
import type { AstroIntegration } from "astro";

/**
 * Fails the build when an image in a committed source folder carries a GPS
 * location. The site itself never serves these originals (astro:assets
 * re-encodes them without metadata), but the repo is public, so a photo taken
 * at home would publish the address through GitHub. Dev only warns.
 */
const IMAGE_DIRS = ["src/photos", "src/assets/images"];
const IMAGE_FILE = /\.(jpe?g|png|webp|avif|heic|heif|tiff?)$/i;

function listImages(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { recursive: true, encoding: "utf8" })
    .filter((name) => IMAGE_FILE.test(name))
    .map((name) => path.join(dir, name));
}

function hasLocation(file: string): boolean {
  let tags: ExifReader.ExpandedTags;
  try {
    tags = ExifReader.load(fs.readFileSync(file), { expanded: true });
  } catch {
    return false;
  }
  const xmp: Record<string, unknown> = tags.xmp ?? {};
  return (
    tags.gps?.Latitude !== undefined ||
    tags.gps?.Longitude !== undefined ||
    "GPSLatitude" in xmp ||
    "GPSLongitude" in xmp
  );
}

export default function noGpsInImages(): AstroIntegration {
  return {
    name: "no-gps-in-images",
    hooks: {
      "astro:config:setup": ({ command, logger }) => {
        const located = IMAGE_DIRS.flatMap(listImages).filter(hasLocation);
        if (located.length === 0) return;

        const message = [
          "These images carry a GPS location, which the public repo would publish:",
          ...located.map((file) => `  - ${file}`),
          "Remove the location first (in Preview: Tools › Show Inspector › GPS › Remove Location Info).",
          "If a file is already committed, its location is in git history too.",
        ].join("\n");

        if (command === "build") throw new Error(message);
        logger.warn(message);
      },
    },
  };
}
