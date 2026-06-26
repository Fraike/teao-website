const { createClient } = require("@libsql/client");
const fs = require("fs");
const path = require("path");

const DB_PATH = path.resolve(__dirname, "../data/teao.db");
const ARTICLE_PATH = path.resolve(
  __dirname,
  "../drafts/teao-2025-shanghai-automotive-interior-exterior-exhibition.md",
);

const client = createClient({ url: `file:${DB_PATH}` });

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return {};

  const data = {};
  for (const line of match[1].split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    let value = line.slice(colon + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (value.startsWith("[") && value.endsWith("]")) {
      try {
        value = JSON.parse(value);
      } catch {
        value = value
          .slice(1, -1)
          .split(",")
          .map((item) => item.trim().replace(/^["']|["']$/g, ""))
          .filter(Boolean);
      }
    }
    data[key] = value;
  }
  return data;
}

function inlineMarkdown(text) {
  return text
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function markdownToHtml(raw) {
  const body = raw.replace(/^---\n[\s\S]*?\n---\n/, "").trim();
  const blocks = body.split(/\n{2,}/);
  const html = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("<")) {
      html.push(trimmed);
      continue;
    }

    if (/^### /.test(trimmed)) {
      html.push(`<h3>${inlineMarkdown(trimmed.replace(/^### /, ""))}</h3>`);
      continue;
    }
    if (/^## /.test(trimmed)) {
      html.push(`<h2>${inlineMarkdown(trimmed.replace(/^## /, ""))}</h2>`);
      continue;
    }
    if (/^# /.test(trimmed)) {
      html.push(`<h1>${inlineMarkdown(trimmed.replace(/^# /, ""))}</h1>`);
      continue;
    }

    const lines = trimmed.split("\n");
    if (lines.every((line) => line.startsWith("- "))) {
      html.push(`<ul>\n${lines.map((line) => `  <li>${inlineMarkdown(line.slice(2))}</li>`).join("\n")}\n</ul>`);
      continue;
    }
    if (lines.every((line) => /^\d+\. /.test(line))) {
      html.push(`<ol>\n${lines.map((line) => `  <li>${inlineMarkdown(line.replace(/^\d+\. /, ""))}</li>`).join("\n")}\n</ol>`);
      continue;
    }

    html.push(`<p>${inlineMarkdown(lines.join("<br>"))}</p>`);
  }

  return html.join("\n\n");
}

async function main() {
  const raw = fs.readFileSync(ARTICLE_PATH, "utf8");
  const fm = parseFrontmatter(raw);

  if (!fm.slug || !fm.title) {
    throw new Error("Article frontmatter must include title and slug.");
  }

  const now = new Date();
  const unixTs = Math.floor(now.getTime() / 1000);
  const content = markdownToHtml(raw);
  const relatedProducts = Array.isArray(fm.relatedProducts) ? JSON.stringify(fm.relatedProducts) : "[]";

  await client.execute({
    sql: "DELETE FROM news WHERE slug = ?",
    args: [fm.slug],
  });

  await client.execute({
    sql: `INSERT INTO news
      (slug, title, seo_title, keywords, summary, content, image, category, article_type, related_products, is_published, published_at, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)`,
    args: [
      fm.slug,
      fm.title,
      fm.seoTitle || fm.title,
      fm.keywords || "",
      fm.seoDescription || "",
      content,
      fm.image || "/images/news/placeholder-1.webp",
      fm.category || "company",
      fm.articleType || "news",
      relatedProducts,
      fm.publishedAt || now.toISOString().slice(0, 10),
      unixTs,
      unixTs,
    ],
  });

  const result = await client.execute({
    sql: "SELECT id, slug, title, category, article_type, is_published, image, published_at FROM news WHERE slug = ?",
    args: [fm.slug],
  });

  console.log(result.rows[0]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
