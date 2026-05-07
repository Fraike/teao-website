import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

const NEWS_ALL = [
  { slug: "teao-expands-capacity", category: "Company", title: "TEAO expands automated damper assembly capacity.", summary: "Improved automation supports stable quality and large-volume delivery.", date: "2026-03-15", content: "TEAO has completed a significant expansion of its automated damper assembly lines at its Dongguan facility. The new equipment increases annual production capacity to 80 million units while maintaining the consistent torque performance and quality standards that automotive customers require. The investment includes automated torque testing stations integrated into each assembly line, providing 100% inspection capability." },
  { slug: "automotive-quality-systems", category: "Quality", title: "Automotive quality systems for damper production.", summary: "IATF-oriented process control helps ensure repeatable torque performance.", date: "2026-02-20", content: "TEAO's quality management system is structured around IATF 16949 principles, with a focus on process control, measurement system analysis, and production traceability. Each damper design undergoes validation testing across the specified temperature range, and production batches are tracked from raw material through final inspection. This systematic approach supports the quality requirements of global OEM and Tier-1 customers." },
  { slug: "torque-requirements-guide", category: "Engineering", title: "How to define torque requirements for soft motion.", summary: "Key parameters for faster damper selection and technical quotation.", date: "2026-01-10", content: "Defining clear torque requirements is the first step to selecting or designing the right damper for an application. Key parameters include: target torque value and tolerance, damping direction (clockwise, counter-clockwise, or both), operating temperature range, space envelope constraints, mounting configuration, cycle life requirements, and any special environmental conditions. Providing these parameters with your inquiry enables TEAO's engineering team to recommend the most suitable standard platform or propose a custom design." },
];

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = NEWS_ALL.find((n) => n.slug === slug);
  if (!article) return { title: "Article Not Found" };
  return { title: article.title, description: article.summary };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = NEWS_ALL.find((n) => n.slug === slug);
  if (!article) notFound();

  return (
    <>
      <section className="section pt-32">
        <div className="shell max-w-3xl">
          <nav className="text-sm text-[#666666] mb-8">
            <Link href="/" className="hover:text-[#ED7606]">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/news" className="hover:text-[#ED7606]">News</Link>
            <span className="mx-2">/</span>
            <span className="text-[#171717] font-medium">{article.title}</span>
          </nav>

          <article>
            <time className="text-[#ED7606] text-xs font-black uppercase tracking-[0.14em]">
              {article.category} — {article.date}
            </time>
            <h1 className="mt-4 text-[clamp(32px,4vw,48px)] leading-[1.05] tracking-[-0.04em] font-extrabold text-[#171717]">
              {article.title}
            </h1>
            <p className="mt-4 text-lg text-[#666666]">{article.summary}</p>

            <div className="mt-10 prose prose-lg max-w-none text-[#333333] leading-relaxed">
              <p>{article.content}</p>
            </div>

            <div className="mt-12 pt-8 border-t border-[#E5E5E5]">
              <Link href="/news" className="text-[#ED7606] font-extrabold hover:underline">
                ← Back to News
              </Link>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
