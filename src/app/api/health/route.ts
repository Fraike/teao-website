import { db } from "@/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.$client.batch([
      "SELECT id FROM categories LIMIT 1",
      "SELECT submission_key, attribution, first_human_reply_at FROM contact_inquiries LIMIT 0",
      "SELECT id FROM inquiry_mail_jobs LIMIT 0",
      "SELECT 1 FROM website_operations_state LIMIT 0",
      "SELECT 1 FROM gsc_connection LIMIT 0",
    ], "read");
    return new Response("ok", { headers: { "Cache-Control": "no-store" } });
  } catch {
    return new Response("unavailable", { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
