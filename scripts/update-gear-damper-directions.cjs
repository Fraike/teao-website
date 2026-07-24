// Update buffer_direction for gear-damper products
// T-series → Bidirectional, V-series → One-way
const path = require("path");
const { createClient } = require("@libsql/client");

const dbPath = path.resolve(__dirname, "../data/teao.db");
const client = createClient({ url: `file:${dbPath}` });

async function main() {
  const rows = await client.execute(
    "SELECT id, model, name FROM products WHERE category = 'gear-damper' AND is_active = 1",
  );

  let bidirectional = 0;
  let oneway = 0;
  let skipped = 0;

  for (const r of rows.rows) {
    const model = r.model.toUpperCase();
    const isBidirectional = model.includes("-T");
    const isOneway = model.includes("-V") || model.startsWith("V");

    if (isOneway) {
      await client.execute("UPDATE products SET buffer_direction = ? WHERE id = ?", ["One-way", r.id]);
      console.log(`${r.model} → One-way`);
      oneway++;
    } else if (isBidirectional) {
      await client.execute("UPDATE products SET buffer_direction = ? WHERE id = ?", ["Bidirectional", r.id]);
      console.log(`${r.model} → Bidirectional`);
      bidirectional++;
    } else {
      console.log(`${r.model} → SKIP (no pattern match)`);
      skipped++;
    }
  }

  console.log(`\nDone: ${bidirectional} Bidirectional, ${oneway} One-way, ${skipped} skipped`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
