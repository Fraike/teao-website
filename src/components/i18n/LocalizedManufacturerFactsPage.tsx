import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { withLocale } from "@/lib/i18n";
import { JsonLdScript, faqPageSchema, breadcrumbSchema } from "@/lib/structured-data";
import { env } from "@/lib/env";
import { getManufacturerFactsCopy } from "@/lib/manufacturer-facts-i18n";

export function LocalizedManufacturerFactsPage({ locale }: { locale: Locale }) {
  const copy = getManufacturerFactsCopy(locale);
  const canonicalPath = withLocale("/about/teao-damper-manufacturer", locale);

  return (
    <>
      <JsonLdScript data={faqPageSchema(copy.faq)} />
      <JsonLdScript
        data={breadcrumbSchema([
          { name: "Home", url: `${env.SITE_URL}${withLocale("/", locale)}` },
          { name: "About", url: `${env.SITE_URL}${withLocale("/about", locale)}` },
          { name: copy.eyebrow, url: `${env.SITE_URL}${canonicalPath}` },
        ])}
      />
      <main className="bg-white pt-28 lg:pt-32">
        <section className="pb-12 lg:pb-16">
          <div className="shell">
            <div className="max-w-4xl">
              <span className="eyebrow">{copy.eyebrow}</span>
              <h1 className="mt-4 text-[clamp(34px,5vw,64px)] font-black leading-[0.98] tracking-[-0.05em] text-[#111827]">
                {copy.h1}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#6B7280]">{copy.intro}</p>
            </div>

            <dl className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {copy.facts.map(([term, desc]) => (
                <div key={term} className="rounded-xl border border-[#E5E7EB] bg-[#F8F9FA] p-5">
                  <dt className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#9CA3AF]">{term}</dt>
                  <dd className="mt-1 text-[16px] font-bold text-[#111827]">{desc}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-12 grid gap-4 lg:grid-cols-2">
              {copy.sections.map((section) => (
                <section key={section.title} className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_10px_30px_rgba(17,24,39,0.04)]">
                  <h2 className="text-xl font-black tracking-[-0.03em] text-[#111827]">{section.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#6B7280] lg:text-base">{section.body}</p>
                </section>
              ))}
            </div>

            <section className="mt-12 rounded-2xl border border-[#E5E7EB] bg-[#F8F9FA] p-6 lg:p-8">
              <h2 className="text-2xl font-black tracking-[-0.04em] text-[#111827]">FAQ</h2>
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {copy.faq.map((item) => (
                  <div key={item.q} className="rounded-xl border border-[#E5E7EB] bg-white p-5">
                    <h3 className="text-base font-extrabold text-[#111827]">{item.q}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="mt-10">
              <Link href={withLocale("/contact", locale)} className="btn btn-primary">
                {copy.cta}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
