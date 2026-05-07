import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { CompanyTimeline } from "@/components/about/CompanyTimeline";
import { BusinessHighlights } from "@/components/about/BusinessHighlights";
import { CoreCompetencies } from "@/components/about/CoreCompetencies";
import { CertificationsSection } from "@/components/about/CertificationsSection";
import { CorporateValues } from "@/components/about/CorporateValues";
import { AboutCTA } from "@/components/about/AboutCTA";

export const metadata: Metadata = {
  title: "About TEAO | 20+ Years Damper & Motion Control Manufacturer",
  description:
    "Learn about TEAO, a professional damper and motion control component manufacturer with 20+ years of experience, IATF 16949 certification, automated production lines and custom torque engineering capability.",
  keywords: [
    "damper manufacturer",
    "gear damper manufacturer",
    "rotary damper supplier",
    "custom torque damper",
    "automotive damper manufacturer",
    "motion control solutions",
    "IATF 16949 damper supplier",
  ],
  openGraph: {
    title: "About TEAO | 20+ Years Damper & Motion Control Manufacturer",
    description:
      "Professional damper manufacturer with IATF 16949 certification, 100M annual capacity, custom torque engineering and 20+ years of experience.",
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Dongguan TEAO Electronic Technology Co., Ltd.",
            alternateName: "TEAO",
            url: "https://www.teao-damper.com",
            foundingDate: "2001",
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
              email: "info@teao-damper.com",
              contactType: "sales",
            },
            numberOfEmployees: {
              "@type": "QuantitativeValue",
              minValue: 200,
            },
          }),
        }}
      />
      <AboutHero />
      <CompanyTimeline />
      <BusinessHighlights />
      <CoreCompetencies />
      <CertificationsSection />
      <CorporateValues />
      <AboutCTA />
    </>
  );
}
