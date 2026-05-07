"use client";

import { useState, useEffect, useCallback } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";

const NAV_ITEMS = [
  { label: "Products", href: "/products", mega: true },
  { label: "Applications", href: "/applications" },
  { label: "Quality", href: "/quality" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "News", href: "/news" },
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
      <header
        className={`fixed inset-x-[14px] lg:inset-x-[18px] top-3 lg:top-4 z-30 transition-all duration-300 ${
          scrolled ? "top-2" : ""
        }`}
      >
        <nav
          className={`h-14 lg:h-16 max-w-[1240px] mx-auto px-2.5 pl-3.5 lg:pl-4 flex items-center justify-between rounded-full text-white transition-all duration-300 border ${
            scrolled
              ? "bg-[#171717]/75 border-white/15 backdrop-blur-xl"
              : "bg-[#171717]/55 border-white/15 backdrop-blur-lg"
          }`}
        >
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 font-black tracking-tight">
            <div className="relative w-[92px] h-8 lg:w-[118px] lg:h-9">
              <Image
                src="/images/logo-white-cropped.png"
                alt="TEAO"
                fill
                priority
                className="object-contain drop-shadow-[0_3px_10px_rgba(0,0,0,.28)]"
                sizes="(max-width: 1024px) 92px, 118px"
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6 text-[13px] font-bold opacity-85">
            {NAV_ITEMS.map((item) =>
              item.mega ? (
                <div key={item.label} className="relative group flex items-center min-h-16">
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 relative after:absolute after:left-0 after:right-0 after:-bottom-2 after:h-0.5 after:bg-[#ED7606] after:scale-x-0 after:transition-transform after:duration-300 group-hover:after:scale-x-100"
                  >
                    {item.label}
                    <ChevronDown size={14} />
                  </Link>
                  {/* Mega Menu */}
                  <div className="absolute top-[58px] left-1/2 w-[760px] p-3 grid grid-cols-5 gap-2 rounded-2xl border border-white/15 bg-[#171717]/92 backdrop-blur-xl shadow-[0_28px_80px_rgba(0,0,0,.26)] opacity-0 invisible translate-y-2.5 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 -translate-x-1/2">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/products?category=${cat.slug}`}
                        className="min-h-[142px] p-3.5 flex flex-col justify-between rounded-xl border border-white/10 bg-white/5 hover:-translate-y-1 hover:border-[#ED7606]/50 hover:bg-[#ED7606]/10 transition-all duration-300"
                      >
                        <div className="relative w-full h-[76px]">
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            fill
                            className="object-contain rounded-lg bg-white/8 p-1.5"
                            sizes="140px"
                          />
                        </div>
                        <strong className="mt-3 text-xs leading-tight">{cat.name}</strong>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="relative after:absolute after:left-0 after:right-0 after:-bottom-2 after:h-0.5 after:bg-[#ED7606] after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            <span className="hidden lg:inline text-xs font-extrabold opacity-70">EN / 中文</span>
            <Link
              href="/torque-converter"
              className="hidden sm:inline-flex items-center h-[38px] px-4 text-xs font-bold rounded-full border border-white/20 bg-white/8 text-white hover:bg-white/15 transition-colors"
            >
              Torque Converter
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center h-9 lg:h-[38px] px-3.5 lg:px-4 text-xs font-bold rounded-full bg-[#ED7606] text-white hover:bg-[#D46900] shadow-[0_18px_36px_rgba(237,118,6,.25)] transition-all duration-300"
            >
              Send Inquiry
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden ml-1 p-1.5"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-20 bg-[#171717]/95 backdrop-blur-xl pt-24">
          <div className="flex flex-col gap-2 px-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 text-white/80 text-lg font-semibold border-b border-white/10"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/torque-converter"
              onClick={() => setMobileOpen(false)}
              className="mt-4 py-3 text-center text-sm font-bold rounded-full border border-white/20 text-white/80"
            >
              Torque Converter
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
