import type { Metadata } from "next";
import DamperTorqueCalculator from "@/components/tools/DamperTorqueCalculator";
import { PRODUCTS } from "@/lib/constants";
import { getProductUrl } from "@/lib/products";
import { JsonLdScript } from "@/lib/structured-data";
import { getAlternateUrls, LOCALE_OG, withLocale } from "@/lib/i18n";
import { getTorqueCalculatorCopy } from "@/lib/torque-calculator-i18n";

const locale = "ja" as const;
const copy = getTorqueCalculatorCopy(locale);

export const metadata: Metadata = {
  title: copy.metadataTitle,
  description: copy.metadataDescription,
  alternates: { canonical: withLocale("/damper-torque-calculator", locale), languages: getAlternateUrls("/damper-torque-calculator") },
  openGraph: { title: copy.metadataTitle, description: copy.metadataDescription, locale: LOCALE_OG[locale] },
};

const calculatorSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: copy.h1,
  applicationCategory: "EngineeringApplication",
  operatingSystem: "Web",
  description: copy.metadataDescription,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  url: withLocale("/damper-torque-calculator", locale),
};

export default function Page() {
  const selectableProducts = PRODUCTS.filter(
    (product) =>
      product.isActive &&
      product.torque &&
      (product.category === "gear-damper" || product.category === "glove-box-damper"),
  ).map((product) => ({
    model: product.model,
    name: product.name,
    summary: product.summary,
    url: withLocale(getProductUrl(product), locale),
    torque: product.torque!,
  }));

  return (
    <>
      <JsonLdScript data={calculatorSchema} />
      <main className="bg-[#F8F9FA] pt-24 lg:pt-28">
        <section className="pb-8 lg:pb-10">
          <div className="shell">
            <div className="mb-6 max-w-3xl">
              <span className="eyebrow">{copy.eyebrow}</span>
              <h1 className="mt-3 text-[clamp(32px,5vw,58px)] font-black leading-[0.96] tracking-[-0.05em] text-[#111827]">
                {copy.h1}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#6B7280] lg:text-lg">
                {copy.intro}
              </p>
            </div>
            <DamperTorqueCalculator products={selectableProducts} locale={locale} />
          </div>
        </section>
      </main>
    </>
  );
}
