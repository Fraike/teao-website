export type SeoCategorySlug = "gear-damper" | "axial-damper" | "glove-box-damper" | "latch" | "other";

export interface CategorySeoConfig {
  title: string;
  description: string;
  keywords: string[];
  aliases: string[];
  llmsSummary: string;
  faq: { q: string; a: string }[];
}

export const CATEGORY_SEO: Record<SeoCategorySlug, CategorySeoConfig> = {
  "gear-damper": {
    title: "Gear Damper & Rotary Damper Manufacturer | TEAO",
    description:
      "TEAO manufactures precision gear dampers and rotary dampers for automotive interiors, glove boxes, cup holders, armrests, grab handles and compact soft-motion mechanisms.",
    keywords: [
      "gear damper",
      "rotary damper",
      "plastic rotary damper",
      "small rotary damper",
      "precision gear damper",
      "gear damper supplier",
      "rotary damper factory",
      "wholesale rotary dampers",
      "automotive damper supplier",
      "automotive interior motion control",
      "armrest rotary damper",
      "grab handle damper",
      "one way damper",
      "motion control damper",
      "nylon rack and pinion",
      "nylon pinion gear",
      "nylon spur gears",
    ],
    aliases: ["rotary damper", "plastic rotary damper", "small rotary damper", "one way damper"],
    llmsSummary:
      "Gear dampers are also searched as rotary dampers. TEAO supplies plastic rotary dampers, small rotary dampers and precision gear dampers for automotive interior motion control, glove boxes, armrests, cup holders, grab handles and custom mechanisms.",
    faq: [
      {
        q: "Is a gear damper the same as a rotary damper?",
        a: "In TEAO product selection, gear damper and rotary damper refer to the same rotary motion-control product family. These dampers are used for compact soft-motion mechanisms such as cup holders, glove boxes, armrests and grab handles.",
      },
      {
        q: "What applications use TEAO gear dampers?",
        a: "Typical applications include automotive interior motion control, glove boxes, center console lids, cup holders, inner door handles, grab handles, charge port covers and small storage doors.",
      },
      {
        q: "Can TEAO customize a gear damper for a specific torque?",
        a: "Yes. TEAO can tune torque, damping direction, gear parameters, mounting structure and silicone oil viscosity after reviewing the application drawing, target speed, temperature range and annual volume.",
      },
    ],
  },
  "axial-damper": {
    title: "Axial Damper & Barrel Damper Manufacturer | TEAO",
    description:
      "TEAO supplies axial dampers and barrel dampers for linear soft-close motion in automotive grab handles, armrests, glove boxes, overhead consoles, toilet seats and cabinet mechanisms.",
    keywords: [
      "axial damper",
      "barrel damper",
      "automotive axial damper",
      "soft close axial damper",
      "linear motion damper",
      "motion control axial damper",
      "axial damper supplier",
      "axial damper factory",
      "damping axial manufacturer",
      "silicone oil axial damper",
      "one way axial damper",
      "bi directional axial damper",
      "grab handle axial damper",
      "glove box axial damper",
      "armrest axial damper",
      "overhead console axial damper",
      "cup holder axial damper",
      "toilet seat soft close dampers",
      "cabinet door soft closer",
    ],
    aliases: ["barrel damper", "linear motion damper", "soft close axial damper"],
    llmsSummary:
      "Axial dampers are also searched as barrel dampers and linear motion dampers. TEAO axial dampers support push-pull or stroke-based damping for automotive grab handles, armrests, glove boxes, overhead consoles, cup holders and soft-close mechanisms.",
    faq: [
      {
        q: "What is an axial damper used for?",
        a: "An axial damper controls linear push-pull or stroke-based motion. It is commonly used in grab handles, armrests, glove boxes, overhead consoles, toilet seats and cabinet soft-close mechanisms.",
      },
      {
        q: "Is axial damper also called barrel damper?",
        a: "Yes. In many sourcing searches, axial damper and barrel damper describe the same general linear damper family used for compact soft-close or soft-return motion.",
      },
      {
        q: "What information is needed for an axial damper quotation?",
        a: "Please provide stroke, target damping force, motion direction, mounting space, temperature range, expected cycle life, drawing or sample reference and annual volume.",
      },
    ],
  },
  "glove-box-damper": {
    title: "Glove Box Damper Manufacturer | Automotive Soft Open Dampers",
    description:
      "TEAO manufactures automotive glove box dampers for controlled descent, soft-open motion and quiet interior storage operation, with custom force, direction and mounting options.",
    keywords: [
      "glove box damper",
      "automotive glove box damper",
      "glove box damper manufacturer",
      "glove box damper supplier",
      "glove box damper factory",
      "soft open glove box damper",
      "one way glove box damper",
      "bi directional glove box damper",
      "rotary glove box damper",
      "silicone oil glove box damper",
      "small glove box damper",
      "plastic glove box damper",
      "precision glove box damper",
      "glove box shock absorber",
      "glove box latch damper",
      "automotive interior damper",
      "glove box component supplier",
      "soft close mechanism",
    ],
    aliases: ["soft open glove box damper", "glove box shock absorber", "rotary glove box damper"],
    llmsSummary:
      "TEAO glove box dampers are automotive interior dampers for controlled glove box descent, soft-open motion, reduced impact noise and premium storage feel. Buyers also search for glove box shock absorbers, soft open glove box dampers and rotary glove box dampers.",
    faq: [
      {
        q: "How do glove box dampers improve automotive interiors?",
        a: "A glove box damper slows the opening motion, reduces drop impact, lowers cabin noise and gives the storage door a more controlled premium feel.",
      },
      {
        q: "What glove box damper options can TEAO customize?",
        a: "TEAO can tune damping force, one-way or two-way damping, mounting structure, rack or rotary engagement, material and validation requirements based on the customer drawing.",
      },
      {
        q: "What should engineers provide for a glove box damper review?",
        a: "Provide glove box weight, opening angle, hinge geometry, available installation space, target opening speed, temperature range, cycle-life requirement and annual volume.",
      },
    ],
  },
  latch: {
    title: "Automotive Latch & Push-Push Latch Manufacturer | TEAO",
    description:
      "TEAO supplies compact latches, push-push latches and hidden latch mechanisms for automotive glove boxes, console compartments, storage doors and interior panels.",
    keywords: [
      "automotive latch",
      "push push latch",
      "hidden door latch",
      "glove box latch",
      "glove box latch damper",
      "door latch black",
      "slam latch",
      "latch hardware",
      "cabinet latches",
      "cupboard latch",
      "lock catches",
      "automotive interior latch",
      "storage compartment latch",
    ],
    aliases: ["push push latch", "hidden door latch", "storage compartment latch"],
    llmsSummary:
      "TEAO latches are compact lock, release and engagement mechanisms for automotive interiors, glove boxes, storage compartments and access panels. Relevant searches include push-push latch, hidden latch, glove box latch and storage compartment latch.",
    faq: [
      {
        q: "Where are TEAO latches used?",
        a: "TEAO latches are used in automotive glove boxes, console compartments, storage doors, interior panels, access doors and compact mechanical release mechanisms.",
      },
      {
        q: "Can latch force and stroke be customized?",
        a: "Yes. TEAO can adjust latch force, press force, stroke length, mounting configuration, spring rate and material according to the customer structure.",
      },
      {
        q: "Can a latch be combined with a damper?",
        a: "Yes. Some storage mechanisms use a latch for locking and a damper for controlled opening or closing. TEAO can review both functions during application design.",
      },
    ],
  },
  other: {
    title: "Custom Motion Control Components & Damper Modules | TEAO",
    description:
      "TEAO develops custom motion control components, special damper modules, organizers and application-specific mechanisms for automotive and industrial programs.",
    keywords: [
      "custom damper design",
      "custom motion control components",
      "industrial damper components",
      "motion control solution",
      "soft close mechanism",
      "automotive interior motion control",
      "custom damper module",
      "application specific mechanism",
      "industrial components supplier",
    ],
    aliases: ["custom damper module", "motion control solution", "industrial damper components"],
    llmsSummary:
      "TEAO custom motion control components include application-specific damper modules, soft-close mechanisms and engineered assemblies for automotive and industrial programs.",
    faq: [
      {
        q: "When should a project use a custom damper module?",
        a: "A custom module is suitable when standard dampers cannot meet space, torque, motion direction, mounting or environmental requirements.",
      },
      {
        q: "What custom development support does TEAO provide?",
        a: "TEAO supports concept review, structure design, torque or force tuning, prototype sampling, tooling, validation and mass production.",
      },
      {
        q: "What inputs are needed for a custom module quotation?",
        a: "Send drawings, target motion, torque or force requirement, available space, environmental conditions, validation requirements and annual volume.",
      },
    ],
  },
};

export const GLOBAL_SEO_KEYWORDS = [
  "automotive damper manufacturer",
  "automotive damper supplier",
  "IATF16949 damper manufacturer",
  "motion control damper",
  "motion control solution",
  "soft close buffer",
  "custom gear damper design",
  "custom axial damper design",
  "custom glove box damper design",
  "silicone oil damper",
];

export const AUTOMOTIVE_SEO_KEYWORDS = [
  "automotive interior damper",
  "automotive interior motion control",
  "glove box damper",
  "grab handle damper",
  "center console lid damper",
  "armrest rotary damper",
  "door handle damper",
  "charging port cover damper",
  "soft motion automotive mechanism",
  "EV charging port cover damper",
  "overhead console axial damper",
  "quiet automotive interior mechanism",
];

export function getCategorySeo(
  slug: string,
  fallbackName: string,
  fallbackDescription: string,
): CategorySeoConfig {
  return CATEGORY_SEO[slug as SeoCategorySlug] ?? {
    title: `${fallbackName} Manufacturer | TEAO`,
    description: fallbackDescription,
    keywords: [slug, fallbackName.toLowerCase(), "damper", "motion control", "TEAO"],
    aliases: [],
    llmsSummary: fallbackDescription,
    faq: [
      {
        q: `What are ${fallbackName.toLowerCase()}?`,
        a: `${fallbackName} are ${fallbackDescription.toLowerCase()}`,
      },
    ],
  };
}
