import { Reveal } from "@/components/ui/reveal";
import Image from "next/image";
import { competencies } from "@/content/about";
import { Cog, Wrench, Settings } from "lucide-react";
import { AboutSectionBackdrop } from "./AboutSectionBackdrop";

const icons = [Settings, Wrench, Cog];

export function CoreCompetencies() {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:pt-12 lg:pb-24 bg-[#F0F2F5]">
      <AboutSectionBackdrop
        image="/images/about/bg-cylindrical-damper-outline.svg"
        position="right 9% top 15%"
        size="clamp(210px, 24vw, 340px) auto"
      />
      <div className="shell relative z-10">
        <Reveal>
          <div className="text-center">
            <span className="eyebrow">Core Competencies</span>
            <h2 className="mt-2.5 lg:mt-3.5 text-[26px] sm:text-[30px] lg:text-[clamp(30px,3.6vw,46px)] leading-[1.02] tracking-[-0.04em] font-extrabold text-[#111827]">
              Complete manufacturing capabilities.
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5 mt-8 lg:mt-10">
          {competencies.map((comp, i) => {
            const Icon = icons[i];
            const isHighlight = comp.highlight;

            return (
              <div
                key={comp.title}
                className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 bg-white ${
                  isHighlight
                    ? "border-[#ED7606]/40 shadow-[0_8px_32px_rgba(237,118,6,.08)]"
                    : "border-[#E5E7EB] shadow-[0_4px_16px_rgba(0,0,0,.03)]"
                }`}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={comp.image}
                    alt={comp.title}
                    fill
                    loading="lazy"
                    className="object-cover transition-transform duration-[0.65s] group-hover:scale-[1.04]"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
                </div>

                <div className="relative bg-white p-5 lg:p-6">
                  <div className="flex items-start gap-3">
                    <Icon
                      className={`w-6 h-6 mt-0.5 shrink-0 ${
                        isHighlight ? "text-[#ED7606]" : "text-[#ED7606]"
                      }`}
                      strokeWidth={1.5}
                    />
                    <div>
                      <h3 className="text-lg lg:text-xl font-extrabold tracking-[-0.02em] text-[#111827]">
                        {comp.title}
                      </h3>
                      {isHighlight && (
                        <span className="inline-block mt-0.5 text-[#ED7606] text-xs font-black uppercase tracking-[0.1em]">
                          {comp.subtitle}
                        </span>
                      )}
                      {!isHighlight && (
                        <span className="inline-block mt-0.5 text-[#9CA3AF] text-xs font-bold">
                          {comp.subtitle}
                        </span>
                      )}
                      <p className="mt-2.5 text-[#6B7280] text-sm leading-relaxed">
                        {comp.description}
                      </p>
                    </div>
                  </div>
                </div>

                {isHighlight && (
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-[#ED7606]/20 pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
