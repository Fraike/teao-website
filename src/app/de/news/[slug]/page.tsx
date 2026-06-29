import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { news, newsTranslations, products } from "@/db/schema";
import { LOCALE_OG, getAlternateUrls, withLocale, type Locale } from "@/lib/i18n";
import { JsonLdScript, breadcrumbSchema, newsArticleSchema, speakableSchema } from "@/lib/structured-data";
import { getReadingTime, formatReadingTime } from "@/lib/reading-time";
import { SafeImage } from "@/components/ui/SafeImage";
import { ShareButtons } from "@/components/products/ShareButtons";
import { getProductUrl } from "@/lib/products";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

async function getLocalizedArticle(slug: string, locale: Locale) {
  const article = await db.select().from(news).where(eq(news.slug, slug)).get();
  if (!article || !article.isPublished) return null;
  const translation = await db
    .select()
    .from(newsTranslations)
    .where(and(eq(newsTranslations.newsId, article.id), eq(newsTranslations.locale, locale)))
    .get();

  if (!translation || translation.translationStatus !== "translated") {
    return { article, translation: null };
  }

  return {
    article: {
      ...article,
      slug: translation.slug || article.slug,
      title: translation.title,
      summary: translation.summary,
      content: translation.content,
      seoTitle: translation.seoTitle,
      keywords: translation.keywords,
    },
    translation,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = "de" as "ja" | "de";
  const result = await getLocalizedArticle(slug.replace(/\.html$/, ""), locale);
  if (!result) return { title: "Article Not Found" };
  const { article } = result;
  const seoTitle = article.seoTitle || article.title;
  const canonicalPath = withLocale(`/news/${slug.replace(/\.html$/, "")}.html`, locale);
  const alternates = getAlternateUrls(`/news/${slug.replace(/\.html$/, "")}.html`);

  return {
    title: `${seoTitle} | TEAO News`,
    description: article.summary?.slice(0, 160),
    keywords: article.keywords?.split(",").map((k: string) => k.trim()) || [],
    alternates: {
      canonical: canonicalPath,
      languages: alternates,
    },
    openGraph: {
      title: seoTitle,
      description: article.summary,
      type: "article",
      locale: LOCALE_OG[locale],
      publishedTime: article.publishedAt,
      images: article.image ? [{ url: article.image, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: article.summary,
      images: article.image ? [article.image] : [],
    },
  };
}

export default async function LocalizedNewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const locale = "de" as "ja" | "de";
  const sourceSlug = slug.replace(/\.html$/, "");
  const result = await getLocalizedArticle(sourceSlug, locale);
  if (!result) notFound();
  const { article } = result;

  let relatedSlugs: string[] = [];
  try { relatedSlugs = JSON.parse(article.relatedProducts || "[]"); } catch { relatedSlugs = []; }
  const relatedProducts = relatedSlugs.length > 0
    ? await db.select().from(products).where(eq(products.slug, relatedSlugs[0])).all()
    : [];

  const readTime = getReadingTime(article.content);
  const readTimeLabel = formatReadingTime(readTime);
  const canonicalPath = withLocale(`/news/${sourceSlug}.html`, locale);
  const articleJsonLd = newsArticleSchema({
    slug: sourceSlug,
    title: article.title,
    summary: article.summary,
    content: article.content,
    image: article.image,
    category: article.category as "company" | "quality" | "engineering",
    isPublished: Boolean(article.isPublished),
    publishedAt: article.publishedAt,
    keywords: article.keywords ?? undefined,
  });
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Home", url: withLocale("/", locale) },
    { name: "News", url: withLocale("/news", locale) },
    { name: article.title, url: canonicalPath },
  ]);

  return (
    <>
      <JsonLdScript data={articleJsonLd} />
      <JsonLdScript data={breadcrumbJsonLd} />
      <JsonLdScript data={speakableSchema({ title: article.title, summary: article.summary })} />
      <article className="relative overflow-hidden bg-[linear-gradient(180deg,#F8F9FA_0%,#FFFFFF_42%,#FFFFFF_100%)] pt-28 pb-16 lg:pt-32 lg:pb-24">
        <div className="shell relative max-w-[920px]">
          <nav className="mb-6 flex min-w-0 items-center gap-1.5 overflow-hidden rounded-full border border-[#E5E7EB] bg-white/85 px-3 py-2 text-xs font-bold text-[#6B7280] shadow-[0_8px_24px_rgba(17,24,39,0.04)]" aria-label="Breadcrumb">
            <Link href={withLocale("/", locale)} className="shrink-0 rounded-full px-2 py-1 hover:bg-[#FFF1E3] hover:text-[#ED7606]">Home</Link>
            <span className="shrink-0 text-[#CBD5E1]">/</span>
            <Link href={withLocale("/news", locale)} className="shrink-0 rounded-full px-2 py-1 hover:bg-[#FFF1E3] hover:text-[#ED7606]">News</Link>
            <span className="shrink-0 text-[#CBD5E1]">/</span>
            <span className="min-w-0 truncate rounded-full bg-[#F8F9FA] px-2 py-1 text-[#111827]">{article.title}</span>
          </nav>

          <header className="mb-8 rounded-[24px] border border-[#E5E7EB] bg-white/86 p-5 shadow-[0_24px_70px_rgba(17,24,39,0.07)] backdrop-blur sm:p-7 lg:p-9">
            <div className="mb-5 flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center rounded-full bg-[#111827] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.13em] text-white">{article.category}</span>
              <span className="rounded-full border border-[#E5E7EB] bg-[#F8F9FA] px-3 py-1.5 text-xs font-bold text-[#6B7280]">{article.publishedAt}</span>
              <span className="rounded-full border border-[#E5E7EB] bg-[#F8F9FA] px-3 py-1.5 text-xs font-bold text-[#6B7280]">{readTimeLabel}</span>
            </div>
            <h1 className="article-title max-w-[780px] text-[clamp(32px,4.4vw,56px)] font-black leading-[0.96] tracking-[-0.045em] text-[#111827] text-balance">
              {article.title}
            </h1>
            <p className="article-summary mt-5 max-w-[720px] text-base leading-relaxed text-[#6B7280] sm:text-lg">
              {article.summary}
            </p>
          </header>

          {article.image && (
            <div className="relative mb-8 h-[260px] w-full overflow-hidden rounded-[24px] border border-[#E5E7EB] bg-[#F8F9FA] shadow-[0_24px_70px_rgba(17,24,39,0.10)] sm:h-[340px] lg:h-[390px]">
              <SafeImage src={article.image} alt={article.title} fill className="object-contain p-6" priority sizes="(max-width: 860px) 100vw, 860px" />
            </div>
          )}

          <div
            className="news-article-body mt-10 rounded-[24px] border border-[#E5E7EB] bg-white px-5 py-7 shadow-[0_22px_64px_rgba(17,24,39,0.06)] prose prose-lg max-w-none text-[#333333] leading-relaxed sm:px-8 sm:py-9 lg:px-10"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <div className="mt-12 border-t border-[#E5E7EB] pt-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <ShareButtons title={article.seoTitle || article.title} summary={article.summary} />
              <Link href={withLocale("/news", locale)} className="text-sm font-medium text-[#6B7280] hover:text-[#ED7606]">
                Back to News
              </Link>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <section className="mt-12 border-t border-[#E5E7EB] pt-8">
              <h2 className="mb-5 text-xl font-extrabold tracking-[-0.02em] text-[#111827]">Related Products</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedProducts.map((p) => (
                  <Link key={p.slug} href={withLocale(getProductUrl(p), locale)} className="rounded-xl border border-[#E5E7EB] bg-white p-4 text-sm font-bold text-[#111827] hover:border-[#ED7606]">
                    {p.model} – {p.name}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
}
