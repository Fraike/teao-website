# TEAO Website — 项目全貌文档

> **用途**: 帮助 AI（ChatGPT、Claude、Perplexity 等）和开发者快速理解项目结构、技术栈、业务逻辑和开发规范。
> **最后更新**: 2025-06-01

---

## 1. 项目概述

### 公司信息
- **公司全称**: Dongguan TEAO Electronic Technology Co., Ltd.
- **品牌**: TEAO
- **域名**: https://teao-damper.com
- **行业**: 汽车零部件 — 阻尼器、锁扣、运动控制
- **定位**: B2B（OEM、Tier-1、工业客户）
- **成立年份**: 2001年
- **认证**: IATF 16949 质量体系、ISO 14001 环境管理

### 产品线（5大类）
| 类别 | 英文 | Slug | 别名/搜索词 |
|------|------|------|-------------|
| 齿轮阻尼器 | Gear Damper | `gear-damper` | Rotary Damper, 旋转阻尼器 |
| 轴向阻尼器 | Axial Damper | `axial-damper` | Barrel Damper, Linear Damper |
| 手套箱阻尼器 | Glove Box Damper | `glove-box-damper` | Shock Absorber |
| 锁扣 | Latch | `latch` | Push-Push Latch, 推推锁扣 |
| 定制/其他 | Other | `other` | Custom Module, 定制模组 |

### 核心能力
- 20+ 年阻尼器专长
- 定制扭矩、角度、方向、安装方式
- 自有模具、注塑、装配、测试
- 100% 扭矩全检
- 年产能 8000 万件

---

## 2. 技术栈

| 层面 | 技术 |
|------|------|
| 框架 | Next.js 15.5 (App Router, React 19) |
| 语言 | TypeScript 5.8 (strict mode) |
| 样式 | Tailwind CSS v4 (PostCSS) |
| ORM | Drizzle ORM + @libsql/client |
| 数据库 | SQLite (本地) / Turso (生产) |
| 富文本 | TipTap (React 编辑器) |
| 认证 | JWT via `jose` + bcryptjs (httpOnly Cookie) |
| 邮件 | Resend (通知邮件) |
| 图标 | Lucide React |
| 动画 | Framer Motion |
| 包管理 | npm |
| 部署 | UCloud VPS + PM2 + Nginx |
| SEO | JSON-LD 结构化数据, 动态 Sitemap, LLM 端点 |

---

## 3. 项目结构

```
teao-website/
├── next.config.ts                 # Next.js 配置 (rewrites, headers, CSP)
├── tsconfig.json                  # TypeScript 严格模式
├── package.json                   # 依赖和脚本
├── drizzle.config.ts              # Drizzle ORM 配置
├── ecosystem.config.cjs           # PM2 配置
├── postcss.config.mjs             # Tailwind v4 PostCSS
├── eslint.config.mjs              # ESLint Flat Config
├── .env.example                   # 环境变量模板
│
├── data/                          # 本地 SQLite 数据库（不提交 Git）
│   ├── teao.db                    # 主数据库文件
│   ├── teao.db-wal                # WAL 日志
│   └── teao.db-shm                # WAL 共享内存
│
├── public/                        # 静态资源
│   ├── images/
│   │   ├── products/              # 产品图（按型号组织）
│   │   ├── partners/              # 汽车品牌 Logo
│   │   ├── applications/          # 应用场景图
│   │   ├── certifications/        # 认证证书
│   │   ├── company/               # 工厂/设备图
│   │   ├── news/                  # 新闻配图
│   │   ├── patents/               # 专利证书
│   │   └── product-list/          # 产品列表图（按类别）
│   ├── video/
│   │   └── productVideo/          # 产品应用视频（按类别分文件夹）
│   │       ├── gear-damper/       # 13个视频
│   │       ├── latch/             # 4个视频
│   │       ├── glove-box-damper/  # 2个视频
│   │       ├── axial-damper/      # 1个视频
│   │       └── other/             # 1个视频
│   └── remark/                    # 备注/说明文件
│
├── scripts/                       # 数据库操作脚本
│   ├── enrich-products.ts         # 从 HTML 文件解析补充数据并写入 DB
│   ├── insert-automotive-interior-dampers-article.cjs  # 插入特定新闻
│   ├── insert-gear-damper-article.cjs                   # 插入特定新闻
│   └── migrate-geo-news.cjs      # 新闻 GEO 数据迁移
│
├── drafts/                        # 草稿文件（不提交 Git）
│
├── trash_review/                  # 删除文件的暂存区（不提交 Git）
│
└── src/
    ├── app/                       # Next.js App Router 页面
    │   ├── layout.tsx             # 根布局 (metadata, fonts, AnalyticsProvider)
    │   ├── globals.css            # Tailwind + 全局样式
    │   ├── page.tsx               # 首页
    │   ├── error.tsx              # 全局错误页
    │   ├── loading.tsx            # 全局加载状态
    │   ├── not-found.tsx          # 404 页面
    │   ├── robots.ts              # robots.txt 生成
    │   ├── sitemap.ts             # 动态 XML Sitemap
    │   │
    │   ├── [category]/            # 分类页（gear-damper, axial-damper, etc）
    │   │   ├── page.tsx           # 分类详情页（ProductListClient + CategoryExplainer）
    │   │   └── [slug]/page.tsx    # 产品详情页（完整的 Product 展示）
    │   │
    │   ├── products/              # 产品总览页
    │   │   ├── page.tsx           # 全部产品列表
    │   │   └── loading.tsx        # 加载状态
    │   │
    │   ├── news/                  # 新闻
    │   │   ├── page.tsx           # 新闻列表（dynamic rendering）
    │   │   ├── loading.tsx
    │   │   └── [slug]/page.tsx    # 新闻详情（dynamic rendering）
    │   │
    │   ├── about/                 # 关于页面
    │   │   ├── page.tsx
    │   │   ├── loading.tsx
    │   │   └── teao-damper-manufacturer/page.tsx  # 制造商详情子页
    │   │
    │   ├── applications/          # 应用场景
    │   │   ├── page.tsx
    │   │   └── automotive/        # 汽车应用互动场景图
    │   │
    │   ├── admin/                 # 后台管理
    │   │   ├── layout.tsx         # 后台布局（不包含认证检查）
    │   │   ├── login/page.tsx     # 登录页
    │   │   └── (dashboard)/       # 仪表盘路由组（auth-guarded）
    │   │       ├── layout.tsx     # 认证布局（getSession → redirect）
    │   │       ├── page.tsx       # 后台首页
    │   │       ├── products/      # 产品管理 CRUD
    │   │       ├── news/          # 新闻管理 CRUD
    │   │       ├── media/         # 媒体库管理
    │   │       ├── analytics/     # 分析仪表盘
    │   │       └── inquiries/     # 客户询盘管理
    │   │
    │   ├── api/                   # API 路由
    │   │   ├── auth/              # 认证（login/logout/me）
    │   │   ├── products/          # 产品 CRUD
    │   │   ├── news/              # 新闻 CRUD
    │   │   ├── contact/           # 联系表单提交
    │   │   ├── media/             # 媒体文件管理
    │   │   ├── search/            # 全局搜索
    │   │   ├── categories/        # 分类列表
    │   │   └── analytics/event/   # 事件追踪
    │   │
    │   ├── contact/               # 联系我们
    │   ├── faq/                   # FAQ 页面
    │   ├── quality/               # 质量管理
    │   ├── torque-converter/      # 扭矩转换工具
    │   ├── privacy-policy/        # 隐私政策
    │   ├── llms.txt/route.ts      # AI 可读 SEO 摘要
    │   └── llms-full.txt/route.ts # AI 可读完整产品数据
    │
    ├── components/                # 组件
    │   ├── home/                  # 首页 section 组件
    │   │   ├── hero-section.tsx
    │   │   ├── product-grid.tsx
    │   │   ├── capability-section.tsx
    │   │   ├── application-section.tsx
    │   │   ├── partner-section.tsx
    │   │   ├── process-section.tsx
    │   │   ├── news-section.tsx
    │   │   └── cta-section.tsx
    │   │
    │   ├── products/              # 产品相关组件
    │   │   ├── CategoryHero.tsx       # 分类页 Hero
    │   │   ├── CategoryTabs.tsx       # 分类 Tab 切换
    │   │   ├── CategoryExplainer.tsx  # 折叠式分类解释（GEO优化）
    │   │   ├── ProductListClient.tsx  # 产品列表（含搜索/过滤/排序）
    │   │   ├── ProductTable.tsx       # 产品表格视图
    │   │   ├── ProductCardMobile.tsx  # 移动端产品卡片
    │   │   ├── ProductGallery.tsx     # 产品图库（含视频支持）
    │   │   ├── ProductSearch.tsx      # 产品搜索
    │   │   ├── Breadcrumb.tsx         # 面包屑导航
    │   │   ├── CharacteristicsPills.tsx  # 特性标签
    │   │   ├── TorqueRangeBar.tsx     # 扭矩范围可视化
    │   │   ├── PerformanceStats.tsx   # 性能统计数据
    │   │   ├── TechSpecsTable.tsx     # 技术规格表
    │   │   ├── MaterialsTable.tsx     # 材料表
    │   │   ├── PerformanceCharts.tsx  # 性能曲线图
    │   │   ├── VariantComparisonTable.tsx  # 变体对比表
    │   │   ├── DimensionDrawing.tsx   # 尺寸工程图
    │   │   ├── ApplicationScenarios.tsx   # 应用场景
    │   │   ├── ApplicationContent.tsx # 应用内容
    │   │   ├── RelatedProducts.tsx    # 相关产品
    │   │   ├── InquiryCTA.tsx         # 询盘行动号召
    │   │   ├── ShareButtons.tsx       # 社交分享按钮
    │   │   ├── DownloadPDFButton.tsx  # PDF 下载按钮
    │   │   └── Pagination.tsx         # 分页
    │   │
    │   ├── about/                 # 关于页面组件
    │   │   ├── AboutHero.tsx
    │   │   ├── CompanyTimeline.tsx
    │   │   ├── BusinessHighlights.tsx
    │   │   ├── CoreCompetencies.tsx
    │   │   ├── CompanyVideoSection.tsx
    │   │   ├── VideoPlayer.tsx
    │   │   ├── CertificationsSection.tsx
    │   │   ├── CustomersSection.tsx
    │   │   ├── CorporateValues.tsx
    │   │   └── AboutCTA.tsx
    │   │
    │   ├── admin/                 # 后台组件
    │   │   ├── ProductForm.tsx        # 产品表单
    │   │   ├── ProductListTable.tsx   # 产品列表表
    │   │   ├── ProductSelector.tsx    # 产品选择器
    │   │   ├── NewsForm.tsx           # 新闻表单
    │   │   ├── NewsListTable.tsx      # 新闻列表表
    │   │   ├── MediaPicker.tsx        # 媒体选择器（URL/Upload/Library）
    │   │   └── RichTextEditor.tsx     # 富文本编辑器（TipTap + Markdown 粘贴）
    │   │
    │   ├── contact/               # ContactForm 组件
    │   ├── search/                # GlobalSearch 全局搜索
    │   ├── faq/                   # FAQ 组件
    │   ├── analytics/             # AnalyticsProvider
    │   ├── tools/                 # TorqueConverter 扭矩转换
    │   ├── layout/                # Header, Footer, PublicChrome
    │   └── ui/                    # 通用 UI: Button, Reveal, SectionHead, SafeImage, Captcha, Skeleton
    │
    ├── db/                        # 数据库
    │   ├── index.ts               # DB 客户端（自动切换 Turso/本地 SQLite）
    │   ├── schema.ts              # Drizzle 表结构（6 张表）
    │   └── seed.ts                # 种子数据脚本
    │
    ├── lib/                       # 工具库
    │   ├── auth.ts                # JWT 认证（sign/verify/session 管理）
    │   ├── products.ts            # 产品数据处理（mapDbProduct, filter, sort）
    │   ├── seo-keywords.ts        # SEO 关键词配置（5 分类完整数据 + FAQ）
    │   ├── structured-data.tsx    # JSON-LD Schema 生成器
    │   ├── product-videos.ts      # 产品视频自动匹配
    │   ├── constants.ts           # 备用常量（CATEGORIES, PRODUCTS, PARTNERS, SITE_CONFIG）
    │   ├── email.ts               # Resend 邮件通知
    │   ├── env.ts                 # 类型化环境变量
    │   ├── reading-time.ts        # 阅读时间估算
    │   ├── rate-limit.ts          # 频率限制
    │   └── utils.ts               # 通用工具函数
    │
    ├── content/                   # 静态内容（非 DB 数据）
    │   ├── about.ts               # About 页面静态内容
    │   ├── faq.ts                 # FAQ 项目
    │   └── automotive-applications.ts  # 汽车应用场景/产品映射
    │
    ├── types/                     # TypeScript 类型定义
    │   └── index.ts               # Product, CategoryInfo, NewsItem, ApplicationInfo, Partner
    │
    └── middleware.ts              # URL 重定向（/products/slug → /category/slug, /news/slug → /news/slug.html）
```

---

## 4. 数据库设计

### 连接方式
```typescript
// src/db/index.ts — 自动切换
// 有 TURSO_DATABASE_URL → Turso 云端
// 无 → 本地 SQLite 文件 data/teao.db
```

### 6 张表

#### `categories` — 产品分类
| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | INTEGER PK | 自增 |
| `slug` | TEXT UNIQUE | gear-damper, axial-damper, glove-box-damper, latch, other |
| `name` | TEXT | 显示名称 |
| `description` | TEXT | 分类描述 |
| `image` | TEXT | 分类图片路径 |
| `sort_order` | INTEGER | 排序 |

#### `products` — 产品目录
| 字段 | 类型 | 说明 |
|------|------|------|
| `slug` | TEXT UNIQUE | URL slug |
| `model` | TEXT | 产品型号（如 RD-T015） |
| `name` | TEXT | 产品名称 |
| `category` | TEXT FK | 关联 categories.slug |
| `sub_type` | TEXT | individual / series |
| `summary` | TEXT | 简要描述 |
| `description` | TEXT | 详细描述 |
| `features` | TEXT(JSON) | 特性列表 `["..."]` |
| `image` | TEXT | 主图路径 |
| `images` | TEXT(JSON) | 多图 `[{url, alt}]` |
| `tech_params` | TEXT(JSON) | 技术参数（齿数、模数等） |
| `specifications` | TEXT(JSON) | 规格 `{key: value}` |
| `torque` | TEXT(JSON) | 扭矩 `{min, max, unit}` |
| `force_range` | TEXT | 力量范围 |
| `materials` | TEXT(JSON) | 材料 `[{part, material}]` |
| `characteristics` | TEXT(JSON) | 特性标签 `["SOC Free", ...]` |
| `dimension_drawing` | TEXT | 工程图路径 |
| `performance_charts` | TEXT(JSON) | 性能曲线图 `{rotation_curve, temperature_curve}` |
| `variants` | TEXT(JSON) | 变体对比 `{variants[], rows[{param, values[]}]}` |
| `applications` | TEXT(JSON) | 应用场景列表 |
| `tags` | TEXT(JSON) | SEO 标签 |
| `seo_title` | TEXT | SEO 标题 |
| `seo_description` | TEXT | SEO 描述 |
| `is_active` | INTEGER | 0/1 |

#### `news` — 新闻文章
| 字段 | 类型 | 说明 |
|------|------|------|
| `slug` | TEXT UNIQUE | URL slug |
| `title` | TEXT | 文章标题 |
| `content` | TEXT(HTML) | 正文（TipTap HTML） |
| `category` | TEXT | company / quality / engineering |
| `article_type` | TEXT | article / guide / faq / news |
| `is_published` | INTEGER | 0/1 |
| `published_at` | TEXT | 发布日期 YYYY-MM-DD |

#### `admins` — 管理员
| 字段 | 类型 | 说明 |
|------|------|------|
| `username` | TEXT UNIQUE | 用户名 |
| `password_hash` | TEXT | bcrypt 哈希 |

#### `analytics_events` — 事件追踪
记录页面浏览、产品点击、CTA 点击、搜索等事件。

#### `contact_inquiries` — 询盘记录
存储所有联系表单提交。

### JSON 字段处理约定
DB 中多个字段以 JSON 字符串存储，通过 `src/lib/products.ts` 中的 `mapDbProduct()` 和 `serializeProduct()` 函数进行序列化/反序列化：
- JSON 字段: `features`, `images`, `specifications`, `torque`, `materials`, `characteristics`, `tags`, `variants`, `performance_charts`, `application_scenarios`
- 字符串字段: `model`, `name`, `category`, `summary`, `description`, `image`

---

## 5. URL 路由设计

### 公开路由
| 路径 | 页面 | 渲染模式 |
|------|------|----------|
| `/` | 首页 | Static (SSG) |
| `/products` | 全部产品 | Static |
| `/gear-damper` | 齿轮阻尼器分类 | Static |
| `/gear-damper/rd-t015` | 产品详情 | Static (generateStaticParams) |
| `/news` | 新闻列表 | **Dynamic** (force-dynamic) |
| `/news/slug.html` | 新闻详情 | **Dynamic** (force-dynamic) |
| `/about` | 关于 | Static |
| `/contact` | 联系 | Static |
| `/faq` | FAQ | Static |
| `/quality` | 质量 | Static |
| `/applications` | 应用场景 | Static |
| `/torque-converter` | 扭矩转换 | Static |
| `/llms.txt` | AI 摘要 | ISR (86400s) |
| `/llms-full.txt` | AI 完整数据 | ISR (86400s) |

### 后台路由
| 路径 | 说明 |
|------|------|
| `/admin/login` | 登录页 |
| `/admin` | 仪表盘首页 |
| `/admin/products` | 产品列表 |
| `/admin/products/new` | 新建产品 |
| `/admin/products/[id]` | 编辑产品 |
| `/admin/news` | 新闻列表 |
| `/admin/news/new` | 新建新闻 |
| `/admin/news/[id]` | 编辑新闻 |
| `/admin/media` | 媒体库 |
| `/admin/analytics` | 分析面板 |
| `/admin/inquiries` | 询盘列表 |

### 遗留 URL 重定向（middleware.ts）
```
/products/slug → /category/slug      (301 永久重定向)
/news/slug → /news/slug.html         (301 永久重定向)
```

### 重要：路由重复已解决
- ✅ 保留: `/[category]/[slug]` — 产品详情唯一入口
- ❌ 已删除: `/products/[slug]` — 不再存在
- Middleware 处理 `/products/slug` → `/[category]/[slug]` 301 重定向

---

## 6. SEO 策略

### 结构化数据 (JSON-LD)
所有页面注入相应的 JSON-LD Schema：
- `Organization` — 全站
- `WebSite` + `SearchAction` — 首页
- `Product` + `BreadcrumbList` — 产品详情页
- `CollectionPage` + `FAQPage` — 分类列表页
- `NewsArticle` + `SpeakableSpecification` — 新闻详情页
- `FAQPage` — FAQ 类型文章

### AI 可读端点
- `/llms.txt` — 简版 AI 读取内容
- `/llms-full.txt` — 完整产品数据、FAQ、公司信息（Markdown 格式，24h 缓存）

### 动态 Sitemap
`sitemap.ts` 自动生成包含所有产品、分类、新闻的 XML Sitemap

### SEO 关键词管理
`src/lib/seo-keywords.ts` 包含 5 个分类的完整 SEO 配置：
- 标题/描述/关键词/别名
- LLM 优化摘要（含同义词说明）
- 3 个 FAQ（注入分类页 JSON-LD）
- 全局关键词 + 汽车行业关键词

### CategoryExplainer (GEO 优化)
`src/components/products/CategoryExplainer.tsx` 在每个分类页产品列表下方添加默认折叠的解释内容（`<details>` 标签），AI 爬虫可直接解析：
- 定义、工作原理、选型参数表、定制说明、典型应用
- 纯 HTML 渲染，无需 JS，AI 爬虫友好

---

## 7. 认证系统

### 登录流程
1. POST `/api/auth/login` — 验证用户名/密码（bcrypt），签发 24h JWT
2. JWT 存储在 `teao_admin_token` httpOnly Cookie 中
3. Dashboard Layout (`admin/(dashboard)/layout.tsx`) 调用 `getSession()` 检查登录状态
4. 未登录 → 302 重定向到 `/admin/login`
5. API 路由直接检查 `getSession()`，未认证返回 401

### 安全措施
- Session 验证 (jose JWT HS256)
- httpOnly Cookie（XSS 防护）
- SameSite=Lax（CSRF 防护）
- 生产环境 Secure Cookie

---

## 8. 分析系统

`AnalyticsProvider` 包裹所有公开页面，追踪用户行为：
- **点击委托**: `data-analytics-event` 属性的元素自动追踪
- **编程追踪**: `window.dispatchEvent(new CustomEvent("teao:track", { detail }))`
- **上报方式**: `navigator.sendBeacon()` + `fetch` 回退
- **匿名**: sessionStorage 存储 `sessionId`

追踪事件: `page_view`, `product_click`, `cta_click`, `scene_click`, `category_click`, `search_open`, `search`, `search_result_click`, `form_submit`

---

## 9. 部署

### 服务器
- **IP**: 107.150.106.22 (外部)
- **OS**: Ubuntu 24.04
- **用户**: ubuntu
- **密码**: dH25zw9W.HfEP@T
- **项目路径**: `/home/ubuntu/teao-website`
- **进程管理**: PM2 (name: `teao-website`)
- **Git Remote**: `https://github.com/Fraike/teao-website.git`

### 部署流程
```bash
# 1. 推送代码到 GitHub
git push origin master

# 2. SSH 登录服务器
ssh ubuntu@107.150.106.22

# 3. 拉取代码 → 构建 → 重启
cd /home/ubuntu/teao-website
git pull origin master
npm run build
pm2 restart teao-website
```

### ⚠️ 重要：数据库同步流程

**永远不要**在 PM2 运行时直接替换数据库文件！必须遵循完整流程。

#### 背景
SQLite WAL 模式意味着未提交的写入存储在 `-wal` 和 `-shm` 文件中，主 `.db` 文件可能滞后。如果只 SCP 主文件而忽略 WAL，会导致：
- **数据丢失**：WAL 中的数据未合并到主文件就被覆盖
- **数据污染**：服务器 WAL 含旧数据，重启后回放覆盖干净 DB
- **SQLITE_CORRUPT**：PM2 运行时替换文件可能导致损坏

#### 完整同步流程

```bash
# === 步骤 1: 本地 Checkpoint ===
# 在本地开发机上，将 WAL 数据合并到主文件
node -e "
const { createClient } = require('@libsql/client');
const db = createClient({ url: 'file:./data/teao.db' });
db.execute('PRAGMA wal_checkpoint(TRUNCATE)').then(r => {
  console.log('Checkpoint done, WAL truncated');
});
"

# === 步骤 2: 服务器停机 + 清理 ===
ssh ubuntu@107.150.106.22 "cd /home/ubuntu/teao-website && \
  pm2 stop teao-website && \
  rm -f data/teao.db data/teao.db-wal data/teao.db-shm"

# === 步骤 3: 传输数据库 ===
scp data/teao.db ubuntu@107.150.106.22:/home/ubuntu/teao-website/data/teao.db

# === 步骤 4: 拉取代码 + 构建 + 启动 ===
ssh ubuntu@107.150.106.22 "cd /home/ubuntu/teao-website && \
  git pull origin master && \
  npm run build && \
  pm2 restart teao-website"
```

#### 只用代码部署（不涉及数据库）
```bash
ssh ubuntu@107.150.106.22 "cd /home/ubuntu/teao-website && \
  pm2 stop teao-website && \
  git pull origin master && \
  npm run build && \
  pm2 restart teao-website"
```

#### 为什么必须「删除」而非「保留」服务器 WAL
即使本地 DB 干净，服务器 WAL 文件也可能包含历史脏数据。PM2 重启后 SQLite 会自动回放 WAL，导致已清理的数据重新出现。正确的做法是**彻底删除服务器端所有 DB 相关文件**后 SCP 干净副本。

### 环境变量
生产服务器上必须设置:
- `AUTH_SECRET` — JWT 签名密钥（强随机值）
- `RESEND_API_KEY` — 邮件通知
- `NEXT_PUBLIC_SITE_URL` — https://teao-damper.com
- （可选）`TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` — 如使用 Turso 云数据库

---

## 10. 本地开发

### 启动
```bash
npm install           # 安装依赖
npm run dev           # 启动开发服务器 (Turbopack, port 3000)
npm run build         # 生产构建
npm run start         # 生产运行
npm run lint          # ESLint
npm run typecheck     # TypeScript 检查
npm run db:push       # 推送 Schema 到数据库
npm run db:studio     # Drizzle Studio 图形界面
npm run db:seed       # 初始化种子数据
```

### 种子数据
`npm run db:seed` 会创建:
- 5 个产品分类
- 12 个示例产品
- 3 篇新闻
- 管理员账号: `admin` / `teao123`

### .gitignore 关键条目
- `data/` — 数据库文件不提交
- `trash_review/` — 删除暂存区
- `drafts/` — 草稿文件
- `public/images/video-source/` — 原始视频源文件

---

## 11. 编码规范 & 约定

### 文件命名
- 组件: PascalCase (`ProductGallery.tsx`)
- 工具库: kebab-case (`seo-keywords.ts`)
- 路径: kebab-case (`glove-box-damper`)
- 所有文件名和目录名使用英文

### 产品型号命名
- 格式: `RD-{前缀}{数字}[后缀]`
  - Gear: `RD-T001` ~ `RD-T999`
  - Glove Box: `RD-V107` ~ `RD-V130`
  - Latch: `RD-01` ~ `RD-99`
  - Other: `RD-T180`, `RD-TR01`, 等
- 变体: A/B/C/D/E 后缀表示不同齿轮/规格
- 配对: V126/V126A (无锁/有锁), T015/T015B

### 材料命名映射（补充数据 → 网站标准）
| 补充数据名称 | 网站标准名称 |
|-------------|-------------|
| Axial Core | Shaft |
| Silicone Ring | O-Ring |
| Top Cover | Upper Cover |
| Base | Lower Housing |
| Gear Bar | Housing |
| Closing Piece | Lock Block |

### 产品视频命名
格式: `{型号}-{应用场景}.mp4`
例: `RD-T015-CupHolder.mp4`

### 颜色体系
- Brand: `#ED7606` (橙色)
- Text: `#111827` (深色标题), `#333333` (正文), `#6B7280` (辅助)
- Border: `#E5E7EB`
- Background: `#F8F9FA`, `#FAFAFA`, `#FFFFFF`

### 字体
- Inter (Google Fonts), 4 种粗细: 400, 500, 700, 900
- `font-display: swap`

---

## 12. 关键不足 & 注意事项

### 渲染模式
- `/news` 和 `/news/[slug]` 使用 `force-dynamic` — 因为管理员通过 TipTap 编辑新闻内容后需要实时更新
- 产品分类页（`[category]/page.tsx`）和产品详情页（`[category]/[slug]/page.tsx`）使用 `generateStaticParams` 静态生成 — 添加新产品后需要 re-build

### 路由冲突
- `next.config.ts` 中**不再**使用 rewrite 来处理产品 URL — 这会导致无限重定向循环
- Middleware 只处理遗留 URL 的 301 重定向

### 数据库
- 生产环境使用本地 SQLite，不使用 Turso 云数据库
- **同步数据库必须遵循完整流程**（见 §9）：
  1. 本地先 `wal_checkpoint(TRUNCATE)` 清空 WAL
  2. 服务器 `pm2 stop` → 删除 `teao.db*` 全部文件
  3. SCP 传输主文件
  4. 重启 PM2
- JSON 字段在前端渲染前需要 `JSON.parse()`
- ⚠️ 只 SCP 主 `.db` 文件而忽略 WAL，会导致数据丢失或污染（WAL 含未合并数据）
- ⚠️ 不删除服务器 WAL 文件直接替换主 DB，旧 WAL 会在重启后回放覆盖新数据

### 图片
- 使用 `unoptimized: true`（Next.js Image optimization 关闭）
- 静态文件直接使用路径字符串
- 产品图片压缩使用 ImageMagick: `convert -resize 800x800 -quality 72`

### 视频
- 产品应用视频存储在 `public/video/productVideo/{category}/`
- 21 个视频，从 599MB 压缩到 18.4MB (H.264 CRF 28, 640×360)
- `src/lib/product-videos.ts` 自动根据产品型号匹配视频

### 后台编辑器
- TipTap 富文本编辑器用于内容编辑
- `RichTextEditor.tsx` 集成了 markdown-it，粘贴 Markdown 时自动转为 HTML
- `MediaPicker.tsx` 支持 URL 直接输入、上传和媒体库三种方式

---

## 13. 扩展 & 未来规划

### 当前阶段
- [x] 静态产品数据
- [x] SQLite 数据库 + ORM
- [x] 后台管理面板（产品/新闻/媒体 CRUD）
- [x] JSON-LD 结构化数据
- [x] 联系表单 + 邮件通知
- [x] 分析系统
- [x] 全局搜索
- [x] AI 可读端点（llms.txt, llms-full.txt）
- [x] 产品应用视频
- [x] 分类 GEO 优化（CategoryExplainer）

### 未实现
- [ ] CMS 集成（Payload / Strapi）
- [ ] 多语言支持
- [ ] CI/CD Pipeline
- [ ] 自动化测试
- [ ] AI 聊天机器人
- [ ] 在线报价系统
