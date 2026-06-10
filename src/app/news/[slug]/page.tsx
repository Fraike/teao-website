import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { existsSync } from "fs";
import { join } from "path";
import { eq, inArray, gt, and } from "drizzle-orm";
import { db } from "@/db";
import { news, products } from "@/db/schema";
import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
import { JsonLdScript, newsArticleSchema, breadcrumbSchema, speakableSchema, faqPageSchema } from "@/lib/structured-data";
import { getReadingTime, formatReadingTime } from "@/lib/reading-time";
import { getProductUrl } from "@/lib/products";
import { ShareButtons } from "@/components/products/ShareButtons";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

function getArticleHeroImage(image: string | null): string {
  if (!image) return "";

  const candidates = image.endsWith("/main.webp")
    ? [
        image.replace("/main.webp", "/photo_1.webp"),
        image.replace("/main.webp", "/photo_2.webp"),
        image,
      ]
    : [image];

  return candidates.find((candidate) => {
    if (!candidate.startsWith("/")) return true;
    return existsSync(join(process.cwd(), "public", candidate));
  }) || image;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await db.select().from(news).where(eq(news.slug, slug)).get();
  if (!article) return { title: "Article Not Found" };

  const seoTitle = article.seoTitle || article.title;
  const title = `${seoTitle} | TEAO News`;
  const keywords = article.keywords?.split(",").map((k: string) => k.trim()) || [];
  const canonicalUrl = `${env.SITE_URL}/news/${article.slug}.html`;
  const heroImage = getArticleHeroImage(article.image);

  return {
    title,
    description: article.summary?.slice(0, 160),
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seoTitle || article.title,
      description: article.summary,
      type: "article",
      publishedTime: article.publishedAt,
      images: heroImage ? [{ url: heroImage, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle || article.title,
      description: article.summary,
      images: heroImage ? [heroImage] : [],
    },
    other: {
      "article:published_time": article.publishedAt,
      "article:tag": article.keywords || "",
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await db.select().from(news).where(eq(news.slug, slug)).get();
  if (!article) notFound();

  // Parse related products
  let relatedSlugs: string[] = [];
  try { relatedSlugs = JSON.parse(article.relatedProducts || "[]"); } catch { relatedSlugs = []; }

  // Fetch related products from DB
  const relatedProducts = relatedSlugs.length > 0
    ? await db.select().from(products).where(inArray(products.slug, relatedSlugs)).all()
    : [];

  // Next article
  const nextArticle = await db.select({ slug: news.slug, title: news.title })
    .from(news)
    .where(and(eq(news.isPublished, 1), gt(news.publishedAt, article.publishedAt)))
    .orderBy(news.publishedAt)
    .limit(1)
    .get();

  const readTime = getReadingTime(article.content);
  const readTimeLabel = formatReadingTime(readTime);
  const heroImage = getArticleHeroImage(article.image);

  // Generate Key Takeaways from content (first 3 H2 headings or sentences)
  const takeaways = extractTakeaways(article.content, article.summary);

  const articleJsonLd = newsArticleSchema({
    slug: article.slug,
    title: article.title,
    summary: article.summary,
    content: article.content,
    image: heroImage || article.image,
    category: article.category as "company" | "quality" | "engineering",
    isPublished: Boolean(article.isPublished),
    publishedAt: article.publishedAt,
    keywords: article.keywords ?? undefined,
  });
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "News", url: "/news" },
    { name: article.title },
  ]);
  const speakableJsonLd = speakableSchema({
    title: article.title,
    summary: article.summary,
  });

  // FAQ schema for FAQ type articles
  const isFaq = article.articleType === "faq";
  const faqQuestions = isFaq ? extractFaqQuestions(article.content) : [];
  const faqJsonLd = isFaq && faqQuestions.length > 0 ? faqPageSchema(faqQuestions) : null;

  return (
    <>
      <JsonLdScript data={articleJsonLd} />
      <JsonLdScript data={breadcrumbJsonLd} />
      <JsonLdScript data={speakableJsonLd} />
      {faqJsonLd && <JsonLdScript data={faqJsonLd} />}

      <article className="relative overflow-hidden bg-[linear-gradient(180deg,#F8F9FA_0%,#FFFFFF_42%,#FFFFFF_100%)] pt-28 pb-16 lg:pt-32 lg:pb-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_18%_8%,rgba(237,118,6,0.10),transparent_32%),radial-gradient(circle_at_82%_12%,rgba(17,24,39,0.07),transparent_34%)]" />
        <div className="shell relative max-w-[920px]">
          {/* Breadcrumb */}
          <nav className="mb-6 flex min-w-0 items-center gap-1.5 overflow-hidden rounded-full border border-[#E5E7EB] bg-white/85 px-3 py-2 text-xs font-bold text-[#6B7280] shadow-[0_8px_24px_rgba(17,24,39,0.04)]" aria-label="Breadcrumb">
            <Link href="/" className="shrink-0 rounded-full px-2 py-1 hover:bg-[#FFF1E3] hover:text-[#ED7606] transition-colors">
              Home
            </Link>
            <span className="shrink-0 text-[#CBD5E1]">/</span>
            <Link href="/news" className="shrink-0 rounded-full px-2 py-1 hover:bg-[#FFF1E3] hover:text-[#ED7606] transition-colors">
              News
            </Link>
            <span className="shrink-0 text-[#CBD5E1]">/</span>
            <span className="min-w-0 truncate rounded-full bg-[#F8F9FA] px-2 py-1 text-[#111827]">
              {article.title}
            </span>
          </nav>

          {/* Header section */}
          <header className="mb-8 rounded-[24px] border border-[#E5E7EB] bg-white/86 p-5 shadow-[0_24px_70px_rgba(17,24,39,0.07)] backdrop-blur sm:p-7 lg:p-9">
            {/* Meta row */}
            <div className="mb-5 flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center rounded-full bg-[#111827] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.13em] text-white">
                {article.category}
              </span>
              <span className="rounded-full border border-[#E5E7EB] bg-[#F8F9FA] px-3 py-1.5 text-xs font-bold text-[#6B7280]">
                {article.publishedAt}
              </span>
              <span className="rounded-full border border-[#E5E7EB] bg-[#F8F9FA] px-3 py-1.5 text-xs font-bold text-[#6B7280]">
                {readTimeLabel}
              </span>
              {article.articleType && article.articleType !== "article" && (
                <span className="rounded-full border border-[#FED7AA] bg-[#FFF7ED] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.10em] text-[#ED7606]">
                  {article.articleType}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="article-title max-w-[780px] text-[clamp(32px,4.4vw,56px)] font-black leading-[0.96] tracking-[-0.045em] text-[#111827] text-balance">
              {article.title}
            </h1>

            {/* Summary */}
            <p className="article-summary mt-5 max-w-[720px] text-base leading-relaxed text-[#6B7280] sm:text-lg">
              {article.summary}
            </p>
          </header>

          {/* Hero Image */}
          {heroImage && (
            <div className="relative mb-8 h-[260px] w-full overflow-hidden rounded-[24px] border border-[#E5E7EB] bg-[radial-gradient(circle_at_24%_20%,rgba(237,118,6,0.12),transparent_34%),linear-gradient(135deg,#FFFFFF_0%,#F4F7FA_100%)] shadow-[0_24px_70px_rgba(17,24,39,0.10)] sm:h-[340px] lg:h-[390px]">
              <div className="absolute left-5 top-5 z-10 rounded-full border border-[#E5E7EB] bg-white/80 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#ED7606] backdrop-blur">
                TEAO Technical Note
              </div>
              <div className="absolute inset-x-6 bottom-5 h-14 rounded-full bg-[#111827]/10 blur-2xl" />
              <SafeImage
                src={heroImage}
                alt={article.title}
                fill
                className="scale-[1.42] object-contain p-0 transition-transform duration-500 sm:scale-[1.55]"
                priority
                sizes="(max-width: 860px) 100vw, 860px"
              />
              <div className="absolute right-5 bottom-5 z-10 hidden flex-wrap justify-end gap-2 sm:flex">
                {["Rotary damping", "Soft close", "Torque control"].map((label) => (
                  <span key={label} className="rounded-full border border-white/70 bg-white/78 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.10em] text-[#374151] shadow-sm backdrop-blur">
                    {label}
                  </span>
                ))}
              </div>
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#ED7606]/30 to-transparent" />
            </div>
          )}

            {/* Key Takeaways (GEO optimized) */}
            {takeaways.length > 0 && (
              <div className="mb-8 rounded-2xl border border-[#FED7AA] bg-gradient-to-br from-[#FFFAF5] to-[#FFF1E3] p-5 shadow-[0_14px_40px_rgba(237,118,6,0.08)] sm:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ED7606" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#ED7606]">Key Takeaways</span>
                </div>
                <ul className="space-y-1.5">
                  {takeaways.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#374151] leading-relaxed">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#ED7606] shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {/* Content Body */}
          <div
            className="news-article-body mt-10 rounded-[24px] border border-[#E5E7EB] bg-white px-5 py-7 shadow-[0_22px_64px_rgba(17,24,39,0.06)] prose prose-lg max-w-none text-[#333333] leading-relaxed sm:px-8 sm:py-9 lg:px-10
              prose-headings:text-[#111827] prose-headings:font-extrabold prose-headings:tracking-[-0.02em]
              prose-h2:text-[28px] prose-h2:mt-12 prose-h2:mb-5
              prose-h3:text-[22px] prose-h3:mt-8 prose-h3:mb-4
              prose-p:leading-[1.78] prose-p:my-4
              prose-a:text-[#ED7606] prose-a:no-underline hover:prose-a:underline prose-a:font-medium
              prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8 prose-img:mx-auto
              prose-blockquote:border-l-4 prose-blockquote:border-[#ED7606] prose-blockquote:bg-[#FFF7ED] prose-blockquote:py-4 prose-blockquote:px-5 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-[#374151]
              prose-code:bg-[#F3F4F6] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[#ED7606] prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-[#111827] prose-pre:text-[#E5E7EB] prose-pre:rounded-xl prose-pre:shadow-lg
              prose-table:rounded-xl prose-table:overflow-hidden prose-table:shadow-sm
              prose-th:bg-[#F8F9FA] prose-th:px-4 prose-th:py-2.5 prose-th:text-xs prose-th:font-bold prose-th:text-[#374151] prose-th:uppercase prose-th:tracking-[0.06em]
              prose-td:px-4 prose-td:py-2.5 prose-td:text-sm prose-td:text-[#374151] prose-td:border-b prose-td:border-[#F3F4F6]
              prose-li:text-[#374151] prose-li:marker:text-[#ED7606]
              prose-strong:text-[#111827] prose-strong:font-bold
              prose-hr:border-[#E5E7EB] prose-hr:my-10
            "
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Share Buttons */}
          <div className="mt-12 pt-8 border-t border-[#E5E7EB]">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <ShareButtons title={article.seoTitle || article.title} summary={article.summary} />
              <Link
                href="/news"
                className="text-sm font-medium text-[#6B7280] hover:text-[#ED7606] transition-colors"
              >
                ← Back to News
              </Link>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-12 pt-8 border-t border-[#E5E7EB]">
              <h2 className="text-xl font-extrabold tracking-[-0.02em] text-[#111827] mb-5">
                Related Products
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedProducts.map((p) => (
                  <Link
                    key={p.slug}
                    href={getProductUrl({ slug: p.slug, category: p.category })}
                    className="group flex items-center gap-3 p-3 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#ED7606]/30 hover:shadow-md transition-all duration-300"
                  >
                    <div className="relative w-12 h-12 rounded-lg bg-[#F8F9FA] overflow-hidden shrink-0">
                      <SafeImage
                        src={p.image || "/images/products/gear-damper/GearDamperSingle.webp"}
                        alt={p.name}
                        fill
                        className="object-contain p-1.5"
                        sizes="48px"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold text-[#9CA3AF] uppercase">{p.model}</div>
                      <div className="text-xs font-medium text-[#111827] truncate group-hover:text-[#ED7606] transition-colors">
                        {p.name}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Next Article */}
          {nextArticle && (
            <div className="mt-12 pt-8 border-t border-[#E5E7EB]">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF]">Next Article</span>
              <Link
                href={`/news/${nextArticle.slug}.html`}
                className="mt-1 block text-lg font-extrabold text-[#111827] hover:text-[#ED7606] transition-colors"
              >
                {nextArticle.title} →
              </Link>
            </div>
          )}
        </div>
      </article>
    </>
  );
}

// Extract up to 5 key takeaways from summary or content
function extractTakeaways(content: string, summary: string): string[] {
  // Split summary into sentences
  const sentences = summary
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15);

  if (sentences.length >= 3) return sentences.slice(0, 5);

  // Fallback: extract first few non-heading, non-empty paragraphs from content
  const text = content.replace(/<[^>]+>/g, "")
    .split(/[.!?\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  return text.slice(0, Math.min(5, Math.max(3, text.length)));
}

// Extract Q&A pairs from FAQ content (looks for H2/H3 headings followed by paragraphs)
function extractFaqQuestions(content: string): { q: string; a: string }[] {
  const questions: { q: string; a: string }[] = [];
  // Simple regex to extract h2/h3 + following p content
  const regex = /<(?:h2|h3)[^>]*>(.*?)<\/(?:h2|h3)>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const q = match[1].replace(/<[^>]+>/g, "").trim();
    const a = match[2].replace(/<[^>]+>/g, "").trim();
    if (q && a) questions.push({ q, a });
    if (questions.length >= 10) break;
  }
  return questions;
}
