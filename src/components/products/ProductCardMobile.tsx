"use client";

import type { Product } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { Volume2, VolumeX, Cog, Ruler, Wrench, CircleDot, RotateCw, MoveHorizontal, Wind, Zap } from "lucide-react";
import { formatTorque, getTorqueRange, formatMount, findSpecValue } from "@/lib/products";

const PLACEHOLDER = "/images/products/gear-damper/GearDamperSingle.webp";

export function ProductCardMobile({ product }: { product: Product }) {
  const imgSrc = product.image || PLACEHOLDER;
  const torqueLabel = formatTorque(product);
  const torqueRange = getTorqueRange(product);

  const dia = findSpecValue(product, "尺寸");
  const teeth = findSpecValue(product, "teeth");
  const mod = findSpecValue(product, "module");
  const mount = formatMount(product.assembly_method);
  const innerDia = findSpecValue(product, "内径");
  const angle = findSpecValue(product, "角度限制");
  const stroke = findSpecValue(product, "行程");
  const principle = findSpecValue(product, "原理类型");
  const operatingForce = findSpecValue(product, "操作力") || product.force_range || product.hard_force;

  return (
    <div className="lg:hidden rounded-2xl border border-[#E5E7EB] bg-white p-3 shadow-[0_2px_12px_rgba(17,24,39,0.02)] hover:border-[#ED7606]/25 hover:shadow-[0_8px_24px_rgba(237,118,6,0.06)] transition-all duration-300">
      <div className="flex gap-3 items-center">
        {/* Image */}
        <Link
          href={`/products/${product.slug}`}
          className="relative w-[88px] h-[66px] sm:w-[100px] sm:h-[75px] rounded-xl bg-gradient-to-br from-[#F8F9FA] to-[#FFF] overflow-hidden shrink-0"
          data-analytics-event="product_click"
          data-analytics-target-type="product"
          data-analytics-target-id={product.slug}
          data-analytics-source="product_list"
        >
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            className="object-contain p-2.5"
            sizes="100px"
            loading="lazy"
          />
        </Link>

        <div className="flex flex-col justify-between min-w-0 flex-1">
          {/* Header */}
          <div>
            <Link
              href={`/products/${product.slug}`}
              data-analytics-event="product_click"
              data-analytics-target-type="product"
              data-analytics-target-id={product.slug}
              data-analytics-source="product_list"
            >
              <h3 className="text-[13px] font-extrabold text-[#111827] leading-tight line-clamp-2">
                {product.name}
              </h3>
            </Link>
            {product.series && (
              <span className="mt-0.5 inline-block text-[9px] font-semibold text-[#9CA3AF] bg-[#F3F4F6] px-1.5 py-0.5 rounded-full leading-none">
                {product.series}
              </span>
            )}
          </div>

          {/* Torque / Force bar */}
          {product.category === "latch" ? (
            <div className="mt-1.5 text-[11px] flex items-center gap-2">
              <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#9CA3AF]">Force</span>
              <span className="font-extrabold text-[#111827]">{product.hard_force || "—"}</span>
              {product.sound_type && (
                <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${product.sound_type === "audible" ? "text-[#ED7606]" : "text-[#6B7280]"}`}>
                  {product.sound_type === "audible" ? <Volume2 size={12} /> : <VolumeX size={12} />}
                  {product.sound_type === "audible" ? "Audible" : "Silent"}
                </span>
              )}
            </div>
          ) : torqueRange ? (
            <div className="mt-1.5">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#9CA3AF]">Torque</span>
                <span className="text-[11px] font-extrabold text-[#111827]">{torqueLabel}</span>
              </div>
              <div className="relative h-2.5 rounded-full bg-[#F3F4F6] overflow-hidden">
                <div
                  className="absolute inset-y-0.5 rounded-full transition-all duration-700"
                  style={{
                    left: `${torqueRange.start}%`,
                    width: `${torqueRange.width}%`,
                    background: "linear-gradient(90deg, #FBBF24, #F59E0B, #ED7606)",
                  }}
                />
              </div>
            </div>
          ) : (
            <p className="mt-1 text-[10px] text-[#CBD5E1] italic">Custom torque range</p>
          )}

          {/* Category-specific specs */}
          <div className="flex items-center justify-between gap-2 mt-2">
            <div className="flex items-center gap-2 text-[10px] text-[#6B7280] flex-wrap">
              {product.category === "gear-damper" && (
                <>
                  {dia && <MobileSpec label="Dia" value={dia} accent />}
                  {teeth != null && <MobileSpec label="Teeth" value={teeth} />}
                  {mod != null && <MobileSpec label="M" value={mod} />}
                  {mount && <MobileSpec label="Mount" value={mount} />}
                </>
              )}
              {product.category === "axial-damper" && (
                <>
                  {dia && <MobileSpec label="Dia" value={dia} accent />}
                  {innerDia && <MobileSpec label="Inner" value={innerDia} />}
                  {angle && <MobileSpec label="Angle" value={angle} />}
                </>
              )}
              {product.category === "glove-box-damper" && (
                <>
                  {stroke && <MobileSpec label="Stroke" value={stroke} accent />}
                  {principle && <MobileSpec label="Type" value={principle} />}
                </>
              )}
              {product.category === "latch" && (
                <>
                  {product.sound_type && (
                    <span className={`inline-flex items-center gap-1 ${product.sound_type === "audible" ? "text-[#ED7606]" : "text-[#6B7280]"}`}>
                      {product.sound_type === "audible" ? <Volume2 size={11} /> : <VolumeX size={11} />}
                      <span className="font-semibold">{product.sound_type === "audible" ? "Audible" : "Silent"}</span>
                    </span>
                  )}
                  {operatingForce && <MobileSpec label="Force" value={operatingForce} />}
                </>
              )}
              {product.category === "other" && (
                <>
                  {Object.entries(product.specifications)
                    .filter(([, v]) => v != null && v !== "")
                    .slice(0, 3)
                    .map(([key, value]) => (
                      <MobileSpec key={key} label={key} value={String(value)} />
                    ))}
                </>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/products/${product.slug}`}
                className="text-[11px] font-bold text-[#111827] hover:text-[#ED7606]"
                data-analytics-event="product_click"
                data-analytics-target-type="product"
                data-analytics-target-id={product.slug}
                data-analytics-source="product_list"
              >
                Details
              </Link>
              <Link
                href={`/contact?product=${encodeURIComponent(product.model)}`}
                className="text-[11px] font-bold text-[#ED7606]"
                data-analytics-event="cta_click"
                data-analytics-target-type="cta"
                data-analytics-target-id={product.model}
                data-analytics-source="mobile_card"
              >
                Inquire
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileSpec({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="text-[#9CA3AF] font-medium">{label}</span>
      <span className={`font-semibold ${accent ? "text-[#ED7606]" : "text-[#374151]"}`}>
        {typeof value === "number" ? String(value) : value}
      </span>
    </span>
  );
}
