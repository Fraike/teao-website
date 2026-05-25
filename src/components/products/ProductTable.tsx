"use client";

import type { Product } from "@/types";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight, Cog, Gauge, Ruler, Wrench, Volume2, VolumeX,
  RotateCw, CircleDot, MoveHorizontal, Wind, Zap,
} from "lucide-react";
import { formatTorque, getTorqueRange, formatMount, findSpecValue } from "@/lib/products";

const PLACEHOLDER = "/images/products/gear-damper/GearDamperSingle.webp";

function SpecPill({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | number | null;
  accent?: boolean;
}) {
  if (value == null || value === "") return null;

  return (
    <span
      className={`inline-flex min-w-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 transition-colors ${
        accent
          ? "border-[#FED7AA] bg-[#FFF7ED]"
          : "border-[#E5E7EB] bg-white"
      }`}
    >
      <span className={accent ? "text-[#ED7606]" : "text-[#9CA3AF]"}>{icon}</span>
      <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.08em] text-[#9CA3AF]">{label}</span>
      <span className="truncate text-[12px] font-extrabold text-[#111827]">{String(value)}</span>
    </span>
  );
}

function parseForceValue(value?: string) {
  if (!value) return null;
  const match = value.match(/[\d.]+/);
  if (!match) return null;
  return Number(match[0]);
}

function formatForceLabel(value?: string) {
  if (!value) return null;
  return value.replace(/\s*N$/i, " N").replace(/(\d)N$/i, "$1 N");
}

function niceForceMax(value: number) {
  if (value <= 5) return 5;
  if (value <= 10) return 10;
  if (value <= 20) return 20;
  if (value <= 50) return 50;
  return Math.ceil(value / 50) * 50;
}

export function ProductTable({ products }: { products: Product[] }) {
  return (
    <div className="hidden lg:grid grid-cols-2 items-stretch gap-5">
      {products.map((product) => {
        const imgSrc = product.image || PLACEHOLDER;
        const torqueLabel = formatTorque(product);
        const torqueRange = getTorqueRange(product);

        // Category-specific specs
        const dia = findSpecValue(product, "尺寸");
        const teeth = findSpecValue(product, "teeth");
        const mod = findSpecValue(product, "module");
        const mount = formatMount(product.assembly_method);
        const innerDia = findSpecValue(product, "内径");
        const angle = findSpecValue(product, "角度限制");
        const stroke = findSpecValue(product, "行程");
        const principle = findSpecValue(product, "原理类型");
        const operatingForce = findSpecValue(product, "操作力") || product.force_range || product.hard_force;

        const forceValue = parseForceValue(product.hard_force);
        const forceScaleMax = forceValue ? niceForceMax(forceValue * 1.45) : null;
        const forceWidth =
          forceValue && forceScaleMax ? Math.max(10, Math.min(100, (forceValue / forceScaleMax) * 100)) : 0;
        const forceLabel = formatForceLabel(product.hard_force);

        return (
          <article
            key={product.slug}
            className="group grid h-full grid-cols-[120px_1fr] items-center gap-5 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0_4px_24px_rgba(17,24,39,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#ED7606]/30 hover:shadow-[0_16px_40px_rgba(237,118,6,0.10)]"
          >
            {/* Image */}
            <Link
              href={`/products/${product.slug}`}
              className="relative h-[120px] w-[120px] shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#F8F9FA] to-[#FFF]"
              data-analytics-event="product_click"
              data-analytics-target-type="product"
              data-analytics-target-id={product.slug}
              data-analytics-source="product_list"
            >
              <Image
                src={imgSrc}
                alt={product.name}
                fill
                className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                sizes="120px"
                loading="lazy"
              />
            </Link>

            {/* Content */}
            <div className="flex min-w-0 flex-col">
              {/* Header */}
              <div>
                <Link
                  href={`/products/${product.slug}`}
                  data-analytics-event="product_click"
                  data-analytics-target-type="product"
                  data-analytics-target-id={product.slug}
                  data-analytics-source="product_list"
                >
                  <h3 className="line-clamp-2 text-[14px] font-extrabold leading-tight text-[#111827] transition-colors group-hover:text-[#ED7606]">
                    {product.name}
                  </h3>
                </Link>
                {product.series && (
                  <span className="mt-1 inline-block rounded-full bg-[#F3F4F6] px-2 py-0.5 text-[9px] font-semibold text-[#9CA3AF]">
                    {product.series}
                  </span>
                )}
              </div>

              {/* Torque / Force bar */}
              <div className="mt-3">
                {product.category === "latch" ? (
                  <div className="rounded-xl border border-[#FFE3C2] bg-gradient-to-br from-[#FFFAF5] to-[#FFF7ED] px-3.5 py-2.5">
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-[#9CA3AF]">
                        <Wrench size={13} className="text-[#ED7606]" />
                        Press force
                      </span>
                      <span className="text-[11px] font-extrabold text-[#111827] tabular-nums">
                        {forceLabel ?? "—"}
                      </span>
                    </div>
                    <div className="relative h-3 overflow-hidden rounded-full bg-white shadow-inner ring-1 ring-[#FFE3C2]">
                      <div className="absolute inset-y-0 left-0 w-full bg-[linear-gradient(90deg,rgba(237,118,6,0.06),rgba(237,118,6,0.12))]" />
                      <div
                        className="absolute inset-y-1 left-0 rounded-full bg-[#ED7606] shadow-[0_0_12px_rgba(237,118,6,0.35)] transition-all duration-700"
                        style={{ width: `${forceWidth}%` }}
                      />
                    </div>
                    {forceScaleMax && (
                      <div className="mt-1 flex justify-between text-[9px] font-semibold text-[#C9A27F]">
                        <span>0</span>
                        <span>{forceScaleMax} N</span>
                      </div>
                    )}
                  </div>
                ) : torqueRange ? (
                  <div className="rounded-xl border border-[#FFE3C2] bg-gradient-to-br from-[#FFFAF5] to-[#FFF7ED] px-3.5 py-2.5">
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-[#9CA3AF]">
                        <Gauge size={13} className="text-[#ED7606]" />
                        Adjustable torque
                      </span>
                      <span className="text-[11px] font-extrabold text-[#111827] tabular-nums">
                        {torqueLabel}
                      </span>
                    </div>
                    <div className="relative h-3 overflow-hidden rounded-full bg-white shadow-inner ring-1 ring-[#FFE3C2]">
                      <div className="absolute inset-y-0 left-0 w-full bg-[linear-gradient(90deg,rgba(237,118,6,0.06),rgba(237,118,6,0.12))]" />
                      <div
                        className="absolute inset-y-1 rounded-full bg-[#ED7606] shadow-[0_0_12px_rgba(237,118,6,0.35)] transition-all duration-700"
                        style={{
                          left: `${torqueRange.start}%`,
                          width: `${torqueRange.width}%`,
                        }}
                      />
                    </div>
                    <div className="mt-1 flex justify-between text-[9px] font-semibold text-[#C9A27F]">
                      <span>0</span>
                      <span>{torqueRange.scaleMax} {product.torque?.unit}</span>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-[#F8F9FA] px-3.5 py-2.5 text-[11px] font-semibold text-[#CBD5E1]">
                    Custom torque range
                  </div>
                )}
              </div>

              {/* Category-specific specs */}
              <div className="mt-auto pt-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
                    {product.category === "gear-damper" && (
                      <>
                        <SpecPill icon={<Ruler size={12} />} label="Dia" value={dia} accent />
                        <SpecPill icon={<Cog size={12} />} label="Teeth" value={teeth} />
                        <SpecPill icon={<Cog size={12} />} label="M" value={mod} />
                        <SpecPill icon={<Wrench size={12} />} label="Mount" value={mount} />
                      </>
                    )}

                    {product.category === "axial-damper" && (
                      <>
                        <SpecPill icon={<Ruler size={12} />} label="Dia" value={dia} accent />
                        <SpecPill icon={<CircleDot size={12} />} label="Inner" value={innerDia} />
                        <SpecPill icon={<RotateCw size={12} />} label="Angle" value={angle} />
                      </>
                    )}

                    {product.category === "glove-box-damper" && (
                      <>
                        <SpecPill icon={<MoveHorizontal size={12} />} label="Stroke" value={stroke} accent />
                        <SpecPill icon={<Wind size={12} />} label="Type" value={principle} accent />
                      </>
                    )}

                    {product.category === "latch" && (
                      <>
                        <SpecPill
                          icon={product.sound_type === "audible" ? <Volume2 size={12} /> : <VolumeX size={12} />}
                          label="Sound"
                          value={product.sound_type === "audible" ? "Audible" : "Silent"}
                          accent
                        />
                        <SpecPill icon={<Zap size={12} />} label="Force" value={operatingForce} accent />
                      </>
                    )}

                    {product.category === "other" && (
                      <>
                        {Object.entries(product.specifications)
                          .filter(([, v]) => v != null && v !== "")
                          .slice(0, 4)
                          .map(([key, value]) => (
                            <SpecPill key={key} icon={<Ruler size={12} />} label={key} value={String(value)} />
                          ))}
                      </>
                    )}
                  </div>

                  <Link
                    href={`/products/${product.slug}`}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E5E7EB] text-[#111827] transition-all hover:border-[#ED7606] hover:bg-[#ED7606] hover:text-white hover:shadow-lg hover:shadow-[#ED7606]/20"
                    aria-label={`View ${product.name}`}
                    data-analytics-event="product_click"
                    data-analytics-target-type="product"
                    data-analytics-target-id={product.slug}
                    data-analytics-source="product_list"
                  >
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
