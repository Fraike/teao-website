import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy | TEAO",
  description: "Privacy Policy for TEAO inquiry submissions and business contact information.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

const sections = [
  {
    title: "Information We Collect",
    body: "When you submit an inquiry, we collect the contact and project information you provide, such as name, company, email, phone, country, product interest, annual volume and message contents.",
  },
  {
    title: "How We Use Information",
    body: "We use submitted information to respond to your inquiry, evaluate technical requirements, prepare quotations, coordinate samples and provide engineering or commercial support.",
  },
  {
    title: "Information Sharing",
    body: "We do not sell inquiry information. We may share necessary details with internal sales, engineering, quality or production teams only for project evaluation and customer support.",
  },
  {
    title: "Data Retention",
    body: "Inquiry records may be retained for business follow-up, quotation history, compliance and project management. You may contact us to request correction or deletion where applicable.",
  },
  {
    title: "Security",
    body: "We use reasonable administrative and technical measures to protect inquiry information from unauthorized access, misuse or disclosure.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <section className="section pt-32 bg-[#F8F9FA]">
      <div className="shell">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_10px_36px_rgba(17,24,39,0.05)] lg:p-10">
          <span className="eyebrow">Privacy</span>
          <h1 className="mt-3 text-[clamp(32px,4vw,52px)] font-black leading-[1] tracking-[-0.05em] text-[#111827]">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[#6B7280] lg:text-base">
            This policy explains how TEAO handles information submitted through website inquiry forms.
            Last updated: May 22, 2026.
          </p>

          <div className="mt-8 space-y-6">
            {sections.map((section) => (
              <div key={section.title} className="border-t border-[#E5E7EB] pt-5">
                <h2 className="text-lg font-black tracking-[-0.02em] text-[#111827]">{section.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">{section.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-[#FFE3C2] bg-[#FFFAF5] p-5">
            <h2 className="text-base font-black text-[#111827]">Contact</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
              For privacy questions or requests, contact TEAO at{" "}
              <a href={`mailto:${SITE_CONFIG.email}`} className="font-bold text-[#ED7606] hover:underline">
                {SITE_CONFIG.email}
              </a>
              .
            </p>
            <a
              href="/remark/privacy-policy.txt"
              download
              className="mt-4 inline-flex rounded-full bg-[#ED7606] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#D46900]"
            >
              Download Policy
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
