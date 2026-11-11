"use client";

import { useEffect, useState, useCallback } from "react";
import { inquiryStatusLabels, productInterestLabel } from "@/lib/admin-labels";
import { InquiryFollowUp } from "./InquiryFollowUp";
import { Mail, Building2, Phone, MapPin, Package, Hash, Trash2, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

interface Inquiry {
  id: number;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  country: string | null;
  productInterest: string | null;
  annualVolume: string | null;
  message: string;
  createdAt: string;
  status: string;
  quality: string;
  attribution: string | null;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/inquiries");
    if (res.ok) {
      const data = await res.json();
      setInquiries(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleDelete = async (id: number) => {
    if (!confirm("确定删除这条询盘吗？")) return;
    const res = await fetch("/api/admin/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setInquiries((prev) => prev.filter((i) => i.id !== id));
      setError("");
    } else {
      const data = await res.json();
      setError(data.error || "无法删除询盘，请重试。");
    }
  };

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const formatDate = (ts: string) => {
    return new Date(ts).toLocaleString("zh-CN", {
      month: "numeric",
      timeZone: "Asia/Shanghai",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#111827]">询盘管理</h1>
          <p className="text-sm text-[#6B7280] mt-1">共 {inquiries.length} 条询盘</p>
        </div>
        <button
          onClick={fetchInquiries}
          className="flex items-center gap-2 h-10 px-4 rounded-lg border border-[#E5E7EB] bg-white text-sm font-bold text-[#6B7280] hover:border-[#ED7606]/30 hover:text-[#ED7606] transition-colors"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          刷新
        </button>
      </div>

      {error && <p role="alert" className="mb-3 text-sm text-red-700">{error}</p>}

      {loading && inquiries.length === 0 ? (
        <div className="text-center py-12 text-[#9CA3AF] text-sm">加载中…</div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-12 text-[#9CA3AF] text-sm">暂无询盘。</div>
      ) : (
        <div className="space-y-2.5">
          {inquiries.map((inq) => {
            const isExpanded = expanded.has(inq.id);
            return (
              <div
                key={inq.id}
                className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden"
              >
                {/* Header */}
                <div
                  className="flex items-center gap-3 p-4 cursor-pointer hover:bg-[#F8F9FA] transition-colors"
                  onClick={() => toggleExpand(inq.id)}
                >
                  <div className="w-9 h-9 rounded-lg bg-[#FFF1E3] flex items-center justify-center shrink-0">
                    <Mail size={16} className="text-[#ED7606]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-[#111827] text-sm">{inq.name}</span>
                      {inq.company && (
                        <span className="text-xs text-[#6B7280] flex items-center gap-1">
                          <Building2 size={11} />
                          {inq.company}
                        </span>
                      )}
                      {inq.productInterest && (
                        <span className="px-1.5 py-0.5 rounded bg-[#FFF1E3] text-[#ED7606] text-[10px] font-bold">
                          {productInterestLabel(inq.productInterest)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">
                      #{inq.id} · {inq.email} · {formatDate(inq.createdAt)} · {inquiryStatusLabels[inq.status] ?? inq.status}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(inq.id);
                    }}
                    className="shrink-0 p-2 rounded-lg text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="删除询盘"
                  >
                    <Trash2 size={14} />
                  </button>
                  {isExpanded ? <ChevronUp size={16} className="text-[#9CA3AF]" /> : <ChevronDown size={16} className="text-[#9CA3AF]" />}
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-[#F0F0F0]">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 mt-3 text-xs">
                      <div className="flex items-center gap-1.5 text-[#6B7280]">
                        <Mail size={12} />
                        <a href={`mailto:${inq.email}`} className="text-[#ED7606] hover:underline font-medium">{inq.email}</a>
                      </div>
                      {inq.phone && (
                        <div className="flex items-center gap-1.5 text-[#6B7280]">
                          <Phone size={12} />{inq.phone}
                        </div>
                      )}
                      {inq.country && (
                        <div className="flex items-center gap-1.5 text-[#6B7280]">
                          <MapPin size={12} />{inq.country}
                        </div>
                      )}
                      {inq.productInterest && (
                        <div className="flex items-center gap-1.5 text-[#6B7280]">
                          <Package size={12} />{productInterestLabel(inq.productInterest)}
                        </div>
                      )}
                      {inq.annualVolume && (
                        <div className="flex items-center gap-1.5 text-[#6B7280]">
                          <Hash size={12} />{inq.annualVolume}
                        </div>
                      )}
                    </div>
                    <div className="mt-3 p-3 rounded-lg bg-[#F8F9FA] text-sm text-[#374151] leading-relaxed whitespace-pre-wrap">
                      {inq.message}
                    </div>
                    <InquiryFollowUp id={inq.id} email={inq.email} status={inq.status} quality={inq.quality} attribution={inq.attribution} onUpdate={fetchInquiries} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
