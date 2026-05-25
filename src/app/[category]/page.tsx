import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { mapDbProduct, getProductUrl } from "@/lib/products";
import { JsonLdScript, collectionPageSchema, breadcrumbSchema } from "@/lib/structured-data";
import type { CategoryInfo } from "@/types";
import { CategoryHero } from "@/components/products/CategoryHero";
import { CategoryTabs } from "@/components/products/CategoryTabs";
import { ProductListClient } from "@/components/products/ProductListClient";
import { ApplicationContent } from "@/components/products/ApplicationContent";
import { InquiryCTA } from "@/components/products/InquiryCTA";

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

  return {
    title: `${catRow.name} Manufacturer | Precision Dampers | TEAO`,
    description: catRow.description,
    keywords: [category, catRow.name.toLowerCase(), "damper", "motion control", "TEAO"],
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
    `${categoryInfo.name} Dampers`,
    categoryInfo.description,
    productItems,
  );

  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: categoryInfo.name },
  ]);

  return (
    <>
      <JsonLdScript data={listingJsonLd} />
      <JsonLdScript data={breadcrumbJsonLd} />
      <CategoryHero category={categoryInfo} />
      <CategoryTabs current={category} />
      <section className="section !pt-8 !pb-12">
        <div className="shell">
          <ProductListClient products={mappedProducts} category={categoryInfo} />
        </div>
      </section>
      <ApplicationContent category={categoryInfo} />
      <InquiryCTA />
    </>
  );
}
