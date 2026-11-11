import assert from "node:assert/strict";
import test from "node:test";
import { getVisitSource, parseInquiryAttribution } from "../src/lib/inquiry-attribution.ts";

test("classifies search, tagged traffic and direct traffic independently", () => {
  const site = "https://teao-damper.com";
  assert.equal(getVisitSource(new URL(site), "https://www.google.co.uk/search?q=private").channel, "organic");
  assert.equal(getVisitSource(new URL(site + "/?utm_source=google&utm_medium=cpc"), "").channel, "paid");
  assert.equal(getVisitSource(new URL(site), "").channel, "direct");
  assert.equal(getVisitSource(new URL(site), "https://www.teao-damper.com/products").channel, "unknown");
});

test("retains only bounded attribution fields and strips URL queries", () => {
  const entry = getVisitSource(new URL("https://teao-damper.com/ja/gear-damper?utm_campaign=show&email=private"), "https://example.com/customer?email=private");
  const result = parseInquiryAttribution({ ...entry, submissionPage: "/ja/contact?private=1", injected: true });
  assert.equal(result.landingPage, "/ja/gear-damper");
  assert.equal(result.submissionPage, "/ja/contact");
  assert.equal(result.locale, "ja");
  assert.equal(result.referrer, "example.com");
  assert.equal(result.campaign, "show");
  assert.equal(result.injected, undefined);
  assert.equal(parseInquiryAttribution(null), null);
});
