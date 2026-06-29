import Link from "next/link";
import { VideoPlayer } from "./VideoPlayer";
import { trustBadges, videoPoster, companyVideoUrl } from "@/content/about";
import { getAboutCopy, type AboutLocale } from "@/lib/about-i18n";
import { withLocale } from "@/lib/i18n";

export function AboutHero({ locale = "en" }: { locale?: AboutLocale }) {
  const copy = getAboutCopy(locale).hero;

  return (
    <section className="relative min-h-[620px] lg:min-h-[680px] xl:min-h-[720px] flex items-center bg-[#FAFAFA] text-[#111827] overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.035) 1px, transparent 1px)",
          backgroundSize: "84px 84px",
          maskImage: "linear-gradient(180deg, #000, transparent 82%)",
        }}
      />
      <div className="absolute right-[-14vw] top-[10%] h-[42vw] w-[42vw] max-w-[620px] max-h-[620px] rounded-full border border-[#ED7606]/15" />
      <div className="absolute left-0 bottom-0 h-28 w-full bg-gradient-to-t from-white to-transparent" />

      <div className="relative z-10 w-full pt-24 lg:pt-28 pb-12 lg:pb-14">
        <div className="shell">
          <div className="grid lg:grid-cols-[0.85fr_1.05fr] gap-10 lg:gap-14 items-end">
            <div>
              <div className="animate-fade-in-up">
                <span className="eyebrow">{copy.eyebrow}</span>
              </div>

              <h1 className="mt-5 lg:mt-6 max-w-[760px] text-[30px] sm:text-[38px] lg:text-[clamp(38px,4vw,58px)] leading-[1.02] tracking-[-0.045em] font-black text-balance animate-fade-in-up-2">
                {copy.title}
              </h1>

              <p className="mt-5 text-[#4B5563] text-[16px] lg:text-[18px] leading-relaxed max-w-[620px] animate-fade-in-up-3">
                {copy.description}
              </p>

              <div className="flex flex-wrap gap-2.5 lg:gap-3 mt-7 lg:mt-8 animate-fade-in-up-4">
                <Link href={withLocale("/contact", locale)} className="btn btn-primary text-sm lg:text-base px-6">
                  {copy.cta}
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px mt-8 lg:mt-10 overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#E5E7EB] animate-fade-in-up-5">
                {(copy.trustBadges || trustBadges).map((b) => (
                  <span
                    key={b}
                    className="px-3 py-3 bg-white text-[#4B5563] text-[10px] lg:text-[11px] font-extrabold text-center"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative animate-fade-in-up-3">
              <div className="relative aspect-[16/10] lg:aspect-[5/4] overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#111827] shadow-[0_16px_48px_rgba(0,0,0,.06)]">
                <VideoPlayer poster={videoPoster} src={companyVideoUrl} badge={copy.videoBadge} title={copy.videoTitle} />
              </div>

              <div className="absolute -right-5 -bottom-5 hidden lg:block rounded-xl border border-[#E5E7EB] bg-white px-5 py-4 shadow-[0_12px_32px_rgba(0,0,0,.06)]">
                <b className="block text-3xl leading-none font-black text-[#ED7606]">20+</b>
                <span className="mt-1 block text-xs font-bold text-[#6B7280]">{copy.years}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
