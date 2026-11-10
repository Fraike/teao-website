import assert from "node:assert/strict";
import { test } from "node:test";
import { damperGuides, getGuideBody, getDamperInquiryUrl } from "../src/lib/growth-content.ts";

test("glove box guide retains its existing takeaways and removes the duplicate page heading", () => {
  const content = "<h1>Original article title</h1><h2>Key Takeaways</h2><ul><li>Keep this</li></ul><h2>Selection Parameters</h2><p>Selection details</p><h2>Engineering Checklist</h2><p>Keep this too</p>";
  const body = getGuideBody(content, damperGuides["automotive-glove-box-dampers-guide"]);
  assert.equal(body.hasTakeaways, true);
  assert.doesNotMatch(body.beforeSelection, /<h1>/i);
  assert.match(body.beforeSelection, /Selection details<\/p>$/i, "selectable models should follow the selection discussion");
  assert.match(body.afterSelection, /Engineering Checklist/);
});

test("inquiry URLs retain category, application, and specific model independently", () => {
  const url = new URL(getDamperInquiryUrl("gear-damper", "Cup holders & lids", "RD-T001"), "https://teao-damper.com");
  assert.equal(url.pathname, "/contact");
  assert.equal(url.searchParams.get("product"), "gear-damper");
  assert.equal(url.searchParams.get("application"), "Cup holders & lids");
  assert.equal(url.searchParams.get("model"), "RD-T001");
});
