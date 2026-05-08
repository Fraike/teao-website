import Image from "next/image";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";

const CAPABILITIES = [
  { title: "Engineering support", description: "Torque, angle, damping direction and structure reviewed before sampling." },
  { title: "Integrated production", description: "Mold, injection, assembly and inspection managed in-house." },
  { title: "Quality control", description: "IATF-oriented process, torque checks and production traceability." },
];

export function CapabilitySection() {
  return (
    <section className="section bg-[#F0F2F5] overflow-hidden" id="capability">
      <div className="shell">
        <div className="grid lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)] gap-10 lg:gap-14 items-center">
          <div>
            <span className="eyebrow">Manufacturing</span>
            <h2 className="mt-2.5 lg:mt-3.5 text-[28px] sm:text-[32px] lg:text-[clamp(32px,3.8vw,52px)] leading-[1.02] lg:leading-[0.98] tracking-[-0.04em] font-extrabold text-[#111827] text-balance">
              Built for international B2B programs.
            </h2>
            <p className="text-[#6B7280] text-[15px] lg:text-[17px] max-w-[520px] mt-3 lg:mt-4">
              A focused manufacturing system for repeatable quality, clear communication and scalable delivery.
            </p>

            <div className="grid gap-3 lg:gap-3.5 mt-6 lg:mt-8">
              {CAPABILITIES.map((cap, i) => (
                <Reveal key={cap.title} delay={i === 0 ? undefined : (i as 1 | 2)}>
                  <div className="grid grid-cols-[42px_1fr] lg:grid-cols-[58px_1fr] gap-3 lg:gap-4 items-start p-3.5 lg:p-4 rounded-lg border border-[#E5E7EB] bg-white hover:shadow-md hover:translate-x-2 transition-all duration-300">
                    <span className="text-[#ED7606] text-xs font-black tracking-[0.16em]">
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
          <div className="hidden lg:block">
            <Reveal>
              <div className="grid grid-cols-2 gap-4">
                <figure className="group relative col-span-2 aspect-[21/9] rounded-xl overflow-hidden border border-[#E5E7EB] shadow-[0_8px_24px_rgba(0,0,0,.04)]">
                  <Image src="/images/company/automation-workshop.jpg" alt="TEAO automated workshop" fill className="object-cover transition-transform duration-[0.7s] group-hover:scale-[1.03]" sizes="(max-width: 1024px) 100vw, 50vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <figcaption className="absolute left-5 bottom-5 text-white/90 text-sm font-bold tracking-wide">Automated Assembly Line</figcaption>
                </figure>
                <figure className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-[#E5E7EB] shadow-[0_8px_24px_rgba(0,0,0,.04)]">
                  <Image src="/images/company/production-workshop.JPG" alt="TEAO production workshop" fill className="object-cover transition-transform duration-[0.7s] group-hover:scale-[1.03]" sizes="(max-width: 1024px) 100vw, 50vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <figcaption className="absolute left-4 bottom-4 text-white/85 text-xs font-bold tracking-wide">Production Workshop</figcaption>
                </figure>
                <figure className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-[#E5E7EB] shadow-[0_8px_24px_rgba(0,0,0,.04)]">
                  <Image src="/images/company/automation-equipment-2.JPG" alt="TEAO automation equipment" fill className="object-cover transition-transform duration-[0.7s] group-hover:scale-[1.03]" sizes="(max-width: 1024px) 100vw, 50vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <figcaption className="absolute left-4 bottom-4 text-white/85 text-xs font-bold tracking-wide">Injection & Tooling</figcaption>
                </figure>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
