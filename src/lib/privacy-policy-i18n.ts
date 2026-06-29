import type { Locale } from "@/lib/i18n";

export function getPrivacyPolicyCopy(locale: Locale | "en") {
  return PRIVACY_POLICY_COPY[locale] || PRIVACY_POLICY_COPY.en;
}

const PRIVACY_POLICY_COPY = {
  en: {
    title: "Privacy Policy | TEAO",
    description: "Privacy Policy for TEAO inquiry submissions and business contact information.",
    eyebrow: "Privacy",
    h1: "Privacy Policy",
    intro: "This policy explains how TEAO handles information submitted through website inquiry forms. Last updated: May 22, 2026.",
    contactTitle: "Contact",
    contactText: "For privacy questions or requests, contact TEAO at",
    download: "Download Policy",
    sections: [
      {
        title: "Information We Collect",
        body: "When you submit an inquiry, we collect the contact and project information you provide, such as name, company, email, phone, country, product interest, annual volume and message contents.",
      },
      {
        title: "How We Use Information",
        body: "We use submitted information to respond to your inquiry, evaluate technical requirements, prepare quotations, coordinate samples and provide engineering or commercial support.",
      },
      {
        title: "Information Sharing",
        body: "We do not sell inquiry information. We may share necessary details with internal sales, engineering, quality or production teams only for project evaluation and customer support.",
      },
      {
        title: "Data Retention",
        body: "Inquiry records may be retained for business follow-up, quotation history, compliance and project management. You may contact us to request correction or deletion where applicable.",
      },
      {
        title: "Security",
        body: "We use reasonable administrative and technical measures to protect inquiry information from unauthorized access, misuse or disclosure.",
      },
    ],
  },
  ja: {
    title: "プライバシーポリシー | TEAO",
    description: "TEAOのお問い合わせ情報およびビジネス連絡情報の取り扱いに関するプライバシーポリシー。",
    eyebrow: "プライバシー",
    h1: "プライバシーポリシー",
    intro: "このポリシーは、TEAOがウェブサイトのお問い合わせフォームから送信された情報をどのように取り扱うかを説明します。最終更新日: 2026年5月22日。",
    contactTitle: "お問い合わせ",
    contactText: "プライバシーに関するご質問やご依頼は、TEAOまでご連絡ください:",
    download: "ポリシーをダウンロード",
    sections: [
      {
        title: "収集する情報",
        body: "お問い合わせを送信する際、氏名、会社名、メールアドレス、電話番号、国、関心のある製品、年間数量、メッセージ内容など、お客様が提供する連絡先およびプロジェクト情報を収集します。",
      },
      {
        title: "情報の利用目的",
        body: "送信された情報は、お問い合わせへの回答、技術要件の確認、見積作成、サンプル調整、技術または営業サポートの提供に使用します。",
      },
      {
        title: "情報の共有",
        body: "TEAOはお問い合わせ情報を販売しません。プロジェクト評価と顧客サポートのために必要な範囲で、社内の営業、技術、品質、生産チームと共有する場合があります。",
      },
      {
        title: "データ保持",
        body: "お問い合わせ記録は、業務フォロー、見積履歴、コンプライアンス、プロジェクト管理のために保持される場合があります。適用される範囲で修正または削除を依頼できます。",
      },
      {
        title: "セキュリティ",
        body: "TEAOは、お問い合わせ情報を不正アクセス、誤用、漏えいから保護するため、合理的な管理上および技術上の対策を講じます。",
      },
    ],
  },
  de: {
    title: "Datenschutzerklärung | TEAO",
    description: "Datenschutzerklärung für TEAO-Anfragen und geschäftliche Kontaktinformationen.",
    eyebrow: "Datenschutz",
    h1: "Datenschutzerklärung",
    intro: "Diese Richtlinie erklärt, wie TEAO Informationen verarbeitet, die über Anfrageformulare der Website übermittelt werden. Zuletzt aktualisiert: 22. Mai 2026.",
    contactTitle: "Kontakt",
    contactText: "Bei Datenschutzfragen oder Anfragen kontaktieren Sie TEAO unter",
    download: "Richtlinie herunterladen",
    sections: [
      {
        title: "Welche Informationen wir erfassen",
        body: "Wenn Sie eine Anfrage senden, erfassen wir die von Ihnen bereitgestellten Kontakt- und Projektinformationen, z. B. Name, Unternehmen, E-Mail, Telefon, Land, Produktinteresse, Jahresmenge und Nachrichteninhalt.",
      },
      {
        title: "Wie wir Informationen verwenden",
        body: "Wir verwenden übermittelte Informationen, um auf Ihre Anfrage zu antworten, technische Anforderungen zu bewerten, Angebote zu erstellen, Muster zu koordinieren und technischen oder kommerziellen Support bereitzustellen.",
      },
      {
        title: "Weitergabe von Informationen",
        body: "Wir verkaufen keine Anfrageinformationen. Notwendige Details können intern an Vertrieb, Engineering, Qualität oder Produktion weitergegeben werden, ausschließlich für Projektbewertung und Kundensupport.",
      },
      {
        title: "Datenaufbewahrung",
        body: "Anfragedaten können für geschäftliche Nachverfolgung, Angebotshistorie, Compliance und Projektmanagement aufbewahrt werden. Sie können uns kontaktieren, um Berichtigung oder Löschung zu beantragen, soweit dies anwendbar ist.",
      },
      {
        title: "Sicherheit",
        body: "Wir setzen angemessene administrative und technische Maßnahmen ein, um Anfrageinformationen vor unbefugtem Zugriff, Missbrauch oder Offenlegung zu schützen.",
      },
    ],
  },
} as const;
