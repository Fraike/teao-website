import { NextResponse } from "next/server";
import { db } from "@/db";
import { news } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { env } from "@/lib/env";
import { translateNewsArticle } from "@/lib/translation/news";

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
    relatedProducts: Array.isArray(data.relatedProducts) ? JSON.stringify(data.relatedProducts) : (data.relatedProducts || "[]"),
    isPublished: data.isPublished ? 1 : 0,
  }).returning().get();

  let translations = null;
  if (env.AUTO_TRANSLATE_NEWS && data.autoTranslate !== false) {
    translations = await translateNewsArticle({
      id: row.id,
      slug: row.slug,
      title: row.title,
      summary: row.summary,
      content: row.content,
      seoTitle: row.seoTitle,
      keywords: row.keywords,
    });
  }

  return NextResponse.json(
    {
      ...row,
      isPublished: Boolean(row.isPublished),
      relatedProducts: JSON.parse(row.relatedProducts || "[]"),
      translations,
    },
    { status: 201 },
  );
}
