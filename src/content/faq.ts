export interface FaqItem {
  q: string;
  a: string;
}

export const FAQS: FaqItem[] = [
  // ---- Product & Capability ----
  {
    q: "What types of dampers does TEAO manufacture?",
    a: "TEAO manufactures five product lines: gear dampers (rotary), axial dampers (linear), glove box dampers, latches, and custom damper modules. Each can be tuned for torque, damping direction, and mounting configuration.",
  },
  {
    q: "Can TEAO customize dampers for our specific application?",
    a: "Yes. TEAO's core capability is custom damper development. Share your drawing, torque target, space envelope and application requirements. Our engineering team will review and recommend a standard platform or design a custom solution.",
  },
  {
    q: "Can you fully realize our design?",
    a: "Our professional development team cooperating with top brands has sufficient experience in each new style. They will work according to your specification and implement it as a prototype.",
  },
  {
    q: "What is the difference between gear dampers and axial dampers?",
    a: "Gear dampers (rotary dampers) provide controlled rotational motion — ideal for lids, cup holders, and storage doors. Axial dampers provide linear damping force along a straight path — used for sliding mechanisms, drawers, and push-push applications. Your application's motion type determines which damper is appropriate.",
  },
  {
    q: "How do I select the right torque value for my application?",
    a: "Torque selection depends on the lid/door weight, dimensions, and desired closing speed. Provide your application parameters (weight, arm length, target closing time) and our engineering team will calculate the required torque. You can also use our free Torque Converter tool for unit reference.",
  },
  {
    q: "What is SOC-free silicone oil and why does it matter for automotive applications?",
    a: "SOC (Siloxane) free silicone oil eliminates volatile siloxane compounds that can outgas and cause electrical contact failure in automotive interiors. TEAO offers SOC-free damper variants for applications near electronic components, meeting stringent OEM cleanliness requirements.",
  },
  {
    q: "Does TEAO offer unidirectional (one-way) damping?",
    a: "Yes. TEAO dampers can be configured for unidirectional damping — minimal resistance in one direction with controlled damping in the reverse direction. This is commonly used in push-push mechanisms, glove box doors, and lids that need to open freely but close softly.",
  },

  // ---- Ordering & Commercial ----
  {
    q: "What is the minimum order quantity (MOQ) for TEAO dampers?",
    a: "MOQ depends on the product type and customization level. Standard platform products typically start from 1,000–5,000 units. Custom tooling projects may require higher volumes. The minimum quantity can be 1,000 pieces, but differs for each product. Contact us with your volume target for a specific assessment.",
  },
  {
    q: "What payment terms does TEAO accept?",
    a: "TEAO accepts T/T (wire transfer) and L/C (letter of credit). Standard terms for the first transaction: 50% advance payment and 50% balance before shipment. For other payments, carry forward 50% balance against copy of bill of lading. Long-term partnership terms are available for established accounts.",
  },
  {
    q: "Do you have any retail transactions?",
    a: "We do not support retail service, but samples can be provided for evaluation. Please consult our sales team for sample arrangements.",
  },
  {
    q: "What are TEAO's accepted currencies?",
    a: "TEAO primarily transacts in USD. EUR and CNY may be accepted depending on the agreement. Please confirm with our sales team during quotation.",
  },
  {
    q: "Does TEAO offer consignment stock or VMI (Vendor Managed Inventory)?",
    a: "Consignment stock and VMI arrangements are available for established long-term partners with stable demand forecasts. Contact our supply chain team to discuss feasibility based on your volume and program duration.",
  },
  {
    q: "Can TEAO provide annual volume rebates or tiered pricing?",
    a: "Yes. Tiered pricing is available based on annual volume commitments. Volume rebates are negotiated as part of long-term supply agreements for programs exceeding 500,000 units annually.",
  },

  // ---- Samples & Production ----
  {
    q: "Can I request samples before mass production?",
    a: "Yes. TEAO provides prototype and pre-production samples for customer fitment testing and validation. Standard platform samples typically ship within 2-3 weeks. Custom designs require engineering review and tooling lead time, typically 4-8 weeks depending on complexity. Sample and freight costs should be covered by the customer.",
  },
  {
    q: "What is the typical delivery date for batch orders?",
    a: "For batch orders of approximately 5,000 pieces, delivery takes about 9 days. Orders requiring new tooling will take additional time for mold fabrication and qualification. Repeat orders typically ship faster as tooling is already in place.",
  },
  {
    q: "Does TEAO support small-volume or prototype orders?",
    a: "Yes. TEAO supports prototyping and small-batch production for engineering validation before scaling to mass production. Samples can be provided according to your needs.",
  },

  // ---- Quality & Engineering ----
  {
    q: "What quality certifications does TEAO hold?",
    a: "TEAO operates under an IATF 16949-oriented quality management system and holds ISO 14001 environmental management certification. Every damper undergoes 100% torque testing and 100% visual inspection with full batch traceability.",
  },
  {
    q: "What documentation does TEAO provide for PPAP submissions?",
    a: "TEAO supports PPAP (Production Part Approval Process) documentation up to Level 3 as required by automotive customers. Standard deliverables include dimensional reports, material certifications, torque test data (100% inspection records), process flow diagrams, and PFMEA. Higher PPAP levels are available upon request.",
  },
  {
    q: "Does TEAO perform DV/PV (Design Validation / Production Validation) testing?",
    a: "Yes. TEAO conducts in-house DV/PV testing including lifecycle durability (>100,000 cycles), environmental chamber testing (-40°C to +110°C), vibration testing, and chemical resistance validation. Test reports are provided with each validation phase.",
  },
  {
    q: "What test reports are included with each production batch?",
    a: "Each production batch includes a Certificate of Conformance (CoC), torque test summary statistics, dimensional inspection report (Cpk data for critical dimensions), and material certification. Full traceability by batch/lot number is maintained for all raw materials and finished goods.",
  },
  {
    q: "How does temperature affect damper performance?",
    a: "Damper torque varies with temperature due to silicone oil viscosity changes. TEAO dampers are validated from -40°C to +110°C. For applications at temperature extremes, we can recommend specific oil formulations and internal designs that minimize torque variation across your operating range.",
  },
  {
    q: "Can TEAO dampers be sterilized for medical applications?",
    a: "TEAO can recommend materials and damper configurations compatible with common sterilization methods. Contact our engineering team with your sterilization requirements (autoclave, EtO, gamma) for a material compatibility assessment.",
  },

  // ---- Shipping & Logistics ----
  {
    q: "How does TEAO handle international shipping and logistics?",
    a: "TEAO ships globally via sea freight (FOB Shenzhen/Guangzhou), air freight, and international express (DHL, FedEx, UPS). We support EXW, FOB, and CIF terms. Standard packaging includes individual polybag protection and export-grade cartons.",
  },
  {
    q: "What is the warranty period on TEAO dampers?",
    a: "TEAO provides a standard warranty covering material and workmanship defects. Warranty terms are defined in the supply agreement and typically align with automotive industry standards. Extended warranty terms can be negotiated for long-term programs.",
  },

  // ---- Industry & Applications ----
  {
    q: "What industries does TEAO serve?",
    a: "TEAO serves automotive (OEM and Tier-1), bathroom and sanitary, home appliances, office equipment, and industrial component sectors.",
  },
  {
    q: "What is TEAO's annual production capacity?",
    a: "TEAO has an annual production capacity of 80 million units, supported by in-house mold making, injection molding, automated assembly and testing.",
  },
  {
    q: "What installation methods are available for TEAO dampers?",
    a: "TEAO dampers support multiple mounting configurations including snap-fit, screw mount, clip-in, press-fit, and custom brackets. The installation method is selected based on your housing design and assembly process. Our engineering team can recommend the optimal mounting solution.",
  },

  // ---- Getting Started ----
  {
    q: "Can TEAO match specific torque values from our existing damper supplier?",
    a: "Yes. Provide your target torque value (N·m, gf·cm, or kgf·cm) and tolerance band. TEAO's engineering team will adjust the silicone oil viscosity and internal geometry to match or improve upon your current specification. Use our online Torque Converter tool for quick unit conversion.",
  },
  {
    q: "How do I request a quotation?",
    a: "Send your drawing and requirements (application, torque target, annual volume) to info@chinateao.com or use the contact form. Our team typically responds within 24 hours.",
  },
  {
    q: "What information should I provide to get the fastest quotation?",
    a: "To expedite your quotation, please provide: target torque (N·m) or damping force (N), damping direction (clockwise/counter-clockwise/both), mounting dimensions, operating temperature range, estimated annual volume, and a drawing or sample reference if available.",
  },
];
