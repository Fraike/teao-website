"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  { q: "What types of dampers does TEAO manufacture?", a: "TEAO manufactures five product lines: gear dampers (rotary), axial dampers (linear), glove box dampers, latches, and custom damper modules. Each can be tuned for torque, damping direction, and mounting configuration." },
  { q: "Can TEAO customize dampers for our specific application?", a: "Yes. TEAO's core capability is custom damper development. Share your drawing, torque target, space envelope and application requirements. Our engineering team will review and recommend a standard platform or design a custom solution." },
  { q: "What is the minimum order quantity (MOQ) for TEAO dampers?", a: "MOQ depends on the product type and customization level. Standard platform products typically start from 1,000–5,000 units. Custom tooling projects may require higher volumes. Contact us with your volume target for a specific assessment." },
  { q: "What payment terms does TEAO accept?", a: "TEAO accepts T/T (wire transfer) and L/C (letter of credit). Standard terms are 30% deposit with order, 70% balance before shipment. Long-term partnership terms are available for established accounts." },
  { q: "What is the typical lead time for samples?", a: "Standard platform samples typically ship within 2-3 weeks. Custom designs require an engineering review and tooling lead time, typically 4-8 weeks depending on complexity." },
  { q: "How does TEAO handle international shipping and logistics?", a: "TEAO ships globally via sea freight (FOB Shenzhen/Guangzhou), air freight, and international express (DHL, FedEx, UPS). We support EXW, FOB, and CIF terms. Standard packaging includes individual polybag protection and export-grade cartons." },
  { q: "What quality certifications does TEAO hold?", a: "TEAO operates under an IATF 16949-oriented quality management system and holds ISO 14001 environmental management certification. Every damper undergoes 100% torque testing and 100% visual inspection with full batch traceability." },
  { q: "What is TEAO's annual production capacity?", a: "TEAO has an annual production capacity of 80 million units, supported by in-house mold making, injection molding, automated assembly and testing." },
  { q: "Does TEAO support small-volume or prototype orders?", a: "Yes. TEAO supports prototyping and small-batch production for engineering validation before scaling to mass production." },
  { q: "What industries does TEAO serve?", a: "TEAO serves automotive (OEM and Tier-1), bathroom and sanitary, home appliances, office equipment, and industrial component sectors." },
  { q: "Can TEAO match specific torque values from our existing damper supplier?", a: "Yes. Provide your target torque value (N·m, gf·cm, or kgf·cm) and tolerance band. TEAO's engineering team will adjust the silicone oil viscosity and internal geometry to match or improve upon your current specification. Use our online Torque Converter tool for quick unit conversion." },
  { q: "How do I request a quotation?", a: "Send your drawing and requirements (application, torque target, annual volume) to info@teao-damper.com or use the contact form. Our team typically responds within 24 hours." },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {FAQS.map((faq, i) => (
        <div
          key={i}
          className="rounded-xl border border-[#E5E5E5] bg-white overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left font-bold text-[#171717]"
          >
            <span>{faq.q}</span>
            <ChevronDown
              size={20}
              className={cn(
                "shrink-0 text-[#666666] transition-transform duration-300",
                openIndex === i && "rotate-180 text-[#ED7606]"
              )}
            />
          </button>
          <div
            className={cn(
              "grid transition-all duration-300",
              openIndex === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}
          >
            <div className="overflow-hidden">
              <p className="px-6 pb-4 text-[#666666] text-sm leading-relaxed">{faq.a}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
