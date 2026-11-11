import { NextResponse } from "next/server";
import { Resend, type WebhookEventPayload } from "resend";
import { deliveryStatus } from "@/lib/inquiry-mail-policy";
import { applyInquiryMailEvent } from "@/lib/inquiry-outbox";

export async function POST(request: Request) {
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  if (!webhookSecret) return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });

  let event: WebhookEventPayload;
  try {
    event = new Resend(process.env.RESEND_API_KEY || "webhook-verification").webhooks.verify({
      payload: await request.text(),
      headers: {
        id: request.headers.get("svix-id") ?? "",
        timestamp: request.headers.get("svix-timestamp") ?? "",
        signature: request.headers.get("svix-signature") ?? "",
      },
      webhookSecret,
    });
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  const status = deliveryStatus(event.type);
  if (status && "email_id" in event.data) {
    const eventAt = new Date(event.created_at);
    if (!Number.isFinite(eventAt.getTime())) {
      return NextResponse.json({ error: "Invalid event timestamp" }, { status: 400 });
    }
    await applyInquiryMailEvent({
      providerId: event.data.email_id,
      jobId: "tags" in event.data ? event.data.tags?.teao_inquiry_job : undefined,
      status,
      eventAt,
    });
  }
  return NextResponse.json({ success: true });
}
