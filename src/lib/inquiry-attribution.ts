const channels = ["organic", "paid", "referral", "campaign", "direct", "unknown"] as const;
type Channel = typeof channels[number];

export interface InquiryAttribution {
  channel: Channel;
  landingPage: string;
  submissionPage: string | null;
  locale: "en" | "ja" | "de";
  referrer: string | null;
  source: string | null;
  medium: string | null;
  campaign: string | null;
}

function textField(value: unknown, limit: number) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed && trimmed.length <= limit && !/[@<>\r\n]/.test(trimmed) ? trimmed : null;
}

function pathField(value: unknown) {
  if (typeof value !== "string") return null;
  const path = value.split(/[?#]/, 1)[0];
  return path.length <= 300 && /^\/(?!\/)[a-z0-9_.%/-]*$/i.test(path) ? path : null;
}

export function parseInquiryAttribution(value: unknown): InquiryAttribution | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const landingPage = pathField(record.landingPage);
  if (!landingPage || !channels.includes(record.channel as Channel)) return null;
  const submissionPage = pathField(record.submissionPage);
  const locale = (submissionPage ?? landingPage).split("/")[1];
  return {
    channel: record.channel as Channel,
    landingPage,
    submissionPage,
    locale: locale === "ja" || locale === "de" ? locale : "en",
    referrer: textField(record.referrer, 253),
    source: textField(record.source, 100),
    medium: textField(record.medium, 100),
    campaign: textField(record.campaign, 150),
  };
}

export function getVisitSource(url: URL, referrerUrl: string): InquiryAttribution {
  let referrer: string | null = null;
  try {
    const parsed = new URL(referrerUrl);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") referrer = parsed.hostname;
  } catch {
    // A direct visit usually has no referrer.
  }
  const source = textField(url.searchParams.get("utm_source"), 100);
  const medium = textField(url.searchParams.get("utm_medium"), 100)?.toLowerCase() ?? null;
  const campaign = textField(url.searchParams.get("utm_campaign"), 150);
  const internal = referrer?.replace(/^www\./, "") === url.hostname.replace(/^www\./, "");
  const search = !!referrer && /^(?:[a-z0-9-]+\.)*(?:google\.(?:[a-z]{2,3}|(?:co|com)\.[a-z]{2})|bing\.com|yahoo\.com|duckduckgo\.com|baidu\.com|yandex\.(?:com|ru))$/.test(referrer);

  let channel: Channel = "direct";
  if (url.searchParams.has("gclid") || url.searchParams.has("msclkid") || (medium && /^(?:cpc|ppc|paid(?:[_ -].*)?|display|cpm)$/.test(medium))) channel = "paid";
  else if (medium === "organic" || (!medium && !source && !campaign && search && !internal)) channel = "organic";
  else if (source || medium || campaign) channel = "campaign";
  else if (internal) channel = "unknown";
  else if (referrer) channel = "referral";

  return parseInquiryAttribution({ channel, landingPage: pathField(url.pathname) ?? "/", referrer: internal ? null : referrer, source: source ?? (internal ? null : referrer), medium, campaign })!;
}

const VISIT_KEY = "teao_inquiry_visit";
let firstVisit: InquiryAttribution | null = null;

export function captureInquiryVisit() {
  if (typeof window === "undefined") return null;
  if (firstVisit) return firstVisit;
  try {
    firstVisit = parseInquiryAttribution(JSON.parse(sessionStorage.getItem(VISIT_KEY) ?? "null"));
  } catch {
    // Storage may be unavailable in private browsing.
  }
  if (firstVisit) return firstVisit;
  firstVisit = getVisitSource(new URL(window.location.href), document.referrer);
  try {
    sessionStorage.setItem(VISIT_KEY, JSON.stringify(firstVisit));
  } catch {
    // The current page can still send its in-memory attribution.
  }
  return firstVisit;
}
