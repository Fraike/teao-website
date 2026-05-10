"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NewsRow {
  id: number;
  title: string;
  category: string;
  publishedAt: string;
  isPublished: number;
}

export default function NewsListTable({ data }: { data: NewsRow[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    return data.filter((n) => {
      if (search) {
        const q = search.toLowerCase();
        if (!n.title.toLowerCase().includes(q)) return false;
      }
      if (categoryFilter && n.category !== categoryFilter) return false;
      if (statusFilter === "published" && !n.isPublished) return false;
      if (statusFilter === "draft" && n.isPublished) return false;
      return true;
    });
  }, [data, search, categoryFilter, statusFilter]);

  const categories = useMemo(() => {
    const set = new Set(data.map((n) => n.category));
    return Array.from(set).sort();
  }, [data]);

  async function deleteNews(id: number) {
    setDeleting(true);
    await fetch(`/api/news/${id}`, { method: "DELETE" });
    router.refresh();
    setDeleting(false);
  }

  const inputClass = "h-9 px-3 rounded-lg border border-[#E5E7EB] text-xs focus:outline-none focus:border-[#ED7606]";

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          className={inputClass + " w-56"}
          placeholder="Search title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className={inputClass} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select className={inputClass} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <span className="text-xs text-[#9CA3AF] self-center ml-auto">
          {filtered.length} of {data.length} articles
        </span>
      </div>

      <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">
        {filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-[#9CA3AF]">No articles found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#F8F9FA] border-b border-[#E5E7EB]">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-black text-[#9CA3AF] uppercase tracking-[0.08em]">Title</th>
                <th className="text-left px-4 py-3 text-xs font-black text-[#9CA3AF] uppercase tracking-[0.08em]">Category</th>
                <th className="text-left px-4 py-3 text-xs font-black text-[#9CA3AF] uppercase tracking-[0.08em]">Date</th>
                <th className="text-left px-4 py-3 text-xs font-black text-[#9CA3AF] uppercase tracking-[0.08em]">Status</th>
                <th className="text-right px-4 py-3 text-xs font-black text-[#9CA3AF] uppercase tracking-[0.08em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filtered.map((n) => (
                <tr key={n.id} className="hover:bg-[#F8F9FA]">
                  <td className="px-4 py-3 font-bold text-[#374151] max-w-[400px] truncate">{n.title}</td>
                  <td className="px-4 py-3 text-[#6B7280] text-xs capitalize">{n.category}</td>
                  <td className="px-4 py-3 text-[#6B7280] text-xs">{n.publishedAt}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${n.isPublished ? "bg-green-100 text-green-700" : "bg-[#F3F4F6] text-[#9CA3AF]"}`}>
                      {n.isPublished ? "Live" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Link href={`/admin/news/${n.id}`} className="text-[#ED7606] font-bold text-xs hover:underline">
                      Edit
                    </Link>
                    <button onClick={() => { if (confirm("Delete this article?")) deleteNews(n.id); }} disabled={deleting} className="text-red-500 font-bold text-xs hover:underline disabled:opacity-50">
                      Del
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
