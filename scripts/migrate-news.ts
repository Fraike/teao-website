import { createClient } from "@libsql/client";
import * as path from "path";

const DB_PATH = path.resolve(__dirname, "../data/teao.db");

const client = createClient({ url: `file:${DB_PATH}` });

const migrations = [
  "ALTER TABLE news ADD COLUMN seo_title TEXT",
  "ALTER TABLE news ADD COLUMN keywords TEXT",
  "ALTER TABLE news ADD COLUMN related_products TEXT NOT NULL DEFAULT '[]'",
  "ALTER TABLE news ADD COLUMN article_type TEXT NOT NULL DEFAULT 'article'",
];

async function run() {
  console.log("Running news table migration...\n");

  for (const sql of migrations) {
    try {
      await client.execute(sql);
      console.log(`  ✓ ${sql}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("duplicate column") || msg.includes("already exists")) {
        console.log(`  ⏭ Skipped (already exists): ${sql.split("ADD COLUMN")[1]?.trim()}`);
      } else {
        console.error(`  ✗ Failed: ${sql}`);
        console.error(`    ${msg}`);
      }
    }
  }

  console.log("\nMigration complete.");
  process.exit(0);
}

run();
