import Link from "next/link";
import { db } from "@/db";
import { adminErrorLabel, inquiryChannelLabels, mailKindLabels, mailStatusLabels } from "@/lib/admin-labels";
import { recordPageChange } from "./actions";
import { getOperationsSummary, inquiryReplyHours } from "@/lib/website-operations";

export const dynamic = "force-dynamic";

export default async function OperationsPage() {
  const [summary, changes] = await Promise.all([
    getOperationsSummary(),
    db.$client.execute("SELECT id, changed_on, page, summary FROM website_operations_changes ORDER BY changed_on DESC, id DESC LIMIT 30"),
  ]);
  const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Shanghai" }).format(new Date());
  const metrics = [
    ["待处理询盘", summary.open],
    ["待审核草稿", summary.drafts],
    [`超过 ${inquiryReplyHours()} 小时未人工回复`, summary.overdue],
    ["平均首次人工回复时间（近 28 天）", summary.replyHours === null ? "—" : `${summary.replyHours.toFixed(1)} 小时`],
    ["自然搜索有效询盘（近 28 天）", summary.organicCurrent],
    ["自然搜索有效询盘（上一个 28 天）", summary.organicPrior],
  ];

  return (
    <div className="space-y-7">
      <header>
        <h1 className="text-2xl font-black">网站运营</h1>
        <p className="mt-2 text-sm text-slate-600">查看获客渠道、询盘跟进和邮件投递情况。</p>
        <div className="mt-3 flex flex-wrap gap-4 text-sm font-semibold text-[#a94311]">
          <Link href="/admin/search-console">Google 搜索数据</Link>
          <Link href="/admin/inquiries">管理询盘</Link>
        </div>
      </header>
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="询盘指标">
        {metrics.map(([label, value]) => (
          <div key={label} className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-600">{label}</p>
            <p className="mt-2 text-2xl font-bold">{value}</p>
          </div>
        ))}
      </section>
      <section>
        <h2 className="mb-3 text-lg font-bold">询盘落地页及渠道（近 28 天）</h2>
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>{["渠道", "落地页", "询盘数", "有效询盘数"].map(label => <th key={label} className="p-3">{label}</th>)}</tr>
            </thead>
            <tbody>
              {summary.sources.map(row => (
                <tr key={JSON.stringify([row.channel, row.landing])} className="border-t border-slate-100">
                  <td className="p-3">{inquiryChannelLabels[String(row.channel)] ?? String(row.channel)}</td><td className="p-3">{String(row.landing)}</td>
                  <td className="p-3">{Number(row.inquiries)}</td><td className="p-3">{Number(row.valid)}</td>
                </tr>
              ))}
              {!summary.sources.length && <tr><td className="p-3" colSpan={4}>本期暂无询盘。</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-bold">页面变更记录</h2>
        <form action={recordPageChange} className="mt-3 grid gap-3 sm:grid-cols-[auto_1fr_2fr_auto]">
          <input aria-label="变更日期" name="changedOn" type="date" defaultValue={today} required className="rounded border border-slate-300 p-2 text-sm" />
          <input aria-label="页面路径" name="page" placeholder="/gear-damper" maxLength={300} required className="rounded border border-slate-300 p-2 text-sm" />
          <input aria-label="变更说明" name="summary" placeholder="请简述页面变更内容" maxLength={300} required className="rounded border border-slate-300 p-2 text-sm" />
          <button className="rounded bg-slate-900 px-3 py-2 text-sm font-semibold text-white">记录变更</button>
        </form>
        <ul className="mt-3 space-y-2 text-sm">
          {changes.rows.map(row => (
            <li key={Number(row.id)}><time>{String(row.changed_on)}</time> · {String(row.page)} · {String(row.summary)}</li>
          ))}
        </ul>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-bold">系统状态</h2>
        <p className="mt-2 text-sm">表单保存失败（近 24 小时）{summary.formFailures} 次 · 等待超过 15 分钟的邮件任务 {summary.backlog} 个</p>
        <ul className="mt-3 space-y-1 text-sm">
          {summary.jobs.map(row => (
            <li key={String(row.name)}>
              {row.name === "search-console" ? "Google 搜索数据" : "询盘邮件"}{" "}
              {row.last_error ? adminErrorLabel(String(row.last_error), "任务执行失败，请检查配置或服务日志。") : "上次成功运行"}{" "}
              {row.last_success_at && new Date(Number(row.last_success_at) * 1000).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai", dateStyle: "short", timeStyle: "short" }) + "（北京时间）"}
            </li>
          ))}
          {!summary.jobs.length && <li>等待定时任务首次运行。</li>}
        </ul>
        <h3 className="mt-5 font-semibold">邮件处理结果</h3>
        <ul className="mt-2 space-y-1 text-sm">
          {summary.mail.map(row => <li key={`${row.kind}/${row.status}`} className="capitalize">{mailKindLabels[String(row.kind)] ?? String(row.kind)} · {mailStatusLabels[String(row.status)] ?? String(row.status)} · {Number(row.count)}</li>)}
          {!summary.mail.length && <li>本期暂无邮件任务。</li>}
        </ul>
      </section>
    </div>
  );
}
