import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { CompanyTimeline } from "@/components/about/CompanyTimeline";
import { BusinessHighlights } from "@/components/about/BusinessHighlights";
import { CoreCompetencies } from "@/components/about/CoreCompetencies";
import { CertificationsSection } from "@/components/about/CertificationsSection";
import { CorporateValues } from "@/components/about/CorporateValues";
import { PeopleCultureSection } from "@/components/about/PeopleCultureSection";
import { AboutCTA } from "@/components/about/AboutCTA";
import { getAlternateUrls, LOCALE_OG, withLocale } from "@/lib/i18n";
import { getAboutCopy } from "@/lib/about-i18n";

const locale = "ja" as const;

export function generateMetadata(): Metadata {
  const copy = getAboutCopy(locale).metadata;
  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical: withLocale("/about", locale), languages: getAlternateUrls("/about") },
    openGraph: { title: copy.title, description: copy.description, locale: LOCALE_OG[locale] },
  };
}

export default function Page() {
  return (
    <>
      <AboutHero locale={locale} />
      <CompanyTimeline locale={locale} />
      <BusinessHighlights locale={locale} />
      <CoreCompetencies locale={locale} />
      <CertificationsSection locale={locale} />
      <CorporateValues locale={locale} />
      <PeopleCultureSection locale={locale} />
      <AboutCTA locale={locale} />
    </>
  );
}
