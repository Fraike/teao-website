import { Resend } from "resend";

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || "info@chinateao.com";

interface InquiryEmailParams {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  country?: string;
  productInterest?: string;
  annualVolume?: string;
  message: string;
}

export async function sendInquiryNotification(inquiry: InquiryEmailParams) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set, skipping email notification");
    return;
  }

  const resend = new Resend(apiKey);

  const fields = [
    ["Name", inquiry.name],
    ["Company", inquiry.company],
    ["Email", inquiry.email],
    ["Phone", inquiry.phone],
    ["Country", inquiry.country],
    ["Product Interest", inquiry.productInterest],
    ["Annual Volume", inquiry.annualVolume],
  ]
    .filter(([, v]) => v)
    .map(([k, v]) => `<p style="margin:4px 0"><strong>${k}:</strong> ${v}</p>`)
    .join("");

  const fromDomain = process.env.RESEND_DOMAIN || "teao-damper.com";
  const from = `TEAO Website <notify@${fromDomain}>`;

  try {
    const result = await resend.emails.send({
      from,
      to: [NOTIFY_EMAIL],
      subject: `New Inquiry: ${inquiry.productInterest || "General"} from ${inquiry.name}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:600px;padding:24px">
          <h2 style="color:#ED7606;margin:0 0 16px">New Contact Inquiry</h2>
          <div style="background:#F8F9FA;border-radius:12px;padding:20px;margin-bottom:16px">
            ${fields}
          </div>
          <h3 style="margin:0 0 8px;color:#111827">Message:</h3>
          <p style="color:#374151;line-height:1.6;white-space:pre-wrap">${inquiry.message}</p>
          <hr style="border:none;border-top:1px solid #E5E7EB;margin:20px 0" />
          <p style="color:#9CA3AF;font-size:12px">TEAO Website Inquiry System</p>
        </div>
      `,
    });
    console.log(`Inquiry email sent to ${NOTIFY_EMAIL}, Resend ID: ${result.data?.id || "unknown"}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Failed to send inquiry email:", message);
    console.error("  From:", from);
    console.error("  To:", NOTIFY_EMAIL);
    console.error("  Resend Domain:", fromDomain);
    // Re-throw to let the API route log it
    throw err;
  }
}
