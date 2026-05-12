import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

export function CategoryTabs({ current }: { current?: string }) {
  return (
    <div className="shell">
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
        <Link
          href="/products"
          className={`shrink-0 px-5 py-2 rounded-full text-sm font-bold transition-colors ${
            !current
              ? "bg-[#ED7606] text-white"
              : "border border-[#E5E5E5] text-[#666666] hover:border-[#ED7606] hover:text-[#ED7606]"
          }`}
        >
          All Products
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/products?category=${cat.slug}`}
            className={`shrink-0 px-5 py-2 rounded-full text-sm font-bold transition-colors ${
              current === cat.slug
                ? "bg-[#ED7606] text-white"
                : "border border-[#E5E5E5] text-[#666666] hover:border-[#ED7606] hover:text-[#ED7606]"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
