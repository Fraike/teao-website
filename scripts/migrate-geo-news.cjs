const { createClient } = require("@libsql/client");
const fs = require("fs");
const path = require("path");

const DB_PATH = path.resolve(__dirname, "../data/teao.db");
const DRAFTS_DIR = path.resolve(__dirname, "../drafts/geo-news");

const client = createClient({ url: `file:${DB_PATH}` });

// ---- Minimal markdown to HTML converter ----

function mdToHtml(md) {
  let html = md;

  // Remove frontmatter if present
  html = html.replace(/^---[\s\S]*?---\n*/, "");

  // Headings
  html = html.replace(/^#### (.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");

  // Horizontal rules
  html = html.replace(/^---$/gm, "<hr>");

  // Split into blocks and wrap paragraphs
  const blocks = html.split(/\n\n+/);
  const processed = [];

  for (const block of blocks) {
    const lines = block.trim().split("\n");

    if (lines.length === 0) continue;

    const firstLine = lines[0];

    // Already HTML block
    if (
      firstLine.startsWith("<h") ||
      firstLine.startsWith("<table") ||
      firstLine.startsWith("<ul") ||
      firstLine.startsWith("<ol") ||
      firstLine.startsWith("<blockquote") ||
      firstLine.startsWith("<hr") ||
      firstLine.startsWith("<div")
    ) {
      processed.push(block.trim());
      continue;
    }

    // Unordered list
    if (lines.every((l) => l.startsWith("- ") || l.startsWith("* "))) {
      const items = lines.map((l) => `<li>${l.replace(/^[-*] /, "")}</li>`).join("\n");
      processed.push(`<ul>\n${items}\n</ul>`);
      continue;
    }

    // Ordered list
    if (lines.every((l) => /^\d+\. /.test(l))) {
      const items = lines.map((l) => `<li>${l.replace(/^\d+\. /, "")}</li>`).join("\n");
      processed.push(`<ol>\n${items}\n</ol>`);
      continue;
    }

    // Regular paragraph
    processed.push(`<p>${lines.join("<br>")}</p>`);
  }

  return processed.join("\n\n");
}

// ---- Frontmatter parser ----

function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const fm = {};
  const lines = match[1].split("\n");
  for (const line of lines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.substring(0, colonIdx).trim();
    let value = line.substring(colonIdx + 1).trim();
    // Remove surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    fm[key] = value;
  }
  return fm;
}

// ---- Image mapping ----

const IMAGE_MAP = {
  "01-what-is-a-rotary-damper.md": "/images/product-list/Gear-damper/RD-T015/RD-T015-product-01.webp",
  "02-gear-dampers-for-automotive-interiors.md": "/images/product-list/Gear-damper/RD-T015/RD-T015-product-01.webp",
  "03-axial-linear-dampers-selection-guide.md": "/images/products/axial-damper/AxialDamperSingle.webp",
  "04-automotive-glove-box-dampers-guide.md": "/images/products/glove-box-damper/GloveBoxDamperSingle.webp",
  "05-silent-latches-and-interior-mechanisms.md": "/images/products/latch/LatchSingle.webp",
  "06-teao-manufacturing-quality-capabilities.md": "/images/company/automation-workshop.webp",
  "07-custom-damper-selection-checklist.md": "/images/products/gear-damper/GearDamperSingle.webp",
};

// ---- Main ----

async function main() {
  console.log("Starting news migration...\n");

  // 1. Delete unwanted articles
  const slugsToDelete = [
    "teao-expands-capacity",
    "automotive-quality-systems",
    "torque-requirements-guide",
  ];

  for (const slug of slugsToDelete) {
    const result = await client.execute({
      sql: "DELETE FROM news WHERE slug = ?",
      args: [slug],
    });
    console.log(`Deleted: ${slug} (${result.rowsAffected} rows)`);
  }

  console.log("");

  // 2. Read and import geo-news drafts
  const files = fs
    .readdirSync(DRAFTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();

  for (const file of files) {
    const filePath = path.join(DRAFTS_DIR, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const fm = parseFrontmatter(raw);
    const htmlContent = mdToHtml(raw);
    const image = IMAGE_MAP[file];

    if (!fm.slug || !fm.title) {
      console.log(`SKIP ${file}: missing slug or title`);
      continue;
    }

    const slug = fm.slug;
    const title = fm.title;
    const category = fm.category || "engineering";
    const articleType = fm.articleType || "guide";
    const keywords = fm.keywords || "";
    const seoTitle = fm.seoTitle || title;
    const seoDescription = fm.seoDescription || "";
    const summary = seoDescription || htmlContent.replace(/<[^>]+>/g, "").slice(0, 200);

    const publishedAt = new Date().toISOString();

    // Upsert: delete existing then insert
    await client.execute({ sql: "DELETE FROM news WHERE slug = ?", args: [slug] });

    await client.execute({
      sql: `INSERT INTO news (slug, title, seo_title, keywords, summary, content, image, category, article_type, is_published, published_at, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)`,
      args: [
        slug,
        title,
        seoTitle,
        keywords,
        summary,
        htmlContent,
        image,
        category,
        articleType,
        publishedAt,
        Math.floor(Date.now() / 1000),
        Math.floor(Date.now() / 1000),
      ],
    });

    console.log(`Inserted: ${file} -> ${slug} [image: ${image}]`);
  }

  // 3. Verify
  const result = await client.execute("SELECT id, slug, title, category, article_type, image FROM news ORDER BY id");
  console.log(`\n--- Final news table (${result.rows.length} articles) ---`);
  result.rows.forEach((r) => {
    console.log(`  [${r.id}] ${r.slug} | ${r.category} | ${r.article_type} | ${r.image}`);
  });
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
