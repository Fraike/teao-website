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
      <nav className="sticky top-0 z-50 h-14 bg-[#111827] text-white flex items-center px-4 sm:px-6 gap-4 sm:gap-6 overflow-x-auto whitespace-nowrap">
        <Link href="/admin" className="font-black text-sm tracking-tight">
          特澳独立站后台
        </Link>
        <Link href="/admin/products" className="text-xs text-white/70 hover:text-white transition-colors">
          商品管理
        </Link>
        <Link href="/admin/news" className="text-xs text-white/70 hover:text-white transition-colors">
          文章管理
        </Link>
        <Link href="/admin/media" className="text-xs text-white/70 hover:text-white transition-colors">
          媒体库
        </Link>
        <Link href="/admin/analytics" className="text-xs text-white/70 hover:text-white transition-colors">
          访问统计
        </Link>
        <Link href="/admin/inquiries" className="text-xs text-white/70 hover:text-white transition-colors">
          询盘管理
        </Link>
        <Link href="/admin/search-console" className="text-xs text-white/70 hover:text-white transition-colors">
          Google 搜索数据
        </Link>
        <Link href="/admin/operations" className="text-xs text-white/70 hover:text-white transition-colors">
          网站运营
        </Link>
        <div className="flex-1" />
        <span className="text-xs text-white/50">{session.username}</span>
        <form action="/api/auth/logout" method="POST">
          <button className="text-xs text-white/50 hover:text-white transition-colors">
            退出登录
          </button>
        </form>
      </nav>
      <main className="w-full max-w-[1760px] mx-auto p-4 sm:p-6 2xl:px-8">{children}</main>
    </div>
  );
}
