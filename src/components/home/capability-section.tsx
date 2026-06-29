import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import type { SiteLocale } from "@/lib/i18n-ui";
import { getHomeCopy } from "@/lib/home-i18n";

export function CapabilitySection({ locale = "en" }: { locale?: SiteLocale }) {
  const copy = getHomeCopy(locale).capability;

  return (
    <section className="section bg-[#F5F4F1] overflow-hidden" id="capability">
      <div className="shell">
        <div className="grid lg:grid-cols-[minmax(320px,0.82fr)_minmax(0,1.08fr)] gap-8 lg:gap-12 items-stretch">
          <div className="flex min-w-0 flex-col lg:min-h-[520px]">
            <div>
              <span className="eyebrow">{copy.eyebrow}</span>
              <h2 className="mt-2.5 lg:mt-3.5 max-w-[520px] text-[30px] sm:text-[34px] lg:text-[clamp(34px,3.5vw,50px)] leading-[1.02] lg:leading-[0.97] tracking-[-0.04em] font-extrabold text-[#111827] text-balance">
                {copy.title}
              </h2>
              <p className="text-[#6B7280] text-[15px] lg:text-[17px] max-w-[520px] mt-3 lg:mt-4 leading-relaxed">
                {copy.description}
              </p>
            </div>

            <div className="grid flex-1 content-end gap-3.5 lg:gap-4 mt-6 lg:mt-8">
              {copy.items.map((cap, i) => (
                <Reveal key={cap.title} delay={i === 0 ? undefined : (i as 1 | 2)}>
                  <div className="grid min-h-[104px] grid-cols-[46px_1fr] lg:grid-cols-[56px_1fr] gap-3 lg:gap-4 items-center p-4 lg:p-5 rounded-xl border border-white/60 bg-white/80 backdrop-blur-sm hover:border-[#ED7606]/30 hover:shadow-[0_8px_28px_rgba(237,118,6,0.07)] hover:-translate-y-0.5 transition-all duration-300">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#FFF1E3] to-[#FFE0C2] text-[#ED7606] text-xs font-black tracking-[0.08em] shadow-[0_2px_8px_rgba(237,118,6,0.10)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-base lg:text-[19px] tracking-[-0.02em] font-bold text-[#111827]">{cap.title}</h3>
                      <p className="mt-1 text-[#6B7280] text-xs lg:text-sm">{cap.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Factory images */}
          <div className="hidden min-w-0 lg:block">
            <Reveal className="h-full">
              <div className="grid h-full min-h-[520px] grid-cols-2 grid-rows-[1.05fr_0.95fr] gap-4">
                <figure className="group relative col-span-2 min-h-0 rounded-xl overflow-hidden border border-[#E5E7EB] shadow-[0_8px_24px_rgba(237,118,6,0.04)]">
                  <Image src="/images/company/automation-workshop.webp" alt="TEAO automated workshop" fill className="object-cover transition-transform duration-[0.7s] group-hover:scale-[1.04]" sizes="(max-width: 1024px) 100vw, 50vw" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <figcaption className="absolute left-5 bottom-5 text-white/90 text-sm font-bold tracking-wide">{copy.captions[0]}</figcaption>
                </figure>
                <figure className="group relative min-h-0 rounded-xl overflow-hidden border border-[#E5E7EB] shadow-[0_8px_24px_rgba(237,118,6,0.04)]">
                  <Image src="/images/company/production-workshop.webp" alt="TEAO production workshop" fill className="object-cover transition-transform duration-[0.7s] group-hover:scale-[1.04]" sizes="(max-width: 1024px) 100vw, 50vw" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <figcaption className="absolute left-4 bottom-4 text-white/85 text-xs font-bold tracking-wide">{copy.captions[1]}</figcaption>
                </figure>
                <figure className="group relative min-h-0 rounded-xl overflow-hidden border border-[#E5E7EB] shadow-[0_8px_24px_rgba(237,118,6,0.04)]">
                  <Image src="/images/company/automation-equipment-2.webp" alt="TEAO automation equipment" fill className="object-cover transition-transform duration-[0.7s] group-hover:scale-[1.04]" sizes="(max-width: 1024px) 100vw, 50vw" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <figcaption className="absolute left-4 bottom-4 text-white/85 text-xs font-bold tracking-wide">{copy.captions[2]}</figcaption>
                </figure>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
