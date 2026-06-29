import type { Locale } from "@/lib/i18n";
import {
  businessStats,
  competencies,
  corporateValues,
  peopleCulture,
  timeline,
  trustBadges,
} from "@/content/about";

export type AboutLocale = Locale | "en";

export function getAboutCopy(locale: AboutLocale) {
  return ABOUT_COPY[locale] || ABOUT_COPY.en;
}

const ABOUT_COPY = {
  en: {
    metadata: {
      title: "About TEAO | 20+ Years Damper & Motion Control Manufacturer",
      description:
        "Learn about TEAO, a professional damper and motion control component manufacturer with 20+ years of experience, IATF 16949 certification, automated production lines and custom torque engineering capability.",
    },
    hero: {
      eyebrow: "Company Profile",
      title: "Dongguan Teao Electronic Technology Co., Ltd.",
      description:
        "A focused manufacturer of dampers, latches, synchronizers and custom motion-control modules for automotive, appliance and precision product programs.",
      cta: "Discuss a Project",
      years: "Years of focused manufacturing",
      videoBadge: "Company Video",
      videoTitle: "Inside TEAO Manufacturing",
      trustBadges,
    },
    timelineSection: {
      eyebrow: "Company Milestones",
      title: "Focused growth since 2001.",
      description:
        "A compact view of TEAO's development path, from foundation to automotive programs and factory expansion.",
      items: timeline,
    },
    business: {
      eyebrow: "Business Data",
      title: "Manufacturing at scale.",
      stats: businessStats,
    },
    competencies: {
      eyebrow: "Core Competencies",
      title: "Complete manufacturing capabilities.",
      items: competencies,
    },
    certificates: {
      eyebrow: "Quality Credentials",
      title: "IATF 16949 and ISO 14001 certified systems, backed by 20+ patents.",
      description:
        "TEAO is an automotive quality system and environmental management system certified manufacturer, a high-tech enterprise, and a long-term developer of patented damper structures and mechanisms.",
      systemLabel: "System Certificates",
      systemTitle: "IATF 16949 / ISO 14001",
      systemBadge: "Factory Management",
      patentLabel: "Patent Certificates",
      patentTitle: "20+ Patented Technologies",
      patentBadge: "R&D Evidence",
    },
    csr: {
      eyebrow: "Corporate Social Responsibility",
      title: "Contributing to education, charity and environmental protection.",
      description:
        "TEAO believes enterprise development should create value beyond products. We support public-interest activities in education, charity, environmental protection and local community development.",
      values: corporateValues,
    },
    peopleCulture,
    cta: {
      eyebrow: "Work With TEAO",
      title: "Looking for a reliable damper manufacturing partner?",
      description:
        "Tell us your application, torque requirements and annual volume. TEAO engineering team will help recommend a suitable solution.",
      primary: "Get a Custom Solution",
      secondary: "Contact Engineering Team",
      cards: ["Custom Torque", "Full Engineering Support", "Stable Mass Production"],
    },
  },
  ja: {
    metadata: {
      title: "TEAOについて | 20年以上のダンパー・モーションコントロール部品メーカー",
      description:
        "TEAOは20年以上の経験、IATF 16949認証、自動化生産ライン、カスタムトルク設計能力を持つダンパー・モーションコントロール部品メーカーです。",
    },
    hero: {
      eyebrow: "会社概要",
      title: "東莞市テアオ電子科技有限公司",
      description:
        "自動車、家電、精密機構向けに、ダンパー、ラッチ、シンクロナイザー、カスタムモーションコントロールモジュールを開発・量産する専門メーカーです。",
      cta: "プロジェクトを相談",
      years: "ダンパー製造に特化した年数",
      videoBadge: "会社動画",
      videoTitle: "TEAOの製造現場",
      trustBadges: ["IATF 16949", "ISO 14001", "20件以上の特許", "200社以上の顧客"],
    },
    timelineSection: {
      eyebrow: "会社沿革",
      title: "2001年からダンパー分野に集中して成長。",
      description:
        "創業から自動車用途への参入、工場移転、製品革新まで、TEAOの発展を時系列で紹介します。",
      items: [
        { year: "2001", title: "会社設立", description: "深圳東升科技園で創業。" },
        { year: "2009", title: "自動車業界へ参入", description: "自動車用途と射出成形工程を開始。" },
        { year: "2014", title: "事業拡大", description: "東莞市黄江鎮へ移転。" },
        { year: "2021", title: "製品革新", description: "エアダンパー、単方向機構を開発し、10件以上の特許を追加。" },
        { year: "2025", title: "新工場へ拡張", description: "東莞市黄江北三街2号へ移転。" },
      ],
    },
    business: {
      eyebrow: "事業データ",
      title: "量産に対応する製造体制。",
      stats: [
        { value: "100+", label: "ダンピング・クッションソリューション" },
        { value: "4 Markets", label: "自動車 / 浴室設備 / 家電 / 医療" },
        { value: "2 Checks", label: "トルク検査 + 外観検査" },
        { value: "6%", label: "売上の研究開発投資比率" },
        { value: "20+11", label: "生産ライン + 自動検査ライン" },
        { value: "200+", label: "世界のB2B顧客" },
      ],
    },
    competencies: {
      eyebrow: "コア能力",
      title: "開発から量産まで対応する製造能力。",
      items: [
        {
          ...competencies[0],
          title: "エンジニアリングとサービス",
          subtitle: "トルク調整サポート",
          description:
            "量産前にトルク調整、サンプル評価、用途適合確認を行い、最適な仕様選定を支援します。",
        },
        {
          ...competencies[1],
          title: "プラスチック射出成形",
          subtitle: "金型 + 射出 + 量産",
          description:
            "金型設計・製作から射出成形、組立まで一貫したソリューションを提供します。",
        },
        {
          ...competencies[2],
          title: "組立",
          subtitle: "柔軟な生産体制",
          description:
            "全自動、半自動、手作業の組立ラインにより、カスタム案件から量産まで柔軟に対応します。",
        },
      ],
    },
    certificates: {
      eyebrow: "品質認証",
      title: "IATF 16949とISO 14001認証システム、20件以上の特許技術。",
      description:
        "TEAOは自動車品質マネジメントシステムと環境マネジメントシステムの認証を取得したメーカーであり、ダンパー構造と機構の特許開発を継続しています。",
      systemLabel: "システム認証",
      systemTitle: "IATF 16949 / ISO 14001",
      systemBadge: "工場管理",
      patentLabel: "特許証書",
      patentTitle: "20件以上の特許技術",
      patentBadge: "研究開発実績",
    },
    csr: {
      eyebrow: "企業の社会的責任",
      title: "教育、慈善活動、環境保護への貢献。",
      description:
        "TEAOは企業の発展が製品だけでなく社会にも価値を生むべきだと考え、教育、慈善、環境保護、地域社会の活動を支援しています。",
      values: [
        { name: "教育支援", description: "教育活動と技術学習を支援し、若い人材の実践力向上に貢献します。" },
        { name: "慈善活動", description: "地域社会で支援を必要とする人々への配慮と公益活動への参加を大切にしています。" },
        { name: "環境保護", description: "ISO 14001に基づき、クリーンな生産、資源節約、廃棄物管理を推進します。" },
        { name: "地域貢献", description: "グローバル顧客に対応しながら、地域社会への責任ある貢献を続けます。" },
      ],
    },
    peopleCulture: {
      ...peopleCulture,
      eyebrow: "人と文化",
      title: "精密な動きを支える一体感のあるチーム。",
      description:
        "TEAOは人を通じて成長します。社員の学習、チーム協力、健康、公平な職場づくりを支援し、各メンバーが自信と創造性を持って貢献できる環境を整えています。",
      highlights: [
        { name: "成長と学習", description: "定期的な研修と部門横断レビューにより、社員のスキル向上と課題解決を支援します。" },
        { name: "ケアと健康", description: "チーム活動と支え合う職場文化により、社員のつながり、健康、参加意識を高めます。" },
        { name: "尊重と責任", description: "公平な待遇、社員の権利、日常業務と会社発展における責任を重視します。" },
      ],
    },
    cta: {
      eyebrow: "TEAOと協業",
      title: "信頼できるダンパー製造パートナーをお探しですか？",
      description:
        "用途、トルク要求、年間数量をお知らせください。TEAOのエンジニアリングチームが適切なソリューションを提案します。",
      primary: "カスタム提案を依頼",
      secondary: "技術チームに相談",
      cards: ["カスタムトルク", "技術サポート", "安定した量産"],
    },
  },
  de: {
    metadata: {
      title: "Über TEAO | 20+ Jahre Hersteller für Dämpfer und Motion Control",
      description:
        "Erfahren Sie mehr über TEAO, einen Hersteller für Dämpfer und Motion-Control-Komponenten mit 20+ Jahren Erfahrung, IATF 16949, automatisierten Linien und kundenspezifischer Drehmomententwicklung.",
    },
    hero: {
      eyebrow: "Unternehmensprofil",
      title: "Dongguan Teao Electronic Technology Co., Ltd.",
      description:
        "Ein spezialisierter Hersteller von Dämpfern, Verriegelungen, Synchronisierern und kundenspezifischen Motion-Control-Modulen für Automotive, Haushaltsgeräte und Präzisionsprodukte.",
      cta: "Projekt besprechen",
      years: "Jahre fokussierte Fertigung",
      videoBadge: "Unternehmensvideo",
      videoTitle: "Einblick in die TEAO-Fertigung",
      trustBadges: ["IATF 16949", "ISO 14001", "20+ Patente", "200+ Kunden"],
    },
    timelineSection: {
      eyebrow: "Meilensteine",
      title: "Fokussiertes Wachstum seit 2001.",
      description:
        "Ein kompakter Überblick über TEOAs Entwicklung von der Gründung bis zu Automotive-Programmen und Werkserweiterung.",
      items: [
        { year: "2001", title: "Unternehmen gegründet", description: "Gründung im Shenzhen Dongsheng Technology Park." },
        { year: "2009", title: "Einstieg in Automotive", description: "Start von Automotive-Anwendungen und Spritzgussprozessen." },
        { year: "2014", title: "Geschäftserweiterung", description: "Umzug nach Huangjiang Town, Dongguan City." },
        { year: "2021", title: "Produktinnovation", description: "Einführung von Luftdämpfern, Einwegmechanismen und mehr als zehn neuen Patenten." },
        { year: "2025", title: "Neue Erweiterung", description: "Umzug in die Huangjiang North Third Street Nr. 2, Dongguan City." },
      ],
    },
    business: {
      eyebrow: "Geschäftsdaten",
      title: "Fertigung im Serienmaßstab.",
      stats: [
        { value: "100+", label: "Dämpfungs- und Cushioning-Lösungen" },
        { value: "4 Märkte", label: "Automotive / Sanitär / Haushaltsgeräte / Medizin" },
        { value: "2 Prüfungen", label: "Drehmomentprüfung + Sichtprüfung" },
        { value: "6%", label: "Umsatzanteil für F&E" },
        { value: "20+11", label: "Produktions- und automatisierte Prüflinien" },
        { value: "200+", label: "Kunden weltweit" },
      ],
    },
    competencies: {
      eyebrow: "Kernkompetenzen",
      title: "Umfassende Fertigungskompetenz.",
      items: [
        {
          ...competencies[0],
          title: "Engineering & Service",
          subtitle: "Unterstützung bei Drehmomentabstimmung",
          description:
            "Engineering-Support umfasst Drehmomentabstimmung, Musterprüfung und Applikationsabgleich vor der Serienfertigung.",
        },
        {
          ...competencies[1],
          title: "Kunststoff-Spritzguss",
          subtitle: "Werkzeug + Spritzguss + Produktion",
          description:
            "TEAO bietet komplette Lösungen von Werkzeugdesign und Werkzeugbau bis zu Kunststoffspritzguss und Montage.",
        },
        {
          ...competencies[2],
          title: "Montage",
          subtitle: "Flexible Produktion",
          description:
            "Vollautomatische, halbautomatische und manuelle Montagelinien unterstützen kundenspezifische Projekte und Serienfertigung.",
        },
      ],
    },
    certificates: {
      eyebrow: "Qualitätsnachweise",
      title: "IATF 16949 und ISO 14001 zertifizierte Systeme, unterstützt durch 20+ Patente.",
      description:
        "TEAO ist ein zertifizierter Hersteller mit Automotive-Qualitäts- und Umweltmanagementsystem und entwickelt langfristig patentierte Dämpferstrukturen und Mechanismen.",
      systemLabel: "Systemzertifikate",
      systemTitle: "IATF 16949 / ISO 14001",
      systemBadge: "Werksmanagement",
      patentLabel: "Patentzertifikate",
      patentTitle: "20+ patentierte Technologien",
      patentBadge: "F&E-Nachweis",
    },
    csr: {
      eyebrow: "Corporate Social Responsibility",
      title: "Beitrag zu Bildung, Wohltätigkeit und Umweltschutz.",
      description:
        "TEAO ist überzeugt, dass Unternehmensentwicklung über Produkte hinaus Wert schaffen sollte. Wir unterstützen gemeinnützige Aktivitäten in Bildung, Wohltätigkeit, Umweltschutz und lokaler Gemeinschaft.",
      values: [
        { name: "Bildungsförderung", description: "Bildungsinitiativen und technisches Lernen helfen jungen Menschen, praktische Fähigkeiten aufzubauen." },
        { name: "Wohltätigkeit", description: "TEAO fördert gemeinnützige Beteiligung und Unterstützung für Menschen in der lokalen Gemeinschaft." },
        { name: "Umweltschutz", description: "ISO-14001-Praktiken leiten sauberere Produktion, Ressourceneinsparung und verantwortliche Abfallkontrolle." },
        { name: "Gemeinschaftsbeitrag", description: "Verantwortliches Wachstum bedeutet, zur lokalen Gemeinschaft beizutragen und globale Kunden zu bedienen." },
      ],
    },
    peopleCulture: {
      ...peopleCulture,
      eyebrow: "Menschen & Kultur",
      title: "Ein starkes Team hinter jeder präzisen Bewegung.",
      description:
        "TEAO wächst durch Menschen. Wir unterstützen Lernen, Teamarbeit, Wohlbefinden und faire Arbeitspraktiken, damit jedes Mitglied mit Vertrauen und Kreativität beitragen kann.",
      highlights: [
        { name: "Wachstum & Lernen", description: "Regelmäßige Schulungen und teamübergreifende Reviews helfen Mitarbeitenden, Fähigkeiten zu verbessern und Kundenaufgaben gemeinsam zu lösen." },
        { name: "Fürsorge & Wohlbefinden", description: "Teamaktivitäten und eine unterstützende Arbeitsplatzkultur halten Mitarbeitende verbunden, gesund und engagiert." },
        { name: "Respekt & Verantwortung", description: "TEAO legt Wert auf faire Behandlung, Arbeitnehmerrechte und gemeinsame Verantwortung in täglicher Arbeit und Unternehmensentwicklung." },
      ],
    },
    cta: {
      eyebrow: "Mit TEAO arbeiten",
      title: "Suchen Sie einen zuverlässigen Fertigungspartner für Dämpfer?",
      description:
        "Teilen Sie Anwendung, Drehmomentanforderungen und Jahresmenge mit. Das TEAO-Engineering-Team empfiehlt eine passende Lösung.",
      primary: "Kundenspezifische Lösung anfragen",
      secondary: "Engineering-Team kontaktieren",
      cards: ["Kundenspezifisches Drehmoment", "Volle Engineering-Unterstützung", "Stabile Serienfertigung"],
    },
  },
} as const;
