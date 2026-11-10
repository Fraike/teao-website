import { adminErrorLabel } from "@/lib/admin-labels";
import { readSearchConsoleOverview } from "@/lib/search-console";
import { keywordLabels, type SearchMetrics } from "@/lib/search-console-google";
import { getGoogleConfig } from "@/lib/search-console-oauth";
import { SyncButton } from "./SyncButton";

const number = new Intl.NumberFormat("zh-CN");
const dateTime = new Intl.DateTimeFormat("zh-CN", {
  timeZone: "Asia/Shanghai",
  dateStyle: "medium",
  timeStyle: "short",
});

const deviceLabels: Record<string, string> = {
  DESKTOP: "桌面设备",
  MOBILE: "移动设备",
  TABLET: "平板设备",
};

const keywordGroupLabels: Record<string, string> = {
  [keywordLabels["glove-box"]]: "手套箱阻尼器",
  [keywordLabels["rotary-gear"]]: "齿轮式旋转阻尼器",
  [keywordLabels.gear]: "齿轮式阻尼器",
  [keywordLabels.rotary]: "旋转阻尼器",
};

type MetricsRow = Omit<SearchMetrics, "ctr"> & { label: string };

function MetricsTable({ title, rows }: { title: string; rows: MetricsRow[] }) {
  if (!rows.length) return null;
  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <h2 className="px-4 py-3 text-sm font-bold">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[30rem] text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              {["统计维度", "点击次数", "展示次数", "点击率", "平均排名"].map(label => (
                <th key={label} scope="col" className="px-4 py-2 font-medium">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.label} className="border-t border-gray-100">
                <th scope="row" className="max-w-md break-all px-4 py-2 font-medium">{row.label}</th>
                <td className="px-4 py-2 tabular-nums">{number.format(row.clicks)}</td>
                <td className="px-4 py-2 tabular-nums">{number.format(row.impressions)}</td>
                <td className="px-4 py-2 tabular-nums">
                  {row.impressions ? (100 * row.clicks / row.impressions).toFixed(2) + "%" : "—"}
                </td>
                <td className="px-4 py-2 tabular-nums">{row.impressions ? row.position.toFixed(2) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default async function SearchConsolePage({ searchParams }: {
  searchParams: Promise<{ connection?: string }>;
}) {
  const configured = Boolean(getGoogleConfig());
  const { connection } = await searchParams;
  const overview = await readSearchConsoleOverview().catch(() => null);
  const report = overview?.report;
  const connectionNotice = connection === "connected"
    ? "Google 已连接。点击「立即同步」获取历史搜索数据。"
    : connection === "no-property"
      ? "此 Google 账号没有 teao-damper.com 资源的读取权限。"
      : connection === "failed"
        ? "Google 授权未完成，请重新连接。"
        : null;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-black">Google 搜索数据</h1>
        <p className="mt-1 text-sm text-gray-600">展示已定稿的 Google 网页搜索数据。定时任务每天北京时间 10:00 开始同步。</p>
      </header>
      {connectionNotice && <p role="status" className="rounded-lg bg-blue-50 p-3 text-sm">{connectionNotice}</p>}
      {!overview && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm">无法访问搜索数据存储，请检查数据库迁移和连接。</p>}
      {!configured && <p role="status" className="rounded-lg bg-amber-50 p-3 text-sm">请先在 Google Cloud 创建 OAuth 客户端，配置回调地址和令牌加密密钥，然后重启应用。配置完成后，使用有站点读取权限的 Google 账号连接。</p>}
      {overview && (
        <section className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4">
          <dl className="space-y-1 text-sm text-gray-600">
            <div><dt className="inline font-semibold">网站资源</dt><dd className="ml-2 inline">{overview.property ?? "未连接"}</dd></div>
            <div><dt className="inline font-semibold">已定稿数据截至</dt><dd className="ml-2 inline">{report?.end ?? "待同步"}</dd></div>
            <div><dt className="inline font-semibold">上次完整同步（北京时间）</dt><dd className="ml-2 inline">{overview.lastFinished ? dateTime.format(overview.lastFinished) : "待同步"}</dd></div>
            <div><dt className="inline font-semibold">同步状态</dt><dd className="ml-2 inline">{overview.running ? "同步中" : overview.lastError ? "需要处理" : overview.lastFinished ? "已完成" : "待同步"}</dd></div>
            {overview.lastError && <div role="alert" className="text-red-700">{adminErrorLabel(overview.lastError, "搜索数据同步失败，请检查连接后重试。")}</div>}
          </dl>
          {configured && (
            <div className="flex flex-wrap items-start gap-3">
              <form method="post" action="/api/admin/search-console/connect">
                <button type="submit" className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white">
                  {overview.property ? "重新连接 Google" : "连接 Google"}
                </button>
              </form>
              {overview.property && <SyncButton />}
            </div>
          )}
        </section>
      )}
      {report && (
        <>
          <div className="space-y-1 text-sm text-gray-600">
            <p>最近统计期为 {report.start} 至 {report.end}，以 Google 使用的美国太平洋时间为准。</p>
            <p>查询词明细可能不包含匿名数据或搜索量较低的数据。站点总量单独获取。</p>
          </div>
          <MetricsTable title="站点总量" rows={[
            { label: `${report.start} 至 ${report.end}（已记录 ${report.recentDates} 天）`, ...report.recent },
            { label: `${report.previousStart} 至 ${report.previousEnd}（已记录 ${report.previousDates} 天）`, ...report.previous },
          ]} />
          <MetricsTable title="重点产品搜索词" rows={report.keywordRows.map(row => ({
            ...row, label: keywordGroupLabels[row.label] ?? row.label,
          }))} />
          {Object.entries({
            page: "热门落地页",
            query: "热门搜索词",
            country: "主要国家和地区",
            device: "访问设备",
            "query-page": "热门搜索词与落地页组合",
          }).map(([key, title]) => (
            <MetricsTable key={key} title={title} rows={(report.reports[key] ?? []).slice(0, 15).map(row => ({
              ...row, label: row.secondDimension
                ? `${row.dimension} · ${row.secondDimension}`
                : key === "device" ? (deviceLabels[row.dimension.toUpperCase()] ?? row.dimension) : row.dimension,
            }))} />
          ))}
        </>
      )}
    </div>
  );
}
