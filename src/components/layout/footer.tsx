import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/constants";

const FOOTER_LINKS = {
  Products: [
    { label: "Gear Dampers", href: "/products?category=gear-damper" },
    { label: "Cylinder Dampers", href: "/products?category=cylinder-damper" },
    { label: "Glove Box Dampers", href: "/products?category=glove-box-damper" },
    { label: "Latches", href: "/products?category=latch" },
    { label: "Other Products", href: "/products?category=other" },
  ],
  Company: [
    { label: "About TEAO", href: "/about" },
    { label: "Quality", href: "/quality" },
    { label: "Applications", href: "/applications" },
    { label: "News", href: "/news" },
    { label: "Contact", href: "/contact" },
  ],
  Resources: [
    { label: "Torque Converter", href: "/torque-converter" },
    { label: "FAQ", href: "/faq" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#2D2D2D] text-white/50 text-[13px]">
      <div className="shell py-7 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10 pb-6 md:pb-10 border-b border-white/8">
          {/* Brand */}
          <div>
            <div className="relative w-[92px] h-8 md:w-[110px] md:h-9 mb-3 md:mb-4">
              <Image
                src="/images/logo-color.png"
                alt="TEAO"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 92px, 110px"
              />
            </div>
            <p className="text-white/60 leading-relaxed max-w-[240px] text-sm md:text-[13px]">
              Precision damper solutions for global automotive and industrial programs since 2001.
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-white/70 md:hidden">
              <Link href="/products" className="hover:text-[#ED7606]">Products</Link>
              <Link href="/quality" className="hover:text-[#ED7606]">Quality</Link>
              <Link href="/applications" className="hover:text-[#ED7606]">Applications</Link>
              <Link href="/contact" className="hover:text-[#ED7606]">Contact</Link>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group} className="hidden md:block">
              <h4 className="text-white/90 font-bold text-sm mb-4 tracking-wide">{group}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-[#ED7606] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-2 md:gap-4 pt-5 md:pt-8 text-xs md:text-[13px]">
          <span>&copy; {new Date().getFullYear()} {SITE_CONFIG.fullName}</span>
          <span className="hidden md:inline">
            {SITE_CONFIG.address}
          </span>
        </div>
      </div>
    </footer>
  );
}
