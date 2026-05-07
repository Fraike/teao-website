export interface Product {
  slug: string;
  name: string;
  category: ProductCategory;
  description: string;
  overview: string;
  image: string;
  images: string[];
  specifications: Record<string, string>;
  features: string[];
  isActive: boolean;
  sortOrder: number;
}

export type ProductCategory =
  | "gear-damper"
  | "cylinder-damper"
  | "glove-box-damper"
  | "latch"
  | "other";

export interface CategoryInfo {
  slug: ProductCategory;
  name: string;
  description: string;
  image: string;
}

export interface NewsItem {
  slug: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  category: "company" | "quality" | "engineering";
  isPublished: boolean;
  publishedAt: string;
}

export interface ApplicationInfo {
  title: string;
  description: string;
  image: string;
  features: string[];
}

export interface Partner {
  name: string;
  logo: string;
}
