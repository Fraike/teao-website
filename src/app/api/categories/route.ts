import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";

export async function GET() {
  const rows = db.select().from(categories).all();
  return NextResponse.json(rows);
}
