import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { news, newsTranslations } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { isLocale, SUPPORTED_LOCALES, type Locale } from "@/lib/i18n";
import { translateNewsArticle } from "@/lib/translation/news";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const rows = await db
    .select()
    .from(newsTranslations)
    .where(eq(newsTranslations.newsId, Number(id)))
    .all();

  return NextResponse.json(rows);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const locales = Array.isArray(body.locales)
    ? body.locales.filter(isLocale)
    : body.locale && isLocale(body.locale)
      ? [body.locale as Locale]
      : [...SUPPORTED_LOCALES];

  const article = await db.select().from(news).where(eq(news.id, Number(id))).get();
  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (body.clearFailed === true) {
    await db
      .delete(newsTranslations)
      .where(and(eq(newsTranslations.newsId, article.id), eq(newsTranslations.translationStatus, "failed")))
      .run();
  }

  const results = await translateNewsArticle({
    id: article.id,
    slug: article.slug,
    title: article.title,
    summary: article.summary,
    content: article.content,
    seoTitle: article.seoTitle,
    keywords: article.keywords,
  }, locales);

  return NextResponse.json({ results });
}
