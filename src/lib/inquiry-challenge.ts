export async function verifyInquiryChallenge(token: unknown) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || typeof token !== "string" || !token || token.length > 2048) return false;
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return false;
    const result = await response.json();
    const hostname = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://teao-damper.com").hostname;
    return result.success === true && result.action === "contact" && result.hostname === hostname;
  } catch {
    return false;
  }
}
