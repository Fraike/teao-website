"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, FileText, Loader2, Package, Search, X } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";

interface SearchItem {
  type: "product" | "news";
  title: string;
  label: string;
  excerpt: string;
  image?: string;
  url: string;
  publishedAt?: string;
}

interface SearchResponse {
  products: SearchItem[];
  news: SearchItem[];
  total: number;
}

const EMPTY_RESULTS: SearchResponse = { products: [], news: [], total: 0 };

function trackSearchEvent(event: string, page: string, targetId?: string, metadata?: Record<string, unknown>) {
  window.dispatchEvent(
    new CustomEvent("teao:track", {
      detail: {
        event,
        page,
        targetType: "global_search",
        targetId: targetId ?? null,
        source: "header",
        metadata,
      },
    }),
  );
}

export function GlobalSearch() {
  const pathname = usePathname();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResponse>(EMPTY_RESULTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 40);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults(EMPTY_RESULTS);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Search request failed");
        const data = (await response.json()) as SearchResponse;
        setResults(data);
        trackSearchEvent("search", pathname, trimmed, { total: data.total });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setResults(EMPTY_RESULTS);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 220);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [open, pathname, query]);

  const openSearch = () => {
    setOpen(true);
    trackSearchEvent("search_open", pathname);
  };

  const closeSearch = () => {
    setOpen(false);
    setQuery("");
    setResults(EMPTY_RESULTS);
    setLoading(false);
  };

  const renderGroup = (title: string, items: SearchItem[], icon: "product" | "news") => {
    if (items.length === 0) return null;
    const Icon = icon === "product" ? Package : FileText;

    return (
      <section>
        <div className="mb-2 flex items-center gap-2 px-1 text-[11px] font-black uppercase tracking-[0.14em] text-[#6B7280]">
          <Icon size={14} className="text-[#ED7606]" />
          {title}
        </div>
        <div className="space-y-2">
          {items.map((item) => (
            <Link
              key={`${item.type}-${item.url}`}
              href={item.url}
              onClick={(event) => {
                event.preventDefault();
                trackSearchEvent("search_result_click", pathname, item.url, {
                  query: query.trim(),
                  type: item.type,
                });
                setOpen(false);
                router.push(item.url);
              }}
              className="group grid min-h-[88px] grid-cols-[64px_1fr_auto] items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white p-3 transition-all duration-200 hover:border-[#ED7606]/40 hover:shadow-[0_14px_36px_rgba(17,24,39,0.08)]"
            >
              <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-[#F8F9FA]">
                {item.image ? (
                  <SafeImage
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain p-1.5"
                    sizes="64px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[#9CA3AF]">
                    <Icon size={20} />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="mb-1 flex items-center gap-2">
                  <span className="max-w-full truncate rounded-full bg-[#F3F4F6] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#6B7280]">
                    {item.label}
                  </span>
                  {item.publishedAt && (
                    <span className="shrink-0 text-[11px] font-medium text-[#9CA3AF]">
                      {item.publishedAt}
                    </span>
                  )}
                </div>
                <h3 className="truncate text-sm font-extrabold text-[#111827] transition-colors group-hover:text-[#ED7606]">
                  {item.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#6B7280]">
                  {item.excerpt}
                </p>
              </div>
              <ArrowRight size={16} className="text-[#9CA3AF] transition-colors group-hover:text-[#ED7606]" />
            </Link>
          ))}
        </div>
      </section>
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#6B7280] transition-colors hover:border-[#ED7606] hover:text-[#ED7606] lg:h-[38px] lg:w-[38px]"
        aria-label="Open search"
        title="Search"
      >
        <Search size={17} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 px-4 pt-20 sm:pt-24" role="dialog" aria-modal="true" aria-label="Search site">
          <button
            type="button"
            aria-label="Close search"
            className="absolute inset-0 h-full w-full cursor-default bg-[#111827]/38 backdrop-blur-sm"
            onClick={closeSearch}
          />
          <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_26px_80px_rgba(17,24,39,0.22)]">
            <div className="flex items-center gap-3 border-b border-[#E5E7EB] px-4 py-3">
              <Search size={19} className="shrink-0 text-[#ED7606]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search products and articles..."
                className="h-11 min-w-0 flex-1 bg-transparent text-base font-semibold text-[#111827] outline-none placeholder:text-[#9CA3AF]"
              />
              {loading && <Loader2 size={18} className="animate-spin text-[#9CA3AF]" />}
              <button
                type="button"
                onClick={closeSearch}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#6B7280] transition-colors hover:bg-[#F3F4F6] hover:text-[#111827]"
                aria-label="Close search"
              >
                <X size={19} />
              </button>
            </div>

            <div className="max-h-[min(68vh,620px)] overflow-y-auto p-4">
              {query.trim().length < 2 ? (
                <div className="py-10 text-center">
                  <p className="text-sm font-bold text-[#111827]">Type at least 2 characters</p>
                  <p className="mt-2 text-sm text-[#6B7280]">Find product models, damper types, guides and news.</p>
                </div>
              ) : loading && results.total === 0 ? (
                <div className="flex items-center justify-center gap-2 py-12 text-sm font-semibold text-[#6B7280]">
                  <Loader2 size={18} className="animate-spin" />
                  Searching...
                </div>
              ) : results.total === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm font-bold text-[#111827]">No results found</p>
                  <p className="mt-2 text-sm text-[#6B7280]">Try a product model, damper type, or application keyword.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {renderGroup("Products", results.products, "product")}
                  {renderGroup("Articles", results.news, "news")}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
