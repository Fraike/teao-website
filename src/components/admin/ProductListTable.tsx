"use client";

import { productCategoryLabel } from "./publishing-labels";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProductRow {
  id: number;
  model: string;
  name: string;
  category: string;
  isActive: number;
  sortOrder: number;
}

export default function ProductListTable({ data }: { data: ProductRow[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    return data.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        if (!p.model.toLowerCase().includes(q) && !p.name.toLowerCase().includes(q)) return false;
      }
      if (categoryFilter && p.category !== categoryFilter) return false;
      if (statusFilter === "active" && !p.isActive) return false;
      if (statusFilter === "draft" && p.isActive) return false;
      return true;
    });
  }, [data, search, categoryFilter, statusFilter]);

  const categories = useMemo(() => {
    const set = new Set(data.map((p) => p.category));
    return Array.from(set).sort();
  }, [data]);

  function toggleSelect(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((p) => p.id)));
    }
  }

  async function deleteProduct(id: number) {
    setDeleting(true);
    setError("");
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      setError("删除失败");
    }
    setDeleting(false);
  }

  async function batchDelete() {
    if (selected.size === 0) return;
    if (!confirm(`确认删除选中的 ${selected.size} 个产品？`)) return;
    setDeleting(true);
    setError("");
    for (const id of selected) {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
    }
    setSelected(new Set());
    router.refresh();
    setDeleting(false);
  }

  async function batchSetActive(active: boolean) {
    if (selected.size === 0) return;
    setDeleting(true);
    for (const id of selected) {
      await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: active ? 1 : 0 }),
      });
    }
    setSelected(new Set());
    router.refresh();
    setDeleting(false);
  }

  const inputClass = "h-9 px-3 rounded-lg border border-[#E5E7EB] text-xs focus:outline-none focus:border-[#ED7606]";

  return (
    <div>
      {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">{error}</div>}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          className={inputClass + " w-56"}
          placeholder="搜索型号或产品名称…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className={inputClass} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">全部分类</option>
          {categories.map((c) => (
            <option key={c} value={c}>{productCategoryLabel(c)}</option>
          ))}
        </select>
        <select className={inputClass} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">全部状态</option>
          <option value="active">已上架</option>
          <option value="draft">草稿</option>
        </select>
        <span className="text-xs text-[#9CA3AF] self-center ml-auto">
          显示 {filtered.length} / {data.length} 个产品
        </span>
      </div>

      {/* Batch actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 mb-4 px-4 py-2 rounded-lg bg-[#FFF1E3] border border-[#ED7606]/20">
          <span className="text-xs font-bold text-[#ED7606]">已选中 {selected.size} 项</span>
          <button onClick={() => batchSetActive(true)} disabled={deleting} className="text-xs font-bold text-green-600 hover:underline disabled:opacity-50">
            批量上架
          </button>
          <button onClick={() => batchSetActive(false)} disabled={deleting} className="text-xs font-bold text-[#9CA3AF] hover:underline disabled:opacity-50">
            批量转为草稿
          </button>
          <button onClick={batchDelete} disabled={deleting} className="text-xs font-bold text-red-600 hover:underline disabled:opacity-50">
            删除
          </button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">
        {filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-[#9CA3AF]">未找到产品。</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#F8F9FA] border-b border-[#E5E7EB]">
              <tr>
                <th className="w-10 px-4 py-3">
                  <input type="checkbox" checked={selected.size > 0 && selected.size === filtered.length} onChange={toggleAll} className="rounded" />
                </th>
                <th className="text-left px-4 py-3 text-xs font-black text-[#9CA3AF] uppercase tracking-[0.08em]">型号</th>
                <th className="text-left px-4 py-3 text-xs font-black text-[#9CA3AF] uppercase tracking-[0.08em]">产品名称</th>
                <th className="text-left px-4 py-3 text-xs font-black text-[#9CA3AF] uppercase tracking-[0.08em]">分类</th>
                <th className="text-left px-4 py-3 text-xs font-black text-[#9CA3AF] uppercase tracking-[0.08em]">状态</th>
                <th className="text-right px-4 py-3 text-xs font-black text-[#9CA3AF] uppercase tracking-[0.08em]">排序</th>
                <th className="text-right px-4 py-3 text-xs font-black text-[#9CA3AF] uppercase tracking-[0.08em]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filtered.map((p) => (
                <tr key={p.id} className={`hover:bg-[#F8F9FA] ${selected.has(p.id) ? "bg-[#FFF1E3]" : ""}`}>
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleSelect(p.id)} className="rounded" />
                  </td>
                  <td className="px-4 py-3 font-bold text-[#ED7606]">{p.model}</td>
                  <td className="px-4 py-3 text-[#374151] max-w-[300px] truncate">{p.name}</td>
                  <td className="px-4 py-3 text-[#6B7280] text-xs">{productCategoryLabel(p.category)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${p.isActive ? "bg-green-100 text-green-700" : "bg-[#F3F4F6] text-[#9CA3AF]"}`}>
                      {p.isActive ? "已上架" : "草稿"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-[#9CA3AF]">{p.sortOrder}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Link href={`/admin/products/${p.id}`} className="text-[#ED7606] font-bold text-xs hover:underline">
                      编辑
                    </Link>
                    <button onClick={() => { if (confirm("确认删除此产品？")) deleteProduct(p.id); }} disabled={deleting} className="text-red-500 font-bold text-xs hover:underline disabled:opacity-50">
                      删除
                    </button>
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
