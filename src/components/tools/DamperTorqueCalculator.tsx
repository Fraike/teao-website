"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Calculator,
  CheckCircle2,
  Clock3,
  Gauge,
  Ruler,
  RotateCw,
  SlidersHorizontal,
  Weight,
} from "lucide-react";
import { getTorqueCalculatorCopy } from "@/lib/torque-calculator-i18n";
import type { Locale } from "@/lib/i18n";

type ProductOption = {
  model: string;
  name: string;
  summary: string;
  url: string;
  torque: {
    min: number;
    max: number;
    unit: "gf.cm" | "kgf.cm" | "N·m" | "N";
  };
};

type GeometryMode = "length" | "cg";
type LeverMode = "conservative" | "vertical-start" | "custom";

const G = 9.80665;
const NM_TO_GFCM = 10197.16213;
const MIN_MOTION_RATIO = 0.05;

function toNm(value: number, unit: ProductOption["torque"]["unit"]) {
  switch (unit) {
    case "gf.cm":
      return value / NM_TO_GFCM;
    case "kgf.cm":
      return value * 0.0980665;
    case "N·m":
      return value;
    case "N":
      return value;
    default:
      return value;
  }
}

function formatNumber(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "—";
  if (Math.abs(value) >= 1000) return Math.round(value).toLocaleString("en-US");
  if (Math.abs(value) >= 100) return value.toFixed(1);
  return value.toFixed(digits);
}

function formatTorqueNm(value: number) {
  if (!Number.isFinite(value)) return "—";
  if (value < 0.01) return value.toFixed(4);
  if (value < 1) return value.toFixed(3);
  return value.toFixed(2);
}

function formatGfcm(value: number) {
  if (!Number.isFinite(value)) return "—";
  if (value >= 100) return Math.round(value).toLocaleString("en-US");
  return value.toFixed(1);
}

function clampPositive(value: number, fallback: number) {
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function degToRad(value: number) {
  return (value * Math.PI) / 180;
}

function normalizeProduct(product: ProductOption) {
  const minNm = toNm(product.torque.min, product.torque.unit);
  const maxNm = toNm(product.torque.max, product.torque.unit);
  return {
    ...product,
    minNm: Math.min(minNm, maxNm),
    maxNm: Math.max(minNm, maxNm),
  };
}

function Field({
  label,
  value,
  onChange,
  suffix,
  min = 0,
  step = "any",
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix?: string;
  min?: number;
  step?: number | "any";
  icon?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.1em] text-[#6B7280]">
        {icon}
        {label}
      </span>
      <div className="flex h-12 overflow-hidden rounded-lg border border-[#E5E7EB] bg-white transition-colors focus-within:border-[#ED7606] focus-within:ring-2 focus-within:ring-[#ED7606]/10">
        <input
          type="number"
          value={value}
          min={min}
          step={step}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent px-3.5 text-sm font-bold text-[#111827] outline-none"
        />
        {suffix && (
          <span className="flex min-w-[62px] items-center justify-center border-l border-[#E5E7EB] bg-[#F8F9FA] px-2 text-xs font-bold text-[#6B7280]">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

function Metric({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        accent ? "border-[#ED7606]/35 bg-[#FFF7ED]" : "border-[#E5E7EB] bg-white"
      }`}
    >
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#9CA3AF]">
        {label}
      </p>
      <p
        className={`mt-1 text-2xl font-black tracking-[-0.04em] tabular-nums ${
          accent ? "text-[#ED7606]" : "text-[#111827]"
        }`}
      >
        {value}
      </p>
      {sub && <p className="mt-1 text-xs leading-relaxed text-[#6B7280]">{sub}</p>}
    </div>
  );
}

export default function DamperTorqueCalculator({
  products,
  locale = "en",
}: {
  products: ProductOption[];
  locale?: Locale | "en";
}) {
  const copy = getTorqueCalculatorCopy(locale);
  const [geometryMode, setGeometryMode] = useState<GeometryMode>("length");
  const [leverMode, setLeverMode] = useState<LeverMode>("conservative");
  const [weightKg, setWeightKg] = useState("0.30");
  const [panelLengthMm, setPanelLengthMm] = useState("120");
  const [cgDistanceMm, setCgDistanceMm] = useState("60");
  const [openingAngleDeg, setOpeningAngleDeg] = useState("90");
  const [targetTimeSec, setTargetTimeSec] = useState("2");
  const [damperCount, setDamperCount] = useState("1");
  const [motionRatio, setMotionRatio] = useState("1");
  const [efficiencyPercent, setEfficiencyPercent] = useState("90");
  const [marginLowPercent, setMarginLowPercent] = useState("10");
  const [marginHighPercent, setMarginHighPercent] = useState("30");
  const [customLeverFactor, setCustomLeverFactor] = useState("1");

  const result = useMemo(() => {
    const weight = clampPositive(parseFloat(weightKg), 0);
    const panelLength = clampPositive(parseFloat(panelLengthMm), 0);
    const cgDistance = clampPositive(parseFloat(cgDistanceMm), 0);
    const angle = clampPositive(parseFloat(openingAngleDeg), 0);
    const time = clampPositive(parseFloat(targetTimeSec), 0);
    const count = Math.max(1, Math.round(clampPositive(parseFloat(damperCount), 1)));
    const ratio = Math.max(MIN_MOTION_RATIO, clampPositive(parseFloat(motionRatio), 1));
    const efficiency = Math.min(
      1,
      Math.max(0.1, clampPositive(parseFloat(efficiencyPercent), 90) / 100),
    );
    const marginLow = Math.max(0, clampPositive(parseFloat(marginLowPercent), 10) / 100);
    const marginHigh = Math.max(
      marginLow,
      clampPositive(parseFloat(marginHighPercent), 30) / 100,
    );
    const rawLever =
      leverMode === "conservative"
        ? 1
        : leverMode === "vertical-start"
          ? Math.min(1, Math.abs(Math.sin(degToRad(angle))))
          : clampPositive(parseFloat(customLeverFactor), 1);
    const leverFactor = Math.min(1, Math.max(0, rawLever));
    const distanceMm = geometryMode === "length" ? panelLength / 2 : cgDistance;
    const distanceM = distanceMm / 1000;
    const hingeTorqueNm = weight * G * distanceM * leverFactor;
    const perDamperNm = hingeTorqueNm / count / ratio / efficiency;
    const recommendedLowNm = perDamperNm * (1 + marginLow);
    const recommendedHighNm = perDamperNm * (1 + marginHigh);
    const recommendedMidNm = (recommendedLowNm + recommendedHighNm) / 2;
    const lidRpm = (angle / 360 / time) * 60;
    const damperRpm = lidRpm * ratio;
    const normalizedProducts = products
      .map(normalizeProduct)
      .filter((product) => product.maxNm > 0)
      .map((product) => {
        const overlaps = product.maxNm >= recommendedLowNm && product.minNm <= recommendedHighNm;
        const coversMid = product.minNm <= recommendedMidNm && product.maxNm >= recommendedMidNm;
        const distance =
          recommendedMidNm < product.minNm
            ? product.minNm - recommendedMidNm
            : recommendedMidNm > product.maxNm
              ? recommendedMidNm - product.maxNm
              : 0;
        return { ...product, overlaps, coversMid, distance };
      })
      .sort((a, b) => {
        if (a.coversMid !== b.coversMid) return a.coversMid ? -1 : 1;
        if (a.overlaps !== b.overlaps) return a.overlaps ? -1 : 1;
        return a.distance - b.distance;
      })
      .slice(0, 4);

    return {
      weight,
      distanceMm,
      leverFactor,
      count,
      ratio,
      efficiency,
      hingeTorqueNm,
      perDamperNm,
      recommendedLowNm,
      recommendedHighNm,
      recommendedMidNm,
      lidRpm,
      damperRpm,
      normalizedProducts,
    };
  }, [
    cgDistanceMm,
    customLeverFactor,
    damperCount,
    efficiencyPercent,
    geometryMode,
    leverMode,
    marginHighPercent,
    marginLowPercent,
    motionRatio,
    openingAngleDeg,
    panelLengthMm,
    products,
    targetTimeSec,
    weightKg,
  ]);

  const recommendedLowGfcm = result.recommendedLowNm * NM_TO_GFCM;
  const recommendedHighGfcm = result.recommendedHighNm * NM_TO_GFCM;
  const perDamperGfcm = result.perDamperNm * NM_TO_GFCM;
  const hingeTorqueGfcm = result.hingeTorqueNm * NM_TO_GFCM;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.65fr)]">
      <section className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-[0_8px_28px_rgba(17,24,39,0.05)] sm:p-6">
        <div className="mb-5 flex flex-col gap-3 border-b border-[#E5E7EB] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#ED7606]">
              {copy.inputParameters}
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-[-0.04em] text-[#111827]">
              {copy.estimatorTitle}
            </h2>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#E5E7EB] bg-[#F8F9FA] px-3 py-2 text-xs font-bold text-[#6B7280]">
            <Calculator size={15} className="text-[#ED7606]" />
            {copy.liveCalculation}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label={copy.partWeight}
            value={weightKg}
            onChange={setWeightKg}
            suffix="kg"
            icon={<Weight size={13} />}
          />

          <label className="block">
            <span className="mb-2 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.1em] text-[#6B7280]">
              <Ruler size={13} />
              {copy.cgData}
            </span>
            <select
              value={geometryMode}
              onChange={(event) => setGeometryMode(event.target.value as GeometryMode)}
              className="h-12 w-full rounded-lg border border-[#E5E7EB] bg-white px-3.5 text-sm font-bold text-[#111827] outline-none transition-colors focus:border-[#ED7606] focus:ring-2 focus:ring-[#ED7606]/10"
            >
              <option value="length">{copy.estimateFromLength}</option>
              <option value="cg">{copy.knownCg}</option>
            </select>
          </label>

          {geometryMode === "length" ? (
            <Field
              label={copy.totalPartLength}
              value={panelLengthMm}
              onChange={setPanelLengthMm}
              suffix="mm"
              icon={<Ruler size={13} />}
            />
          ) : (
            <Field
              label={copy.axisToCg}
              value={cgDistanceMm}
              onChange={setCgDistanceMm}
              suffix="mm"
              icon={<Ruler size={13} />}
            />
          )}

          <Field
            label={copy.openingAngle}
            value={openingAngleDeg}
            onChange={setOpeningAngleDeg}
            suffix="deg"
            icon={<RotateCw size={13} />}
          />

          <Field
            label={copy.targetOpenTime}
            value={targetTimeSec}
            onChange={setTargetTimeSec}
            suffix="sec"
            icon={<Clock3 size={13} />}
          />

          <Field
            label={copy.damperCount}
            value={damperCount}
            onChange={setDamperCount}
            suffix="pcs"
            min={1}
            step={1}
            icon={<Gauge size={13} />}
          />

          <Field
            label={copy.motionRatio}
            value={motionRatio}
            onChange={setMotionRatio}
            suffix="x"
            min={MIN_MOTION_RATIO}
            icon={<SlidersHorizontal size={13} />}
          />

          <Field
            label={copy.transmissionEfficiency}
            value={efficiencyPercent}
            onChange={setEfficiencyPercent}
            suffix="%"
            min={10}
            icon={<SlidersHorizontal size={13} />}
          />

          <label className="block">
            <span className="mb-2 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.1em] text-[#6B7280]">
              <SlidersHorizontal size={13} />
              {copy.worstCaseLeverArm}
            </span>
            <select
              value={leverMode}
              onChange={(event) => setLeverMode(event.target.value as LeverMode)}
              className="h-12 w-full rounded-lg border border-[#E5E7EB] bg-white px-3.5 text-sm font-bold text-[#111827] outline-none transition-colors focus:border-[#ED7606] focus:ring-2 focus:ring-[#ED7606]/10"
            >
              <option value="conservative">{copy.conservative}</option>
              <option value="vertical-start">{copy.verticalStart}</option>
              <option value="custom">{copy.customFactor}</option>
            </select>
          </label>

          {leverMode === "custom" ? (
            <Field
              label={copy.leverFactor}
              value={customLeverFactor}
              onChange={setCustomLeverFactor}
              suffix="0-1"
              min={0}
              icon={<SlidersHorizontal size={13} />}
            />
          ) : (
            <div className="rounded-lg border border-[#E5E7EB] bg-[#F8F9FA] p-3.5">
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#9CA3AF]">
                {copy.currentLeverFactor}
              </p>
              <p className="mt-1 text-xl font-black text-[#111827]">
                {formatNumber(result.leverFactor, 3)}
              </p>
            </div>
          )}

          <Field
            label={copy.lowSafetyMargin}
            value={marginLowPercent}
            onChange={setMarginLowPercent}
            suffix="%"
            icon={<SlidersHorizontal size={13} />}
          />

          <Field
            label={copy.highSafetyMargin}
            value={marginHighPercent}
            onChange={setMarginHighPercent}
            suffix="%"
            icon={<SlidersHorizontal size={13} />}
          />
        </div>

        <div className="mt-5 rounded-lg border border-[#FFE3C2] bg-[#FFFAF5] p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[#ED7606]" />
            <p className="text-sm leading-relaxed text-[#6B7280]">
              {copy.note}
            </p>
          </div>
        </div>
      </section>

      <aside className="space-y-4">
        <section className="rounded-xl border border-[#E5E7EB] bg-[#111827] p-4 text-white shadow-[0_18px_50px_rgba(17,24,39,0.18)] sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#FBBF24]">
                {copy.recommendedRange}
              </p>
              <h2 className="mt-1 text-xl font-black tracking-[-0.04em]">{copy.perDamperTarget}</h2>
            </div>
            <Gauge size={22} className="text-[#ED7606]" />
          </div>

          <div className="rounded-lg bg-white p-4 text-[#111827]">
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#9CA3AF]">
              {copy.initialTorqueEstimate}
            </p>
            <p className="mt-1 text-3xl font-black tracking-[-0.05em] text-[#ED7606] tabular-nums">
              {formatGfcm(recommendedLowGfcm)}-{formatGfcm(recommendedHighGfcm)}
            </p>
            <p className="mt-1 text-sm font-bold text-[#6B7280]">{copy.perDamperUnit}</p>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-white/10 bg-white/7 p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/45">
                {copy.nmRange}
              </p>
              <p className="mt-1 text-lg font-black tabular-nums">
                {formatTorqueNm(result.recommendedLowNm)}-{formatTorqueNm(result.recommendedHighNm)}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/7 p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/45">
                {copy.damperRpm}
              </p>
              <p className="mt-1 text-lg font-black tabular-nums">
                {formatNumber(result.damperRpm, 2)} rpm
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <Metric
            label={copy.loadTorque}
            value={`${formatTorqueNm(result.hingeTorqueNm)} N·m`}
            sub={`${formatGfcm(hingeTorqueGfcm)} ${copy.atHingeAxis}`}
          />
          <Metric
            label={copy.baseTorque}
            value={`${formatGfcm(perDamperGfcm)} gf·cm`}
            sub={`${formatTorqueNm(result.perDamperNm)} ${copy.beforeMargin}`}
            accent
          />
          <Metric
            label={copy.cgDistance}
            value={`${formatNumber(result.distanceMm, 1)} mm`}
            sub={geometryMode === "length" ? copy.estimatedLength : copy.userInput}
          />
          <Metric
            label={copy.partRpm}
            value={`${formatNumber(result.lidRpm, 2)} rpm`}
            sub={`${copy.ratio} ${formatNumber(result.ratio, 2)}x`}
          />
        </section>

        <section className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-[0_8px_28px_rgba(17,24,39,0.04)]">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#ED7606]">
                {copy.referenceProducts}
              </p>
              <h3 className="mt-0.5 text-lg font-black tracking-[-0.03em] text-[#111827]">
                {copy.closestRange}
              </h3>
            </div>
          </div>

          <div className="space-y-2.5">
            {result.normalizedProducts.map((product) => (
              <Link
                key={product.url}
                href={product.url}
                className="group block rounded-lg border border-[#E5E7EB] bg-[#F8F9FA] p-3 transition-colors hover:border-[#ED7606]/45 hover:bg-white"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-black text-[#111827]">{product.model}</span>
                      {product.coversMid && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.08em] text-emerald-700">
                          <CheckCircle2 size={11} />
                          {copy.match}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-xs font-semibold text-[#6B7280]">
                      {product.name}
                    </p>
                  </div>
                  <span className="shrink-0 text-right text-xs font-black text-[#ED7606] tabular-nums">
                    {formatGfcm(product.minNm * NM_TO_GFCM)}-
                    {formatGfcm(product.maxNm * NM_TO_GFCM)}
                    <br />
                    gf·cm
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#9CA3AF]">
            {copy.formula}
          </p>
          <div className="mt-2 space-y-1.5 font-mono text-xs leading-relaxed text-[#374151]">
            <p>T_load = m × 9.80665 × L × lever_factor</p>
            <p>T_damper = T_load / count / ratio / efficiency</p>
            <p>rpm = angle / 360 / time × 60 × ratio</p>
          </div>
        </section>
      </aside>
    </div>
  );
}
