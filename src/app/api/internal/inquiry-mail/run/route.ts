import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { runInquiryOutbox } from "@/lib/inquiry-outbox";

export async function POST(request: Request) {
  const secret = process.env.TEAO_JOBS_SECRET;
  const actual = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret ?? ""}`);
  if (!secret || actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const processed = await runInquiryOutbox();
  return NextResponse.json({ processed });
}
