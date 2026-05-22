import type { Product } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Cog, Gauge, Ruler, Wrench, Volume2, VolumeX } from "lucide-react";
import { formatTorque, getTorqueRange, formatMount, findSpecValue } from "@/lib/products";

const PLACEHOLDER = "/images/products/gear-damper/GearDamperSingle.webp";

function SpecPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | number | null;
}) {
  if (value == null || value === "") return null;

  return (
    <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-white px-2.5 py-1.5">
      <span className="text-[#ED7606]">{icon}</span>
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
    <div className="hidden lg:grid grid-cols-2 items-stretch gap-4">
      {products.map((product) => {
        const imgSrc = product.image || PLACEHOLDER;
        const torqueLabel = formatTorque(product);
        const teeth = findSpecValue(product, "teeth");
        const mod = findSpecValue(product, "module");
        const diameter = findSpecValue(product, "outer diameter");
        const mount = formatMount(product.assembly_method);
        const torqueRange = getTorqueRange(product);
        const hasSpecs =
          teeth != null || diameter != null || mod != null || Boolean(mount) || Boolean(product.sound_type);
        const forceValue = parseForceValue(product.hard_force);
        const forceScaleMax = forceValue ? niceForceMax(forceValue * 1.45) : null;
        const forceWidth =
          forceValue && forceScaleMax ? Math.max(10, Math.min(100, (forceValue / forceScaleMax) * 100)) : 0;
        const forceLabel = formatForceLabel(product.hard_force);

        return (
          <article
            key={product.slug}
            className="group grid h-full grid-cols-[112px_1fr] gap-3 rounded-xl border border-[#E5E7EB] bg-white p-3.5 shadow-[0_14px_38px_rgba(17,24,39,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#ED7606]/35 hover:shadow-[0_18px_48px_rgba(237,118,6,0.12)]"
          >
            <Link
              href={`/products/${product.slug}`}
              className="relative h-[112px] w-[112px] shrink-0 overflow-hidden rounded-xl bg-[#F8F9FA]"
            >
              <Image
                src={imgSrc}
                alt={product.name}
                fill
                className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                sizes="112px"
                loading="lazy"
              />
            </Link>

            <div className="flex min-w-0 flex-col">
              <div>
                <div className="mb-1 flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#ED7606]">
                    {product.model}
                  </span>
                  {product.series && (
                    <span className="text-[9px] font-semibold text-[#9CA3AF] bg-[#F3F4F6] px-1.5 py-0.5 rounded-full leading-none">
                      {product.series}
                    </span>
                  )}
                </div>
                <Link href={`/products/${product.slug}`}>
                  <h3 className="line-clamp-2 min-h-[34px] text-[14px] font-extrabold leading-tight text-[#111827] transition-colors group-hover:text-[#ED7606]">
                    {product.name}
                  </h3>
                </Link>
              </div>

              <div className="mt-3">
                {product.category === "latch" ? (
                  <div className="rounded-xl border border-[#FFE3C2] bg-[#FFFAF5] px-3 py-2">
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
                      <div className="absolute inset-y-0 left-0 w-full bg-[linear-gradient(90deg,rgba(237,118,6,0.08),rgba(237,118,6,0.14))]" />
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
                  <div className="rounded-xl border border-[#FFE3C2] bg-[#FFFAF5] px-3 py-2">
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
                      <div className="absolute inset-y-0 left-0 w-full bg-[linear-gradient(90deg,rgba(237,118,6,0.08),rgba(237,118,6,0.14))]" />
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
                  <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-[#F8F9FA] px-3 py-2 text-[11px] font-semibold text-[#CBD5E1]">
                    Custom torque range
                  </div>
                )}
              </div>

              <div className="mt-auto pt-3">
                <div className="flex items-center justify-between gap-2">
                  {hasSpecs && (
                    <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
                      <SpecPill icon={<Cog size={12} />} label="Teeth" value={teeth} />
                      <SpecPill icon={<Cog size={12} />} label="M" value={mod} />
                      <SpecPill icon={<Ruler size={12} />} label="Dia" value={diameter} />
                      <SpecPill icon={<Wrench size={12} />} label="Mount" value={mount} />
                      {product.sound_type && (
                        <SpecPill
                          icon={
                            product.sound_type === "audible" ? (
                              <Volume2 size={12} />
                            ) : (
                              <VolumeX size={12} />
                            )
                          }
                          label="Sound"
                          value={product.sound_type === "audible" ? "Audible" : "Silent"}
                        />
                      )}
                    </div>
                  )}
                  <Link
                    href={`/products/${product.slug}`}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#E5E7EB] text-[#111827] transition-colors hover:border-[#ED7606] hover:bg-[#ED7606] hover:text-white"
                    aria-label={`View ${product.name}`}
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
