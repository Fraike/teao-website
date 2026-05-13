import { db } from "../src/db";
import { products } from "../src/db/schema";
import { deserializeProduct } from "../src/lib/products";
import data from "../data/pptx_parsed_final.json";

interface ParsedProduct {
  slide: number;
  model: string;
  category_cn?: string;
  category?: string;
  models?: string[];
  torque_range?: { min: number; max: number; unit: string };
  force?: { value: number; unit: string };
  hard_torque?: number;
  hard_force?: number;
  teeth?: number;
  module?: number;
  pressure_angle?: number;
  outer_diameter?: number;
  total_height?: number;
  total_length?: number;
  total_width?: number;
  positioning_hole?: number;
  clip_width?: number;
  teeth_outer_diameter?: number;
  teeth_height?: number;
  materials?: { part: string; material: string }[];
  durability_cycles?: number;
  test_method?: string;
  temp_range?: string;
  buffer_direction?: string;
  assembly_method?: string;
  applications?: string;
  description?: string;
  duplicate?: boolean;
  note?: string;
}

const CATEGORY_NAMES: Record<string, string> = {
  "gear-damper": "齿轮阻尼器",
  "axial-damper": "圆筒阻尼器",
  "glove-box-damper": "手套箱阻尼器",
  "latch": "锁扣/门锁",
  "other": "其他",
};

// Application keywords per category
const DEFAULT_APPLICATIONS: Record<string, string[]> = {
  "gear-damper": ["汽车内外饰", "办公设备", "家用电器"],
  "axial-damper": ["汽车内外饰", "办公设备", "家用电器"],
  "glove-box-damper": ["汽车内饰", "手套箱"],
  "latch": ["汽车内外饰", "智能家居", "办公用品"],
  "other": ["汽车零部件", "工业设备"],
};

const products_data = data as ParsedProduct[];

function generateSlug(model: string): string {
  return model
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function generateName(p: ParsedProduct): string {
  const cat = CATEGORY_NAMES[p.category || ""] || "";
  const sub = p.models && p.models.length > 1 ? "系列" : "";
  return `${p.model}${sub} ${cat}`;
}

function generateSummary(p: ParsedProduct): string {
  const parts: string[] = [];
  if (p.torque_range) {
    parts.push(`扭矩范围: ${p.torque_range.min}–${p.torque_range.max} ${p.torque_range.unit}`);
  }
  if (p.force) {
    parts.push(`按压力: ${p.force.value}${p.force.unit}`);
  }
  if (p.teeth) {
    parts.push(`齿数: ${p.teeth}`);
  }
  if (p.outer_diameter) {
    parts.push(`外径: ${p.outer_diameter}mm`);
  }
  return parts.join(" | ") || `${p.model} 产品`;
}

function buildSpecifications(p: ParsedProduct): Record<string, string> {
  const specs: Record<string, string> = {};

  if (p.teeth !== undefined) specs["齿数 (Teeth)"] = String(p.teeth);
  if (p.module !== undefined) specs["模数 (Module)"] = String(p.module);
  if (p.pressure_angle !== undefined) specs["压力角 (Pressure Angle)"] = `${p.pressure_angle}°`;
  if (p.outer_diameter !== undefined) specs["外径 (Outer Diameter)"] = `${p.outer_diameter} mm`;
  if (p.total_height !== undefined) specs["总高 (Total Height)"] = `${p.total_height} mm`;
  if (p.total_length !== undefined) specs["总长 (Total Length)"] = `${p.total_length} mm`;
  if (p.total_width !== undefined) specs["总宽 (Total Width)"] = `${p.total_width} mm`;
  if (p.clip_width !== undefined) specs["卡位宽 (Clip Width)"] = `${p.clip_width} mm`;
  if (p.teeth_outer_diameter !== undefined) specs["齿外径 (Teeth OD)"] = `${p.teeth_outer_diameter} mm`;
  if (p.teeth_height !== undefined) specs["齿高 (Teeth Height)"] = `${p.teeth_height} mm`;
  if (p.positioning_hole !== undefined) specs["定位孔 (Positioning Hole)"] = `${p.positioning_hole} mm`;

  return specs;
}

function buildFeatures(p: ParsedProduct): string[] {
  const features: string[] = [];
  if (p.torque_range) {
    features.push(`扭矩: ${p.torque_range.min}–${p.torque_range.max} ${p.torque_range.unit}`);
  }
  if (p.hard_torque) {
    features.push(`硬性阻值: ${p.hard_torque} gf.cm`);
  }
  if (p.durability_cycles) {
    const wan = p.durability_cycles / 10000;
    features.push(`耐久: ≥${wan} 万次循环`);
  }
  if (p.buffer_direction) {
    features.push(`缓冲方向: ${p.buffer_direction}`);
  }
  return features;
}

function buildCharacteristics(p: ParsedProduct): string[] {
  const chars: string[] = [];
  if (p.buffer_direction) {
    chars.push(p.buffer_direction === "双向" ? "Two-way" : "One-way");
  }
  if (p.assembly_method) {
    if (p.assembly_method.includes("螺丝")) chars.push("Screw Fixing");
    if (p.assembly_method.includes("卡扣")) chars.push("Snap-fit");
    if (p.assembly_method.includes("通孔")) chars.push("Through-hole");
    if (p.assembly_method.includes("定位柱")) chars.push("Positioning Pin");
  }
  if (p.teeth) chars.push(`Gear ${p.teeth}T`);
  return chars;
}

function buildDurability(p: ParsedProduct): Record<string, unknown> | null {
  if (!p.durability_cycles && !p.test_method && !p.temp_range) return null;
  return {
    cycles: p.durability_cycles,
    test_method: p.test_method || undefined,
    temperature: p.temp_range || undefined,
  };
}

function buildApplications(p: ParsedProduct): string[] {
  if (p.applications) {
    return p.applications.split(/[，,、]/).map((a) => a.trim()).filter(Boolean);
  }
  return DEFAULT_APPLICATIONS[p.category || ""] || ["汽车零部件"];
}

function buildTags(p: ParsedProduct): string[] {
  const tags: string[] = [];
  if (p.category === "gear-damper") tags.push("齿轮阻尼器", "旋转阻尼器");
  if (p.category === "axial-damper") tags.push("圆筒阻尼器", "轴向阻尼器");
  if (p.category === "glove-box-damper") tags.push("手套箱阻尼器", "拉伸阻尼器");
  if (p.category === "latch") tags.push("锁扣", "门锁");
  if (p.teeth) tags.push("齿轮式");
  if (p.outer_diameter) tags.push("圆筒式");
  return tags;
}

async function main() {
  let imported = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const p of products_data) {
    if (p.duplicate) {
      console.log(`  SKIP slide ${p.slide}: ${p.model} (duplicate)`);
      skipped++;
      continue;
    }

    const category = p.category || "other";
    const slug = generateSlug(p.model);

    const payload: Record<string, unknown> = {
      slug,
      model: p.model,
      name: generateName(p),
      category,
      subType: p.models && p.models.length > 1 ? "series" : "individual",
      series: undefined,
      variant: undefined,
      summary: generateSummary(p),
      description: p.description || "",
      features: buildFeatures(p),
      image: "", // placeholder - user will upload
      images: [],
      specifications: buildSpecifications(p),
      torque: p.torque_range
        ? { min: p.torque_range.min, max: p.torque_range.max, unit: p.torque_range.unit }
        : undefined,
      forceRange: p.force ? `${p.force.value}${p.force.unit}` : undefined,
      hardTorque: p.hard_torque ? String(p.hard_torque) : undefined,
      hardForce: p.hard_force ? String(p.hard_force) : undefined,
      durability: buildDurability(p),
      materials: p.materials || [],
      characteristics: buildCharacteristics(p),
      dimensionDrawing: undefined,
      performanceCharts: undefined,
      bufferDirection: p.buffer_direction || undefined,
      assemblyMethod: p.assembly_method || undefined,
      applications: buildApplications(p),
      seoTitle: `${p.model} - ${CATEGORY_NAMES[category] || ""} | TEAO`,
      seoDescription: generateSummary(p),
      tags: buildTags(p),
      status: "active" as const,
      isActive: true,
      sortOrder: p.slide,
    };

    try {
      db.insert(products).values(deserializeProduct(payload) as never).returning().get();
      imported++;
      console.log(`  OK slide ${p.slide}: ${p.model} → ${slug}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("UNIQUE constraint")) {
        console.log(`  SKIP slide ${p.slide}: ${p.model} (slug "${slug}" already exists)`);
        skipped++;
      } else {
        console.log(`  ERROR slide ${p.slide}: ${p.model} → ${msg}`);
        errors.push(`${p.model}: ${msg}`);
      }
    }
  }

  console.log(`\nDone. Imported: ${imported}, Skipped: ${skipped}, Errors: ${errors.length}`);
  if (errors.length > 0) {
    console.log("Errors:");
    errors.forEach((e) => console.log(`  ${e}`));
  }
}

main();
