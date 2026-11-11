import { db } from "@/db";
import { analyticsEvents, contactInquiries } from "@/db/schema";
import { sql } from "drizzle-orm";

const eventLabels: Record<string, string> = {
  page_view: "页面浏览",
  product_click: "产品点击",
  category_click: "分类点击",
  scene_click: "应用场景点击",
  cta_click: "行动按钮点击",
  search: "站内搜索",
  search_open: "打开搜索",
  search_result_click: "搜索结果点击",
  form_submit: "表单提交",
  form_save_failed: "表单保存失败",
};

const sourceLabels: Record<string, string> = {
  header: "顶部导航",
  product_detail: "产品详情页",
  category_selection: "分类页选型区",
  related_products: "关联产品",
  article_selection: "文章选型区",
  product_list: "产品列表",
  mobile_card: "移动端产品卡片",
  map_hotspot: "应用地图热点",
  mobile_chip: "移动端快捷入口",
  automotive_scene: "汽车应用场景",
};

export default async function AnalyticsDashboard() {
  const now = Date.now();
  const last7d = Math.floor(now / 1000) - 7 * 24 * 60 * 60;
  const last30d = Math.floor(now / 1000) - 30 * 24 * 60 * 60;

  // Overview stats
  const [allEvents] = await db.select({ count: sql<number>`count(*)` }).from(analyticsEvents).all();
  const [pageViewRow] = await db.select({ count: sql<number>`count(*)` }).from(analyticsEvents).where(sql`event = 'page_view'`).all();
  const [sessionRow] = await db.select({ count: sql<number>`count(DISTINCT session_id)` }).from(analyticsEvents).all();

  const totalEvents = allEvents?.count ?? 0;
  const totalPageViews = pageViewRow?.count ?? 0;
  const totalSessions = sessionRow?.count ?? 0;

  // Last 7 days
  const [weekPV] = await db.select({ count: sql<number>`count(*)` }).from(analyticsEvents)
    .where(sql`event = 'page_view' AND created_at >= ${last7d}`).all();
  const [weekFS] = await db.select({ count: sql<number>`count(*)` }).from(contactInquiries)
    .where(sql`created_at >= ${last7d}`).all();

  const weekPageViews = weekPV?.count ?? 0;
  const weekFormSubmits = weekFS?.count ?? 0;
  const convRate = weekPageViews > 0 ? ((weekFormSubmits / weekPageViews) * 100).toFixed(1) : "0.0";

  // Top products by clicks (last 30 days)
  const topProducts = await db.select({
    targetId: analyticsEvents.targetId,
    count: sql<number>`count(*)`.as("cnt"),
  }).from(analyticsEvents)
    .where(sql`event = 'product_click' AND target_id IS NOT NULL AND created_at >= ${last30d}`)
    .groupBy(analyticsEvents.targetId)
    .orderBy(sql`cnt DESC`)
    .limit(10)
    .all() as { targetId: string | null; count: number }[];

  // Top pages by views (last 30 days)
  const topPages = await db.select({
    page: analyticsEvents.page,
    count: sql<number>`count(*)`.as("cnt"),
  }).from(analyticsEvents)
    .where(sql`event = 'page_view' AND created_at >= ${last30d}`)
    .groupBy(analyticsEvents.page)
    .orderBy(sql`cnt DESC`)
    .limit(10)
    .all() as { page: string | null; count: number }[];

  // Event type distribution (last 30 days)
  const eventDistribution = await db.select({
    event: analyticsEvents.event,
    count: sql<number>`count(*)`.as("cnt"),
  }).from(analyticsEvents)
    .where(sql`created_at >= ${last30d}`)
    .groupBy(analyticsEvents.event)
    .orderBy(sql`cnt DESC`)
    .all() as { event: string | null; count: number }[];

  // Source breakdown (last 30 days)
  const sourceBreakdown = await db.select({
    source: analyticsEvents.source,
    count: sql<number>`count(*)`.as("cnt"),
  }).from(analyticsEvents)
    .where(sql`source IS NOT NULL AND created_at >= ${last30d}`)
    .groupBy(analyticsEvents.source)
    .orderBy(sql`cnt DESC`)
    .all() as { source: string | null; count: number }[];

  // Funnel
  const [productClicksRow] = await db.select({ count: sql<number>`count(*)` }).from(analyticsEvents)
    .where(sql`event = 'product_click' AND created_at >= ${last7d}`).all();
  const [ctaClicksRow] = await db.select({ count: sql<number>`count(*)` }).from(analyticsEvents)
    .where(sql`event = 'cta_click' AND created_at >= ${last7d}`).all();

  const funnelSteps = [
    { label: "页面浏览量", count: weekPageViews },
    { label: "产品点击量", count: productClicksRow?.count ?? 0 },
    { label: "行动按钮点击量", count: ctaClicksRow?.count ?? 0 },
    { label: "表单提交量", count: weekFormSubmits },
  ];

  const maxFunnel = Math.max(...funnelSteps.map((s) => s.count), 1);

  return (
    <div>
      <h1 className="text-2xl font-black text-[#111827] mb-8">访问统计</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="事件总数" value={totalEvents.toLocaleString("zh-CN")} />
        <StatCard label="页面浏览量" value={totalPageViews.toLocaleString("zh-CN")} subtitle="累计" />
        <StatCard label="独立会话数" value={totalSessions.toLocaleString("zh-CN")} />
        <StatCard label="询盘转化率" value={`${convRate}%`} subtitle={`近 7 天 ${weekFormSubmits} 次提交 / ${weekPageViews} 次浏览`} accent />
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Top Products */}
        <section>
          <h2 className="text-sm font-black text-[#111827] uppercase tracking-[0.1em] mb-3">热门产品（近 30 天）</h2>
          <div className="rounded-lg border border-[#E5E7EB] bg-white overflow-hidden">
            {topProducts.length === 0 ? (
              <p className="p-4 text-sm text-[#9CA3AF]">暂无数据</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F8F9FA]">
                    <th className="text-left px-4 py-2.5 text-xs font-black text-[#6B7280] uppercase">产品</th>
                    <th className="text-right px-4 py-2.5 text-xs font-black text-[#6B7280] uppercase">点击量</th>
                    <th className="hidden sm:table-cell px-4 py-2.5 text-xs font-black text-[#6B7280] uppercase" />
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p, i) => (
                    <tr key={p.targetId} className="border-b border-[#F3F4F6] last:border-0">
                      <td className="px-4 py-2.5 font-bold text-[#111827] flex items-center gap-2">
                        <span className="text-[10px] text-[#9CA3AF] w-5">{i + 1}</span>
                        {p.targetId}
                      </td>
                      <td className="px-4 py-2.5 text-right font-extrabold text-[#111827] tabular-nums">{p.count}</td>
                      <td className="hidden sm:table-cell px-4 py-2.5">
                        <div className="w-full max-w-[80px] h-1.5 rounded-full bg-[#F3F4F6]">
                          <div
                            className="h-full rounded-full bg-[#ED7606]"
                            style={{ width: `${Math.min(100, (p.count / Math.max(...topProducts.map((x) => x.count), 1)) * 100)}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Top Pages */}
        <section>
          <h2 className="text-sm font-black text-[#111827] uppercase tracking-[0.1em] mb-3">热门页面（近 30 天）</h2>
          <div className="rounded-lg border border-[#E5E7EB] bg-white overflow-hidden">
            {topPages.length === 0 ? (
              <p className="p-4 text-sm text-[#9CA3AF]">暂无数据</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F8F9FA]">
                    <th className="text-left px-4 py-2.5 text-xs font-black text-[#6B7280] uppercase">页面</th>
                    <th className="text-right px-4 py-2.5 text-xs font-black text-[#6B7280] uppercase">浏览量</th>
                    <th className="hidden sm:table-cell px-4 py-2.5 text-xs font-black text-[#6B7280] uppercase" />
                  </tr>
                </thead>
                <tbody>
                  {topPages.map((p, i) => (
                    <tr key={p.page} className="border-b border-[#F3F4F6] last:border-0">
                      <td className="px-4 py-2.5 font-bold text-[#111827] flex items-center gap-2">
                        <span className="text-[10px] text-[#9CA3AF] w-5">{i + 1}</span>
                        <span className="truncate max-w-[200px]">{p.page}</span>
                      </td>
                      <td className="px-4 py-2.5 text-right font-extrabold text-[#111827] tabular-nums">{p.count}</td>
                      <td className="hidden sm:table-cell px-4 py-2.5">
                        <div className="w-full max-w-[80px] h-1.5 rounded-full bg-[#F3F4F6]">
                          <div
                            className="h-full rounded-full bg-[#ED7606]"
                            style={{ width: `${Math.min(100, (p.count / Math.max(...topPages.map((x) => x.count), 1)) * 100)}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Event Distribution */}
        <section>
          <h2 className="text-sm font-black text-[#111827] uppercase tracking-[0.1em] mb-3">事件分布（近 30 天）</h2>
          <div className="rounded-lg border border-[#E5E7EB] bg-white p-4">
            {eventDistribution.length === 0 ? (
              <p className="text-sm text-[#9CA3AF]">暂无数据</p>
            ) : (
              <div className="space-y-3">
                {eventDistribution.map((e) => (
                  <div key={e.event} className="flex items-center gap-3">
                    <span className="w-24 text-xs font-bold text-[#6B7280] capitalize">{eventLabels[e.event ?? ""] ?? e.event ?? "未知事件"}</span>
                    <div className="flex-1 h-2.5 rounded-full bg-[#F3F4F6]">
                      <div
                        className="h-full rounded-full bg-[#111827]"
                        style={{ width: `${Math.min(100, (e.count / Math.max(...eventDistribution.map((x) => x.count), 1)) * 100)}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-xs font-extrabold text-[#111827] tabular-nums">{e.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Source Breakdown */}
        <section>
          <h2 className="text-sm font-black text-[#111827] uppercase tracking-[0.1em] mb-3">流量来源（近 30 天）</h2>
          <div className="rounded-lg border border-[#E5E7EB] bg-white p-4">
            {sourceBreakdown.length === 0 ? (
              <p className="text-sm text-[#9CA3AF]">暂无数据</p>
            ) : (
              <div className="space-y-3">
                {sourceBreakdown.map((s) => (
                  <div key={s.source} className="flex items-center gap-3">
                    <span className="w-28 text-xs font-bold text-[#6B7280] capitalize">{sourceLabels[s.source ?? ""] ?? s.source}</span>
                    <div className="flex-1 h-2.5 rounded-full bg-[#F3F4F6]">
                      <div
                        className="h-full rounded-full bg-[#ED7606]"
                        style={{ width: `${Math.min(100, (s.count / Math.max(...sourceBreakdown.map((x) => x.count), 1)) * 100)}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-xs font-extrabold text-[#111827] tabular-nums">{s.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Conversion Funnel */}
      <section>
        <h2 className="text-sm font-black text-[#111827] uppercase tracking-[0.1em] mb-3">转化漏斗（近 7 天）</h2>
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-6">
          <div className="flex items-end gap-4 lg:gap-8">
            {funnelSteps.map((step, i) => (
              <div key={step.label} className="flex-1 text-center">
                <div
                  className="mx-auto rounded-lg bg-[#ED7606] transition-all"
                  style={{
                    height: `${Math.max(8, (step.count / maxFunnel) * 120)}px`,
                    opacity: 0.25 + (i / funnelSteps.length) * 0.75,
                    maxWidth: "80px",
                  }}
                />
                <p className="mt-2 text-xs font-bold text-[#6B7280]">{step.label}</p>
                <p className="text-lg font-black text-[#111827] tabular-nums">{step.count.toLocaleString("zh-CN")}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, subtitle, accent }: {
  label: string;
  value: string;
  subtitle?: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-lg border p-4 ${accent ? "border-[#ED7606]/30 bg-[#FFFAF5]" : "border-[#E5E7EB] bg-white"}`}>
      <p className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-[0.1em]">{label}</p>
      <p className={`mt-1 text-2xl font-black tabular-nums ${accent ? "text-[#ED7606]" : "text-[#111827]"}`}>{value}</p>
      {subtitle && <p className="mt-0.5 text-[10px] text-[#9CA3AF]">{subtitle}</p>}
    </div>
  );
}
