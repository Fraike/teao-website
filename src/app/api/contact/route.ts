import { NextResponse } from "next/server";
import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { analyticsEvents, contactInquiries, inquiryMailJobs } from "@/db/schema";
import { inquiryMail, inquiryMailbox } from "@/lib/email";
import { verifyInquiryChallenge } from "@/lib/inquiry-challenge";
import { parseInquiryAttribution } from "@/lib/inquiry-attribution";
import { newInquiryMailJob } from "@/lib/inquiry-outbox";
import { getClientIP, checkRateLimit } from "@/lib/rate-limit";

const emailPattern = /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/;
const productTopics: Record<string, string> = {
  "gear-damper": "Gear / Rotary Dampers",
  "axial-damper": "Axial Dampers",
  "glove-box-damper": "Glove Box Dampers",
  latch: "Latches",
};

function field(value: unknown, length: number) {
  return typeof value === "string" ? value.trim().slice(0, length) : "";
}

export async function POST(request: Request) {
  const ip = getClientIP(request);
  if (!checkRateLimit(`contact:${ip}`, 5, 15 * 60 * 1000).allowed) {
    return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  const name = field(body.name, 160);
  const email = field(body.email, 255);
  const message = field(body.message, 8000);
  if (body.website) {
    return NextResponse.json({ error: "Submission rejected." }, { status: 400 });
  }
  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  }
  if (body.privacyAccepted !== true) {
    return NextResponse.json({ error: "Please agree to the Privacy Policy before submitting." }, { status: 400 });
  }
  const captchaAnswer = field(body.captchaAnswer, 32).toUpperCase();
  if (!/^[A-Z0-9]+$/.test(captchaAnswer) || btoa(captchaAnswer) !== body.captchaToken) {
    return NextResponse.json({ error: "Verification code is incorrect." }, { status: 400 });
  }
  if (typeof body.email !== "string" || body.email.trim().length > 255 || !emailPattern.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const submissionKey = typeof body.submissionKey === "string" && /^[a-zA-Z0-9_-]{16,80}$/.test(body.submissionKey)
    ? body.submissionKey
    : null;
  const attribution = parseInquiryAttribution(body.attribution);
  const productInterest = field(body.productInterest, 250) || null;

  const allowAcknowledgment = process.env.NODE_ENV !== "production" || await verifyInquiryChallenge(body.turnstileToken);

  try {
    await db.transaction(async (tx) => {
      const [inquiry] = await tx.insert(contactInquiries).values({
        name,
        email,
        message,
        company: field(body.company, 250) || null,
        phone: field(body.phone, 80) || null,
        country: field(body.country, 100) || null,
        annualVolume: field(body.annualVolume, 160) || null,
        productInterest,
        submissionKey,
        attribution: attribution ? JSON.stringify(attribution) : null,
      }).onConflictDoNothing({ target: contactInquiries.submissionKey }).returning();
      if (!inquiry) return;

      const subject = `TEAO inquiry #${inquiry.id}`;
      const notification = [
        `Name: ${inquiry.name}`,
        `Email: ${inquiry.email}`,
        `Company: ${inquiry.company || "—"}`,
        `Phone: ${inquiry.phone || "—"}`,
        `Country: ${inquiry.country || "—"}`,
        `Product interest: ${inquiry.productInterest || "—"}`,
        `Annual volume: ${inquiry.annualVolume || "—"}`,
        "",
        inquiry.message,
      ].join("\n");
      const jobs = [
        newInquiryMailJob(inquiry.id, "notification", inquiryMail(inquiryMailbox, `New ${subject}`, notification, inquiry.email)),
      ];

      // Cap acknowledgments to a single recipient even if a client uses many submission keys.
      const recent = await tx.select({ id: inquiryMailJobs.id }).from(inquiryMailJobs)
        .innerJoin(contactInquiries, eq(inquiryMailJobs.inquiryId, contactInquiries.id))
        .where(and(
          eq(inquiryMailJobs.kind, "acknowledgment"),
          sql`lower(${contactInquiries.email}) = lower(${email})`,
          gte(inquiryMailJobs.createdAt, new Date(Date.now() - 86_400_000)),
        )).limit(3);
      if (allowAcknowledgment && recent.length < 3) {
        const topic = productInterest && Object.hasOwn(productTopics, productInterest)
          ? productTopics[productInterest]
          : "Engineering and product inquiry";
        const acknowledgment = [
          "Thank you for contacting TEAO. Our team has received your inquiry.",
          "",
          `Inquiry number: #${inquiry.id}`,
          `Request summary: ${topic}`,
          "",
          `You can reply to this message or contact us at ${inquiryMailbox} with any additional details.`,
          "",
          "TEAO",
        ].join("\n");
        jobs.push(newInquiryMailJob(inquiry.id, "acknowledgment", inquiryMail(email, `${subject} received`, acknowledgment)));
      }
      await tx.insert(inquiryMailJobs).values(jobs);
    });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    console.error("Failed to save contact inquiry and mail tasks.");
    try {
      await db.insert(analyticsEvents).values({
        event: "form_save_failed",
        page: attribution?.submissionPage ?? "/contact",
        sessionId: "server",
      });
    } catch {
      console.error("Failed to record contact form save failure.");
    }
    return NextResponse.json({ error: "Failed to submit inquiry. Please try again." }, { status: 500 });
  }
}
