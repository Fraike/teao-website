import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { mapDbProduct } from "@/lib/products";
import type { CategoryInfo } from "@/types";
import { CategoryHero } from "@/components/products/CategoryHero";
import { CategoryTabs } from "@/components/products/CategoryTabs";
import { ProductListClient } from "@/components/products/ProductListClient";
import { ApplicationContent } from "@/components/products/ApplicationContent";
import { InquiryCTA } from "@/components/products/InquiryCTA";

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { category } = await searchParams;
  const catRows = category
    ? db.select().from(categories).where(eq(categories.slug, category)).all()
    : [];

  if (catRows.length > 0) {
    const cat = catRows[0];
    return {
      title: `${cat.name} Manufacturer | Precision Dampers | TEAO`,
      description: `Explore TEAO ${cat.name.toLowerCase()} for automotive interiors, household appliances, office equipment, and industrial machinery. Custom torque available.`,
      keywords: [cat.slug, cat.name.toLowerCase(), "damper", "automotive damper", "motion control", "TEAO"],
    };
  }

  return {
    title: "Products | Precision Dampers & Motion Control | TEAO",
    description:
      "Browse TEAO's full range of precision dampers, latches and motion control components. Gear dampers, axial dampers, glove box dampers, latches and custom solutions.",
  };
}

export default async function ProductsPage({ searchParams }: Props) {
  const { category } = await searchParams;

  const allCategories = db.select().from(categories).all();
  const selectedCategory = category
    ? allCategories.find((c) => c.slug === category) ?? null
    : null;

  const productRows = category
    ? db.select().from(products).where(eq(products.category, category)).all()
    : db.select().from(products).all();

  const mappedProducts = productRows
    .map(mapDbProduct)
    .filter((p) => p.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
      <CategoryHero category={selectedCategory as CategoryInfo | undefined} />
      <CategoryTabs current={category} />
      <section className="section !pt-8 !pb-12">
        <div className="shell">
          <ProductListClient products={mappedProducts} category={selectedCategory as CategoryInfo | undefined} />
        </div>
      </section>
      {selectedCategory && <ApplicationContent category={selectedCategory as CategoryInfo} />}
      <InquiryCTA />
    </>
  );
}
