import type { Metadata } from "next";
import { PRODUCTS, CATEGORIES } from "@/lib/constants";
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
  const cat = CATEGORIES.find((c) => c.slug === category);

  if (cat) {
    return {
      title: `${cat.name} Manufacturer | Precision Dampers | TEAO`,
      description: `Explore TEAO ${cat.name.toLowerCase()} for automotive interiors, household appliances, office equipment, and industrial machinery. Custom torque available.`,
      keywords: [
        cat.slug,
        cat.name.toLowerCase(),
        "damper",
        "automotive damper",
        "motion control",
        "TEAO",
      ],
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
  const selectedCategory = CATEGORIES.find((c) => c.slug === category);

  const products = category
    ? PRODUCTS.filter((p) => p.category === category)
    : PRODUCTS;

  return (
    <>
      <CategoryHero category={selectedCategory} />
      <CategoryTabs current={category} />
      <section className="section !pt-8 !pb-12">
        <div className="shell">
          <ProductListClient products={products} category={selectedCategory} />
        </div>
      </section>
      {selectedCategory && <ApplicationContent category={selectedCategory} />}
      <InquiryCTA />
    </>
  );
}
