import { Reveal } from "@/components/ui/reveal";
import { businessStats } from "@/content/about";
import { AboutSectionBackdrop } from "./AboutSectionBackdrop";
import { getAboutCopy, type AboutLocale } from "@/lib/about-i18n";

export function BusinessHighlights({ locale = "en" }: { locale?: AboutLocale }) {
  const copy = getAboutCopy(locale).business;

  return (
    <section className="relative overflow-hidden pt-14 pb-8 lg:pt-18 lg:pb-10 bg-[#F0F2F5]">
      <AboutSectionBackdrop
        image="/images/about/bg-gear-damper-outline.svg"
        position="left 7% top 22%"
        size="clamp(220px, 26vw, 360px) auto"
      />
      <div className="shell relative z-10">
        <Reveal>
          <div className="text-center">
            <span className="eyebrow">{copy.eyebrow}</span>
            <h2 className="mt-2.5 lg:mt-3.5 text-[26px] sm:text-[30px] lg:text-[clamp(30px,3.6vw,46px)] leading-[1.02] tracking-[-0.04em] font-extrabold text-[#111827]">
              {copy.title}
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mt-8 lg:mt-10">
          {(copy.stats || businessStats).map((stat) => (
            <div
              key={stat.label}
              className="p-6 lg:p-7 rounded-xl border border-[#E5E7EB] bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <b className="block text-3xl lg:text-4xl tracking-[-0.04em] font-black text-[#ED7606]">
                {stat.value}
              </b>
              <span className="block mt-2 text-[#6B7280] text-sm lg:text-[15px] leading-relaxed">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
