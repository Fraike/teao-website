const path = require("path");
const { createClient } = require("@libsql/client");

const dbPath = path.resolve(__dirname, "../data/teao.db");
const client = createClient({ url: `file:${dbPath}` });

const CATEGORY_META = {
  "gear-damper": {
    title: "Rotary Gear Damper for Soft-Motion Mechanisms",
    description:
      "is a rotary damper / gear damper for quiet soft-motion control in automotive interiors, lids, covers and industrial mechanisms.",
  },
  "axial-damper": {
    title: "Axial Barrel Damper for Compact Motion Control",
    description:
      "is an axial damper / barrel damper for compact hinge, handle and storage mechanisms where stable soft opening or return control is required.",
  },
  "glove-box-damper": {
    title: "Glove Box Damper for Controlled Descent",
    description:
      "is a glove box damper for controlled descent, reduced impact noise and smoother automotive interior storage movement.",
  },
  latch: {
    title: "Latch Mechanism for Automotive and Industrial Assemblies",
    description:
      "is a latch mechanism for controlled locking, release feel and repeatable assembly performance in automotive and industrial applications.",
  },
  other: {
    title: "Motion Control Component for Custom Mechanisms",
    description:
      "is a TEAO motion control component for custom damping, synchronizing or assisted movement in compact automotive and industrial mechanisms.",
  },
};

function isWeakSeoDescription(description) {
  if (!description) return true;
  const trimmed = description.trim();
  return trimmed.length < 90 || /^(Torque|Operating Force):/i.test(trimmed);
}

function specSuffix(description, summary) {
  const source = description || summary || "";
  const trimmed = source.trim();
  return /^(Torque|Operating Force):/i.test(trimmed) ? ` ${trimmed}` : "";
}

async function main() {
  const products = await client.execute({
    sql: "select id, model, category, summary, seo_description from products where is_active = 1",
    args: [],
  });

  for (const row of products.rows) {
    const meta = CATEGORY_META[row.category] || CATEGORY_META.other;
    if (!isWeakSeoDescription(row.seo_description)) continue;

    await client.execute({
      sql: `
        update products
        set seo_title = ?,
            seo_description = ?
        where id = ?
      `,
      args: [
        `${row.model} ${meta.title}`,
        `${row.model} ${meta.description}${specSuffix(row.seo_description, row.summary)}`,
        row.id,
      ],
    });
  }

  await client.execute({
    sql: `
      update news
      set seo_title = ?,
          keywords = ?
      where slug = 'how-do-gear-dampers-work-teao-damper'
        and is_published = 1
        and (
          seo_title is null or trim(seo_title) = ''
          or keywords is null or trim(keywords) = ''
        )
    `,
    args: [
      "How Gear Dampers Work: Rotary Damping Principle and TEAO Design Notes",
      "gear damper, rotary damper, damper working principle, rotary damping technology, automotive interior damper, soft motion mechanism, TEAO damper",
    ],
  });

  console.log("SEO/GEO content repair completed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
