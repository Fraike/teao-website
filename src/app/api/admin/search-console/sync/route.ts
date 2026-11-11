import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { adminErrorLabel } from "@/lib/admin-labels";
import { getSession } from "@/lib/auth";
import { SearchConsoleError } from "@/lib/search-console-google";
import { getGoogleConfig } from "@/lib/search-console-oauth";
import { searchConsoleErrorMessage, syncSearchConsole } from "@/lib/search-console";

function isWorker(request: Request) {
  const secret = process.env.TEAO_JOBS_SECRET;
  if (!secret) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const actual = Buffer.from(request.headers.get("authorization") ?? "");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function POST(request: Request) {
  if (!isWorker(request)) {
    if (!await getSession()) return NextResponse.json({ error: "请先登录后台。" }, { status: 401 });
    const config = getGoogleConfig();
    if (!config || request.headers.get("origin") !== config.redirectUri.origin) {
      return NextResponse.json({ error: "后台访问地址与 Google OAuth 回调地址不一致。请使用配置的访问地址。" }, { status: 403 });
    }
  }

  try {
    return NextResponse.json(await syncSearchConsole());
  } catch (error) {
    return NextResponse.json(
      { error: adminErrorLabel(searchConsoleErrorMessage(error), "同步 Google 搜索数据失败，请重试。") },
      { status: error instanceof SearchConsoleError ? error.status : 500 },
    );
  }
}
