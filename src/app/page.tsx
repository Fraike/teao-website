import { HeroSection } from "@/components/home/hero-section";
import { ProductGrid } from "@/components/home/product-grid";
import { CapabilitySection } from "@/components/home/capability-section";
import { ApplicationSection } from "@/components/home/application-section";
import { PartnerSection } from "@/components/home/partner-section";
import { ProcessSection } from "@/components/home/process-section";
import { NewsSection } from "@/components/home/news-section";
import { CTASection } from "@/components/home/cta-section";
import { SITE_CONFIG } from "@/lib/constants";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_CONFIG.fullName,
            alternateName: SITE_CONFIG.name,
            url: "https://www.teao-damper.com",
            foundingDate: String(SITE_CONFIG.founded),
            description:
              "Professional manufacturer of dampers, latches, synchronizers and motion control components with 20+ years of experience.",
            address: {
              "@type": "PostalAddress",
              streetAddress:
                "No. 2, Huangjiang North Third Street, Huangjiang Town",
              addressLocality: "Dongguan City",
              addressRegion: "Guangdong Province",
              postalCode: "523750",
              addressCountry: "CN",
            },
            contactPoint: {
              "@type": "ContactPoint",
              email: SITE_CONFIG.email,
              contactType: "sales",
            },
            numberOfEmployees: {
              "@type": "QuantitativeValue",
              minValue: 200,
            },
          }),
        }}
      />
      <HeroSection />
      <ProductGrid />
      <CapabilitySection />
      <ApplicationSection />
      <PartnerSection />
      <ProcessSection />
      <NewsSection />
      <CTASection />
    </>
  );
}
