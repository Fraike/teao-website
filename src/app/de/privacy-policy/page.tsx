import type { Metadata } from "next";
import { LocalizedPrivacyPolicyPage } from "@/components/i18n/LocalizedPrivacyPolicyPage";
import { getAlternateUrls, LOCALE_OG, withLocale } from "@/lib/i18n";
import { getPrivacyPolicyCopy } from "@/lib/privacy-policy-i18n";

const locale = "de" as const;

export const metadata: Metadata = {
  title: getPrivacyPolicyCopy(locale).title,
  description: getPrivacyPolicyCopy(locale).description,
  alternates: { canonical: withLocale("/privacy-policy", locale), languages: getAlternateUrls("/privacy-policy") },
  openGraph: {
    title: getPrivacyPolicyCopy(locale).title,
    description: getPrivacyPolicyCopy(locale).description,
    locale: LOCALE_OG[locale],
  },
};

export default function Page() {
  return <LocalizedPrivacyPolicyPage locale={locale} />;
}
