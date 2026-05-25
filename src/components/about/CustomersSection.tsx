import { Reveal } from "@/components/ui/reveal";
import { industries, customerBrands } from "@/content/about";
import { Car, Home, Bath, HeartPulse, Wrench } from "lucide-react";

const industryIcons = [Car, Home, Bath, HeartPulse, Wrench];

export function CustomersSection() {
  return (
    <section className="py-16 lg:py-24 bg-[#F0F2F5]">
      <div className="shell">
        <Reveal>
          <div className="text-center">
            <span className="eyebrow">Industries Served</span>
            <h2 className="mt-2.5 lg:mt-3.5 text-[26px] sm:text-[30px] lg:text-[clamp(30px,3.6vw,46px)] leading-[1.02] tracking-[-0.04em] font-extrabold text-[#111827]">
              Across automotive and consumer markets.
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4 mt-8 lg:mt-10">
          {industries.map((ind, i) => {
            const Icon = industryIcons[i];
            return (
              <div
                key={ind.name}
                className="p-5 lg:p-6 rounded-xl border border-[#E5E7EB] bg-white hover:-translate-y-1 hover:border-[#ED7606]/25 hover:shadow-md transition-all duration-300 text-center"
              >
                <Icon className="w-7 h-7 text-[#ED7606] mx-auto mb-3" strokeWidth={1.5} />
                <h3 className="font-extrabold text-sm lg:text-base text-[#111827]">{ind.name}</h3>
                <p className="mt-1.5 text-[#6B7280] text-xs lg:text-sm leading-relaxed">
                  {ind.description}
                </p>
              </div>
            );
          })}
        </div>

        <Reveal delay={2}>
          <div className="mt-12 lg:mt-16">
            <p className="text-center text-[#9CA3AF] text-sm font-bold uppercase tracking-[0.1em] mb-6 lg:mb-8">
              Trusted by customers across leading automotive and consumer product brands
            </p>

            <div className="flex flex-wrap justify-center gap-x-6 lg:gap-x-10 gap-y-3 lg:gap-y-4">
              {customerBrands.map((brand) => (
                <span
                  key={brand}
                  className="text-[#9CA3AF] hover:text-[#ED7606] text-xs lg:text-sm font-bold tracking-wide transition-colors duration-200 cursor-default"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
