"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "teao_sid";
const EVENTS = ["product_click", "scene_click", "cta_click", "category_click", "search", "search_open", "search_result_click", "form_submit"] as const;
const EXCLUDED_PATH_PREFIXES = ["/admin", "/api"];

function shouldTrackPath(pathname: string | null) {
  if (!pathname) return false;
  return !EXCLUDED_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

function sendEvent(payload: Record<string, unknown>) {
  if (typeof navigator === "undefined") return;
  const body = JSON.stringify({ ...payload, sessionId: getSessionId() });
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics/event", new Blob([body], { type: "application/json" }));
  } else {
    fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
  }
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const trackedRef = useRef(false);

  // Page view on route change
  useEffect(() => {
    if (!shouldTrackPath(pathname)) return;
    if (trackedRef.current && pathname === window.__teao_last_path) return;
    window.__teao_last_path = pathname;
    trackedRef.current = true;
    sendEvent({ event: "page_view", page: pathname });
  }, [pathname]);

  // Click delegation
  const handleClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!shouldTrackPath(pathname)) return;
    const el = target.closest("[data-analytics-event]") as HTMLElement | null;
    if (!el) return;

    const event = el.dataset.analyticsEvent;
    if (!event || !EVENTS.includes(event as typeof EVENTS[number])) return;

    sendEvent({
      event,
      page: pathname,
      targetType: el.dataset.analyticsTargetType || null,
      targetId: el.dataset.analyticsTargetId || null,
      source: el.dataset.analyticsSource || null,
    });
  }, [pathname]);

  // Custom event listener for programmatic tracking (e.g., form submissions)
  useEffect(() => {
    const handler = (e: Event) => {
      if (!shouldTrackPath(window.location.pathname)) return;
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail === "object") {
        sendEvent(detail);
      }
    };
    window.addEventListener("teao:track", handler);
    return () => window.removeEventListener("teao:track", handler);
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClick, { passive: true });
    return () => document.removeEventListener("click", handleClick);
  }, [handleClick]);

  return <>{children}</>;
}

declare global {
  interface Window {
    __teao_last_path?: string;
  }
}
