import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-black text-[#111827] mb-6">后台首页</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href="/admin/search-console"
          className="p-6 rounded-xl border border-[#E5E7EB] bg-white hover:-translate-y-0.5 hover:border-[#ED7606]/30 hover:shadow-md transition-all duration-300"
        >
          <span className="text-[#ED7606] text-xs font-black uppercase tracking-[0.14em]">搜索推广</span>
          <h2 className="mt-2 text-lg font-extrabold text-[#111827]">Google 搜索数据</h2>
          <p className="mt-1 text-sm text-[#6B7280]">连接 Google，查看查询词、落地页及同步状态</p>
        </Link>
        <Link
          href="/admin/operations"
          className="p-6 rounded-xl border border-[#E5E7EB] bg-white hover:-translate-y-0.5 hover:border-[#ED7606]/30 hover:shadow-md transition-all duration-300"
        >
          <span className="text-[#ED7606] text-xs font-black uppercase tracking-[0.14em]">监控</span>
          <h2 className="mt-2 text-lg font-extrabold text-[#111827]">网站运营</h2>
          <p className="mt-1 text-sm text-[#6B7280]">查看有效询盘、回复时效和邮件异常</p>
        </Link>
        <Link
          href="/admin/products"
          className="p-6 rounded-xl border border-[#E5E7EB] bg-white hover:-translate-y-0.5 hover:border-[#ED7606]/30 hover:shadow-md transition-all duration-300"
        >
          <span className="text-[#ED7606] text-xs font-black uppercase tracking-[0.14em]">目录</span>
          <h2 className="mt-2 text-lg font-extrabold text-[#111827]">商品管理</h2>
          <p className="mt-1 text-sm text-[#6B7280]">发布和维护产品目录</p>
        </Link>
        <Link
          href="/admin/news"
          className="p-6 rounded-xl border border-[#E5E7EB] bg-white hover:-translate-y-0.5 hover:border-[#ED7606]/30 hover:shadow-md transition-all duration-300"
        >
          <span className="text-[#ED7606] text-xs font-black uppercase tracking-[0.14em]">发布</span>
          <h2 className="mt-2 text-lg font-extrabold text-[#111827]">文章管理</h2>
          <p className="mt-1 text-sm text-[#6B7280]">编辑并发布技术文章和新闻</p>
        </Link>
        <Link
          href="/admin/inquiries"
          className="p-6 rounded-xl border border-[#E5E7EB] bg-white hover:-translate-y-0.5 hover:border-[#ED7606]/30 hover:shadow-md transition-all duration-300"
        >
          <span className="text-[#ED7606] text-xs font-black uppercase tracking-[0.14em]">跟进</span>
          <h2 className="mt-2 text-lg font-extrabold text-[#111827]">询盘管理</h2>
          <p className="mt-1 text-sm text-[#6B7280]">跟进询盘、审核回复草稿并查看邮件记录</p>
        </Link>
        <Link
          href="/admin/analytics"
          className="p-6 rounded-xl border border-[#E5E7EB] bg-white hover:-translate-y-0.5 hover:border-[#ED7606]/30 hover:shadow-md transition-all duration-300"
        >
          <span className="text-[#ED7606] text-xs font-black uppercase tracking-[0.14em]">数据</span>
          <h2 className="mt-2 text-lg font-extrabold text-[#111827]">访问统计</h2>
          <p className="mt-1 text-sm text-[#6B7280]">查看浏览量与站内互动</p>
        </Link>
        <Link
          href="/admin/media"
          className="p-6 rounded-xl border border-[#E5E7EB] bg-white hover:-translate-y-0.5 hover:border-[#ED7606]/30 hover:shadow-md transition-all duration-300"
        >
          <span className="text-[#ED7606] text-xs font-black uppercase tracking-[0.14em]">素材</span>
          <h2 className="mt-2 text-lg font-extrabold text-[#111827]">媒体库</h2>
          <p className="mt-1 text-sm text-[#6B7280]">上传并管理图片和文件</p>
        </Link>
      </div>
    </div>
  );
}
