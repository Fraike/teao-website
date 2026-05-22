import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { news } from "@/db/schema";
import { getSession } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const byId = Number.isNaN(Number(id))
    ? await db.select().from(news).where(eq(news.slug, id)).get()
    : await db.select().from(news).where(eq(news.id, Number(id))).get();

  if (!byId) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ...byId, isPublished: Boolean(byId.isPublished) });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const data = await request.json();

  await db.update(news)
    .set({ ...data, isPublished: data.isPublished ? 1 : 0, updatedAt: new Date() })
    .where(eq(news.id, Number(id)))
    .run();

  const updated = await db.select().from(news).where(eq(news.id, Number(id))).get();
  return NextResponse.json({ ...updated, isPublished: Boolean(updated!.isPublished) });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.delete(news).where(eq(news.id, Number(id))).run();
  return NextResponse.json({ success: true });
}
