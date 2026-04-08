import fs from "node:fs";
import path from "node:path";
import ExifReader from "exifreader";

export interface PhotoExif {
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: number;
  date?: Date;
  width?: number;
  height?: number;
}

export interface Photo {
  filename: string;
  slug: string;
  src: string;
  exif: PhotoExif;
}

function formatShutterSpeed(
  exposureTime: number | undefined,
): string | undefined {
  if (!exposureTime) return undefined;
  if (exposureTime >= 1) return `${exposureTime}s`;
  const denominator = Math.round(1 / exposureTime);
  return `1/${denominator}s`;
}

function formatCamera(
  make: string | undefined,
  model: string | undefined,
): string | undefined {
  if (!make && !model) return undefined;
  if (!make) return model;
  if (!model) return make;
  // Avoid duplicating the make if it's already in the model string
  if (model.toLowerCase().startsWith(make.toLowerCase())) return model;
  return `${make} ${model}`;
}

function tagValue<T = string>(
  tag: { value?: T; description?: string } | undefined,
): T | undefined {
  return tag?.value ?? undefined;
}

function tagDescription(
  tag: { description?: string } | undefined,
): string | undefined {
  return tag?.description ?? undefined;
}

interface GetPhotosOptions {
  /** Maximum number of photos to return. */
  limit?: number;
  /** When true, only extract the date from EXIF (for sorting) and skip the rest. */
  lite?: boolean;
}

/** Read only the first 64 KB — enough to cover EXIF headers without loading the full JPEG. */
const LITE_READ_BYTES = 65_536;

function readExifDate(filePath: string): Date | undefined {
  let fd: number | undefined;
  try {
    fd = fs.openSync(filePath, "r");
    const buf = Buffer.alloc(LITE_READ_BYTES);
    const bytesRead = fs.readSync(fd, buf, 0, LITE_READ_BYTES, 0);
    const tags = ExifReader.load(buf.subarray(0, bytesRead), {
      expanded: true,
    });
    const exifTags = tags.exif ?? {};
    const dateStr =
      tagDescription(exifTags.DateTimeOriginal) ||
      tagDescription(exifTags.DateTime);
    return dateStr
      ? new Date(dateStr.replace(/^(\d{4}):(\d{2}):(\d{2})/, "$1-$2-$3"))
      : undefined;
  } catch {
    return undefined;
  } finally {
    if (fd !== undefined) fs.closeSync(fd)
  }
}

function readFullExif(filePath: string): PhotoExif {
  try {
    const buffer = fs.readFileSync(filePath);
    const tags = ExifReader.load(buffer, { expanded: true });

    const exifTags = tags.exif ?? {};
    const make = tagDescription(exifTags.Make);
    const model = tagDescription(exifTags.Model);
    const fNumberDesc = tagDescription(exifTags.FNumber);
    const exposureDesc = tagDescription(exifTags.ExposureTime);
    const isoTag = exifTags.ISOSpeedRatings;
    const iso = isoTag
      ? Array.isArray(isoTag.value)
        ? isoTag.value[0]
        : isoTag.value
      : undefined;
    const focalLengthDesc = tagDescription(exifTags.FocalLength);
    const lensModel = tagDescription(exifTags.LensModel);
    const dateStr =
      tagDescription(exifTags.DateTimeOriginal) ||
      tagDescription(exifTags.DateTime);
    const imgWidth =
      tagValue<number>(exifTags.PixelXDimension) ??
      (tags.file?.["Image Width"] as { value?: number } | undefined)?.value;
    const imgHeight =
      tagValue<number>(exifTags.PixelYDimension) ??
      (tags.file?.["Image Height"] as { value?: number } | undefined)?.value;

    return {
      camera: formatCamera(make, model),
      lens: lensModel || undefined,
      focalLength: focalLengthDesc
        ? focalLengthDesc.replace(/\s+/g, "")
        : undefined,
      aperture: fNumberDesc || undefined,
      shutterSpeed: exposureDesc ? `${exposureDesc}s` : undefined,
      iso: iso || undefined,
      date: dateStr
        ? new Date(dateStr.replace(/^(\d{4}):(\d{2}):(\d{2})/, "$1-$2-$3"))
        : undefined,
      width: imgWidth || undefined,
      height: imgHeight || undefined,
    };
  } catch {
    return {};
  }
}

export async function getPhotos(options?: GetPhotosOptions): Promise<Photo[]> {
  const { limit, lite = false } = options ?? {};
  const photosDir = path.join(process.cwd(), "public", "photos");

  if (!fs.existsSync(photosDir)) return [];

  const files = fs.readdirSync(photosDir).filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return [".jpg", ".jpeg"].includes(ext);
  });

  const photos: Photo[] = [];

  for (const file of files) {
    const fp = path.join(photosDir, file);
    const slug = path.basename(file, path.extname(file));

    const exif: PhotoExif = lite
      ? { date: readExifDate(fp) }
      : readFullExif(fp);

    photos.push({
      filename: file,
      slug,
      src: `/photos/${file}`,
      exif,
    });
  }

  // Sort by date descending (newest first), undated photos last
  photos.sort((a, b) => {
    if (a.exif.date && b.exif.date)
      return b.exif.date.getTime() - a.exif.date.getTime();
    if (a.exif.date) return -1;
    if (b.exif.date) return 1;
    return a.filename.localeCompare(b.filename);
  });

  return limit !== undefined ? photos.slice(0, limit) : photos;
}
