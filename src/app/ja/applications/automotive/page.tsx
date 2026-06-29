import type { Metadata } from "next";
import { JsonLdScript, collectionPageSchema, faqPageSchema } from "@/lib/structured-data";
import { AutomotiveClient } from "@/app/applications/automotive/automotive-client";
import { AUTOMOTIVE_SEO_KEYWORDS } from "@/lib/seo-keywords";
import { withLocale, getAlternateUrls, LOCALE_OG } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = "ja" as "ja" | "de";
  const title = locale === "ja"
    ? "自動車内装ダンパーとEV充電口カバーダンパー"
    : "Dämpfer für Fahrzeuginnenraum und EV-Ladeanschlussklappen";
  const description = locale === "ja"
    ? "グローブボックス、センターコンソール、グラブハンドル、オーバーヘッドコンソール、ドアハンドル、EV充電口カバー向けTEAOダンパー用途。"
    : "TEAO Dämpferanwendungen für Handschuhfach, Mittelkonsole, Haltegriff, Dachkonsole, Türgriff und EV-Ladeanschlussklappe.";
  return {
    title,
    description,
    keywords: AUTOMOTIVE_SEO_KEYWORDS,
    alternates: {
      canonical: withLocale("/applications/automotive", locale),
      languages: getAlternateUrls("/applications/automotive"),
    },
    openGraph: {
      title,
      description,
      locale: LOCALE_OG[locale],
      images: [{ url: "/images/applications/automotive.webp", width: 800, height: 500 }],
    },
  };
}

export default async function LocalizedAutomotiveApplicationsPage() {
  const locale = "ja" as "ja" | "de";

  const jsonLd = collectionPageSchema(
    locale === "ja" ? "自動車内装ダンパー用途" : "Dämpferanwendungen im Fahrzeuginnenraum",
    locale === "ja"
      ? "TEAOダンパーはグローブボックス、センターコンソール、グラブハンドル、オーバーヘッドコンソール、ドアハンドル、充電口カバーに使用されます。"
      : "TEAO Dämpfer für Handschuhfach, Mittelkonsole, Haltegriff, Dachkonsole, Türgriff und Ladeanschlussklappen.",
    [{ name: "Automotive Applications", url: withLocale("/applications/automotive", locale) }],
    {
      url: withLocale("/applications/automotive", locale),
      keywords: AUTOMOTIVE_SEO_KEYWORDS,
      about: AUTOMOTIVE_SEO_KEYWORDS,
    },
  );

  const faq = [
    {
      q: locale === "ja" ? "なぜEV内装にダンパーが必要ですか？" : "Warum werden Dämpfer in EV-Innenräumen benötigt?",
      a: locale === "ja"
        ? "EVはエンジン音が少ないため、グローブボックスやコンソールリッドなどの機械音が目立ちやすくなります。ダンパーは衝撃音を抑え、動きを滑らかにします。"
        : "In Elektrofahrzeugen ist der Antriebsstrang leiser. Dadurch fallen mechanische Geräusche von Handschuhfach, Konsolendeckel oder Griffen stärker auf. Dämpfer reduzieren Anschlaggeräusche und verbessern die Haptik.",
    },
  ];

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <JsonLdScript data={faqPageSchema(faq)} />
      <AutomotiveClient />
    </>
  );
}
