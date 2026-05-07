import { cn } from "@/lib/utils";

interface SectionHeadProps {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHead({
  eyebrow,
  title,
  description,
  className,
}: SectionHeadProps) {
  return (
    <div
      className={cn(
        "grid gap-4 lg:gap-12 items-end mb-6 lg:mb-10",
        "grid-cols-1",
        description ? "lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.55fr)]" : "",
        className
      )}
    >
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="mt-2.5 lg:mt-3.5 text-[30px] sm:text-[34px] lg:text-[clamp(34px,4vw,58px)] leading-[1.02] lg:leading-[0.98] tracking-[-0.04em] font-extrabold text-[#171717] text-balance">
          {title}
        </h2>
      </div>
      {description && (
        <p className="text-[#666666] text-[15px] lg:text-[17px] leading-relaxed max-w-[520px]">{description}</p>
      )}
    </div>
  );
}
