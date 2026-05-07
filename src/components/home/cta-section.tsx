import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import { Reveal } from "@/components/ui/reveal";

export function CTASection() {
  return (
    <section
      className="relative py-24 text-white overflow-hidden"
      style={{
        background: "linear-gradient(90deg, rgba(17,19,21,.96), rgba(17,19,21,.68)), url('/images/company/factory-entrance.jpg') center / cover no-repeat",
      }}
      id="contact"
    >
      {/* Decorative ring */}
      <div className="absolute w-[440px] h-[440px] -right-[110px] -top-[130px] rounded-full border border-[#ED7606]/25 pointer-events-none" />

      <div className="shell relative z-10">
        <div className="grid lg:grid-cols-[minmax(0,0.8fr)_minmax(320px,0.42fr)] gap-12 items-end">
          <Reveal>
            <span className="eyebrow">Start a Project</span>
            <h2 className="mt-3.5 max-w-[790px] text-[clamp(42px,5vw,78px)] leading-[0.92] tracking-[-0.06em] font-black">
              Share the application. Get a practical damper proposal.
            </h2>
            <p className="mt-4 text-white/65 text-lg max-w-[600px]">
              Tell us the space envelope, target torque, annual volume and validation needs.
              TEAO will match an existing platform or define a custom structure for review.
            </p>
          </Reveal>

          <aside className="p-6 rounded-lg border border-white/15 bg-white/8 backdrop-blur-xl">
            <h3 className="text-white text-xl font-extrabold leading-tight">
              Technical quotation contact
            </h3>
            <p className="mt-2 mb-3 text-white/60 text-sm leading-5">
              Send drawings, samples or application notes. Our team will confirm feasibility and next steps.
            </p>
            <Link href={`mailto:${SITE_CONFIG.email}`} className="block py-3 border-b border-white/10 text-white/75 text-sm hover:text-white transition-colors">
              {SITE_CONFIG.email}
            </Link>
            <Link href="/contact" className="block py-3 text-[#FF9A3C] font-extrabold border-b-0">
              Request quotation →
            </Link>
            <div className="flex flex-wrap gap-2.5 mt-4">
              {[
                { label: "LinkedIn", href: SITE_CONFIG.social.linkedin },
                { label: "YouTube", href: SITE_CONFIG.social.youtube },
                { label: "Facebook", href: SITE_CONFIG.social.facebook },
                { label: "Alibaba", href: SITE_CONFIG.social.alibaba },
              ].map((s) => (
                <Link key={s.label} href={s.href} className="w-[calc(50%-5px)] py-2.5 px-3 flex justify-center rounded-full border border-white/12 text-white/75 text-[13px] font-extrabold hover:bg-white/10 transition-colors">
                  {s.label}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
