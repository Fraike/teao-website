"use client";

import { publishingError } from "./publishing-labels";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import MediaPicker from "./MediaPicker";

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

const presetLabels: Record<string, string> = {
  "Center Console": "中控台",
  "Glove Box": "手套箱",
  "Door Handle": "车门把手",
  "Cup Holder": "杯架",
  "Glasses Box": "眼镜盒",
  Ashtray: "烟灰缸",
  "Outlet Cover": "出风口盖",
  "Safety Handle": "安全扶手",
  "Toilet Lid": "马桶盖",
};

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
  const [editingGalleryIdx, setEditingGalleryIdx] = useState<number | null>(null);

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
      setSuccessMsg(isNew ? "产品已创建" : "修改已保存");
      setTimeout(() => setSuccessMsg(""), 3000);
      if (redirectAfter) {
        router.push("/admin/products");
        router.refresh();
      }
    } else {
      const data = await res.json();
      setError(publishingError(data.error, "保存失败，请稍后重试。"));
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
      setError("删除失败");
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
        <h2 className="text-base font-extrabold text-[#111827] mb-2">基本信息</h2>
        <p className="mb-5 text-xs text-[#6B7280]">面向客户的名称、摘要、详情和搜索字段请填写英文。</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="product-model" className={labelClass}>型号 / Model *</label>
            <input id="product-model" className={inputClass} value={form.model} onChange={(e) => handleModelChange(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="product-slug" className={labelClass}>网址标识 / Slug *</label>
            <input id="product-slug" className={inputClass} value={form.slug} onChange={(e) => set("slug", e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>分类 / Category *</label>
            <select className={inputClass} value={form.category} onChange={(e) => {
              const cat = e.target.value;
              set("category", cat);
              if (cat === "latch") {
                if (!form.soundType) set("soundType", "audible");
                if (!form.hardForce) set("hardForce", "6");
              }
            }}>
              <option value="gear-damper">齿轮阻尼器 / Gear Damper</option>
              <option value="axial-damper">轴向阻尼器 / Axial Damper</option>
              <option value="glove-box-damper">手套箱阻尼器 / Glove Box Damper</option>
              <option value="latch">锁扣 / Latch</option>
              <option value="other">其他</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>排序</label>
            <input className={inputClass} type="number" value={form.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value))} />
          </div>
          <div>
            <label className={labelClass}>系列 / Series</label>
            <input className={inputClass} value={form.series} onChange={(e) => set("series", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>子类型 / Subtype</label>
            <select className={inputClass} value={form.subType} onChange={(e) => set("subType", e.target.value)}>
              <option value="">未选择</option>
              <option value="individual">单品</option>
              <option value="series">系列产品</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>变体 / Variant</label>
            <input className={inputClass} value={form.variant} onChange={(e) => set("variant", e.target.value)} />
          </div>
          <div className="flex items-center gap-2 pt-5">
            <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} />
            <label htmlFor="isActive" className="text-xs font-bold text-[#374151]">上架</label>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="product-name" className={labelClass}>产品名称 / Product Name *</label>
            <input id="product-name" className={inputClass} value={form.name} onChange={(e) => set("name", e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>安装方式 / Assembly Method</label>
            <input className={inputClass} value={form.assemblyMethod} onChange={(e) => set("assemblyMethod", e.target.value)} placeholder="例如 Screw Fixing" />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="product-summary" className={labelClass}>摘要 / Summary</label>
          <textarea id="product-summary" className={inputClass + " h-16 py-2"} value={form.summary} onChange={(e) => set("summary", e.target.value)} />
        </div>
        <div className="mt-4">
          <label htmlFor="product-description" className={labelClass}>详情 / Description</label>
          <textarea id="product-description" className={inputClass + " h-24 py-2"} value={form.description} onChange={(e) => set("description", e.target.value)} />
        </div>
      </section>

      {/* Images */}
      <section className="rounded-xl border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-base font-extrabold text-[#111827] mb-5">图片</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <MediaPicker
              value={form.image}
              onChange={(url) => set("image", url)}
              label="主图 / Main Image"
              placeholder="网址或 /uploads/... 路径"
            />
          </div>
          <div>
            <MediaPicker
              value={form.dimensionDrawing}
              onChange={(url) => set("dimensionDrawing", url)}
              label="尺寸图 / Dimension Drawing"
              placeholder="网址或 /images/... 路径"
            />
          </div>
        </div>

        {/* Gallery images */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <label className={labelClass + " mb-0"}>产品相册</label>
            <span className="text-[10px] text-[#9CA3AF]">从左到右按优先级展示</span>
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
                            placeholder="图片网址"
                          />
                          <input
                            className={inputClass + " w-full"}
                            value={img.alt || ""}
                            onChange={(e) => {
                              const next = [...form.images];
                              next[i] = { ...next[i], alt: e.target.value };
                              set("images", next);
                            }}
                            placeholder="英文替代文字"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <MediaPicker
                          value={img.url}
                          onChange={(url) => {
                            if (url) {
                              const next = [...form.images];
                              next[i] = { ...next[i], url };
                              set("images", next);
                            }
                          }}
                          placeholder="浏览素材…"
                        />
                        <button type="button" onClick={() => setEditingGalleryIdx(null)} className="px-3 h-7 rounded bg-[#ED7606] text-white text-[11px] font-bold">完成</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-2.5">
                      <div className="relative w-16 h-16 shrink-0 rounded-lg border border-[#E5E7EB] overflow-hidden bg-[#F8F9FA]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.url} alt={img.alt || ""} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-[#374151] font-medium truncate">{img.alt || "图片 " + (i + 1)}</div>
                        <div className="text-[10px] text-[#9CA3AF] truncate font-mono">{img.url}</div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button type="button" onClick={() => setEditingGalleryIdx(i)} className="px-2 h-7 rounded border border-[#E5E7EB] text-[10px] font-bold text-[#374151] hover:bg-[#F8F9FA]">编辑</button>
                        {i > 0 && (
                          <button type="button" onClick={() => moveGalleryImage(i, -1)} className="w-7 h-7 rounded border border-[#E5E7EB] text-[10px] font-bold text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#111827]" title="左移">&larr;</button>
                        )}
                        {i < form.images.length - 1 && (
                          <button type="button" onClick={() => moveGalleryImage(i, 1)} className="w-7 h-7 rounded border border-[#E5E7EB] text-[10px] font-bold text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#111827]" title="右移">&rarr;</button>
                        )}
                        <button
                          type="button"
                          onClick={() => set("images", form.images.filter((_, j) => j !== i))}
                          className="w-7 h-7 rounded border border-red-200 text-red-500 text-[11px] font-bold hover:bg-red-50"
                          title="删除"
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
          <div className="flex gap-2 items-start">
            <MediaPicker
              value=""
              onChange={(url) => {
                if (url) {
                  set("images", [...form.images, { url, alt: form.name }]);
                  setEditingGalleryIdx(form.images.length);
                }
              }}
              label=""
              placeholder="+ 从素材库选择或上传"
            />
            <input className={inputClass + " w-48"} placeholder="或粘贴网址…" value={galleryUrl} onChange={(e) => setGalleryUrl(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (galleryUrl) { set("images", [...form.images, { url: galleryUrl, alt: galleryAlt || form.name }]); setGalleryUrl(""); setGalleryAlt(""); } } }} />
            <input className={inputClass + " w-24"} placeholder="英文替代文字" value={galleryAlt} onChange={(e) => setGalleryAlt(e.target.value)} />
          </div>
        </div>

        {/* Performance charts */}
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div>
            <MediaPicker
              value={form.performanceCharts?.rotation_curve || ""}
              onChange={(url) => set("performanceCharts", { ...form.performanceCharts, rotation_curve: url })}
              label="转动曲线 / Rotation Curve"
              placeholder="图片网址"
            />
          </div>
          <div>
            <MediaPicker
              value={form.performanceCharts?.temperature_curve || ""}
              onChange={(url) => set("performanceCharts", { ...form.performanceCharts, temperature_curve: url })}
              label="温度曲线 / Temperature Curve"
              placeholder="图片网址"
            />
          </div>
        </div>
      </section>

      {/* Torque & Durability — conditional per category */}
      <section className="rounded-xl border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-base font-extrabold text-[#111827] mb-5">
          {form.category === "latch" ? "按压力与耐久性" : "扭矩与耐久性"}
        </h2>

        {/* Damper: torque fields */}
        {form.category !== "latch" && (
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>最小扭矩 / Min. Torque</label>
              <input
                className={inputClass}
                type="number"
                value={form.torque?.min ?? ""}
                onChange={(e) => set("torque", { ...form.torque || { unit: "gf.cm" }, min: e.target.value ? Number(e.target.value) : 0, max: form.torque?.max ?? 0 })}
              />
            </div>
            <div>
              <label className={labelClass}>最大扭矩 / Max. Torque</label>
              <input
                className={inputClass}
                type="number"
                value={form.torque?.max ?? ""}
                onChange={(e) => set("torque", { ...form.torque || { unit: "gf.cm" }, min: form.torque?.min ?? 0, max: e.target.value ? Number(e.target.value) : 0 })}
              />
            </div>
            <div>
              <label className={labelClass}>扭矩单位 / Torque Unit</label>
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
              <label className={labelClass}>硬扭矩 / Hard Torque</label>
              <input className={inputClass} value={form.hardTorque} onChange={(e) => set("hardTorque", e.target.value)} placeholder="例如 50" />
            </div>
          </div>
        )}

        {/* Latch: press force + sound type */}
        {form.category === "latch" && (
          <>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>按压力 / Hard Force</label>
                <input className={inputClass} value={form.hardForce} onChange={(e) => set("hardForce", e.target.value)} placeholder="例如 6.0" />
              </div>
              <div>
                <label className={labelClass}>力值范围 / Force Range</label>
                <input className={inputClass} value={form.forceRange} onChange={(e) => set("forceRange", e.target.value)} placeholder="例如 15–50 N" />
              </div>
              <div>
                <label className={labelClass}>声音类型 / Sound Type</label>
                <select
                  className={inputClass}
                  value={form.soundType}
                  onChange={(e) => set("soundType", e.target.value)}
                >
                  <option value="">未设置</option>
                  <option value="audible">有声 (Audible)</option>
                  <option value="silent">无声 (Silent)</option>
                </select>
              </div>
            </div>
            <div className="mt-3 px-3 py-2 rounded-lg bg-[#F3F4F6] text-[11px] text-[#6B7280] font-medium">
              锁扣按按压力录入，公开商品页显示力值范围。
            </div>
          </>
        )}

        {/* Durability — all categories */}
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          <div>
            <label className={labelClass}>耐久次数 / Durability Cycles</label>
            <input
              className={inputClass}
              type="number"
              value={form.durability?.cycles ?? ""}
              onChange={(e) => set("durability", { ...form.durability || {}, cycles: e.target.value ? Number(e.target.value) : undefined })}
            />
          </div>
          <div>
            <label className={labelClass}>温度范围 / Temperature Range</label>
            <input className={inputClass} value={form.durability?.temperature || ""} onChange={(e) => set("durability", { ...form.durability || {}, temperature: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>测试方法 / Test Method</label>
            <input className={inputClass} value={form.durability?.test_method || ""} onChange={(e) => set("durability", { ...form.durability || {}, test_method: e.target.value })} />
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          <div>
            <label className={labelClass}>阻尼方向 / Damping Direction</label>
            <input className={inputClass} value={form.bufferDirection} onChange={(e) => set("bufferDirection", e.target.value)} placeholder="例如 bidirectional" />
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="rounded-xl border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-base font-extrabold text-[#111827] mb-5">规格参数 / Specifications</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {Object.entries(form.specifications).map(([k, v]) => (
            <span key={k} className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#FFF1E3] rounded-lg text-xs font-medium text-[#ED7606]">
              {k}: {v}
              <button type="button" onClick={() => { const s = { ...form.specifications }; delete s[k]; set("specifications", s); }} className="ml-1 text-red-500">&times;</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input className={inputClass + " w-40"} placeholder="参数名" value={specKey} onChange={(e) => setSpecKey(e.target.value)} />
          <input className={inputClass + " flex-1"} placeholder="参数值" value={specVal} onChange={(e) => setSpecVal(e.target.value)} />
          <button type="button" onClick={() => { if (specKey && specVal) { set("specifications", { ...form.specifications, [specKey]: specVal }); setSpecKey(""); setSpecVal(""); } }} className="px-4 h-10 rounded-lg bg-[#111827] text-white text-xs font-bold">添加</button>
        </div>
      </section>

      {/* Tech Params */}
      <section className="rounded-xl border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-base font-extrabold text-[#111827] mb-5">技术参数 / Technical Parameters</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {Object.entries(form.techParams).map(([k, v]) => (
            <span key={k} className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#F3F4F6] rounded-lg text-xs font-medium text-[#374151]">
              {k}: {String(v)}
              <button type="button" onClick={() => { const t = { ...form.techParams }; delete t[k]; set("techParams", t); }} className="ml-1 text-red-500">&times;</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input className={inputClass + " w-40"} placeholder="参数名，例如 outer_diameter" value={techKey} onChange={(e) => setTechKey(e.target.value)} />
          <input className={inputClass + " flex-1"} placeholder="参数值" value={techVal} onChange={(e) => setTechVal(e.target.value)} />
          <button type="button" onClick={() => { if (techKey && techVal) { set("techParams", { ...form.techParams, [techKey]: isNaN(Number(techVal)) ? techVal : Number(techVal) }); setTechKey(""); setTechVal(""); } }} className="px-4 h-10 rounded-lg bg-[#111827] text-white text-xs font-bold">添加</button>
        </div>
      </section>

      {/* Materials */}
      <section className="rounded-xl border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-base font-extrabold text-[#111827] mb-5">材料 / Materials</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {form.materials.map((m, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#F0FDF4] rounded-lg text-xs font-medium text-[#16A34A]">
              {m.part}: {m.material}
              <button type="button" onClick={() => set("materials", form.materials.filter((_, j) => j !== i))} className="ml-1 text-red-500">&times;</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input className={inputClass + " w-40"} placeholder="零件名称" value={matPart} onChange={(e) => setMatPart(e.target.value)} />
          <input className={inputClass + " flex-1"} placeholder="材料名称" value={matMaterial} onChange={(e) => setMatMaterial(e.target.value)} />
          <button type="button" onClick={() => { if (matPart) { set("materials", [...form.materials, { part: matPart, material: matMaterial }]); setMatPart(""); setMatMaterial(""); } }} className="px-4 h-10 rounded-lg bg-[#111827] text-white text-xs font-bold">添加</button>
        </div>
      </section>

      {/* Characteristics, Applications, Tags */}
      <section className="rounded-xl border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-base font-extrabold text-[#111827] mb-5">特性与用途</h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {/* Characteristics */}
          <div>
            <label className={labelClass}>产品特性 / Characteristics</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {form.characteristics.map((c, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-[#FFF1E3] rounded text-xs font-medium text-[#ED7606]">
                  {c}
                  <button type="button" onClick={() => set("characteristics", form.characteristics.filter((_, j) => j !== i))} className="text-red-500">&times;</button>
                </span>
              ))}
            </div>
            <div className="flex gap-1.5">
              <input className={inputClass} value={charInput} onChange={(e) => setCharInput(e.target.value)} placeholder="例如 SOC Free" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (charInput) { set("characteristics", [...form.characteristics, charInput]); setCharInput(""); } } }} />
            </div>
          </div>
          {/* Applications */}
          <div>
            <label className={labelClass}>应用场景 / Applications</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {form.applications.map((a, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-[#F0F2F5] rounded text-xs">
                  {a}
                  <button type="button" onClick={() => set("applications", form.applications.filter((_, j) => j !== i))} className="text-red-500">&times;</button>
                </span>
              ))}
            </div>
            <div className="flex gap-1.5">
              <input className={inputClass} value={appInput} onChange={(e) => setAppInput(e.target.value)} placeholder="例如 Cup holders" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (appInput) { set("applications", [...form.applications, appInput]); setAppInput(""); } } }} />
            </div>
          </div>
          {/* SEO tags */}
          <div>
            <label className={labelClass}>搜索标签 / SEO Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {form.tags.map((t, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-[#F3F4F6] rounded text-xs">
                  {t}
                  <button type="button" onClick={() => set("tags", form.tags.filter((_, j) => j !== i))} className="text-red-500">&times;</button>
                </span>
              ))}
            </div>
            <div className="flex gap-1.5">
              <input className={inputClass} value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="例如 rotary damper" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (tagInput) { set("tags", [...form.tags, tagInput]); setTagInput(""); } } }} />
            </div>
          </div>
        </div>
      </section>

      {/* Application Scenarios */}
      <section className="rounded-xl border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-base font-extrabold text-[#111827] mb-5">应用场景图</h2>
        <p className="text-xs text-[#6B7280] mb-3">
          请选择此产品的预设应用场景。留空时使用默认场景。
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
                    alt={presetLabels[preset.label] ?? preset.label}
                    className="w-full h-full object-cover"
                  />
                  {isSelected && (
                    <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#ED7606] text-white text-[11px] flex items-center justify-center font-bold">
                      &#10003;
                    </span>
                  )}
                </div>
                <div className="px-2 py-1.5 text-[11px] font-bold text-[#374151] truncate">
                  {presetLabels[preset.label] ?? preset.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom scenarios */}
        {form.applicationScenarios.filter((s) => !PRESET_SCENARIOS.some((p) => p.image === s.image || p.label === s.label)).length > 0 && (
          <div className="mb-3">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">自定义场景</span>
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
                        placeholder="图片网址或路径"
                      />
                      <input
                        className={inputClass + " w-32"}
                        value={s.label}
                        onChange={(e) => {
                          const next = [...form.applicationScenarios];
                          next[origIdx] = { ...next[origIdx], label: e.target.value };
                          set("applicationScenarios", next);
                        }}
                        placeholder="英文场景名称"
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
          + 添加自定义场景
        </button>
      </section>

      {/* SEO */}
      <section className="rounded-xl border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-base font-extrabold text-[#111827] mb-5">搜索优化（SEO）</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="product-seoTitle" className={labelClass}>搜索标题 / SEO Title</label>
            <input id="product-seoTitle" className={inputClass} value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} />
          </div>
          <div>
            <label htmlFor="product-seoDescription" className={labelClass}>搜索描述 / SEO Description</label>
            <textarea id="product-seoDescription" className={inputClass + " h-16 py-2"} value={form.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} />
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div>
          {!isNew && (
            confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-600 font-medium">确认删除此产品？</span>
                <button type="button" onClick={handleDelete} disabled={saving} className="px-3 h-9 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 disabled:opacity-50">
                  {saving ? "正在删除…" : "确认删除"}
                </button>
                <button type="button" onClick={() => setConfirmDelete(false)} className="px-3 h-9 rounded-lg border border-[#E5E7EB] text-xs font-bold text-[#374151]">
                  取消
                </button>
              </div>
            ) : (
              <button type="button" onClick={handleDelete} className="px-4 h-10 rounded-lg border border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 transition-colors">
                删除产品
              </button>
            )
          )}
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()} className="px-6 h-11 rounded-lg border border-[#E5E7EB] text-sm font-bold text-[#374151]">
            取消
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e as unknown as React.FormEvent, false)}
            disabled={saving}
            className="px-6 h-11 rounded-lg border border-[#ED7606] text-[#ED7606] text-sm font-bold hover:bg-[#FFF1E3] disabled:opacity-50 transition-colors"
          >
            {saving ? "正在保存…" : "保存并继续编辑"}
          </button>
          <button type="submit" disabled={saving} className="px-6 h-11 rounded-lg bg-[#ED7606] text-white text-sm font-bold hover:bg-[#D46900] disabled:opacity-50 transition-colors">
            {saving ? "正在保存…" : isNew ? "创建产品" : "保存修改"}
          </button>
        </div>
      </div>
    </form>
  );
}
