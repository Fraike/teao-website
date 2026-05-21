"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FAQS } from "@/content/faq";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {FAQS.map((faq, i) => (
        <div
          key={i}
          className="rounded-xl border border-[#E5E5E5] bg-white overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left font-bold text-[#171717]"
          >
            <span>{faq.q}</span>
            <ChevronDown
              size={20}
              className={cn(
                "shrink-0 text-[#666666] transition-transform duration-300",
                openIndex === i && "rotate-180 text-[#ED7606]"
              )}
            />
          </button>
          <div
            className={cn(
              "grid transition-all duration-300",
              openIndex === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}
          >
            <div className="overflow-hidden">
              <p className="px-6 pb-4 text-[#666666] text-sm leading-relaxed">{faq.a}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
