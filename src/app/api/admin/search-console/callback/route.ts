import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { saveSearchConsoleConnection } from "@/lib/search-console";
import { connectGoogle, getGoogleConfig } from "@/lib/search-console-oauth";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return new NextResponse("请先登录后台。", { status: 401 });

  const config = getGoogleConfig();
  if (!config) return new NextResponse("尚未配置 Google 搜索数据接入。", { status: 428 });
  const target = new URL("/admin/search-console", config.redirectUri);
  const value = (await cookies()).get("teao_gsc_state")?.value;
  let result = "failed";

  try {
    const saved = JSON.parse(value ?? "null") as { username: string; state: string; verifier: string } | null;
    const { searchParams } = request.nextUrl;
    const code = searchParams.get("code");
    if (saved && code && saved.username === session.username && saved.state === searchParams.get("state")) {
      const connection = await connectGoogle(config, code, saved.verifier);
      if (connection) {
        await saveSearchConsoleConnection(connection.property, connection.refreshToken);
        result = "connected";
      } else {
        result = "no-property";
      }
    }
  } catch {
    // Keep credentials and provider response details out of redirects and logs.
  }

  target.searchParams.set("connection", result);
  const response = NextResponse.redirect(target, 303);
  response.cookies.set("teao_gsc_state", "", {
    path: "/api/admin/search-console/callback",
    maxAge: 0,
    httpOnly: true,
    secure: config.redirectUri.protocol === "https:",
    sameSite: "lax",
  });
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
