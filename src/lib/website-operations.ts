import { timingSafeEqual } from "node:crypto";
import { db } from "@/db";

const day = 86400;
const client = db.$client;

export function isWebsiteJob(request: Request) {
  const secret = process.env.TEAO_JOBS_SECRET;
  if (!secret || secret.length < 32) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const actual = Buffer.from(request.headers.get("authorization") ?? "");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function inquiryReplyHours() {
  const value = Number(process.env.INQUIRY_REPLY_HOURS);
  return Number.isFinite(value) && value >= 1 && value <= 168 ? value : 24;
}

export async function getOperationsSummary() {
  const now = Math.floor(Date.now() / 1000);
  const periodStart = now - 28 * day;
  const results = await client.batch([
    {
      sql: `SELECT
        SUM(status IN ('pending', 'following_up') AND quality <> 'spam') AS open,
        SUM(status IN ('pending', 'following_up') AND quality <> 'spam'
            AND first_human_reply_at IS NULL AND created_at <= ?) AS overdue,
        AVG(CASE WHEN first_human_reply_at >= ? THEN
            (first_human_reply_at - created_at) / 3600.0 END) AS reply_hours,
        SUM(CASE WHEN created_at >= ? AND quality = 'valid'
          AND json_extract(attribution, '$.channel') = 'organic' THEN 1 ELSE 0 END) AS organic_current,
        SUM(CASE WHEN created_at >= ? AND created_at < ? AND quality = 'valid'
          AND json_extract(attribution, '$.channel') = 'organic' THEN 1 ELSE 0 END) AS organic_prior
        FROM contact_inquiries`,
      args: [now - inquiryReplyHours() * 3600, periodStart, periodStart, periodStart - 28 * day, periodStart],
    },
    "SELECT COUNT(*) AS count FROM inquiry_drafts",
    {
      sql: `SELECT kind, status, COUNT(*) AS count FROM inquiry_mail_jobs
        WHERE created_at >= ? OR status IN ('pending','processing','failed')
        GROUP BY kind, status ORDER BY kind, status`,
      args: [periodStart],
    },
    {
      sql: `SELECT COUNT(*) AS count FROM inquiry_mail_jobs
        WHERE status IN ('pending','processing') AND created_at <= ?`,
      args: [now - 900],
    },
    {
      sql: `SELECT COUNT(*) AS count FROM analytics_events
        WHERE event = 'form_save_failed' AND created_at >= ?`,
      args: [now - day],
    },
    {
      sql: `SELECT COALESCE(json_extract(attribution, '$.channel'), 'unknown') AS channel,
        COALESCE(json_extract(attribution, '$.landingPage'), '—') AS landing,
        COUNT(*) AS inquiries, SUM(quality = 'valid') AS valid
        FROM contact_inquiries WHERE created_at >= ?
        GROUP BY channel, landing ORDER BY valid DESC, inquiries DESC LIMIT 30`,
      args: [periodStart],
    },
    "SELECT name, last_success_at, last_error FROM website_operations_state WHERE name IN ('search-console', 'inquiry-mail')",
  ], "read");
  const [inquiries, drafts, mail, backlog, form, sources, jobs] = results.map(result => result.rows);
  return {
    open: Number(inquiries[0]?.open ?? 0),
    overdue: Number(inquiries[0]?.overdue ?? 0),
    replyHours: inquiries[0]?.reply_hours == null ? null : Number(inquiries[0].reply_hours),
    organicCurrent: Number(inquiries[0]?.organic_current ?? 0),
    organicPrior: Number(inquiries[0]?.organic_prior ?? 0),
    drafts: Number(drafts[0]?.count ?? 0),
    backlog: Number(backlog[0]?.count ?? 0),
    formFailures: Number(form[0]?.count ?? 0),
    mail,
    sources,
    jobs,
  };
}
