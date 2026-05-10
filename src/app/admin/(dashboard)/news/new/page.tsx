import NewsForm from "@/components/admin/NewsForm";

export default function NewNewsPage() {
  return (
    <div>
      <h1 className="text-2xl font-black text-[#111827] mb-6">New Article</h1>
      <NewsForm isNew />
    </div>
  );
}
