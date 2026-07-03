import type { Product, NewsItem } from "@/types";
import { SITE_CONFIG } from "@/lib/constants";
import { env } from "@/lib/env";

const BASE = env.SITE_URL;

// ---- Helpers ----

function toUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${BASE}${path}`;
}

function propertyValue(name: string, value?: string | number | null) {
  if (value === undefined || value === null || value === "") return null;
  return {
    "@type": "PropertyValue",
    name,
    value: String(value),
  };
}

// ---- JSON-LD React Component ----

export function JsonLdScript({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ---- Schema Builders ----

export function organizationSchema() {
  const sameAs = [
    env.LINKEDIN_URL,
    env.YOUTUBE_URL,
    env.FACEBOOK_URL,
    env.INSTAGRAM_URL,
    env.X_URL,
    env.ALIBABA_URL,
  ].filter((url) => url && url !== "#");

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.fullName,
    alternateName: SITE_CONFIG.name,
    url: BASE,
    foundingDate: String(SITE_CONFIG.founded),
    description:
      "Professional manufacturer of gear dampers, rotary dampers, axial dampers, barrel dampers, glove box dampers, latches and motion control components with 20+ years of experience. IATF 16949 certified.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "No. 2, Huangjiang North Third Street, Huangjiang Town",
      addressLocality: "Dongguan City",
      addressRegion: "Guangdong Province",
      postalCode: "523750",
      addressCountry: "CN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: SITE_CONFIG.email,
      contactType: "sales",
      availableLanguage: ["English", "Chinese"],
    },
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      minValue: 200,
    },
    ...(sameAs.length > 0 && { sameAs }),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: BASE,
    description:
      "IATF 16949 certified manufacturer of gear dampers, rotary dampers, axial dampers, barrel dampers, glove box dampers, latches and custom motion control components.",
    keywords:
      "gear damper, rotary damper, axial damper, barrel damper, glove box damper, automotive interior damper, motion control damper, TEAO",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export interface BreadcrumbItem {
  name: string;
  url?: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  };
}

export function productSchema(product: Product, categoryName?: string) {
  const galleryImages =
    product.images.length > 0
      ? product.images
      : [{ url: product.image, alt: product.name }];

  const torqueProps =
    product.torque
      ? [
          {
            "@type": "PropertyValue",
            name: "Torque Range",
            value: `${product.torque.min}–${product.torque.max} ${product.torque.unit}`,
          },
        ]
      : [];
  const productProperties = [
    ...torqueProps,
    propertyValue("Damper Type", categoryName),
    propertyValue("Damping Direction", product.buffer_direction),
    propertyValue("Mounting Method", product.assembly_method),
    propertyValue("Force Range", product.force_range),
    propertyValue("Hard Torque", product.hard_torque),
    propertyValue("Hard Force", product.hard_force),
    propertyValue("Sound Type", product.sound_type),
    propertyValue("Temperature Range", product.durability?.temperature ?? product.durability?.temperature_value),
    propertyValue(
      "Cycle Life",
      product.durability?.cycles
        ? `${product.durability.cycles}${product.durability.cycles_unit ? ` ${product.durability.cycles_unit}` : " cycles"}`
        : null,
    ),
    ...(product.applications || []).slice(0, 6).map((application) => propertyValue("Application", application)),
    ...(product.characteristics || []).slice(0, 6).map((characteristic) => propertyValue("Characteristic", characteristic)),
    ...(product.materials || []).slice(0, 6).map((material) => propertyValue(`Material: ${material.part}`, material.material)),
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.summary,
    sku: product.model,
    image: galleryImages.map((img) => toUrl(img.url)),
    brand: {
      "@type": "Brand",
      name: SITE_CONFIG.name,
    },
    manufacturer: {
      "@type": "Organization",
      name: SITE_CONFIG.fullName,
      url: BASE,
    },
    ...(productProperties.length > 0 && { additionalProperty: productProperties }),
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      businessFunction: "https://purl.org/goodrelations/v1#Sell",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: SITE_CONFIG.name,
      },
    },
    ...(categoryName && { category: categoryName }),
    ...(product.tags?.length && {
      keywords: product.tags,
      about: product.tags.map((tag) => ({ "@type": "Thing", name: tag })),
    }),
  };
}

export function faqPageSchema(questions: readonly { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function newsArticleSchema(article: NewsItem & { keywords?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary,
    image: article.image || undefined,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    keywords: article.keywords?.split(",").map((k: string) => k.trim()) || undefined,
    articleBody: article.content?.replace(/<[^>]+>/g, "").slice(0, 5000) || undefined,
    about: article.keywords?.split(",").map((k: string) => ({ "@type": "Thing", name: k.trim() })) || undefined,
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: BASE,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": toUrl(`/news/${article.slug}.html`),
    },
    isAccessibleForFree: true,
  };
}

export function speakableSchema({ title, summary }: { title: string; summary: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".article-title", ".article-summary"],
    },
    name: title,
    description: summary,
    url: undefined, // Will be inferred by search engines
  };
}

export function collectionPageSchema(
  name: string,
  description: string,
  items: { name: string; url: string }[],
  options?: {
    url?: string;
    keywords?: string[];
    about?: string[];
  },
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: toUrl(options?.url || items[0]?.url?.split("/").slice(0, -1).join("/") || "/"),
    ...(options?.keywords?.length && { keywords: options.keywords }),
    ...(options?.about?.length && {
      about: options.about.map((item) => ({ "@type": "Thing", name: item })),
    }),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Thing",
          name: item.name,
          url: toUrl(item.url),
        },
      })),
    },
  };
}

export function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Torque Converter",
    applicationCategory: "EngineeringApplication",
    operatingSystem: "Web",
    description:
      "Free online torque unit conversion tool supporting N·m, kgf·cm, gf·cm, mN·m, lbf·in, ozf·in and more. Designed for damper specification and motion control engineering.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    url: toUrl("/torque-converter"),
  };
}
