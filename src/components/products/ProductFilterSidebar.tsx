"use client";

import { useCallback, useRef } from "react";
import {
  RotateCw,
  Wrench,
  ArrowLeftRight,
  X,
  ArrowRight,
  Bolt,
  Puzzle,
  SlidersHorizontal,
} from "lucide-react";

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

const DIRECTION_ICONS: Record<string, React.ElementType> = {
  Bidirectional: ArrowLeftRight,
  Oneway: ArrowRight,
  "One-way": ArrowRight,
};

const MOUNTING_ICONS: Record<string, React.ElementType> = {
  "Screw Fixing": Bolt,
  "Snap fit": Puzzle,
};

function RangeSlider({
  min,
  max,
  valueLow,
  valueHigh,
  onChange,
  unit,
}: {
  min: number;
  max: number;
  valueLow: number;
  valueHigh: number;
  onChange: (low: number, high: number) => void;
  unit: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const range = max - min || 1;

  const lowPercent = ((valueLow - min) / range) * 100;
  const highPercent = ((valueHigh - min) / range) * 100;

  const handleLowChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = Number(e.target.value);
      onChange(Math.min(v, valueHigh), valueHigh);
    },
    [valueHigh, onChange],
  );

  const handleHighChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = Number(e.target.value);
      onChange(valueLow, Math.max(v, valueLow));
    },
    [valueLow, onChange],
  );

  return (
    <div className="space-y-3">
      {/* Values display */}
      <div className="flex items-center justify-between gap-1 tabular-nums">
        <span className="text-sm font-black text-[#111827]">{Math.round(valueLow)}</span>
        <span className="text-[10px] font-bold text-[#9CA3AF] uppercase">{unit}</span>
        <span className="text-sm font-black text-[#111827]">{Math.round(valueHigh)}</span>
      </div>

      {/* Dual range slider */}
      <div ref={trackRef} className="relative h-6 flex items-center">
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-[#E5E7EB]" />
        <div
          className="absolute h-1.5 rounded-full bg-[#ED7606]"
          style={{ left: `${lowPercent}%`, width: `${highPercent - lowPercent}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step="any"
          value={valueLow}
          onChange={handleLowChange}
          className="range-slider-thumb"
          style={{ zIndex: lowPercent > 50 ? 4 : 2 }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step="any"
          value={valueHigh}
          onChange={handleHighChange}
          className="range-slider-thumb"
          style={{ zIndex: highPercent < 50 ? 4 : 2 }}
        />
      </div>

      {/* Min/Max labels */}
      <div className="flex justify-between text-[10px] font-bold text-[#9CA3AF] tabular-nums">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function OptionChip({
  label,
  active,
  onClick,
  icon: Icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ElementType;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-all ${
        active
          ? "border-[#ED7606]/50 bg-[#FFF7ED] text-[#ED7606] shadow-[0_0_0_1px_rgba(237,118,6,.1)]"
          : "border-[#E5E7EB] bg-white text-[#374151] hover:border-[#D1D5DB] hover:bg-[#F8F9FA]"
      }`}
    >
      {Icon && (
        <Icon
          size={15}
          className={`shrink-0 transition-colors ${
            active ? "text-[#ED7606]" : "text-[#9CA3AF] group-hover:text-[#6B7280]"
          }`}
        />
      )}
      <span className="text-xs font-bold">{label}</span>
      {active && <X size={12} className="ml-auto shrink-0 opacity-50" />}
    </button>
  );
}

export function ProductFilterSidebar({ filters, onChange, torqueRange, mountingOptions, dampingOptions }: Props) {
  const effectiveMin = filters.torqueMin ?? torqueRange.min;
  const effectiveMax = filters.torqueMax ?? torqueRange.max;

  const hasActiveFilters =
    filters.torqueMin !== null ||
    filters.torqueMax !== null ||
    filters.mountingMethods.length > 0 ||
    filters.dampingDirections.length > 0;

  const handleTorqueChange = (low: number, high: number) => {
    const roundedLow = Math.round(low);
    const roundedHigh = Math.round(high);
    onChange({
      ...filters,
      torqueMin: roundedLow > torqueRange.min ? roundedLow : null,
      torqueMax: roundedHigh < torqueRange.max ? roundedHigh : null,
    });
  };

  const toggleOption = (key: "mountingMethods" | "dampingDirections", value: string) => {
    const current = filters[key];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  const clearAll = () => {
    onChange({ torqueMin: null, torqueMax: null, mountingMethods: [], dampingDirections: [] });
  };

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-[0_4px_24px_rgba(0,0,0,.04)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-[#ED7606]" />
          <span className="text-sm font-black tracking-[-0.02em] text-[#111827]">Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-[11px] font-bold text-[#ED7606] hover:text-[#D46900] transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      <div className="px-4 py-4 space-y-5">
        {/* Torque Range */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <RotateCw size={14} className="text-[#ED7606] shrink-0" />
            <span className="text-xs font-black uppercase tracking-[0.08em] text-[#374151]">Torque</span>
            <span className="text-[10px] font-bold text-[#9CA3AF]">gf·cm</span>
          </div>
          <RangeSlider
            min={torqueRange.min}
            max={torqueRange.max}
            valueLow={effectiveMin}
            valueHigh={effectiveMax}
            onChange={handleTorqueChange}
            unit="gf·cm"
          />
        </div>

        {/* Mounting Method */}
        {mountingOptions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Wrench size={14} className="text-[#ED7606] shrink-0" />
              <span className="text-xs font-black uppercase tracking-[0.08em] text-[#374151]">Mounting</span>
            </div>
            <div className="space-y-1.5">
              {mountingOptions.map((method) => (
                <OptionChip
                  key={method}
                  label={method}
                  icon={MOUNTING_ICONS[method]}
                  active={filters.mountingMethods.includes(method)}
                  onClick={() => toggleOption("mountingMethods", method)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Damping Direction */}
        {dampingOptions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <ArrowLeftRight size={14} className="text-[#ED7606] shrink-0" />
              <span className="text-xs font-black uppercase tracking-[0.08em] text-[#374151]">Direction</span>
            </div>
            <div className="space-y-1.5">
              {dampingOptions.map((direction) => (
                <OptionChip
                  key={direction}
                  label={direction}
                  icon={DIRECTION_ICONS[direction]}
                  active={filters.dampingDirections.includes(direction)}
                  onClick={() => toggleOption("dampingDirections", direction)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
