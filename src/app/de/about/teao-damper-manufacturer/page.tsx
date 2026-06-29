import type { Metadata } from "next";
import { LocalizedManufacturerFactsPage } from "@/components/i18n/LocalizedManufacturerFactsPage";
import { getAlternateUrls, LOCALE_OG, withLocale } from "@/lib/i18n";
import { getManufacturerFactsCopy } from "@/lib/manufacturer-facts-i18n";

const locale = "de" as const;
const copy = getManufacturerFactsCopy(locale);

export const metadata: Metadata = {
  title: copy.title,
  description: copy.description,
  alternates: { canonical: withLocale("/about/teao-damper-manufacturer", locale), languages: getAlternateUrls("/about/teao-damper-manufacturer") },
  openGraph: { title: copy.title, description: copy.description, locale: LOCALE_OG[locale] },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <LocalizedManufacturerFactsPage locale={locale} />;
}
