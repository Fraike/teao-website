import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { news } from "@/db/schema";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";

export async function NewsSection() {
  const rows = await db
    .select()
    .from(news)
    .orderBy(desc(news.publishedAt))
    .limit(3)
    .all();
  const articles = rows.filter((n) => Boolean(n.isPublished));

  return (
    <section className="section bg-[#FAF9F6]" id="news">
      <div className="shell">
        <Reveal>
          <SectionHead
            eyebrow="News"
            title="Manufacturing notes and engineering updates."
            description="Practical updates on damper selection, process capability and quality control for purchasing and engineering teams."
          />
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((item, i) => (
            <Reveal key={item.title} delay={i === 0 ? undefined : (Math.min(i, 2) as 1 | 2)}>
              <article className="relative min-h-[180px] lg:min-h-[240px] p-5 lg:p-6 flex flex-col justify-between rounded-xl border border-[#E5E5E5] bg-white hover:-translate-y-1.5 hover:shadow-[0_24px_56px_rgba(237,118,6,0.06)] transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ED7606] to-[#ED7606]/30" />
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FFF1E3] text-[#ED7606] text-[10px] font-black uppercase tracking-[0.12em]">
                    {item.category}
                  </span>
                  <h3 className="mt-5 lg:mt-7 text-xl lg:text-2xl leading-[1.10] tracking-[-0.03em] font-extrabold text-[#111827]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[#6B7280] text-sm leading-relaxed">{item.summary}</p>
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
