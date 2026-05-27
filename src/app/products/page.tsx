import type { Metadata } from "next";
import { db } from "@/db";
import { products } from "@/db/schema";
import { mapDbProduct, getProductUrl } from "@/lib/products";
import { CATEGORIES } from "@/lib/constants";
import { JsonLdScript, collectionPageSchema } from "@/lib/structured-data";
import { CategoryHero } from "@/components/products/CategoryHero";
import { CategoryTabs } from "@/components/products/CategoryTabs";
import { ProductListClient } from "@/components/products/ProductListClient";
import { InquiryCTA } from "@/components/products/InquiryCTA";

export const metadata: Metadata = {
  title: "Products | Precision Dampers & Motion Control | TEAO",
  description:
    "Browse TEAO's full range of precision dampers, latches and motion control components. Gear dampers, axial dampers, glove box dampers, latches and custom solutions.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const productRows = await db.select().from(products).all();

  const mappedProducts = productRows
    .map(mapDbProduct)
    .filter((p) => p.isActive)
    .filter((p) => !category || p.category === category)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const categoryInfo = category
    ? CATEGORIES.find((c) => c.slug === category)
    : undefined;

  const productItems = mappedProducts.map((p) => ({
    name: `${p.model} – ${p.name}`,
    url: getProductUrl(p),
  }));
  const listingJsonLd = collectionPageSchema(
    categoryInfo?.name ?? "All Products",
    "Full range of precision dampers, latches and motion control components.",
    productItems,
  );

  return (
    <>
      <JsonLdScript data={listingJsonLd} />
      <CategoryHero category={categoryInfo} />
      <CategoryTabs current={category} />
      <section className="section !pt-8 !pb-12">
        <div className="shell">
          <ProductListClient products={mappedProducts} />
        </div>
      </section>
      <InquiryCTA />
    </>
  );
}
