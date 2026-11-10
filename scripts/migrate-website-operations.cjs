const { existsSync, readdirSync, readFileSync } = require("node:fs");
const { join, resolve } = require("node:path");
const { pathToFileURL } = require("node:url");
const { createClient } = require("@libsql/client");

async function main() {
  const args = process.argv.slice(2);
  const dbArgument = args[args.indexOf("--db") + 1];
  const apply = args.includes("--apply");
  const requireCurrent = args.includes("--require-current");
  if (!args.includes("--db") || !dbArgument || dbArgument.startsWith("--") || (apply && requireCurrent)) {
    throw new Error("Usage: node scripts/migrate-website-operations.cjs --db <existing SQLite file> [--apply | --require-current]");
  }
  const path = resolve(dbArgument);
  if (!existsSync(path)) throw new Error("SQLite database does not exist.");
  const directory = join(__dirname, "migrations");
  const names = readdirSync(directory).filter(name => /^\d{3}-.*\.sql$/.test(name)).sort();
  const client = createClient({ url: pathToFileURL(path).href });
  try {
    const table = await client.execute("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'website_migrations'");
    const applied = table.rows.length
      ? new Set((await client.execute("SELECT name FROM website_migrations")).rows.map(row => row.name))
      : new Set();
    const pending = names.filter(name => !applied.has(name));
    console.log(pending.length ? `Pending migrations: ${pending.join(", ")}` : "No pending migrations.");
    if (pending.length && requireCurrent) {
      process.exitCode = 1;
      return;
    }
    if (!pending.length || !apply) return;

    const backup = `${path}.before-operations-${new Date().toISOString().replaceAll(":", "-")}.backup`;
    process.umask(0o077);
    await client.execute({ sql: "VACUUM INTO ?", args: [backup] });
    console.log(`Backup: ${backup}`);
    const transaction = await client.transaction("write");
    try {
      await transaction.execute("CREATE TABLE IF NOT EXISTS website_migrations (name TEXT PRIMARY KEY, applied_at TEXT NOT NULL)");
      for (const name of pending) {
        const alreadyApplied = await transaction.execute({ sql: "SELECT 1 FROM website_migrations WHERE name = ?", args: [name] });
        if (alreadyApplied.rows.length) continue;
        await transaction.executeMultiple(readFileSync(join(directory, name), "utf8"));
        await transaction.execute({
          sql: "INSERT INTO website_migrations (name, applied_at) VALUES (?, ?)",
          args: [name, new Date().toISOString()],
        });
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    } finally {
      transaction.close();
    }
  } finally {
    client.close();
  }
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
