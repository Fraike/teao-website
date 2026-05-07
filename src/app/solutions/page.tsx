import type { Metadata } from "next";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Wrench, Settings, PenTool, Package } from "lucide-react";

export const metadata: Metadata = {
  title: "Solutions",
  description: "Custom damper solutions: torque customization, motion feel adjustment, structure design, material selection, mounting integration and mass production.",
};

const SOLUTIONS = [
  { icon: Wrench, title: "Torque Customization", description: "Standard platforms tuned to your exact torque requirements. Single-direction, bi-directional and variable torque profiles available." },
  { icon: Settings, title: "Motion Feel Adjustment", description: "Fine-tune the damping feel — from soft and smooth to firm and controlled. We match the motion profile to your product's user experience requirements." },
  { icon: PenTool, title: "Structure Design Support", description: "Joint engineering review of your assembly. Our team recommends mounting configurations, space envelope optimizations and interface designs." },
  { icon: Package, title: "Sample to Mass Production", description: "From prototype to serial delivery. In-house tooling, injection molding, assembly and testing ensure quality at every stage." },
];

export default function SolutionsPage() {
  return (
    <>
      <section className="section pt-32">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow="Solutions"
              title="Built to your exact specifications."
              description="Custom damper development from concept to mass production. Engineering support at every stage."
            />
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-5 mb-12">
            {SOLUTIONS.map((sol, i) => (
              <Reveal key={sol.title} delay={(Math.min(i, 3) + 1) as 1 | 2 | 3}>
                <div className="p-8 rounded-xl border border-[#E5E5E5] bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <sol.icon className="w-10 h-10 text-[#ED7606] mb-5" />
                  <h3 className="text-xl font-extrabold tracking-[-0.02em] mb-3">{sol.title}</h3>
                  <p className="text-[#666666] leading-relaxed">{sol.description}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="text-center">
            <Button href="/contact" variant="primary">
              Discuss Your Requirements →
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
