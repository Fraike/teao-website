"use client";

import { useEffect, useState } from "react";
import { adminErrorLabel, inquiryChannelLabels, inquiryQualityLabels, inquiryStatusLabels, mailKindLabels, mailStatusLabels } from "@/lib/admin-labels";
import { parseInquiryAttribution } from "@/lib/inquiry-attribution";

type Draft = { body: string; version: string; sources: { title: string; path: string }[] };
type MailJob = {
  id: string; kind: string; status: string; retryable: boolean;
  body: string | null; approvedBy: string | null; lastError: string | null;
  sentAt: string | null;
};
type Details = { draft: Draft | null; mail: MailJob[] };

const button = "rounded border border-slate-300 px-3 py-2 text-sm font-semibold disabled:opacity-40";
const select = "block rounded border border-slate-300 bg-white px-2 py-1.5";

export function InquiryFollowUp({ id, email, status, quality, attribution, onUpdate }: {
  id: number; email: string; status: string; quality: string; attribution: string | null; onUpdate: () => Promise<void>;
}) {
  const [details, setDetails] = useState<Details | null>(null);
  const [body, setBody] = useState("");
  const [state, setState] = useState(status);
  const [rating, setRating] = useState(quality);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const source = attribution ? parseInquiryAttribution(JSON.parse(attribution)) : null;

  async function loadDetails(signal?: AbortSignal) {
    const response = await fetch(`/api/admin/inquiries?id=${id}`, { signal, cache: "no-store" });
    if (!response.ok) throw new Error("无法加载跟进记录，请重试。");
    return await response.json() as Details;
  }

  useEffect(() => {
    const controller = new AbortController();
    loadDetails(controller.signal).then(data => {
      setDetails(data);
      setBody(data.draft?.body ?? "");
    }).catch(() => {
      if (!controller.signal.aborted) setError("无法加载跟进记录，请重试。");
    });
    return () => controller.abort();
    // Each expanded row is mounted for a single inquiry.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function change(action: string, values: Record<string, unknown>, success: string, reloadDraft = false) {
    setBusy(true);
    setNotice("");
    setError("");
    try {
      const response = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, ...values }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "操作失败，请重试。");
      setNotice(success);
      const data = await loadDetails();
      setDetails(data);
      if (reloadDraft) setBody(data.draft?.body ?? "");
      if (action === "update" || action === "approve") await onUpdate();
    } catch (failure) {
      setError(adminErrorLabel(failure instanceof Error ? failure.message : "", "操作失败，请重试。"));
    } finally {
      setBusy(false);
    }
  }

  const draft = details?.draft;
  const version = draft?.version ?? null;

  return (
    <section className="mt-4 space-y-4 border-t border-slate-200 pt-4">
      {source && (
        <p className="break-words text-sm text-slate-600">
          {inquiryChannelLabels[source.channel] ?? source.channel} · {source.source ?? "未知来源"} · {source.landingPage} → {source.submissionPage ?? "未知提交页面"}
          {source.campaign ? ` · ${source.campaign}` : ""}
        </p>
      )}
      <div className="flex flex-wrap items-end gap-3 text-sm">
        <label>跟进状态
          <select className={select} value={state} onChange={event => setState(event.target.value)}>
            {Object.entries(inquiryStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label>询盘质量
          <select className={select} value={rating} onChange={event => setRating(event.target.value)}>
            {Object.entries(inquiryQualityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <button className={button} disabled={busy} onClick={() => void change("update", { status: state, quality: rating }, "询盘已更新。")}>保存跟进状态</button>
      </div>
      <div>
        <label className="block text-sm font-semibold" htmlFor={`draft-${id}`}>客户回复草稿</label>
        <textarea id={`draft-${id}`} rows={6} maxLength={8000} disabled={busy || !details}
          className="mt-2 w-full rounded border border-slate-300 p-2 text-sm" value={body}
          onChange={event => setBody(event.target.value)} />
        <p className="text-xs text-slate-600">发送前请核对型号、规格、报价和交期。</p>
        {!!draft?.sources.length && <ul className="mt-2 flex flex-wrap gap-3 text-xs">
          {draft.sources.map(source => <li key={source.title}><a className="text-[#a94311] underline" href={source.path} target="_blank" rel="noreferrer">{source.title}</a></li>)}
        </ul>}
        <div className="mt-3 flex flex-wrap gap-2">
          <button className={button} disabled={busy || !details}
            onClick={() => {
              if (body.trim() && !confirm("确定替换当前回复草稿吗？")) return;
              void change("generate", { version }, "草稿已生成。", true);
            }}>{draft ? "重新生成草稿" : "生成草稿"}</button>
          <button className={button} disabled={busy || !details || !body.trim() || body === draft?.body}
            onClick={() => void change("save", { version, body }, "草稿已保存。", true)}>保存草稿</button>
          <button className={`${button} bg-slate-900 text-white`} disabled={busy || !draft || body !== draft.body}
            onClick={() => {
              if (confirm(`确定审核通过并向 ${email} 发送已保存的回复吗？`)) {
                void change("approve", { version }, "已审核通过，回复已加入发送队列。", true);
              }
            }}>审核并发送</button>
        </div>
      </div>
      {!!details?.mail.length && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">邮件记录</h3>
          {details.mail.map(job => (
            <div key={job.id} className="rounded bg-slate-50 px-3 py-2 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="capitalize">{mailKindLabels[job.kind] ?? job.kind} · {mailStatusLabels[job.status] ?? job.status}</span>
                {job.approvedBy && <span>审核人 {job.approvedBy}</span>}
                {job.sentAt && <time>{new Date(job.sentAt).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}</time>}
                {job.retryable && <button className={button} disabled={busy}
                  onClick={() => void change("retry", { jobId: job.id }, "邮件已加入重试队列。")}>重试发送</button>}
              </div>
              {job.lastError && <p className="text-red-700">{adminErrorLabel(job.lastError, "邮件处理失败，请检查发送配置或服务商记录。")}</p>}
              {job.body && <details className="mt-1"><summary>已审核的邮件正文</summary><p className="whitespace-pre-wrap">{job.body}</p></details>}
            </div>
          ))}
        </div>
      )}
      {notice && <p role="status" className="text-sm text-emerald-800">{notice}</p>}
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    </section>
  );
}
