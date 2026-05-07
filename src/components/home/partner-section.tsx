import Image from "next/image";
import { PARTNERS } from "@/lib/constants";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

export function PartnerSection() {
  return (
    <section className="py-14 lg:py-20 bg-[#171717] text-white" id="partners">
      <div className="shell">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.55fr)] gap-4 lg:gap-12 items-end mb-5 lg:mb-8">
            <div>
              <span className="eyebrow">Partners</span>
              <h2 className="mt-2.5 lg:mt-3.5 text-[30px] sm:text-[34px] lg:text-[clamp(34px,4vw,58px)] leading-[1.02] lg:leading-[0.98] tracking-[-0.04em] font-extrabold text-white text-balance">
                Our Customers
              </h2>
              <p className="mt-3 text-white/55 text-[15px] lg:text-[17px] leading-relaxed max-w-[620px]">
                Trusted across automotive and appliance supply chains.
              </p>
            </div>
            <p className="text-white/55 text-[15px] lg:text-[17px] leading-relaxed max-w-[560px]">
              TEAO supports demanding OEM programs with validated damper platforms, engineering review and repeatable mass-production quality.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-2.5">
          {PARTNERS.map((partner, i) => (
            <Reveal
              key={partner.name}
              delay={i % 3 === 0 ? undefined : ((i % 3) as 1 | 2)}
              className={cn(i >= 6 && "hidden lg:block")}
            >
              <div className="group min-h-[74px] lg:min-h-[112px] flex flex-col items-center justify-center gap-1.5 lg:gap-2.5 p-2 lg:p-3 rounded-lg border border-white/10 bg-white/4 hover:-translate-y-1 hover:bg-[#ED7606]/10 hover:border-[#ED7606]/35 transition-all duration-300">
                <div className="relative w-full h-9 lg:h-12">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-[1.08]"
                    sizes="(max-width: 1024px) 33vw, 16vw"
                  />
                </div>
                <span className="text-[10px] lg:text-[11px] font-bold text-white/55 tracking-[0.04em]">
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
