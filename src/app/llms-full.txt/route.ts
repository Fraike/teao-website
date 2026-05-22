import { db } from "@/db";
import { products, categories, news } from "@/db/schema";
import { mapDbProduct } from "@/lib/products";
import { SITE_CONFIG } from "@/lib/constants";
import { env } from "@/lib/env";

export const revalidate = 86400;

export async function GET() {
  const BASE = env.SITE_URL;

  const catRows = await db.select().from(categories).all();
  const productRows = await db.select().from(products).all();
  const newsRows = (await db
    .select()
    .from(news)
    .all())
    .filter((n) => Boolean(n.isPublished));

  const parts: string[] = [];

  // Company section
  parts.push(`# ${SITE_CONFIG.fullName} (${SITE_CONFIG.name})

## Company Overview
- **Legal Name:** ${SITE_CONFIG.fullName}
- **Brand:** ${SITE_CONFIG.name}
- **Founded:** ${SITE_CONFIG.founded}
- **Location:** ${SITE_CONFIG.address}
- **Email:** ${SITE_CONFIG.email}
- **URL:** ${BASE}

## Certifications
- IATF 16949 — automotive quality management system
- ISO 14001 — environmental management system
- 100% torque testing on every damper
- 100% visual inspection with full batch traceability
- 20+ patents

## Capabilities
- In-house mold design and fabrication
- Plastic injection molding (20+ injection machines, 11 automated assembly lines)
- Automated damper assembly with inline torque testing
- Silicone oil viscosity tuning for custom torque profiles
- Engineering review: sample matching, PPAP support, DV/PV validation
- Annual capacity: 80 million units
`);

  // Categories
  parts.push(`## Product Categories
`);
  for (const cat of catRows) {
    parts.push(`### ${cat.name} (${cat.slug})
${cat.description}
`);
  }

  // Individual products with full specs
  parts.push(`## Products
`);
  for (const row of productRows) {
    const p = mapDbProduct(row);
    parts.push(`### ${p.model} – ${p.name}
- **Category:** ${p.category}
- **Summary:** ${p.summary}
- **Description:** ${p.description}
${p.torque ? `- **Torque Range:** ${p.torque.min}–${p.torque.max} ${p.torque.unit}` : ""}
${p.durability?.temperature ? `- **Operating Temperature:** ${p.durability.temperature}` : ""}
${p.durability?.cycles ? `- **Cycle Life:** ${p.durability.cycles.toLocaleString()} ${p.durability.cycles_unit || "cycles"}` : ""}
${p.buffer_direction ? `- **Damping Direction:** ${p.buffer_direction}` : ""}
${p.assembly_method ? `- **Assembly Method:** ${p.assembly_method}` : ""}
${p.characteristics?.length ? `- **Characteristics:** ${p.characteristics.join(", ")}` : ""}
${p.materials?.length ? `- **Materials:** ${p.materials.map((m) => `${m.part}: ${m.material}`).join("; ")}` : ""}
${p.applications?.length ? `- **Applications:** ${p.applications.join(", ")}` : ""}
- **URL:** ${BASE}/products/${p.slug}
`);
  }

  // FAQ section
  parts.push(`## Frequently Asked Questions

### What types of dampers does TEAO manufacture?
TEAO manufactures five product lines: gear dampers (rotary), axial dampers (linear), glove box dampers, latches, and custom damper modules. Each can be tuned for torque, damping direction, and mounting configuration.

### Can TEAO customize dampers for our specific application?
Yes. TEAO's core capability is custom damper development. Share your drawing, torque target, space envelope and application requirements. Our engineering team will review and recommend a standard platform or design a custom solution.

### What is the minimum order quantity (MOQ)?
MOQ depends on the product type and customization level. Standard platform products typically start from 1,000–5,000 units. Custom tooling projects may require higher volumes. The minimum quantity can be 1,000 pieces.

### What payment terms does TEAO accept?
TEAO accepts T/T (wire transfer) and L/C (letter of credit). Standard terms: 50% advance payment, 50% balance before shipment for first transactions. Carry forward 50% balance against copy of bill of lading.

### What is the typical lead time for samples?
Standard platform samples typically ship within 2-3 weeks. Custom designs require engineering review and tooling lead time, typically 4-8 weeks depending on complexity. For batch orders of 5,000 pieces, delivery takes approximately 9 days plus tooling time.

### How does TEAO handle international shipping?
TEAO ships globally via sea freight (FOB Shenzhen/Guangzhou), air freight, and international express (DHL, FedEx, UPS). We support EXW, FOB, and CIF terms.

### What quality certifications does TEAO hold?
TEAO operates under an IATF 16949-oriented quality management system and holds ISO 14001 environmental management certification. Every damper undergoes 100% torque testing and 100% visual inspection.

### Does TEAO support prototype orders?
Yes. TEAO supports prototyping and small-batch production for engineering validation before scaling to mass production. Samples can be provided according to your needs.

### What industries does TEAO serve?
TEAO serves automotive (OEM and Tier-1), bathroom and sanitary, home appliances, office equipment, and industrial component sectors.

### Can TEAO match specific torque values from an existing supplier?
Yes. Provide your target torque value (N·m, gf·cm, or kgf·cm) and tolerance band. Engineering will adjust silicone oil viscosity and internal geometry to match or improve your current specification.

### How do I request a quotation?
Send your drawing and requirements (application, torque target, annual volume) to info@teao-damper.com or use the contact form. Our team typically responds within 24 hours.

### Can you fully realize our design?
Our professional development team has sufficient experience with top brands. We work according to your specification and implement it as a prototype.
`);

  // News
  if (newsRows.length > 0) {
    parts.push(`## News & Updates
`);
    for (const article of newsRows) {
      parts.push(`### ${article.title}
- **Category:** ${article.category}
- **Date:** ${article.publishedAt}
- **Summary:** ${article.summary}
- **URL:** ${BASE}/news/${article.slug}
`);
    }
  }

  // Quality page content
  parts.push(`## Quality & Testing Capabilities

### Engineering Capabilities
- High torque in compact, space-constrained damper designs
- Extended lifespan validated to >100,000 cycles
- Wide temperature range: -40°C to +110°C consistent damping
- Unidirectional damping: precision-controlled single direction
- Tailored damping profiles for specific torque, speed and motion requirements

### Laboratory Equipment
- Torque testing stations (100% inline + laboratory)
- Environmental chamber (-40°C to +120°C)
- Lifecycle/durability test rigs
- Optical inspection equipment
- Dimensional measurement tools (CMM, calipers, gauges)

## Applications

### Automotive
Glove boxes, armrests, cup holders, charge ports, interior storage compartments, assist handles, console lids.

### Bathroom & Sanitary
Toilet seat dampers, shower door buffers, cabinet soft-close mechanisms, bidet motion control.

### Office Equipment
Printer covers, display mounts, scanner lids, workstation drawers, controlled opening panels.

### Industrial Components
Access doors, equipment enclosures, service panels, vending machine mechanisms, special motion modules.
`);

  return new Response(parts.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
