import { NextResponse } from "next/server";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { contactInquiries, inquiryDrafts, inquiryMailJobs } from "@/db/schema";
import { adminErrorLabel } from "@/lib/admin-labels";
import { getSession } from "@/lib/auth";
import { inquiryMail, type InquiryMailPayload } from "@/lib/email";
import { generateInquiryDraft } from "@/lib/inquiry-draft";
import { canRetryMail } from "@/lib/inquiry-mail-policy";
import { newInquiryMailJob } from "@/lib/inquiry-outbox";

export async function GET(request: Request) {
  if (!await getSession()) return NextResponse.json({ error: "请先登录后台。" }, { status: 401 });

  const id = Number(new URL(request.url).searchParams.get("id"));
  if (Number.isSafeInteger(id) && id > 0) {
    const [draft, mail] = await Promise.all([
      db.select().from(inquiryDrafts).where(eq(inquiryDrafts.inquiryId, id)).get(),
      db.select().from(inquiryMailJobs).where(eq(inquiryMailJobs.inquiryId, id)).orderBy(desc(inquiryMailJobs.createdAt)),
    ]);
    return NextResponse.json({
      draft: draft ? { ...draft, sources: JSON.parse(draft.sources) } : null,
      mail: mail.map(({ payload, firstAttemptAt, providerId, ...job }) => ({
        ...job,
        providerId,
        retryable: canRetryMail(job.status, firstAttemptAt, new Date(), providerId),
        body: job.kind === "reply" ? (JSON.parse(payload) as InquiryMailPayload).text : null,
      })),
    });
  }

  const rows = await db.select().from(contactInquiries).orderBy(desc(contactInquiries.createdAt));
  return NextResponse.json(rows.map(({ submissionKey: _submissionKey, ...inquiry }) => inquiry));
}

const states = ["pending", "following_up", "replied", "closed"] as const;
const qualities = ["pending", "valid", "spam"] as const;
type FollowUpStatus = typeof states[number];
type InquiryQuality = typeof qualities[number];

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "请先登录后台。" }, { status: 401 });

  const origin = request.headers.get("origin");
  const expectedOrigin = new URL(process.env.NEXT_PUBLIC_SITE_URL || request.url).origin;
  if (origin && origin !== expectedOrigin) return NextResponse.json({ error: "请求来源不匹配，请使用正确的后台地址。" }, { status: 403 });
  const data = await request.json().catch(() => null);
  const id = Number(data?.id);
  if (!Number.isSafeInteger(id) || id <= 0) return NextResponse.json({ error: "缺少有效的询盘编号。" }, { status: 400 });

  try {
    const inquiry = await db.select().from(contactInquiries).where(eq(contactInquiries.id, id)).get();
    if (!inquiry) return NextResponse.json({ error: "未找到该询盘。" }, { status: 404 });
    const stale = () => NextResponse.json({ error: "该询盘已变更，请刷新后重试。" }, { status: 409 });

    switch (data.action) {
      case "update": {
        const status = data.status as FollowUpStatus;
        const quality = data.quality as InquiryQuality;
        if (!states.includes(status) || !qualities.includes(quality)) {
          return NextResponse.json({ error: "请选择有效的询盘状态和质量。" }, { status: 400 });
        }
        await db.update(contactInquiries).set({
          status,
          quality,
          firstHumanReplyAt: status === "replied"
            ? sql`coalesce(${contactInquiries.firstHumanReplyAt}, ${Math.floor(Date.now() / 1000)})`
            : undefined,
        }).where(eq(contactInquiries.id, id));
        break;
      }
      case "generate":
      case "save": {
        const previousVersion = typeof data.version === "string" ? data.version : null;
        const existing = await db.select().from(inquiryDrafts).where(eq(inquiryDrafts.inquiryId, id)).get();
        if ((existing?.version ?? null) !== previousVersion) return stale();

        const generated = data.action === "generate" ? await generateInquiryDraft(inquiry) : null;
        const body = generated?.body ?? (typeof data.body === "string" ? data.body.trim() : "");
        if (!body || body.length > 8000) return NextResponse.json({ error: "请输入回复内容，最多 8,000 个字符。" }, { status: 400 });

        const values = {
          body,
          sources: generated ? JSON.stringify(generated.sources) : existing?.sources ?? "[]",
          version: crypto.randomUUID(),
          updatedAt: new Date(),
        };
        const updated = previousVersion
          ? await db.update(inquiryDrafts).set(values).where(and(eq(inquiryDrafts.inquiryId, id), eq(inquiryDrafts.version, previousVersion))).returning()
          : await db.insert(inquiryDrafts).values({ inquiryId: id, ...values }).onConflictDoNothing().returning();
        if (!updated.length) return stale();
        break;
      }
      case "approve": {
        if (typeof data.version !== "string") return stale();
        const queued = await db.transaction(async (tx) => {
          const [reviewed] = await tx.delete(inquiryDrafts).where(and(
            eq(inquiryDrafts.inquiryId, id),
            eq(inquiryDrafts.version, data.version),
          )).returning();
          if (!reviewed) return false;

          const payload = inquiryMail(inquiry.email, `Re: TEAO inquiry #${id}`, reviewed.body);
          await tx.insert(inquiryMailJobs).values(newInquiryMailJob(id, "reply", payload, session.username));
          await tx.update(contactInquiries).set({ status: "following_up" })
            .where(and(eq(contactInquiries.id, id), eq(contactInquiries.status, "pending")));
          return true;
        });
        if (!queued) return stale();
        break;
      }
      case "retry": {
        if (typeof data.jobId !== "string") return stale();
        const job = await db.select().from(inquiryMailJobs)
          .where(and(eq(inquiryMailJobs.inquiryId, id), eq(inquiryMailJobs.id, data.jobId))).get();
        const now = new Date();
        if (!job || !canRetryMail(job.status, job.firstAttemptAt, now, job.providerId)) return stale();
        const updated = await db.update(inquiryMailJobs).set({
          status: "pending",
          attempts: 0,
          nextAttemptAt: now,
          lastError: null,
        }).where(and(eq(inquiryMailJobs.id, job.id), eq(inquiryMailJobs.status, "failed"), sql`${inquiryMailJobs.providerId} IS NULL`)).returning();
        if (!updated.length) return stale();
        break;
      }
      case "delete":
      case undefined: {
        const deleted = await db.transaction(async (tx) => {
          const active = await tx.select({ id: inquiryMailJobs.id }).from(inquiryMailJobs).where(and(
            eq(inquiryMailJobs.inquiryId, id),
            inArray(inquiryMailJobs.status, ["pending", "processing"]),
          )).get();
          if (active) return false;
          await tx.delete(inquiryDrafts).where(eq(inquiryDrafts.inquiryId, id));
          await tx.delete(inquiryMailJobs).where(eq(inquiryMailJobs.inquiryId, id));
          await tx.delete(contactInquiries).where(eq(contactInquiries.id, id));
          return true;
        });
        if (!deleted) return NextResponse.json({ error: "请等待该询盘的邮件发送完成后再删除。" }, { status: 409 });
        break;
      }
      default:
        return NextResponse.json({ error: "不支持此询盘操作。" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Inquiry action failed:", data.action);
    const message = data.action === "generate" && error instanceof Error && /^(A model provider|The model provider|The generated draft)/.test(error.message)
      ? adminErrorLabel(error.message, "无法生成草稿，请重试。")
      : "无法完成询盘操作，请重试。";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
