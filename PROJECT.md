# TEAO 国际独立站工程说明

本文描述当前优化工作树的架构、主要数据流和运维约定。开发启动见 [README](README.md)，协作约定见 [AGENTS.md](AGENTS.md)。

## 产品与用户

网站面向海外采购与工程团队，覆盖齿轮式旋转阻尼器、轴向阻尼器、手套箱阻尼器、锁扣及定制件。客户可从行业应用、技术文章或产品目录进入分类与型号页，核对参数，再发出工程询盘。运营团队用网站后台维护公开资料、搜索数据和客户跟进。

第一阶段搜索优化围绕手套箱阻尼器和 Gear Damper / Rotary Damper 两个方向。手套箱指南为分类和型号提供入口，旋转阻尼器综合指南介绍选型，工作原理文章解释机制。询盘入口可携带分类、型号和应用，减少客户重复填写。

## 页面与代码结构

| 入口 | 用途 |
| --- | --- |
| `/`、`/products` | 首页与全产品目录 |
| `/{category}`、`/{category}/{slug}` | 产品分类和型号详情 |
| `/applications/automotive` | 汽车内外饰应用与型号推荐 |
| `/news`、`/news/{slug}.html` | 技术文章列表和详情 |
| `/damper-torque-calculator`、`/torque-converter` | 扭矩计算与换算 |
| `/quality`、`/about`、`/faq`、`/contact` | 质量、企业信息、常见问题和询盘 |
| `/ja`、`/de` | 日语和德语页面 |
| `/admin/login`、`/admin` | 网站后台登录及管理入口 |

`src/app/` 使用 Next.js App Router。后台布局、管理 API 各自校验管理员会话。产品图、应用视频和企业素材放在 `public/`，上传文件写入 `public/uploads/`。网站主数据来自 SQLite，应用说明和部分 FAQ 来自 `src/content/`。公开页面默认英文，维护本地化页面时同时检查对应链接与语言。

## 数据与认证

- **目录和内容**。Drizzle schema 位于 `src/db/schema.ts`。分类、型号、文章及对应翻译存储在数据库。型号包含规格、扭矩或阻尼力、安装方式、方向、图像及可用资料等字段，展示以该型号实际数据为准。
- **运行库**。默认使用工作目录下的 `data/teao.db`。远程 libSQL 连接需要同时配置 Turso URL 和认证令牌。不同工作树可使用不同数据库。
- **管理员**。`admins` 存储账号及 bcrypt 哈希，登录后签发 HTTP-only JWT cookie。生产模式要求 `AUTH_SECRET`。本地账号以实际开发库为准，密码由项目维护者单独交付。
- **运营增量表**。`contact_inquiries` 保存询盘和来源，`inquiry_drafts` 保存当前回复草稿，`inquiry_mail_jobs` 保存邮件任务和投递状态。Search Console 数据、任务状态、页面改动和迁移记录由 `scripts/migrations/` 管理。
- **媒体**。已有产品图片和视频按分类与型号组织。新增媒体沿用现有路径、格式及展示规则，减少明显的下载入口。管理员上传文件与数据库分别备份。

## 搜索、来源与复盘

- **公开搜索结构**。产品详情以 `/{category}/{slug}` 为 canonical。旧的 `/products/{slug}` 和缺少 `.html` 的文章入口由 middleware 兼容。修改页面时一并检查 metadata、JSON-LD、sitemap、robots 和内部链接。
- **词汇与页面分工**。`src/lib/seo-keywords.ts` 集中管理分类关键词和别名。`/gear-damper` 承接 Gear Damper 与 Rotary Damper 的产品选型，文章按原理、应用或选型组织。`/llms.txt` 和 `/llms-full.txt` 提供站点与内容概览。
- **站内归因**。记录会话首次落地页、来源、推广参数及询盘提交背景，以服务器成功保存的询盘作为提交记录。运营在后台标记是否有效，然后按渠道和落地页查看结果。Search Console 查询词是汇总数据。
- **Google 同步**。后台发起 OAuth，只请求只读权限，服务端加密保存刷新令牌。首次分批拉取最近三个月，后续每天北京时间 10 点起刷新最近七天。报告按 Google 的太平洋日期保留定稿数据，分别存储全站、查询、页面、国家、设备和查询与页面明细。词组汇总合并 Gear Damper / Rotary Damper，同时保留分词结果。
- **监控**。`/admin/search-console` 展示授权、同步与搜索指标，`/admin/operations` 展示有效自然搜索询盘、首次人工回复耗时、超时及系统异常。页面改动日志用于对照前后 28 天数据。`/api/health` 供外部可用性监测调用。

## 询盘处理

1. 表单提交到 `POST /api/contact`。服务端校验输入和隐私同意，通过提交标识去重，在同一事务中保存询盘和邮件任务。生产客户回执需要有效的 Turnstile 验证。
2. 后台工作进程发送待处理邮件，内部通知默认发往 `info@chinateao.com`。投递事件进入签名验证后的 Resend webhook，更新接收、送达、退信或失败状态。
3. 管理员在 `/admin/inquiries` 标记询盘质量并跟进。草稿使用已维护的产品和 FAQ 资料生成，界面显示引用来源。业务员确认参数、报价、交期与定制能力，保存并审核后发送。
4. 审核版本、发送任务标识和服务商幂等键用于防止重复处理。后台记录人工回复时间及投递结果，客户后续邮件进入配置的业务邮箱。

## 部署与回滚

生产网站由 PM2 管理，网站与运营任务默认共用回环端口 3000。Git 提交、推送、生产数据库迁移与生产切换按 [AGENTS.md](AGENTS.md) 分别确认。记录当前网站进程的工作目录、提交和启动参数，保留该目录与构建用于回滚。

1. **准备候选目录。** 在服务器独立目录检出获准发布的完整提交 SHA。让候选目录的 `data/` 和 `public/uploads/` 指向生产的持久化目录。核对 SQLite 及其 WAL 文件位于同一持久化目录。生产环境文件留在受控位置，由候选目录引用；运行 `npm ci` 后执行 `bash scripts/deploy.sh --check-config <SHA>`。脚本检查提交、环境变量和 SQLite 路径。第三方连接和凭据有效性按下面的验收步骤确认。
2. **配置并构建。** 保留现有 `AUTH_SECRET` 和 Resend 发件配置，配置 Resend 签名回调 `/api/webhooks/resend`、绑定正式域名的 Turnstile、运营任务密钥、AI 服务及 [生产 Google OAuth](docs/google-search-console-oauth.md#生产配置和验收清单)。Turnstile 公钥随前端构建发布，配置后再运行 `npm run build`。网站与任务使用同一套服务端环境和端口。
3. **迁移现有生产库。** 在候选目录运行 `node scripts/migrate-website-operations.cjs --db data/teao.db` 查看待执行项。数据库操作获准后，追加 `--apply` 执行四个增量迁移，记录脚本输出的备份路径。然后执行 `bash scripts/deploy.sh --check <SHA>`，确认构建产物和迁移记录就绪。
4. **切换网站和运营任务。** 在确认发布后，停掉旧运营任务（如已运行），再切换网站进程。在候选目录使用 `pm2 start ecosystem.config.cjs --only teao-website`，同名旧进程需先从 PM2 移除。核对正式域名首页、产品筛选、详情、后台登录，以及 `/api/health` 的 HTTP 200 和纯文本 `ok`。网站检查通过后，用同一配置启动 `teao-website-jobs`。
5. **验证真实链路。** 使用指定测试邮箱提交一条测试询盘，核对入库、业务邮箱通知、客户回执和 Resend 送达回调；再核对 AI 草稿、Google 正式授权和首次同步。配置外部监控同时检查 `/api/health` 的状态码和响应正文。验证通过后保存 PM2 进程配置，并于下一次调度核对同步时间。
6. **回滚。** 如网站或询盘验收失败，先停止新运营任务，再移除新网站进程，按已记录的配置启动上一版本。保留生产数据库、增量表和切换期间写入的询盘。若确需恢复数据库备份，先核对切换期间的数据变动并按独立数据操作取得确认。
