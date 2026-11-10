export const inquiryMailbox = process.env.NOTIFY_EMAIL || "info@chinateao.com";
const inquirySender = `TEAO Website <notify@${process.env.RESEND_DOMAIN || "teao-damper.com"}>`;

export interface InquiryMailPayload {
  from: string;
  to: string[];
  reply_to: string;
  subject: string;
  text: string;
}

export function inquiryMail(to: string, subject: string, text: string, replyTo = inquiryMailbox): InquiryMailPayload {
  return { from: inquirySender, to: [to], reply_to: replyTo, subject, text };
}

export class InquiryMailError extends Error {
  constructor(message: string, public readonly retryable: boolean) {
    super(message);
  }
}

export async function sendInquiryMail(id: string, payload: InquiryMailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new InquiryMailError("Resend API key is not configured.", false);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `inquiry-mail/${id}`,
    },
    body: JSON.stringify({ ...payload, tags: [{ name: "teao_inquiry_job", value: id }] }),
    signal: AbortSignal.timeout(10_000),
  });

  const data = await response.json().catch(() => null) as { id?: string; name?: string } | null;
  if (response.ok && typeof data?.id === "string") return data.id;
  const retryable = response.ok || response.status === 429 || response.status >= 500
    || data?.name === "concurrent_idempotent_requests";
  const code = typeof data?.name === "string" && /^[a-z_]{1,80}$/.test(data.name) ? ` (${data.name})` : "";
  throw new InquiryMailError(`Resend returned HTTP ${response.status}${code}.`, retryable);
}
