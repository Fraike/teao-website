import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import { hashPassword } from "../lib/auth";

const sqlite = new Database("data/teao.db");
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");
const db = drizzle(sqlite, { schema });

async function seed() {
  console.log("Seeding database...");

  // --- Categories ---
  const categoryData = [
    {
      slug: "gear-damper",
      name: "Gear Dampers",
      description: "Compact rotary control for cup holders, lids and storage doors.",
      image: "/images/products/gear-damper/GearDamperCategory.webp",
      sortOrder: 1,
    },
    {
      slug: "axial-damper",
      name: "Axial Dampers",
      description: "Linear damping for controlled opening, closing and sliding motion.",
      image: "/images/products/axial-damper/AxialDamperCategory.webp",
      sortOrder: 2,
    },
    {
      slug: "glove-box-damper",
      name: "Glove Box Dampers",
      description: "Automotive soft motion for glove boxes and interior panels.",
      image: "/images/products/glove-box-damper/GloveBoxDamperCategory.webp",
      sortOrder: 3,
    },
    {
      slug: "latch",
      name: "Latches",
      description: "Reliable lock, release and engagement mechanisms for interiors.",
      image: "/images/products/latch/LatchCategory.webp",
      sortOrder: 4,
    },
    {
      slug: "other",
      name: "Other Products",
      description: "Organizers, custom modules and application-specific mechanisms.",
      image: "/images/products/other/OthersCategory.webp",
      sortOrder: 5,
    },
  ];

  db.delete(schema.categories).run();
  for (const c of categoryData) {
    db.insert(schema.categories).values(c).run();
  }
  console.log(`  Categories: ${categoryData.length} seeded`);

  // --- Products ---
  const productData = [
    {
      slug: "trd-25-rotary-gear-damper",
      model: "TRD-25",
      name: "TRD-25 Rotary Gear Damper",
      category: "gear-damper",
      summary: "High-torque rotary damper for automotive interior applications.",
      description:
        "The TRD-25 series provides smooth, controlled rotary motion for automotive interior applications including cup holders, storage compartments, and assist handles. Available in multiple torque ranges with customizable mounting configurations.",
      image: "/images/products/gear-damper/GearDamperSingle.webp",
      images: "[]",
      specifications: JSON.stringify({
        "Torque Range": "0.5 – 4.0 N·m",
        "Operating Temperature": "-30°C to +80°C",
        "Material": "POM / PA66 + GF",
        "Damping Direction": "Clockwise / Counter-clockwise / Both",
        "Life Cycle": ">50,000 cycles",
      }),
      features: JSON.stringify([
        "Compact design fits tight interior spaces",
        "Stable torque output across temperature range",
        "Custom torque values available",
        "Low noise operation",
      ]),
      applications: JSON.stringify(["Automotive interiors", "Storage compartments"]),
      isActive: 1,
      sortOrder: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      slug: "rd-t015",
      model: "RD-T015",
      name: "Gear Damper RD-T015",
      category: "gear-damper",
      summary: "SOC-free rotary gear damper with bidirectional damping for automotive interior mechanisms.",
      description:
        "The RD-T015 is a compact rotary gear damper engineered for controlled deceleration in automotive interior applications including cup holders, storage compartments, door handles, and assist grips. SOC-free silicone oil provides consistent torque output across a wide temperature range, with screw-mount installation and no angular limit.",
      image: "/images/product-list/Gear-damper/RD-T015/RD-T015-product-01.webp",
      images: JSON.stringify([
        { url: "/images/product-list/Gear-damper/RD-T015/RD-T015-product-01.webp", alt: "RD-T015 gear damper front view" },
        { url: "/images/product-list/Gear-damper/RD-T015/RD-T015-product-02.webp", alt: "RD-T015 gear damper angled view" },
        { url: "/images/product-list/Gear-damper/RD-T015/RD-T015-product-03.webp", alt: "RD-T015 gear damper side view" },
        { url: "/images/product-list/Gear-damper/RD-T015/RD-T015-product-04.webp", alt: "RD-T015 gear damper detail view" },
      ]),
      features: "[]",
      characteristics: JSON.stringify(["SOC Free", "Screw mounting", "Two-way", "No angle limit"]),
      dimensionDrawing: "/images/product-list/Gear-damper/RD-T015/dimension.webp",
      performanceCharts: JSON.stringify({
        rotation_curve: "/images/product-list/Gear-damper/RD-T015/rotation-curve.webp",
        temperature_curve: "/images/product-list/Gear-damper/RD-T015/temperature-curve.webp",
      }),
      torque: JSON.stringify({ min: 50, max: 500, unit: "gf.cm" }),
      techParams: JSON.stringify({
        teeth_count: 11,
        module: 0.8,
        outer_diameter: "Φ14.7",
        pressure_angle: 20,
      }),
      specifications: JSON.stringify({
        "Model": "RD-T015",
        "Torque Range": "50 – 500 gf·cm",
        "Operating Temperature": "-30°C to +80°C",
        "Damping Direction": "Bidirectional (Two-way)",
        "Mounting Method": "Screw fixing",
        "Angle Limit": "None (360° free rotation)",
        "Damping Oil": "SOC-free silicone oil",
        "Life Cycle": ">30,000 cycles",
      }),
      materials: JSON.stringify([
        { part: "Housing", material: "POM (Polyoxymethylene)" },
        { part: "Cap / Cover", material: "POM" },
        { part: "O-ring Seal", material: "Silicone rubber" },
        { part: "Gear Rotor", material: "PA66 + GF (30% glass-filled)" },
        { part: "Damping Fluid", material: "SOC-free silicone oil" },
        { part: "Screw", material: "Stainless steel (SUS304)" },
      ]),
      bufferDirection: "bidirectional",
      assemblyMethod: "Screw Fixing",
      durability: JSON.stringify({ temperature: "-30°C to +80°C", cycles: 30000, cycles_unit: "cycles" }),
      applications: JSON.stringify([
        "Automotive interiors", "Cup holders", "Glove boxes", "Center console lids",
        "Storage compartments", "Door handles", "Outlet covers", "Ashtrays",
        "Bathroom fittings", "Toilet lids",
      ]),
      isActive: 1,
      sortOrder: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      slug: "rd-t021", model: "RD-T021", name: "Gear Damper RD-T021", category: "gear-damper",
      summary: "Applicable to automotive interior and exterior fittings as well as office equipment.",
      description: "The RD-T021 gear damper provides smooth rotary damping for automotive interior and exterior applications. Compact design with customizable torque output within standard ranges.",
      image: "/images/products/gear-damper/GearDamperSingle.webp", images: "[]", features: JSON.stringify(["Compact rotary damper", "Screw-fit mounting", "Stable torque output", "Low noise operation"]),
      techParams: JSON.stringify({ teeth_count: 11, module: 0.8, pressure_angle: 20 }),
      specifications: JSON.stringify({ "Torque Range": "20 – 300 gf·cm", "Operating Temperature": "-30°C to +80°C", "Material": "POM / PA66 + GF", "Damping Direction": "One-way" }),
      torque: JSON.stringify({ min: 20, max: 300, unit: "gf.cm" }), assemblyMethod: "Screw Fixing", bufferDirection: "bidirectional",
      durability: JSON.stringify({ cycles: 30000, cycles_unit: "cycles" }),
      applications: JSON.stringify(["Automotive interior", "Exterior fittings", "Office equipment"]),
      isActive: 1, sortOrder: 3, createdAt: new Date(), updatedAt: new Date(),
    },
    {
      slug: "rd-t069", model: "RD-T069", name: "Bidirectional Gear Damper RD-T069 / RD-V069", category: "gear-damper",
      summary: "Bidirectional type, suitable for automotive interiors, household appliances, and industrial machinery.",
      description: "The RD-T069 / RD-V069 bidirectional gear damper provides controlled rotary damping in both directions. Ideal for applications requiring smooth motion in both opening and closing directions.",
      image: "/images/products/gear-damper/GearDamperSingle.webp", images: "[]",
      features: JSON.stringify(["Bidirectional damping", "Screw-fit mounting", "High torque output", "Industrial-grade durability"]),
      techParams: JSON.stringify({ teeth_count: 12, module: 0.8, outer_diameter: "Φ14.7", pressure_angle: 20 }),
      specifications: JSON.stringify({ "Torque Range": "200 – 3,500 gf·cm", "Operating Temperature": "-30°C to +80°C", "Damping Direction": "Bidirectional" }),
      torque: JSON.stringify({ min: 200, max: 3500, unit: "gf.cm" }), assemblyMethod: "Screw Fixing", bufferDirection: "bidirectional",
      durability: JSON.stringify({ cycles: 30000, cycles_unit: "cycles" }),
      applications: JSON.stringify(["Automotive interiors", "Household appliances", "Industrial machinery"]),
      isActive: 1, sortOrder: 4, createdAt: new Date(), updatedAt: new Date(),
    },
    {
      slug: "rd-t040", model: "RD-T040", name: "Gear Damper RD-T040", category: "gear-damper",
      summary: "Applicable to automotive dampers, household appliance dampers, plastic gear dampers, and buffer components.",
      description: "The RD-T040 gear damper delivers consistent rotary damping for automotive, appliance, and industrial buffer applications. Compact size with reliable screw-fit mounting.",
      image: "/images/products/gear-damper/GearDamperSingle.webp", images: "[]",
      features: JSON.stringify(["Compact Φ10.4 size", "Screw-fit mounting", "Consistent torque profile", "Multi-industry compatible"]),
      techParams: JSON.stringify({ teeth_count: 10, module: 0.8, outer_diameter: "Φ10.4", pressure_angle: 20 }),
      specifications: JSON.stringify({ "Torque Range": "20 – 300 gf·cm", "Operating Temperature": "-30°C to +80°C" }),
      torque: JSON.stringify({ min: 20, max: 300, unit: "gf.cm" }), assemblyMethod: "Screw Fixing", bufferDirection: "bidirectional",
      durability: JSON.stringify({ cycles: 20000, cycles_unit: "cycles" }),
      applications: JSON.stringify(["Automotive dampers", "Household appliances", "Plastic gear buffers"]),
      isActive: 1, sortOrder: 5, createdAt: new Date(), updatedAt: new Date(),
    },
    {
      slug: "rd-t036", model: "RD-T036", name: "Gear Damper RD-T036", category: "gear-damper",
      summary: "Applicable to automotive interiors, household appliances, and industrial machinery.",
      description: "The RD-T036 gear damper provides high-torque rotary damping with a Φ13 size and 1.2 module. Suitable for automotive interiors, appliances, and industrial applications requiring higher damping force.",
      image: "/images/products/gear-damper/GearDamperSingle.webp", images: "[]",
      features: JSON.stringify(["High torque capacity (up to 1,000 gf·cm)", "Φ13 size with 1.2 module", "Screw-fit mounting", "Versatile application range"]),
      techParams: JSON.stringify({ teeth_count: 13, module: 1.2, outer_diameter: "Φ13", pressure_angle: 20 }),
      specifications: JSON.stringify({ "Torque Range": "20 – 1,000 gf·cm", "Operating Temperature": "-30°C to +80°C" }),
      torque: JSON.stringify({ min: 20, max: 1000, unit: "gf.cm" }), assemblyMethod: "Screw Fixing", bufferDirection: "bidirectional",
      durability: JSON.stringify({ cycles: 20000, cycles_unit: "cycles" }),
      applications: JSON.stringify(["Automotive interiors", "Household appliances", "Industrial machinery"]),
      isActive: 1, sortOrder: 6, createdAt: new Date(), updatedAt: new Date(),
    },
    {
      slug: "rd-t029", model: "RD-T029", name: "Gear Damper RD-T029", category: "gear-damper",
      summary: "Applicable to automotive interiors, household appliances, and industrial machinery.",
      description: "The RD-T029 gear damper is a compact Φ10.4 rotary damper with 0.8 module. Designed for space-constrained applications in automotive interiors, household appliances, and industrial machinery.",
      image: "/images/products/gear-damper/GearDamperSingle.webp", images: "[]",
      features: JSON.stringify(["Compact Φ10.4 size", "Screw-fit mounting", "Reliable across temperature range", "Low maintenance design"]),
      techParams: JSON.stringify({ teeth_count: 10, module: 0.8, outer_diameter: "Φ10.4", pressure_angle: 20 }),
      specifications: JSON.stringify({ "Torque Range": "20 – 300 gf·cm", "Operating Temperature": "-30°C to +80°C" }),
      torque: JSON.stringify({ min: 20, max: 300, unit: "gf.cm" }), assemblyMethod: "Screw Fixing", bufferDirection: "bidirectional",
      durability: JSON.stringify({ cycles: 20000, cycles_unit: "cycles" }),
      applications: JSON.stringify(["Automotive interiors", "Household appliances", "Industrial machinery"]),
      isActive: 1, sortOrder: 7, createdAt: new Date(), updatedAt: new Date(),
    },
    {
      slug: "rd-t025", model: "RD-T025", name: "Gear Damper RD-T025", category: "gear-damper",
      summary: "Widely applicable to automotive interiors, household appliances, industrial machinery, coffee machines, and printers.",
      description: "The RD-T025 gear damper is a versatile general-purpose rotary damper with Φ10.4 size and screw-fit mounting. Suitable for automotive, appliance, office equipment, coffee machine, and printer applications.",
      image: "/images/products/gear-damper/GearDamperSingle.webp", images: "[]",
      features: JSON.stringify(["General-purpose rotary damper", "Screw-fit mounting", "Wide application compatibility", "Stable long-term performance"]),
      techParams: JSON.stringify({ teeth_count: 10, module: 0.8, outer_diameter: "Φ10.4", pressure_angle: 20 }),
      specifications: JSON.stringify({ "Torque Range": "20 – 300 gf·cm", "Operating Temperature": "-30°C to +80°C" }),
      torque: JSON.stringify({ min: 20, max: 300, unit: "gf.cm" }), assemblyMethod: "Screw Fixing", bufferDirection: "bidirectional",
      durability: JSON.stringify({ cycles: 20000, cycles_unit: "cycles" }),
      applications: JSON.stringify(["Automotive interiors", "Household appliances", "Coffee machines", "Printers"]),
      isActive: 1, sortOrder: 8, createdAt: new Date(), updatedAt: new Date(),
    },
    {
      slug: "tad-18-axial-damper", model: "TAD-18", name: "TAD-18 Axial Damper", category: "axial-damper",
      summary: "Linear motion damper for push-pull and sliding applications.",
      description: "The TAD-18 axial damper provides controlled linear motion for applications requiring push-pull damping. Ideal for glove box doors, center console lids, and sliding mechanisms.",
      image: "/images/products/axial-damper/AxialDamperSingle.webp", images: "[]",
      features: JSON.stringify(["Smooth linear damping action", "Adjustable damping force", "Compact axial design", "Push and pull configurations available"]),
      techParams: JSON.stringify({ outer_diameter: "12MM", total_height: "15.5MM" }),
      specifications: JSON.stringify({ "Damping Force": "50 – 300 N", "Stroke Length": "20 – 80 mm", "Operating Temperature": "-30°C to +80°C", "Material": "Steel / POM", "Life Cycle": ">50,000 cycles" }),
      assemblyMethod: "Through-hole + Slot Fixing", bufferDirection: "bidirectional",
      durability: JSON.stringify({ cycles: 30000, cycles_unit: "cycles" }),
      applications: JSON.stringify(["Glove box doors", "Center console lids", "Sliding mechanisms"]),
      isActive: 1, sortOrder: 9, createdAt: new Date(), updatedAt: new Date(),
    },
    {
      slug: "tgd-30-glove-box-damper", model: "TGD-30", name: "TGD-30 Glove Box Damper", category: "glove-box-damper",
      summary: "Soft-open mechanism for automotive glove boxes and storage compartments.",
      description: "The TGD-30 is specifically designed for automotive glove box applications, providing a premium soft-open feel. The integrated design ensures reliable performance across the vehicle's lifetime.",
      image: "/images/products/glove-box-damper/GloveBoxDamperSingle.webp", images: "[]",
      features: JSON.stringify(["Premium soft-open feel", "Temperature-stable performance", "Quick installation design", "Validated to automotive durability standards"]),
      techParams: JSON.stringify({ outer_diameter: "26.7MM", total_length: "105MM" }),
      specifications: JSON.stringify({ "Damping Force": "80 – 250 N", "Operating Temperature": "-40°C to +85°C", "Material": "PA66 + GF / Steel", "Mounting Type": "Clip-in / Screw" }),
      durability: JSON.stringify({ cycles: 20000, cycles_unit: "cycles" }),
      applications: JSON.stringify(["Automotive glove boxes", "Storage compartments"]),
      isActive: 1, sortOrder: 10, createdAt: new Date(), updatedAt: new Date(),
    },
    {
      slug: "tl-12-push-latch", model: "TL-12", name: "TL-12 Push-Push Latch", category: "latch",
      summary: "Push-push latch mechanism for interior storage and access panels.",
      description: "The TL-12 push-push latch provides reliable lock/release functionality for automotive interior panels, storage compartments, and access doors. Designed for high-cycle durability.",
      image: "/images/products/latch/LatchSingle.webp", images: "[]",
      features: JSON.stringify(["Push-push operation", "Compact form factor", "High cycle durability", "Corrosion-resistant components"]),
      techParams: JSON.stringify({ total_length: "11MM", total_width: "6.9MM", total_height: "17.6MM" }),
      specifications: JSON.stringify({ "Latch Force": "15 – 50 N", "Operating Temperature": "-30°C to +80°C", "Material": "POM / Steel spring", "Life Cycle": ">100,000 cycles" }),
      hardForce: "6N", soundType: "audible", durability: JSON.stringify({ cycles: 50000, cycles_unit: "cycles" }),
      applications: JSON.stringify(["Interior storage", "Access panels", "Automotive interior panels"]),
      isActive: 1, sortOrder: 11, createdAt: new Date(), updatedAt: new Date(),
    },
    {
      slug: "tcm-custom-module", model: "TCM", name: "TCM Custom Damper Module", category: "other",
      summary: "Application-specific damper assemblies tailored to customer requirements.",
      description: "The TCM series represents TEAO's custom engineering capability. Each module is designed to customer specifications including torque, mounting, damping direction, and environmental requirements.",
      image: "/images/products/other/OthersSingle.webp", images: "[]",
      features: JSON.stringify(["Fully custom design", "Joint engineering support", "Rapid prototyping", "Scalable to mass production"]),
      specifications: JSON.stringify({ "Torque Range": "Custom specified", "Configuration": "Per customer drawing", "Material": "Per application requirements", "Validation": "Per automotive standards" }),
      applications: JSON.stringify(["Custom applications"]),
      isActive: 1, sortOrder: 12, createdAt: new Date(), updatedAt: new Date(),
    },
  ];

  db.delete(schema.products).run();
  for (const p of productData) {
    db.insert(schema.products).values(p).run();
  }
  console.log(`  Products: ${productData.length} seeded`);

  // --- News ---
  db.delete(schema.news).run();
  db.insert(schema.news).values([
    {
      slug: "teao-expands-capacity",
      title: "TEAO expands automated damper assembly capacity.",
      summary: "Improved automation supports stable quality and large-volume delivery.",
      content: "TEAO has completed a significant expansion of its automated damper assembly lines at its Dongguan facility. The new equipment increases annual production capacity to 80 million units while maintaining the consistent torque performance and quality standards that automotive customers require. The investment includes automated torque testing stations integrated into each assembly line, providing 100% inspection capability.",
      image: "/images/news/placeholder-1.webp",
      category: "company",
      isPublished: 1,
      publishedAt: "2026-03-15",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      slug: "automotive-quality-systems",
      title: "Automotive quality systems for damper production.",
      summary: "IATF-oriented process control helps ensure repeatable torque performance.",
      content: "TEAO's quality management system is structured around IATF 16949 principles, with a focus on process control, measurement system analysis, and production traceability. Each damper design undergoes validation testing across the specified temperature range, and production batches are tracked from raw material through final inspection. This systematic approach supports the quality requirements of global OEM and Tier-1 customers.",
      image: "/images/news/placeholder-2.webp",
      category: "quality",
      isPublished: 1,
      publishedAt: "2026-02-20",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      slug: "torque-requirements-guide",
      title: "How to define torque requirements for soft motion.",
      summary: "Key parameters for faster damper selection and technical quotation.",
      content: "Defining clear torque requirements is the first step to selecting or designing the right damper for an application. Key parameters include: target torque value and tolerance, damping direction (clockwise, counter-clockwise, or both), operating temperature range, space envelope constraints, mounting configuration, cycle life requirements, and any special environmental conditions. Providing these parameters with your inquiry enables TEAO's engineering team to recommend the most suitable standard platform or propose a custom design.",
      image: "/images/news/placeholder-3.webp",
      category: "engineering",
      isPublished: 1,
      publishedAt: "2026-01-10",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]).run();
  console.log("  News: 3 seeded");

  // --- Admin ---
  // Only seed admin if none exists (first run)
  const existingAdmins = db.select().from(schema.admins).all();
  if (existingAdmins.length === 0) {
    const pwHash = await hashPassword("teao123");
    db.insert(schema.admins).values({
      username: "admin",
      passwordHash: pwHash,
      createdAt: new Date(),
    }).run();
    console.log("  Admin: created (admin / teao123)");
  }

  console.log("Seed complete.");
}

seed().catch(console.error);
