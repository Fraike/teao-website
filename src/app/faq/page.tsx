import type { Metadata } from "next";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";
import { FaqSection } from "@/components/faq/faq-section";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about TEAO dampers, customization, lead times, quality certifications and quotation process.",
};

export default function FaqPage() {
  return (
    <section className="section pt-32">
      <div className="shell">
        <Reveal>
          <SectionHead
            eyebrow="FAQ"
            title="Frequently Asked Questions."
            description="Quick answers about TEAO products, capabilities, lead times and how to start a project."
          />
        </Reveal>
        <div className="max-w-3xl mx-auto">
          <Reveal delay={1}>
            <FaqSection />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
