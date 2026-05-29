import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { analyticsEvents } from "@/db/schema";
import { getClientIP, checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    if (!checkRateLimit(`analytics:${ip}`, 100, 60 * 1000).allowed) {
      return new NextResponse(null, { status: 204 });
    }

    const body = await request.json();
    const { event, page, targetType, targetId, source, metadata, sessionId } = body;
    const sid = sessionId || "unknown";

    if (!event || !page) {
      return NextResponse.json({ error: "event and page are required" }, { status: 400 });
    }

    const allowed = ["page_view", "product_click", "scene_click", "cta_click", "category_click", "search", "search_open", "search_result_click", "form_submit"];
    if (!allowed.includes(event)) {
      return NextResponse.json({ error: "invalid event type" }, { status: 400 });
    }

    await db.insert(analyticsEvents).values({
      event,
      page,
      targetType: targetType || null,
      targetId: targetId || null,
      source: source || null,
      metadata: metadata ? JSON.stringify(metadata) : null,
      sessionId: sid,
    }).run();

    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "internal server error" }, { status: 500 });
  }
}
