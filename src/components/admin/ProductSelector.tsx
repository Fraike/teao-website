"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X } from "lucide-react";

interface ProductOption {
  slug: string;
  model: string;
  name: string;
}

interface Props {
  selected: string[];
  onChange: (slugs: string[]) => void;
}

export function ProductSelector({ selected, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<NodeJS.Timeout | null>(null);

  const searchProducts = useCallback(async (term: string) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/products?q=${encodeURIComponent(term)}`);
      if (res.ok) {
        const data: ProductOption[] = await res.json();
        setResults(data.filter((p) => !selected.includes(p.slug)));
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, [selected]);

  const handleInputChange = (val: string) => {
    setQuery(val);
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => {
      searchProducts(val);
    }, 300);
  };

  const addProduct = (slug: string) => {
    if (!selected.includes(slug)) {
      onChange([...selected, slug]);
    }
    setQuery("");
    setIsOpen(false);
  };

  const removeProduct = (slug: string) => {
    onChange(selected.filter((s) => s !== slug));
  };

  // Click outside closes dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            handleInputChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search products to link..."
          className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#ED7606] focus:ring-2 focus:ring-[#ED7606]/10"
        />
      </div>

      {/* Dropdown results */}
      {isOpen && query && (
        <div className="absolute z-20 mt-1 w-full bg-white rounded-lg border border-[#E5E7EB] shadow-lg max-h-48 overflow-y-auto">
          {loading && (
            <div className="px-3 py-2 text-xs text-[#9CA3AF]">Searching...</div>
          )}
          {!loading && results.length === 0 && (
            <div className="px-3 py-2 text-xs text-[#9CA3AF]">No products found</div>
          )}
          {results.map((p) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => addProduct(p.slug)}
              className="w-full px-3 py-2 text-left hover:bg-[#F8F9FA] transition-colors flex items-center gap-2"
            >
              <span className="text-[10px] font-bold text-[#9CA3AF] uppercase min-w-[60px]">{p.model}</span>
              <span className="text-xs text-[#374151] truncate">{p.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Selected tags */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selected.map((slug) => (
            <span
              key={slug}
              className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full bg-[#FFF7ED] border border-[#FED7AA] text-[11px] font-medium text-[#ED7606]"
            >
              {slug}
              <button
                type="button"
                onClick={() => removeProduct(slug)}
                className="p-0.5 rounded-full hover:bg-[#FED7AA] transition-colors"
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
