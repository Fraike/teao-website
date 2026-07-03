import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { news, newsTranslations } from "@/db/schema";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";
import type { SiteLocale } from "@/lib/i18n-ui";
import { withLocale } from "@/lib/i18n";
import { getHomeCopy } from "@/lib/home-i18n";

export async function NewsSection({ locale = "en" }: { locale?: SiteLocale }) {
  const rows = await db
    .select()
    .from(news)
    .orderBy(desc(news.publishedAt))
    .limit(3)
    .all();
  const published = rows.filter((n) => Boolean(n.isPublished));
  const copy = getHomeCopy(locale).news;
  const articles = await Promise.all(published.map(async (item) => {
    if (locale === "en") return item;
    const translated = await db
      .select()
      .from(newsTranslations)
      .where(and(eq(newsTranslations.newsId, item.id), eq(newsTranslations.locale, locale), eq(newsTranslations.translationStatus, "translated")))
      .get();
    return translated ? { ...item, title: translated.title, summary: translated.summary, slug: item.slug } : item;
  }));

  return (
    <section className="section bg-[#FAF9F6]" id="news">
      <div className="shell">
        <Reveal>
          <SectionHead
            eyebrow={copy.eyebrow}
            title={copy.title}
            description={copy.description}
          />
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {articles.map((item, i) => (
            <Reveal key={item.title} delay={i === 0 ? undefined : (Math.min(i, 2) as 1 | 2)}>
              <Link
                href={withLocale(`/news/${item.slug}.html`, locale)}
                className="group block h-full overflow-hidden rounded-xl border border-[#E5E5E5] bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-[#ED7606]/30 hover:shadow-[0_24px_56px_rgba(237,118,6,0.08)]"
              >
                <article className="flex h-full flex-col">
                  <div className="relative aspect-[16/7] overflow-hidden bg-[#F8F9FA]">
                    <Image
                      src={getNewsCardImage(item)}
                      alt={item.title}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,24,39,0.05)_0%,rgba(17,24,39,0.42)_100%)]" />
                    <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#ED7606] shadow-[0_8px_22px_rgba(17,24,39,0.10)] backdrop-blur">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-3.5 lg:p-4">
                    <div className="flex items-start gap-3">
                      <h3 className="line-clamp-2 flex-1 text-[18px] font-extrabold leading-[1.12] tracking-[-0.03em] text-[#111827] transition-colors group-hover:text-[#ED7606] lg:text-[20px]">
                        {item.title}
                      </h3>
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#E5E7EB] bg-[#FAF9F6] text-[#ED7606] transition-all group-hover:border-[#ED7606] group-hover:bg-[#ED7606] group-hover:text-white">
                        <ArrowUpRight size={15} />
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-[13px] leading-5 text-[#6B7280]">{item.summary}</p>
                    <span className="mt-3 text-sm font-extrabold text-[#ED7606]">
                      {copy.readMore} →
                    </span>
                  </div>
                </article>
              </Link>
            </Reveal>
          ))}
          {articles.length === 0 && (
            <p className="col-span-full text-center py-8 text-[#9CA3AF] text-sm">{copy.empty}</p>
          )}
        </div>
      </div>
    </section>
  );
}

function getNewsCardImage(item: { image: string; title: string; summary: string; slug: string }) {
  if (item.image && item.image !== "#") return item.image;

  const text = `${item.title} ${item.summary} ${item.slug}`.toLowerCase();
  if (text.includes("automotive") || text.includes("interior") || text.includes("ev")) {
    return "/images/news/automotive-interior-damper-map.webp";
  }
  if (text.includes("rotary") || text.includes("gear")) {
    return "/images/news/rotary-damper-internal-structure.webp";
  }
  return "/images/products/gear-damper/GearDamperCategory.webp";
}
