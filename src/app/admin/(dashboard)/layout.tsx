import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <nav className="sticky top-0 z-50 h-14 bg-[#111827] text-white flex items-center px-6 gap-6">
        <Link href="/admin" className="font-black text-sm tracking-tight">
          TEAO Admin
        </Link>
        <Link href="/admin/products" className="text-xs text-white/70 hover:text-white transition-colors">
          Products
        </Link>
        <Link href="/admin/news" className="text-xs text-white/70 hover:text-white transition-colors">
          News
        </Link>
        <Link href="/admin/media" className="text-xs text-white/70 hover:text-white transition-colors">
          Media
        </Link>
        <div className="flex-1" />
        <span className="text-xs text-white/50">{session.username}</span>
        <form action="/api/auth/logout" method="POST">
          <button className="text-xs text-white/50 hover:text-white transition-colors">
            Logout
          </button>
        </form>
      </nav>
      <main className="p-6 max-w-6xl mx-auto">{children}</main>
    </div>
  );
}
