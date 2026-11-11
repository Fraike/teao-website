import { Resend } from "resend";
import { db } from "@/db";
import { getOperationsSummary, isWebsiteJob } from "@/lib/website-operations";

export async function POST(request: Request) {
  if (!isWebsiteJob(request)) return new Response(null, { status: 401 });
  const input = await request.json().catch(() => null);
  if (!input || !["search-console", "inquiry-mail", "alerts"].includes(input.job)) {
    return new Response(null, { status: 400 });
  }
  const client = db.$client;
  if (input.job !== "alerts") {
    const error = typeof input.error === "string" ? input.error.slice(0, 150) : null;
    await client.execute({
      sql: `INSERT INTO website_operations_state (name, last_success_at, last_error) VALUES (?, ?, ?)
        ON CONFLICT(name) DO UPDATE SET last_success_at = COALESCE(excluded.last_success_at, last_success_at),
        last_error = excluded.last_error`,
      args: [input.job, error ? null : Math.floor(Date.now() / 1000), error],
    });
    return new Response(null, { status: 204 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return new Response(null, { status: 204 });
  const summary = await getOperationsSummary();
  const hasFailure = summary.jobs.some(row => row.last_error && row.last_error !== "Google authorization required");
  const mailFailed = summary.mail.some(row => row.status === "failed" || row.status === "bounced");
  if (!summary.overdue && !summary.backlog && !summary.formFailures && !hasFailure && !mailFailed) {
    return new Response(null, { status: 204 });
  }

  const date = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" }).format();
  const key = `teao-operations-${date}`;
  const sent = await client.execute("SELECT last_alert_key FROM website_operations_state WHERE name = 'alerts'");
  if (sent.rows[0]?.last_alert_key === key) return new Response(null, { status: 204 });
  const domain = process.env.RESEND_DOMAIN || "teao-damper.com";
  const url = new URL("/admin/operations", process.env.NEXT_PUBLIC_SITE_URL || "https://teao-damper.com");
  const { data, error } = await new Resend(apiKey).emails.send({
    from: `TEAO Website <notify@${domain}>`,
    to: process.env.NOTIFY_EMAIL || "info@chinateao.com",
    subject: "TEAO website operations needs attention",
    text: `Review pending inquiries and website issues in TEAO Admin.\n${url.href}`,
  }, { idempotencyKey: key });
  if (error || !data?.id) return new Response(null, { status: 502 });
  await client.execute({
    sql: `INSERT INTO website_operations_state (name, last_alert_key) VALUES ('alerts', ?)
      ON CONFLICT(name) DO UPDATE SET last_alert_key = excluded.last_alert_key`,
    args: [key],
  });
  return new Response(null, { status: 204 });
}
