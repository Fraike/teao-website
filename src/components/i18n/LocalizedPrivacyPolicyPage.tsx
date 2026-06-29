import { SITE_CONFIG } from "@/lib/constants";
import type { Locale } from "@/lib/i18n";
import { getPrivacyPolicyCopy } from "@/lib/privacy-policy-i18n";

export function LocalizedPrivacyPolicyPage({ locale }: { locale: Locale }) {
  const copy = getPrivacyPolicyCopy(locale);

  return (
    <section className="section pt-32 bg-[#F8F9FA]">
      <div className="shell">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_10px_36px_rgba(17,24,39,0.05)] lg:p-10">
          <span className="eyebrow">{copy.eyebrow}</span>
          <h1 className="mt-3 text-[clamp(32px,4vw,52px)] font-black leading-[1] tracking-[-0.05em] text-[#111827]">
            {copy.h1}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[#6B7280] lg:text-base">{copy.intro}</p>

          <div className="mt-8 space-y-6">
            {copy.sections.map((section) => (
              <div key={section.title} className="border-t border-[#E5E7EB] pt-5">
                <h2 className="text-lg font-black tracking-[-0.02em] text-[#111827]">{section.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">{section.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-[#FFE3C2] bg-[#FFFAF5] p-5">
            <h2 className="text-base font-black text-[#111827]">{copy.contactTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
              {copy.contactText}{" "}
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
              {copy.download}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
