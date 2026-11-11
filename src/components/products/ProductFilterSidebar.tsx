"use client";

import { useState } from "react";
import { ChevronDown, Gauge, Wrench, ArrowRightLeft, SlidersHorizontal } from "lucide-react";

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
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-t border-slate-100 px-3.5">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2 py-3.5 text-left"
      >
        <span className="flex items-center gap-2 text-xs font-semibold text-slate-800">
          {icon}
          {title}
        </span>
        <ChevronDown size={14} aria-hidden="true" className={open ? "rotate-180 text-slate-500" : "text-slate-500"} />
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

export function ProductFilterSidebar({ filters, onChange, torqueRange, mountingOptions, dampingOptions }: Props) {
  const [torqueDraft, setTorqueDraft] = useState<{ bound: "min" | "max"; value: string } | null>(null);
  const selectedMin = filters.torqueMin ?? torqueRange.min;
  const selectedMax = filters.torqueMax ?? torqueRange.max;
  const rangeSize = Math.max(1, torqueRange.max - torqueRange.min);
  const trackStart = ((selectedMin - torqueRange.min) / rangeSize) * 100;
  const trackWidth = ((selectedMax - selectedMin) / rangeSize) * 100;
  const trackMiddle = trackStart + trackWidth / 2;
  // Split the pointer targets halfway between the thumb centers, including when they overlap.
  const thumbDivider = `calc(${trackMiddle}% + ${10 - trackMiddle / 5}px)`;

  const hasActiveFilters =
    filters.torqueMin !== null ||
    filters.torqueMax !== null ||
    filters.mountingMethods.length > 0 ||
    filters.dampingDirections.length > 0;

  const updateTorque = (bound: "min" | "max", value: number) => {
    const key = bound === "min" ? "torqueMin" : "torqueMax";
    const min = bound === "min" ? torqueRange.min : selectedMin;
    const max = bound === "max" ? torqueRange.max : selectedMax;
    const clamped = Math.min(max, Math.max(min, value));
    const next = clamped === torqueRange[bound] ? null : clamped;
    if (next !== filters[key]) onChange({ ...filters, [key]: next });
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
    setTorqueDraft(null);
    onChange({ torqueMin: null, torqueMax: null, mountingMethods: [], dampingDirections: [] });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-2 px-3.5 py-3">
        <h2 className="flex items-center gap-2.5 text-sm font-bold text-slate-900">
          <span className="grid size-7 place-items-center rounded-lg bg-orange-50 text-[#B95708]">
            <SlidersHorizontal size={15} aria-hidden="true" />
          </span>
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-semibold text-[#9A4D06] underline-offset-4 hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      <CollapsibleSection title="Torque range" icon={<Gauge size={14} aria-hidden="true" className="text-[#B95708]" />}>
        <div className="rounded-xl border border-orange-100 bg-orange-50/70 px-2.5 pb-2.5 pt-1.5">
          <div className="relative h-8">
            <div aria-hidden="true" className="absolute inset-x-[10px] top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-orange-200">
              <div className="absolute h-full rounded-full bg-[#ED7606]" style={{ left: `${trackStart}%`, width: `${trackWidth}%` }} />
            </div>
            {(["min", "max"] as const).map((bound) => (
              <input
                key={bound}
                type="range"
                aria-label={bound === "min" ? "Adjust minimum torque" : "Adjust maximum torque"}
                aria-valuetext={`${bound === "min" ? selectedMin : selectedMax} gf.cm`}
                className="torque-slider"
                style={{ clipPath: bound === "min"
                  ? `inset(0 calc(100% - ${thumbDivider}) 0 0)`
                  : `inset(0 0 0 ${thumbDivider})` }}
                min={torqueRange.min}
                max={torqueRange.max}
                step="any"
                disabled={torqueRange.min === torqueRange.max}
                value={bound === "min" ? selectedMin : selectedMax}
                onChange={(event) => updateTorque(bound, Math.round(event.currentTarget.valueAsNumber))}
              />
            ))}
          </div>
          <div className="mb-2 flex justify-between gap-1 text-[11px] tabular-nums text-slate-600">
            <span>{torqueRange.min.toLocaleString("en-US")}</span>
            <span>gf.cm</span>
            <span>{torqueRange.max.toLocaleString("en-US")}</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {(["min", "max"] as const).map((bound) => (
              <label key={bound} className="min-w-0">
                <span className="mb-0.5 block text-[11px] font-medium text-slate-600">{bound === "min" ? "Min" : "Max"}</span>
                <input
                  type="number"
                  inputMode="decimal"
                  aria-label={bound === "min" ? "Minimum torque (gf.cm)" : "Maximum torque (gf.cm)"}
                  min={torqueRange.min}
                  max={torqueRange.max}
                  step="any"
                  value={torqueDraft?.bound === bound ? torqueDraft.value : bound === "min" ? selectedMin : selectedMax}
                  onChange={(event) => setTorqueDraft({ bound, value: event.currentTarget.value })}
                  onBlur={(event) => {
                    const value = event.currentTarget.valueAsNumber;
                    if (torqueDraft?.bound === bound) updateTorque(bound, Number.isFinite(value) ? value : torqueRange[bound]);
                    setTorqueDraft(null);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") event.currentTarget.blur();
                  }}
                  className="h-8 w-full min-w-0 rounded-md border border-orange-200 bg-white px-1.5 text-sm tabular-nums text-slate-900 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                />
              </label>
            ))}
          </div>
        </div>
      </CollapsibleSection>

      {/* Mounting Method */}
      {mountingOptions.length > 0 && (
        <CollapsibleSection title="Mounting method" icon={<Wrench size={14} aria-hidden="true" className="text-slate-500" />}>
          <div className="space-y-1">
            {mountingOptions.map((method) => (
              <label
                key={method}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-transparent px-2 py-1.5 hover:bg-slate-50 has-checked:border-orange-200 has-checked:bg-orange-50"
              >
                <input
                  type="checkbox"
                  checked={filters.mountingMethods.includes(method)}
                  onChange={() => toggleMounting(method)}
                  className="size-3.5 shrink-0 accent-[#B95708]"
                />
                <span className="text-xs font-medium text-slate-700">
                  {method}
                </span>
              </label>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Damping Direction */}
      {dampingOptions.length > 0 && (
        <CollapsibleSection title="Damping direction" icon={<ArrowRightLeft size={14} aria-hidden="true" className="text-slate-500" />}>
          <div className="space-y-1">
            {dampingOptions.map((direction) => (
              <label
                key={direction}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-transparent px-2 py-1.5 hover:bg-slate-50 has-checked:border-orange-200 has-checked:bg-orange-50"
              >
                <input
                  type="checkbox"
                  checked={filters.dampingDirections.includes(direction)}
                  onChange={() => toggleDirection(direction)}
                  className="size-3.5 shrink-0 accent-[#B95708]"
                />
                <span className="text-xs font-medium text-slate-700">
                  {direction}
                </span>
              </label>
            ))}
          </div>
        </CollapsibleSection>
      )}
    </div>
  );
}
