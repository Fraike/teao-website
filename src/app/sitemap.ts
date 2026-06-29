import type { MetadataRoute } from "next";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { products, news, categories } from "@/db/schema";
import { SUPPORTED_LOCALES, withLocale } from "@/lib/i18n";

const STATIC_LAST_MODIFIED = new Date("2026-06-26");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://teao-damper.com";

  const staticRoutes = [
    { url: baseUrl, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "weekly" as const, priority: 1 },
    { url: `${baseUrl}/about`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/about/teao-damper-manufacturer`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/products`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/applications`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/applications/automotive`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/quality`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/faq`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/news`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}/torque-converter`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/damper-torque-calculator`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.6 },
  ];
  const localizedStaticRoutes = SUPPORTED_LOCALES.flatMap((locale) => [
    { url: `${baseUrl}${withLocale("/", locale)}`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}${withLocale("/about", locale)}`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}${withLocale("/products", locale)}`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}${withLocale("/applications", locale)}`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}${withLocale("/news", locale)}`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "weekly" as const, priority: 0.6 },
    { url: `${baseUrl}${withLocale("/quality", locale)}`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}${withLocale("/contact", locale)}`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}${withLocale("/faq", locale)}`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}${withLocale("/torque-converter", locale)}`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}${withLocale("/damper-torque-calculator", locale)}`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}${withLocale("/about/teao-damper-manufacturer", locale)}`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}${withLocale("/privacy-policy", locale)}`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "yearly" as const, priority: 0.2 },
    { url: `${baseUrl}${withLocale("/applications/automotive", locale)}`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.7 },
  ]);

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
    .where(eq(products.isActive, 1))
    .all();
  const productRoutes = productRows.map((p) => ({
    url: `${baseUrl}/${p.category}/${p.slug}`,
    lastModified: p.updatedAt ?? new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7 as const,
  }));
  const localizedProductRoutes = productRows.flatMap((p) =>
    SUPPORTED_LOCALES.map((locale) => ({
      url: `${baseUrl}${withLocale(`/${p.category}/${p.slug}`, locale)}`,
      lastModified: p.updatedAt ?? STATIC_LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.5 as const,
    })),
  );

  const newsRows = await db
    .select({ slug: news.slug, updatedAt: news.updatedAt })
    .from(news)
    .where(eq(news.isPublished, 1))
    .all();
  const newsRoutes = newsRows.map((n) => ({
    url: `${baseUrl}/news/${n.slug}.html`,
    lastModified: n.updatedAt ?? new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6 as const,
  }));
  const localizedNewsRoutes = newsRows.flatMap((n) =>
    SUPPORTED_LOCALES.map((locale) => ({
      url: `${baseUrl}${withLocale(`/news/${n.slug}.html`, locale)}`,
      lastModified: n.updatedAt ?? STATIC_LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.4 as const,
    })),
  );

  return [
    ...staticRoutes,
    ...localizedStaticRoutes,
    ...categoryRoutes,
    ...productRoutes,
    ...localizedProductRoutes,
    ...newsRoutes,
    ...localizedNewsRoutes,
  ];
}
