"use client";

import { useState, useMemo } from "react";
import type { Product, CategoryInfo } from "@/types";
import { ProductSearch } from "./ProductSearch";
import { ProductTable } from "./ProductTable";
import { ProductCardMobile } from "./ProductCardMobile";
import { Pagination } from "./Pagination";

const PAGE_SIZE = 10;

export function ProductListClient({
  products,
}: {
  products: Product[];
  category?: CategoryInfo;
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) => p.model.toLowerCase().includes(q) || p.name.toLowerCase().includes(q),
    );
  }, [products, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const paged = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  const handleSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black uppercase tracking-[0.16em] text-[#9CA3AF]">Products</span>
          <span className="inline-flex items-center justify-center min-w-[28px] h-7 rounded-full bg-[#111827] text-white text-xs font-extrabold px-2">
            {filtered.length}
          </span>
        </div>
        <ProductSearch value={search} onChange={handleSearch} />
      </div>

      <ProductTable products={paged} />

      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
        {paged.map((product) => (
          <ProductCardMobile key={product.slug} product={product} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-[#9CA3AF] text-sm">No products match your search.</p>
        </div>
      )}

      <Pagination page={safePage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
}
