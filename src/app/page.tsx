import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";
import { ProductGrid } from "@/components/home/product-grid";
import { CapabilitySection } from "@/components/home/capability-section";
import { ApplicationSection } from "@/components/home/application-section";
import { PartnerSection } from "@/components/home/partner-section";
import { ProcessSection } from "@/components/home/process-section";
import { NewsSection } from "@/components/home/news-section";
import { CTASection } from "@/components/home/cta-section";

export const metadata: Metadata = {
  title: "Automotive Damper & Latch Manufacturer | TEAO",
  description:
    "IATF 16949 certified manufacturer of gear dampers, axial dampers, glove box dampers, latches and custom motion control components. 20+ years of damper expertise, 100% torque testing, global B2B supply.",
  keywords: [
    "automotive damper manufacturer",
    "gear damper supplier",
    "rotary damper manufacturer",
    "glove box damper",
    "axial damper",
    "custom damper manufacturer",
    "latch mechanism supplier",
    "China damper manufacturer",
  ],
  openGraph: {
    title: "Automotive Damper & Latch Manufacturer | TEAO",
    description:
      "IATF 16949 certified damper manufacturer. Gear dampers, axial dampers, latches and custom motion control for global automotive B2B programs.",
    images: [{ url: "/images/logo-color.png", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Automotive Damper & Latch Manufacturer | TEAO",
    description:
      "IATF 16949 certified damper manufacturer. 20+ years of expertise in gear dampers, axial dampers, latches and motion control.",
    images: ["/images/logo-color.png"],
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "TEAO",
            url: "https://www.teao-damper.com",
            description:
              "IATF 16949 certified manufacturer of gear dampers, axial dampers, glove box dampers, latches and custom motion control components.",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: "https://www.teao-damper.com/products?search={search_term_string}",
              },
              "query-input": "required name=search_term_string",
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
