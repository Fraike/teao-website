import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import { Reveal } from "@/components/ui/reveal";
import type { SiteLocale } from "@/lib/i18n-ui";
import { withLocale } from "@/lib/i18n";
import { getHomeCopy } from "@/lib/home-i18n";

export function CTASection({ locale = "en" }: { locale?: SiteLocale }) {
  const copy = getHomeCopy(locale).cta;

  return (
    <section
      className="relative py-24 text-white overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #111827 0%, #161b24 40%, #1F2937 100%)",
      }}
      id="contact"
    >
      {/* Warm glow orb */}
      <div className="absolute -top-[20%] -right-[10%] w-[55%] h-[140%] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 50% 45% at 50% 40%, rgba(237,118,6,0.10) 0%, transparent 65%)",
        }}
      />
      {/* Decorative rings */}
      <div className="absolute w-[500px] h-[500px] -right-[120px] -top-[120px] rounded-full border border-[#ED7606]/10 pointer-events-none" />
      <div className="absolute w-[320px] h-[320px] -right-[40px] -top-[40px] rounded-full border border-[#ED7606]/8 pointer-events-none" />

      <div className="shell relative z-10">
        <div className="grid lg:grid-cols-[minmax(0,0.8fr)_minmax(320px,0.42fr)] gap-12 items-end">
          <Reveal>
            <span className="eyebrow">{copy.eyebrow}</span>
            <h2 className="mt-3.5 max-w-[790px] text-[clamp(36px,4.5vw,66px)] leading-[0.93] tracking-[-0.05em] font-black">
              {copy.titleA}
              <span className="block bg-gradient-to-r from-white to-[#FF9A3C] bg-clip-text text-transparent">
                {copy.titleB}
              </span>
            </h2>
            <p className="mt-5 text-white/60 text-lg max-w-[600px] leading-relaxed">
              {copy.description}
            </p>
          </Reveal>

          <aside className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <h3 className="text-white text-xl font-extrabold leading-tight">
              {copy.contactTitle}
            </h3>
            <p className="mt-2 mb-3 text-white/55 text-sm leading-5">
              {copy.contactBody}
            </p>
            <Link href={`mailto:${SITE_CONFIG.email}`} className="flex items-center gap-2 py-3 border-b border-white/8 text-white/70 text-sm hover:text-white transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              {SITE_CONFIG.email}
            </Link>
            <Link href={withLocale("/contact", locale)} className="flex items-center gap-2 py-3 text-[#FF9A3C] font-extrabold hover:text-white transition-colors">
              {copy.request}
              <span className="text-lg">→</span>
            </Link>
            <div className="flex flex-wrap gap-2.5 mt-4">
              {[
                { label: "Facebook", href: SITE_CONFIG.social.facebook },
                { label: "Instagram", href: SITE_CONFIG.social.instagram },
                { label: "YouTube", href: SITE_CONFIG.social.youtube },
                { label: "X", href: SITE_CONFIG.social.x },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="w-[calc(50%-5px)] py-2.5 px-3 flex justify-center rounded-full border border-white/10 text-white/70 text-[13px] font-extrabold hover:bg-white/8 hover:text-white hover:border-white/20 transition-all">
                  {s.label}
                </a>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
