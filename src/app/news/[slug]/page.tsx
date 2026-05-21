import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { news } from "@/db/schema";
import Link from "next/link";
import { JsonLdScript, newsArticleSchema, breadcrumbSchema } from "@/lib/structured-data";

export async function generateStaticParams() {
  const rows = db.select({ slug: news.slug }).from(news).all();
  return rows.map((r) => ({ slug: r.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = db.select().from(news).where(eq(news.slug, slug)).get();
  if (!article) return { title: "Article Not Found" };
  return {
    title: `${article.title} | TEAO News`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: "article",
      images: article.image ? [{ url: article.image, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
      images: article.image ? [article.image] : [],
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = db.select().from(news).where(eq(news.slug, slug)).get();
  if (!article) notFound();

  const articleJsonLd = newsArticleSchema({
    slug: article.slug,
    title: article.title,
    summary: article.summary,
    content: article.content,
    image: article.image,
    category: article.category as "company" | "quality" | "engineering",
    isPublished: Boolean(article.isPublished),
    publishedAt: article.publishedAt,
  });
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "News", url: "/news" },
    { name: article.title },
  ]);

  return (
    <>
      <JsonLdScript data={articleJsonLd} />
      <JsonLdScript data={breadcrumbJsonLd} />
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
              {article.category} — {article.publishedAt}
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
