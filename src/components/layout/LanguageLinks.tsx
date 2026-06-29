import Link from "next/link";
import { getAlternateUrls, LOCALE_LABELS } from "@/lib/i18n";

export function LanguageLinks({ path }: { path: string }) {
  const urls = getAlternateUrls(path);
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#6B7280]">
      <span className="text-[#9CA3AF]">Language</span>
      {(["en", "ja", "de"] as const).map((locale) => (
        <Link
          key={locale}
          href={urls[locale]}
          className="rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 hover:border-[#ED7606] hover:text-[#ED7606]"
        >
          {LOCALE_LABELS[locale]}
        </Link>
      ))}
    </div>
  );
}
