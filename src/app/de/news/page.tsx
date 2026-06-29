import type { Metadata } from "next";
import Link from "next/link";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { news, newsTranslations } from "@/db/schema";
import { withLocale, getAlternateUrls, LOCALE_OG } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = "de" as "ja" | "de";
  const title = locale === "ja" ? "ニュースと技術記事" : "Nachrichten und technische Artikel";
  const description = locale === "ja"
    ? "TEAOのダンパー技術記事、会社ニュース、製品選定ガイド。"
    : "Technische Artikel, Unternehmensnachrichten und Auswahlhilfen für TEAO Dämpfer.";
  return {
    title,
    description,
    alternates: {
      canonical: withLocale("/news", locale),
      languages: getAlternateUrls("/news"),
    },
    openGraph: { title, description, locale: LOCALE_OG[locale] },
  };
}

export default async function LocalizedNewsPage() {
  const locale = "de" as "ja" | "de";
  const rows = await db.select().from(news).orderBy(desc(news.publishedAt)).all();
  const published = rows.filter((item) => Boolean(item.isPublished));
  const articles = await Promise.all(published.map(async (article) => {
    const translated = await db
      .select()
      .from(newsTranslations)
      .where(and(eq(newsTranslations.newsId, article.id), eq(newsTranslations.locale, locale), eq(newsTranslations.translationStatus, "translated")))
      .get();
    return translated ? { ...article, title: translated.title, summary: translated.summary } : article;
  }));

  return (
    <main className="section pt-28 lg:pt-32">
      <div className="shell">
        <span className="eyebrow">News</span>
        <h1 className="mt-3 text-[clamp(34px,4vw,52px)] font-black tracking-[-0.05em] text-[#111827]">
          {locale === "ja" ? "ニュースと技術記事" : "Nachrichten und technische Artikel"}
        </h1>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link key={article.slug} href={withLocale(`/news/${article.slug}.html`, locale)} className="rounded-xl border border-[#E5E7EB] bg-white p-5 transition-colors hover:border-[#ED7606]">
              <div className="text-xs font-black uppercase tracking-[0.12em] text-[#ED7606]">{article.category}</div>
              <h2 className="mt-2 text-xl font-black leading-tight text-[#111827]">{article.title}</h2>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#6B7280]">{article.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
