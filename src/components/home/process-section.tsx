import { ClipboardCheck, Cog, Gauge, PackageCheck } from "lucide-react";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";
import type { SiteLocale } from "@/lib/i18n-ui";
import { getHomeCopy } from "@/lib/home-i18n";

const STEP_ICONS = [ClipboardCheck, Cog, Gauge, PackageCheck];

export function ProcessSection({ locale = "en" }: { locale?: SiteLocale }) {
  const copy = getHomeCopy(locale).process;

  return (
    <section className="pt-14 pb-8 lg:pt-20 lg:pb-10 bg-white" id="process">
      <div className="shell">
        <Reveal>
          <SectionHead
            eyebrow={copy.eyebrow}
            title={copy.title}
            description={copy.description}
          />
        </Reveal>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {copy.steps.map((step, i) => (
            <Reveal key={step.title} delay={i === 0 ? undefined : (Math.min(i, 3) as 1 | 2 | 3)}>
              <div className="group relative min-h-[160px] lg:min-h-[214px] p-5 lg:p-6 rounded-xl border border-[#E5E7EB] bg-white hover:-translate-y-1 hover:border-[#ED7606]/30 hover:shadow-[0_12px_36px_rgba(237,118,6,0.06)] transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#ED7606]/0 group-hover:bg-[#ED7606] transition-colors duration-300" />
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF1E3] text-[#ED7606] text-[10px] font-black tracking-[0.14em] uppercase">
                    <span className="w-1 h-1 rounded-full bg-[#ED7606]" />
                    {copy.stepLabel} {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#111827] text-white shadow-[0_12px_28px_rgba(17,24,39,0.10)] transition-colors group-hover:bg-[#ED7606]">
                    {(() => {
                      const Icon = STEP_ICONS[i] || ClipboardCheck;
                      return <Icon size={20} strokeWidth={2.2} />;
                    })()}
                  </span>
                </div>
                <h3 className="mt-5 lg:mt-6 mb-1.5 lg:mb-2.5 text-xl lg:text-[22px] tracking-[-0.03em] font-extrabold text-[#111827]">{step.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
