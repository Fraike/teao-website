# TEAO 国际独立站

TEAO 面向海外采购、产品设计与工程团队的 B2B 网站。客户可以按产品或应用查找阻尼器和锁扣、核对型号参数、使用扭矩工具并提交项目询盘。运营团队通过后台维护产品和内容，查看自然搜索表现，跟进询盘并审核客户回复。

- 公开网站：[teao-damper.com](https://teao-damper.com/)
- 工程文档：[PROJECT.md](PROJECT.md)
- 协作规则：[AGENTS.md](AGENTS.md)

## 本地启动

使用 Node.js 和 npm。先在项目根目录准备 `data/teao.db`，已有开发库按下文检查增量迁移。新工作树可使用经批准的脱敏开发库副本。随后执行：

```bash
npm ci
npm run dev
```

本地预览使用运行 `npm run dev` 的工作区代码，文件修改会通过开发服务更新。默认预览端口是 **3091**，访问 **3100** 会保留页面路径和查询参数并跳转到同一预览。

- 本地首页：[127.0.0.1:3091](http://127.0.0.1:3091/)
- 本地后台：[127.0.0.1:3091/admin/login](http://127.0.0.1:3091/admin/login)

如主端口冲突，可用 `PORT=3101 npm run dev` 指定端口，空闲的 3091 和 3100 会跳转到指定端口。切换到另一个工作目录预览时，先停止当前预览，再在目标目录启动开发服务。预览生产构建时，先执行 `npm run build`，再执行 `npm run start`。改动代码后重新构建以更新生产预览。生产模式登录需要在本地环境配置 `AUTH_SECRET`。

管理员账户来自当前连接的数据库。开发和联调用本地账号，管理员密码单独交付。

## 网站与后台功能

- **产品目录**涵盖 Gear Damper / Rotary Damper、Axial Damper / Barrel Damper、Glove Box Damper、Latch 及定制产品。产品可按分类、型号、参数或应用查找。
- **应用和工程内容**包括汽车内外饰应用、技术文章、选型指南、扭矩计算和单位转换。英文为默认语言，站内另有日语和德语入口。
- **内容管理**支持维护产品、新闻和媒体，新闻编辑器使用 TipTap。后台使用中文，商品和文章发布页的主要字段提供中英对照。公开内容仍按目标语言编辑。
- **询盘管理**记录产品需求、来源和落地页，支持有效性标记、跟进状态、收件确认、生成回复草稿、人工审批发送和投递记录。
- **搜索与运营**提供站内访问分析、Google Search Console 只读同步、有效询盘归因、处理超时、邮件失败和页面改动记录。外部可用性监控可检查 `/api/health`。

主要后台入口为 `/admin/products`、`/admin/news`、`/admin/media`、`/admin/analytics`、`/admin/inquiries`、`/admin/search-console` 和 `/admin/operations`。

## 技术与目录

使用 Next.js 15 App Router、React 19、TypeScript、Tailwind CSS、Drizzle ORM 与 libSQL。默认数据库是 `data/teao.db`。同时提供 `TURSO_DATABASE_URL` 与 `TURSO_AUTH_TOKEN` 时，运行时连接对应的远程 libSQL 数据库。

- `src/app/` 包含公开页面、语言路由、后台与 API。
- `src/components/` 包含产品目录、询盘表单、编辑器和共享组件。
- `src/content/` 存放 FAQ、应用场景等代码管理的内容。
- `src/lib/` 存放认证、选型、SEO、邮件、Search Console 等逻辑。
- `src/db/` 存放数据库连接、Drizzle schema 和种子脚本。
- `public/` 存放静态素材，后台上传文件位于 `public/uploads/`。
- `scripts/migrations/` 存放网站运营功能的增量 SQL。

## 配置与数据

按 [.env.example](.env.example) 配置 `.env.local`。只做本地预览时可以先启动网站，再按需要接入：

- **Google Search Console**。查看 [Google OAuth 授权流程](docs/google-search-console-oauth.md)，按步骤启用 API、注册回调、配置环境变量并在后台授权。
- **邮件**。配置 Resend API、已验证发件域、内部通知邮箱和 `RESEND_WEBHOOK_SECRET`。投递回调为 `/api/webhooks/resend`。生产客户回执依赖 Turnstile 服务端验证。
- **AI 草稿与翻译**。从 `TRANSLATION_PROVIDER` 选择 OpenAI 或 DeepSeek，设置对应的 `OPENAI_API_KEY` 或 `DEEPSEEK_API_KEY`。按需要配置 `TRANSLATION_MODEL` 和 `TRANSLATION_API_BASE_URL`。
- **后台任务**。网站进程和 `node scripts/run-website-jobs.cjs` 使用同一 `PORT` 与 `TEAO_JOBS_SECRET`。可用 `TEAO_JOBS_URL` 显式指定回环地址。Google 数据授权后按北京时间 10 点起同步，待发邮件和异常检查由任务进程处理。

对已有 SQLite 开发库先查看待应用迁移，再执行应用：

```bash
node scripts/migrate-website-operations.cjs --db data/teao.db
node scripts/migrate-website-operations.cjs --db data/teao.db --apply
```

迁移前脚本会创建备份。现有数据库已包含商品与文章时，使用迁移保留内容。种子脚本会清空并重填分类、产品和新闻，只适用于可丢弃的样例库。增量迁移以原有表结构为起点，手工 `db:push` 到最新 schema 的数据库需要先核对迁移记录与实际列。

## 检查和部署

- `npm run typecheck` 检查 TypeScript，`npm run lint` 运行项目 lint，`npm run build` 验证生产构建。
- `node --test tests/*.test.mjs` 在支持直接加载 TypeScript 的 Node.js 版本下运行重点测试。
- 生产 PM2 配置包含网站和运营任务两个进程，默认回环端口为 3000。上线涉及发件域、OAuth 回调、数据库备份和外部监控，见 [部署与回滚](PROJECT.md#部署与回滚)。
