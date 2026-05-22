import { NextResponse } from "next/server";
import { db } from "@/db";
import { news } from "@/db/schema";
import { getSession } from "@/lib/auth";

export async function GET() {
  const rows = await db.select().from(news).all();
  return NextResponse.json(
    rows.map((n) => ({ ...n, isPublished: Boolean(n.isPublished) })),
  );
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await request.json();
  const row = await db.insert(news).values({
    ...data,
    isPublished: data.isPublished ? 1 : 0,
  }).returning().get();

  return NextResponse.json(
    { ...row, isPublished: Boolean(row.isPublished) },
    { status: 201 },
  );
}
