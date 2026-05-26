/**
 * Parse ProductSupplementaryData HTML files and enrich the products database.
 *
 * Handles:
 *   1. Simple products — populate hard_torque, materials (normalized), env data
 *   2. Gear variant families — extract variant comparison table, store as `variants` JSON
 *   3. Axial/pair variant families — merge shared data
 */

import { createClient } from "@libsql/client";
import * as fs from "fs";
import * as path from "path";

const DB_PATH = path.resolve(__dirname, "../data/teao.db");
const DATA_DIR = path.resolve(__dirname, "../ProductSupplementaryData");
const DRY_RUN = process.argv.includes("--dry-run");

const client = createClient({ url: `file:${DB_PATH}` });

// ── Material name mapping: supplementary → website standard ──
const MATERIAL_MAP: Record<string, string> = {
  "axial core": "Shaft",
  "silicone ring": "O-Ring",
  "top cover": "Upper Cover",
  base: "Lower Housing",
  "gear bar": "Housing",
  "rack shaft": "Rack Shaft",
  springs: "Spring",
  "closing piece": "Lock Block",
  "steel needle": "Steel Needle",
  bolt: "Bolt",
  "pull head": "Pull Head",
  "torsional spring": "Torsional Spring",
  "steel  needle": "Steel Needle",
  "plastic cap": "Plastic Cap",
  "lock cylinder / lock hook": "Lock Cylinder / Hook",
  "pulling ropes": "Pulling Rope",
  "pull rod sleeve": "Pull Rod Sleeve",
  bracket: "Bracket",
  gear: "Gear",
  "lower cover": "Lower Cover",
  "upper cover": "Upper Cover",
  "lock core": "Lock Core",
  "lock block": "Lock Block",
  // Material codes — normalize case
  pc: "PC",
  pom: "POM",
  sil: "Silicone",
  pa66: "PA66",
  silicone: "Silicone",
  "stainless steel": "Stainless Steel",
  "stainless  steel": "Stainless Steel",
  "hardened steel": "Hardened Steel",
  "hardened  steel": "Hardened Steel",
  rd: "RD",
  pbt: "PBT",
};

function normalizeMaterialName(name: string): string {
  const cleaned = name.trim();
  return MATERIAL_MAP[cleaned.toLowerCase()] || cleaned;
}

function normalizeMaterialCode(code: string): string {
  const cleaned = code.trim();
  return MATERIAL_MAP[cleaned.toLowerCase()] || cleaned.toUpperCase();
}

// ── HTML parsing helpers ──
interface ParsedTable {
  params: Record<string, string>;
  materials: { part: string; material: string }[];
  env: Record<string, string>;
}

interface VariantTable {
  variants: string[];
  rows: { param: string; values: string[] }[];
}

function parseVariantsTable(html: string): VariantTable | null {
  const m = html.match(/Model Variants<\/h3><table>([\s\S]*?)<\/table>/);
  if (!m) return null;

  const rows = m[1].match(/<tr>[\s\S]*?<\/tr>/g) || [];
  if (rows.length === 0) return null;

  // Parse header
  const headerCells = rows[0]?.match(/<th[^>]*>([\s\S]*?)<\/th>/g) || [];
  const allHeaders = headerCells.map((h) => h.replace(/<[^>]*>/g, "").trim());
  // Find where variant columns end (next column is env/material header)
  const variantEndIndex = allHeaders.findIndex(
    (h) => h === "Environment Temperature" || h === "Component Composition Materials" || h === "Experimental Method",
  );
  const variantNames = allHeaders.slice(1, variantEndIndex > 0 ? variantEndIndex : undefined);

  const result: VariantTable = { variants: variantNames, rows: [] };

  // Parse data rows
  for (let i = 1; i < rows.length; i++) {
    const tds = rows[i].match(/<td[^>]*>([\s\S]*?)<\/td>/g);
    if (!tds) continue;
    const values = tds.map((t) => t.replace(/<[^>]*>/g, "").trim());
    const paramName = values[0];
    if (paramName === "—" || paramName === "Environment Temperature" || paramName === "Experimental Method" || paramName === "Component Composition Materials") break;
    result.rows.push({ param: paramName, values: values.slice(1, 1 + variantNames.length) });
  }

  return result;
}

function parseSimpleTable(html: string): ParsedTable {
  const result: ParsedTable = { params: {}, materials: [], env: {} };
  const rows = html.match(/<tr>[\s\S]*?<\/tr>/g) || [];

  let section: "params" | "env" | "materials" = "params";

  for (const row of rows) {
    const tds = row.match(/<td[^>]*>([\s\S]*?)<\/td>/g);
    if (!tds || tds.length < 2) continue;

    const key = tds[0].replace(/<[^>]*>/g, "").trim();
    const val = (tds[1] || "").replace(/<[^>]*>/g, "").trim();

    // Check for section header
    if (tds[0].includes('class="section"')) {
      if (key.toLowerCase().includes("environment")) section = "env";
      else if (key.toLowerCase().includes("material") || key.toLowerCase().includes("component")) section = "materials";
      continue;
    }

    if (section === "params") {
      // Skip empty or duplicate material rows that leaked into params
      if (key === "Environment Temperature" || key === "Experimental Method") {
        result.env[key] = val;
        continue;
      }
      // Check if this looks like a material row (key is a part name, val is material code)
      const materialParts = [
        "base", "top cover", "axial core", "gear", "silicone ring", "springs",
        "closing piece", "steel needle", "bolt", "pull head", "torsional spring",
        "rack shaft", "gear bar", "lower cover", "upper cover", "pull rod sleeve",
        "bracket", "lock core", "lock block", "plastic cap", "pulling ropes",
        "lock cylinder / lock hook",
      ];
      if (materialParts.some((p) => key.toLowerCase().includes(p))) {
        result.materials.push({ part: normalizeMaterialName(key), material: normalizeMaterialCode(val) });
        continue;
      }
      result.params[key] = val;
    } else if (section === "env") {
      result.env[key] = val;
    } else if (section === "materials") {
      result.materials.push({ part: normalizeMaterialName(key), material: normalizeMaterialCode(val) });
    }
  }

  return result;
}

// ── Value extraction helpers ──
function parseResistanceRange(val: string): { min?: number; max?: number; unit?: string } | null {
  if (!val) return null;
  // Patterns: "20-150gf.cm", "12N", "200-1000gf.cm", "2-7Kgf.cm"
  const m = val.match(/([\d.]+)\s*[-–]\s*([\d.]+)\s*(.+)/);
  if (m) return { min: parseFloat(m[1]), max: parseFloat(m[2]), unit: m[3].trim() };
  const single = val.match(/^([\d.]+)\s*(.+)/);
  if (single) return { min: parseFloat(single[1]), max: parseFloat(single[1]), unit: single[2].trim() };
  return null;
}

function parseHardValue(val: string): string | undefined {
  if (!val) return undefined;
  // Skip placeholder values that repeat the label text
  const lower = val.toLowerCase();
  if (lower === "hard resistance value" || lower === "hard resistance" || lower === "hard" || lower === "durability count" || lower === "experimental method") {
    return undefined;
  }
  // Normalize: "50gf.cm" → "50 gf.cm", ensure space
  return val.replace(/(\d)([a-zA-Z])/, "$1 $2").trim();
}

function parseDurability(val: string): number | null {
  if (!val) return null;
  const m = val.match(/[\d,]+/);
  if (!m) return null;
  return parseInt(m[0].replace(/,/g, ""));
}

// ── Main enrichment logic ──
interface EnrichedData {
  hardTorque?: string;
  hardForce?: string;
  materials?: { part: string; material: string }[];
  envData?: Record<string, string>;
  variants?: VariantTable;
  specsToAdd?: Record<string, string>;
}

async function enrichProduct(slug: string, data: EnrichedData) {
  // Get current product
  const row = await client.execute({
    sql: "SELECT * FROM products WHERE slug = ?",
    args: [slug],
  });
  if (row.rows.length === 0) return;

  const current = row.rows[0] as Record<string, unknown>;
  const updates: Record<string, unknown> = {};

  // 1. hard_torque — only update if currently null
  if (data.hardTorque && !current.hard_torque) {
    updates.hard_torque = data.hardTorque;
  }
  if (data.hardForce && !current.hard_force) {
    updates.hard_force = data.hardForce;
  }

  // 2. Materials
  if (data.materials && data.materials.length > 0) {
    const existingMaterials = JSON.parse((current.materials as string) || "[]");
    if (existingMaterials.length === 0) {
      updates.materials = JSON.stringify(data.materials);
    } else if (existingMaterials.length < data.materials.length) {
      // Merge: add missing parts
      const existingParts = new Set(existingMaterials.map((m: { part: string }) => m.part));
      const newParts = data.materials.filter((m) => !existingParts.has(m.part));
      if (newParts.length > 0) {
        updates.materials = JSON.stringify([...existingMaterials, ...newParts]);
      }
    }
  }

  // 3. Add env/test data to specifications
  if (data.envData && Object.keys(data.envData).length > 0) {
    const specs = JSON.parse((current.specifications as string) || "{}");
    let changed = false;
    for (const [k, v] of Object.entries(data.envData)) {
      if (!specs[k]) {
        specs[k] = v;
        changed = true;
      }
    }
    if (data.specsToAdd) {
      for (const [k, v] of Object.entries(data.specsToAdd)) {
        if (!specs[k]) {
          specs[k] = v;
          changed = true;
        }
      }
    }
    if (changed) updates.specifications = JSON.stringify(specs);
  }

  // 4. Variants — store as JSON
  if (data.variants && data.variants.variants.length > 0) {
    updates.variants = JSON.stringify(data.variants);
  }

  if (Object.keys(updates).length === 0) return;

  if (DRY_RUN) {
    console.log(`  [DRY] ${slug}: ${Object.keys(updates).join(", ")}`);
    return;
  }

  const setClauses = Object.keys(updates)
    .map((k) => `${k} = ?`)
    .join(", ");
  const values = Object.values(updates);
  values.push(slug);
  await client.execute({ sql: `UPDATE products SET ${setClauses} WHERE slug = ?`, args: values as Array<string | number | null> });
  console.log(`  ✓ ${slug}: ${Object.keys(updates).join(", ")}`);
}

// ── Main ──
async function main() {
  console.log("Parsing ProductSupplementaryData...\n");

  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".html"));
  console.log(`Found ${files.length} HTML files\n`);

  // Axial variant families that need merging
  const axialFamilies: Record<string, { slug: string; data: ParsedTable }[]> = {};

  // Gear variant families handled inline
  const gearFamilies = [
    "RD-T008", "RD-T010", "RD-T021", "RD-T022", "RD-T023",
    "RD-T025", "RD-T036", "RD-T038", "RD-T039",
  ];

  for (const file of files) {
    const html = fs.readFileSync(path.join(DATA_DIR, file), "utf-8");
    const model = file.replace(".html", "");
    const slug = model.toLowerCase().replace(/_/g, "-");

    // Normalize slug: RD-T028_V028 → rd-t028
    const normalizedSlug = slug.split("_")[0];

    // Skip TR01 family
    if (slug.includes("rd-tr01")) continue;

    // Check if this is a gear variant family file
    const variantTable = parseVariantsTable(html);

    if (variantTable) {
      // Gear variant family — parse shared params from the simple table part too
      const simple = parseSimpleTable(html);

      // Process base model
      const baseSlug = normalizedSlug;

      // Build variant comparison for the product page
      const cleanVariants = {
        variants: variantTable.variants.map((v) => v.trim()),
        rows: variantTable.rows,
      };

      // Build enrichment data from simple table
      const hardVal = simple.params["Hard Resistance Value"];
      const resistanceRange = simple.params["Resistance Range"]
        || simple.params["resistance Range"];

      const env: Record<string, string> = {};
      if (simple.params["Environment Temperature"]) env["Environment Temperature"] = simple.params["Environment Temperature"];
      if (simple.params["Experimental Method"]) env["Experimental Method"] = simple.params["Experimental Method"];

      const specsToAdd: Record<string, string> = {};
      if (resistanceRange) specsToAdd["Resistance Range"] = resistanceRange;

      const enrichment: EnrichedData = {
        hardTorque: hardVal ? parseHardValue(hardVal) : undefined,
        materials: simple.materials,
        envData: env,
        specsToAdd,
        variants: cleanVariants,
      };

      // Also add Modulus, Pressure Angle if present
      for (const [k, v] of Object.entries(simple.params)) {
        if (["Modulus", "Pressure Angle"].includes(k)) {
          specsToAdd[k] = v;
        }
      }

      console.log(`${model} → gear variant family (${cleanVariants.variants.length} variants)`);
      await enrichProduct(baseSlug, enrichment);

      // Also create/update variant products in DB
      for (let i = 0; i < cleanVariants.variants.length; i++) {
        const varName = cleanVariants.variants[i].replace(/\s+/g, " ").trim();
        const varSlug = varName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

        if (varSlug === baseSlug) continue;

        // Build variant-specific specs
        const varSpecs: Record<string, string> = {};
        for (const row of cleanVariants.rows) {
          varSpecs[row.param] = row.values[i];
        }

        // Check if variant product exists
        const existing = await client.execute({
          sql: "SELECT slug FROM products WHERE slug = ?",
          args: [varSlug],
        });

        if (existing.rows.length > 0) {
          const varUpdates: Record<string, unknown> = {};
          const existingRow = await client.execute({
            sql: "SELECT * FROM products WHERE slug = ?",
            args: [varSlug],
          });
          const cur = existingRow.rows[0] as Record<string, unknown>;
          const curSpecs = JSON.parse((cur.specifications as string) || "{}");

          if (!cur.hard_torque && enrichment.hardTorque) varUpdates.hard_torque = enrichment.hardTorque;
          if (enrichment.materials && !cur.materials) varUpdates.materials = JSON.stringify(enrichment.materials);

          // Add variant-specific specs
          for (const [k, v] of Object.entries(varSpecs)) {
            if (!curSpecs[k]) curSpecs[k] = v;
          }
          varUpdates.specifications = JSON.stringify(curSpecs);

          if (Object.keys(varUpdates).length > 0) {
            if (DRY_RUN) {
              console.log(`  [DRY] ${varSlug}: ${Object.keys(varUpdates).join(", ")}`);
            } else {
              const setClauses = Object.keys(varUpdates).map((k) => `${k} = ?`).join(", ");
              const vals = [...Object.values(varUpdates), varSlug];
              await client.execute({ sql: `UPDATE products SET ${setClauses} WHERE slug = ?`, args: vals as Array<string | number | null> });
              console.log(`  ✓ ${varSlug}: variant updated`);
            }
          }
        } else {
          console.log(`  ⚠ ${varSlug}: variant not in DB, skipping`);
        }
      }

      continue;
    }

    // Simple (non-variant) file
    const parsed = parseSimpleTable(html);

    // Detect category for axial families
    const isAxial = model.match(/^RD-T012|^RD-T013/) && model.match(/[A-E]$/);
    if (isAxial) {
      const baseModel = model.replace(/[A-E]$/, "");
      if (!axialFamilies[baseModel]) axialFamilies[baseModel] = [];
      axialFamilies[baseModel].push({ slug: normalizedSlug, data: parsed });
    }

    // Build enrichment
    const hardVal = parsed.params["Hard Resistance Value"];
    const env: Record<string, string> = {};
    if (parsed.params["Environment Temperature"]) env["Environment Temperature"] = parsed.params["Environment Temperature"];
    if (parsed.params["Experimental Method"]) env["Experimental Method"] = parsed.params["Experimental Method"];

    // Determine hard_torque vs hard_force
    const isLatch = normalizedSlug.match(/^rd-0[0-9]|^rd-1[0-8]/);
    const productRow = await client.execute({ sql: "SELECT category FROM products WHERE slug = ?", args: [normalizedSlug] });
    const category = productRow.rows[0]?.category as string || "";

    const enrichment: EnrichedData = {
      materials: parsed.materials,
      envData: env,
    };

    if (hardVal) {
      const parsedHard = parseHardValue(hardVal);
      // Check if it's a force value (N units) or torque (gf.cm, kgf.cm)
      if (parsedHard && (parsedHard.toLowerCase().includes("n") && !parsedHard.toLowerCase().includes("gf") && !parsedHard.toLowerCase().includes("kgf"))) {
        enrichment.hardForce = parsedHard;
      } else {
        enrichment.hardTorque = parsedHard;
      }
    }

    await enrichProduct(normalizedSlug, enrichment);
  }

  // Process axial variant families
  console.log("\nAxial variant families:");
  for (const [base, variants] of Object.entries(axialFamilies)) {
    const baseSlug = base.toLowerCase().replace(/_/g, "-");
    console.log(`  ${base}: ${variants.length} variants`);

    // Build comparison table
    const allParams = new Set<string>();
    for (const v of variants) {
      for (const k of Object.keys(v.data.params)) allParams.add(k);
    }

    // Filter to params that differ between variants
    const variantParams = ["Pitch Width", "Total Height", "Resistance Range", "Hard Resistance Value"];
    const variantTable: VariantTable = {
      variants: variants.map((v) => {
        const model = v.slug.split("-").pop()?.toUpperCase() || "";
        return model;
      }),
      rows: [],
    };

    for (const param of variantParams) {
      const values = variants.map((v) => v.data.params[param] || "-");
      if (values.some((v) => v !== values[0])) {
        variantTable.rows.push({ param, values });
      }
    }

    // Update base product with variant data
    const baseEnrichment: EnrichedData = {
      variants: variantTable,
      // Use first variant's shared data
      materials: variants[0].data.materials,
      envData: {},
    };
    if (variants[0].data.params["Environment Temperature"]) {
      baseEnrichment.envData!["Environment Temperature"] = variants[0].data.params["Environment Temperature"];
    }
    if (variants[0].data.params["Experimental Method"]) {
      baseEnrichment.envData = baseEnrichment.envData || {};
      baseEnrichment.envData["Experimental Method"] = variants[0].data.params["Experimental Method"];
    }
    await enrichProduct(baseSlug, baseEnrichment);

    // Update individual variant products
    for (const variant of variants) {
      const hardVal = variant.data.params["Hard Resistance Value"];
      const varEnrichment: EnrichedData = {
        hardTorque: hardVal ? parseHardValue(hardVal) : undefined,
        materials: variant.data.materials,
      };
      await enrichProduct(variant.slug, varEnrichment);
    }
  }

  // Process paired variant families
  console.log("\nPaired variant families:");
  const pairedFamilies = [
    { base: "rd-t015", variants: ["rd-t015b"] },
    { base: "rd-t180", variants: ["rd-t180a"] },
    { base: "rd-v126", variants: ["rd-v126a"] },
    { base: "rd-v130", variants: ["rd-v130a"] },
  ];

  for (const family of pairedFamilies) {
    console.log(`  ${family.base} + ${family.variants.join(", ")}`);
    // V126/V126A and V130/V130A — mark as lock variants
    if (family.base.startsWith("rd-v")) {
      const variantData: VariantTable = {
        variants: [family.base.replace("rd-v", "V").toUpperCase(), family.variants[0].replace("rd-v", "V").toUpperCase()],
        rows: [
          { param: "Lock", values: ["No", "Yes (glove box light switch)"] },
        ],
      };
      const enrichment: EnrichedData = { variants: variantData };
      await enrichProduct(family.base, enrichment);
    }
    // T015/T015B and T180/T180A: already processed as simple files above
  }

  console.log("\nDone!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
