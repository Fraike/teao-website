import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { eq, like, or } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { serializeProduct, deserializeProduct } from "@/lib/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");

  let rows;
  if (category) {
    rows = await db.select().from(products).where(eq(products.category, category)).all();
  } else if (q) {
    const term = `%${q}%`;
    rows = await db.select().from(products).where(
      or(like(products.model, term), like(products.name, term))
    ).all();
  } else {
    rows = await db.select().from(products).all();
  }

  return NextResponse.json(rows.map(serializeProduct));
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await request.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row = await db.insert(products).values(deserializeProduct(data) as any).returning().get();

  // Revalidate to include the new product
  revalidatePath(`/${row.category}`);
  revalidatePath("/products");

  return NextResponse.json(serializeProduct(row), { status: 201 });
}
