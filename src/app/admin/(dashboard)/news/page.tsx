import Link from "next/link";
import { db } from "@/db";
import { news } from "@/db/schema";
import { desc } from "drizzle-orm";

export default async function AdminNewsPage() {
  const rows = db.select().from(news).orderBy(desc(news.publishedAt)).all();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-[#111827]">News</h1>
        <Link
          href="/admin/news/new"
          className="px-4 h-10 inline-flex items-center rounded-lg bg-[#ED7606] text-white text-sm font-bold hover:bg-[#D46900] transition-colors"
        >
          + Add Article
        </Link>
      </div>

      <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">
        {rows.length === 0 ? (
          <p className="p-8 text-center text-sm text-[#9CA3AF]">No articles yet.</p>
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
              {rows.map((n) => (
                <tr key={n.id} className="hover:bg-[#F8F9FA]">
                  <td className="px-4 py-3 font-bold text-[#374151] max-w-[400px] truncate">{n.title}</td>
                  <td className="px-4 py-3 text-[#6B7280] text-xs capitalize">{n.category}</td>
                  <td className="px-4 py-3 text-[#6B7280] text-xs">{n.publishedAt}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${n.isPublished ? "bg-green-100 text-green-700" : "bg-[#F3F4F6] text-[#9CA3AF]"}`}>
                      {n.isPublished ? "Live" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/news/${n.id}`} className="text-[#ED7606] font-bold text-xs hover:underline">
                      Edit
                    </Link>
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
