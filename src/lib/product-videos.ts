import fs from "node:fs";
import path from "node:path";
import type { ProductCategory } from "@/types";

export interface ProductVideo {
  url: string;
  title: string;
  category: string;
}

const VIDEO_ROOT = path.join(process.cwd(), "public", "video", "productVideo");
const VIDEO_PUBLIC_ROOT = "/video/productVideo";

function titleCase(input: string) {
  return input
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function videoTitleFromFilename(filename: string) {
  const basename = filename.replace(/\.[^.]+$/, "");
  const parts = basename.split("-");

  if (parts[0]?.toUpperCase() === "RD") {
    let index = 1;
    while (index < parts.length && /^(?:[A-Z]?\d+[A-Z]?|\d+[A-Z]?)$/i.test(parts[index])) {
      index += 1;
    }
    const titleParts = parts.slice(index);
    if (titleParts.length > 0) return titleCase(titleParts.join("-"));
  }

  return titleCase(basename) || "Application Video";
}

function modelAliases(model: string) {
  const upper = model.toUpperCase();
  const aliases = new Set([upper]);

  const missingT = upper.match(/^RD-T(.+)$/);
  if (missingT) aliases.add(`RD-${missingT[1]}`);

  const family = upper.match(/^(RD-[A-Z]?\d+)[A-Z]$/);
  if (family) aliases.add(family[1]);

  return Array.from(aliases);
}

function fileMatchesModel(filename: string, model: string) {
  const upper = filename.toUpperCase().replace(/\.[^.]+$/, "");
  return modelAliases(model).some((alias) => upper.includes(alias));
}

export function getProductVideos(product: { model: string; category: ProductCategory }): ProductVideo[] {
  if (!fs.existsSync(VIDEO_ROOT)) return [];

  const videos: ProductVideo[] = [];
  const categoryDirs = fs
    .readdirSync(VIDEO_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  for (const category of categoryDirs) {
    const dir = path.join(VIDEO_ROOT, category);
    const files = fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".mp4"))
      .map((entry) => entry.name);

    for (const file of files) {
      if (!fileMatchesModel(file, product.model)) continue;
      videos.push({
        url: `${VIDEO_PUBLIC_ROOT}/${category}/${file}`,
        title: videoTitleFromFilename(file),
        category,
      });
    }
  }

  return videos.sort((a, b) => {
    if (a.category === product.category && b.category !== product.category) return -1;
    if (a.category !== product.category && b.category === product.category) return 1;
    return a.title.localeCompare(b.title);
  }).slice(0, 1);
}
