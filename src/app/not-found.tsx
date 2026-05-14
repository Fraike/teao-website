import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-[#F8F9FA]">
      <div className="text-center px-6">
        <p className="text-[#ED7606] text-sm font-black uppercase tracking-[0.2em]">404</p>
        <h1 className="mt-4 text-[clamp(32px,6vw,64px)] leading-[1.05] tracking-[-0.04em] font-black text-[#111827]">
          Page not found
        </h1>
        <p className="mt-4 max-w-[420px] mx-auto text-[#6B7280] text-[15px] leading-relaxed">
          The page you are looking for does not exist or has been moved. Please check the URL or return to the homepage.
        </p>
        <Link
          href="/"
          className="inline-flex mt-8 px-8 py-3.5 rounded-full bg-[#ED7606] text-white text-sm font-bold hover:bg-[#D46900] transition-colors shadow-[0_14px_32px_rgba(237,118,6,.2)]"
        >
          Back to Homepage
        </Link>
      </div>
    </section>
  );
}
