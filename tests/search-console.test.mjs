import test from "node:test";
import assert from "node:assert/strict";
import {
  chooseProperty,
  formatGoogleDate,
  querySearchAnalytics,
  keywordGroups,
  summarizeMetrics,
  syncWindow,
} from "../src/lib/search-console-google.ts";

test("prefers the exact domain property and excludes unrelated sites", () => {
  assert.equal(chooseProperty([
    { siteUrl: "https://teao-damper.com/", permissionLevel: "siteRestrictedUser" },
    { siteUrl: "sc-domain:teao-damper.com", permissionLevel: "siteFullUser" },
  ]), "sc-domain:teao-damper.com");
  assert.equal(chooseProperty([
    { siteUrl: "sc-domain:teao-damper.com", permissionLevel: "siteUnverifiedUser" },
    { siteUrl: "https://shop.teao-damper.com/", permissionLevel: "siteOwner" },
  ]), undefined);
});

test("uses Pacific dates for Search Console and 10 AM Shanghai sync cycles", () => {
  const time = new Date("2026-11-09T01:59:59Z");
  assert.equal(formatGoogleDate(time), "2026-11-08");
  assert.deepEqual(syncWindow(time), {
    start: "2026-08-08",
    end: "2026-11-08",
    recentStart: "2026-11-02",
    cycle: "2026-11-08",
  });
  assert.equal(syncWindow(new Date("2026-11-09T02:00:00Z")).cycle, "2026-11-09");
});

test("paginates finalized data with the matching aggregation grain", async () => {
  const requests = [];
  const fakeFetch = async (url, init) => {
    requests.push({ url, body: JSON.parse(init.body), auth: init.headers.Authorization });
    const rows = requests.length === 1 ? 25000 : 1;
    return Response.json({ rows: Array.from({ length: rows }, (_, i) => ({
      keys: [`page-${i}`, "rotary damper"], clicks: 1, impressions: 10, position: 3, ctr: 0.1,
    })) });
  };
  const result = await querySearchAnalytics("token", "sc-domain:teao-damper.com", {
    startDate: "2026-11-01", endDate: "2026-11-01", dimensions: ["page", "query"],
  }, fakeFetch);
  assert.equal(result.length, 25001);
  assert.deepEqual(requests.map(r => r.body.startRow), [0, 25000]);
  assert.equal(requests[0].body.aggregationType, "byPage");
  assert.equal(requests[0].body.dataState, "final");
  assert.equal(requests[0].auth, "Bearer token");
  assert.match(requests[0].url, /sc-domain%3Ateao-damper\.com/);
});

test("unifies synonyms without counting a query twice in the combined group", () => {
  assert.deepEqual(keywordGroups("mini gear dampers and rotary dampers"),
    ["rotary-gear", "gear", "rotary"]);
  assert.deepEqual(keywordGroups("automotive glove-box dampers"), ["glove-box"]);
  assert.deepEqual(keywordGroups("air damper gears"), []);
  assert.deepEqual(summarizeMetrics([
    { clicks: 1, impressions: 10, position: 3 },
    { clicks: 2, impressions: 30, position: 9 },
  ]), { clicks: 3, impressions: 40, ctr: 0.075, position: 7.5 });
});
