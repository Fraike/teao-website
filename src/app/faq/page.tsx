import type { Metadata } from "next";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";
import { FaqSection } from "@/components/faq/faq-section";

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
    images: [{ url: "/images/logo-color.png", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary",
    title: "FAQ | Damper Quotation & Production Questions | TEAO",
    description:
      "Common questions about damper customization, samples, production lead times and quality certifications.",
    images: ["/images/logo-color.png"],
  },
};

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "What types of dampers does TEAO manufacture?", acceptedAnswer: { "@type": "Answer", text: "TEAO manufactures five product lines: gear dampers (rotary), axial dampers (linear), glove box dampers, latches, and custom damper modules. Each can be tuned for torque, damping direction, and mounting configuration." } },
      { "@type": "Question", name: "Can TEAO customize dampers for our specific application?", acceptedAnswer: { "@type": "Answer", text: "Yes. TEAO's core capability is custom damper development. Share your drawing, torque target, space envelope and application requirements. Our engineering team will review and recommend a standard platform or design a custom solution." } },
      { "@type": "Question", name: "What is the minimum order quantity (MOQ) for TEAO dampers?", acceptedAnswer: { "@type": "Answer", text: "MOQ depends on the product type and customization level. Standard platform products typically start from 1,000–5,000 units. Custom tooling projects may require higher volumes. Contact us with your volume target for a specific assessment." } },
      { "@type": "Question", name: "What payment terms does TEAO accept?", acceptedAnswer: { "@type": "Answer", text: "TEAO accepts T/T (wire transfer) and L/C (letter of credit). Standard terms are 30% deposit with order, 70% balance before shipment. Long-term partnership terms are available for established accounts." } },
      { "@type": "Question", name: "What is the typical lead time for samples?", acceptedAnswer: { "@type": "Answer", text: "Standard platform samples typically ship within 2-3 weeks. Custom designs require an engineering review and tooling lead time, typically 4-8 weeks depending on complexity." } },
      { "@type": "Question", name: "How does TEAO handle international shipping and logistics?", acceptedAnswer: { "@type": "Answer", text: "TEAO ships globally via sea freight (FOB Shenzhen/Guangzhou), air freight, and international express (DHL, FedEx, UPS). We support EXW, FOB, and CIF terms. Standard packaging includes individual polybag protection and export-grade cartons." } },
      { "@type": "Question", name: "What quality certifications does TEAO hold?", acceptedAnswer: { "@type": "Answer", text: "TEAO operates under an IATF 16949-oriented quality management system and holds ISO 14001 environmental management certification. Every damper undergoes 100% torque testing and 100% visual inspection with full batch traceability." } },
      { "@type": "Question", name: "What is TEAO's annual production capacity?", acceptedAnswer: { "@type": "Answer", text: "TEAO has an annual production capacity of 80 million units, supported by in-house mold making, injection molding, automated assembly and testing." } },
      { "@type": "Question", name: "Does TEAO support small-volume or prototype orders?", acceptedAnswer: { "@type": "Answer", text: "Yes. TEAO supports prototyping and small-batch production for engineering validation before scaling to mass production." } },
      { "@type": "Question", name: "What industries does TEAO serve?", acceptedAnswer: { "@type": "Answer", text: "TEAO serves automotive (OEM and Tier-1), bathroom and sanitary, home appliances, office equipment, and industrial component sectors." } },
      { "@type": "Question", name: "Can TEAO match specific torque values from our existing damper supplier?", acceptedAnswer: { "@type": "Answer", text: "Yes. Provide your target torque value (N·m, gf·cm, or kgf·cm) and tolerance band. TEAO's engineering team will adjust the silicone oil viscosity and internal geometry to match or improve upon your current specification." } },
      { "@type": "Question", name: "How do I request a quotation?", acceptedAnswer: { "@type": "Answer", text: "Send your drawing and requirements (application, torque target, annual volume) to info@teao-damper.com or use the contact form. Our team typically responds within 24 hours." } },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
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
