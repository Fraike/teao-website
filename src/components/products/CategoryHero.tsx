import type { CategoryInfo } from "@/types";
import { Breadcrumb } from "./Breadcrumb";

type HeroCopy = { title: string; alternateName?: string; subtitle: string };

const CATEGORY_HERO_DATA: Record<string, HeroCopy> = {
  "gear-damper": {
    title: "Gear Dampers",
    alternateName: "Rotary Dampers",
    subtitle: "Compare TEAO gear dampers by torque, damping direction and mounting for controlled rotary motion.",
  },
  "axial-damper": {
    title: "Axial Dampers",
    subtitle: "Linear damping for controlled opening, closing and sliding motion.",
  },
  "glove-box-damper": {
    title: "Glove Box Dampers",
    subtitle: "Compare air and oil damper models by stroke and installation dimensions for controlled automotive glove box opening.",
  },
  latch: {
    title: "Latches",
    subtitle: "Reliable lock, release and engagement mechanisms for interiors.",
  },
  other: {
    title: "Other Products",
    subtitle: "Application-specific damper assemblies tailored to customer requirements.",
  },
};

const DEFAULT_HERO: HeroCopy = {
  title: "Precision Damper Solutions",
  subtitle: "Five focused product lines engineered for stable torque, quiet motion and repeatable mass production.",
};

export function CategoryHero({ category }: { category?: CategoryInfo }) {
  const data = category ? CATEGORY_HERO_DATA[category.slug] ?? DEFAULT_HERO : DEFAULT_HERO;

  return (
    <section className="pt-28 pb-10 lg:pt-36 lg:pb-14">
      <div className="shell">
        <Breadcrumb category={category?.slug} />
        <h1 className="mt-5 text-[clamp(34px,4.5vw,56px)] leading-[0.96] tracking-[-0.04em] font-black text-[#111827]">
          {data.title}
          {data.alternateName && (
            <span className="mt-2.5 block text-base font-semibold leading-snug tracking-normal text-[#4B5563] sm:text-lg">
              {data.alternateName}
            </span>
          )}
        </h1>
        <p className="mt-4 text-[#666666] text-[17px] max-w-[640px] leading-relaxed">
          {data.subtitle}
        </p>
      </div>
    </section>
  );
}
