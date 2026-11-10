import assert from "node:assert/strict";
import test from "node:test";
import { verifyInquiryChallenge } from "../src/lib/inquiry-challenge.ts";

test("accepts only a successful challenge for this site and inquiry action", async () => {
  const oldFetch = globalThis.fetch;
  const previousSecret = process.env.TURNSTILE_SECRET_KEY;
  process.env.TURNSTILE_SECRET_KEY = "fixture-secret";
  try {
    globalThis.fetch = async () => Response.json({ success: true, action: "contact", hostname: "teao-damper.com" });
    assert.equal(await verifyInquiryChallenge("fixture-token"), true);
    globalThis.fetch = async () => Response.json({ success: true, action: "login", hostname: "teao-damper.com" });
    assert.equal(await verifyInquiryChallenge("fixture-token"), false);
    assert.equal(await verifyInquiryChallenge(null), false);
  } finally {
    globalThis.fetch = oldFetch;
    if (previousSecret === undefined) delete process.env.TURNSTILE_SECRET_KEY;
    else process.env.TURNSTILE_SECRET_KEY = previousSecret;
  }
});
