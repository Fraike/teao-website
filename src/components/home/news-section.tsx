import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { news } from "@/db/schema";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";

export function NewsSection() {
  const articles = db
    .select()
    .from(news)
    .orderBy(desc(news.publishedAt))
    .limit(3)
    .all()
    .filter((n) => Boolean(n.isPublished));

  return (
    <section className="section" id="news">
      <div className="shell">
        <Reveal>
          <SectionHead
            eyebrow="News"
            title="Manufacturing notes and engineering updates."
            description="Practical updates on damper selection, process capability and quality control for purchasing and engineering teams."
          />
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {articles.map((item, i) => (
            <Reveal key={item.title} delay={i === 0 ? undefined : (Math.min(i, 2) as 1 | 2)}>
              <article className="min-h-[180px] lg:min-h-[240px] p-4 lg:p-6 flex flex-col justify-between rounded-lg border border-[#E5E5E5] bg-white hover:-translate-y-1.5 hover:shadow-[0_24px_52px_rgba(21,25,30,.1)] transition-all duration-300">
                <div>
                  <time className="text-[#ED7606] text-xs font-black uppercase tracking-[0.14em]">
                    {item.category}
                  </time>
                  <h3 className="mt-5 lg:mt-7 text-xl lg:text-2xl leading-[1.08] tracking-[-0.03em] font-extrabold text-[#171717]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[#666666] text-xs lg:text-sm">{item.summary}</p>
                </div>
                <Link href="/news" className="mt-4 lg:mt-6 text-[#ED7606] text-sm font-extrabold hover:underline">
                  Read more →
                </Link>
              </article>
            </Reveal>
          ))}
          {articles.length === 0 && (
            <p className="col-span-full text-center py-8 text-[#9CA3AF] text-sm">No articles yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
