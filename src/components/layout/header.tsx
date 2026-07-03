"use client";

import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Globe2 } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { stripLocale, withLocale } from "@/lib/i18n";
import { getUiCopy } from "@/lib/i18n-ui";
import { getCategoryUrl } from "@/lib/products";

const NAV_ITEMS = [
  { key: "products", href: "/products", mega: true },
  { key: "applications", href: "/applications" },
  { key: "news", href: "/news" },
  { key: "quality", href: "/quality" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
] as const;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { locale, path: currentPath } = stripLocale(pathname || "/");
  const copy = getUiCopy(locale);
  const currentLanguageLabel = locale === "ja" ? "日本語" : locale === "de" ? "Deutsch" : "EN";
  const localeLinks = [
    { label: "English", href: currentPath, code: "EN" },
    { label: "中文", href: "https://www.chinateao.com/", external: true, code: "CN" },
    { label: "日本語", href: withLocale(currentPath, "ja"), code: "JA" },
    { label: "Deutsch", href: withLocale(currentPath, "de"), code: "DE" },
  ].filter((item) => item.code !== (locale === "ja" ? "JA" : locale === "de" ? "DE" : "EN"));
  const categoryLabels: Record<string, string> = {
    "gear-damper": copy.footer.links.gearDampers,
    "axial-damper": copy.footer.links.axialDampers,
    "glove-box-damper": copy.footer.links.gloveBoxDampers,
    latch: copy.footer.links.latches,
    other: copy.footer.links.otherProducts,
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30 transition-all duration-300">
        <nav
          className={`h-14 lg:h-16 flex items-center justify-between px-5 lg:px-8 transition-all duration-300 ${
            scrolled
              ? "bg-white/90 backdrop-blur-xl border-b border-[#E5E7EB]/60 shadow-[0_1px_3px_rgba(0,0,0,.04)]"
              : "bg-white/70 backdrop-blur-lg border-b border-transparent"
          }`}
        >
          {/* Brand */}
          <Link href={withLocale("/", locale)} className="flex items-center gap-3 font-black tracking-tight shrink-0">
            <div className="relative w-[82px] h-7 lg:w-[98px] lg:h-8">
              <Image
                src="/images/logo-color.webp"
                alt="TEAO"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 1024px) 82px, 98px"
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6 text-[13px] font-semibold text-[#374151]">
            {NAV_ITEMS.map((item) =>
              "mega" in item && item.mega ? (
                <div key={item.key} className="relative group flex items-center min-h-16">
                  <Link
                    href={withLocale(item.href, locale)}
                    className="flex items-center gap-1 relative after:absolute after:left-0 after:right-0 after:-bottom-2 after:h-0.5 after:bg-[#ED7606] after:scale-x-0 after:transition-transform after:duration-300 group-hover:after:scale-x-100 hover:text-[#ED7606] transition-colors"
                  >
                    {copy.nav[item.key]}
                    <ChevronDown size={14} />
                  </Link>
                  {/* Mega Menu */}
                  <div className="absolute top-[58px] left-1/2 w-[760px] p-3 grid grid-cols-5 gap-2 rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_20px_60px_rgba(0,0,0,.08)] opacity-0 invisible translate-y-2.5 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 -translate-x-1/2">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={withLocale(getCategoryUrl(cat), locale)}
                        className="min-h-[142px] p-3.5 flex flex-col justify-between rounded-xl border border-[#E5E7EB]/60 bg-[#F8F9FA] hover:-translate-y-1 hover:border-[#ED7606]/40 hover:bg-white transition-all duration-300"
                      >
                        <div className="relative w-full h-[76px]">
                          <Image
                            src={cat.image}
                            alt={categoryLabels[cat.slug] || cat.name}
                            fill
                            className="object-contain rounded-lg bg-white p-1.5"
                            sizes="140px"
                          />
                        </div>
                        <strong className="mt-3 text-xs leading-tight text-[#111827]">{categoryLabels[cat.slug] || cat.name}</strong>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.key}
                  href={withLocale(item.href, locale)}
                  className="relative after:absolute after:left-0 after:right-0 after:-bottom-2 after:h-0.5 after:bg-[#ED7606] after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 hover:text-[#ED7606] transition-colors"
                >
                  {copy.nav[item.key]}
                </Link>
              )
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            <div className="group relative hidden lg:block">
              <button
                type="button"
                className="inline-flex h-[38px] items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-white px-3 text-xs font-extrabold text-[#374151] shadow-[0_8px_22px_rgba(17,24,39,0.05)] transition-colors hover:border-[#ED7606]/50 hover:text-[#ED7606]"
                aria-label={copy.actions.language}
              >
                <Globe2 size={14} />
                <span>{currentLanguageLabel}</span>
                <ChevronDown size={13} />
              </button>
              <div className="invisible absolute right-0 top-[44px] w-44 translate-y-2 rounded-2xl border border-[#E5E7EB] bg-white p-1.5 opacity-0 shadow-[0_18px_50px_rgba(17,24,39,0.12)] transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                {localeLinks.map((item) =>
                  item.external ? (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-[#374151] transition-colors hover:bg-[#FFF7ED] hover:text-[#ED7606]"
                    >
                      <span>{item.label}</span>
                      <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#9CA3AF]">{item.code}</span>
                    </a>
                  ) : (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-[#374151] transition-colors hover:bg-[#FFF7ED] hover:text-[#ED7606]"
                    >
                      <span>{item.label}</span>
                      <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#9CA3AF]">{item.code}</span>
                    </Link>
                  )
                )}
              </div>
            </div>
            <GlobalSearch />
            <Link
              href={withLocale("/torque-converter", locale)}
              className="hidden sm:inline-flex items-center h-[38px] px-4 text-xs font-bold rounded-full border border-[#E5E7EB] bg-white text-[#374151] hover:border-[#ED7606] hover:text-[#ED7606] transition-colors"
            >
              {copy.actions.torqueConverter}
            </Link>
            <Link
              href={withLocale("/contact", locale)}
              className="inline-flex items-center h-9 lg:h-[38px] px-3.5 lg:px-4 text-xs font-bold rounded-full bg-[#ED7606] text-white hover:bg-[#D46900] shadow-[0_8px_20px_rgba(237,118,6,.2)] transition-all duration-300"
            >
              {copy.actions.sendInquiry}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden ml-1 p-1.5 text-[#374151]"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-20 bg-white/97 backdrop-blur-xl pt-24">
          <div className="flex flex-col gap-2 px-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={withLocale(item.href, locale)}
                onClick={() => setMobileOpen(false)}
                className="py-3 text-[#374151] text-lg font-semibold border-b border-[#E5E7EB]"
              >
                {copy.nav[item.key]}
              </Link>
            ))}
            <Link
              href={withLocale("/torque-converter", locale)}
              onClick={() => setMobileOpen(false)}
              className="mt-4 py-3 text-center text-sm font-bold rounded-full border border-[#E5E7EB] text-[#374151]"
            >
              {copy.actions.torqueConverter}
            </Link>
            <div className="mt-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#9CA3AF]">
              <Globe2 size={14} />
              {copy.actions.language}
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {localeLinks.map((item) =>
                item.external ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className="py-3 text-center text-sm font-bold rounded-full bg-[#F8F9FA] text-[#374151]"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="py-3 text-center text-sm font-bold rounded-full bg-[#F8F9FA] text-[#374151]"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
