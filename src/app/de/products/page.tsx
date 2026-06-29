import type { Metadata } from "next";
import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { productTranslations, products } from "@/db/schema";
import { withLocale, getAlternateUrls, LOCALE_OG } from "@/lib/i18n";
import { getProductUrl, mapDbProduct } from "@/lib/products";

export async function generateMetadata(): Promise<Metadata> {
  const locale = "de" as "ja" | "de";
  const title = locale === "ja" ? "製品一覧" : "Produkte";
  const description = locale === "ja"
    ? "TEAOのギアダンパー、ロータリーダンパー、アキシャルダンパー、グローブボックスダンパー、ラッチ製品一覧。"
    : "TEAO Produktübersicht für Zahnrad-Dämpfer, Rotationsdämpfer, Axialdämpfer, Handschuhfachdämpfer und Verriegelungen.";
  return {
    title,
    description,
    alternates: {
      canonical: withLocale("/products", locale),
      languages: getAlternateUrls("/products"),
    },
    openGraph: { title, description, locale: LOCALE_OG[locale] },
  };
}

export default async function LocalizedProductsPage() {
  const locale = "de" as "ja" | "de";
  const rows = await db.select().from(products).all();
  const list = await Promise.all(rows.map(async (row) => {
    const product = mapDbProduct(row);
    if (!product.isActive) return null;
    const translated = await db
      .select()
      .from(productTranslations)
      .where(and(eq(productTranslations.productId, row.id), eq(productTranslations.locale, locale), eq(productTranslations.translationStatus, "translated")))
      .get();
    return translated ? { ...product, name: translated.name, summary: translated.summary } : product;
  }));
  const activeProducts = list.filter((p): p is NonNullable<typeof p> => Boolean(p)).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <main className="section pt-28 lg:pt-32">
      <div className="shell">
        <span className="eyebrow">Produkte</span>
        <h1 className="mt-3 text-[clamp(34px,4vw,52px)] font-black tracking-[-0.05em] text-[#111827]">
          {locale === "ja" ? "TEAO 製品一覧" : "TEAO Produktübersicht"}
        </h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeProducts.map((product) => (
            <Link key={product.slug} href={withLocale(getProductUrl(product), locale)} className="rounded-xl border border-[#E5E7EB] bg-white p-5 transition-colors hover:border-[#ED7606]">
              <div className="text-xs font-black uppercase tracking-[0.12em] text-[#ED7606]">{product.category}</div>
              <h2 className="mt-2 text-xl font-black text-[#111827]">{product.model} {product.name}</h2>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#6B7280]">{product.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
