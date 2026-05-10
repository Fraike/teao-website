import Link from "next/link";
import { db } from "@/db";
import { news } from "@/db/schema";
import { desc } from "drizzle-orm";
import NewsListTable from "@/components/admin/NewsListTable";

export default async function AdminNewsPage() {
  const rows = db.select().from(news).orderBy(desc(news.publishedAt)).all();

  const data = rows.map((n) => ({
    id: n.id,
    title: n.title,
    category: n.category,
    publishedAt: n.publishedAt,
    isPublished: n.isPublished,
  }));

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

      <NewsListTable data={data} />
    </div>
  );
}
