const { existsSync } = require("node:fs");
const { loadEnvConfig } = require("@next/env");

process.env.NODE_ENV = "production";
loadEnvConfig(process.cwd(), false);

const env = process.env;
const siteOrigin = "https://teao-damper.com";
const modelProvider = env.TRANSLATION_PROVIDER || "openai";
const errors = [];

const required = [
  "AUTH_SECRET",
  "TEAO_JOBS_SECRET",
  "RESEND_API_KEY",
  "RESEND_DOMAIN",
  "RESEND_WEBHOOK_SECRET",
  "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
  "TURNSTILE_SECRET_KEY",
  "GSC_CLIENT_ID",
  "GSC_CLIENT_SECRET",
  "GSC_REDIRECT_URI",
  "GSC_TOKEN_KEY",
];
if (modelProvider === "openai") required.push("OPENAI_API_KEY");
else if (modelProvider === "deepseek") required.push("DEEPSEEK_API_KEY");
else errors.push("TRANSLATION_PROVIDER must be openai or deepseek.");

for (const name of required) {
  if (!env[name]?.trim()) errors.push(`${name} is missing.`);
}
if (env.TEAO_JOBS_SECRET && env.TEAO_JOBS_SECRET.length < 32) {
  errors.push("TEAO_JOBS_SECRET must have at least 32 characters.");
}
if (env.RESEND_WEBHOOK_SECRET && !/^whsec_[A-Za-z0-9+/]+={0,2}$/.test(env.RESEND_WEBHOOK_SECRET)) {
  errors.push("RESEND_WEBHOOK_SECRET must be the signing secret from Resend.");
}
if (env.GSC_TOKEN_KEY && Buffer.from(env.GSC_TOKEN_KEY, "base64").toString("base64") !== env.GSC_TOKEN_KEY) {
  errors.push("GSC_TOKEN_KEY must use canonical base64 encoding.");
} else if (env.GSC_TOKEN_KEY && Buffer.from(env.GSC_TOKEN_KEY, "base64").length !== 32) {
  errors.push("GSC_TOKEN_KEY must decode to 32 bytes.");
}
if (env.GSC_REDIRECT_URI && env.GSC_REDIRECT_URI !== `${siteOrigin}/api/admin/search-console/callback`) {
  errors.push("GSC_REDIRECT_URI must match the production callback.");
}
if (env.NEXT_PUBLIC_SITE_URL && ![siteOrigin, `${siteOrigin}/`].includes(env.NEXT_PUBLIC_SITE_URL)) {
  errors.push("NEXT_PUBLIC_SITE_URL must match the production site.");
}
if (env.TURSO_DATABASE_URL || env.TURSO_AUTH_TOKEN) {
  errors.push("This release procedure targets the production SQLite file.");
}
if (!existsSync("data/teao.db")) errors.push("The production SQLite file is missing from the release directory.");

const port = env.PORT || "3000";
if (env.TEAO_JOBS_URL) {
  let valid = false;
  try {
    const url = new URL(env.TEAO_JOBS_URL);
    valid = url.protocol === "http:" && ["127.0.0.1", "localhost", "[::1]"].includes(url.hostname)
      && (url.port || "80") === port && !url.username && !url.password;
  } catch {
    // Report an invalid URL without printing the configured value.
  }
  if (!valid) errors.push("TEAO_JOBS_URL must point to the same loopback port as the website.");
}

if (errors.length) {
  for (const error of errors) console.error(error);
  process.exitCode = 1;
} else {
  console.log("Production settings and SQLite path passed preflight.");
}
