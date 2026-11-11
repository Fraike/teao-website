import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { buildGoogleAuthorization, getGoogleConfig } from "@/lib/search-console-oauth";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return new NextResponse("请先登录后台。", { status: 401 });

  const config = getGoogleConfig();
  if (!config) return new NextResponse("尚未配置 Google 搜索数据接入。", { status: 428 });
  if (request.headers.get("origin") !== config.redirectUri.origin) {
    return new NextResponse("后台访问地址与 Google OAuth 回调地址不一致。请使用配置的访问地址。", { status: 403 });
  }

  const state = randomBytes(32).toString("base64url");
  const verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  const response = NextResponse.redirect(buildGoogleAuthorization(config, state, challenge), 303);
  response.cookies.set("teao_gsc_state", JSON.stringify({ state, verifier, username: session.username }), {
    httpOnly: true,
    secure: config.redirectUri.protocol === "https:",
    sameSite: "lax",
    path: "/api/admin/search-console/callback",
    maxAge: 600,
  });
  return response;
}
