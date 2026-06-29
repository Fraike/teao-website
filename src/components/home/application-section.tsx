import Image from "next/image";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";
import type { SiteLocale } from "@/lib/i18n-ui";
import { getHomeCopy } from "@/lib/home-i18n";

const APPLICATIONS = [
  { title: "Automotive", description: "Glove box, armrest, cup holder, charge port and interior storage.", image: "/images/applications/automotive.webp" },
  { title: "Bathroom & Appliances", description: "Toilet seats, cabinet doors, home appliance lids and covers.", image: "/images/applications/bathroom.webp" },
  { title: "Office Equipment", description: "Printer covers, display mounts and controlled opening mechanisms.", image: "/images/applications/office.webp" },
  { title: "Home Appliances", description: "Washer lids, refrigerator flaps, cooker covers and soft-close appliance panels.", image: "/images/applications/home-appliances.webp" },
];

export function ApplicationSection({ locale = "en" }: { locale?: SiteLocale }) {
  const copy = getHomeCopy(locale).applications;

  return (
    <section className="section bg-[#FAF9F6]" id="applications">
      <div className="shell">
        <Reveal>
          <SectionHead
            eyebrow={copy.eyebrow}
            title={copy.title}
            description={copy.description}
          />
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-xl overflow-hidden border border-[#E5E5E5]">
          {APPLICATIONS.map((app, i) => {
            const item = copy.items[i] || app;
            return (
            <Reveal key={app.title} delay={i === 0 ? undefined : (Math.min(i, 3) as 1 | 2 | 3)}>
              <article
                className="group relative min-h-[210px] lg:min-h-[320px] p-4 lg:p-5 flex flex-col justify-between border-r border-[#E5E5E5] last:border-r-0 bg-[#111315] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <Image
                  src={app.image}
                  alt={item.title}
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-[0.55s] group-hover:scale-[1.08]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,19,21,.60)_0%,rgba(17,19,21,.16)_36%,rgba(17,19,21,.94)_100%)]" />
                <b className="relative z-10 text-[32px] lg:text-[46px] tracking-[-0.08em] text-[#ED7606]/55 font-black">
                  {String(i + 1).padStart(2, "0")}
                </b>
                <div className="relative z-10 rounded-lg bg-[#111315]/70 p-3 backdrop-blur-sm border border-white/5">
                  <h3 className="text-xl lg:text-[22px] leading-tight font-extrabold text-white">{item.title}</h3>
                  <p className="mt-1.5 text-white/82 text-sm leading-5">{item.description}</p>
                </div>
              </article>
            </Reveal>
          )})}
        </div>
      </div>
    </section>
  );
}
