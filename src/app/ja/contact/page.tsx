import type { Metadata } from "next";
import Link from "next/link";
import { withLocale, getAlternateUrls, LOCALE_OG } from "@/lib/i18n";
import { SITE_CONFIG } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  const locale = "ja" as "ja" | "de";
  const title = locale === "ja" ? "お問い合わせ | TEAO" : "Kontakt | TEAO";
  const description = locale === "ja"
    ? "図面、目標トルク、用途、年間数量を共有して、TEAOにダンパー選定を相談してください。"
    : "Senden Sie Zeichnung, Zielmoment, Anwendung und Jahresmenge für eine technische Dämpferempfehlung von TEAO.";
  return {
    title,
    description,
    alternates: {
      canonical: withLocale("/contact", locale),
      languages: getAlternateUrls("/contact"),
    },
    openGraph: { title, description, locale: LOCALE_OG[locale] },
  };
}

export default async function LocalizedContactPage() {
  const locale = "ja" as "ja" | "de";

  return (
    <main className="section pt-28 lg:pt-32">
      <div className="shell">
        <div className="max-w-3xl rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_12px_40px_rgba(17,24,39,0.06)] lg:p-10">
          <span className="eyebrow">Contact</span>
          <h1 className="mt-3 text-[clamp(34px,4vw,52px)] font-black tracking-[-0.05em] text-[#111827]">
            {locale === "ja" ? "TEAOにお問い合わせください" : "Kontaktieren Sie TEAO"}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#6B7280]">
            {locale === "ja"
              ? "用途、図面、目標トルク、動作方向、年間数量をお送りください。TEAOのエンジニアリングチームが標準品またはカスタム案を確認します。"
              : "Senden Sie Anwendung, Zeichnung, Zielmoment, Bewegungsrichtung und Jahresmenge. Das TEAO Engineering-Team prüft eine Standardplattform oder kundenspezifische Lösung."}
          </p>
          <div className="mt-6 rounded-xl border border-[#FFE3C2] bg-[#FFFAF5] p-5">
            <div className="text-sm font-black text-[#111827]">Email</div>
            <a href={`mailto:${SITE_CONFIG.email}`} className="mt-2 inline-block text-lg font-black text-[#ED7606] hover:underline">
              {SITE_CONFIG.email}
            </a>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/contact" className="btn btn-primary">Open English Inquiry Form</Link>
            <Link href={withLocale("/products", locale)} className="btn btn-outline">Products</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
