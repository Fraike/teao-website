import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="relative min-h-[680px] lg:min-h-[min(100svh,820px)] flex items-center text-[#111827] bg-[#F8F9FA] overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 scale-[1.04] animate-hero-drift opacity-30"
          style={{
            background:
              "linear-gradient(90deg, rgba(248,249,250,.96), rgba(248,249,250,.7) 46%, rgba(248,249,250,.15)), linear-gradient(0deg, rgba(248,249,250,.94), rgba(248,249,250,0) 38%), url('/images/Homepage-background-image.webp') center / cover no-repeat, #F8F9FA",
          }}
        />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.035) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "linear-gradient(90deg, #000, transparent 74%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full pt-24 lg:pt-[104px] pb-8 lg:pb-10">
        <div className="shell max-w-[1500px]">
          <div className="grid lg:grid-cols-[minmax(0,0.92fr)_minmax(430px,0.78fr)] xl:grid-cols-[minmax(0,0.9fr)_minmax(560px,0.82fr)] gap-8 xl:gap-14 items-center">
            {/* Copy */}
            <div>
              <div className="inline-flex gap-2 items-center px-3 py-1.5 lg:px-3.5 lg:py-2 rounded-full border border-[#D1D5DB] bg-white/80 text-[#374151] text-[10px] lg:text-xs font-extrabold uppercase tracking-[0.08em] backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ED7606] shadow-[0_0_0_8px_rgba(237,118,6,.12)]" />
                B2B damper manufacturer since 2001
              </div>
              <h1 className="max-w-[760px] mt-4 lg:mt-5 mb-4 lg:mb-5 text-[38px] sm:text-[48px] lg:text-[clamp(48px,4.55vw,76px)] 2xl:text-[82px] leading-[0.98] lg:leading-[0.94] tracking-[-0.045em] lg:tracking-[-0.052em] font-black text-[#111827] text-balance">
                Slow down the closing.
                <span className="block">
                  Keep <strong className="text-[#ED7606] font-inherit">quiet</strong> in motion.
                </span>
              </h1>
              <p className="max-w-[760px] text-[#4B5563] text-[16px] lg:text-[clamp(16px,1.05vw,20px)] leading-relaxed">
                Five focused product lines for global OEM, Tier-1 and industrial assemblies.
                Engineered for stable damping, soft closing and repeatable mass production.
              </p>
              <div className="flex flex-wrap gap-2.5 lg:gap-3 mt-6 lg:mt-8">
                <Button href="#products" variant="primary">
                  Explore Products
                </Button>
                <Button href="/contact" variant="ghost">
                  Send Your Drawing
                </Button>
              </div>
            </div>

            {/* Floating product images */}
            <div className="relative min-h-[470px] xl:min-h-[560px] self-stretch hidden lg:block" aria-hidden>
              {[
                { src: CATEGORIES[0].image, style: "right:16px; top:8px; width:min(440px,72%); height:300px; z-index:2; background:rgba(255,255,255,.95);" },
                { src: CATEGORIES[1].image, style: "left:0; bottom:112px; width:min(300px,48%); height:230px; z-index:3; background:rgba(255,255,255,.92); animation-delay:.45s;" },
                { src: CATEGORIES[3].image, style: "right:0; bottom:20px; width:min(390px,64%); height:210px; z-index:4; background:rgba(255,255,255,.95); animation-delay:.9s;" },
              ].map((f, i) => (
                <figure
                  key={i}
                  className="absolute overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_18px_54px_rgba(17,24,39,.08)] animate-floaty"
                  style={parseStyle(f.style)}
                >
                  <Image
                    src={f.src}
                    alt=""
                    fill
                    loading="lazy"
                    className="object-contain p-4"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                </figure>
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px mt-8 lg:mt-10 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white/80 backdrop-blur-md">
            {[
              { value: "20+", label: "Years damper expertise" },
              { value: "IATF", label: "16949 + ISO 14001" },
              { value: "Custom", label: "Torque and structure" },
              { value: "80M", label: "Annual capacity" },
            ].map((m) => (
              <div key={m.label} className="p-3.5 lg:p-5 bg-white/60">
                <b className="block text-[22px] lg:text-[28px] tracking-[-0.03em] text-[#111827]">{m.value}</b>
                <span className="block mt-0.5 lg:mt-1 text-[#6B7280] text-[11px] lg:text-[13px] font-bold">{m.label}</span>
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
