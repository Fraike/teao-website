import type { Metadata } from "next";
import TorqueConverter from "@/components/tools/TorqueConverter";

export const metadata: Metadata = {
  title: "Torque Converter | TEAO Damper Engineering Tools",
  description:
    "Convert torque units including N·m, kgf·cm, gf·cm, mN·m, lbf·in, ozf·in and more. Free online torque conversion tool for damper specification and engineering applications.",
  keywords: [
    "torque converter",
    "torque unit conversion",
    "N·m to kgf·cm",
    "gf·cm to mN·m",
    "damper torque calculator",
    "torque conversion tool",
    "engineering torque converter",
  ],
  openGraph: {
    title: "Torque Converter | Free Engineering Tool by TEAO",
    description:
      "Instantly convert between all common torque units. Designed for damper specification and motion control engineering.",
  },
};

export default function TorqueConverterPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 lg:pt-40 pb-10 lg:pb-14 bg-[#0a0b0d] text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage: "linear-gradient(180deg, #000, transparent 90%)",
          }}
        />
        <div className="absolute w-[400px] h-[400px] -left-[100px] -top-[120px] rounded-full border border-[#ED7606]/12 pointer-events-none" />

        <div className="shell relative z-10 text-center">
          <span className="eyebrow">Engineering Tools</span>
          <h1 className="mt-3.5 text-[clamp(34px,4.5vw,60px)] leading-[0.94] tracking-[-0.05em] font-black">
            Torque Unit Converter
          </h1>
          <p className="mt-4 text-white/55 text-lg max-w-[600px] mx-auto leading-relaxed">
            Instantly convert between nine common torque units. Engineered for damper specification
            and motion control design.
          </p>
        </div>
      </section>

      {/* Converter */}
      <section className="py-2 pb-16 lg:pb-24 bg-[#0a0b0d]">
        <div className="shell">
          <TorqueConverter />
        </div>
      </section>

      {/* Tips */}
      <section className="py-12 lg:py-16 bg-[#171717] text-white">
        <div className="shell">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl lg:text-2xl font-black tracking-[-0.03em] mb-6 text-center">
              How to use this tool
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  step: "01",
                  title: "Enter value",
                  desc: "Type any torque value in the input field above.",
                },
                {
                  step: "02",
                  title: "Select unit",
                  desc: "Choose the unit of your input value from the dropdown.",
                },
                {
                  step: "03",
                  title: "Read results",
                  desc: "All unit conversions update instantly — no button needed.",
                },
              ].map((t) => (
                <div
                  key={t.step}
                  className="p-5 rounded-xl border border-white/8 bg-white/[0.03] text-center"
                >
                  <span className="text-[#ED7606] text-xs font-black tracking-[0.14em]">
                    {t.step}
                  </span>
                  <h3 className="mt-2 font-extrabold text-white/90">{t.title}</h3>
                  <p className="mt-1.5 text-white/45 text-sm leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-5 rounded-xl border border-white/8 bg-white/[0.03]">
              <p className="text-white/45 text-sm leading-relaxed text-center">
                <strong className="text-[#FF9A3C]">TEAO tip:</strong> Damper torque specifications
                vary widely across the market — gf·cm, N·m, mN·m, kgf·cm and more. Use this
                converter to quickly align units when comparing product parameters.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
