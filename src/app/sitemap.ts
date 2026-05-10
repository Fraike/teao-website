import type { MetadataRoute } from "next";
import { db } from "@/db";
import { products, news } from "@/db/schema";

export default function sitemap(): MetadataRoute.Sitemap {
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

  const productRoutes = db
    .select({ slug: products.slug })
    .from(products)
    .all()
    .map((p) => ({
      url: `${baseUrl}/products/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  const newsRoutes = db
    .select({ slug: news.slug })
    .from(news)
    .all()
    .map((n) => ({
      url: `${baseUrl}/news/${n.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [...staticRoutes, ...productRoutes, ...newsRoutes];
}
