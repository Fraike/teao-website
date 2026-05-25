import type { MetadataRoute } from "next";
import { db } from "@/db";
import { products, news, categories } from "@/db/schema";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.teao-damper.com";

  const staticRoutes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/applications`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/quality`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/news`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}/torque-converter`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
  ];

  const catRows = await db.select().from(categories).all();
  const categoryRoutes = catRows.map((c) => ({
    url: `${baseUrl}/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8 as const,
  }));

  const productRows = await db
    .select({ slug: products.slug, category: products.category, updatedAt: products.updatedAt })
    .from(products)
    .all();
  const productRoutes = productRows.map((p) => ({
    url: `${baseUrl}/${p.category}/${p.slug}`,
    lastModified: p.updatedAt ?? new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7 as const,
  }));

  const newsRows = await db
    .select({ slug: news.slug, updatedAt: news.updatedAt })
    .from(news)
    .all();
  const newsRoutes = newsRows.map((n) => ({
    url: `${baseUrl}/news/${n.slug}.html`,
    lastModified: n.updatedAt ?? new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6 as const,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...newsRoutes];
}
