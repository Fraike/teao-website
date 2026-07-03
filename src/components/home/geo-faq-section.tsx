import Link from "next/link";
import { CarFront, FileText, Gauge, Volume2 } from "lucide-react";
import type { SiteLocale } from "@/lib/i18n-ui";
import { withLocale } from "@/lib/i18n";
import { getHomeCopy } from "@/lib/home-i18n";

const ANSWER_ICONS = [CarFront, Volume2, Gauge, FileText];

export function GeoFaqSection({ locale = "en" }: { locale?: SiteLocale }) {
  const copy = getHomeCopy(locale).geoFaq;

  return (
    <section className="bg-white py-12 lg:py-14" id="engineering-answers">
      <div className="shell">
        <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#FAF9F6] shadow-[0_18px_50px_rgba(17,24,39,0.04)]">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,0.72fr)_minmax(420px,0.88fr)]">
            <div className="min-w-0">
              <div className="h-full p-5 lg:p-7">
                <span className="eyebrow text-[10px]">{copy.eyebrow}</span>
                <h2 className="mt-2 max-w-[620px] text-[24px] font-extrabold leading-[1.08] tracking-[-0.035em] text-[#111827] sm:text-[28px] lg:text-[34px]">
                  {copy.title}
                </h2>
                <p className="mt-3 max-w-[620px] text-sm leading-6 text-[#4B5563] lg:text-[15px]">
                  {copy.shortAnswer}
                </p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <Link href={withLocale("/applications/automotive", locale)} className="btn btn-primary">
                    {copy.applicationsCta}
                  </Link>
                  <Link href={withLocale("/contact", locale)} className="btn btn-outline">
                    {copy.contactCta}
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid border-t border-[#E5E7EB] bg-white sm:grid-cols-2 lg:border-l lg:border-t-0">
              {copy.questions.map((item, i) => {
                const Icon = ANSWER_ICONS[i] || Gauge;
                return (
                  <article key={item.q} className="min-h-[132px] border-b border-[#E5E7EB] p-4 last:border-b-0 sm:odd:border-r sm:[&:nth-last-child(-n+2)]:border-b-0 lg:p-5">
                    <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF1E3] text-[#ED7606] shadow-[0_10px_24px_rgba(237,118,6,0.10)]">
                      <Icon size={18} strokeWidth={2.2} />
                    </span>
                    <h3 className="text-[13px] font-extrabold leading-snug text-[#111827] lg:text-sm">
                      {shortenQuestion(item.q)}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-[12px] leading-5 text-[#6B7280] lg:text-[13px]">
                      {summarizeAnswer(item.a)}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function shortenQuestion(question: string) {
  return question
    .replace("What information is needed for a custom damper quotation?", "Quotation data")
    .replace("What is the difference between a gear damper and an axial damper?", "Damper type")
    .replace("Why are dampers important in modern electric vehicles?", "Quiet EV interiors")
    .replace("What does TEAO manufacture?", "TEAO products");
}

function summarizeAnswer(answer: string) {
  const sentence = answer.split(".")[0]?.trim();
  return sentence ? `${sentence}.` : answer;
}
