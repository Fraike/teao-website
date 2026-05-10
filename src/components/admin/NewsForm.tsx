"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  initial?: Record<string, unknown>;
  isNew?: boolean;
}

export default function NewsForm({ initial, isNew }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    slug: (initial?.slug as string) || "",
    title: (initial?.title as string) || "",
    summary: (initial?.summary as string) || "",
    content: (initial?.content as string) || "",
    image: (initial?.image as string) || "",
    category: (initial?.category as string) || "company",
    isPublished: initial ? (initial.isPublished !== false) : true,
    publishedAt: (initial?.publishedAt as string) || new Date().toISOString().slice(0, 10),
  });

  const inputClass = "w-full h-10 px-3 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#ED7606] focus:ring-2 focus:ring-[#ED7606]/10";
  const labelClass = "block text-xs font-bold text-[#374151] mb-1";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const url = isNew ? "/api/news" : `/api/news/${initial?.id}`;
    const method = isNew ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/admin/news");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Save failed");
    }
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">{error}</div>}

      <section className="rounded-xl border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-base font-extrabold text-[#111827] mb-5">Article Info</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className={labelClass}>Title *</label>
            <input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className={labelClass}>Slug *</label>
            <input className={inputClass} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="company">Company</option>
              <option value="quality">Quality</option>
              <option value="engineering">Engineering</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Date</label>
            <input className={inputClass} type="date" value={form.publishedAt} onChange={(e) => setForm({ ...form, publishedAt: e.target.value })} />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <input type="checkbox" id="isPublished" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
          <label htmlFor="isPublished" className="text-xs font-bold text-[#374151]">Published</label>
        </div>
        <div className="mt-4">
          <label className={labelClass}>Image URL</label>
          <input className={inputClass} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        </div>
        <div className="mt-4">
          <label className={labelClass}>Summary</label>
          <textarea className={inputClass + " h-20 py-2"} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
        </div>
        <div className="mt-4">
          <label className={labelClass}>Content</label>
          <textarea className={inputClass + " h-48 py-2"} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => router.back()} className="px-6 h-11 rounded-lg border border-[#E5E7EB] text-sm font-bold text-[#374151]">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="px-6 h-11 rounded-lg bg-[#ED7606] text-white text-sm font-bold hover:bg-[#D46900] disabled:opacity-50 transition-colors">
          {saving ? "Saving..." : isNew ? "Create Article" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
