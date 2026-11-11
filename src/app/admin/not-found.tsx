import Link from "next/link";

export default function AdminNotFound() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <h1 className="text-xl font-bold">找不到此页面或记录</h1>
      <Link href="/admin" className="mt-3 inline-block font-medium text-[#a94311] underline">返回后台首页</Link>
    </section>
  );
}
