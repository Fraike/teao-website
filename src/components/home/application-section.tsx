import Image from "next/image";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";

const APPLICATIONS = [
  { title: "Automotive", description: "Glove box, armrest, cup holder, charge port and interior storage.", image: "/images/applications/automotive.png" },
  { title: "Bathroom & Appliances", description: "Toilet seats, cabinet doors, home appliance lids and covers.", image: "/images/applications/bathroom.png" },
  { title: "Office Equipment", description: "Printer covers, display mounts and controlled opening mechanisms.", image: "/images/applications/office.png" },
  { title: "Home Appliances", description: "Washer lids, refrigerator flaps, cooker covers and soft-close appliance panels.", image: "/images/applications/home-appliances.png" },
];

export function ApplicationSection() {
  return (
    <section className="section" id="applications">
      <div className="shell">
        <Reveal>
          <SectionHead
            eyebrow="Applications"
            title="Application areas where controlled motion matters."
            description="TEAO dampers support soft opening, quiet closing and controlled release in vehicle interiors, sanitary products, office devices and household appliances."
          />
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-lg overflow-hidden border border-[#E5E5E5]">
          {APPLICATIONS.map((app, i) => (
            <Reveal key={app.title} delay={i === 0 ? undefined : (Math.min(i, 3) as 1 | 2 | 3)}>
              <article
                className="group relative min-h-[210px] lg:min-h-[320px] p-4 lg:p-5 flex flex-col justify-between border-r border-[#E5E5E5] last:border-r-0 bg-[#111315] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <Image
                  src={app.image}
                  alt={app.title}
                  fill
                  className="object-cover transition-transform duration-[0.55s] group-hover:scale-[1.06]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,19,21,.55)_0%,rgba(17,19,21,.18)_38%,rgba(17,19,21,.92)_100%)]" />
                <b className="relative z-10 text-[30px] lg:text-[42px] tracking-[-0.08em] text-white/55 font-black">
                  {String(i + 1).padStart(2, "0")}
                </b>
                <div className="relative z-10 rounded-md bg-[#111315]/72 p-3 backdrop-blur-[2px]">
                  <h3 className="text-xl lg:text-[22px] leading-tight font-extrabold text-white">{app.title}</h3>
                  <p className="mt-1.5 text-white/86 text-sm leading-5">{app.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
