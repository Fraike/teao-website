export type SearchMetrics = {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type SearchRow = SearchMetrics & { keys: string[] };
type Dimension = "date" | "query" | "page" | "country" | "device";
type Query = { startDate: string; endDate: string; dimensions: Dimension[] };

export const searchReports = {
  query: ["query"],
  page: ["page"],
  country: ["country"],
  device: ["device"],
  "query-page": ["page", "query"],
} satisfies Record<string, Dimension[]>;

export const keywordLabels = {
  "glove-box": "Glove Box Damper",
  "rotary-gear": "Gear Damper / Rotary Damper",
  gear: "Gear Damper",
  rotary: "Rotary Damper",
};

type KeywordGroup = keyof typeof keywordLabels;

export function keywordGroups(query: string): KeywordGroup[] {
  const gear = /\bgear[\s-]+dampers?\b/i.test(query);
  const rotary = /\brotary[\s-]+dampers?\b/i.test(query);
  const gloveBox = /\bglove[\s-]*box[\s-]+dampers?\b/i.test(query);
  const matches: KeywordGroup[] = [];
  if (gloveBox) matches.push("glove-box");
  if (gear || rotary) matches.push("rotary-gear");
  if (gear) matches.push("gear");
  if (rotary) matches.push("rotary");
  return matches;
}

export function summarizeMetrics(rows: ReadonlyArray<Omit<SearchMetrics, "ctr">>): SearchMetrics {
  let clicks = 0;
  let impressions = 0;
  let weightedPosition = 0;
  for (const row of rows) {
    clicks += row.clicks;
    impressions += row.impressions;
    weightedPosition += row.position * row.impressions;
  }
  return {
    clicks,
    impressions,
    ctr: impressions ? clicks / impressions : 0,
    position: impressions ? weightedPosition / impressions : 0,
  };
}

const googleDateFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Los_Angeles", year: "numeric", month: "2-digit", day: "2-digit",
});

export function formatGoogleDate(time: Date): string {
  return googleDateFormat.format(time);
}

export function shiftSearchDate(date: string, days: number): string {
  const result = new Date(date + "T00:00:00Z");
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString().slice(0, 10);
}

export function syncWindow(time: Date) {
  const end = formatGoogleDate(time);
  const start = new Date(end + "T00:00:00Z");
  const day = start.getUTCDate();
  start.setUTCDate(1);
  start.setUTCMonth(start.getUTCMonth() - 3);
  const lastDay = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0)).getUTCDate();
  start.setUTCDate(Math.min(lastDay, day));
  return {
    start: start.toISOString().slice(0, 10),
    end,
    recentStart: shiftSearchDate(end, -6),
    cycle: new Date(time.getTime() - 2 * 60 * 60 * 1000).toISOString().slice(0, 10),
  };
}

export function chooseProperty(entries: { siteUrl: string; permissionLevel: string }[]) {
  const allowed = new Set(entries.filter(entry =>
    ["siteOwner", "siteFullUser", "siteRestrictedUser"].includes(entry.permissionLevel),
  ).map(entry => entry.siteUrl));
  return ["sc-domain:teao-damper.com", "https://teao-damper.com/"].find(site => allowed.has(site));
}

export class SearchConsoleError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function querySearchAnalytics(
  token: string,
  property: string,
  query: Query,
  request = fetch,
): Promise<SearchRow[]> {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/searchAnalytics/query`;
  const rows: SearchRow[] = [];
  const rowLimit = 25000;
  for (let startRow = 0; startRow < 50000; startRow += rowLimit) {
    const body = JSON.stringify({
      ...query, type: "web", dataState: "final",
      aggregationType: query.dimensions.includes("page") ? "byPage" : "byProperty",
      rowLimit, startRow,
    });
    const init = {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body,
    };
    const result = await requestGoogle<SearchRow[]>(async () => {
      const response = await request(url, { ...init, signal: AbortSignal.timeout(12000) });
      if (!response.ok) throw await searchApiError(response);
      const json = await response.json() as { rows?: SearchRow[] };
      return json.rows ?? [];
    });
    for (const row of result) rows.push(row);
    if (result.length < rowLimit) break;
  }
  return rows;
}

async function searchApiError(response: Response) {
  if (response.status === 403) {
    const body = await response.json().catch(() => null);
    const reason = body?.error?.errors?.[0]?.reason;
    if (["rateLimitExceeded", "userRateLimitExceeded", "quotaExceeded"].includes(reason)) {
      return new SearchConsoleError("Google Search Console API quota exceeded.", 429);
    }
  }
  return new SearchConsoleError(`Google Search Console API returned HTTP ${response.status}.`, response.status);
}

async function requestGoogle<T>(operation: () => Promise<T>): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (
        attempt >= 2 ||
        (error instanceof SearchConsoleError && error.status !== 429 && error.status < 500)
      ) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * 2 ** attempt));
    }
  }
}
