import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-black text-[#111827] mb-6">Dashboard</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/admin/products"
          className="p-6 rounded-xl border border-[#E5E7EB] bg-white hover:-translate-y-0.5 hover:border-[#ED7606]/30 hover:shadow-md transition-all duration-300"
        >
          <span className="text-[#ED7606] text-xs font-black uppercase tracking-[0.14em]">Manage</span>
          <h2 className="mt-2 text-lg font-extrabold text-[#111827]">Products</h2>
          <p className="mt-1 text-sm text-[#6B7280]">Add, edit or remove product listings</p>
        </Link>
        <Link
          href="/admin/news"
          className="p-6 rounded-xl border border-[#E5E7EB] bg-white hover:-translate-y-0.5 hover:border-[#ED7606]/30 hover:shadow-md transition-all duration-300"
        >
          <span className="text-[#ED7606] text-xs font-black uppercase tracking-[0.14em]">Publish</span>
          <h2 className="mt-2 text-lg font-extrabold text-[#111827]">News</h2>
          <p className="mt-1 text-sm text-[#6B7280]">Manage news articles</p>
        </Link>
      </div>
    </div>
  );
}
