import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { CompanyTimeline } from "@/components/about/CompanyTimeline";
import { BusinessHighlights } from "@/components/about/BusinessHighlights";
import { CoreCompetencies } from "@/components/about/CoreCompetencies";
import { CertificationsSection } from "@/components/about/CertificationsSection";
import { CorporateValues } from "@/components/about/CorporateValues";
import { PeopleCultureSection } from "@/components/about/PeopleCultureSection";
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
    images: [{ url: "/images/logo-color.webp", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About TEAO | 20+ Years Damper Manufacturer",
    description:
      "Professional damper manufacturer with IATF 16949 certification, 100M annual capacity and custom torque engineering.",
    images: ["/images/logo-color.webp"],
  },
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <CompanyTimeline />
      <BusinessHighlights />
      <CoreCompetencies />
      <CertificationsSection />
      <CorporateValues />
      <PeopleCultureSection />
      <AboutCTA />
    </>
  );
}
