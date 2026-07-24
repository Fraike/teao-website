"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, RotateCw, Wrench, ArrowRightLeft } from "lucide-react";

export type FilterState = {
  torqueMin: number | null;
  torqueMax: number | null;
  mountingMethods: string[];
  dampingDirections: string[];
};

type Props = {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  torqueRange: { min: number; max: number };
  mountingOptions: string[];
  dampingOptions: string[];
};

function CollapsibleSection({
  title,
  icon,
  defaultOpen = true,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#E5E7EB] last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2 py-3 text-left"
      >
        <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.1em] text-[#374151]">
          {icon}
          {title}
        </span>
        {open ? <ChevronUp size={14} className="text-[#9CA3AF]" /> : <ChevronDown size={14} className="text-[#9CA3AF]" />}
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

export function ProductFilterSidebar({ filters, onChange, torqueRange, mountingOptions, dampingOptions }: Props) {
  const [torqueMinInput, setTorqueMinInput] = useState(filters.torqueMin !== null ? String(filters.torqueMin) : "");
  const [torqueMaxInput, setTorqueMaxInput] = useState(filters.torqueMax !== null ? String(filters.torqueMax) : "");

  const hasActiveFilters =
    filters.torqueMin !== null ||
    filters.torqueMax !== null ||
    filters.mountingMethods.length > 0 ||
    filters.dampingDirections.length > 0;

  const applyTorque = () => {
    const min = torqueMinInput ? parseFloat(torqueMinInput) : null;
    const max = torqueMaxInput ? parseFloat(torqueMaxInput) : null;
    onChange({ ...filters, torqueMin: min && !isNaN(min) ? min : null, torqueMax: max && !isNaN(max) ? max : null });
  };

  const toggleMounting = (method: string) => {
    const next = filters.mountingMethods.includes(method)
      ? filters.mountingMethods.filter((m) => m !== method)
      : [...filters.mountingMethods, method];
    onChange({ ...filters, mountingMethods: next });
  };

  const toggleDirection = (direction: string) => {
    const next = filters.dampingDirections.includes(direction)
      ? filters.dampingDirections.filter((d) => d !== direction)
      : [...filters.dampingDirections, direction];
    onChange({ ...filters, dampingDirections: next });
  };

  const clearAll = () => {
    setTorqueMinInput("");
    setTorqueMaxInput("");
    onChange({ torqueMin: null, torqueMax: null, mountingMethods: [], dampingDirections: [] });
  };

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_4px_20px_rgba(0,0,0,.03)]">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-[#E5E7EB] px-5 py-3.5">
        <span className="text-sm font-black tracking-[-0.02em] text-[#111827]">Filters</span>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-[11px] font-bold text-[#ED7606] hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Torque Range */}
      <CollapsibleSection title="Torque Range (gf.cm)" icon={<RotateCw size={13} className="text-[#ED7606]" />}>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder={String(torqueRange.min)}
              value={torqueMinInput}
              onChange={(e) => setTorqueMinInput(e.target.value)}
              onBlur={applyTorque}
              onKeyDown={(e) => e.key === "Enter" && applyTorque()}
              className="w-full h-10 rounded-lg border border-[#E5E7EB] bg-white px-3 text-xs font-bold text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#ED7606]"
            />
            <span className="text-xs font-bold text-[#9CA3AF]">–</span>
            <input
              type="number"
              placeholder={String(torqueRange.max)}
              value={torqueMaxInput}
              onChange={(e) => setTorqueMaxInput(e.target.value)}
              onBlur={applyTorque}
              onKeyDown={(e) => e.key === "Enter" && applyTorque()}
              className="w-full h-10 rounded-lg border border-[#E5E7EB] bg-white px-3 text-xs font-bold text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#ED7606]"
            />
          </div>
          <p className="text-[10px] text-[#9CA3AF]">
            Range: {torqueRange.min} – {torqueRange.max} gf.cm
          </p>
        </div>
      </CollapsibleSection>

      {/* Mounting Method */}
      {mountingOptions.length > 0 && (
        <CollapsibleSection title="Mounting Method" icon={<Wrench size={13} className="text-[#ED7606]" />}>
          <div className="space-y-2">
            {mountingOptions.map((method) => (
              <label
                key={method}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.mountingMethods.includes(method)}
                  onChange={() => toggleMounting(method)}
                  className="h-4 w-4 rounded border-[#D1D5DB] text-[#ED7606] focus:ring-[#ED7606]"
                />
                <span className="text-sm font-bold text-[#374151] group-hover:text-[#111827] transition-colors">
                  {method}
                </span>
              </label>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Damping Direction */}
      {dampingOptions.length > 0 && (
        <CollapsibleSection title="Damping Direction" icon={<ArrowRightLeft size={13} className="text-[#ED7606]" />}>
          <div className="space-y-2">
            {dampingOptions.map((direction) => (
              <label
                key={direction}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.dampingDirections.includes(direction)}
                  onChange={() => toggleDirection(direction)}
                  className="h-4 w-4 rounded border-[#D1D5DB] text-[#ED7606] focus:ring-[#ED7606]"
                />
                <span className="text-sm font-bold text-[#374151] group-hover:text-[#111827] transition-colors">
                  {direction}
                </span>
              </label>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Active count badge on mobile */}
      {hasActiveFilters && (
        <div className="px-5 py-3 border-t border-[#E5E7EB] lg:hidden">
          <button onClick={clearAll} className="w-full rounded-lg bg-[#111827] px-4 py-2 text-xs font-bold text-white">
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
