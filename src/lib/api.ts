import type { Product, CategoryInfo, Partner, NewsItem } from "@/types";
import { env } from "./env";

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${env.API_URL}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(env.API_KEY ? { "X-API-Key": env.API_KEY } : {}),
      ...options?.headers,
    },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json();
}

// --- Products ---
export async function fetchCategories(): Promise<CategoryInfo[]> {
  return apiFetch<CategoryInfo[]>("/api/categories");
}

export async function fetchProducts(): Promise<Product[]> {
  return apiFetch<Product[]>("/api/products");
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  return apiFetch<Product | null>(`/api/products/${slug}`);
}

// --- Partners ---
export async function fetchPartners(): Promise<Partner[]> {
  return apiFetch<Partner[]>("/api/partners");
}

// --- About ---
export async function fetchAboutContent() {
  return apiFetch<{
    timeline: { year: string; title: string; description: string }[];
    businessStats: { value: string; label: string }[];
    competencies: { title: string; subtitle: string; description: string; image: string; highlight?: boolean }[];
    certifications: { name: string; description: string; image: string }[];
    industries: { name: string; description: string }[];
    customerBrands: string[];
    corporateValues: { name: string; description: string }[];
    trustBadges: string[];
    aboutFAQ: { q: string; a: string }[];
  }>("/api/about");
}

// --- News ---
export async function fetchNews(): Promise<NewsItem[]> {
  return apiFetch<NewsItem[]>("/api/news");
}

export async function fetchNewsBySlug(slug: string): Promise<NewsItem | null> {
  return apiFetch<NewsItem | null>(`/api/news/${slug}`);
}
