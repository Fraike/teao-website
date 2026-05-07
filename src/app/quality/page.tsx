import type { Metadata } from "next";
import Image from "next/image";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";
import { CheckCircle, ClipboardCheck, BarChart3, FileCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Quality Control",
  description: "IATF 16949 oriented quality management system. In-house testing, torque validation and production traceability.",
};

const QUALITY_ITEMS = [
  { icon: ClipboardCheck, title: "IATF 16949 Oriented", description: "Quality management system aligned with automotive industry requirements for consistent, traceable production." },
  { icon: BarChart3, title: "Torque Testing", description: "Every damper design is validated for torque output, damping consistency and endurance across specified temperature ranges." },
  { icon: FileCheck, title: "Production Traceability", description: "Batch-level traceability from raw material to finished product, supporting customer quality audit requirements." },
  { icon: CheckCircle, title: "ISO 14001 Certified", description: "Environmental management system certification, ensuring responsible manufacturing processes." },
];

export default function QualityPage() {
  return (
    <>
      <section className="section pt-32">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow="Quality Control"
              title="Built for repeatable, traceable quality."
              description="IATF-oriented process control, torque checks and production traceability for every batch."
            />
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-5 max-w-4xl">
            {QUALITY_ITEMS.map((item, i) => (
              <Reveal key={item.title} delay={(Math.min(i, 3) + 1) as 1 | 2 | 3}>
                <div className="flex gap-5 p-6 rounded-xl border border-[#E5E5E5] bg-white hover:shadow-md transition-shadow">
                  <item.icon className="w-8 h-8 text-[#ED7606] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-extrabold tracking-[-0.02em]">{item.title}</h3>
                    <p className="mt-2 text-[#666666] text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Factory images */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-16">
            <Reveal>
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image src="/images/company/automation-workshop.jpg" alt="Workshop" fill className="object-cover" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw" />
              </div>
            </Reveal>
            <Reveal delay={1}>
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image src="/images/company/automation-equipment-2.JPG" alt="Equipment" fill className="object-cover" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw" />
              </div>
            </Reveal>
            <Reveal delay={2}>
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image src="/images/company/production-workshop.JPG" alt="Production" fill className="object-cover" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw" />
              </div>
            </Reveal>
            <Reveal delay={3}>
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image src="/images/company/automation-equipment-3.jpg" alt="Automation" fill className="object-cover" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
