const path = require("path");
const { createClient } = require("@libsql/client");

const dbUrl = process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN
  ? process.env.TURSO_DATABASE_URL
  : `file:${path.resolve(__dirname, "../data/teao.db")}`;

const client = createClient({
  url: dbUrl,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const statements = [
  `CREATE TABLE IF NOT EXISTS product_translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL REFERENCES products(id),
    locale TEXT NOT NULL,
    name TEXT NOT NULL,
    summary TEXT NOT NULL,
    description TEXT NOT NULL,
    features TEXT NOT NULL DEFAULT '[]',
    applications TEXT NOT NULL DEFAULT '[]',
    seo_title TEXT,
    seo_description TEXT,
    tags TEXT DEFAULT '[]',
    translation_status TEXT NOT NULL DEFAULT 'pending',
    source_hash TEXT,
    error_message TEXT,
    created_at INTEGER,
    updated_at INTEGER
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_product_translations_product_locale
    ON product_translations(product_id, locale)`,
  `CREATE TABLE IF NOT EXISTS news_translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    news_id INTEGER NOT NULL REFERENCES news(id),
    locale TEXT NOT NULL,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    seo_title TEXT,
    keywords TEXT,
    translation_status TEXT NOT NULL DEFAULT 'pending',
    source_hash TEXT,
    error_message TEXT,
    created_at INTEGER,
    updated_at INTEGER
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_news_translations_news_locale
    ON news_translations(news_id, locale)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_news_translations_locale_slug
    ON news_translations(locale, slug)`,
  `CREATE TABLE IF NOT EXISTS static_translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    locale TEXT NOT NULL,
    namespace TEXT NOT NULL,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    translation_status TEXT NOT NULL DEFAULT 'translated',
    source_hash TEXT,
    updated_at INTEGER
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_static_translations_locale_key
    ON static_translations(locale, namespace, key)`,
];

async function main() {
  for (const sql of statements) {
    await client.execute(sql);
  }
  console.log("i18n translation tables are ready.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
