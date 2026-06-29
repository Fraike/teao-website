import { Reveal } from "@/components/ui/reveal";
import Link from "next/link";
import Image from "next/image";
import { getAboutCopy, type AboutLocale } from "@/lib/about-i18n";
import { withLocale } from "@/lib/i18n";

export function AboutCTA({ locale = "en" }: { locale?: AboutLocale }) {
  const copy = getAboutCopy(locale).cta;

  return (
    <section className="relative py-20 lg:py-28 bg-[#0a0b0d] text-white overflow-hidden">
      <div className="absolute inset-0 opacity-18">
        <Image
          src="/images/company/factory-entrance.webp"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          loading="lazy"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0b0d]/97 via-[#0a0b0d]/88 to-[#0a0b0d]/72" />

      <div className="absolute w-[500px] h-[500px] -right-[100px] -bottom-[160px] rounded-full border border-[#ED7606]/15 pointer-events-none" />

      <div className="shell relative z-10">
        <div className="grid lg:grid-cols-[1fr_0.7fr] gap-10 lg:gap-16 items-center">
          <Reveal>
            <div>
              <span className="eyebrow">{copy.eyebrow}</span>
              <h2 className="mt-3.5 max-w-[640px] text-[clamp(30px,4vw,50px)] leading-[0.94] tracking-[-0.05em] font-black">
                {copy.title}
              </h2>
              <p className="mt-4 text-white/55 text-lg max-w-[560px] leading-relaxed">
                {copy.description}
              </p>

              <div className="flex flex-wrap gap-3 mt-7">
                <Link href={withLocale("/contact", locale)} className="btn btn-primary text-base px-7">
                  {copy.primary}
                </Link>
                <Link href={withLocale("/contact", locale)} className="btn btn-ghost text-base px-7">
                  {copy.secondary}
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={2}>
            <div className="hidden lg:flex flex-col gap-3">
                {[
                { src: "/images/products/gear-damper/GearDamperSingle.webp", label: copy.cards[0] },
                { src: "/images/products/axial-damper/AxialDamperSingle.webp", label: copy.cards[1] },
                { src: "/images/products/glove-box-damper/GloveBoxDamperSingle.webp", label: copy.cards[2] },
              ].map((item, index) => (
                <div
                  key={item.label}
                  className="flex items-center gap-4 rounded-xl border border-white/15 bg-white p-4 shadow-[0_18px_45px_rgba(0,0,0,0.18)]"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-[#E5E7EB] bg-[#F8F9FA]">
                    <Image
                      src={item.src}
                      alt=""
                      fill
                      className="object-contain p-2"
                      sizes="56px"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#ED7606]">
                      0{index + 1}
                    </span>
                    <p className="mt-0.5 text-sm font-extrabold text-[#111827]">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
