import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readdir, unlink, stat } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  let files: string[] = [];
  try {
    files = await readdir(uploadDir);
  } catch {
    return NextResponse.json([]);
  }

  const items = await Promise.all(
    files
      .filter((f) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f))
      .map(async (name) => {
        const filePath = path.join(uploadDir, name);
        const info = await stat(filePath);
        return {
          name,
          url: `/uploads/${name}`,
          size: info.size,
          modified: info.mtime.toISOString(),
        };
      }),
  );

  items.sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());
  return NextResponse.json(items);
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("file");
  if (!filename) return NextResponse.json({ error: "Missing filename" }, { status: 400 });

  // Prevent path traversal
  const safe = path.basename(filename);
  const filePath = path.join(process.cwd(), "public", "uploads", safe);

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
