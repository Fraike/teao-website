import type { Metadata } from "next";
import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { news } from "@/db/schema";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";
import { JsonLdScript, collectionPageSchema } from "@/lib/structured-data";

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
  },
  twitter: {
    card: "summary",
    title: "News | TEAO Damper Engineering & Company Updates",
    description:
      "Company news and engineering insights from TEAO damper manufacturer.",
    images: ["/images/logo-color.webp"],
  },
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
    url: `/news/${a.slug}`,
  }));
  const newsJsonLd = collectionPageSchema(
    "News",
    "TEAO company news, damper engineering insights and technical resources.",
    newsItems,
  );

  return (
    <>
      <JsonLdScript data={newsJsonLd} />
      <section className="section pt-32">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow="News"
              title="Company news and engineering updates."
              description="Stay updated with TEAO's latest developments, quality initiatives and technical resources."
            />
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((item, i) => (
              <Reveal key={item.slug} delay={(Math.min(i, 2) + 1) as 1 | 2 | 3}>
                <Link
                  href={`/news/${item.slug}`}
                  className="group min-h-[260px] p-6 flex flex-col justify-between rounded-xl border border-[#E5E5E5] bg-white hover:-translate-y-1.5 hover:shadow-[0_24px_52px_rgba(21,25,30,.1)] transition-all duration-300"
                >
                  <div>
                    <time className="text-[#ED7606] text-xs font-black uppercase tracking-[0.14em]">
                      {item.category} — {item.publishedAt}
                    </time>
                    <h3 className="mt-7 text-2xl leading-[1.08] tracking-[-0.03em] font-extrabold text-[#171717]">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 text-[#666666] text-sm">{item.summary}</p>
                  </div>
                  <span className="mt-6 text-[#ED7606] text-sm font-extrabold group-hover:underline">
                    Read more →
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          {articles.length === 0 && (
            <p className="text-center py-16 text-[#9CA3AF] text-sm">No articles yet.</p>
          )}
        </div>
      </section>
    </>
  );
}
