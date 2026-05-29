import { NextResponse } from "next/server";
import { and, desc, eq, like, or } from "drizzle-orm";
import { db } from "@/db";
import { news, products } from "@/db/schema";
import { getProductUrl } from "@/lib/products";

const LIMIT_PER_GROUP = 6;

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function makeExcerpt(value: string, max = 140) {
  const text = stripHtml(value);
  return text.length > max ? `${text.slice(0, max).trim()}...` : text;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json({ products: [], news: [], total: 0 });
  }

  const term = `%${q}%`;

  const productRows = await db
    .select({
      slug: products.slug,
      model: products.model,
      name: products.name,
      category: products.category,
      summary: products.summary,
      description: products.description,
      image: products.image,
    })
    .from(products)
    .where(
      and(
        eq(products.isActive, 1),
        or(
          like(products.model, term),
          like(products.name, term),
          like(products.summary, term),
          like(products.description, term),
          like(products.tags, term),
        ),
      ),
    )
    .limit(LIMIT_PER_GROUP)
    .all();

  const newsRows = await db
    .select({
      slug: news.slug,
      title: news.title,
      summary: news.summary,
      content: news.content,
      image: news.image,
      category: news.category,
      publishedAt: news.publishedAt,
    })
    .from(news)
    .where(
      and(
        eq(news.isPublished, 1),
        or(
          like(news.title, term),
          like(news.summary, term),
          like(news.keywords, term),
          like(news.content, term),
        ),
      ),
    )
    .orderBy(desc(news.publishedAt))
    .limit(LIMIT_PER_GROUP)
    .all();

  const productResults = productRows.map((product) => ({
    type: "product" as const,
    title: `${product.model} - ${product.name}`,
    label: product.model,
    excerpt: makeExcerpt(product.summary || product.description),
    image: product.image,
    url: getProductUrl(product),
  }));

  const newsResults = newsRows.map((article) => ({
    type: "news" as const,
    title: article.title,
    label: article.category,
    excerpt: makeExcerpt(article.summary || article.content),
    image: article.image,
    url: `/news/${article.slug}.html`,
    publishedAt: article.publishedAt,
  }));

  return NextResponse.json({
    products: productResults,
    news: newsResults,
    total: productResults.length + newsResults.length,
  });
}
