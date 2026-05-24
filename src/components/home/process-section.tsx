import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";

const STEPS = [
  { title: "Brief", description: "Share drawing, application, space envelope and torque target." },
  { title: "Engineer", description: "Review feasibility, structure, material and damping direction." },
  { title: "Validate", description: "Prototype, fit test, torque test and motion-feel adjustment." },
  { title: "Produce", description: "Tooling, process qualification, inspection and serial delivery." },
];

export function ProcessSection() {
  return (
    <section className="pt-14 pb-8 lg:pt-20 lg:pb-10 bg-white" id="process">
      <div className="shell">
        <Reveal>
          <SectionHead
            eyebrow="Project Flow"
            title="A clear path from drawing to SOP."
            description="Lean project flow for custom and standard-product programs."
          />
        </Reveal>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i === 0 ? undefined : (Math.min(i, 3) as 1 | 2 | 3)}>
              <div className="relative min-h-[160px] lg:min-h-[230px] p-5 lg:p-6 rounded-xl border border-[#E5E7EB] bg-white hover:-translate-y-1 hover:border-[#ED7606]/30 hover:shadow-[0_12px_36px_rgba(237,118,6,0.06)] transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#ED7606]/0 group-hover:bg-[#ED7606] transition-colors duration-300" />
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF1E3] text-[#ED7606] text-[10px] font-black tracking-[0.14em] uppercase">
                  <span className="w-1 h-1 rounded-full bg-[#ED7606]" />
                  Step {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 lg:mt-8 mb-1.5 lg:mb-2.5 text-xl lg:text-[22px] tracking-[-0.03em] font-extrabold text-[#111827]">{step.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
