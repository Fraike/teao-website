"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import type { Product, CategoryInfo } from "@/types";
import { ProductSearch } from "./ProductSearch";
import { ProductTable } from "./ProductTable";
import { ProductCardMobile } from "./ProductCardMobile";
import { Pagination } from "./Pagination";
import { ProductFilterSidebar, type FilterState } from "./ProductFilterSidebar";

const PAGE_SIZE = 10;

export function ProductListClient({
  products,
  showFilter = false,
  torqueRange,
  mountingOptions,
  dampingOptions,
}: {
  products: Product[];
  category?: CategoryInfo;
  showFilter?: boolean;
  torqueRange?: { min: number; max: number };
  mountingOptions?: string[];
  dampingOptions?: string[];
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const prevProductsRef = useRef(products);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    torqueMin: null,
    torqueMax: null,
    mountingMethods: [],
    dampingDirections: [],
  });

  // Reset page to 1 when products change (e.g. switching categories)
  useEffect(() => {
    if (prevProductsRef.current !== products) {
      prevProductsRef.current = products;
      setPage(1);
      setFilters({ torqueMin: null, torqueMax: null, mountingMethods: [], dampingDirections: [] });
    }
  }, [products]);

  const filtered = useMemo(() => {
    let result = products;

    // Apply search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.model.toLowerCase().includes(q) || p.name.toLowerCase().includes(q),
      );
    }

    // Apply torque filter
    if (filters.torqueMin !== null || filters.torqueMax !== null) {
      result = result.filter((p) => {
        if (!p.torque) return false;
        const val = p.torque.unit === "gf.cm"
          ? (p.torque.min + p.torque.max) / 2
          : p.torque.unit === "kgf.cm"
            ? (p.torque.min + p.torque.max) / 2 * 1000
            : (p.torque.min + p.torque.max) / 2 * 10197.16;
        if (filters.torqueMin !== null && val < filters.torqueMin) return false;
        if (filters.torqueMax !== null && val > filters.torqueMax) return false;
        return true;
      });
    }

    // Apply mounting method filter
    if (filters.mountingMethods.length > 0) {
      result = result.filter((p) =>
        p.assembly_method && filters.mountingMethods.includes(p.assembly_method),
      );
    }

    // Apply damping direction filter
    if (filters.dampingDirections.length > 0) {
      result = result.filter((p) =>
        p.buffer_direction && filters.dampingDirections.includes(p.buffer_direction),
      );
    }

    return result;
  }, [products, search, filters]);

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
    <div className={showFilter ? "grid lg:grid-cols-[260px_1fr] gap-6" : ""}>
      {/* Filter Sidebar */}
      {showFilter && torqueRange && mountingOptions && dampingOptions && (
        <aside className="hidden lg:block">
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
      )}

      <div>
        {/* Mobile filter toggle */}
        {showFilter && (
          <div className="lg:hidden mb-4">
            <ProductFilterSidebar
              filters={filters}
              onChange={setFilters}
              torqueRange={torqueRange!}
              mountingOptions={mountingOptions!}
              dampingOptions={dampingOptions!}
            />
          </div>
        )}

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
            <p className="text-[#9CA3AF] text-sm">No products match your filters.</p>
          </div>
        )}

        <Pagination page={safePage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}
