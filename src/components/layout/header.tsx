"use client";

import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";

const NAV_ITEMS = [
  { label: "Products", href: "/products", mega: true },
  { label: "Applications", href: "/applications" },
  { label: "News", href: "/news" },
  { label: "Quality", href: "/quality" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
          <Link href="/" className="flex items-center gap-3 font-black tracking-tight shrink-0">
            <div className="relative w-[82px] h-7 lg:w-[98px] lg:h-8">
              <Image
                src="/images/logo-color.png"
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
              item.mega ? (
                <div key={item.label} className="relative group flex items-center min-h-16">
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 relative after:absolute after:left-0 after:right-0 after:-bottom-2 after:h-0.5 after:bg-[#ED7606] after:scale-x-0 after:transition-transform after:duration-300 group-hover:after:scale-x-100 hover:text-[#ED7606] transition-colors"
                  >
                    {item.label}
                    <ChevronDown size={14} />
                  </Link>
                  {/* Mega Menu */}
                  <div className="absolute top-[58px] left-1/2 w-[760px] p-3 grid grid-cols-5 gap-2 rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_20px_60px_rgba(0,0,0,.08)] opacity-0 invisible translate-y-2.5 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 -translate-x-1/2">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/products?category=${cat.slug}`}
                        className="min-h-[142px] p-3.5 flex flex-col justify-between rounded-xl border border-[#E5E7EB]/60 bg-[#F8F9FA] hover:-translate-y-1 hover:border-[#ED7606]/40 hover:bg-white transition-all duration-300"
                      >
                        <div className="relative w-full h-[76px]">
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            fill
                            className="object-contain rounded-lg bg-white p-1.5"
                            sizes="140px"
                          />
                        </div>
                        <strong className="mt-3 text-xs leading-tight text-[#111827]">{cat.name}</strong>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="relative after:absolute after:left-0 after:right-0 after:-bottom-2 after:h-0.5 after:bg-[#ED7606] after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 hover:text-[#ED7606] transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            <span className="hidden lg:inline text-xs font-bold text-[#9CA3AF]">EN</span>
            <Link
              href="/torque-converter"
              className="hidden sm:inline-flex items-center h-[38px] px-4 text-xs font-bold rounded-full border border-[#E5E7EB] bg-white text-[#374151] hover:border-[#ED7606] hover:text-[#ED7606] transition-colors"
            >
              Torque Converter
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center h-9 lg:h-[38px] px-3.5 lg:px-4 text-xs font-bold rounded-full bg-[#ED7606] text-white hover:bg-[#D46900] shadow-[0_8px_20px_rgba(237,118,6,.2)] transition-all duration-300"
            >
              Send Inquiry
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
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 text-[#374151] text-lg font-semibold border-b border-[#E5E7EB]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/torque-converter"
              onClick={() => setMobileOpen(false)}
              className="mt-4 py-3 text-center text-sm font-bold rounded-full border border-[#E5E7EB] text-[#374151]"
            >
              Torque Converter
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
