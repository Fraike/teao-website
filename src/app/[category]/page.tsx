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

  // Compute filter options for gear-damper
  const showFilter = category === "gear-damper";
  const filterProps = showFilter
    ? (() => {
        const torques = mappedProducts
          .filter((p) => p.torque?.unit === "gf.cm")
          .flatMap((p) => [p.torque!.min, p.torque!.max]);
        const torqueMin = torques.length > 0 ? Math.floor(Math.min(...torques)) : 0;
        const torqueMax = torques.length > 0 ? Math.ceil(Math.max(...torques)) : 1000;
        const mountingOptions = [...new Set(mappedProducts.map((p) => p.assembly_method).filter(Boolean))] as string[];
        const dampingOptions = [...new Set(mappedProducts.map((p) => p.buffer_direction).filter(Boolean))] as string[];
        return {
          torqueRange: { min: torqueMin, max: torqueMax },
          mountingOptions,
          dampingOptions,
        };
      })()
    : undefined;

  return (
    <>
      <JsonLdScript data={listingJsonLd} />
      <JsonLdScript data={breadcrumbJsonLd} />
      <JsonLdScript data={faqPageSchema(categoryFAQ)} />
      <CategoryHero category={categoryInfo} />
      <CategoryTabs current={category} />
      <section className="section !pt-8 !pb-12">
        <div className="shell">
          <ProductListClient
            products={mappedProducts}
            category={categoryInfo}
            showFilter={showFilter}
            {...(filterProps || {})}
          />
        </div>
      </section>
      <CategoryExplainer category={categoryInfo} />
      <ApplicationContent category={categoryInfo} />
      <InquiryCTA />
    </>
  );
}
