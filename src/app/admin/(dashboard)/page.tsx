import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-black text-[#111827] mb-6">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <Link
          href="/admin/inquiries"
          className="p-6 rounded-xl border border-[#E5E7EB] bg-white hover:-translate-y-0.5 hover:border-[#ED7606]/30 hover:shadow-md transition-all duration-300"
        >
          <span className="text-[#ED7606] text-xs font-black uppercase tracking-[0.14em]">Review</span>
          <h2 className="mt-2 text-lg font-extrabold text-[#111827]">Inquiries</h2>
          <p className="mt-1 text-sm text-[#6B7280]">View and manage contact form submissions</p>
        </Link>
        <Link
          href="/admin/analytics"
          className="p-6 rounded-xl border border-[#E5E7EB] bg-white hover:-translate-y-0.5 hover:border-[#ED7606]/30 hover:shadow-md transition-all duration-300"
        >
          <span className="text-[#ED7606] text-xs font-black uppercase tracking-[0.14em]">Track</span>
          <h2 className="mt-2 text-lg font-extrabold text-[#111827]">Analytics</h2>
          <p className="mt-1 text-sm text-[#6B7280]">Page views and user interaction data</p>
        </Link>
        <Link
          href="/admin/media"
          className="p-6 rounded-xl border border-[#E5E7EB] bg-white hover:-translate-y-0.5 hover:border-[#ED7606]/30 hover:shadow-md transition-all duration-300"
        >
          <span className="text-[#ED7606] text-xs font-black uppercase tracking-[0.14em]">Assets</span>
          <h2 className="mt-2 text-lg font-extrabold text-[#111827]">Media</h2>
          <p className="mt-1 text-sm text-[#6B7280]">Upload and manage images and files</p>
        </Link>
      </div>
    </div>
  );
}
