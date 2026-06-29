import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { newsTranslations } from "@/db/schema";
import type { Locale } from "@/lib/i18n";
import { SUPPORTED_LOCALES } from "@/lib/i18n";
import { sourceHash } from "@/lib/translation/hash";
import { translateJsonObject } from "@/lib/translation/openai";

export interface NewsSourceForTranslation {
  id: number;
  slug: string;
  title: string;
  summary: string;
  content: string;
  seoTitle: string | null;
  keywords: string | null;
}

function newsPayload(article: NewsSourceForTranslation) {
  return {
    title: article.title,
    summary: article.summary,
    content: article.content,
    seoTitle: article.seoTitle || article.title,
    keywords: article.keywords || "",
  };
}

async function upsertNewsTranslation(
  article: NewsSourceForTranslation,
  locale: Locale,
  status: "translated" | "failed",
  hash: string,
  payload: ReturnType<typeof newsPayload>,
  errorMessage?: string,
) {
  const existing = await db
    .select({ id: newsTranslations.id })
    .from(newsTranslations)
    .where(and(eq(newsTranslations.newsId, article.id), eq(newsTranslations.locale, locale)))
    .get();

  const values = {
    newsId: article.id,
    locale,
    slug: article.slug,
    title: payload.title,
    summary: payload.summary,
    content: payload.content,
    seoTitle: payload.seoTitle,
    keywords: payload.keywords,
    translationStatus: status,
    sourceHash: hash,
    errorMessage: errorMessage || null,
    updatedAt: new Date(),
  };

  if (existing) {
    await db.update(newsTranslations).set(values).where(eq(newsTranslations.id, existing.id)).run();
  } else {
    await db.insert(newsTranslations).values({ ...values, createdAt: new Date() }).run();
  }
}

export async function translateNewsArticle(
  article: NewsSourceForTranslation,
  locales: Locale[] = [...SUPPORTED_LOCALES],
) {
  const payload = newsPayload(article);
  const hash = sourceHash(payload);
  const results: Array<{ locale: Locale; status: "translated" | "failed"; error?: string }> = [];

  for (const locale of locales) {
    try {
      const translated = await translateJsonObject(payload, locale);
      await upsertNewsTranslation(article, locale, "translated", hash, translated);
      results.push({ locale, status: "translated" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown translation error";
      await upsertNewsTranslation(article, locale, "failed", hash, payload, message);
      results.push({ locale, status: "failed", error: message });
    }
  }

  return results;
}
