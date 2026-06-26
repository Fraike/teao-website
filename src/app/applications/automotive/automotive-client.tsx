"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { automotiveInterior, automotiveExterior, type AutomotiveZone, type ApplicationScene } from "@/content/automotive-applications";
import { SceneIllustration } from "./scene-illustrations";

const ZONE_TABS: { key: AutomotiveZone; label: string }[] = [
  { key: "interior", label: "Interior" },
  { key: "exterior", label: "Exterior" },
];

const INDUSTRIES = [
  { label: "Automotive", active: true },
  { label: "Bathroom & Sanitary", active: false },
  { label: "Office Equipment", active: false },
  { label: "Industrial", active: false },
];

const ENGINEERING_CHIPS = [
  "Application position",
  "Torque / force",
  "Motion direction",
  "Opening angle",
  "Mounting space",
  "Temperature range",
  "Cycle life",
  "Annual volume",
  "Drawing or sample",
];

export function AutomotiveClient() {
  const [zone, setZone] = useState<AutomotiveZone>("interior");
  const [activeScene, setActiveScene] = useState<string>("center-console-lid");
  const config = zone === "interior" ? automotiveInterior : automotiveExterior;
  const observerRef = useRef<IntersectionObserver | null>(null);

  const scrollToScene = useCallback((sceneId: string) => {
    setActiveScene(sceneId);
    document.getElementById(sceneId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // IntersectionObserver for scroll-linked hotspot highlighting
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveScene(visible.target.id);
      },
      { rootMargin: "-28% 0px -58% 0px", threshold: 0.1 },
    );
    config.scenes.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observerRef.current!.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, [config.scenes]);

  // Reset active scene when zone changes
  const handleZoneChange = (newZone: AutomotiveZone) => {
    setZone(newZone);
    const firstScene = (newZone === "interior" ? automotiveInterior : automotiveExterior).scenes[0];
    setActiveScene(firstScene.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Breadcrumb + Industry Tabs */}
      <section className="border-b border-[#E5E7EB] bg-[#F4F6F8]">
        <div className="shell flex items-center justify-between gap-5 min-h-[76px] flex-wrap py-4">
          <div className="flex items-center gap-3 text-[12px] font-black tracking-[0.08em] text-[#9CA3AF]">
            <Link href="/" className="hover:text-[#374151] transition-colors">HOME</Link>
            <span>/</span>
            <Link href="/applications" className="text-[#111827]">APPLICATIONS</Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {INDUSTRIES.map((ind) => (
              <span
                key={ind.label}
                className={`inline-flex items-center min-h-[36px] px-4 rounded-full border text-[13px] font-extrabold ${
                  ind.active
                    ? "bg-[#151A22] border-[#151A22] text-white"
                    : "bg-white border-[#DFE3E8] text-[#6B7280]"
                }`}
              >
                {ind.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-10 lg:py-16">
        <div className="shell">
          {/* Section Head */}
          <div className="grid lg:grid-cols-[1fr_420px] gap-8 lg:gap-12 items-end mb-7">
            <div>
              <span className="eyebrow">Application Map</span>
              <h1 className="mt-2.5 lg:mt-3.5 text-[28px] sm:text-[32px] lg:text-[clamp(32px,4vw,44px)] leading-[1.02] tracking-[-0.04em] font-extrabold text-[#111827]">
                Automotive Interior / Exterior Dampers
              </h1>
            </div>
            <p className="text-[#6B7280] text-[15px] leading-relaxed">
              Click the orange markers on the map to jump to each application section and explore recommended damper types and models.
            </p>
          </div>

          <section className="mb-7 grid gap-4 rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_18px_rgba(17,24,39,0.035)] lg:grid-cols-[1fr_0.82fr] lg:p-6">
            <div>
              <h2 className="text-[20px] font-black tracking-[-0.03em] text-[#111827] lg:text-[24px]">
                Why quiet automotive mechanisms need damping
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-[#5B6472] lg:text-[15px]">
                Electric vehicles and premium interiors are much quieter than traditional
                engine-driven vehicles. As background noise drops, small mechanical sounds from
                opening a glove box, releasing a glasses box, closing a center console lid or
                returning a grab handle become easier for passengers to notice. A correctly
                selected automotive interior damper slows the motion, reduces snap-back impact,
                controls vibration and helps the mechanism feel more refined.
              </p>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
              {[
                "Lower impact noise in EV cabins",
                "Soft-open and soft-close motion feel",
                "More premium perceived interior quality",
                "Controlled return for handles, lids and covers",
              ].map((item) => (
                <div key={item} className="rounded-lg border border-[#F1D6BD] bg-[#FFF8F2] px-3.5 py-3 text-[13px] font-extrabold leading-snug text-[#9A4A05]">
                  {item}
                </div>
              ))}
            </div>
          </section>

          {/* Zone Tabs */}
          <div className="flex gap-2.5 mb-6">
            {ZONE_TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => handleZoneChange(t.key)}
                className={`min-w-[128px] h-11 rounded-full border text-[14px] font-extrabold transition-all duration-200 ${
                  zone === t.key
                    ? "border-[#ED7606] bg-[#ED7606] text-white shadow-[0_14px_30px_rgba(237,118,6,.2)]"
                    : "border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#ED7606] hover:text-[#ED7606]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Scene Map */}
          <div className="relative rounded-lg overflow-hidden border border-[#E5E7EB] bg-[#1F2937] shadow-[0_8px_30px_rgba(17,24,39,.08)]">
            <div className="relative min-h-[360px] lg:min-h-[480px]">
              <Image
                src={config.mapImage}
                alt={zone === "interior" ? "Automotive interior damping application map" : "Automotive exterior damping application map"}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 1184px"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-[#111827]/15 pointer-events-none" />

              {/* Hotspots */}
              {config.hotspots.map((spot) => (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => scrollToScene(spot.id)}
                  className={`absolute z-10 flex items-center gap-2.5 border-0 bg-transparent p-0 cursor-pointer transition-transform duration-200 hover:scale-105 ${
                    activeScene === spot.id ? "scale-105" : ""
                  }`}
                  style={{ left: spot.left, top: spot.top, transform: "translate(-50%, -50%)" }}
                  aria-label={spot.label}
                  data-analytics-event="scene_click"
                  data-analytics-target-type="scene"
                  data-analytics-target-id={spot.id}
                  data-analytics-source="map_hotspot"
                >
                  <span className={`shrink-0 w-[34px] h-[34px] grid place-items-center rounded-full transition-all duration-200 ${
                    activeScene === spot.id
                      ? "bg-[rgba(237,118,6,.42)] scale-110"
                      : "bg-[rgba(237,118,6,.25)]"
                  }`}>
                    <span className="w-[15px] h-[15px] rounded-full bg-[#ED7606] border-[4px] border-white/90" />
                  </span>
                  <span className={`hidden lg:inline-flex items-center min-h-[42px] px-[22px] rounded-full text-[18px] font-black whitespace-nowrap transition-all duration-200 ${
                    activeScene === spot.id
                      ? "bg-[#D46900] -translate-y-0.5"
                      : "bg-[#ED7606]"
                  } text-white shadow-[0_14px_30px_rgba(237,118,6,.23)]`}>
                    {spot.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Mobile chip selector */}
            <div className="hidden max-[767px]:flex gap-2 overflow-x-auto px-3 py-3 border-t border-white/10 bg-[#151A22]">
              {config.hotspots.map((spot, i) => (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => scrollToScene(spot.id)}
                  className={`shrink-0 min-h-[34px] px-3 rounded-full border text-[12px] font-extrabold whitespace-nowrap transition-colors ${
                    activeScene === spot.id
                      ? "border-[#ED7606] bg-[#ED7606] text-white"
                      : "border-white/15 bg-white/8 text-white"
                  }`}
                  data-analytics-event="scene_click"
                  data-analytics-target-type="scene"
                  data-analytics-target-id={spot.id}
                  data-analytics-source="mobile_chip"
                >
                  {String(i + 1).padStart(2, "0")} {spot.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scene Cards */}
          <div className="grid gap-4 mt-10">
            {config.scenes.map((scene) => (
              <SceneCard key={scene.id} scene={scene} active={activeScene === scene.id} />
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-12 lg:mt-16 grid lg:grid-cols-[1fr_390px] overflow-hidden rounded-lg border border-[#111827]/8 bg-[#1F2937] shadow-[0_8px_30px_rgba(17,24,39,.08)]">
            <div className="p-8 lg:p-12 text-white"
              style={{
                background: "radial-gradient(circle at 10% 18%, rgba(237,118,6,.18), transparent 22%), linear-gradient(135deg, #1F2937, #111827)",
              }}
            >
              <span className="eyebrow text-white/80">Engineering Support</span>
              <h2 className="mt-3 mb-4 max-w-[650px] text-[24px] sm:text-[28px] lg:text-[32px] leading-[1.08] tracking-[-0.04em] font-black">
                Already know where the damper will be used?
              </h2>
              <p className="max-w-[650px] mb-6 text-white/65 text-[15px] leading-relaxed">
                Send application location, drawings, motion direction, target torque, and annual volume. TEAO can assist in recommending standard damper platforms or developing custom solutions based on structural space.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/products" className="btn btn-primary text-sm lg:text-base px-7">
                  Discover our dampers
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center h-11 lg:h-12 px-7 rounded-full border border-white/20 text-white text-sm lg:text-base font-bold hover:bg-white/10 transition-colors">
                  Contact us
                </Link>
              </div>
            </div>
            <div className="p-8 lg:p-10 bg-white">
              <h3 className="mb-4 text-[18px] font-black text-[#111827] leading-tight">Recommended inquiry inputs</h3>
              <div className="flex flex-wrap gap-2">
                {ENGINEERING_CHIPS.map((chip) => (
                  <span key={chip} className="inline-flex items-center min-h-[34px] px-3 rounded-full border border-[#F1D6BD] bg-[#FFF8F2] text-[#9A4A05] text-[12px] font-extrabold">
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

/* ---- Scene Card ---- */
function SceneCard({ scene, active }: { scene: ApplicationScene; active: boolean }) {
  return (
    <article
      id={scene.id}
      className={`overflow-hidden rounded-lg border bg-white transition-all duration-300 scroll-mt-24 p-4 lg:p-5 ${
        active
          ? "border-[rgba(237,118,6,.35)] shadow-[0_4px_16px_rgba(237,118,6,.05)]"
          : "border-[#E5E7EB] shadow-[0_2px_10px_rgba(17,24,39,.03)]"
      }`}
    >
      {/* Header: small icon + title */}
      <div className="flex items-center gap-3 mb-3">
        <div className="shrink-0 w-10 h-10 lg:w-11 lg:h-11 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB] flex items-center justify-center p-1.5">
          <SceneIllustration sceneId={scene.id} className="w-full h-full" />
        </div>
        <div className="flex items-baseline gap-2 min-w-0">
          <em className="not-italic text-[18px] font-black text-[#ED7606] leading-none">{scene.no}</em>
          <h2 className="text-[16px] lg:text-[17px] font-black text-[#111827] leading-[1.15] tracking-[-0.02em] truncate">{scene.title}</h2>
        </div>
      </div>
      <p className="mb-3 text-[13px] text-[#6B7280] leading-relaxed">{scene.desc}</p>

      {/* Product groups */}
      <div className="grid gap-2.5">
        {scene.groups.map((group) => (
          <div key={group.title} className="overflow-hidden rounded-lg border border-[#EEF1F4]">
            <div className="flex items-center justify-between min-h-[36px] px-3 bg-[#F8F9FA] text-[12px] font-extrabold text-[#111827]">
              <span>{group.title}</span>
              <span className="w-5 h-0.5 bg-[#ED7606]" />
            </div>
            <div className="grid grid-cols-4 lg:grid-cols-6">
              {group.products.map((prod, i) => (
                <Link
                  key={prod.model}
                  href={prod.href}
                  className={`flex flex-col items-center justify-between gap-1.5 px-2 py-2 border-t border-r border-[#EEF1F4] text-[11px] font-extrabold text-[#111827] text-center transition-all duration-200 hover:text-[#ED7606] hover:bg-[#FFFAF5] ${
                    (i + 1) % 4 === 0 ? "border-r-0 lg:border-r" : ""
                  } ${(i + 1) % 6 === 0 ? "lg:border-r-0" : ""}`}
                  data-analytics-event="product_click"
                  data-analytics-target-type="product"
                  data-analytics-target-id={prod.model.toLowerCase()}
                  data-analytics-source="automotive_scene"
                >
                  <div className="relative w-full h-[44px]">
                    <Image
                      src={prod.image}
                      alt={prod.model}
                      fill
                      className="object-contain transition-transform duration-200 hover:scale-105"
                      sizes="80px"
                    />
                  </div>
                  <span>{prod.model}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
