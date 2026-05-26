import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="relative min-h-[680px] lg:min-h-[min(100svh,820px)] flex items-center text-[#111827] bg-[#FAF9F6] overflow-hidden">
      {/* Warm radial glow */}
      <div className="absolute -top-[30%] -right-[15%] w-[65%] h-[120%] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 55% 50% at 50% 40%, rgba(237,118,6,0.10) 0%, rgba(237,118,6,0.04) 35%, transparent 70%)",
        }}
      />
      <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[80%] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 50% 45% at 40% 50%, rgba(237,118,6,0.07) 0%, transparent 65%)",
        }}
      />

      {/* Background layers */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 scale-[1.04] animate-hero-drift opacity-20"
          style={{
            background:
              "linear-gradient(90deg, rgba(250,249,246,.96), rgba(250,249,246,.7) 46%, rgba(250,249,246,.15)), linear-gradient(0deg, rgba(250,249,246,.94), rgba(250,249,246,0) 38%), url('/images/Homepage-background-image.webp') center / cover no-repeat, #FAF9F6",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.03) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "linear-gradient(135deg, #000 35%, transparent 78%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full pt-24 lg:pt-[104px] pb-8 lg:pb-10">
        <div className="shell max-w-[1440px]">
          <div className="grid lg:grid-cols-[minmax(0,0.92fr)_minmax(430px,0.78fr)] xl:grid-cols-[minmax(0,0.9fr)_minmax(560px,0.82fr)] gap-8 xl:gap-14 items-center">
            {/* Copy */}
            <div>
              <div className="inline-flex gap-2 items-center px-3.5 py-2 rounded-full border border-white/60 bg-white/70 backdrop-blur-xl text-[#374151] text-[11px] font-extrabold uppercase tracking-[0.09em] shadow-[0_2px_12px_rgba(0,0,0,.03)]">
                <span className="w-2 h-2 rounded-full bg-[#ED7606] shadow-[0_0_0_6px_rgba(237,118,6,.14)] animate-pulse" />
                B2B damper manufacturer since 2001
              </div>
              <h1 className="max-w-[760px] mt-5 lg:mt-6 mb-5 lg:mb-6 text-[40px] sm:text-[50px] lg:text-[clamp(50px,4.55vw,78px)] 2xl:text-[84px] leading-[0.96] lg:leading-[0.93] tracking-[-0.045em] lg:tracking-[-0.052em] font-black text-[#111827] text-balance">
                Slow down the closing.
                <span className="block mt-1">
                  Keep{" "}
                  <strong className="bg-gradient-to-r from-[#111827] via-[#C85D00] to-[#ED7606] bg-clip-text text-transparent font-black">
                    quiet
                  </strong>{" "}
                  in motion.
                </span>
              </h1>
              <p className="max-w-[760px] text-[#4B5563] text-[16px] lg:text-[clamp(16px,1.05vw,20px)] leading-relaxed">
                Five focused product lines for global OEM, Tier‑1 and industrial assemblies.
                Engineered for stable damping, soft closing and repeatable mass production.
              </p>
              <div className="flex flex-wrap gap-3 mt-7 lg:mt-9">
                <Button href="#products" variant="primary">
                  Explore Products
                </Button>
                <Button
                  href="/contact"
                  variant="outline"
                  className="border-[#ED7606] bg-white text-[#C85D00] shadow-[0_12px_28px_rgba(237,118,6,0.16)] hover:bg-[#FFF7ED] hover:text-[#B45309] hover:shadow-[0_16px_34px_rgba(237,118,6,0.22)]"
                >
                  Send Your Drawing
                </Button>
              </div>
            </div>

            {/* Floating product images */}
            <div className="relative min-h-[480px] xl:min-h-[580px] self-stretch hidden lg:block" aria-hidden>
              {[
                { src: CATEGORIES[0].image, style: "right:8px; top:12px; width:min(460px,74%); height:310px; z-index:3; background:rgba(255,255,255,.88);" },
                { src: CATEGORIES[1].image, style: "left:0; bottom:100px; width:min(310px,50%); height:240px; z-index:2; background:rgba(255,255,255,.85); animation-delay:.45s;" },
                { src: CATEGORIES[3].image, style: "right:0; bottom:16px; width:min(400px,66%); height:220px; z-index:4; background:rgba(255,255,255,.88); animation-delay:.9s;" },
              ].map((f, i) => (
                <figure
                  key={i}
                  className="absolute overflow-hidden rounded-2xl border border-white/70 bg-white shadow-[0_24px_64px_rgba(237,118,6,0.07),0_4px_16px_rgba(0,0,0,0.04)] animate-floaty backdrop-blur-sm"
                  style={parseStyle(f.style)}
                >
                  <Image
                    src={f.src}
                    alt=""
                    fill
                    loading="lazy"
                    className="object-contain p-5"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                </figure>
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mt-10 lg:mt-12">
            {[
              { value: "20+", label: "Years damper expertise" },
              { value: "IATF", label: "16949 + ISO 14001" },
              { value: "Custom", label: "Torque and structure" },
              { value: "80M", label: "Annual capacity" },
            ].map((m) => (
              <div key={m.label} className="relative p-4 lg:p-5 rounded-xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(237,118,6,0.08)] transition-all duration-300">
                <b className="block text-[24px] lg:text-[30px] tracking-[-0.04em] text-[#111827] tabular-nums">{m.value}</b>
                <span className="block mt-1 text-[#6B7280] text-[11px] lg:text-[13px] font-bold">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function parseStyle(styleStr: string): Record<string, string> {
  const obj: Record<string, string> = {};
  styleStr.split(";").forEach((pair) => {
    const [k, v] = pair.split(":").map((s) => s.trim());
    if (k && v) {
      const camelKey = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      obj[camelKey] = v;
    }
  });
  return obj;
}
