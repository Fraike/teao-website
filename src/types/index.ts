export interface Product {
  slug: string;
  model: string;
  name: string;
  category: ProductCategory;
  sub_type?: "individual" | "series";
  series?: string;
  variant?: string;

  summary: string;
  description: string;
  features: string[];

  image: string;
  images: { url: string; alt?: string }[];

  tech_params?: Record<string, string | number>;
  specifications: Record<string, string>;

  torque?: {
    min: number;
    max: number;
    unit: "gf.cm" | "kgf.cm" | "N·m" | "N";
  };
  force_range?: string;
  hard_torque?: string;
  hard_force?: string;

  durability?: {
    temperature?: string;
    temperature_value?: string;
    test_method?: string;
    cycles?: number;
    cycles_unit?: string;
  };

  materials?: { part: string; material: string }[];

  /** Short technical tags displayed as pills (e.g. "SOC Free", "Two-way") */
  characteristics?: string[];

  /** Path to the technical dimension/engineering drawing */
  dimension_drawing?: string;

  /** Paths to performance curve chart images */
  performance_charts?: {
    rotation_curve?: string;
    temperature_curve?: string;
  };

  buffer_direction?: string;
  assembly_method?: string;

  applications: string[];

  seo_title?: string;
  seo_description?: string;

  tags?: string[];
  status?: "active" | "inactive" | "draft";
  isActive: boolean;
  sortOrder: number;
}

export type ProductCategory =
  | "gear-damper"
  | "axial-damper"
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
