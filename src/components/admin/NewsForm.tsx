"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "./RichTextEditor";
import MediaPicker from "./MediaPicker";
import { ProductSelector } from "./ProductSelector";
import {
  CalendarDays,
  CheckCircle2,
  Eye,
  FileText,
  ImageIcon,
  LinkIcon,
  Search,
  Sparkles,
} from "lucide-react";

interface Props {
  initial?: Record<string, unknown>;
  isNew?: boolean;
}

const ARTICLE_TYPES = [
  { value: "article", label: "Article" },
  { value: "guide", label: "Guide" },
  { value: "faq", label: "FAQ" },
  { value: "news", label: "News" },
];

interface TranslationRow {
  id: number;
  locale: "ja" | "de";
  translationStatus: string;
  errorMessage?: string | null;
  updatedAt?: string | number | null;
}

export default function NewsForm({ initial, isNew }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [translationRows, setTranslationRows] = useState<TranslationRow[]>([]);
  const [translating, setTranslating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [dirty, setDirty] = useState(false);

  const [form, setForm] = useState({
    slug: (initial?.slug as string) || "",
    title: (initial?.title as string) || "",
    seoTitle: (initial?.seoTitle as string) || "",
    keywords: (initial?.keywords as string) || "",
    summary: (initial?.summary as string) || "",
    content: (initial?.content as string) || "",
    image: (initial?.image as string) || "",
    category: (initial?.category as string) || "company",
    articleType: (initial?.articleType as string) || "article",
    relatedProducts: Array.isArray(initial?.relatedProducts)
      ? (initial.relatedProducts as string[])
      : typeof initial?.relatedProducts === "string"
        ? (() => {
            try { return JSON.parse(initial.relatedProducts as string); } catch { return []; }
          })()
        : [],
    isPublished: initial ? (initial.isPublished !== false) : true,
    publishedAt: (initial?.publishedAt as string) || new Date().toISOString().slice(0, 10),
  });

  async function loadTranslations() {
    if (isNew || !initial?.id) return;
    const res = await fetch(`/api/news/${initial.id}/translations`);
    if (res.ok) {
      setTranslationRows(await res.json());
    }
  }

  useEffect(() => {
    loadTranslations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial?.id, isNew]);

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
      const data = await res.json();
      if (Array.isArray(data.translations)) {
        setTranslationRows(data.translations.map((item: { locale: "ja" | "de"; status: string; error?: string }) => ({
          id: 0,
          locale: item.locale,
          translationStatus: item.status,
          errorMessage: item.error,
        })));
      }
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

  async function handleRetranslate(locale?: "ja" | "de") {
    if (!initial?.id) return;
    setTranslating(true);
    setError("");
    const res = await fetch(`/api/news/${initial.id}/translations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(locale ? { locale } : { locales: ["ja", "de"] }),
    });
    if (res.ok) {
      await loadTranslations();
      setSuccessMsg(locale ? `${locale.toUpperCase()} translation requested` : "Translations requested");
      setTimeout(() => setSuccessMsg(""), 3000);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Translation failed");
    }
    setTranslating(false);
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

  const inputClass =
    "w-full h-10 px-3 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#ED7606] focus:ring-2 focus:ring-[#ED7606]/10";
  const labelClass = "block text-xs font-bold text-[#374151] mb-1";
  const publicUrl = form.slug ? `/news/${form.slug}.html` : "";
  const summaryLength = form.summary.trim().length;
  const titleLength = (form.seoTitle || form.title).trim().length;
  const keywordCount = form.keywords.split(",").map((k) => k.trim()).filter(Boolean).length;
  const contentText = form.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = contentText ? contentText.split(/\s+/).length : 0;
  const heroPreviewImage = form.image.endsWith("/main.webp")
    ? form.image.replace("/main.webp", "/photo_1.webp")
    : form.image;

  return (
    <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">{error}</div>
      )}
      {successMsg && (
        <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-medium">{successMsg}</div>
      )}

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-6 min-w-0">
          {/* Basic Info */}
          <section className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-[0_4px_20px_rgba(17,24,39,0.03)]">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.12em] text-[#ED7606]">
                  <FileText size={14} />
                  Article Setup
                </div>
                <h2 className="mt-1 text-lg font-black tracking-[-0.02em] text-[#111827]">Publishing information</h2>
              </div>
              <span className={`rounded-full px-3 py-1 text-[11px] font-black ${form.isPublished ? "bg-green-50 text-green-700 border border-green-200" : "bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]"}`}>
                {form.isPublished ? "Published" : "Draft"}
              </span>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(220px,0.8fr)]">
              <div>
                <label className={labelClass}>Title *</label>
                <input className={inputClass + " h-12 text-base font-bold"} value={form.title} onChange={(e) => handleTitleChange(e.target.value)} required />
              </div>
              <div>
                <label className={labelClass}>Slug *</label>
                <div className="relative">
                  <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input className={inputClass + " pl-9"} value={form.slug} onChange={(e) => update("slug", e.target.value)} required />
                </div>
                {publicUrl && <div className="mt-1 truncate text-[11px] text-[#9CA3AF]">{publicUrl}</div>}
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Category</label>
                <select className={inputClass} value={form.category} onChange={(e) => update("category", e.target.value)}>
                  <option value="company">Company</option>
                  <option value="quality">Quality</option>
                  <option value="engineering">Engineering</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Article Type</label>
                <select
                  className={inputClass}
                  value={form.articleType}
                  onChange={(e) => update("articleType", e.target.value)}
                >
                  {ARTICLE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Date</label>
                <div className="relative">
                  <CalendarDays size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input className={inputClass + " pl-9"} type="date" value={form.publishedAt} onChange={(e) => update("publishedAt", e.target.value)} />
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-[#E5E7EB] bg-[#F8F9FA] p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => update("isPublished", e.target.checked)}
                  className="w-4 h-4 rounded border-[#E5E7EB] text-[#ED7606] focus:ring-[#ED7606]"
                />
                <span className="text-sm font-bold text-[#374151]">Publish this article on the public site</span>
              </label>
            </div>
          </section>

          {/* SEO + Summary */}
          <section className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-[0_4px_20px_rgba(17,24,39,0.03)]">
            <div className="mb-5 flex items-center gap-2">
              <Search size={16} className="text-[#ED7606]" />
              <h2 className="text-base font-extrabold text-[#111827]">SEO, summary and article context</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>SEO Title</label>
                <input
                  className={inputClass}
                  value={form.seoTitle}
                  onChange={(e) => update("seoTitle", e.target.value)}
                  placeholder="Leave empty to use article title"
                />
                <div className="mt-1 text-[11px] text-[#9CA3AF]">{titleLength}/60 recommended</div>
              </div>
              <div>
                <label className={labelClass}>Keywords</label>
                <input
                  className={inputClass}
                  value={form.keywords}
                  onChange={(e) => update("keywords", e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                />
                <div className="mt-1 text-[11px] text-[#9CA3AF]">{keywordCount} keyword{keywordCount === 1 ? "" : "s"}</div>
              </div>
            </div>

            <div className="mt-4">
              <label className={labelClass}>Summary</label>
              <textarea
                className={inputClass + " h-28 py-3 leading-relaxed"}
                value={form.summary}
                onChange={(e) => update("summary", e.target.value)}
                placeholder="Short public summary shown below the title and in search previews."
              />
              <div className="mt-1 text-[11px] text-[#9CA3AF]">{summaryLength}/160 recommended</div>
            </div>

            <div className="mt-4">
              <label className={labelClass}>Related Products</label>
              <ProductSelector
                selected={form.relatedProducts}
                onChange={(slugs) => update("relatedProducts", slugs)}
              />
            </div>
          </section>

          {/* Hero Image */}
          <section className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-[0_4px_20px_rgba(17,24,39,0.03)]">
            <div className="mb-5 flex items-center gap-2">
              <ImageIcon size={16} className="text-[#ED7606]" />
              <h2 className="text-base font-extrabold text-[#111827]">Article hero image</h2>
            </div>
            <MediaPicker
              value={form.image}
              onChange={(url) => update("image", url)}
              label="Image URL"
              placeholder="/images/news/example.webp"
            />
            <p className="mt-2 text-xs leading-relaxed text-[#6B7280]">
              The public news page uses this as a premium product display. If the URL ends in <code className="rounded bg-[#F3F4F6] px-1 py-0.5">/main.webp</code>, the detail page will prefer <code className="rounded bg-[#F3F4F6] px-1 py-0.5">/photo_1.webp</code> when available.
            </p>
            {form.image && (
              <div className="mt-4 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[radial-gradient(circle_at_24%_20%,rgba(237,118,6,0.10),transparent_34%),linear-gradient(135deg,#FFFFFF_0%,#F4F7FA_100%)] p-4">
                <div className="relative h-56 rounded-xl bg-white/70">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroPreviewImage}
                    alt="Article hero preview"
                    className="h-full w-full object-contain p-4"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = form.image;
                    }}
                  />
                </div>
              </div>
            )}
          </section>

          {/* Content Editor */}
          <section className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-[0_4px_20px_rgba(17,24,39,0.03)]">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#ED7606]" />
                <h2 className="text-base font-extrabold text-[#111827]">Article body</h2>
              </div>
              <span className="text-xs font-bold text-[#9CA3AF]">{wordCount} words</span>
            </div>
            <RichTextEditor
              value={form.content}
              onChange={(html) => update("content", html)}
            />
          </section>
        </div>

        <aside className="space-y-5 2xl:sticky 2xl:top-20 self-start">
          <section className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-[0_8px_32px_rgba(17,24,39,0.05)]">
            <div className="mb-4 flex items-center gap-2">
              <Eye size={16} className="text-[#ED7606]" />
              <h2 className="text-sm font-black text-[#111827]">Public preview</h2>
            </div>
            <div className="rounded-2xl border border-[#E5E7EB] bg-[linear-gradient(180deg,#F8F9FA,#FFFFFF)] p-4">
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#111827] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-white">{form.category}</span>
                <span className="rounded-full border border-[#E5E7EB] bg-white px-2.5 py-1 text-[10px] font-bold text-[#6B7280]">{form.publishedAt}</span>
              </div>
              <h3 className="text-xl font-black leading-[1.03] tracking-[-0.04em] text-[#111827]">
                {form.title || "Article title"}
              </h3>
              <p className="mt-3 line-clamp-4 text-xs leading-relaxed text-[#6B7280]">
                {form.summary || "Article summary will appear here."}
              </p>
            </div>
            {publicUrl && (
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-lg border border-[#E5E7EB] text-xs font-bold text-[#374151] hover:border-[#ED7606] hover:text-[#ED7606]"
              >
                Open public page
              </a>
            )}
          </section>

          {!isNew && (
            <section className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-[0_8px_32px_rgba(17,24,39,0.05)]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.12em] text-[#ED7606]">
                    <Sparkles size={14} />
                    Translations
                  </div>
                  <h2 className="mt-1 text-base font-black tracking-[-0.02em] text-[#111827]">Japanese / German</h2>
                </div>
                <button
                  type="button"
                  onClick={() => handleRetranslate()}
                  disabled={translating}
                  className="rounded-full bg-[#111827] px-3 py-1.5 text-[11px] font-bold text-white disabled:opacity-50"
                >
                  {translating ? "Working..." : "Retranslate"}
                </button>
              </div>
              <div className="space-y-2">
                {(["ja", "de"] as const).map((locale) => {
                  const row = translationRows.find((item) => item.locale === locale);
                  const status = row?.translationStatus || "pending";
                  const ok = status === "translated";
                  const failed = status === "failed";
                  return (
                    <div key={locale} className="rounded-lg border border-[#E5E7EB] bg-[#F8F9FA] p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="text-sm font-black text-[#111827]">{locale === "ja" ? "Japanese" : "German"}</div>
                          <div className={`mt-1 text-[11px] font-bold ${ok ? "text-green-700" : failed ? "text-red-600" : "text-[#6B7280]"}`}>
                            {status}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRetranslate(locale)}
                          disabled={translating}
                          className="rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-[11px] font-bold text-[#374151] hover:border-[#ED7606] hover:text-[#ED7606] disabled:opacity-50"
                        >
                          Retry
                        </button>
                      </div>
                      {row?.errorMessage && (
                        <p className="mt-2 line-clamp-3 text-[11px] leading-relaxed text-red-600">{row.errorMessage}</p>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-[#6B7280]">
                English remains the source. Translations are generated automatically and can be retried without replacing the English article.
              </p>
            </section>
          )}

          <section className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-[0_8px_32px_rgba(17,24,39,0.05)]">
            <h2 className="mb-4 text-sm font-black text-[#111827]">Readiness</h2>
            <StatusItem ok={Boolean(form.title)} label="Title is set" />
            <StatusItem ok={Boolean(form.slug)} label="URL slug is set" />
            <StatusItem ok={summaryLength >= 80 && summaryLength <= 180} label="Summary length is reasonable" />
            <StatusItem ok={Boolean(form.image)} label="Hero image is set" />
            <StatusItem ok={keywordCount >= 2} label="Keywords added" />
            <StatusItem ok={wordCount >= 250} label="Body has enough content" />
          </section>
        </aside>
      </div>

      {/* Actions */}
      <div className="sticky bottom-0 z-20 flex flex-col gap-3 rounded-xl border border-[#E5E7EB] bg-white/92 p-3 shadow-[0_-14px_40px_rgba(17,24,39,0.08)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div>
          {!isNew &&
            (confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-600 font-medium">Are you sure?</span>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={saving}
                  className="px-3 h-9 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 disabled:opacity-50"
                >
                  {saving ? "Deleting..." : "Yes, delete"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 h-9 rounded-lg border border-[#E5E7EB] text-xs font-bold text-[#374151]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 h-10 rounded-lg border border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 transition-colors"
              >
                Delete Article
              </button>
            ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 h-11 rounded-lg border border-[#E5E7EB] text-sm font-bold text-[#374151]"
          >
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
          <button
            type="submit"
            disabled={saving}
            className="px-6 h-11 rounded-lg bg-[#ED7606] text-white text-sm font-bold hover:bg-[#D46900] disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : isNew ? "Create Article" : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}

function StatusItem({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 py-1.5 text-xs font-semibold text-[#374151]">
      <CheckCircle2 size={14} className={ok ? "text-green-600" : "text-[#D1D5DB]"} />
      <span className={ok ? "" : "text-[#9CA3AF]"}>{label}</span>
    </div>
  );
}
