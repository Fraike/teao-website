import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { getSession } from "@/lib/auth";

function serializeProduct(p: typeof products.$inferSelect) {
  return {
    ...p,
    features: JSON.parse(p.features || "[]"),
    images: JSON.parse(p.images || "[]"),
    techParams: p.techParams ? JSON.parse(p.techParams) : undefined,
    specifications: JSON.parse(p.specifications || "{}"),
    torque: p.torque ? JSON.parse(p.torque) : undefined,
    durability: p.durability ? JSON.parse(p.durability) : undefined,
    materials: JSON.parse(p.materials || "[]"),
    characteristics: JSON.parse(p.characteristics || "[]"),
    performanceCharts: p.performanceCharts ? JSON.parse(p.performanceCharts) : undefined,
    applications: JSON.parse(p.applications || "[]"),
    tags: JSON.parse(p.tags || "[]"),
    isActive: Boolean(p.isActive),
  };
}

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

  db.update(products)
    .set({
      ...data,
      features: JSON.stringify(data.features || []),
      images: JSON.stringify(data.images || []),
      techParams: data.techParams ? JSON.stringify(data.techParams) : null,
      specifications: JSON.stringify(data.specifications || {}),
      torque: data.torque ? JSON.stringify(data.torque) : null,
      durability: data.durability ? JSON.stringify(data.durability) : null,
      materials: JSON.stringify(data.materials || []),
      characteristics: JSON.stringify(data.characteristics || []),
      performanceCharts: data.performanceCharts ? JSON.stringify(data.performanceCharts) : null,
      applications: JSON.stringify(data.applications || []),
      tags: JSON.stringify(data.tags || []),
      isActive: data.isActive ? 1 : 0,
      updatedAt: new Date(),
    })
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
