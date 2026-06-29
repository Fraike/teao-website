import type { Product } from "@/types";

export interface ProductTranslationRow {
  name: string;
  summary: string;
  description: string;
  features: string;
  applications: string;
  seoTitle: string | null;
  seoDescription: string | null;
  tags: string | null;
  translationStatus: string;
}

function parseArray(value: string | null | undefined, fallback: string[]) {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed.map(String) : fallback;
  } catch {
    return fallback;
  }
}

export function applyProductTranslation(product: Product, translation?: ProductTranslationRow | null): Product {
  if (!translation || translation.translationStatus !== "translated") return product;
  return {
    ...product,
    name: translation.name || product.name,
    summary: translation.summary || product.summary,
    description: translation.description || product.description,
    features: parseArray(translation.features, product.features),
    applications: parseArray(translation.applications, product.applications),
    seo_title: translation.seoTitle || product.seo_title,
    seo_description: translation.seoDescription || product.seo_description,
    tags: parseArray(translation.tags, product.tags || []),
  };
}
