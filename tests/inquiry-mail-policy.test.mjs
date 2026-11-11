import assert from "node:assert/strict";
import { test } from "node:test";
import {
  automaticRetryAt,
  canRetryMail,
  deliveryStatus,
} from "../src/lib/inquiry-mail-policy.ts";

test("limits automatic retries and respects the provider deduplication window", () => {
  const now = new Date("2026-11-09T01:00:00Z");
  assert.equal(automaticRetryAt(1, now, now)?.toISOString(), "2026-11-09T01:01:00.000Z");
  assert.equal(automaticRetryAt(3, now, now), null);
  assert.equal(automaticRetryAt(1, new Date("2026-11-08T00:00:00Z"), now), null);
  assert.equal(canRetryMail("failed", null, now, null), true);
  assert.equal(canRetryMail("failed", now, now, "email-id"), false);
  assert.equal(canRetryMail("bounced", now, now, "email-id"), false);
});

test("maps provider events to delivery states", () => {
  assert.equal(deliveryStatus("email.delivered"), "delivered");
  assert.equal(deliveryStatus("email.bounced"), "bounced");
  assert.equal(deliveryStatus("email.suppressed"), "failed");
  assert.equal(deliveryStatus("email.opened"), null);
});
