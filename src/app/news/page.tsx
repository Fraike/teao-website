import type { Metadata } from "next";
import Link from "next/link";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "News",
  description: "TEAO company news, quality updates and engineering insights.",
};

const NEWS_ALL = [
  { slug: "teao-expands-capacity", category: "Company", title: "TEAO expands automated damper assembly capacity.", summary: "Improved automation supports stable quality and large-volume delivery.", date: "2026-03-15" },
  { slug: "automotive-quality-systems", category: "Quality", title: "Automotive quality systems for damper production.", summary: "IATF-oriented process control helps ensure repeatable torque performance.", date: "2026-02-20" },
  { slug: "torque-requirements-guide", category: "Engineering", title: "How to define torque requirements for soft motion.", summary: "Key parameters for faster damper selection and technical quotation.", date: "2026-01-10" },
];

export default function NewsPage() {
  return (
    <>
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
            {NEWS_ALL.map((item, i) => (
              <Reveal key={item.slug} delay={(Math.min(i, 2) + 1) as 1 | 2 | 3}>
                <Link
                  href={`/news/${item.slug}`}
                  className="group min-h-[260px] p-6 flex flex-col justify-between rounded-xl border border-[#E5E5E5] bg-white hover:-translate-y-1.5 hover:shadow-[0_24px_52px_rgba(21,25,30,.1)] transition-all duration-300"
                >
                  <div>
                    <time className="text-[#ED7606] text-xs font-black uppercase tracking-[0.14em]">
                      {item.category} — {item.date}
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
        </div>
      </section>
    </>
  );
}
