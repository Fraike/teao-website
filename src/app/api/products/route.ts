import { NextResponse } from "next/server";
import { eq, like, or, and } from "drizzle-orm";
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");

  let rows;
  if (category) {
    rows = db.select().from(products).where(eq(products.category, category)).all();
  } else if (q) {
    const term = `%${q}%`;
    rows = db.select().from(products).where(
      or(like(products.model, term), like(products.name, term))
    ).all();
  } else {
    rows = db.select().from(products).all();
  }

  return NextResponse.json(rows.map(serializeProduct));
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await request.json();
  const row = db.insert(products).values({
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
  }).returning().get();

  return NextResponse.json(serializeProduct(row), { status: 201 });
}
