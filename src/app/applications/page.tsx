import type { Metadata } from "next";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";
import { Car, Bath, Monitor, Cog } from "lucide-react";

export const metadata: Metadata = {
  title: "Applications",
  description: "Automotive, bathroom, office equipment and industrial damper applications.",
};

const APPLICATIONS = [
  { icon: Car, title: "Automotive", description: "Glove boxes, armrests, cup holders, charge ports, interior storage compartments and assist handles.", image: "/images/applications/automotive.png" },
  { icon: Bath, title: "Bathroom & Sanitary", description: "Toilet seat dampers, shower door buffers, cabinet soft-close mechanisms and bidet motion control.", image: "/images/applications/bathroom.png" },
  { icon: Monitor, title: "Office Equipment", description: "Printer covers, display mounts, scanner lids, workstation drawers and controlled opening panels.", image: "/images/applications/office.png" },
  { icon: Cog, title: "Industrial Components", description: "Access doors, equipment enclosures, service panels, vending machine mechanisms and special motion modules.", image: "/images/applications/home-appliances.png" },
];

export default function ApplicationsPage() {
  return (
    <>
      <section className="section pt-32">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow="Applications"
              title="Engineered for every application."
              description="TEAO dampers serve automotive, home appliance, sanitary, office equipment and industrial sectors."
            />
          </Reveal>

          <div className="space-y-8">
            {APPLICATIONS.map((app, i) => (
              <Reveal key={app.title} delay={(Math.min(i, 3) + 1) as 1 | 2 | 3}>
                <div className={`grid lg:grid-cols-2 gap-8 items-center rounded-2xl overflow-hidden border border-[#E5E5E5] ${
                  i % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}>
                  <div className="aspect-[16/10] bg-center bg-cover" style={{ backgroundImage: `url('${app.image}')` }} />
                  <div className="p-8 lg:p-12">
                    <app.icon className="w-10 h-10 text-[#ED7606] mb-4" />
                    <h2 className="text-2xl font-extrabold tracking-[-0.03em] mb-3">{app.title}</h2>
                    <p className="text-[#666666] leading-relaxed">{app.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
