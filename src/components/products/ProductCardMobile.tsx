import type { Product } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { formatTorque, getTorqueRange, formatMount, findSpecValue } from "@/lib/products";

const PLACEHOLDER = "/images/products/gear-damper/GearDamperSingle.webp";

export function ProductCardMobile({ product }: { product: Product }) {
  const imgSrc = product.image || PLACEHOLDER;
  const torqueLabel = formatTorque(product);
  const teeth = findSpecValue(product, "teeth");
  const mod = findSpecValue(product, "module");
  const diameter = findSpecValue(product, "outer diameter");
  const mount = formatMount(product.assembly_method);
  const torqueRange = getTorqueRange(product);

  return (
    <div className="lg:hidden rounded-xl border border-[#E5E7EB] bg-white p-2.5 hover:border-[#ED7606]/25 hover:shadow-sm transition-all duration-300">
      <div className="flex gap-3">
        <Link
          href={`/products/${product.slug}`}
          className="relative w-[80px] h-[60px] sm:w-[100px] sm:h-[75px] rounded-lg bg-[#F8F9FA] overflow-hidden shrink-0"
        >
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            className="object-contain p-2"
            sizes="100px"
            loading="lazy"
          />
        </Link>

        <div className="flex flex-col justify-between min-w-0 flex-1">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[#ED7606] text-[10px] font-black uppercase tracking-[0.12em]">
                {product.model}
              </span>
              {product.series && (
                <span className="text-[9px] font-semibold text-[#9CA3AF] bg-[#F3F4F6] px-1.5 py-0.5 rounded-full leading-none">
                  {product.series}
                </span>
              )}
            </div>
            <Link href={`/products/${product.slug}`}>
              <h3 className="text-[13px] font-extrabold text-[#111827] leading-tight line-clamp-2">
                {product.name}
              </h3>
            </Link>
          </div>

          {torqueRange ? (
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

          <div className="flex items-center justify-between gap-2 mt-2">
            <div className="flex items-center gap-3 text-[10px] text-[#6B7280]">
              {teeth != null && (
                <span>
                  <span className="text-[#9CA3AF]">Teeth </span>
                  <span className="font-semibold text-[#374151]">{String(teeth)}</span>
                </span>
              )}
              {mod != null && (
                <span>
                  <span className="text-[#9CA3AF]">Mod </span>
                  <span className="font-semibold text-[#374151]">{String(mod)}</span>
                </span>
              )}
              {diameter != null && (
                <span>
                  <span className="text-[#9CA3AF]">Dia </span>
                  <span className="font-semibold text-[#374151]">{String(diameter)}</span>
                </span>
              )}
              {mount && (
                <span>
                  <span className="text-[#9CA3AF]">Mount </span>
                  <span className="font-semibold text-[#374151]">{mount}</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/products/${product.slug}`}
                className="text-[11px] font-bold text-[#111827] hover:text-[#ED7606]"
              >
                Details
              </Link>
              <Link
                href={`/contact?product=${encodeURIComponent(product.model)}`}
                className="text-[11px] font-bold text-[#ED7606]"
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
