import type { Metadata } from "next";
import { Suspense } from "react";
import { HeroSection } from "@/components/home/hero-section";
import { ProductGrid } from "@/components/home/product-grid";
import { CapabilitySection } from "@/components/home/capability-section";
import { ApplicationSection } from "@/components/home/application-section";
import { PartnerSection } from "@/components/home/partner-section";
import { ProcessSection } from "@/components/home/process-section";
import { NewsSection } from "@/components/home/news-section";
import { GeoFaqSection } from "@/components/home/geo-faq-section";
import { CTASection } from "@/components/home/cta-section";
import { JsonLdScript, faqPageSchema, websiteSchema } from "@/lib/structured-data";
import { LOCALE_OG, withLocale, getAlternateUrls } from "@/lib/i18n";
import { getHomeCopy } from "@/lib/home-i18n";

const locale = "ja" as const;

function ProductGridSkeleton() {
  return (
    <section className="section" id="products">
      <div className="shell">
        <div className="animate-pulse">
          <div className="h-4 w-32 rounded bg-[#E5E7EB] mb-3" />
          <div className="h-10 w-96 rounded bg-[#E5E7EB] mb-2" />
          <div className="h-5 w-[480px] rounded bg-[#E5E7EB] mb-8" />
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-3.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">
                <div className="aspect-[4/3] img-shimmer" />
                <div className="p-3.5 space-y-2">
                  <div className="h-3 w-5 rounded bg-[#E5E7EB]" />
                  <div className="h-5 w-20 rounded bg-[#E5E7EB]" />
                  <div className="h-3 w-full rounded bg-[#E5E7EB]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function generateMetadata(): Metadata {
  const title = "自動車用ダンパー・ラッチメーカー";
  const description = "TEAOはギアダンパー、ロータリーダンパー、アキシャルダンパー、バレルダンパー、グローブボックスダンパー、ラッチを供給するB2Bメーカーです。";
  return {
    title,
    description,
    alternates: { canonical: withLocale("/", locale), languages: getAlternateUrls("/") },
    openGraph: {
      title: `${title} | TEAO`,
      description,
      locale: LOCALE_OG[locale],
      images: [{ url: "/images/news/automotive-interior-damper-map.webp", width: 1672, height: 941 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | TEAO`,
      description,
      images: ["/images/news/automotive-interior-damper-map.webp"],
    },
  };
}

export default function LocalizedHomePage() {
  const geoFaq = getHomeCopy(locale).geoFaq;

  return (
    <>
      <JsonLdScript data={websiteSchema()} />
      <JsonLdScript data={faqPageSchema(geoFaq.questions)} />
      <HeroSection locale={locale} />
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid locale={locale} />
      </Suspense>
      <CapabilitySection locale={locale} />
      <ApplicationSection locale={locale} />
      <PartnerSection locale={locale} />
      <ProcessSection locale={locale} />
      <NewsSection locale={locale} />
      <GeoFaqSection locale={locale} />
      <CTASection locale={locale} />
    </>
  );
}
