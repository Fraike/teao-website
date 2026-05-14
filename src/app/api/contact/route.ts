import { NextResponse } from "next/server";
import { db } from "@/db";
import { contactInquiries } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, email, phone, country, productInterest, annualVolume, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    db.insert(contactInquiries).values({
      name,
      company: company || null,
      email,
      phone: phone || null,
      country: country || null,
      productInterest: productInterest || null,
      annualVolume: annualVolume || null,
      message,
    }).run();

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Contact inquiry error:", error);
    return NextResponse.json({ error: "Failed to submit inquiry. Please try again." }, { status: 500 });
  }
}
