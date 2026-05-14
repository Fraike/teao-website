"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-[#F8F9FA]">
      <div className="text-center px-6">
        <p className="text-[#ED7606] text-sm font-black uppercase tracking-[0.2em]">Error</p>
        <h1 className="mt-4 text-[clamp(28px,5vw,48px)] leading-[1.05] tracking-[-0.04em] font-black text-[#111827]">
          Something went wrong
        </h1>
        <p className="mt-4 max-w-[420px] mx-auto text-[#6B7280] text-[15px] leading-relaxed">
          An unexpected error occurred. Please try again or return to the homepage.
        </p>
        <div className="flex justify-center gap-3 mt-8">
          <button
            onClick={reset}
            className="px-8 py-3.5 rounded-full bg-[#ED7606] text-white text-sm font-bold hover:bg-[#D46900] transition-colors shadow-[0_14px_32px_rgba(237,118,6,.2)]"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-8 py-3.5 rounded-full border border-[#E5E7EB] bg-white text-[#374151] text-sm font-bold hover:bg-[#F8F9FA] transition-colors"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
