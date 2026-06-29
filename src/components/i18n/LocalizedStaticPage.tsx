import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { withLocale } from "@/lib/i18n";
import { getLocalizedStaticCopy, type LocalizedStaticKey } from "@/lib/i18n-static";

export function LocalizedStaticPage({ locale, pageKey }: { locale: Locale; pageKey: LocalizedStaticKey }) {
  const copy = getLocalizedStaticCopy(locale, pageKey);
  const primaryHref = pageKey === "applications" ? "/applications/automotive" : pageKey === "quality" ? "/contact" : "/products";

  return (
    <section className="section pt-28 lg:pt-32">
      <div className="shell">
        <div className="max-w-4xl">
          <span className="eyebrow">{copy.eyebrow}</span>
          <h1 className="mt-4 text-[clamp(34px,5vw,64px)] font-black leading-[0.98] tracking-[-0.05em] text-[#111827]">
            {copy.h1}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#6B7280]">{copy.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={withLocale(primaryHref, locale)} className="btn btn-primary">
              {copy.primaryCta}
            </Link>
            <Link href={withLocale(pageKey === "about" ? "/contact" : "/products", locale)} className="btn btn-outline">
              {copy.secondaryCta}
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {copy.sections.map((section) => (
            <div key={section.title} className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_10px_30px_rgba(17,24,39,0.04)]">
              <h2 className="text-lg font-extrabold tracking-[-0.02em] text-[#111827]">{section.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#6B7280]">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
