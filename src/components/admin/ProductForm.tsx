"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

type ProductData = Record<string, unknown>;

interface Props {
  initial?: ProductData;
  isNew?: boolean;
}

export default function ProductForm({ initial, isNew }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
    images: (initial?.images as { url: string; alt: string }[]) || [],
    specifications: (initial?.specifications as Record<string, string>) || {},
    techParams: (initial?.techParams as Record<string, string | number>) || {},
    torque: (initial?.torque as { min: number; max: number; unit: string } | null) || null,
    durability: (initial?.durability as { temperature?: string; cycles?: number; cycles_unit?: string } | null) || null,
    materials: (initial?.materials as { part: string; material: string }[]) || [],
    characteristics: (initial?.characteristics as string[]) || [],
    applications: (initial?.applications as string[]) || [],
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

  const set = useCallback((field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  async function uploadImage(file: File) {
    const fd = new FormData();
    fd.append("file", file);
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
    } catch {
      alert("Image upload failed");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      images: form.images.length > 0 ? form.images : (form.image ? [{ url: form.image, alt: form.name }] : []),
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
      router.push("/admin/products");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Save failed");
    }
    setSaving(false);
  }

  const inputClass = "w-full h-10 px-3 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#ED7606] focus:ring-2 focus:ring-[#ED7606]/10";
  const labelClass = "block text-xs font-bold text-[#374151] mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">{error}</div>}

      {/* Basic Info */}
      <section className="rounded-xl border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-base font-extrabold text-[#111827] mb-5">Basic Information</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className={labelClass}>Model *</label>
            <input className={inputClass} value={form.model} onChange={(e) => set("model", e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Slug *</label>
            <input className={inputClass} value={form.slug} onChange={(e) => set("slug", e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Category *</label>
            <select className={inputClass} value={form.category} onChange={(e) => set("category", e.target.value)}>
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
            <input className={inputClass} value={form.subType} onChange={(e) => set("subType", e.target.value)} />
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
            <label className={labelClass}>Main Image URL</label>
            <input className={inputClass} value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="/uploads/..." />
          </div>
          <div>
            <label className={labelClass}>Upload Image</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm" />
          </div>
          <div>
            <label className={labelClass}>Dimension Drawing URL</label>
            <input className={inputClass} value={form.dimensionDrawing} onChange={(e) => set("dimensionDrawing", e.target.value)} placeholder="/images/..." />
          </div>
        </div>
        {/* Gallery images */}
        <div className="mt-4">
          <label className={labelClass}>Gallery Images</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.images.map((img, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-[#F3F4F6] rounded text-xs">
                {img.alt || img.url}
                <button type="button" onClick={() => set("images", form.images.filter((_, j) => j !== i))} className="text-red-500 font-bold">&times;</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input className={inputClass + " flex-1"} placeholder="Image URL" value={galleryUrl} onChange={(e) => setGalleryUrl(e.target.value)} />
            <input className={inputClass + " w-32"} placeholder="Alt text" value={galleryAlt} onChange={(e) => setGalleryAlt(e.target.value)} />
            <button type="button" onClick={() => { if (galleryUrl) { set("images", [...form.images, { url: galleryUrl, alt: galleryAlt || form.name }]); setGalleryUrl(""); setGalleryAlt(""); } }} className="px-4 h-10 rounded-lg bg-[#111827] text-white text-xs font-bold">Add</button>
          </div>
        </div>
        {/* Performance charts */}
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className={labelClass}>Rotation Curve URL</label>
            <input className={inputClass} value={form.performanceCharts?.rotation_curve || ""} onChange={(e) => set("performanceCharts", { ...form.performanceCharts, rotation_curve: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Temperature Curve URL</label>
            <input className={inputClass} value={form.performanceCharts?.temperature_curve || ""} onChange={(e) => set("performanceCharts", { ...form.performanceCharts, temperature_curve: e.target.value })} />
          </div>
        </div>
      </section>

      {/* Torque & Durability */}
      <section className="rounded-xl border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-base font-extrabold text-[#111827] mb-5">Torque & Durability</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Torque Min</label>
            <input className={inputClass} type="number" value={form.torque?.min || ""} onChange={(e) => set("torque", { ...form.torque || { unit: "gf.cm" }, min: Number(e.target.value), max: form.torque?.max || 0 })} />
          </div>
          <div>
            <label className={labelClass}>Torque Max</label>
            <input className={inputClass} type="number" value={form.torque?.max || ""} onChange={(e) => set("torque", { ...form.torque || { unit: "gf.cm" }, min: form.torque?.min || 0, max: Number(e.target.value) })} />
          </div>
          <div>
            <label className={labelClass}>Torque Unit</label>
            <select className={inputClass} value={form.torque?.unit || "gf.cm"} onChange={(e) => set("torque", { ...form.torque || { min: 0, max: 0 }, unit: e.target.value })}>
              <option value="gf.cm">gf·cm</option>
              <option value="kgf.cm">kgf·cm</option>
              <option value="N·m">N·m</option>
              <option value="N">N</option>
            </select>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          <div>
            <label className={labelClass}>Durability Cycles</label>
            <input className={inputClass} type="number" value={form.durability?.cycles || ""} onChange={(e) => set("durability", { ...form.durability || {}, cycles: Number(e.target.value) })} />
          </div>
          <div>
            <label className={labelClass}>Temperature Range</label>
            <input className={inputClass} value={form.durability?.temperature || ""} onChange={(e) => set("durability", { ...form.durability || {}, temperature: e.target.value })} />
          </div>
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

      {/* Tags */}
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
                <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-[#F3F4F6] rounded text-xs">{t}</span>
              ))}
            </div>
            <div className="flex gap-1.5">
              <input className={inputClass} value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="e.g. rotary damper" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (tagInput) { set("tags", [...form.tags, tagInput]); setTagInput(""); } } }} />
            </div>
          </div>
        </div>
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

      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => router.back()} className="px-6 h-11 rounded-lg border border-[#E5E7EB] text-sm font-bold text-[#374151]">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="px-6 h-11 rounded-lg bg-[#ED7606] text-white text-sm font-bold hover:bg-[#D46900] disabled:opacity-50 transition-colors">
          {saving ? "Saving..." : isNew ? "Create Product" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
