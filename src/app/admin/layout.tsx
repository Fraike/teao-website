import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "特澳独立站后台",
  description: "特澳独立站管理系统",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div lang="zh-CN">{children}</div>;
}
