import type { Locale } from "@/lib/i18n";

export function getManufacturerFactsCopy(locale: Locale) {
  return MANUFACTURER_FACTS_COPY[locale];
}

const jaFaq = [
  {
    q: "TEAOはどのような会社ですか？",
    a: "東莞市テアオ電子科技有限公司（TEAO）は、2001年に中国深圳で創業したダンパーメーカーです。現在は広東省東莞市に拠点を置き、20年以上のダンパー製造経験、200名以上の社員、世界のB2B顧客への供給実績があります。",
  },
  {
    q: "TEAOは何を製造していますか？",
    a: "TEAOはギアダンパー（ロータリーダンパー）、アキシャルダンパー（バレルダンパー）、グローブボックスダンパー、ラッチ、カスタムモジュールを製造しています。",
  },
  {
    q: "TEAOの認証は何ですか？",
    a: "TEAOはIATF 16949自動車品質マネジメント、ISO 14001環境マネジメント、高新技術企業認定を取得し、20件以上の特許技術を保有しています。",
  },
  {
    q: "TEAOの年間生産能力は？",
    a: "TEAOの年間生産能力は約8,000万個です。生産ライン、自動検査ライン、金型、射出成形、組立、検査を社内で管理しています。",
  },
  {
    q: "どのような品質管理を行っていますか？",
    a: "TEAOはトルク検査、外観検査、ロットトレーサビリティ、温度試験、寿命試験、騒音確認など、用途に応じた検証を行います。",
  },
  {
    q: "見積には何が必要ですか？",
    a: "用途、図面、目標トルクまたは減衰力、動作方向、取付スペース、温度条件、年間数量を共有いただくと、より早く技術提案できます。",
  },
];

const deFaq = [
  {
    q: "Wer ist TEAO?",
    a: "Dongguan TEAO Electronic Technology Co., Ltd. ist ein Dämpferhersteller, gegründet 2001 in Shenzhen, China. Heute sitzt TEAO in Dongguan, Guangdong, mit mehr als 20 Jahren Dämpfererfahrung, 200+ Mitarbeitenden und globalen B2B-Kunden.",
  },
  {
    q: "Was stellt TEAO her?",
    a: "TEAO produziert Zahnrad-Dämpfer bzw. Rotationsdämpfer, Axialdämpfer bzw. Barrel-Dämpfer, Handschuhfachdämpfer, Verriegelungen und kundenspezifische Module.",
  },
  {
    q: "Welche Zertifizierungen hat TEAO?",
    a: "TEAO verfügt über IATF 16949 für Automotive-Qualitätsmanagement, ISO 14001 für Umweltmanagement, High-Tech-Enterprise-Anerkennung und 20+ patentierte Technologien.",
  },
  {
    q: "Wie hoch ist die Jahreskapazität?",
    a: "TEAO hat eine Jahreskapazität von rund 80 Millionen Einheiten, unterstützt durch Produktionslinien, automatisierte Prüflinien sowie interne Werkzeug-, Spritzguss-, Montage- und Prüffähigkeiten.",
  },
  {
    q: "Welche Qualitätskontrolle wird durchgeführt?",
    a: "TEAO prüft Drehmoment, Optik, Rückverfolgbarkeit, Temperaturverhalten, Lebensdauer und Geräusch je nach Anwendung und Kundenanforderung.",
  },
  {
    q: "Welche Daten werden für ein Angebot benötigt?",
    a: "Bitte senden Sie Anwendung, Zeichnung, Zielmoment oder Dämpfungskraft, Bewegungsrichtung, Bauraum, Temperaturbedingungen und Jahresmenge.",
  },
];

export const MANUFACTURER_FACTS_COPY = {
  ja: {
    title: "TEAO ダンパーメーカー | IATF 16949認証工場情報",
    description:
      "TEAOのメーカー情報: IATF 16949認証、年間8,000万個の生産能力、20年以上のダンパー製造経験、5つの製品ライン、品質管理、見積プロセス。",
    eyebrow: "メーカー情報",
    h1: "TEAO ダンパーメーカーの工場情報と技術能力",
    intro:
      "TEAOは自動車、家電、浴室設備、医療、産業用途向けに、標準品とカスタムダンパーを供給するB2Bメーカーです。",
    facts: [
      ["会社名", "東莞市テアオ電子科技有限公司"],
      ["創業", "2001年"],
      ["所在地", "中国 広東省 東莞市"],
      ["認証", "IATF 16949 / ISO 14001"],
      ["年間能力", "約8,000万個"],
      ["社員", "200名以上"],
    ],
    sections: [
      {
        title: "5つの製品ライン",
        body: "ギア / ロータリーダンパー、アキシャル / バレルダンパー、グローブボックスダンパー、ラッチ、カスタムモジュールを展開しています。",
      },
      {
        title: "社内製造能力",
        body: "金型、射出成形、組立、超音波溶着、トルク検査、外観検査を社内で管理し、試作から量産まで対応します。",
      },
      {
        title: "自動車品質管理",
        body: "IATF 16949を重視した工程管理、ロットトレーサビリティ、温度・寿命・騒音検証により、OEMおよびTier-1案件を支援します。",
      },
      {
        title: "対応市場",
        body: "自動車内装、EV充電口カバー、家電、浴室設備、医療機器、産業アクセスパネルなど、静かで制御された動きを必要とする機構に対応します。",
      },
      {
        title: "見積プロセス",
        body: "用途、図面、目標トルク、動作方向、取付スペース、年間数量を確認し、標準品またはカスタム案を提案します。",
      },
    ],
    faq: jaFaq,
    cta: "図面と仕様を送信して技術提案を依頼",
  },
  de: {
    title: "TEAO Dämpferhersteller | IATF 16949 zertifizierte Fabrikdaten",
    description:
      "TEAO Herstellerprofil: IATF 16949, 80 Mio. Einheiten Jahreskapazität, 20+ Jahre Dämpferfertigung, 5 Produktlinien, Qualitätskontrolle und Angebotsprozess.",
    eyebrow: "Herstellerprofil",
    h1: "TEAO Dämpferhersteller: Fabrikdaten und technische Fähigkeiten",
    intro:
      "TEAO ist ein B2B-Hersteller für Standard- und kundenspezifische Dämpfer für Automotive, Haushaltsgeräte, Sanitärtechnik, Medizin und Industrie.",
    facts: [
      ["Firmenname", "Dongguan TEAO Electronic Technology Co., Ltd."],
      ["Gegründet", "2001"],
      ["Standort", "Dongguan, Guangdong, China"],
      ["Zertifizierungen", "IATF 16949 / ISO 14001"],
      ["Jahreskapazität", "ca. 80 Millionen Einheiten"],
      ["Mitarbeitende", "200+"],
    ],
    sections: [
      {
        title: "Fünf Produktlinien",
        body: "TEAO liefert Zahnrad- / Rotationsdämpfer, Axial- / Barrel-Dämpfer, Handschuhfachdämpfer, Verriegelungen und kundenspezifische Module.",
      },
      {
        title: "Interne Fertigung",
        body: "Werkzeugbau, Spritzguss, Montage, Ultraschallschweißen, Drehmomentprüfung und Sichtprüfung werden intern gesteuert, von Prototyp bis Serie.",
      },
      {
        title: "Automotive-Qualität",
        body: "IATF-16949-orientierte Prozesskontrolle, Chargenrückverfolgbarkeit sowie Temperatur-, Lebensdauer- und Geräuschvalidierung unterstützen OEM- und Tier-1-Projekte.",
      },
      {
        title: "Bediente Märkte",
        body: "Fahrzeuginnenraum, EV-Ladeanschlussklappen, Haushaltsgeräte, Sanitärtechnik, Medizingeräte und industrielle Zugangspaneele mit leiser, kontrollierter Bewegung.",
      },
      {
        title: "Angebotsprozess",
        body: "TEAO prüft Anwendung, Zeichnung, Zielmoment, Bewegungsrichtung, Bauraum und Jahresmenge und empfiehlt Standardprodukte oder kundenspezifische Lösungen.",
      },
    ],
    faq: deFaq,
    cta: "Zeichnung und Spezifikation senden",
  },
} as const;
