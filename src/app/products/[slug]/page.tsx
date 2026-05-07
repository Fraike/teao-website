import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PRODUCTS, CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  const category = CATEGORIES.find((c) => c.slug === product.category);
  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.slug !== product.slug
  ).slice(0, 2);

  return (
    <>
      <section className="section pt-32">
        <div className="shell">
          {/* Breadcrumb */}
          <nav className="text-sm text-[#666666] mb-8">
            <Link href="/" className="hover:text-[#ED7606]">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-[#ED7606]">Products</Link>
            <span className="mx-2">/</span>
            {category && (
              <>
                <Link href={`/products?category=${category.slug}`} className="hover:text-[#ED7606]">{category.name}</Link>
                <span className="mx-2">/</span>
              </>
            )}
            <span className="text-[#171717] font-medium">{product.name}</span>
          </nav>

          {/* Product hero */}
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            {/* Image */}
            <div className="relative bg-[#F5F5F5] rounded-xl aspect-square">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-12"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Info */}
            <div>
              {category && (
                <span className="text-[#ED7606] text-xs font-black uppercase tracking-[0.12em]">
                  {category.name}
                </span>
              )}
              <h1 className="mt-2 text-[clamp(32px,4vw,48px)] leading-[1.05] tracking-[-0.04em] font-extrabold text-[#171717]">
                {product.name}
              </h1>
              <p className="mt-4 text-lg text-[#666666] leading-relaxed">{product.overview}</p>

              {/* Features */}
              <div className="mt-8">
                <h3 className="text-sm font-extrabold uppercase tracking-[0.12em] text-[#171717] mb-3">
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[#333333]">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#ED7606] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3 mt-8">
                <Button href="/contact" variant="primary">Request Quotation</Button>
                <Button href="/contact" variant="outline">Send Your Drawing</Button>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="mb-20">
            <h2 className="text-2xl font-extrabold tracking-[-0.03em] mb-6">Technical Specifications</h2>
            <div className="border border-[#E5E5E5] rounded-lg overflow-hidden">
              {Object.entries(product.specifications).map(([key, value], i) => (
                <div
                  key={key}
                  className={`flex justify-between px-6 py-4 ${
                    i % 2 === 1 ? "bg-[#F5F5F5]" : "bg-white"
                  }`}
                >
                  <span className="text-[#666666] font-medium">{key}</span>
                  <span className="text-[#171717] font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div>
              <h2 className="text-2xl font-extrabold tracking-[-0.03em] mb-6">Related Products</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/products/${p.slug}`}
                    className="group flex items-center gap-5 p-5 rounded-lg border border-[#E5E5E5] hover:shadow-md transition-all duration-300"
                  >
                    <div className="relative w-24 h-24 bg-[#F5F5F5] rounded-lg">
                      <Image src={p.image} alt={p.name} fill className="object-contain p-3" sizes="96px" />
                    </div>
                    <div>
                      <h3 className="font-extrabold tracking-[-0.02em]">{p.name}</h3>
                      <p className="text-sm text-[#666666] mt-1">{p.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
