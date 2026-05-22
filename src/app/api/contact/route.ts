import { NextResponse } from "next/server";
import { db } from "@/db";
import { contactInquiries } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      company,
      email,
      phone,
      country,
      productInterest,
      annualVolume,
      message,
      privacyAccepted,
      captchaA,
      captchaB,
      captchaAnswer,
      website,
    } = body;

    if (website) {
      return NextResponse.json({ error: "Submission rejected." }, { status: 400 });
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    if (privacyAccepted !== true) {
      return NextResponse.json({ error: "Please agree to the Privacy Policy before submitting." }, { status: 400 });
    }

    const expectedCaptcha = Number(captchaA) + Number(captchaB);
    if (!Number.isFinite(expectedCaptcha) || Number(captchaAnswer) !== expectedCaptcha) {
      return NextResponse.json({ error: "Verification code is incorrect." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    await db.insert(contactInquiries).values({
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
