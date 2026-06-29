import type { Metadata } from "next";
import { LocalizedStaticPage } from "@/components/i18n/LocalizedStaticPage";
import { getAlternateUrls, LOCALE_OG, withLocale } from "@/lib/i18n";
import { getLocalizedStaticCopy } from "@/lib/i18n-static";

const locale = "de" as const;
const pageKey = "faq" as const;

export function generateMetadata(): Metadata {
  const copy = getLocalizedStaticCopy(locale, pageKey);
  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical: withLocale("/faq", locale), languages: getAlternateUrls("/faq") },
    openGraph: { title: copy.title, description: copy.description, locale: LOCALE_OG[locale] },
  };
}

export default function Page() {
  return <LocalizedStaticPage locale={locale} pageKey={pageKey} />;
}
