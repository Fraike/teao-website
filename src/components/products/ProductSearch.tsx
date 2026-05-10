"use client";

import { Search } from "lucide-react";

export function ProductSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative w-full max-w-[280px]">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
      <input
        type="text"
        placeholder="Search by model..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#E5E7EB] bg-white text-[13px] text-[#374151] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#ED7606] focus:ring-2 focus:ring-[#ED7606]/10 transition-all"
      />
    </div>
  );
}
