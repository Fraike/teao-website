/**
 * Update all image references in database from .png/.jpg/.jpeg/.JPG to .webp
 * Usage: npx tsx scripts/update-db-refs.ts [--dry-run]
 */
import Database from "better-sqlite3";
import path from "node:path";

const db = new Database(path.resolve(__dirname, "..", "data", "teao.db"));
const DRY_RUN = process.argv.includes("--dry-run");

function toWebp(val: string): string {
  return val.replace(/\.(png|jpg|jpeg|JPG|JPEG|PNG)(\b|["\]}'])/g, ".webp$2");
}

function updateTable(table: string, columns: string[]) {
  const rows = db.prepare(`SELECT * FROM ${table}`).all() as any[];
  let updated = 0;

  for (const row of rows) {
    const changes: Record<string, string> = {};
    for (const col of columns) {
      const oldVal = row[col];
      if (!oldVal || typeof oldVal !== "string") continue;
      const newVal = toWebp(oldVal);
      if (newVal !== oldVal) {
        changes[col] = newVal;
      }
    }
    if (Object.keys(changes).length === 0) continue;

    if (!DRY_RUN) {
      const sets = Object.keys(changes).map((c) => `${c} = ?`).join(", ");
      const vals = Object.values(changes);
      db.prepare(`UPDATE ${table} SET ${sets} WHERE id = ?`).run(...vals, row.id);
    }
    updated++;
    if (DRY_RUN) {
      console.log(`  [${table}] id=${row.id}:`, changes);
    }
  }

  console.log(`  ${table}: ${updated} rows updated`);
}

console.log(DRY_RUN ? "🔍 DRY RUN\n" : "🔄 Updating DB references...\n");

updateTable("categories", ["image"]);
updateTable("products", ["image", "images", "dimension_drawing", "performance_charts"]);
updateTable("news", ["image"]);

if (!DRY_RUN) {
  console.log("\n✅ DB references updated");
} else {
  console.log("\n📊 Dry run complete");
}
