import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { verifyPassword, createToken, setSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { username, password, captchaToken, captchaAnswer } = await request.json();
    if (!username || !password) {
      return NextResponse.json({ error: "请输入账号和密码。" }, { status: 400 });
    }

    if (!captchaToken || !captchaAnswer || btoa(String(captchaAnswer).toUpperCase()) !== captchaToken) {
      return NextResponse.json({ error: "验证码错误，请重试。" }, { status: 400 });
    }

    const admin = await db.select().from(admins).where(eq(admins.username, username)).get();

    if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
      return NextResponse.json({ error: "账号或密码不正确。" }, { status: 401 });
    }

    const token = await createToken(admin.username);
    await setSession(token);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "登录失败，请稍后重试。" }, { status: 500 });
  }
}
