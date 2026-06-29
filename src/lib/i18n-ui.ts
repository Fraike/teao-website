import type { Locale } from "@/lib/i18n";

export type SiteLocale = Locale | "en";

export const UI_COPY: Record<SiteLocale, {
  nav: Record<"products" | "applications" | "news" | "quality" | "about" | "contact", string>;
  actions: {
    language: string;
    torqueConverter: string;
    sendInquiry: string;
  };
  footer: {
    description: string;
    groups: Record<"products" | "company" | "resources" | "globalSites", string>;
    links: Record<string, string>;
  };
}> = {
  en: {
    nav: {
      products: "Products",
      applications: "Applications",
      news: "News",
      quality: "Quality",
      about: "About",
      contact: "Contact",
    },
    actions: {
      language: "Language",
      torqueConverter: "Torque Converter",
      sendInquiry: "Send Inquiry",
    },
    footer: {
      description: "Precision damper solutions for global automotive and industrial programs since 2001.",
      groups: {
        products: "Products",
        company: "Company",
        resources: "Resources",
        globalSites: "Global Sites",
      },
      links: {
        gearDampers: "Gear Dampers",
        axialDampers: "Axial Dampers",
        gloveBoxDampers: "Glove Box Dampers",
        latches: "Latches",
        otherProducts: "Other Products",
        aboutTeao: "About TEAO",
        quality: "Quality",
        applications: "Applications",
        news: "News",
        contact: "Contact",
        torqueConverter: "Torque Converter",
        faq: "FAQ",
        alibabaStore: "Alibaba Store",
        teaoGlobal: "TEAO Global",
      },
    },
  },
  ja: {
    nav: {
      products: "製品",
      applications: "用途",
      news: "ニュース",
      quality: "品質",
      about: "会社情報",
      contact: "お問い合わせ",
    },
    actions: {
      language: "言語",
      torqueConverter: "トルク換算",
      sendInquiry: "お問い合わせ",
    },
    footer: {
      description: "TEAOは2001年から、自動車・産業用途向けに精密ダンパーソリューションを提供しています。",
      groups: {
        products: "製品",
        company: "会社",
        resources: "リソース",
        globalSites: "グローバルサイト",
      },
      links: {
        gearDampers: "ギア / ロータリーダンパー",
        axialDampers: "アキシャル / バレルダンパー",
        gloveBoxDampers: "グローブボックスダンパー",
        latches: "ラッチ",
        otherProducts: "その他製品",
        aboutTeao: "TEAOについて",
        quality: "品質管理",
        applications: "用途",
        news: "ニュース",
        contact: "お問い合わせ",
        torqueConverter: "トルク換算",
        faq: "FAQ",
        alibabaStore: "Alibabaストア",
        teaoGlobal: "TEAO Global",
      },
    },
  },
  de: {
    nav: {
      products: "Produkte",
      applications: "Anwendungen",
      news: "News",
      quality: "Qualität",
      about: "Über uns",
      contact: "Kontakt",
    },
    actions: {
      language: "Sprache",
      torqueConverter: "Drehmomentrechner",
      sendInquiry: "Anfrage senden",
    },
    footer: {
      description: "Präzise Dämpferlösungen für globale Automotive- und Industrieprogramme seit 2001.",
      groups: {
        products: "Produkte",
        company: "Unternehmen",
        resources: "Ressourcen",
        globalSites: "Globale Seiten",
      },
      links: {
        gearDampers: "Zahnrad- / Rotationsdämpfer",
        axialDampers: "Axial- / Barrel-Dämpfer",
        gloveBoxDampers: "Handschuhfachdämpfer",
        latches: "Verriegelungen",
        otherProducts: "Weitere Produkte",
        aboutTeao: "Über TEAO",
        quality: "Qualität",
        applications: "Anwendungen",
        news: "News",
        contact: "Kontakt",
        torqueConverter: "Drehmomentrechner",
        faq: "FAQ",
        alibabaStore: "Alibaba Store",
        teaoGlobal: "TEAO Global",
      },
    },
  },
};

export function getUiCopy(locale: SiteLocale) {
  return UI_COPY[locale] || UI_COPY.en;
}
