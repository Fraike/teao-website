"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const PRESET_SCENARIOS = [
  { image: "/images/applications/applications-gif/Center console lid.gif", label: "Center Console" },
  { image: "/images/applications/applications-gif/Glove box.gif", label: "Glove Box" },
  { image: "/images/applications/applications-gif/Door handle.gif", label: "Door Handle" },
  { image: "/images/applications/applications-gif/cup holder.gif", label: "Cup Holder" },
  { image: "/images/applications/applications-gif/glasses box.gif", label: "Glasses Box" },
  { image: "/images/applications/applications-gif/ashtray.gif", label: "Ashtray" },
  { image: "/images/applications/applications-gif/outlet cover.gif", label: "Outlet Cover" },
  { image: "/images/applications/applications-gif/safty handle.gif", label: "Safety Handle" },
  { image: "/images/applications/applications-gif/toilet lid.gif", label: "Toilet Lid" },
];

type ProductData = Record<string, unknown>;

interface Props {
  initial?: ProductData;
  isNew?: boolean;
}

export default function ProductForm({ initial, isNew }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [dirty, setDirty] = useState(false);

  const [form, setForm] = useState({
    slug: (initial?.slug as string) || "",
    model: (initial?.model as string) || "",
    name: (initial?.name as string) || "",
    category: (initial?.category as string) || "gear-damper",
    series: (initial?.series as string) || "",
    subType: (initial?.subType as string) || "",
    variant: (initial?.variant as string) || "",
    summary: (initial?.summary as string) || "",
    description: (initial?.description as string) || "",
    image: (initial?.image as string) || "",
    images: (initial?.images as { url: string; alt?: string }[]) || [],
    specifications: (initial?.specifications as Record<string, string>) || {},
    techParams: (initial?.techParams as Record<string, string | number>) || {},
    torque: (initial?.torque as { min: number; max: number; unit: string } | null) || null,
    durability: (initial?.durability as { temperature?: string; test_method?: string; cycles?: number; cycles_unit?: string } | null) || null,
    hardTorque: (initial?.hardTorque as string) || "",
    hardForce: (initial?.hardForce as string) || "",
    soundType: (initial?.soundType as string) || (initial?.sound_type as string) || "",
    forceRange: (initial?.forceRange as string) || "",
    materials: (initial?.materials as { part: string; material: string }[]) || [],
    characteristics: (initial?.characteristics as string[]) || [],
    applications: (initial?.applications as string[]) || [],
    applicationScenarios: (initial?.applicationScenarios as { image: string; label: string }[]) || [],
    assemblyMethod: (initial?.assemblyMethod as string) || "",
    bufferDirection: (initial?.bufferDirection as string) || "",
    dimensionDrawing: (initial?.dimensionDrawing as string) || "",
    performanceCharts: (initial?.performanceCharts as Record<string, string>) || {},
    seoTitle: (initial?.seoTitle as string) || "",
    seoDescription: (initial?.seoDescription as string) || "",
    tags: (initial?.tags as string[]) || [],
    isActive: initial ? (initial.isActive !== false) : true,
    sortOrder: (initial?.sortOrder as number) || 0,
  });

  const [specKey, setSpecKey] = useState("");
  const [specVal, setSpecVal] = useState("");
  const [techKey, setTechKey] = useState("");
  const [techVal, setTechVal] = useState("");
  const [matPart, setMatPart] = useState("");
  const [matMaterial, setMatMaterial] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [appInput, setAppInput] = useState("");
  const [charInput, setCharInput] = useState("");
  const [galleryUrl, setGalleryUrl] = useState("");
  const [galleryAlt, setGalleryAlt] = useState("");
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [editingGalleryIdx, setEditingGalleryIdx] = useState<number | null>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

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

  const set = useCallback((field: string, value: unknown) => {
    setDirty(true);
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Auto-generate slug from model
  const handleModelChange = useCallback((val: string) => {
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setForm((prev) => ({ ...prev, model: val, slug: prev.slug || slug }));
    setDirty(true);
  }, []);

  async function compressImage(file: File, maxW = 1920, maxH = 1920, quality = 0.8): Promise<File> {
    if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") return file;
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        let { width, height } = img;
        if (width <= maxW && height <= maxH && file.size < 400 * 1024) return resolve(file);
        if (width > maxW) { height = Math.round(height * (maxW / width)); width = maxW; }
        if (height > maxH) { width = Math.round(width * (maxH / height)); height = maxH; }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (!blob) return resolve(file);
          const compressed = new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" });
          resolve(compressed);
        }, "image/jpeg", quality);
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
      img.src = url;
    });
  }

  async function uploadImage(file: File) {
    const compressed = await compressImage(file);
    const fd = new FormData();
    fd.append("file", compressed);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url as string;
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      set("image", url);
      setSuccessMsg("Image uploaded successfully");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch {
      setError("Image upload failed");
    }
  }

  async function handleSubmit(e: React.FormEvent, redirectAfter = true) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      tags: form.tags,
      isActive: form.isActive ? 1 : 0,
    };

    const url = isNew ? "/api/products" : `/api/products/${initial?.id}`;
    const method = isNew ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setDirty(false);
      setSuccessMsg(isNew ? "Product created" : "Changes saved");
      setTimeout(() => setSuccessMsg(""), 3000);
      if (redirectAfter) {
        router.push("/admin/products");
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
    const res = await fetch(`/api/products/${initial?.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      setError("Delete failed");
      setSaving(false);
    }
  }

  // Gallery: move image up/down
  function moveGalleryImage(index: number, dir: -1 | 1) {
    const next = [...form.images];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    set("images", next);
  }

  const inputClass = "w-full h-10 px-3 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#ED7606] focus:ring-2 focus:ring-[#ED7606]/10";
  const labelClass = "block text-xs font-bold text-[#374151] mb-1";

  return (
    <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-8">
      {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">{error}</div>}
      {successMsg && <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-medium">{successMsg}</div>}

      {/* Basic Info */}
      <section className="rounded-xl border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-base font-extrabold text-[#111827] mb-5">Basic Information</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className={labelClass}>Model *</label>
            <input className={inputClass} value={form.model} onChange={(e) => handleModelChange(e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Slug *</label>
            <input className={inputClass} value={form.slug} onChange={(e) => set("slug", e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Category *</label>
            <select className={inputClass} value={form.category} onChange={(e) => {
              const cat = e.target.value;
              set("category", cat);
              if (cat === "latch") {
                if (!form.soundType) set("soundType", "audible");
                if (!form.hardForce) set("hardForce", "6");
              }
            }}>
              <option value="gear-damper">Gear Damper</option>
              <option value="axial-damper">Axial Damper</option>
              <option value="glove-box-damper">Glove Box Damper</option>
              <option value="latch">Latch</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Sort Order</label>
            <input className={inputClass} type="number" value={form.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value))} />
          </div>
          <div>
            <label className={labelClass}>Series</label>
            <input className={inputClass} value={form.series} onChange={(e) => set("series", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Sub Type</label>
            <select className={inputClass} value={form.subType} onChange={(e) => set("subType", e.target.value)}>
              <option value="">None</option>
              <option value="individual">Individual</option>
              <option value="series">Series</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Variant</label>
            <input className={inputClass} value={form.variant} onChange={(e) => set("variant", e.target.value)} />
          </div>
          <div className="flex items-center gap-2 pt-5">
            <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} />
            <label htmlFor="isActive" className="text-xs font-bold text-[#374151]">Active</label>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className={labelClass}>Name *</label>
            <input className={inputClass} value={form.name} onChange={(e) => set("name", e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Assembly Method</label>
            <input className={inputClass} value={form.assemblyMethod} onChange={(e) => set("assemblyMethod", e.target.value)} placeholder="e.g. Screw Fixing" />
          </div>
        </div>
        <div className="mt-4">
          <label className={labelClass}>Summary</label>
          <textarea className={inputClass + " h-16 py-2"} value={form.summary} onChange={(e) => set("summary", e.target.value)} />
        </div>
        <div className="mt-4">
          <label className={labelClass}>Description</label>
          <textarea className={inputClass + " h-24 py-2"} value={form.description} onChange={(e) => set("description", e.target.value)} />
        </div>
      </section>

      {/* Images */}
      <section className="rounded-xl border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-base font-extrabold text-[#111827] mb-5">Images</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Main Image</label>
            <div className="flex gap-2 items-start">
              <div className="flex-1">
                <input className={inputClass} value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="URL or /uploads/..." />
              </div>
              <label className="shrink-0 px-3 h-10 rounded-lg border border-[#E5E7EB] text-xs font-bold text-[#374151] flex items-center cursor-pointer hover:bg-[#F8F9FA]">
                Upload
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
              {form.image && (
                <button type="button" onClick={() => set("image", "")} className="shrink-0 w-8 h-10 rounded-lg border border-red-200 text-red-500 text-sm font-bold hover:bg-red-50">&times;</button>
              )}
            </div>
            {form.image && (
              <div className="mt-2 relative w-32 h-32 rounded-lg border border-[#E5E7EB] overflow-hidden bg-[#F8F9FA]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
            )}
          </div>
          <div>
            <label className={labelClass}>Dimension Drawing</label>
            <div className="flex gap-2 items-start">
              <div className="flex-1">
                <input className={inputClass} value={form.dimensionDrawing} onChange={(e) => set("dimensionDrawing", e.target.value)} placeholder="URL or /images/..." />
              </div>
              <label className="shrink-0 px-3 h-10 rounded-lg border border-[#E5E7EB] text-xs font-bold text-[#374151] flex items-center cursor-pointer hover:bg-[#F8F9FA]">
                Upload
                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const url = await uploadImage(file);
                    set("dimensionDrawing", url);
                    setSuccessMsg("Dimension drawing uploaded");
                    setTimeout(() => setSuccessMsg(""), 3000);
                  } catch { setError("Upload failed"); }
                }} />
              </label>
              {form.dimensionDrawing && (
                <button type="button" onClick={() => set("dimensionDrawing", "")} className="shrink-0 w-8 h-10 rounded-lg border border-red-200 text-red-500 text-sm font-bold hover:bg-red-50">&times;</button>
              )}
            </div>
            {form.dimensionDrawing && (
              <div className="mt-2 relative w-32 h-32 rounded-lg border border-[#E5E7EB] overflow-hidden bg-[#F8F9FA]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.dimensionDrawing} alt="Drawing preview" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
            )}
          </div>
        </div>

        {/* Gallery images */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <label className={labelClass + " mb-0"}>Gallery Images</label>
            <span className="text-[10px] text-[#9CA3AF]">Drag order: left = priority</span>
          </div>
          {form.images.length > 0 && (
            <div className="space-y-2 mb-3">
              {form.images.map((img, i) => (
                <div
                  key={i}
                  className={`rounded-lg border bg-white overflow-hidden transition-colors ${
                    editingGalleryIdx === i ? "border-[#ED7606] shadow-[0_2px_8px_rgba(237,118,6,.08)]" : "border-[#E5E7EB]"
                  }`}
                >
                  {editingGalleryIdx === i ? (
                    <div className="p-3 space-y-2">
                      <div className="flex gap-2 items-start">
                        <div className="relative w-20 h-20 shrink-0 rounded-lg border border-[#E5E7EB] overflow-hidden bg-[#F8F9FA]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img.url} alt={img.alt || ""} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        </div>
                        <div className="flex-1 space-y-2">
                          <input
                            className={inputClass + " w-full"}
                            value={img.url}
                            onChange={(e) => {
                              const next = [...form.images];
                              next[i] = { ...next[i], url: e.target.value };
                              set("images", next);
                            }}
                            placeholder="Image URL"
                          />
                          <input
                            className={inputClass + " w-full"}
                            value={img.alt || ""}
                            onChange={(e) => {
                              const next = [...form.images];
                              next[i] = { ...next[i], alt: e.target.value };
                              set("images", next);
                            }}
                            placeholder="Alt text"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <label className="px-2.5 h-7 rounded border border-[#E5E7EB] text-[11px] font-bold text-[#374151] flex items-center cursor-pointer hover:bg-[#F8F9FA]">
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                const url = await uploadImage(file);
                                const next = [...form.images];
                                next[i] = { ...next[i], url };
                                set("images", next);
                                setSuccessMsg(`Uploaded: ${url}`);
                                setTimeout(() => setSuccessMsg(""), 5000);
                              } catch { setError("Upload failed"); }
                            }}
                          />
                        </label>
                        <button type="button" onClick={() => setEditingGalleryIdx(null)} className="px-3 h-7 rounded bg-[#ED7606] text-white text-[11px] font-bold">Done</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-2.5">
                      <div className="relative w-16 h-16 shrink-0 rounded-lg border border-[#E5E7EB] overflow-hidden bg-[#F8F9FA]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.url} alt={img.alt || ""} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-[#374151] font-medium truncate">{img.alt || "Image " + (i + 1)}</div>
                        <div className="text-[10px] text-[#9CA3AF] truncate font-mono">{img.url}</div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button type="button" onClick={() => setEditingGalleryIdx(i)} className="px-2 h-7 rounded border border-[#E5E7EB] text-[10px] font-bold text-[#374151] hover:bg-[#F8F9FA]">Edit</button>
                        {i > 0 && (
                          <button type="button" onClick={() => moveGalleryImage(i, -1)} className="w-7 h-7 rounded border border-[#E5E7EB] text-[10px] font-bold text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#111827]" title="Move left">&larr;</button>
                        )}
                        {i < form.images.length - 1 && (
                          <button type="button" onClick={() => moveGalleryImage(i, 1)} className="w-7 h-7 rounded border border-[#E5E7EB] text-[10px] font-bold text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#111827]" title="Move right">&rarr;</button>
                        )}
                        <button
                          type="button"
                          onClick={() => set("images", form.images.filter((_, j) => j !== i))}
                          className="w-7 h-7 rounded border border-red-200 text-red-500 text-[11px] font-bold hover:bg-red-50"
                          title="Delete"
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <label className="px-4 h-10 rounded-lg border border-[#E5E7EB] text-xs font-bold text-[#374151] flex items-center cursor-pointer hover:bg-[#F8F9FA] gap-1.5">
              + Add Image
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                disabled={galleryUploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setGalleryUploading(true);
                  try {
                    const url = await uploadImage(file);
                    set("images", [...form.images, { url, alt: form.name }]);
                    setSuccessMsg(`New image: ${url}`);
                    setTimeout(() => setSuccessMsg(""), 5000);
                    // Auto-open edit for the new image
                    setEditingGalleryIdx(form.images.length);
                  } catch {
                    setError("Gallery upload failed");
                  }
                  setGalleryUploading(false);
                  if (galleryInputRef.current) galleryInputRef.current.value = "";
                }}
              />
              {galleryUploading ? <span className="text-[#ED7606]">Uploading...</span> : <span className="text-[#9CA3AF] text-[10px]">(select file)</span>}
            </label>
            <input className={inputClass + " w-48"} placeholder="Or paste URL..." value={galleryUrl} onChange={(e) => setGalleryUrl(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (galleryUrl) { set("images", [...form.images, { url: galleryUrl, alt: galleryAlt || form.name }]); setGalleryUrl(""); setGalleryAlt(""); } } }} />
            <input className={inputClass + " w-24"} placeholder="Alt" value={galleryAlt} onChange={(e) => setGalleryAlt(e.target.value)} />
          </div>
        </div>

        {/* Performance charts */}
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className={labelClass}>Rotation Curve</label>
            <div className="flex gap-2 items-start">
              <div className="flex-1">
                <input className={inputClass} value={form.performanceCharts?.rotation_curve || ""} onChange={(e) => set("performanceCharts", { ...form.performanceCharts, rotation_curve: e.target.value })} placeholder="Image URL" />
              </div>
              <label className="shrink-0 px-3 h-10 rounded-lg border border-[#E5E7EB] text-xs font-bold text-[#374151] flex items-center cursor-pointer hover:bg-[#F8F9FA]">
                Upload
                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const url = await uploadImage(file);
                    set("performanceCharts", { ...form.performanceCharts, rotation_curve: url });
                    setSuccessMsg("Rotation curve uploaded");
                    setTimeout(() => setSuccessMsg(""), 3000);
                  } catch { setError("Upload failed"); }
                }} />
              </label>
              {(form.performanceCharts?.rotation_curve) && (
                <button type="button" onClick={() => set("performanceCharts", { ...form.performanceCharts, rotation_curve: "" })} className="shrink-0 w-8 h-10 rounded-lg border border-red-200 text-red-500 text-sm font-bold hover:bg-red-50">&times;</button>
              )}
            </div>
            {form.performanceCharts?.rotation_curve && (
              <div className="mt-2 relative w-40 h-28 rounded-lg border border-[#E5E7EB] overflow-hidden bg-[#F8F9FA]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.performanceCharts.rotation_curve} alt="Rotation curve preview" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
            )}
          </div>
          <div>
            <label className={labelClass}>Temperature Curve</label>
            <div className="flex gap-2 items-start">
              <div className="flex-1">
                <input className={inputClass} value={form.performanceCharts?.temperature_curve || ""} onChange={(e) => set("performanceCharts", { ...form.performanceCharts, temperature_curve: e.target.value })} placeholder="Image URL" />
              </div>
              <label className="shrink-0 px-3 h-10 rounded-lg border border-[#E5E7EB] text-xs font-bold text-[#374151] flex items-center cursor-pointer hover:bg-[#F8F9FA]">
                Upload
                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const url = await uploadImage(file);
                    set("performanceCharts", { ...form.performanceCharts, temperature_curve: url });
                    setSuccessMsg("Temperature curve uploaded");
                    setTimeout(() => setSuccessMsg(""), 3000);
                  } catch { setError("Upload failed"); }
                }} />
              </label>
              {(form.performanceCharts?.temperature_curve) && (
                <button type="button" onClick={() => set("performanceCharts", { ...form.performanceCharts, temperature_curve: "" })} className="shrink-0 w-8 h-10 rounded-lg border border-red-200 text-red-500 text-sm font-bold hover:bg-red-50">&times;</button>
              )}
            </div>
            {form.performanceCharts?.temperature_curve && (
              <div className="mt-2 relative w-40 h-28 rounded-lg border border-[#E5E7EB] overflow-hidden bg-[#F8F9FA]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.performanceCharts.temperature_curve} alt="Temperature curve preview" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Torque & Durability — conditional per category */}
      <section className="rounded-xl border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-base font-extrabold text-[#111827] mb-5">
          {form.category === "latch" ? "Force & Durability" : "Torque & Durability"}
        </h2>

        {/* Damper: torque fields */}
        {form.category !== "latch" && (
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Torque Min</label>
              <input
                className={inputClass}
                type="number"
                value={form.torque?.min ?? ""}
                onChange={(e) => set("torque", { ...form.torque || { unit: "gf.cm" }, min: e.target.value ? Number(e.target.value) : 0, max: form.torque?.max ?? 0 })}
              />
            </div>
            <div>
              <label className={labelClass}>Torque Max</label>
              <input
                className={inputClass}
                type="number"
                value={form.torque?.max ?? ""}
                onChange={(e) => set("torque", { ...form.torque || { unit: "gf.cm" }, min: form.torque?.min ?? 0, max: e.target.value ? Number(e.target.value) : 0 })}
              />
            </div>
            <div>
              <label className={labelClass}>Torque Unit</label>
              <select
                className={inputClass}
                value={form.torque?.unit || "gf.cm"}
                onChange={(e) => set("torque", { ...form.torque || { min: 0, max: 0 }, unit: e.target.value })}
              >
                <option value="gf.cm">gf·cm</option>
                <option value="kgf.cm">kgf·cm</option>
                <option value="N·m">N·m</option>
                <option value="N">N</option>
              </select>
            </div>
          </div>
        )}

        {/* Damper: hard torque */}
        {form.category !== "latch" && (
          <div className="grid sm:grid-cols-3 gap-4 mt-4">
            <div>
              <label className={labelClass}>Hard Torque</label>
              <input className={inputClass} value={form.hardTorque} onChange={(e) => set("hardTorque", e.target.value)} placeholder="e.g. 50" />
            </div>
          </div>
        )}

        {/* Latch: press force + sound type */}
        {form.category === "latch" && (
          <>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Hard Force (按压力)</label>
                <input className={inputClass} value={form.hardForce} onChange={(e) => set("hardForce", e.target.value)} placeholder="e.g. 6.0" />
              </div>
              <div>
                <label className={labelClass}>Force Range</label>
                <input className={inputClass} value={form.forceRange} onChange={(e) => set("forceRange", e.target.value)} placeholder="e.g. 15 — 50 N" />
              </div>
              <div>
                <label className={labelClass}>Sound Type</label>
                <select
                  className={inputClass}
                  value={form.soundType}
                  onChange={(e) => set("soundType", e.target.value)}
                >
                  <option value="">Not Set</option>
                  <option value="audible">有声 (Audible)</option>
                  <option value="silent">无声 (Silent)</option>
                </select>
              </div>
            </div>
            <div className="mt-3 px-3 py-2 rounded-lg bg-[#F3F4F6] text-[11px] text-[#6B7280] font-medium">
              Latch products use press force instead of torque. Force range is displayed on the product page.
            </div>
          </>
        )}

        {/* Durability — all categories */}
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          <div>
            <label className={labelClass}>Durability Cycles</label>
            <input
              className={inputClass}
              type="number"
              value={form.durability?.cycles ?? ""}
              onChange={(e) => set("durability", { ...form.durability || {}, cycles: e.target.value ? Number(e.target.value) : undefined })}
            />
          </div>
          <div>
            <label className={labelClass}>Temperature Range</label>
            <input className={inputClass} value={form.durability?.temperature || ""} onChange={(e) => set("durability", { ...form.durability || {}, temperature: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Test Method</label>
            <input className={inputClass} value={form.durability?.test_method || ""} onChange={(e) => set("durability", { ...form.durability || {}, test_method: e.target.value })} />
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          <div>
            <label className={labelClass}>Buffer Direction</label>
            <input className={inputClass} value={form.bufferDirection} onChange={(e) => set("bufferDirection", e.target.value)} placeholder="bidirectional" />
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="rounded-xl border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-base font-extrabold text-[#111827] mb-5">Specifications</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {Object.entries(form.specifications).map(([k, v]) => (
            <span key={k} className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#FFF1E3] rounded-lg text-xs font-medium text-[#ED7606]">
              {k}: {v}
              <button type="button" onClick={() => { const s = { ...form.specifications }; delete s[k]; set("specifications", s); }} className="ml-1 text-red-500">&times;</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input className={inputClass + " w-40"} placeholder="Key" value={specKey} onChange={(e) => setSpecKey(e.target.value)} />
          <input className={inputClass + " flex-1"} placeholder="Value" value={specVal} onChange={(e) => setSpecVal(e.target.value)} />
          <button type="button" onClick={() => { if (specKey && specVal) { set("specifications", { ...form.specifications, [specKey]: specVal }); setSpecKey(""); setSpecVal(""); } }} className="px-4 h-10 rounded-lg bg-[#111827] text-white text-xs font-bold">Add</button>
        </div>
      </section>

      {/* Tech Params */}
      <section className="rounded-xl border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-base font-extrabold text-[#111827] mb-5">Tech Params</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {Object.entries(form.techParams).map(([k, v]) => (
            <span key={k} className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#F3F4F6] rounded-lg text-xs font-medium text-[#374151]">
              {k}: {String(v)}
              <button type="button" onClick={() => { const t = { ...form.techParams }; delete t[k]; set("techParams", t); }} className="ml-1 text-red-500">&times;</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input className={inputClass + " w-40"} placeholder="Key (e.g. outer_diameter)" value={techKey} onChange={(e) => setTechKey(e.target.value)} />
          <input className={inputClass + " flex-1"} placeholder="Value" value={techVal} onChange={(e) => setTechVal(e.target.value)} />
          <button type="button" onClick={() => { if (techKey && techVal) { set("techParams", { ...form.techParams, [techKey]: isNaN(Number(techVal)) ? techVal : Number(techVal) }); setTechKey(""); setTechVal(""); } }} className="px-4 h-10 rounded-lg bg-[#111827] text-white text-xs font-bold">Add</button>
        </div>
      </section>

      {/* Materials */}
      <section className="rounded-xl border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-base font-extrabold text-[#111827] mb-5">Materials</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {form.materials.map((m, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#F0FDF4] rounded-lg text-xs font-medium text-[#16A34A]">
              {m.part}: {m.material}
              <button type="button" onClick={() => set("materials", form.materials.filter((_, j) => j !== i))} className="ml-1 text-red-500">&times;</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input className={inputClass + " w-40"} placeholder="Part" value={matPart} onChange={(e) => setMatPart(e.target.value)} />
          <input className={inputClass + " flex-1"} placeholder="Material" value={matMaterial} onChange={(e) => setMatMaterial(e.target.value)} />
          <button type="button" onClick={() => { if (matPart) { set("materials", [...form.materials, { part: matPart, material: matMaterial }]); setMatPart(""); setMatMaterial(""); } }} className="px-4 h-10 rounded-lg bg-[#111827] text-white text-xs font-bold">Add</button>
        </div>
      </section>

      {/* Characteristics, Applications, Tags */}
      <section className="rounded-xl border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-base font-extrabold text-[#111827] mb-5">Characteristics & Applications</h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {/* Characteristics */}
          <div>
            <label className={labelClass}>Characteristics</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {form.characteristics.map((c, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-[#FFF1E3] rounded text-xs font-medium text-[#ED7606]">
                  {c}
                  <button type="button" onClick={() => set("characteristics", form.characteristics.filter((_, j) => j !== i))} className="text-red-500">&times;</button>
                </span>
              ))}
            </div>
            <div className="flex gap-1.5">
              <input className={inputClass} value={charInput} onChange={(e) => setCharInput(e.target.value)} placeholder="e.g. SOC Free" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (charInput) { set("characteristics", [...form.characteristics, charInput]); setCharInput(""); } } }} />
            </div>
          </div>
          {/* Applications */}
          <div>
            <label className={labelClass}>Applications</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {form.applications.map((a, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-[#F0F2F5] rounded text-xs">
                  {a}
                  <button type="button" onClick={() => set("applications", form.applications.filter((_, j) => j !== i))} className="text-red-500">&times;</button>
                </span>
              ))}
            </div>
            <div className="flex gap-1.5">
              <input className={inputClass} value={appInput} onChange={(e) => setAppInput(e.target.value)} placeholder="e.g. Cup holders" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (appInput) { set("applications", [...form.applications, appInput]); setAppInput(""); } } }} />
            </div>
          </div>
          {/* SEO tags */}
          <div>
            <label className={labelClass}>SEO Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {form.tags.map((t, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-[#F3F4F6] rounded text-xs">
                  {t}
                  <button type="button" onClick={() => set("tags", form.tags.filter((_, j) => j !== i))} className="text-red-500">&times;</button>
                </span>
              ))}
            </div>
            <div className="flex gap-1.5">
              <input className={inputClass} value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="e.g. rotary damper" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (tagInput) { set("tags", [...form.tags, tagInput]); setTagInput(""); } } }} />
            </div>
          </div>
        </div>
      </section>

      {/* Application Scenarios */}
      <section className="rounded-xl border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-base font-extrabold text-[#111827] mb-5">Application Scenarios</h2>
        <p className="text-xs text-[#6B7280] mb-3">
          Select preset scenarios for this product. Leave empty to use defaults.
        </p>

        {/* Preset grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 mb-5">
          {PRESET_SCENARIOS.map((preset) => {
            const isSelected = form.applicationScenarios.some(
              (s) => s.image === preset.image || s.label === preset.label
            );
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  if (isSelected) {
                    set(
                      "applicationScenarios",
                      form.applicationScenarios.filter(
                        (s) => s.image !== preset.image && s.label !== preset.label
                      )
                    );
                  } else {
                    set("applicationScenarios", [...form.applicationScenarios, { ...preset }]);
                  }
                }}
                className={`relative rounded-lg border-2 overflow-hidden transition-all text-left ${
                  isSelected
                    ? "border-[#ED7606] ring-2 ring-[#ED7606]/20 shadow-[0_4px_12px_rgba(237,118,6,.12)]"
                    : "border-[#E5E7EB] hover:border-[#D1D5DB]"
                }`}
              >
                <div className="aspect-[5/3] bg-[#F8F9FA] relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preset.image}
                    alt={preset.label}
                    className="w-full h-full object-cover"
                  />
                  {isSelected && (
                    <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#ED7606] text-white text-[11px] flex items-center justify-center font-bold">
                      &#10003;
                    </span>
                  )}
                </div>
                <div className="px-2 py-1.5 text-[11px] font-bold text-[#374151] truncate">
                  {preset.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom scenarios */}
        {form.applicationScenarios.filter((s) => !PRESET_SCENARIOS.some((p) => p.image === s.image || p.label === s.label)).length > 0 && (
          <div className="mb-3">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Custom Scenarios</span>
            <div className="space-y-2 mt-1.5">
              {form.applicationScenarios
                .filter((s) => !PRESET_SCENARIOS.some((p) => p.image === s.image || p.label === s.label))
                .map((s, _i) => {
                  const origIdx = form.applicationScenarios.indexOf(s);
                  return (
                    <div key={origIdx} className="flex items-center gap-2">
                      <input
                        className={inputClass + " flex-1"}
                        value={s.image}
                        onChange={(e) => {
                          const next = [...form.applicationScenarios];
                          next[origIdx] = { ...next[origIdx], image: e.target.value };
                          set("applicationScenarios", next);
                        }}
                        placeholder="Image URL or path"
                      />
                      <input
                        className={inputClass + " w-32"}
                        value={s.label}
                        onChange={(e) => {
                          const next = [...form.applicationScenarios];
                          next[origIdx] = { ...next[origIdx], label: e.target.value };
                          set("applicationScenarios", next);
                        }}
                        placeholder="Label"
                      />
                      <button
                        type="button"
                        onClick={() => set("applicationScenarios", form.applicationScenarios.filter((_, j) => j !== origIdx))}
                        className="shrink-0 w-8 h-8 rounded-lg border border-red-200 text-red-500 text-sm font-bold hover:bg-red-50"
                      >
                        &times;
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => set("applicationScenarios", [...form.applicationScenarios, { image: "", label: "" }])}
          className="px-4 h-10 rounded-lg border border-[#E5E7EB] text-xs font-bold text-[#374151] hover:bg-[#F8F9FA]"
        >
          + Add Custom Scenario
        </button>
      </section>

      {/* SEO */}
      <section className="rounded-xl border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-base font-extrabold text-[#111827] mb-5">SEO</h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>SEO Title</label>
            <input className={inputClass} value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>SEO Description</label>
            <textarea className={inputClass + " h-16 py-2"} value={form.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} />
          </div>
        </div>
      </section>

      {/* Actions */}
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
                Delete Product
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
            {saving ? "Saving..." : isNew ? "Create Product" : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}
