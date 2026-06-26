import type { Metadata } from "next";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";
import { FaqSection } from "@/components/faq/faq-section";
import { JsonLdScript, faqPageSchema } from "@/lib/structured-data";
import { FAQS } from "@/content/faq";

export const metadata: Metadata = {
  title: "FAQ | Custom Damper Quotation, Production & Technical Questions",
  description:
    "Frequently asked questions about TEAO damper products — customization, torque adjustment, minimum order quantity (MOQ), sample requests, production lead times, quality certifications and how to start a project.",
  keywords: [
    "damper FAQ",
    "custom damper MOQ",
    "damper sample request",
    "damper production lead time",
    "damper torque customization",
    "damper manufacturer FAQ",
  ],
  openGraph: {
    title: "FAQ | Custom Damper Quotation, Production & Technical Questions",
    description:
      "Get answers about TEAO damper customization, MOQ, samples, lead times, quality certifications and quotation process.",
    images: [{ url: "/images/logo-color.webp", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary",
    title: "FAQ | Damper Quotation & Production Questions | TEAO",
    description:
      "Common questions about damper customization, samples, production lead times and quality certifications.",
    images: ["/images/logo-color.webp"],
  },
  alternates: {
    canonical: "/faq",
  },
};

export default function FaqPage() {
  return (
    <>
      <JsonLdScript data={faqPageSchema(FAQS)} />
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
    </>
  );
}
