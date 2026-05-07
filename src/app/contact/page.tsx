import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { Mail, MapPin, Download, FileText, ChevronDown } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact TEAO | Send Inquiry for Custom Damper Solution",
  description:
    "Contact TEAO engineering team for custom damper solutions. Send your drawing, torque requirements and annual volume for a technical proposal. Download damper usage precautions.",
  keywords: [
    "contact damper manufacturer",
    "damper inquiry",
    "custom damper quotation",
    "damper technical support",
    "TEAO contact",
  ],
  openGraph: {
    title: "Contact TEAO | Send Inquiry for Custom Damper Solution",
    description:
      "Reach TEAO engineering team for damper selection, torque customization and mass production inquiries.",
  },
};

const contactFAQ = [
  {
    q: "How do I request a quotation?",
    a: "Fill out the form on this page with your application details, torque requirements, estimated annual volume and any drawings. Our engineering team will review and respond with a technical proposal within 2-3 working days.",
  },
  {
    q: "What information should I provide to get the fastest quotation?",
    a: "To expedite your quotation, please provide: target torque (N·m) or damping force (N), damping direction (clockwise/counter-clockwise/both), mounting dimensions, operating temperature range, estimated annual volume, and a drawing or sample reference if available.",
  },
  {
    q: "Does TEAO have a minimum order quantity (MOQ)?",
    a: "MOQ depends on the product type and customization level. Standard platform products typically have flexible MOQ. Custom tooling projects require an engineering review. Contact us with your volume target and we will discuss feasible options.",
  },
  {
    q: "Can I request samples before mass production?",
    a: "Yes. TEAO provides prototype and pre-production samples for customer fitment testing and validation. Sample lead time is typically 2-4 weeks depending on complexity. We recommend testing samples in your assembly before confirming mass production specifications.",
  },
  {
    q: "How long does tooling and production take?",
    a: "New tooling typically takes 4-8 weeks. Mass production lead time after tooling qualification is usually 4-6 weeks for initial orders, reducing for repeat orders. Rush schedules may be available — please discuss with our team.",
  },
  {
    q: "Can TEAO customize the torque value for my application?",
    a: "Yes. Custom torque adjustment is one of our core engineering capabilities. We can tune gear damper torque to your exact specification rather than using fixed off-the-shelf values. Provide your torque target and tolerance range for evaluation.",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* ========== Hero ========== */}
      <section className="relative pt-32 lg:pt-40 pb-16 lg:pb-20 bg-[#0a0b0d] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage: "linear-gradient(180deg, #000, transparent 88%)",
          }}
        />
        <div className="absolute w-[460px] h-[460px] -right-[120px] -bottom-[140px] rounded-full border border-[#ED7606]/15 pointer-events-none" />

        <div className="shell relative z-10">
          <div className="grid lg:grid-cols-[1fr_0.7fr] gap-8 lg:gap-14 items-end">
            <div>
              <span className="eyebrow">Contact</span>
              <h1 className="mt-3.5 max-w-[760px] text-[34px] sm:text-[44px] lg:text-[clamp(46px,4vw,58px)] leading-[1.06] tracking-[-0.04em] font-black text-balance">
                Start a project with TEAO engineering.
              </h1>
              <p className="mt-4 text-white/55 text-lg max-w-[580px] leading-relaxed">
                Share your application details, torque target and annual volume. Our team
                will recommend a suitable damper platform or define a custom solution.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="flex items-center gap-3.5 p-4 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-[#ED7606]/30 transition-all duration-300"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ED7606]/15">
                  <Mail size={18} strokeWidth={2} className="text-[#ED7606]" />
                </span>
                <div>
                  <div className="text-xs text-white/45 font-bold">Email</div>
                  <div className="text-sm font-semibold text-white/85">{SITE_CONFIG.email}</div>
                </div>
              </a>
              <div className="flex items-start gap-3.5 p-4 rounded-xl border border-white/10 bg-white/[0.04]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ED7606]/15 mt-0.5">
                  <MapPin size={18} strokeWidth={2} className="text-[#ED7606]" />
                </span>
                <div>
                  <div className="text-xs text-white/45 font-bold">Address</div>
                  <div className="text-sm font-semibold text-white/85 leading-relaxed">{SITE_CONFIG.address}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== Form + Download ========== */}
      <section className="py-16 lg:py-24 bg-[#F7F7F5]">
        <div className="shell">
          <div className="grid lg:grid-cols-[1fr_0.7fr] gap-8 lg:gap-12 max-w-6xl">
            {/* Form */}
            <div className="rounded-2xl border border-[#171717]/8 bg-white p-6 lg:p-8 shadow-[0_18px_50px_rgba(21,25,30,.04)]">
              <h2 className="text-2xl lg:text-3xl font-black tracking-[-0.03em] text-[#171717] mb-6 lg:mb-7">
                Send an inquiry
              </h2>
              <form className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4 lg:gap-5">
                  <div>
                    <label className="block text-[13px] font-bold text-[#171717] mb-1.5">Name *</label>
                    <input type="text" required className="w-full h-11 px-4 rounded-lg border border-[#E5E5E5] bg-white text-[#333] text-sm placeholder:text-[#999] focus:outline-none focus:border-[#ED7606] focus:ring-2 focus:ring-[#ED7606]/10 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#171717] mb-1.5">Company</label>
                    <input type="text" className="w-full h-11 px-4 rounded-lg border border-[#E5E5E5] bg-white text-[#333] text-sm placeholder:text-[#999] focus:outline-none focus:border-[#ED7606] focus:ring-2 focus:ring-[#ED7606]/10 transition-all" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 lg:gap-5">
                  <div>
                    <label className="block text-[13px] font-bold text-[#171717] mb-1.5">Email *</label>
                    <input type="email" required className="w-full h-11 px-4 rounded-lg border border-[#E5E5E5] bg-white text-[#333] text-sm placeholder:text-[#999] focus:outline-none focus:border-[#ED7606] focus:ring-2 focus:ring-[#ED7606]/10 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#171717] mb-1.5">Phone</label>
                    <input type="tel" className="w-full h-11 px-4 rounded-lg border border-[#E5E5E5] bg-white text-[#333] text-sm placeholder:text-[#999] focus:outline-none focus:border-[#ED7606] focus:ring-2 focus:ring-[#ED7606]/10 transition-all" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 lg:gap-5">
                  <div>
                    <label className="block text-[13px] font-bold text-[#171717] mb-1.5">Country</label>
                    <input type="text" className="w-full h-11 px-4 rounded-lg border border-[#E5E5E5] bg-white text-[#333] text-sm placeholder:text-[#999] focus:outline-none focus:border-[#ED7606] focus:ring-2 focus:ring-[#ED7606]/10 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#171717] mb-1.5">Product Interest</label>
                    <select className="w-full h-11 px-4 rounded-lg border border-[#E5E5E5] bg-white text-[#333] text-sm focus:outline-none focus:border-[#ED7606] focus:ring-2 focus:ring-[#ED7606]/10 transition-all">
                      <option value="">Select product...</option>
                      <option value="gear-damper">Gear Damper</option>
                      <option value="cylinder-damper">Cylinder Damper</option>
                      <option value="glove-box-damper">Glove Box Damper</option>
                      <option value="latch">Latch</option>
                      <option value="other">Custom / Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#171717] mb-1.5">Annual Volume</label>
                  <input type="text" placeholder="e.g. 50,000 units/year" className="w-full h-11 px-4 rounded-lg border border-[#E5E5E5] bg-white text-[#333] text-sm placeholder:text-[#999] focus:outline-none focus:border-[#ED7606] focus:ring-2 focus:ring-[#ED7606]/10 transition-all" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#171717] mb-1.5">Message *</label>
                  <textarea required rows={5} placeholder="Describe your application, torque requirements, mounting space and any other relevant details..." className="w-full px-4 py-3 rounded-lg border border-[#E5E5E5] bg-white text-[#333] text-sm placeholder:text-[#999] focus:outline-none focus:border-[#ED7606] focus:ring-2 focus:ring-[#ED7606]/10 transition-all resize-y" />
                </div>
                <button type="submit" className="btn btn-primary px-8 text-base">
                  Send Inquiry →
                </button>
              </form>
            </div>

            {/* Sidebar: Download + Quick Info */}
            <div className="flex flex-col gap-5">
              {/* PDF Download */}
              <a
                href="/remark/阻尼器使用注意事项.pdf"
                download
                className="group relative rounded-2xl overflow-hidden border border-[#ED7606]/25 bg-[#171717] p-6 lg:p-7 text-white hover:-translate-y-1 transition-all duration-300 shadow-[0_18px_48px_rgba(237,118,6,.1)]"
              >
                <div className="absolute inset-0 opacity-8"
                  style={{ background: "radial-gradient(circle at right top, #ED7606, transparent 70%)" }}
                />
                <div className="relative z-10">
                  <div className="flex items-center gap-2.5 mb-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ED7606]/20">
                      <FileText size={20} strokeWidth={1.5} className="text-[#ED7606]" />
                    </span>
                    <span className="text-[#ED7606] text-xs font-black uppercase tracking-[0.14em]">
                      Technical Resource
                    </span>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-black tracking-[-0.03em] leading-tight">
                    Damper Usage Precautions
                  </h3>
                  <p className="mt-2 text-white/50 text-sm leading-relaxed">
                    Download the key handling, installation and storage guidelines for TEAO damper products.
                  </p>
                  <span className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full bg-[#ED7606] text-white text-sm font-bold group-hover:bg-[#D46900] transition-colors shadow-[0_14px_32px_rgba(237,118,6,.25)]">
                    <Download size={16} strokeWidth={2.5} />
                    Download PDF
                  </span>
                </div>
              </a>

              {/* Quick info card */}
              <div className="rounded-2xl border border-[#171717]/8 bg-white p-6 lg:p-7 shadow-[0_18px_50px_rgba(21,25,30,.04)]">
                <h3 className="text-lg font-black tracking-[-0.02em] text-[#171717] mb-4">
                  What happens next?
                </h3>
                <ol className="space-y-3">
                  {[
                    "Our team reviews your inquiry within 24 hours.",
                    "Engineering evaluates feasibility against your requirements.",
                    "We send a technical proposal with specifications, pricing and lead time.",
                    "Sample validation before mass production if needed.",
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#555]">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F5F5F5] text-[#ED7606] text-xs font-black mt-0.5">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section className="py-16 lg:py-24 bg-[#171717] text-white">
        <div className="shell">
          <div className="text-center mb-8 lg:mb-12">
            <span className="eyebrow">FAQ</span>
            <h2 className="mt-2.5 lg:mt-3.5 text-[28px] sm:text-[34px] lg:text-[clamp(34px,4vw,52px)] leading-[1.02] tracking-[-0.04em] font-extrabold">
              Frequently asked questions.
            </h2>
            <p className="mt-3 text-white/45 text-[15px] lg:text-[17px] max-w-[560px] mx-auto">
              Common questions about inquiry process, customization, samples and production.
            </p>
          </div>

          <div className="max-w-3xl mx-auto divide-y divide-white/8">
            {contactFAQ.map((item, i) => (
              <details key={i} className="group">
                <summary className="flex items-center justify-between gap-4 py-5 cursor-pointer list-none">
                  <span className="text-base lg:text-lg font-bold text-white/85 group-open:text-white pr-4">
                    {item.q}
                  </span>
                  <ChevronDown size={18} className="shrink-0 text-white/35 group-open:rotate-180 transition-transform duration-200" />
                </summary>
                <p className="pb-5 text-white/55 text-sm lg:text-[15px] leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
