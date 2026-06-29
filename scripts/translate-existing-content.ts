import { eq } from "drizzle-orm";
import { loadEnvConfig } from "@next/env";
import { isLocale, SUPPORTED_LOCALES, type Locale } from "@/lib/i18n";

loadEnvConfig(process.cwd());

type ContentType = "news" | "products" | "all";

function getArg(name: string) {
  const prefix = `--${name}=`;
  return process.argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}

function getContentType(): ContentType {
  const raw = getArg("type") || "all";
  if (raw === "news" || raw === "products" || raw === "all") return raw;
  throw new Error(`Invalid --type=${raw}. Use news, products, or all.`);
}

function getLocales(): Locale[] {
  const raw = getArg("locales");
  if (!raw) return [...SUPPORTED_LOCALES];
  const locales = raw.split(",").map((item) => item.trim()).filter(Boolean);
  const invalid = locales.filter((locale) => !isLocale(locale));
  if (invalid.length) throw new Error(`Invalid locale(s): ${invalid.join(", ")}`);
  return locales as Locale[];
}

function getLimit() {
  const raw = getArg("limit");
  if (!raw) return Infinity;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 1) throw new Error("--limit must be a positive number.");
  return value;
}

async function translateNews(locales: Locale[], limit: number) {
  const [{ db }, { news }, { translateNewsArticle }] = await Promise.all([
    import("@/db"),
    import("@/db/schema"),
    import("@/lib/translation/news"),
  ]);
  const slug = getArg("slug");
  const rows = slug
    ? await db.select().from(news).where(eq(news.slug, slug)).all()
    : await db.select().from(news).where(eq(news.isPublished, 1)).all();
  const selected = rows.slice(0, limit);
  console.log(`Translating ${selected.length}/${rows.length} published news article(s) for ${locales.join(", ")}...`);

  for (const [index, article] of selected.entries()) {
    const results = await translateNewsArticle({
      id: article.id,
      slug: article.slug,
      title: article.title,
      summary: article.summary,
      content: article.content,
      seoTitle: article.seoTitle,
      keywords: article.keywords,
    }, locales);
    console.log(`[news ${index + 1}/${selected.length}] ${article.slug}: ${results.map((r) => `${r.locale}:${r.status}`).join(", ")}`);
  }
}

async function translateProducts(locales: Locale[], limit: number) {
  const [{ db }, { products }, { translateProduct }] = await Promise.all([
    import("@/db"),
    import("@/db/schema"),
    import("@/lib/translation/products"),
  ]);
  const slug = getArg("slug");
  const rows = slug
    ? await db.select().from(products).where(eq(products.slug, slug)).all()
    : await db.select().from(products).where(eq(products.isActive, 1)).all();
  const selected = rows.slice(0, limit);
  console.log(`Translating ${selected.length}/${rows.length} active product(s) for ${locales.join(", ")}...`);

  for (const [index, product] of selected.entries()) {
    const results = await translateProduct(product, locales);
    console.log(`[product ${index + 1}/${selected.length}] ${product.model} ${product.slug}: ${results.map((r) => `${r.locale}:${r.status}`).join(", ")}`);
  }
}

async function main() {
  const type = getContentType();
  const locales = getLocales();
  const limit = getLimit();

  if (type === "news" || type === "all") await translateNews(locales, limit);
  if (type === "products" || type === "all") await translateProducts(locales, limit);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
