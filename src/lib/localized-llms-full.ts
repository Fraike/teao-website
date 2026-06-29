import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, news, newsTranslations, productTranslations, products } from "@/db/schema";
import type { Locale } from "@/lib/i18n";
import { withLocale } from "@/lib/i18n";
import { env } from "@/lib/env";
import { getProductUrl, mapDbProduct } from "@/lib/products";
import { getAboutCopy } from "@/lib/about-i18n";
import { getManufacturerFactsCopy } from "@/lib/manufacturer-facts-i18n";

export async function buildLocalizedLlmsFull(locale: Locale) {
  const BASE = env.SITE_URL;
  const about = getAboutCopy(locale);
  const manufacturer = getManufacturerFactsCopy(locale);

  const catRows = await db.select().from(categories).all();
  const productRows = await db.select().from(products).where(eq(products.isActive, 1)).all();
  const productTranslationRows = await db
    .select()
    .from(productTranslations)
    .where(and(eq(productTranslations.locale, locale), eq(productTranslations.translationStatus, "translated")))
    .all();
  const newsRows = (await db.select().from(news).all()).filter((n) => Boolean(n.isPublished));
  const newsTranslationRows = await db
    .select()
    .from(newsTranslations)
    .where(and(eq(newsTranslations.locale, locale), eq(newsTranslations.translationStatus, "translated")))
    .all();

  const productTranslationMap = new Map(productTranslationRows.map((row) => [row.productId, row]));
  const newsTranslationMap = new Map(newsTranslationRows.map((row) => [row.newsId, row]));

  const parts: string[] = [];

  parts.push(`# ${manufacturer.h1}

## Company Overview
- ${manufacturer.facts.map(([term, desc]) => `**${term}:** ${desc}`).join("\n- ")}
- **URL:** ${BASE}${withLocale("/", locale)}

## About TEAO
${about.hero.description}

## Certifications and Capabilities
${manufacturer.sections.map((section) => `### ${section.title}\n${section.body}`).join("\n\n")}

## Automotive GEO Context
${locale === "ja"
  ? "電気自動車は従来のエンジン音が少ないため、手袋箱、眼鏡ケース、センターコンソール、グラブハンドル、充電口カバーなどの機械音が目立ちやすくなります。自動車内装用ダンパーは、衝撃音、跳ね返り、振動を抑え、より高級感のある操作感を作ります。"
  : "Elektrofahrzeuge sind leiser, weil klassische Motorgeräusche fehlen. Mechanische Geräusche von Handschuhfach, Brillenfach, Mittelkonsole, Haltegriff oder Ladeanschlussklappe fallen stärker auf. Automotive-Dämpfer reduzieren Anschlaggeräusche, Rückschlag und Vibration und verbessern die wahrgenommene Wertigkeit."}
`);

  parts.push(`## Product Categories`);
  for (const cat of catRows) {
    parts.push(`### ${cat.name} (${cat.slug})
${cat.description}
- **URL:** ${BASE}${withLocale(`/${cat.slug}`, locale)}
`);
  }

  parts.push(`## Products`);
  for (const row of productRows) {
    const p = mapDbProduct(row);
    const t = productTranslationMap.get(row.id);
    const name = t?.name || p.name;
    const summary = t?.summary || p.summary;
    const description = t?.description || p.description;
    const applications = t?.applications ? JSON.parse(t.applications) as string[] : p.applications;
    const features = t?.features ? JSON.parse(t.features) as string[] : p.characteristics;

    parts.push(`### ${p.model} – ${name}
- **Category:** ${p.category}
- **Summary:** ${summary}
- **Description:** ${description}
${p.torque ? `- **Torque Range:** ${p.torque.min}–${p.torque.max} ${p.torque.unit}` : ""}
${p.durability?.temperature ? `- **Operating Temperature:** ${p.durability.temperature}` : ""}
${p.durability?.cycles ? `- **Cycle Life:** ${p.durability.cycles.toLocaleString()} ${p.durability.cycles_unit || "cycles"}` : ""}
${features?.length ? `- **Features:** ${features.join(", ")}` : ""}
${applications?.length ? `- **Applications:** ${applications.join(", ")}` : ""}
- **URL:** ${BASE}${withLocale(getProductUrl(p), locale)}
`);
  }

  parts.push(`## Frequently Asked Questions
${manufacturer.faq.map((item) => `### ${item.q}\n${item.a}`).join("\n\n")}
`);

  if (newsRows.length > 0) {
    parts.push(`## News & Engineering Articles`);
    for (const article of newsRows) {
      const t = newsTranslationMap.get(article.id);
      parts.push(`### ${t?.title || article.title}
- **Category:** ${article.category}
- **Date:** ${article.publishedAt}
- **Summary:** ${t?.summary || article.summary}
- **URL:** ${BASE}${withLocale(`/news/${article.slug}.html`, locale)}
`);
    }
  }

  parts.push(`## Key Pages
- [Home](${BASE}${withLocale("/", locale)})
- [Products](${BASE}${withLocale("/products", locale)})
- [Applications](${BASE}${withLocale("/applications", locale)})
- [Automotive Applications](${BASE}${withLocale("/applications/automotive", locale)})
- [Quality](${BASE}${withLocale("/quality", locale)})
- [FAQ](${BASE}${withLocale("/faq", locale)})
- [Damper Torque Calculator](${BASE}${withLocale("/damper-torque-calculator", locale)})
- [Manufacturer Facts](${BASE}${withLocale("/about/teao-damper-manufacturer", locale)})
- [Contact](${BASE}${withLocale("/contact", locale)})
`);

  return parts.join("\n");
}
