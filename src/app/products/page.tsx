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
import { AUTOMOTIVE_SEO_KEYWORDS, GLOBAL_SEO_KEYWORDS } from "@/lib/seo-keywords";

export const metadata: Metadata = {
  title: "Products | Gear, Rotary, Axial, Barrel & Glove Box Dampers",
  description:
    "Browse TEAO precision dampers and motion control components: gear dampers, rotary dampers, axial dampers, barrel dampers, glove box dampers, latches and custom solutions.",
  keywords: [
    "gear damper",
    "rotary damper",
    "axial damper",
    "barrel damper",
    "glove box damper",
    "automotive interior damper",
    "motion control damper",
    ...GLOBAL_SEO_KEYWORDS,
    ...AUTOMOTIVE_SEO_KEYWORDS,
  ],
  alternates: {
    canonical: "/products",
  },
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
    "Full range of precision gear dampers, rotary dampers, axial dampers, barrel dampers, glove box dampers, latches and custom motion control components.",
    productItems,
    {
      url: category ? `/products?category=${category}` : "/products",
      keywords: [...GLOBAL_SEO_KEYWORDS, ...AUTOMOTIVE_SEO_KEYWORDS],
      about: ["gear damper", "rotary damper", "axial damper", "barrel damper", "glove box damper", "automotive interior damper"],
    },
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
