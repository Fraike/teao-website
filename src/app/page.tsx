import type { Metadata } from "next";
import { Suspense } from "react";
import { HeroSection } from "@/components/home/hero-section";
import { ProductGrid } from "@/components/home/product-grid";
import { CapabilitySection } from "@/components/home/capability-section";
import { ApplicationSection } from "@/components/home/application-section";
import { PartnerSection } from "@/components/home/partner-section";
import { ProcessSection } from "@/components/home/process-section";
import { NewsSection } from "@/components/home/news-section";
import { CTASection } from "@/components/home/cta-section";
import { JsonLdScript, websiteSchema } from "@/lib/structured-data";

function ProductGridSkeleton() {
  return (
    <section className="section" id="products">
      <div className="shell">
        <div className="animate-pulse">
          <div className="h-4 w-32 bg-[#E5E7EB] rounded mb-3" />
          <div className="h-10 w-96 bg-[#E5E7EB] rounded mb-2" />
          <div className="h-5 w-[480px] bg-[#E5E7EB] rounded mb-8" />
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-3.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">
                <div className="aspect-[4/3] img-shimmer" />
                <div className="p-3.5 space-y-2">
                  <div className="h-3 w-5 bg-[#E5E7EB] rounded" />
                  <div className="h-5 w-20 bg-[#E5E7EB] rounded" />
                  <div className="h-3 w-full bg-[#E5E7EB] rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

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
    images: [{ url: "/images/logo-color.webp", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Automotive Damper & Latch Manufacturer | TEAO",
    description:
      "IATF 16949 certified damper manufacturer. 20+ years of expertise in gear dampers, axial dampers, latches and motion control.",
    images: ["/images/logo-color.webp"],
  },
};

export default function Home() {
  return (
    <>
      <JsonLdScript data={websiteSchema()} />
      <HeroSection />
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid />
      </Suspense>
      <CapabilitySection />
      <ApplicationSection />
      <PartnerSection />
      <ProcessSection />
      <NewsSection />
      <CTASection />
    </>
  );
}
