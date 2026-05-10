import { Gauge } from "lucide-react";
import type { Product } from "@/types";
import { formatTorque, getTorqueRange } from "@/lib/products";

export function TorqueRangeBar({ torque }: { torque: NonNullable<Product["torque"]> }) {
  const torqueLabel = formatTorque({ torque } as Product);
  const torqueRange = getTorqueRange({ torque } as Product);

  if (!torqueRange) return null;

  return (
    <div className="rounded-xl border border-[#FFE3C2] bg-[#FFFAF5] px-4 py-3.5">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-[#9CA3AF]">
          <Gauge size={14} className="text-[#ED7606]" />
          Adjustable Torque Range
        </span>
        <span className="text-[12px] font-extrabold text-[#111827] tabular-nums">
          {torqueLabel}
        </span>
      </div>
      <div className="relative h-3.5 overflow-hidden rounded-full bg-white shadow-inner ring-1 ring-[#FFE3C2]">
        <div className="absolute inset-y-0 left-0 w-full bg-[linear-gradient(90deg,rgba(237,118,6,0.06),rgba(237,118,6,0.10))]" />
        <div
          className="torque-fill absolute inset-y-1 rounded-full bg-[#ED7606] shadow-[0_0_12px_rgba(237,118,6,0.35)]"
          style={{
            left: `${torqueRange.start}%`,
            width: `${torqueRange.width}%`,
          }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[9px] font-semibold text-[#C9A27F]">
        <span>0</span>
        <span>{torqueRange.scaleMax} {torque.unit}</span>
      </div>
    </div>
  );
}
