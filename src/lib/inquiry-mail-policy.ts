const SAFE_RETRY_WINDOW_MS = 23 * 60 * 60 * 1000;
const RETRY_DELAYS_MS = [60_000, 300_000];

export function withinMailRetryWindow(firstAttempt: Date | null, now: Date) {
  return firstAttempt === null || now.getTime() - firstAttempt.getTime() < SAFE_RETRY_WINDOW_MS;
}

export function automaticRetryAt(attempts: number, firstAttempt: Date, now: Date) {
  const delay = RETRY_DELAYS_MS[attempts - 1];
  if (!delay) return null;
  const next = new Date(now.getTime() + delay);
  return withinMailRetryWindow(firstAttempt, next) ? next : null;
}

export function canRetryMail(status: string, firstAttempt: Date | null, now: Date, providerId: string | null) {
  return status === "failed" && !providerId && withinMailRetryWindow(firstAttempt, now);
}

export function deliveryStatus(eventType: string) {
  switch (eventType) {
    case "email.sent": return "accepted";
    case "email.delivered": return "delivered";
    case "email.bounced": return "bounced";
    case "email.failed":
    case "email.suppressed": return "failed";
    default: return null;
  }
}
