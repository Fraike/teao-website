import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readdir, unlink, stat } from "fs/promises";
import type { Dirent } from "fs";
import path from "path";
import { existsSync } from "fs";

const ALLOWED_TYPES = [
  "image/jpeg", "image/png", "image/gif", "image/webp",
  "video/mp4", "video/webm", "video/quicktime",
];
const MEDIA_EXT = /\.(jpg|jpeg|png|gif|webp|mp4|webm|mov)$/i;
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

interface MediaItem {
  name: string;
  url: string;
  size: number;
  modified: string;
  source: "project" | "uploads";
}

async function scanDirRecursive(
  baseDir: string,
  baseUrl: string,
  source: "project" | "uploads",
  relDir = "",
): Promise<MediaItem[]> {
  const items: MediaItem[] = [];
  const currentDir = path.join(baseDir, relDir);

  let entries: Dirent[];
  try {
    entries = await readdir(currentDir, { withFileTypes: true });
  } catch {
    return items;
  }

  for (const entry of entries) {
    const entryRelPath = relDir ? `${relDir}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      // Skip some non-image directories
      if (entry.name.startsWith(".")) continue;
      const subItems = await scanDirRecursive(baseDir, baseUrl, source, entryRelPath);
      items.push(...subItems);
    } else if (entry.isFile() && MEDIA_EXT.test(entry.name)) {
      const filePath = path.join(currentDir, entry.name);
      try {
        const info = await stat(filePath);
        items.push({
          name: entry.name,
          url: `${baseUrl}/${entryRelPath}`,
          size: info.size,
          modified: info.mtime.toISOString(),
          source,
        });
      } catch {
        // skip unreadable files
      }
    }
  }

  return items;
}

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const sourceFilter = searchParams.get("source") || "all"; // "all" | "project" | "uploads"
  const q = searchParams.get("q")?.toLowerCase() || "";

  const publicDir = path.join(process.cwd(), "public");
  const allItems: MediaItem[] = [];

  // Scan project images
  if (sourceFilter === "all" || sourceFilter === "project") {
    const imagesDir = path.join(publicDir, "images");
    if (existsSync(imagesDir)) {
      const projectItems = await scanDirRecursive(imagesDir, "/images", "project");
      allItems.push(...projectItems);
    }
  }

  // Scan uploads
  if (sourceFilter === "all" || sourceFilter === "uploads") {
    const uploadDir = path.join(publicDir, "uploads");
    if (existsSync(uploadDir)) {
      const uploadItems = await scanDirRecursive(uploadDir, "/uploads", "uploads");
      allItems.push(...uploadItems);
    }
  }

  // Client-side search filter
  const filtered = q
    ? allItems.filter((item) => item.name.toLowerCase().includes(q) || item.url.toLowerCase().includes(q))
    : allItems;

  // Sort: newest first
  filtered.sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());

  return NextResponse.json(filtered);
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("file");
  if (!filename) return NextResponse.json({ error: "Missing filename" }, { status: 400 });

  // Only allow deleting from uploads (not project images)
  const safe = path.basename(filename);
  const filePath = path.join(process.cwd(), "public", "uploads", safe);

  // Verify file is actually in uploads directory
  if (!filePath.startsWith(path.join(process.cwd(), "public", "uploads"))) {
    return NextResponse.json({ error: "Cannot delete project images" }, { status: 403 });
  }

  try {
    await unlink(filePath);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  const { mkdir, writeFile } = await import("fs/promises");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}`, name: filename }, { status: 201 });
}
