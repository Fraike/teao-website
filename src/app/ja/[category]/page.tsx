import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, productTranslations, products } from "@/db/schema";
import { withLocale, getAlternateUrls, LOCALE_OG } from "@/lib/i18n";
import { getCategorySeo } from "@/lib/seo-keywords";
import { getProductUrl, mapDbProduct } from "@/lib/products";
import { getHomeCopy } from "@/lib/home-i18n";

const VALID_CATEGORIES = ["gear-damper", "axial-damper", "glove-box-damper", "latch", "other"];

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const locale = "ja" as "ja" | "de";
  if (!VALID_CATEGORIES.includes(category)) return { title: "Category Not Found" };
  const catRow = await db.select().from(categories).where(eq(categories.slug, category)).get();
  if (!catRow) return { title: "Category Not Found" };
  const translatedCategory = getHomeCopy(locale).products.categories[category as keyof ReturnType<typeof getHomeCopy>["products"]["categories"]];
  const seo = getCategorySeo(category, catRow.name, catRow.description);
  return {
    title: translatedCategory?.name || seo.title.replace(/\s*\|\s*TEAO$/i, ""),
    description: translatedCategory?.description || seo.description,
    keywords: [...seo.keywords, ...seo.aliases, "TEAO"],
    alternates: {
      canonical: withLocale(`/${category}`, locale),
      languages: getAlternateUrls(`/${category}`),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      locale: LOCALE_OG[locale],
      images: [{ url: catRow.image, width: 1200, height: 800 }],
    },
  };
}

export default async function LocalizedCategoryPage({ params }: Props) {
  const { category } = await params;
  const locale = "ja" as "ja" | "de";
  if (!VALID_CATEGORIES.includes(category)) notFound();
  const catRow = await db.select().from(categories).where(eq(categories.slug, category)).get();
  if (!catRow) notFound();
  const productRows = await db.select().from(products).where(eq(products.category, category)).all();
  const list = await Promise.all(productRows.map(async (row) => {
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
  const translatedCategory = getHomeCopy(locale).products.categories[category as keyof ReturnType<typeof getHomeCopy>["products"]["categories"]];
  const categoryName = translatedCategory?.name || catRow.name;
  const categoryDescription = translatedCategory?.description || catRow.description;

  return (
    <main className="section pt-28 lg:pt-32">
      <div className="shell">
        <span className="eyebrow">{categoryName}</span>
        <h1 className="mt-3 text-[clamp(34px,4vw,52px)] font-black tracking-[-0.05em] text-[#111827]">{categoryName}</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#6B7280]">{categoryDescription}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeProducts.map((product) => (
            <Link key={product.slug} href={withLocale(getProductUrl(product), locale)} className="rounded-xl border border-[#E5E7EB] bg-white p-5 transition-colors hover:border-[#ED7606]">
              <div className="text-xs font-black uppercase tracking-[0.12em] text-[#ED7606]">{product.model}</div>
              <h2 className="mt-2 text-xl font-black text-[#111827]">{product.name}</h2>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#6B7280]">{product.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
