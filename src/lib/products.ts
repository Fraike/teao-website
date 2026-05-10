import type { Product } from "@/types";

export interface ProductFilters {
  search: string;
  torqueRange: string;
  application: string;
  attachment: string;
}

export type SortOption = "default" | "torque-asc" | "torque-desc";

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
