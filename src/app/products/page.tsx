import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PRODUCTS, CATEGORIES } from "@/lib/constants";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse TEAO's full range of precision dampers, latches and motion control components.",
};

export default function ProductsPage() {
  return (
    <>
      <section className="section pt-32">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow="Products"
              title="Precision damper solutions."
              description="Five focused product lines engineered for stable torque, quiet motion and repeatable mass production."
            />
          </Reveal>

          {/* Category filter tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            <Link
              href="/products"
              className="px-5 py-2 rounded-full text-sm font-bold bg-[#ED7606] text-white"
            >
              All
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="px-5 py-2 rounded-full text-sm font-bold border border-[#E5E5E5] text-[#666666] hover:border-[#ED7606] hover:text-[#ED7606] transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRODUCTS.map((product, i) => (
              <Reveal key={product.slug} delay={i % 2 === 0 ? undefined : ((i % 2 + 1) as 1 | 2)}>
                <Link
                  href={`/products/${product.slug}`}
                  className="group block rounded-lg border border-[#E5E5E5] bg-white hover:-translate-y-2 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="relative aspect-[4/3] bg-[#F5F5F5]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-8 transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-[#ED7606] text-xs font-black uppercase tracking-[0.12em]">
                      {CATEGORIES.find((c) => c.slug === product.category)?.name}
                    </span>
                    <h3 className="mt-1.5 text-lg font-extrabold tracking-[-0.02em] text-[#171717]">
                      {product.name}
                    </h3>
                    <p className="mt-1.5 text-[#666666] text-sm">{product.description}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
