import { Reveal } from "@/components/ui/reveal";
import Image from "next/image";
import { patentCertificates, systemCertificates } from "@/content/about";
import { AboutSectionBackdrop } from "./AboutSectionBackdrop";
import { getAboutCopy, type AboutLocale } from "@/lib/about-i18n";

export function CertificationsSection({ locale = "en" }: { locale?: AboutLocale }) {
  const copy = getAboutCopy(locale).certificates;

  return (
    <section
      className="relative overflow-hidden pt-16 pb-8 lg:pt-24 lg:pb-10 bg-white"
      id="quality-certifications"
    >
      <AboutSectionBackdrop
        image="/images/about/bg-glove-box-damper-outline.svg"
        position="left 7% top 26%"
        size="clamp(300px, 38vw, 560px) auto"
      />
      <div className="shell relative z-10">
        <Reveal>
          <div className="grid lg:grid-cols-[0.75fr_1fr] gap-8 lg:gap-14 items-end mb-8 lg:mb-12">
            <div>
              <span className="eyebrow">{copy.eyebrow}</span>
              <h2 className="mt-2.5 lg:mt-3.5 text-[26px] sm:text-[30px] lg:text-[clamp(30px,3vw,42px)] leading-[1.04] tracking-[-0.04em] font-black text-balance text-[#111827]">
                {copy.title}
              </h2>
            </div>
            <p className="text-[#6B7280] text-[15px] lg:text-[17px] leading-relaxed max-w-[620px]">
              {copy.description}
            </p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-4 lg:gap-5 items-stretch">
          <Reveal delay={1} className="h-full">
            <div className="flex h-full flex-col rounded-2xl border border-[#E5E7EB] bg-white p-5 lg:p-6 shadow-[0_4px_20px_rgba(0,0,0,.03)]">
              <div className="flex items-start justify-between gap-5 mb-5">
                <div>
                  <span className="text-[#ED7606] text-xs font-black uppercase tracking-[0.14em]">
                    {copy.systemLabel}
                  </span>
                  <h3 className="mt-2 text-2xl lg:text-3xl leading-tight font-black text-[#111827]">
                    {copy.systemTitle}
                  </h3>
                </div>
                <span className="hidden sm:inline-flex rounded-full border border-[#E5E7EB] px-3 py-1 text-xs font-bold text-[#6B7280]">
                  {copy.systemBadge}
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3.5">
                {systemCertificates.map((cert) => (
                  <CertificateCard key={cert.name} cert={cert} imageClassName="p-3" />
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={2} className="h-full">
            <div className="flex h-full flex-col rounded-2xl border border-[#111827]/10 bg-[#111827] p-5 lg:p-6 text-white shadow-[0_4px_20px_rgba(0,0,0,.06)]">
              <div className="flex items-start justify-between gap-5 mb-5">
                <div>
                  <span className="text-[#FF9A3C] text-xs font-black uppercase tracking-[0.14em]">
                    {copy.patentLabel}
                  </span>
                  <h3 className="mt-2 text-2xl lg:text-3xl leading-tight font-black">
                    {copy.patentTitle}
                  </h3>
                </div>
                <span className="hidden sm:inline-flex rounded-full border border-white/12 px-3 py-1 text-xs font-bold text-white/55">
                  {copy.patentBadge}
                </span>
              </div>
              <div className="grid sm:grid-cols-3 gap-3.5">
                {patentCertificates.map((cert) => (
                  <CertificateCard
                    key={cert.name}
                    cert={cert}
                    dark
                    imageClassName="p-2"
                  />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function CertificateCard({
  cert,
  dark = false,
  imageClassName = "",
}: {
  cert: { name: string; description: string; image: string };
  dark?: boolean;
  imageClassName?: string;
}) {
  return (
    <div
      className={`group overflow-hidden rounded-xl border transition-all duration-300 hover:-translate-y-1 ${
        dark
          ? "border-white/10 bg-white/[0.04] hover:border-[#ED7606]/35"
          : "border-[#E5E7EB] bg-[#F8F9FA] hover:border-[#ED7606]/35"
      }`}
    >
      <div className={`relative aspect-[4/3] ${dark ? "bg-white/8" : "bg-white"}`}>
        <Image
          src={cert.image}
          alt={cert.name}
          fill
          loading="lazy"
          className={`object-contain transition-transform duration-500 group-hover:scale-[1.05] ${imageClassName}`}
          sizes="(max-width: 1024px) 50vw, 22vw"
        />
      </div>
      <div className="p-4">
        <h4 className={`text-sm lg:text-base font-extrabold tracking-[-0.02em] ${dark ? "text-white" : "text-[#111827]"}`}>
          {cert.name}
        </h4>
        <p className={`mt-1 text-xs lg:text-sm leading-relaxed ${dark ? "text-white/45" : "text-[#6B7280]"}`}>
          {cert.description}
        </p>
      </div>
    </div>
  );
}
