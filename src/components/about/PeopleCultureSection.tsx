import Image from "next/image";
import { GraduationCap, HeartPulse, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { getAboutCopy, type AboutLocale } from "@/lib/about-i18n";

const cultureIcons = [GraduationCap, HeartPulse, ShieldCheck];

export function PeopleCultureSection({ locale = "en" }: { locale?: AboutLocale }) {
  const copy = getAboutCopy(locale).peopleCulture;
  const cultureImages = [
    {
      src: copy.images.office,
      alt: "TEAO office team group photo",
    },
    {
      src: copy.images.employeeWork,
      alt: "TEAO team building interaction",
    },
    {
      src: copy.images.training,
      alt: "TEAO employee training and collaboration",
    },
    {
      src: copy.images.building,
      alt: "TEAO team building activity",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] py-12 lg:py-16">
      <div className="pointer-events-none absolute left-[-80px] top-[-140px] h-[320px] w-[320px] rounded-full border border-[#ED7606]/10" />
      <div className="shell">
        <div className="grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-11">
          <Reveal>
            <div>
              <span className="eyebrow">{copy.eyebrow}</span>
              <h2 className="mt-2.5 lg:mt-3.5 text-[26px] sm:text-[30px] lg:text-[clamp(30px,3.1vw,42px)] leading-[1.03] tracking-[-0.04em] font-extrabold text-[#111827]">
                {copy.title}
              </h2>
              <p className="mt-4 max-w-[620px] text-[15px] leading-relaxed text-[#6B7280] lg:text-[17px]">
                {copy.description}
              </p>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="relative mx-auto max-w-[680px]">
              <div className="absolute -left-4 top-8 hidden h-[78%] w-[58%] rounded-2xl border border-[#ED7606]/12 bg-white/40 lg:block" />
              <div className="relative grid grid-cols-2 gap-2.5 sm:gap-3">
                {cultureImages.map((image, index) => (
                  <figure
                    key={image.src}
                    className={`relative aspect-[4/3] overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.055)] ${
                      index === 1 || index === 3 ? "translate-y-4" : ""
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 25vw"
                      loading="lazy"
                      draggable={false}
                    />
                  </figure>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:mt-8">
          {copy.highlights.map((item, index) => {
            const Icon = cultureIcons[index];
            return (
              <Reveal key={item.name} delay={(index + 1) as 1 | 2 | 3}>
                <div className="h-full rounded-xl border border-[#E5E7EB] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#ED7606]/25 hover:shadow-md">
                  <Icon className="h-6 w-6 text-[#ED7606]" strokeWidth={1.7} />
                  <h3 className="mt-4 text-[17px] font-extrabold tracking-[-0.02em] text-[#111827]">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">{item.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
