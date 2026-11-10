"use client";

import { useState } from "react";
import type { Product } from "@/types";
import { ProductSearch } from "./ProductSearch";
import { ProductTable } from "./ProductTable";
import { ProductCardMobile } from "./ProductCardMobile";
import { Pagination } from "./Pagination";
import { ProductFilterSidebar, type FilterState } from "./ProductFilterSidebar";

const PAGE_SIZE = 10;

export function FilteredProductList({
  products,
  torqueRange,
  mountingOptions,
  dampingOptions,
}: {
  products: Product[];
  torqueRange: { min: number; max: number };
  mountingOptions: string[];
  dampingOptions: string[];
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    torqueMin: null,
    torqueMax: null,
    mountingMethods: [],
    dampingDirections: [],
  });

  // Apply search
  let filtered = products;
  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) => p.model.toLowerCase().includes(q) || p.name.toLowerCase().includes(q),
    );
  }

  // Apply torque filter
  if (filters.torqueMin !== null || filters.torqueMax !== null) {
    filtered = filtered.filter((p) => {
      if (!p.torque) return false;
      const val =
        p.torque.unit === "gf.cm"
          ? (p.torque.min + p.torque.max) / 2
          : p.torque.unit === "kgf.cm"
            ? ((p.torque.min + p.torque.max) / 2) * 1000
            : ((p.torque.min + p.torque.max) / 2) * 10197.16;
      if (filters.torqueMin !== null && val < filters.torqueMin) return false;
      if (filters.torqueMax !== null && val > filters.torqueMax) return false;
      return true;
    });
  }

  // Apply mounting method filter
  if (filters.mountingMethods.length > 0) {
    filtered = filtered.filter(
      (p) => p.assembly_method && filters.mountingMethods.includes(p.assembly_method),
    );
  }

  // Apply damping direction filter
  if (filters.dampingDirections.length > 0) {
    filtered = filtered.filter(
      (p) => p.buffer_direction && filters.dampingDirections.includes(p.buffer_direction),
    );
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="shell">
      <div className="xl:grid xl:grid-cols-[220px_minmax(0,1fr)] xl:gap-8">
        {/* Desktop filter sidebar — in normal flow so it is never clipped */}
        <aside className="hidden xl:block">
          <div className="sticky top-28">
            <ProductFilterSidebar
              filters={filters}
              onChange={setFilters}
              torqueRange={torqueRange}
              mountingOptions={mountingOptions}
              dampingOptions={dampingOptions}
            />
          </div>
        </aside>

        <div className="min-w-0">
          {/* Filter for narrow screens */}
          <div className="xl:hidden mb-5">
            <ProductFilterSidebar
              filters={filters}
              onChange={setFilters}
              torqueRange={torqueRange}
              mountingOptions={mountingOptions}
              dampingOptions={dampingOptions}
            />
          </div>

          {/* Product header */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-[#9CA3AF]">Products</span>
              <span className="inline-flex items-center justify-center min-w-[28px] h-7 rounded-full bg-[#111827] text-white text-xs font-extrabold px-2">
                {filtered.length}
              </span>
            </div>
            <ProductSearch value={search} onChange={(v) => { setSearch(v); setPage(1); }} />
          </div>

          <ProductTable products={paged} />

          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
            {paged.map((product) => (
              <ProductCardMobile key={product.slug} product={product} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[#9CA3AF] text-sm">No products match your filters.</p>
            </div>
          )}

          <Pagination page={safePage} totalPages={totalPages} onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
        </div>
      </div>
    </div>
  );
}
