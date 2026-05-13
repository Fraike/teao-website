import type { Metadata } from "next";
import Image from "next/image";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Gauge, Eye, Shield, Thermometer, Clock, Target, Sliders, Waves } from "lucide-react";

export const metadata: Metadata = {
  title: "Quality Control | IATF 16949 Certified",
  description:
    "IATF 16949 certified quality system. 100% torque testing, 100% visual inspection, professional laboratory with lifecycle testing, environmental chamber and optical inspection capabilities.",
  keywords: [
    "IATF 16949 damper",
    "quality control damper",
    "torque testing",
    "damper inspection",
    "automotive quality",
    "lifecycle testing",
  ],
};

const ENGINEERING_CAPABILITIES = [
  { icon: Gauge, title: "High Torque, Small Size", description: "Achieving high torque output in compact, space-constrained damper designs." },
  { icon: Clock, title: "Extended Lifespan", description: "Material and design optimization validated to >100,000 cycles for extended product life." },
  { icon: Thermometer, title: "Wide Temperature Range", description: "Consistent damping performance across ambient conditions from -40°C to +110°C." },
  { icon: Target, title: "Unidirectional Damping", description: "Precision-controlled damping in a single direction — open smooth, close firm." },
  { icon: Sliders, title: "Tailored Performance", description: "Damping profiles tuned to your specific torque, speed and motion-feel requirements." },
  { icon: Waves, title: "Low Temperature Sensitivity", description: "Viscosity-stable silicone oil formulations minimize performance drift under thermal cycling." },
];

const LAB_GROUPS = [
  {
    label: "Mechanical Testing",
    items: [
      { equipment: "Digital Push-Pull Force Gauge", range: "0.25 ~ 500N", accuracy: "±0.25N" },
      { equipment: "Torque Meter", range: "10g ~ 6000g", accuracy: "±0.1g" },
      { equipment: "Torque Tester", range: "1 ~ 100 turns", accuracy: "Internal standard" },
    ],
  },
  {
    label: "Environmental Testing",
    items: [
      { equipment: "Environmental Chamber", range: "-40°C to +110°C", accuracy: "±1°C" },
      { equipment: "High Temperature Chamber", range: "-40°C to +110°C", accuracy: "±1°C" },
      { equipment: "Thermometer", range: "-40°C to +110°C", accuracy: "±1°C" },
    ],
  },
  {
    label: "Durability & Inspection",
    items: [
      { equipment: "Lifecycle Tester", range: ">100,000 cycles", accuracy: "Internal standard" },
      { equipment: "Optical Projector", range: "X200mm × Y100mm", accuracy: "0.001mm" },
      { equipment: "Rubber Hardness Tester", range: "0 ~ 100A", accuracy: "±1A" },
    ],
  },
  {
    label: "Precision Measurement",
    items: [
      { equipment: "Digital Caliper / Height Gauge", range: "0 ~ 150mm", accuracy: "0.01mm" },
      { equipment: "Electronic Balance", range: "0.000001 ~ 150kg", accuracy: "0.000001kg" },
      { equipment: "Viscosity Tester", range: "0.1 ~ 60 turns", accuracy: "1mPa" },
    ],
  },
];

export default function QualityPage() {
  return (
    <>
      {/* ===== Hero ===== */}
      <section className="pt-28 pb-12 lg:pt-32 lg:pb-14">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow="Quality Control"
              title="Validated quality for every damper."
              description="IATF 16949 certified system with 100% torque testing, 100% visual inspection and batch traceability from raw material to finished product."
              className="max-w-5xl"
            />
          </Reveal>

          {/* ===== Two 100% Inspection Processes ===== */}
          <div className="grid lg:grid-cols-2 items-stretch gap-5 xl:gap-8 mt-8 max-w-5xl">
            <Reveal>
              <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-[220px] overflow-hidden bg-[#F8F9FA]">
                  <Image
                    src="/images/company/visual-inspection-2.png"
                    alt="Torque testing station"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 600px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/55 via-transparent to-transparent" />
                  <div className="absolute left-5 bottom-5 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-extrabold text-[#171717] shadow-lg">
                    <span className="h-2 w-2 rounded-full bg-[#ED7606] animate-pulse" />
                    Torque data logged
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-7 sm:p-8">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#ED7606]/10">
                      <Gauge className="w-7 h-7 text-[#ED7606]" />
                    </div>
                    <span className="inline-block px-3 py-1 text-xs font-extrabold tracking-wide text-[#ED7606] bg-[#ED7606]/8 rounded-full">
                      100% Torque Testing
                    </span>
                  </div>
                  <h3 className="text-2xl font-extrabold tracking-[-0.02em] mb-4">
                    Every unit measured. Zero exceptions.
                  </h3>
                  <ul className="space-y-3 text-[#666666] text-sm leading-relaxed">
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ED7606] shrink-0 mt-2" />
                      <span>100% torque verification on every unit before shipment</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ED7606] shrink-0 mt-2" />
                      <span>Single-direction, bi-directional and custom torque profiles</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ED7606] shrink-0 mt-2" />
                      <span>Stable torque across -40°C to +110°C ambient conditions</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ED7606] shrink-0 mt-2" />
                      <span>Real-time data logging with full batch traceability</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Reveal>

            <Reveal delay={1}>
              <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-[220px] overflow-hidden bg-[#F8F9FA]">
                  <Image
                    src="/images/company/visual-inspection.jpg"
                    alt="Visual inspection station"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 600px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/55 via-transparent to-transparent" />
                  <div className="absolute left-5 bottom-5 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-extrabold text-[#171717] shadow-lg">
                    <span className="h-2 w-2 rounded-full bg-[#ED7606] animate-pulse" />
                    Surface checked
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-7 sm:p-8">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#ED7606]/10">
                      <Eye className="w-7 h-7 text-[#ED7606]" />
                    </div>
                    <span className="inline-block px-3 py-1 text-xs font-extrabold tracking-wide text-[#ED7606] bg-[#ED7606]/8 rounded-full">
                      100% Visual Inspection
                    </span>
                  </div>
                  <h3 className="text-2xl font-extrabold tracking-[-0.02em] mb-4">
                    Every surface checked. Every time.
                  </h3>
                  <ul className="space-y-3 text-[#666666] text-sm leading-relaxed">
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ED7606] shrink-0 mt-2" />
                      <span>100% visual inspection for surface quality and conformance</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ED7606] shrink-0 mt-2" />
                      <span>Defect classification: burrs, sink marks, color, dimensions</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ED7606] shrink-0 mt-2" />
                      <span>Standardized SOP with defined acceptance criteria</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ED7606] shrink-0 mt-2" />
                      <span>High-res optical inspection + trained operator verification</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== Engineering Capability ===== */}
      <section className="py-12 lg:py-14">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow="Engineering"
              title="We tune dampers to your exact requirements."
              description="Our team is capable of creating suitable products for you and adjusting key parameters of the dampers."
            />
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-5 max-w-5xl">
            {ENGINEERING_CAPABILITIES.map((cap, i) => (
              <Reveal key={cap.title} delay={(Math.min(i, 3) + 1) as 1 | 2 | 3}>
                <div className="group flex gap-5 p-6 rounded-2xl border border-[#E5E5E5] bg-white hover:border-[#ED7606]/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                  <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#F8F9FA] group-hover:bg-[#ED7606]/10 shrink-0 transition-colors duration-300">
                    <cap.icon className="w-5 h-5 text-[#ED7606]" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[15px] text-[#171717] mb-1.5">{cap.title}</h4>
                    <p className="text-[#666666] text-[14px] leading-relaxed">{cap.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Laboratory Capability ===== */}
      <section className="py-12 lg:py-14">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow="Laboratory"
              title="Clear validation data from calibrated equipment."
              description="TEAO laboratory supports torque, lifecycle, dimensional and environmental verification for automotive-grade quality control."
            />
          </Reveal>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 max-w-5xl">
            {LAB_GROUPS.map((group, gi) => (
              <Reveal key={group.label} delay={(Math.min(gi, 2) + 1) as 1 | 2 | 3}>
                <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5 h-full">
                  <h4 className="text-xs font-extrabold text-[#9CA3AF] uppercase tracking-widest mb-4">
                    {group.label}
                  </h4>
                  <ul className="space-y-4">
                    {group.items.map((item) => (
                      <li key={item.equipment}>
                        <div className="text-[13px] font-bold text-[#171717] leading-snug mb-0.5">
                          {item.equipment}
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                          <span className="rounded-lg bg-[#F8F9FA] px-2.5 py-2 text-[#6B7280]">
                            <span className="block text-[9px] font-black uppercase tracking-[0.12em] text-[#9CA3AF]">
                              Range
                            </span>
                            <span className="mt-0.5 block font-bold">{item.range}</span>
                          </span>
                          <span className="rounded-lg bg-[#F8F9FA] px-2.5 py-2 text-[#6B7280]">
                            <span className="block text-[9px] font-black uppercase tracking-[0.12em] text-[#9CA3AF]">
                              Accuracy
                            </span>
                            <span className="mt-0.5 block font-bold">{item.accuracy}</span>
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== IATF 16949 Reference ===== */}
      <section className="py-12 lg:py-14">
        <div className="shell">
          <div className="max-w-4xl rounded-2xl bg-gradient-to-br from-[#F8F9FA] to-[#EDF0F3] border border-[#E5E5E5] p-8 sm:p-10">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-[#ED7606]/10 shrink-0">
                <Shield className="w-7 h-7 text-[#ED7606]" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold tracking-[-0.02em] mb-3">
                  IATF 16949 Certified Quality System
                </h3>
                <p className="text-[#666666] leading-relaxed mb-6">
                  TEAO has maintained automotive-grade quality certification since 2016 (originally TS 16949).
                  Our quality management system spans the full product lifecycle — from design and raw material
                  procurement through manufacturing, testing and after-sales service. Continuous improvement is
                  driven by customer feedback, internal audits and regular management reviews.
                </p>
                <Button href="/about" variant="outline">
                  View Certifications →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-12 lg:py-16">
        <div className="shell text-center">
          <Reveal>
            <h2 className="text-[28px] sm:text-[34px] font-extrabold tracking-[-0.03em] mb-4">
              Need verified quality data?
            </h2>
            <p className="text-[#666666] text-[15px] sm:text-[17px] mb-8 max-w-xl mx-auto">
              Request PPAP documentation, torque test reports and quality certifications for your program.
            </p>
            <Button href="/contact" variant="primary">
              Request Quality Documents →
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
