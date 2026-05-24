import Image from "next/image";
import { PARTNERS } from "@/lib/constants";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

export function PartnerSection() {
  return (
    <section className="py-14 lg:py-20 bg-[#FAF9F6]" id="partners">
      <div className="shell">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.55fr)] gap-4 lg:gap-12 items-end mb-6 lg:mb-9">
            <div>
              <span className="eyebrow">Partners</span>
              <h2 className="mt-2.5 lg:mt-3.5 text-[30px] sm:text-[34px] lg:text-[clamp(34px,3.8vw,52px)] leading-[1.02] lg:leading-[0.97] tracking-[-0.04em] font-extrabold text-[#111827] text-balance">
                Our Customers
              </h2>
              <p className="mt-3 text-[#6B7280] text-[15px] lg:text-[17px] leading-relaxed max-w-[620px]">
                Trusted across automotive and appliance supply chains.
              </p>
            </div>
            <p className="text-[#6B7280] text-[15px] lg:text-[17px] leading-relaxed max-w-[560px]">
              TEAO supports demanding OEM programs with validated damper platforms, engineering review and repeatable mass-production quality.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 lg:gap-3">
          {PARTNERS.map((partner, i) => (
            <Reveal
              key={partner.name}
              delay={i % 3 === 0 ? undefined : ((i % 3) as 1 | 2)}
              className={cn(i >= 6 && "hidden lg:block")}
            >
              <div className="group min-h-[74px] lg:min-h-[112px] flex flex-col items-center justify-center gap-1.5 lg:gap-2.5 p-2 lg:p-3 rounded-xl border border-[#E5E7EB]/80 bg-white hover:-translate-y-1 hover:border-[#ED7606]/35 hover:shadow-[0_10px_30px_rgba(237,118,6,0.06)] transition-all duration-300">
                <div className="relative w-full h-9 lg:h-12">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    loading="lazy"
                    className="object-contain transition-transform duration-300 group-hover:scale-[1.10]"
                    sizes="(max-width: 1024px) 33vw, 16vw"
                  />
                </div>
                <span className="text-[10px] lg:text-[11px] font-bold text-[#9CA3AF] tracking-[0.04em]">
                  {partner.name}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
