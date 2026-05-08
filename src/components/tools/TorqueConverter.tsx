"use client";

import { useState, useMemo } from "react";
import { ArrowDown } from "lucide-react";

const UNITS: { key: string; label: string }[] = [
  { key: "N·m", label: "N·m" },
  { key: "cN·m", label: "cN·m (N·cm)" },
  { key: "mN·m", label: "mN·m" },
  { key: "kgf·cm", label: "kgf·cm" },
  { key: "kgf·m", label: "kgf·m" },
  { key: "gf·cm", label: "gf·cm" },
  { key: "lbf·in", label: "lbf·in" },
  { key: "lbf·ft", label: "lbf·ft" },
  { key: "ozf·in", label: "ozf·in" },
];

const toNm: Record<string, number> = {
  "N·m": 1,
  "cN·m": 0.01,
  "mN·m": 0.001,
  "kgf·cm": 0.0981,
  "kgf·m": 9.81,
  "gf·cm": 0.0000981,
  "lbf·in": 0.113,
  "lbf·ft": 1.36,
  "ozf·in": 0.00706,
};

function formatValue(v: number): string {
  const a = Math.abs(v);
  if (a === 0) return "0";
  if (a < 0.001) return v.toExponential(3);
  if (a < 1) return v.toFixed(4);
  if (a < 10) return v.toFixed(3);
  if (a < 100) return v.toFixed(2);
  if (a < 1000) return v.toFixed(1);
  return Math.round(v).toLocaleString("en-US");
}

export default function TorqueConverter() {
  const [value, setValue] = useState<string>("1");
  const [unit, setUnit] = useState<string>("gf·cm");

  const results = useMemo(() => {
    const num = parseFloat(value);
    if (isNaN(num)) return null;

    const nmValue = num * toNm[unit];
    const entries: { key: string; label: string; value: number }[] = [];

    for (const u of UNITS) {
      entries.push({
        key: u.key,
        label: u.label,
        value: nmValue / toNm[u.key],
      });
    }
    return entries;
  }, [value, unit]);

  const isTEAOUnit = (key: string) => key === "gf·cm" || key === "mN·m";

  return (
    <div className="max-w-2xl mx-auto">
      {/* Input Card */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 lg:p-8 shadow-[0_4px_24px_rgba(0,0,0,.04)]">
        {/* Input row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter value..."
            className="flex-1 h-14 px-5 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] text-lg font-semibold placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#ED7606] focus:ring-2 focus:ring-[#ED7606]/10 transition-all"
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="h-14 px-5 rounded-xl border border-[#E5E7EB] bg-white text-[#374151] text-sm font-bold focus:outline-none focus:border-[#ED7606] cursor-pointer transition-all appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23ED7606' viewBox='0 0 16 16'%3E%3Cpath d='M8 10L4 6h8z'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 14px center",
              paddingRight: "40px",
            }}
          >
            {UNITS.map((u) => (
              <option key={u.key} value={u.key} className="bg-white text-[#374151]">
                {u.label}
              </option>
            ))}
          </select>
        </div>

        {/* Arrow divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[#E5E7EB]" />
          <ArrowDown size={16} className="text-[#ED7606] shrink-0" strokeWidth={2.5} />
          <span className="text-[#9CA3AF] text-xs font-bold uppercase tracking-[0.12em]">Converted</span>
          <div className="flex-1 h-px bg-[#E5E7EB]" />
        </div>

        {/* Results grid */}
        {results ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {results.map((r) => {
              const teaUnit = isTEAOUnit(r.key);
              return (
                <div
                  key={r.key}
                  className={`rounded-xl p-3.5 lg:p-4 transition-all duration-300 ${
                    teaUnit
                      ? "border border-[#ED7606]/40 bg-[#ED7606]/6"
                      : "border border-[#E5E7EB] bg-[#F8F9FA] hover:border-[#D1D5DB]"
                  }`}
                >
                  <div className="text-[#9CA3AF] text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.08em] mb-1">
                    {r.label}
                    {teaUnit && (
                      <span className="ml-1.5 text-[#ED7606] text-[9px]">TEAO</span>
                    )}
                  </div>
                  <div className={`text-lg lg:text-xl font-black tracking-[-0.03em] tabular-nums ${
                    teaUnit ? "text-[#ED7606]" : "text-[#111827]"
                  }`}>
                    {formatValue(r.value)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-[#9CA3AF] text-sm">
            Enter a value to see converted results
          </div>
        )}
      </div>

      {/* Reference note */}
      <p className="mt-4 text-center text-[#9CA3AF] text-xs">
        TEAO damper torque is primarily specified in gf·cm. Market products use various units — use this tool for quick comparison.
      </p>
    </div>
  );
}
