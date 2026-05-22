import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { news } from "@/db/schema";
import NewsForm from "@/components/admin/NewsForm";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await db.select().from(news).where(eq(news.id, Number(id))).get();
  if (!article) notFound();

  return (
    <div>
      <h1 className="text-2xl font-black text-[#111827] mb-6">Edit Article</h1>
      <NewsForm initial={{ ...article, isPublished: Boolean(article.isPublished) }} />
    </div>
  );
}
