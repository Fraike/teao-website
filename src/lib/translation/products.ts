import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { productTranslations, products } from "@/db/schema";
import type { Locale } from "@/lib/i18n";
import { SUPPORTED_LOCALES } from "@/lib/i18n";
import { sourceHash } from "@/lib/translation/hash";
import { translateJsonObject } from "@/lib/translation/openai";

function parseJsonArray(value: string | null | undefined) {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function productPayload(row: typeof products.$inferSelect) {
  return {
    name: row.name,
    summary: row.summary,
    description: row.description,
    features: parseJsonArray(row.features),
    applications: parseJsonArray(row.applications),
    seoTitle: row.seoTitle || `${row.model} ${row.name}`,
    seoDescription: row.seoDescription || row.summary,
    tags: parseJsonArray(row.tags),
  };
}

async function upsertProductTranslation(
  row: typeof products.$inferSelect,
  locale: Locale,
  status: "translated" | "failed",
  hash: string,
  payload: ReturnType<typeof productPayload>,
  errorMessage?: string,
) {
  const existing = await db
    .select({ id: productTranslations.id })
    .from(productTranslations)
    .where(and(eq(productTranslations.productId, row.id), eq(productTranslations.locale, locale)))
    .get();

  const values = {
    productId: row.id,
    locale,
    name: String(payload.name || row.name),
    summary: String(payload.summary || row.summary),
    description: String(payload.description || row.description),
    features: JSON.stringify(Array.isArray(payload.features) ? payload.features : []),
    applications: JSON.stringify(Array.isArray(payload.applications) ? payload.applications : []),
    seoTitle: String(payload.seoTitle || row.seoTitle || row.name),
    seoDescription: String(payload.seoDescription || row.seoDescription || row.summary),
    tags: JSON.stringify(Array.isArray(payload.tags) ? payload.tags : []),
    translationStatus: status,
    sourceHash: hash,
    errorMessage: errorMessage || null,
    updatedAt: new Date(),
  };

  if (existing) {
    await db.update(productTranslations).set(values).where(eq(productTranslations.id, existing.id)).run();
  } else {
    await db.insert(productTranslations).values({ ...values, createdAt: new Date() }).run();
  }
}

export async function translateProduct(row: typeof products.$inferSelect, locales: Locale[] = [...SUPPORTED_LOCALES]) {
  const payload = productPayload(row);
  const hash = sourceHash(payload);
  const results: Array<{ locale: Locale; status: "translated" | "failed"; error?: string }> = [];

  for (const locale of locales) {
    try {
      const translated = await translateJsonObject(payload, locale);
      await upsertProductTranslation(row, locale, "translated", hash, translated);
      results.push({ locale, status: "translated" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown translation error";
      await upsertProductTranslation(row, locale, "failed", hash, payload, message);
      results.push({ locale, status: "failed", error: message });
    }
  }

  return results;
}
