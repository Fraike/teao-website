import type { Metadata } from "next";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";
import { Car, Bath, Monitor, Cog } from "lucide-react";

export const metadata: Metadata = {
  title: "Damper Applications | Automotive, Bathroom, Office & Industrial",
  description:
    "TEAO dampers serve automotive interiors, bathroom & sanitary fittings, office equipment and industrial machinery. Gear dampers, axial dampers, latches and custom modules for every application.",
  keywords: [
    "automotive damper applications",
    "bathroom damper",
    "office equipment damper",
    "industrial damper",
    "custom damper solution",
  ],
  openGraph: {
    title: "Damper Applications | Automotive, Bathroom, Office & Industrial",
    description:
      "Explore TEAO damper applications across automotive, sanitary, office equipment and industrial sectors.",
    images: [{ url: "/images/applications/automotive.webp", width: 800, height: 500 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Damper Applications | TEAO",
    description:
      "TEAO dampers for automotive, bathroom, office equipment and industrial applications.",
    images: ["/images/applications/automotive.webp"],
  },
};

const APPLICATIONS = [
  { icon: Car, title: "Automotive", description: "Glove boxes, armrests, cup holders, charge ports, interior storage compartments and assist handles.", image: "/images/applications/automotive.webp" },
  { icon: Bath, title: "Bathroom & Sanitary", description: "Toilet seat dampers, shower door buffers, cabinet soft-close mechanisms and bidet motion control.", image: "/images/applications/bathroom.webp" },
  { icon: Monitor, title: "Office Equipment", description: "Printer covers, display mounts, scanner lids, workstation drawers and controlled opening panels.", image: "/images/applications/office.webp" },
  { icon: Cog, title: "Industrial Components", description: "Access doors, equipment enclosures, service panels, vending machine mechanisms and special motion modules.", image: "/images/applications/home-appliances.webp" },
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
