/**
 * Convert all PNG/JPG images to WebP format
 * Usage: npx tsx scripts/convert-webp.ts [--dry-run]
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const PUBLIC_DIR = path.resolve(__dirname, "..", "public", "images");
const DRY_RUN = process.argv.includes("--dry-run");

// Directory-specific compression profiles
const PROFILES: Record<string, { quality: number; maxWidth: number | null }> = {
  company: { quality: 75, maxWidth: 1400 },
  products: { quality: 80, maxWidth: 800 },
  "product-list": { quality: 80, maxWidth: 800 },
  applications: { quality: 75, maxWidth: 1200 },
  patents: { quality: 80, maxWidth: 1200 },
  partners: { quality: 85, maxWidth: null },
  certifications: { quality: 80, maxWidth: 1200 },
};

const DEFAULT_PROFILE = { quality: 80, maxWidth: 1200 };

interface Result {
  file: string;
  before: number;
  after: number;
}

const results: Result[] = [];
let skippedGifs = 0;

function getProfile(filePath: string) {
  const rel = path.relative(PUBLIC_DIR, filePath);
  const topDir = rel.split(path.sep)[0];
  return PROFILES[topDir] || DEFAULT_PROFILE;
}

async function convertFile(filePath: string): Promise<void> {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".gif") {
    skippedGifs++;
    return;
  }

  if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") return;

  const profile = getProfile(filePath);
  const outPath = filePath.replace(/\.[^.]+$/, ".webp");
  const stat = fs.statSync(filePath);
  const before = stat.size;

  // Skip if target already exists and is newer
  if (fs.existsSync(outPath)) {
    const outStat = fs.statSync(outPath);
    if (outStat.mtime >= stat.mtime) {
      return;
    }
  }

  let pipeline = sharp(filePath);

  // Resize if maxWidth is set and image is wider
  if (profile.maxWidth) {
    const metadata = await pipeline.metadata();
    if (metadata.width && metadata.width > profile.maxWidth) {
      pipeline = pipeline.resize({ width: profile.maxWidth, withoutEnlargement: true });
    }
  }

  if (DRY_RUN) {
    const metadata = await sharp(filePath).metadata();
    console.log(`  [DRY-RUN] ${path.basename(filePath)} (${metadata.width}x${metadata.height}, ${(before / 1024).toFixed(1)}KB)`);
    return;
  }

  await pipeline.webp({ quality: profile.quality }).toFile(outPath);

  const after = fs.statSync(outPath).size;

  // Delete original only after successful conversion
  fs.unlinkSync(filePath);

  results.push({ file: path.relative(PUBLIC_DIR, filePath), before, after });
}

async function walkDir(dir: string): Promise<void> {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkDir(fullPath);
    } else if (entry.isFile()) {
      await convertFile(fullPath);
    }
  }
}

async function main() {
  console.log(DRY_RUN ? "🔍 DRY RUN — no files will be modified\n" : "🖼️  Converting images to WebP...\n");

  await walkDir(PUBLIC_DIR);

  if (DRY_RUN) {
    console.log(`\n📊 Dry run complete. ${skippedGifs} GIFs skipped.`);
    return;
  }

  const totalBefore = results.reduce((s, r) => s + r.before, 0);
  const totalAfter = results.reduce((s, r) => s + r.after, 0);
  const pct = ((1 - totalAfter / totalBefore) * 100).toFixed(1);

  console.log(`\n✅ Converted ${results.length} files`);
  console.log(`   Before: ${(totalBefore / 1024 / 1024).toFixed(1)}MB`);
  console.log(`   After:  ${(totalAfter / 1024 / 1024).toFixed(1)}MB`);
  console.log(`   Saved:  ${pct}% (${((totalBefore - totalAfter) / 1024 / 1024).toFixed(1)}MB)`);
  console.log(`   Skipped ${skippedGifs} GIFs`);

  // Top 5 savings
  const sorted = [...results].sort((a, b) => (b.before - b.after) - (a.before - a.after));
  console.log("\n📊 Top savings:");
  for (const r of sorted.slice(0, 5)) {
    const saved = ((r.before - r.after) / 1024).toFixed(1);
    console.log(`   ${r.file} — saved ${saved}KB`);
  }
}

main().catch(console.error);
