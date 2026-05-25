import { Reveal } from "@/components/ui/reveal";
import { timeline } from "@/content/about";

export function CompanyTimeline() {
  return (
    <section className="py-10 lg:py-14 bg-white overflow-hidden">
      <div className="shell">
        <div className="grid lg:grid-cols-[0.34fr_1fr] gap-7 lg:gap-10 items-start">
          <Reveal>
            <div>
              <span className="eyebrow">Company Milestones</span>
              <h2 className="mt-2.5 text-[24px] lg:text-[30px] leading-[1.02] tracking-[-0.04em] font-extrabold text-[#111827]">
                Focused growth since 2001.
              </h2>
              <p className="mt-3 text-[#6B7280] text-sm lg:text-[15px] leading-relaxed">
                A compact view of TEAO&apos;s development path, from foundation to automotive programs and factory expansion.
              </p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {timeline.map((item) => (
              <div
                key={item.year}
                className="rounded-xl border border-[#E5E7EB] bg-[#F8F9FA] p-4 hover:shadow-md transition-all duration-300"
              >
                <b className="text-[#ED7606] text-lg tracking-[-0.02em]">{item.year}</b>
                <h3 className="mt-2 text-[#111827] font-extrabold text-sm leading-tight">{item.title}</h3>
                <p className="mt-2 text-[#6B7280] text-xs leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
