"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

type Turnstile = {
  render(element: HTMLElement, options: { sitekey: string; action: string; appearance: string }): string;
  remove(id: string): void;
};

const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function InquiryChallenge() {
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const getTurnstile = () => (window as Window & { turnstile?: Turnstile }).turnstile;
  useEffect(() => () => {
    if (widget.current !== null) getTurnstile()?.remove(widget.current);
    widget.current = null;
  }, []);

  if (!sitekey) return null;

  return (
    <>
      <div ref={container} />
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        onReady={() => {
          if (container.current && widget.current === null) {
            widget.current = getTurnstile()?.render(container.current, { sitekey, action: "contact", appearance: "interaction-only" }) ?? null;
          }
        }}
      />
    </>
  );
}
