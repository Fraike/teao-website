import { and, asc, eq, isNull, lt, lte, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { contactInquiries, inquiryMailJobs } from "@/db/schema";
import { InquiryMailError, sendInquiryMail, type InquiryMailPayload } from "@/lib/email";
import { automaticRetryAt, withinMailRetryWindow } from "@/lib/inquiry-mail-policy";

type MailJob = typeof inquiryMailJobs.$inferSelect;
type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
type DeliveryStatus = Extract<MailJob["status"], "accepted" | "delivered" | "bounced" | "failed">;

export function newInquiryMailJob(inquiryId: number, kind: MailJob["kind"], payload: InquiryMailPayload, approvedBy?: string) {
  const now = new Date();
  return {
    id: crypto.randomUUID(),
    inquiryId,
    kind,
    payload: JSON.stringify(payload),
    approvedBy,
    createdAt: now,
    nextAttemptAt: now,
  };
}

async function recordHumanReply(tx: Transaction, inquiryId: number, sentAt: Date) {
  await tx.update(contactInquiries).set({
    firstHumanReplyAt: sql`CASE
      WHEN ${contactInquiries.firstHumanReplyAt} IS NULL OR ${contactInquiries.firstHumanReplyAt} > ${Math.floor(sentAt.getTime() / 1000)}
      THEN ${Math.floor(sentAt.getTime() / 1000)}
      ELSE ${contactInquiries.firstHumanReplyAt}
    END`,
    status: sql`CASE WHEN ${contactInquiries.status} = 'closed' THEN 'closed' ELSE 'replied' END`,
  }).where(eq(contactInquiries.id, inquiryId));
}

function readyToSend(now: Date) {
  return or(
    and(eq(inquiryMailJobs.status, "pending"), lte(inquiryMailJobs.nextAttemptAt, now)),
    and(eq(inquiryMailJobs.status, "processing"), lte(inquiryMailJobs.leaseUntil, now)),
  );
}

async function processJob(id: string) {
  const now = new Date();
  const [job] = await db.update(inquiryMailJobs).set({
    status: "processing",
    leaseUntil: new Date(now.getTime() + 120_000),
    attempts: sql`${inquiryMailJobs.attempts} + 1`,
    firstAttemptAt: sql`coalesce(${inquiryMailJobs.firstAttemptAt}, ${Math.floor(now.getTime() / 1000)})`,
  }).where(and(eq(inquiryMailJobs.id, id), readyToSend(now))).returning();
  if (!job) return false;

  const claim = and(eq(inquiryMailJobs.id, id), eq(inquiryMailJobs.status, "processing"), eq(inquiryMailJobs.attempts, job.attempts));
  const firstAttempt = job.firstAttemptAt ?? now;

  let providerId: string;
  try {
    if (!withinMailRetryWindow(firstAttempt, now)) {
      throw new InquiryMailError("Retry window expired. Check Resend before sending again.", false);
    }
    providerId = await sendInquiryMail(id, JSON.parse(job.payload) as InquiryMailPayload);
  } catch (error) {
    const retryable = !(error instanceof InquiryMailError) || error.retryable;
    const nextAttempt = retryable ? automaticRetryAt(job.attempts, firstAttempt, new Date()) : null;
    await db.update(inquiryMailJobs).set({
      status: nextAttempt ? "pending" : "failed",
      nextAttemptAt: nextAttempt ?? now,
      leaseUntil: null,
      lastError: error instanceof InquiryMailError ? error.message : "Resend request failed or timed out.",
    }).where(claim);
    return true;
  }

  const sentAt = new Date();
  await db.transaction(async (tx) => {
    const [accepted] = await tx.update(inquiryMailJobs).set({
      status: "accepted",
      sentAt,
      providerId,
      leaseUntil: null,
      lastError: null,
    }).where(claim).returning({ kind: inquiryMailJobs.kind });
    if (accepted?.kind === "reply") await recordHumanReply(tx, job.inquiryId, sentAt);
  });
  return true;
}

export async function runInquiryOutbox(limit = 10) {
  const due = await db.select({ id: inquiryMailJobs.id }).from(inquiryMailJobs)
    .where(readyToSend(new Date())).orderBy(asc(inquiryMailJobs.nextAttemptAt)).limit(limit);
  let processed = 0;
  for (const { id } of due) {
    if (await processJob(id)) processed++;
  }
  return processed;
}

export async function applyInquiryMailEvent(event: {
  providerId: string;
  jobId?: string;
  status: DeliveryStatus;
  eventAt: Date;
}) {
  await db.transaction(async (tx) => {
    const identity = or(
      eq(inquiryMailJobs.providerId, event.providerId),
      event.jobId
        ? and(eq(inquiryMailJobs.id, event.jobId), isNull(inquiryMailJobs.providerId))
        : undefined,
    );
    const newer = or(isNull(inquiryMailJobs.providerEventAt), lt(inquiryMailJobs.providerEventAt, event.eventAt));
    const [updated] = await tx.update(inquiryMailJobs).set({
      status: event.status,
      providerId: event.providerId,
      providerEventAt: event.eventAt,
      sentAt: sql`coalesce(${inquiryMailJobs.sentAt}, ${Math.floor(event.eventAt.getTime() / 1000)})`,
      leaseUntil: null,
      lastError: event.status === "failed" || event.status === "bounced"
        ? `Resend reported ${event.status === "failed" ? "a delivery failure" : "a bounce"}.`
        : null,
    }).where(and(identity, newer, event.status === "accepted"
      ? sql`${inquiryMailJobs.status} NOT IN ('delivered', 'bounced') AND (${inquiryMailJobs.status} != 'failed' OR ${inquiryMailJobs.providerId} IS NULL)`
      : undefined))
      .returning({ inquiryId: inquiryMailJobs.inquiryId, kind: inquiryMailJobs.kind, sentAt: inquiryMailJobs.sentAt });
    if (updated?.kind === "reply" && updated.sentAt && (event.status === "accepted" || event.status === "delivered")) {
      await recordHumanReply(tx, updated.inquiryId, updated.sentAt);
    }
  });
}
