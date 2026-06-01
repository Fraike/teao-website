import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { env } from "@/lib/env";
import { AUTOMOTIVE_SEO_KEYWORDS, CATEGORY_SEO, GLOBAL_SEO_KEYWORDS, getCategorySeo } from "@/lib/seo-keywords";
import { getProductUrl } from "@/lib/products";

export const revalidate = 86400;

export async function GET() {
  const BASE = env.SITE_URL;

  const catRows = await db.select().from(categories).all();
  const productRows = await db
    .select({ slug: products.slug, category: products.category, model: products.model, name: products.name })
    .from(products)
    .all();

  const categoryLinks = catRows
    .map((c) => {
      const seo = getCategorySeo(c.slug, c.name, c.description);
      return `- [${c.name}](${BASE}/${c.slug}): ${seo.llmsSummary}`;
    })
    .join("\n");

  const productLinks = productRows
    .map(
      (p) =>
        `- [${p.model} – ${p.name}](${BASE}${getProductUrl(p)})`
    )
    .join("\n");

  const content = `# TEAO — Automotive Damper & Latch Manufacturer

> IATF 16949 certified manufacturer of gear dampers, axial dampers, glove box dampers, latches and custom motion control components. 20+ years of damper expertise, 100% torque testing, global B2B supply.

## Search Terminology
- Gear damper: also searched as rotary damper, plastic rotary damper, small rotary damper, one way damper.
- Axial damper: also searched as barrel damper, linear motion damper, soft close axial damper.
- Glove box damper: also searched as automotive glove box damper, soft open glove box damper, glove box shock absorber, rotary glove box damper.
- Automotive applications: ${AUTOMOTIVE_SEO_KEYWORDS.join(", ")}.
- Procurement searches: ${GLOBAL_SEO_KEYWORDS.join(", ")}.

## Products by Category
${categoryLinks}

## All Products
${productLinks}

## Key Pages
- [Home](${BASE}/): Company overview and capabilities
- [Products](${BASE}/products): Full product catalog with technical specifications
- [Applications](${BASE}/applications): Industry use cases — automotive, sanitary, office, industrial
- [Quality](${BASE}/quality): IATF 16949 testing, 100% torque inspection, laboratory capabilities
- [FAQ](${BASE}/faq): Common procurement and technical questions
- [Torque Converter](${BASE}/torque-converter): Free engineering torque unit conversion tool
- [Contact](${BASE}/contact): Send inquiry with drawing and specifications
- [About](${BASE}/about): 20+ years company history, certifications and values
- [News](${BASE}/news): Company updates and engineering insights

## Category Search Focus
${Object.entries(CATEGORY_SEO)
  .map(([, seo]) => `- ${seo.title}: ${seo.keywords.slice(0, 10).join(", ")}`)
  .join("\n")}

## Company Facts
- Name: Dongguan TEAO Electronic Technology Co., Ltd.
- Founded: 2001
- Location: Dongguan City, Guangdong Province, China
- Certifications: IATF 16949, ISO 14001
- Annual Capacity: 80 million units
- Employees: 200+
- Customers: 200+ global B2B accounts across automotive OEM, Tier-1 and industrial sectors

## Optional
- [Sitemap](${BASE}/sitemap.xml): XML sitemap with all URLs
- [Full Content](${BASE}/llms-full.txt): Complete product and company content for AI training
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
