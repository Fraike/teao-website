import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/constants";
import { JsonLdScript, faqPageSchema } from "@/lib/structured-data";
import { Mail, MapPin, Download, FileText, ChevronDown } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";

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
    images: [{ url: "/images/logo-color.webp", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact TEAO | Custom Damper Inquiry",
    description:
      "Reach TEAO engineering team for damper selection, torque customization and mass production inquiries.",
    images: ["/images/logo-color.webp"],
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
    a: "Yes. TEAO provides prototype and pre-production samples for customer fitment testing and validation. Sample lead time is typically 2-4 weeks depending on complexity.",
  },
  {
    q: "How long does tooling and production take?",
    a: "New tooling typically takes 4-8 weeks. Mass production lead time after tooling qualification is usually 4-6 weeks for initial orders, reducing for repeat orders.",
  },
  {
    q: "Can TEAO customize the torque value for my application?",
    a: "Yes. Custom torque adjustment is one of our core engineering capabilities. Provide your torque target and tolerance range for evaluation.",
  },
];

export default function ContactPage() {
  const contactFaqLd = faqPageSchema(contactFAQ);

  return (
    <>
      <JsonLdScript data={contactFaqLd} />
      {/* ========== Hero ========== */}
      <section className="relative pt-32 lg:pt-40 pb-16 lg:pb-20 bg-[#F8F9FA] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.03) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage: "linear-gradient(180deg, #000, transparent 88%)",
          }}
        />
        <div className="absolute w-[460px] h-[460px] -right-[120px] -bottom-[140px] rounded-full border border-[#ED7606]/12 pointer-events-none" />

        <div className="shell relative z-10">
          <div className="mx-auto grid max-w-6xl items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.86fr)] lg:gap-12">
            <div className="pt-1 lg:pt-2">
              <span className="eyebrow">Contact</span>
              <h1 className="mt-3.5 max-w-[620px] text-[clamp(32px,3.45vw,50px)] leading-[0.98] tracking-[-0.045em] font-black text-[#111827]">
                Start a project with TEAO engineering.
              </h1>
              <p className="mt-4 max-w-[560px] text-base leading-relaxed text-[#6B7280] lg:text-[17px]">
                Share your application details, torque target and annual volume. Our team will
                recommend a suitable damper platform or define a custom solution.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_14px_40px_rgba(17,24,39,0.05)] lg:p-6">
              <div className="mb-5">
                <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#ED7606]">
                  Direct contact
                </div>
                <h2 className="mt-1.5 text-xl font-black tracking-[-0.03em] text-[#111827]">
                  Engineering & commercial support
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
                  Reach TEAO for drawings, samples, quotation and project review.
                </p>
              </div>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="flex items-start gap-3.5 rounded-xl border border-[#E5E7EB] bg-[#F8F9FA] p-4 transition-all duration-300 hover:border-[#ED7606]/30 hover:bg-white hover:shadow-md"
              >
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ED7606]/10">
                  <Mail size={18} strokeWidth={2} className="text-[#ED7606]" />
                </span>
                <div className="min-w-0">
                  <div className="text-[11px] font-black uppercase tracking-[0.12em] text-[#9CA3AF]">Email</div>
                  <div className="mt-1 break-all text-sm font-semibold leading-relaxed text-[#374151]">{SITE_CONFIG.email}</div>
                </div>
              </a>
              <div className="mt-3 flex items-start gap-3.5 rounded-xl border border-[#E5E7EB] bg-[#F8F9FA] p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ED7606]/10 mt-0.5">
                  <MapPin size={18} strokeWidth={2} className="text-[#ED7606]" />
                </span>
                <div className="min-w-0">
                  <div className="text-[11px] font-black uppercase tracking-[0.12em] text-[#9CA3AF]">Address</div>
                  <div className="mt-1 text-sm font-semibold text-[#374151] leading-relaxed">{SITE_CONFIG.address}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== Form + Download ========== */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="shell">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.78fr)] lg:gap-10 max-w-6xl">
            {/* Form */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 lg:p-8 shadow-[0_4px_24px_rgba(0,0,0,.03)]">
              <h2 className="text-2xl lg:text-3xl font-black tracking-[-0.03em] text-[#111827] mb-6 lg:mb-7">
                Send an inquiry
              </h2>
              <Suspense fallback={<div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 lg:p-8 animate-pulse"><div className="h-96 bg-[#F8F9FA] rounded-lg" /></div>}>
                <ContactForm />
              </Suspense>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-5 lg:pt-[76px]">
              {/* PDF Download */}
              <a
                href="/remark/damper-usage-notes.pdf"
                download
                className="group relative overflow-hidden rounded-2xl border border-[#ED7606]/20 bg-gradient-to-br from-[#111827] to-[#1F2937] text-white shadow-[0_8px_32px_rgba(237,118,6,.08)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[16/9] border-b border-white/10">
                  <Image
                    src="/images/company/contactUs.webp"
                    alt="TEAO business communication and customer support"
                    fill
                    className="object-cover opacity-90"
                    sizes="(max-width: 1024px) 100vw, 420px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/20 to-transparent" />
                  <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#ED7606] shadow-sm">
                    B2B Engineering Support
                  </div>
                </div>
                <div className="relative z-10 p-6 lg:p-7">
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

              {/* Quick info */}
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 lg:p-7 shadow-[0_4px_24px_rgba(0,0,0,.03)]">
                <h3 className="text-lg font-black tracking-[-0.02em] text-[#111827] mb-4">
                  What happens next?
                </h3>
                <ol className="space-y-3">
                  {[
                    "Our team reviews your inquiry within 24 hours.",
                    "Engineering evaluates feasibility against your requirements.",
                    "We send a technical proposal with specifications, pricing and lead time.",
                    "Sample validation before mass production if needed.",
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#6B7280]">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F0F2F5] text-[#ED7606] text-xs font-black mt-0.5">
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
      <section className="py-16 lg:py-24 bg-[#F0F2F5]">
        <div className="shell">
          <div className="text-center mb-8 lg:mb-12">
            <span className="eyebrow">FAQ</span>
            <h2 className="mt-2.5 lg:mt-3.5 text-[26px] sm:text-[30px] lg:text-[clamp(30px,3.6vw,46px)] leading-[1.02] tracking-[-0.04em] font-extrabold text-[#111827]">
              Frequently asked questions.
            </h2>
            <p className="mt-3 text-[#6B7280] text-[15px] lg:text-[17px] max-w-[560px] mx-auto">
              Common questions about inquiry process, customization, samples and production.
            </p>
          </div>

          <div className="max-w-3xl mx-auto divide-y divide-[#E5E7EB]">
            {contactFAQ.map((item, i) => (
              <details key={i} className="group">
                <summary className="flex items-center justify-between gap-4 py-5 cursor-pointer list-none">
                  <span className="text-base lg:text-lg font-bold text-[#374151] group-open:text-[#111827] pr-4">
                    {item.q}
                  </span>
                  <ChevronDown size={18} className="shrink-0 text-[#9CA3AF] group-open:rotate-180 transition-transform duration-200" />
                </summary>
                <p className="pb-5 text-[#6B7280] text-sm lg:text-[15px] leading-relaxed">
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
