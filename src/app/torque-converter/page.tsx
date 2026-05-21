import type { Metadata } from "next";
import TorqueConverter from "@/components/tools/TorqueConverter";
import { JsonLdScript, softwareApplicationSchema } from "@/lib/structured-data";

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
    images: [{ url: "/images/logo-color.webp", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Torque Converter | Free Engineering Tool | TEAO",
    description:
      "Free online torque unit conversion tool for damper specification and motion control engineering.",
    images: ["/images/logo-color.webp"],
  },
};

export default function TorqueConverterPage() {
  return (
    <>
      <JsonLdScript data={softwareApplicationSchema()} />
      {/* Hero */}
      <section className="relative pt-32 lg:pt-40 pb-10 lg:pb-14 bg-[#F8F9FA] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.03) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage: "linear-gradient(180deg, #000, transparent 90%)",
          }}
        />
        <div className="absolute w-[400px] h-[400px] -left-[100px] -top-[120px] rounded-full border border-[#ED7606]/12 pointer-events-none" />

        <div className="shell relative z-10 text-center">
          <span className="eyebrow">Engineering Tools</span>
          <h1 className="mt-3.5 text-[clamp(30px,4vw,50px)] leading-[0.94] tracking-[-0.05em] font-black text-[#111827]">
            Torque Unit Converter
          </h1>
          <p className="mt-4 text-[#6B7280] text-lg max-w-[600px] mx-auto leading-relaxed">
            Instantly convert between nine common torque units. Engineered for damper specification
            and motion control design.
          </p>
        </div>
      </section>

      {/* Converter */}
      <section className="py-2 pb-16 lg:pb-24 bg-white">
        <div className="shell">
          <TorqueConverter />
        </div>
      </section>

      {/* Tips */}
      <section className="py-12 lg:py-16 bg-[#F0F2F5]">
        <div className="shell">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl lg:text-2xl font-black tracking-[-0.03em] mb-6 text-center text-[#111827]">
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
                  className="p-5 rounded-xl border border-[#E5E7EB] bg-white text-center hover:-translate-y-1 hover:border-[#ED7606]/25 hover:shadow-md transition-all duration-300"
                >
                  <span className="text-[#ED7606] text-xs font-black tracking-[0.14em]">
                    {t.step}
                  </span>
                  <h3 className="mt-2 font-extrabold text-[#374151]">{t.title}</h3>
                  <p className="mt-1.5 text-[#6B7280] text-sm leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-5 rounded-xl border border-[#E5E7EB] bg-white">
              <p className="text-[#6B7280] text-sm leading-relaxed text-center">
                <strong className="text-[#ED7606]">TEAO tip:</strong> Damper torque specifications
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
