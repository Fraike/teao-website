import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { verifyPassword, createToken, setSession, hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    let admin = db.select().from(admins).where(eq(admins.username, username)).get();

    // Auto-create first admin if none exists
    if (!admin) {
      const count = db.select().from(admins).all();
      if (count.length === 0) {
        const hash = await hashPassword(password);
        db.insert(admins).values({ username, passwordHash: hash }).run();
        admin = db.select().from(admins).where(eq(admins.username, username)).get();
      }
    }

    if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await createToken(admin.username);
    await setSession(token);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
