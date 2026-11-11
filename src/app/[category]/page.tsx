import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { mapDbProduct, getProductUrl } from "@/lib/products";
import { JsonLdScript, collectionPageSchema, breadcrumbSchema, faqPageSchema } from "@/lib/structured-data";
import type { CategoryInfo } from "@/types";
import { CategoryHero } from "@/components/products/CategoryHero";
import { CategoryTabs } from "@/components/products/CategoryTabs";
import { ProductListClient } from "@/components/products/ProductListClient";
import { ApplicationContent } from "@/components/products/ApplicationContent";
import { CategoryExplainer } from "@/components/products/CategoryExplainer";
import { InquiryCTA } from "@/components/products/InquiryCTA";
import { getCategorySeo } from "@/lib/seo-keywords";
import Link from "next/link";
import { damperSelection, getDamperInquiryUrl, type DamperSelectionCategory } from "@/lib/growth-content";

export const revalidate = 60;

const VALID_CATEGORIES = ["gear-damper", "axial-damper", "glove-box-damper", "latch", "other"];

export async function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({ category }));
}

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  if (!VALID_CATEGORIES.includes(category)) return { title: "Category Not Found" };

  const catRow = await db.select().from(categories).where(eq(categories.slug, category)).get();
  if (!catRow) return { title: "Category Not Found" };

  const seo = getCategorySeo(category, catRow.name, catRow.description);
  const title = seo.title.replace(/\s*\|\s*TEAO$/i, "");

  return {
    title,
    description: seo.description,
    keywords: [...seo.keywords, ...seo.aliases, "TEAO"],
    alternates: {
      canonical: `/${category}`,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: [{ url: catRow.image, width: 1200, height: 800 }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [catRow.image],
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

  if (!VALID_CATEGORIES.includes(category)) notFound();

  const catRow = await db.select().from(categories).where(eq(categories.slug, category)).get();
  if (!catRow) notFound();

  const categoryInfo: CategoryInfo = {
    slug: catRow.slug as CategoryInfo["slug"],
    name: catRow.name,
    description: catRow.description,
    image: catRow.image,
  };
  const seo = getCategorySeo(category, catRow.name, catRow.description);

  const productRows = await db
    .select()
    .from(products)
    .where(eq(products.category, category))
    .all();

  const mappedProducts = productRows
    .map(mapDbProduct)
    .filter((p) => p.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const productItems = mappedProducts.map((p) => ({
    name: `${p.model} – ${p.name}`,
    url: getProductUrl(p),
  }));

  const listingJsonLd = collectionPageSchema(
    seo.title.replace(" | TEAO", ""),
    seo.description,
    productItems,
    {
      url: `/${category}`,
      keywords: [...seo.keywords, ...seo.aliases],
      about: [...seo.keywords.slice(0, 8), ...seo.aliases],
    },
  );

  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: categoryInfo.name },
  ]);

  const categoryFAQ = seo.faq;
  const selection = damperSelection[category as DamperSelectionCategory];

  return (
    <>
      <JsonLdScript data={listingJsonLd} />
      <JsonLdScript data={breadcrumbJsonLd} />
      <JsonLdScript data={faqPageSchema(categoryFAQ)} />
      <div className={category === "gear-damper" ? "gear-catalog" : undefined}>
        <CategoryHero category={categoryInfo} />
        <CategoryTabs current={category} />
        <section className="section !pt-8 !pb-12">
          {selection && (
            <div className="shell">
              <aside aria-labelledby="selection-guide" className="mb-8 rounded-xl border border-[#E5E7EB] bg-[#F8F9FA] p-5 sm:p-6">
                <h2 id="selection-guide" className="text-xl font-extrabold text-[#111827]">How to select a damper</h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#4B5563]">{selection.selection}</p>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <Link href={getDamperInquiryUrl(category, selection.application)} className="btn btn-primary" data-analytics-event="cta_click" data-analytics-target-type="category" data-analytics-target-id={category} data-analytics-source="category_selection">
                    Request selection support
                  </Link>
                  <Link href={`/news/${selection.guide}.html`} className="text-sm font-bold text-[#9A4D06] hover:underline">Read the selection guide</Link>
                </div>
              </aside>
            </div>
          )}
          <ProductListClient products={mappedProducts} category={categoryInfo} />
        </section>
      </div>
      <CategoryExplainer category={categoryInfo} />
      <ApplicationContent category={categoryInfo} />
      <InquiryCTA />
    </>
  );
}
