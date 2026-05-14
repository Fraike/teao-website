import type { Product } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { formatTorque } from "@/lib/products";

const PLACEHOLDER = "/images/products/gear-damper/GearDamperSingle.png";

export function RelatedProducts({
  products,
  max = 4,
}: {
  products: Product[];
  max?: number;
}) {
  const display = products.slice(0, max);
  if (display.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-extrabold tracking-[-0.02em] text-[#111827] mb-5">
        Related Products
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {display.map((product) => {
          const torqueLabel = formatTorque(product);
          return (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group flex gap-3 rounded-xl border border-[#E5E7EB] bg-white p-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#ED7606]/35 hover:shadow-[0_14px_36px_rgba(237,118,6,0.08)]"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#F8F9FA]">
                <Image
                  src={product.image || PLACEHOLDER}
                  alt={product.name}
                  fill
                  loading="lazy"
                  className="object-contain p-2"
                  sizes="64px"
                />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#ED7606]">
                  {product.model}
                </span>
                <h3 className="mt-0.5 line-clamp-2 text-xs font-extrabold leading-tight text-[#111827] transition-colors group-hover:text-[#ED7606]">
                  {product.name}
                </h3>
                {torqueLabel && (
                  <p className="mt-1 text-[11px] text-[#6B7280] tabular-nums">{torqueLabel}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
