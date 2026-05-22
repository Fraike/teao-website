import type { Product, ProductCategory } from "@/types";
import type { products } from "@/db/schema";

type DbProduct = typeof products.$inferSelect;

/** Parse JSON fields from a DB row, keeping DB column names (for API responses) */
export function serializeProduct(row: DbProduct): Record<string, unknown> {
  return {
    ...row,
    features: JSON.parse(row.features || "[]"),
    images: JSON.parse(row.images || "[]"),
    techParams: row.techParams ? JSON.parse(row.techParams) : undefined,
    specifications: JSON.parse(row.specifications || "{}"),
    torque: row.torque ? JSON.parse(row.torque) : undefined,
    durability: row.durability ? JSON.parse(row.durability) : undefined,
    materials: JSON.parse(row.materials || "[]"),
    characteristics: JSON.parse(row.characteristics || "[]"),
    performanceCharts: row.performanceCharts ? JSON.parse(row.performanceCharts) : undefined,
    applications: JSON.parse(row.applications || "[]"),
    applicationScenarios: row.applicationScenarios ? JSON.parse(row.applicationScenarios) : undefined,
    tags: JSON.parse(row.tags || "[]"),
    isActive: Boolean(row.isActive),
  };
}

/** Stringify JSON fields for DB insert/update from a form payload */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deserializeProduct(data: Record<string, any>) {
  return {
    ...data,
    features: JSON.stringify(data.features || []),
    images: JSON.stringify(data.images || []),
    techParams: data.techParams ? JSON.stringify(data.techParams) : null,
    specifications: JSON.stringify(data.specifications || {}),
    torque: data.torque ? JSON.stringify(data.torque) : null,
    durability: data.durability ? JSON.stringify(data.durability) : null,
    materials: JSON.stringify(data.materials || []),
    characteristics: JSON.stringify(data.characteristics || []),
    performanceCharts: data.performanceCharts ? JSON.stringify(data.performanceCharts) : null,
    applications: JSON.stringify(data.applications || []),
    applicationScenarios: data.applicationScenarios ? JSON.stringify(data.applicationScenarios) : null,
    tags: JSON.stringify(data.tags || []),
    isActive: data.isActive ? 1 : 0,
  };
}

export function mapDbProduct(row: DbProduct): Product {
  return {
    slug: row.slug,
    model: row.model,
    name: row.name,
    category: row.category as ProductCategory,
    sub_type: (row.subType as "individual" | "series" | undefined) ?? undefined,
    series: row.series ?? undefined,
    variant: row.variant ?? undefined,
    summary: row.summary,
    description: row.description,
    features: JSON.parse(row.features || "[]"),
    image: row.image,
    images: JSON.parse(row.images || "[]"),
    tech_params: row.techParams ? JSON.parse(row.techParams) : undefined,
    specifications: JSON.parse(row.specifications || "{}"),
    torque: row.torque ? JSON.parse(row.torque) : undefined,
    force_range: row.forceRange ?? undefined,
    hard_torque: row.hardTorque ?? undefined,
    hard_force: row.hardForce ?? (row.category === "latch" ? "6N" : undefined),
    sound_type: (row.soundType as "audible" | "silent" | undefined) ?? (row.category === "latch" ? "audible" : undefined),
    durability: row.durability ? JSON.parse(row.durability) : undefined,
    materials: JSON.parse(row.materials || "[]"),
    characteristics: JSON.parse(row.characteristics || "[]"),
    dimension_drawing: row.dimensionDrawing ?? undefined,
    performance_charts: row.performanceCharts ? JSON.parse(row.performanceCharts) : undefined,
    buffer_direction: row.bufferDirection ?? undefined,
    assembly_method: row.assemblyMethod ?? undefined,
    applications: JSON.parse(row.applications || "[]"),
    application_scenarios: row.applicationScenarios ? JSON.parse(row.applicationScenarios) : undefined,
    seo_title: row.seoTitle ?? undefined,
    seo_description: row.seoDescription ?? undefined,
    tags: JSON.parse(row.tags || "[]"),
    status: (row.status as "active" | "inactive" | "draft" | undefined) ?? "active",
    isActive: Boolean(row.isActive),
    sortOrder: row.sortOrder,
  };
}

export interface ProductFilters {
  search: string;
  torqueRange: string;
  application: string;
  attachment: string;
}

export type SortOption = "default" | "torque-asc" | "torque-desc";

export interface TorqueRange {
  scaleMax: number;
  start: number;
  width: number;
}

/** Round value up to a "nice" ceiling (1, 2, 5, 10, 20, 50, 100, etc.) */
export function niceCeil(value: number) {
  if (value <= 0) return 1;
  const power = 10 ** Math.floor(Math.log10(value));
  const normalized = value / power;
  const step = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return step * power;
}

/** Compute torque range bar display values (scale max, start%, width%) */
export function getTorqueRange(product: Product): TorqueRange | null {
  const torque = product.torque;
  if (!torque) return null;
  const scaleMax = niceCeil(torque.max * 1.45);
  const rawStart = Math.max(0, Math.min(100, (torque.min / scaleMax) * 100));
  const rawEnd = Math.max(rawStart, Math.min(100, (torque.max / scaleMax) * 100));
  const minWidth = 6; // minimum bar width in %
  const width = Math.min(Math.max(minWidth, rawEnd - rawStart), 100 - rawStart);
  const start = rawStart + rawEnd > 0 ? Math.min(rawStart, 100 - width) : rawStart;
  return { scaleMax, start, width };
}

/** Format torque range as human-readable string */
export function formatTorque(product: Product) {
  if (!product.torque) return null;
  const { min, max, unit } = product.torque;
  return min === max ? `${min} ${unit}` : `${min} – ${max} ${unit}`;
}

/** Clean up assembly method string */
export function formatMount(value?: string) {
  if (!value) return null;
  return value.replace(/Screw Fixing/gi, "Screw fit");
}

/** Look up a spec value from both specifications and tech_params, case-insensitive partial match */
export function findSpecValue(product: Product, key: string): string | number | null {
  const lowerKey = key.toLowerCase();
  const specs = product.specifications;

  // Exact match first
  for (const [k, v] of Object.entries(specs)) {
    if (k.toLowerCase() === lowerKey) return v;
  }
  // Partial match for composite keys
  for (const [k, v] of Object.entries(specs)) {
    if (k.toLowerCase().includes(lowerKey)) return v;
  }
  // tech_params fallback
  if (product.tech_params) {
    for (const [k, v] of Object.entries(product.tech_params)) {
      if (k.toLowerCase().includes(lowerKey)) return v;
    }
  }
  return null;
}

export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  return products.filter((p) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchesModel = p.model.toLowerCase().includes(q);
      const matchesName = p.name.toLowerCase().includes(q);
      if (!matchesModel && !matchesName) return false;
    }

    if (filters.torqueRange && p.torque) {
      const [lo, hi] = filters.torqueRange.split("-").map(Number);
      if (hi) {
        if (p.torque.max < lo || p.torque.min > hi) return false;
      } else {
        if (p.torque.max < lo) return false;
      }
    }

    if (filters.application) {
      const app = filters.application.toLowerCase();
      if (!p.applications.some((a) => a.toLowerCase().includes(app))) return false;
    }

    if (filters.attachment) {
      if (!p.assembly_method || p.assembly_method !== filters.attachment) return false;
    }

    return true;
  });
}

export function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  const sorted = [...products];

  switch (sortBy) {
    case "torque-asc":
      return sorted.sort((a, b) => (a.torque?.min ?? 0) - (b.torque?.min ?? 0));
    case "torque-desc":
      return sorted.sort((a, b) => (b.torque?.max ?? 0) - (a.torque?.max ?? 0));
    default:
      return sorted.sort((a, b) => a.sortOrder - b.sortOrder);
  }
}

export function getAllApplications(products: Product[]): string[] {
  const apps = new Set<string>();
  for (const p of products) {
    for (const a of p.applications) {
      apps.add(a);
    }
  }
  return Array.from(apps).sort();
}

export function getAllAttachments(products: Product[]): string[] {
  const attachments = new Set<string>();
  for (const p of products) {
    if (p.assembly_method) attachments.add(p.assembly_method);
  }
  return Array.from(attachments).sort();
}
