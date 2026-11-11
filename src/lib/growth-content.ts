export const damperSelection = {
  "glove-box-damper": {
    name: "Glove box dampers",
    application: "Automotive glove box",
    guide: "automotive-glove-box-dampers-guide",
    models: ["rd-v107", "rd-v109", "rd-v129"],
    selection: "Compare the damping medium, stroke, overall length and mounting dimensions for each model. Confirm lid weight, hinge position, opening angle and target opening time before selecting a damper.",
  },
  "gear-damper": {
    name: "Gear dampers (rotary dampers)",
    application: "Rotary motion control",
    guide: "rotary-damper-gear-damper-guide",
    models: ["rd-t001", "rd-t015", "rd-t029"],
    selection: "Compare torque range, damping direction, mounting and gear geometry. For a model recommendation, share your target torque, direction, available space and the mechanism drawing.",
  },
} as const;

export type DamperSelectionCategory = keyof typeof damperSelection;

export interface DamperGuide {
  category: DamperSelectionCategory;
  title: string;
  summary: string;
  selectionHeading: string;
}

export const damperGuides: Partial<Record<string, DamperGuide>> = {
  "automotive-glove-box-dampers-guide": {
    category: "glove-box-damper",
    title: "Automotive Glove Box Dampers: Types and Selection Guide",
    summary: "Compare air, drawstring, rack and rotary glove box damper designs. Learn how lid weight, opening angle and mounting affect selection, then explore TEAO models.",
    selectionHeading: "Selection Parameters",
  },
  "rotary-damper-gear-damper-guide": {
    category: "gear-damper",
    title: "Rotary Damper Selection Guide: Torque, Mounting and Applications",
    summary: "Choose a rotary damper for your mechanism. Compare torque, mounting and damping direction, explore common applications and find TEAO gear damper models.",
    selectionHeading: "Recommended TEAO Rotary Damper Models",
  },
  "what-is-a-rotary-damper-working-principle": {
    category: "gear-damper",
    title: "How Rotary Dampers Work: Viscous Damping and Torque",
    summary: "See how a rotary damper uses fluid resistance to control motion, how rotation and temperature affect damping torque, and how rotary and linear dampers differ.",
    selectionHeading: "How a Rotary Damper Works",
  },
};

export function getGuideBody(content: string, guide: DamperGuide) {
  const body = content.replace(/^\s*<h1\b[^>]*>[\s\S]*?<\/h1>\s*/i, "");
  const headings = [...body.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)];
  const hasTakeaways = headings.some((heading) => heading[1].replace(/<[^>]+>/g, "").trim().toLowerCase() === "key takeaways");
  const selectionIndex = headings.findIndex((heading) => heading[1].replace(/<[^>]+>/g, "").trim() === guide.selectionHeading);
  const split = selectionIndex >= 0 ? headings[selectionIndex + 1]?.index : undefined;

  return {
    hasTakeaways,
    beforeSelection: split === undefined ? body : body.slice(0, split).trimEnd(),
    afterSelection: split === undefined ? "" : body.slice(split),
  };
}

export function getDamperInquiryUrl(category: string, application?: string, model?: string) {
  const query = new URLSearchParams({ product: category });
  if (application) query.set("application", application);
  if (model) query.set("model", model);
  return `/contact?${query}`;
}
