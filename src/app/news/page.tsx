import type { Metadata } from "next";
import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { news } from "@/db/schema";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";
import { JsonLdScript, collectionPageSchema } from "@/lib/structured-data";
import { getReadingTime, formatReadingTime } from "@/lib/reading-time";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "News | TEAO Damper Engineering Updates & Company News",
  description:
    "Stay updated with TEAO's latest company news, damper engineering insights, quality initiatives and technical resources for automotive and industrial applications.",
  keywords: [
    "damper manufacturer news",
    "TEAO company updates",
    "damper engineering",
    "automotive damper news",
  ],
  openGraph: {
    title: "News | TEAO Damper Engineering Updates & Company News",
    description:
      "Company news, engineering insights and technical resources from TEAO damper manufacturer.",
    images: [{ url: "/images/logo-color.webp", width: 512, height: 512 }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "News | TEAO Damper Engineering & Company Updates",
    description:
      "Company news and engineering insights from TEAO damper manufacturer.",
    images: ["/images/logo-color.webp"],
  },
};

const TYPE_LABELS: Record<string, string> = {
  article: "Article",
  guide: "Guide",
  faq: "FAQ",
  news: "News",
};

export default async function NewsPage() {
  const rows = await db
    .select()
    .from(news)
    .orderBy(desc(news.publishedAt))
    .all();
  const articles = rows.filter((n) => Boolean(n.isPublished));

  const newsItems = articles.map((a) => ({
    name: a.title,
    url: `/news/${a.slug}.html`,
  }));
  const newsJsonLd = collectionPageSchema(
    "News",
    "TEAO company news, damper engineering insights and technical resources.",
    newsItems,
  );

  return (
    <>
      <JsonLdScript data={newsJsonLd} />
      <section className="section pt-28 lg:pt-32">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow="News"
              title="Company news and engineering updates."
              description="Stay updated with TEAO's latest developments, quality initiatives and technical resources."
            />
          </Reveal>

          {articles.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.map((item, i) => {
                const readTime = getReadingTime(item.content);
                const readTimeLabel = formatReadingTime(readTime);
                const typeLabel = item.articleType ? TYPE_LABELS[item.articleType] : null;

                return (
                  <Reveal key={item.slug} delay={(Math.min(i, 2) + 1) as 1 | 2 | 3}>
                    <Link
                      href={`/news/${item.slug}.html`}
                      className="group flex flex-col rounded-2xl border border-[#E5E5E5] bg-white overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_24px_52px_rgba(21,25,30,.1)] transition-all duration-300"
                    >
                      {/* Thumbnail */}
                      {item.image && (
                        <div className="relative w-full aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#F8F9FA] to-[#EEF0F3]">
                          <SafeImage
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                      )}

                      <div className="flex flex-col flex-1 p-5 sm:p-6">
                        {/* Meta */}
                        <div className="flex items-center gap-2 flex-wrap mb-3">
                          <span className="text-[#ED7606] text-[10px] font-bold uppercase tracking-[0.12em]">
                            {item.category}
                          </span>
                          {typeLabel && typeLabel !== "Article" && (
                            <span className="px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[9px] font-medium uppercase tracking-[0.06em] text-[#6B7280]">
                              {typeLabel}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-lg leading-[1.2] tracking-[-0.02em] font-extrabold text-[#171717] group-hover:text-[#ED7606] transition-colors line-clamp-2">
                          {item.title}
                        </h3>

                        {/* Summary */}
                        <p className="mt-2 text-sm text-[#6B7280] leading-relaxed line-clamp-2">
                          {item.summary}
                        </p>

                        {/* Footer */}
                        <div className="mt-auto pt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
                            <span>{item.publishedAt}</span>
                            <span>·</span>
                            <span>{readTimeLabel}</span>
                          </div>
                          <span className="text-[#ED7606] text-sm font-bold group-hover:underline">
                            Read more →
                          </span>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          ) : (
            <p className="text-center py-16 text-[#9CA3AF] text-sm">No articles yet.</p>
          )}
        </div>
      </section>
    </>
  );
}
