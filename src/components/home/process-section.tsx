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
    <section className="pt-14 pb-8 lg:pt-20 lg:pb-10" id="process">
      <div className="shell">
        <Reveal>
          <SectionHead
            eyebrow="Project Flow"
            title="A clear path from drawing to SOP."
            description="Lean project flow for custom and standard-product programs."
          />
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px rounded-lg overflow-hidden bg-[#E5E5E5] border border-[#E5E5E5]">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i === 0 ? undefined : (Math.min(i, 3) as 1 | 2 | 3)}>
              <div className="min-h-[150px] lg:min-h-[220px] p-4 lg:p-6 bg-white hover:bg-[#F5F5F5] hover:-translate-y-1 transition-all duration-300">
                <span className="text-[#ED7606] text-xs font-black tracking-[0.16em] uppercase">
                  STEP {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 lg:mt-12 mb-1.5 lg:mb-2.5 text-xl lg:text-[22px] tracking-[-0.03em] font-extrabold">{step.title}</h3>
                <p className="text-[#666666] text-xs lg:text-sm">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
