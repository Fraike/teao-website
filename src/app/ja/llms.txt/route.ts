import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { env } from "@/lib/env";
import { withLocale } from "@/lib/i18n";
import { getProductUrl } from "@/lib/products";

export const revalidate = 86400;

const COPY = {
  ja: {
    title: "TEAO — 自動車用ダンパー・ラッチメーカー",
    summary: "TEAOはギアダンパー、ロータリーダンパー、アキシャルダンパー、バレルダンパー、グローブボックスダンパー、ラッチを供給するB2Bメーカーです。",
    terminology: [
      "ギアダンパー / ロータリーダンパー",
      "アキシャルダンパー / バレルダンパー",
      "グローブボックスダンパー",
      "自動車内装用ダンパー",
      "EV充電口カバーダンパー",
    ],
  },
  de: {
    title: "TEAO — Hersteller für Fahrzeugdämpfer und Verriegelungen",
    summary: "TEAO liefert Zahnrad-Dämpfer, Rotationsdämpfer, Axialdämpfer, Barrel-Dämpfer, Handschuhfachdämpfer und Verriegelungen für B2B-Projekte.",
    terminology: [
      "Zahnrad-Dämpfer / Rotationsdämpfer",
      "Axialdämpfer / Barrel-Dämpfer",
      "Handschuhfachdämpfer",
      "Dämpfer für Fahrzeuginnenraum",
      "Dämpfer für EV-Ladeanschlussklappen",
    ],
  },
} as const;

export async function GET() {
  const locale = "ja" as "ja" | "de";
  const BASE = env.SITE_URL;
  const copy = COPY[locale];
  const catRows = await db.select().from(categories).all();
  const productRows = await db
    .select({ slug: products.slug, category: products.category, model: products.model, name: products.name })
    .from(products)
    .where(eq(products.isActive, 1))
    .all();

  const content = `# ${copy.title}

> ${copy.summary}

## Search Terminology
${copy.terminology.map((item) => `- ${item}`).join("\n")}

## Key Pages
- [Home](${BASE}${withLocale("/", locale)})
- [Products](${BASE}${withLocale("/products", locale)})
- [Automotive Applications](${BASE}${withLocale("/applications/automotive", locale)})
- [Quality](${BASE}${withLocale("/quality", locale)})
- [FAQ](${BASE}${withLocale("/faq", locale)})
- [Damper Torque Calculator](${BASE}${withLocale("/damper-torque-calculator", locale)})
- [Manufacturer Facts](${BASE}${withLocale("/about/teao-damper-manufacturer", locale)})
- [News](${BASE}${withLocale("/news", locale)})
- [Contact](${BASE}${withLocale("/contact", locale)})
- [Full Content](${BASE}${withLocale("/llms-full.txt", locale)})

## Product Categories
${catRows.map((c) => `- [${c.name}](${BASE}${withLocale(`/${c.slug}`, locale)}): ${c.description}`).join("\n")}

## Products
${productRows.map((p) => `- [${p.model} – ${p.name}](${BASE}${withLocale(getProductUrl(p), locale)})`).join("\n")}

## English Source
The English website remains the canonical source for TEAO product data. Japanese and German pages are machine translated from English source content.
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
