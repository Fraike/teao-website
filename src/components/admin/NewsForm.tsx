"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
  initial?: Record<string, unknown>;
  isNew?: boolean;
}

export default function NewsForm({ initial, isNew }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [dirty, setDirty] = useState(false);

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

  // Unsaved changes warning
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  function update(field: string, value: unknown) {
    setDirty(true);
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleTitleChange(val: string) {
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setForm((prev) => ({ ...prev, title: val, slug: prev.slug || slug }));
    setDirty(true);
  }

  const inputClass = "w-full h-10 px-3 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#ED7606] focus:ring-2 focus:ring-[#ED7606]/10";
  const labelClass = "block text-xs font-bold text-[#374151] mb-1";

  async function handleSubmit(e: React.FormEvent, redirectAfter = true) {
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
      setDirty(false);
      setSuccessMsg(isNew ? "Article created" : "Changes saved");
      setTimeout(() => setSuccessMsg(""), 3000);
      if (redirectAfter) {
        router.push("/admin/news");
        router.refresh();
      }
    } else {
      const data = await res.json();
      setError(data.error || "Save failed");
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setSaving(true);
    const res = await fetch(`/api/news/${initial?.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/news");
      router.refresh();
    } else {
      setError("Delete failed");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-6">
      {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">{error}</div>}
      {successMsg && <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-medium">{successMsg}</div>}

      <section className="rounded-xl border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-base font-extrabold text-[#111827] mb-5">Article Info</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className={labelClass}>Title *</label>
            <input className={inputClass} value={form.title} onChange={(e) => handleTitleChange(e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Slug *</label>
            <input className={inputClass} value={form.slug} onChange={(e) => update("slug", e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <select className={inputClass} value={form.category} onChange={(e) => update("category", e.target.value)}>
              <option value="company">Company</option>
              <option value="quality">Quality</option>
              <option value="engineering">Engineering</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Date</label>
            <input className={inputClass} type="date" value={form.publishedAt} onChange={(e) => update("publishedAt", e.target.value)} />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <input type="checkbox" id="isPublished" checked={form.isPublished} onChange={(e) => update("isPublished", e.target.checked)} />
          <label htmlFor="isPublished" className="text-xs font-bold text-[#374151]">Published</label>
        </div>
        <div className="mt-4">
          <label className={labelClass}>Image URL</label>
          <input className={inputClass} value={form.image} onChange={(e) => update("image", e.target.value)} />
          {form.image && (
            <div className="mt-2 relative w-32 h-20 rounded-lg border border-[#E5E7EB] overflow-hidden bg-[#F8F9FA]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
          )}
        </div>
        <div className="mt-4">
          <label className={labelClass}>Summary</label>
          <textarea className={inputClass + " h-20 py-2"} value={form.summary} onChange={(e) => update("summary", e.target.value)} />
        </div>
        <div className="mt-4">
          <label className={labelClass}>Content</label>
          <textarea className={inputClass + " h-48 py-2"} value={form.content} onChange={(e) => update("content", e.target.value)} />
        </div>
      </section>

      <div className="flex justify-between items-center">
        <div>
          {!isNew && (
            confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-600 font-medium">Are you sure?</span>
                <button type="button" onClick={handleDelete} disabled={saving} className="px-3 h-9 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 disabled:opacity-50">
                  {saving ? "Deleting..." : "Yes, delete"}
                </button>
                <button type="button" onClick={() => setConfirmDelete(false)} className="px-3 h-9 rounded-lg border border-[#E5E7EB] text-xs font-bold text-[#374151]">
                  Cancel
                </button>
              </div>
            ) : (
              <button type="button" onClick={handleDelete} className="px-4 h-10 rounded-lg border border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 transition-colors">
                Delete Article
              </button>
            )
          )}
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()} className="px-6 h-11 rounded-lg border border-[#E5E7EB] text-sm font-bold text-[#374151]">
            Cancel
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e as unknown as React.FormEvent, false)}
            disabled={saving}
            className="px-6 h-11 rounded-lg border border-[#ED7606] text-[#ED7606] text-sm font-bold hover:bg-[#FFF1E3] disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : "Save & Continue"}
          </button>
          <button type="submit" disabled={saving} className="px-6 h-11 rounded-lg bg-[#ED7606] text-white text-sm font-bold hover:bg-[#D46900] disabled:opacity-50 transition-colors">
            {saving ? "Saving..." : isNew ? "Create Article" : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}
