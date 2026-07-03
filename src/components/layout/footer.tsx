"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SITE_CONFIG } from "@/lib/constants";
import { stripLocale, withLocale } from "@/lib/i18n";
import { getUiCopy } from "@/lib/i18n-ui";
import { getCategoryUrl } from "@/lib/products";

const FOOTER_LINKS = [
  {
    group: "products",
    links: [
      { key: "gearDampers", href: getCategoryUrl("gear-damper") },
      { key: "axialDampers", href: getCategoryUrl("axial-damper") },
      { key: "gloveBoxDampers", href: getCategoryUrl("glove-box-damper") },
      { key: "latches", href: getCategoryUrl("latch") },
      { key: "otherProducts", href: getCategoryUrl("other") },
    ],
  },
  {
    group: "company",
    links: [
      { key: "aboutTeao", href: "/about" },
      { key: "quality", href: "/quality" },
      { key: "applications", href: "/applications" },
      { key: "news", href: "/news" },
      { key: "contact", href: "/contact" },
    ],
  },
  {
    group: "resources",
    links: [
      { key: "torqueConverter", href: "/torque-converter" },
      { key: "faq", href: "/faq" },
    ],
  },
  {
    group: "globalSites",
    links: [
      { key: "alibabaStore", href: "https://teaodamper.en.alibaba.com/index.html?spm=a2700.shop_cp.88.12.295d66e8YJF94s" },
      { key: "teaoGlobal", href: "https://www.teaoglobal.com/" },
    ],
  },
] as const;

export default function Footer() {
  const pathname = usePathname();
  const { locale } = stripLocale(pathname || "/");
  const copy = getUiCopy(locale);

  return (
    <footer className="bg-[#F0F2F5] text-[#6B7280] text-[13px] border-t border-[#E5E7EB]/60">
      <div className="shell py-7 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8 pb-6 md:pb-10 border-b border-[#E5E7EB]/60">
          {/* Brand */}
          <div>
            <div className="relative w-[82px] h-7 md:w-[98px] md:h-8 mb-3 md:mb-4">
              <Image
                src="/images/logo-color.webp"
                alt="TEAO"
                fill
                loading="lazy"
                className="object-contain"
                sizes="(max-width: 768px) 82px, 98px"
              />
            </div>
            <p className="text-[#6B7280] leading-relaxed max-w-[240px] text-sm md:text-[13px]">
              {copy.footer.description}
            </p>
            <a
              href="https://wa.me/8618813935128"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 text-sm font-bold text-[#111827] hover:text-[#25D366] transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 shrink-0 text-[#25D366]">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              +86 188 1393 5128
            </a>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 md:hidden">
              <Link href={withLocale("/products", locale)} className="hover:text-[#ED7606]">{copy.nav.products}</Link>
              <Link href={withLocale("/quality", locale)} className="hover:text-[#ED7606]">{copy.nav.quality}</Link>
              <Link href={withLocale("/applications", locale)} className="hover:text-[#ED7606]">{copy.nav.applications}</Link>
              <Link href={withLocale("/news", locale)} className="hover:text-[#ED7606]">{copy.nav.news}</Link>
              <Link href={withLocale("/contact", locale)} className="hover:text-[#ED7606]">{copy.nav.contact}</Link>
              <a href="https://www.teaoglobal.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#ED7606]">{copy.footer.links.teaoGlobal}</a>
            </div>
          </div>

          {/* Links */}
          {FOOTER_LINKS.map(({ group, links }) => (
            <div key={group} className="hidden md:block">
              <h4 className="text-[#111827] font-bold text-sm mb-4 tracking-wide">{copy.footer.groups[group]}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => {
                  const isExternal = link.href.startsWith("http");
                  return (
                    <li key={link.key}>
                      {isExternal ? (
                        <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-[#ED7606] transition-colors">
                          {copy.footer.links[link.key]}
                        </a>
                      ) : (
                        <Link href={withLocale(link.href, locale)} className="hover:text-[#ED7606] transition-colors">
                          {copy.footer.links[link.key]}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-2 md:gap-4 pt-5 md:pt-8 text-xs md:text-[13px]">
          <span>&copy; {new Date().getFullYear()} {SITE_CONFIG.fullName}</span>
          <span className="hidden md:inline">{SITE_CONFIG.address}</span>
        </div>
      </div>
    </footer>
  );
}
