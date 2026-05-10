import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { serializeProduct, deserializeProduct } from "@/lib/products";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  // Try numeric id first, then slug
  const byId = Number.isNaN(Number(id))
    ? db.select().from(products).where(eq(products.slug, id)).get()
    : db.select().from(products).where(eq(products.id, Number(id))).get();

  if (!byId) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(serializeProduct(byId));
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const data = await request.json();
  const numId = Number(id);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db.update(products)
    .set({ ...deserializeProduct(data), updatedAt: new Date() } as any)
    .where(eq(products.id, numId))
    .run();

  const updated = db.select().from(products).where(eq(products.id, numId)).get();
  return NextResponse.json(serializeProduct(updated!));
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  db.delete(products).where(eq(products.id, Number(id))).run();
  return NextResponse.json({ success: true });
}
