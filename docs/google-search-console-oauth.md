# Google Search Console 授权流程

这个授权用于让特澳独立站后台读取 `teao-damper.com` 的搜索表现。本文记录本地联调过程和生产上线步骤。生产环境需使用自己的回调、凭据和数据库，并重新授权。

## 1. 确认 Google 账号能查看网站数据

登录 [Google Search Console](https://search.google.com/search-console)，确认同一个账号能打开 `teao-damper.com` 网域资源，或 `https://teao-damper.com/` URL 前缀资源，并查看「效果」报告。如果看不到资源，请站点所有者在「设置 → 用户和权限」添加该账号。后台优先连接网域资源。[Search Console 权限说明](https://support.google.com/webmasters/answer/7687615)

## 2. 在 Google Cloud 创建 OAuth 客户端

1. 在 [Google Cloud 控制台](https://console.cloud.google.com/) 选择或创建项目，进入「API 和服务 → 库」，搜索并启用 **Google Search Console API**。[Search Console API 授权说明](https://developers.google.com/webmaster-tools/v1/how-tos/authorizing)
2. 进入「Google Auth Platform」。在「品牌信息」填写应用名称、支持邮箱和联系邮箱。在「受众」配置使用者。如果使用外部受众且应用处于测试状态，将第 1 步的 Google 账号加入测试用户。[Google Auth Platform 设置说明](https://support.google.com/cloud/answer/15544987)
3. 在「数据访问」添加只读权限 `https://www.googleapis.com/auth/webmasters.readonly`。在「客户端」创建 **Web 应用**类型的 OAuth 客户端，把以下地址填入「已获授权的重定向 URI」。保存客户端 ID 和客户端密钥。[Google OAuth 客户端设置](https://support.google.com/cloud/answer/15549257)

本地回调 URI：

```text
http://127.0.0.1:3091/api/admin/search-console/callback
```

生产回调 URI：

```text
https://teao-damper.com/api/admin/search-console/callback
```

浏览器打开后台时使用与回调相同的协议、主机名和端口。本地统一预览的 3100 会跳转至 3091，因此按最终地址 `127.0.0.1:3091` 注册。更换预览端口时，同时修改后台访问地址、`GSC_REDIRECT_URI` 和 Google Cloud 中的重定向 URI。[Google 回调匹配规则](https://developers.google.com/identity/protocols/oauth2/web-server)

## 3. 写入本地环境变量

在运行 3091 预览的工作树根目录编辑 `.env.local`：

```dotenv
GSC_CLIENT_ID=填入客户端ID
GSC_CLIENT_SECRET=填入客户端密钥
GSC_REDIRECT_URI=http://127.0.0.1:3091/api/admin/search-console/callback
GSC_TOKEN_KEY=填入生成的Base64密钥
```

运行 `openssl rand -base64 32` 生成 `GSC_TOKEN_KEY`。该密钥用于加密本地数据库中的 Google 刷新令牌，需要随该环境保留。若更换密钥，已有连接需要重新授权。密钥与凭据存放在环境文件或密钥管理服务中。保存后重启开发服务。

## 4. 连接并检查同步结果

1. 登录 [本地 Google 搜索数据后台](http://127.0.0.1:3091/admin/search-console)，点击 **连接 Google**。
2. 选择能查看站点数据的账号，同意只读访问。返回后台后，确认站点资源显示为 `sc-domain:teao-damper.com` 或 `https://teao-damper.com/`。
3. 点击 **立即同步**。首次按批次补齐近三个月数据。检查页面显示的同步状态、数据截止日期及点击、曝光等指标，再和 Search Console 的同一日期范围抽样对照。
4. 如需每日自动同步，再启动 [运营任务进程](../README.md#配置与数据)，并确保任务进程与网站共用 `PORT` 和 `TEAO_JOBS_SECRET`。默认每天北京时间 10 点起同步。

## 常见问题

| 提示 | 检查项 |
| --- | --- |
| 后台提示未配置 | 检查四个 `GSC_*` 变量是否写入正在运行的工作树，修改后重启。 |
| `redirect_uri_mismatch` 或请求来源错误 | 核对 Google Cloud、环境变量和浏览器的最终访问地址，确认协议、主机名、端口和回调路径一致。 |
| 账号无法授权 | 确认账号属于应用允许的受众。外部测试模式下，检查测试用户列表。 |
| 授权完成但找不到站点 | 回到 Search Console，确认同一个账号可以查看该站点的效果数据。 |
| 同步提示 Google 授权失效 | 点击重新连接。Google 外部应用在测试状态时，本项目使用的搜索数据权限所获刷新令牌通常会在 7 天后失效。长期运行应按组织设置和 Google 要求配置 OAuth 应用的发布状态。[Google 刷新令牌有效期](https://developers.google.com/identity/protocols/oauth2#expiration) |

## 2026-11-10 本地联调记录

本地后台已成功连接 `sc-domain:teao-damper.com`。首次手动同步完成，共写入 91 个 Google 统计日，覆盖 2026-08-09 至 2026-11-07。后台已核对同步完成状态、数据截止日期、查询词和落地页。每日任务在本次本地联调中尚未启动。

### Google 可以打开，但授权回调失败

浏览器授权后回到后台，页面提示「Google 授权未完成，请重新连接」。Chrome 走本机代理，Node 服务没有继承该代理，直连 Google 令牌接口时超时。让本地 Node 进程使用同一个 HTTP 代理后重新发起授权，回调成功。

排查时从**网站进程所在的机器和网络环境**测试 `oauth2.googleapis.com` 与 `www.googleapis.com`。以下命令使用空请求检查网络。收到 400 或 401 表示已到达接口，应继续检查凭据与权限。如果超时或连接失败，先排查 DNS、TLS 和出站网络。

```bash
node --input-type=module - <<'JS'
for (const [url, method] of [
  ["https://oauth2.googleapis.com/token", "POST"],
  ["https://www.googleapis.com/webmasters/v3/sites", "GET"],
]) {
  try {
    const response = await fetch(url, { method, signal: AbortSignal.timeout(10000) });
    console.log(new URL(url).hostname, response.status);
  } catch (error) {
    console.error(new URL(url).hostname, error.name, error.cause?.code ?? "");
    process.exitCode = 1;
  }
}
JS
```

本地使用支持 `NODE_USE_ENV_PROXY` 的 Node.js，并按实际代理端口启动。以下为本机联调示例：

```bash
NODE_USE_ENV_PROXY=1 HTTPS_PROXY=http://127.0.0.1:7890 NO_PROXY=localhost,127.0.0.1 npm run dev
```

线上先从生产机器按实际 Node 启动环境实测连通性。生产如需代理，使用该环境批准的出站代理，并让反向代理与任务进程访问本机应用的请求走回环地址。

### 回调地址一致，登录会话才能带回

本地浏览器原来在 `localhost:3091` 登录，OAuth 客户端使用 `127.0.0.1:3091`。两者是不同主机名，浏览器不会共用登录 cookie。切到注册的地址重新登录，再从该后台点击「连接 Google」，授权后即可带回会话。线上同样从 HTTPS 正式域名发起，避免在 `www` 域名、IP、临时域名或回环端口打开后台后授权。

### 外部测试模式需要确认账号，授权有有效期

本地应用使用外部测试模式。Google 账号先加入测试用户名单，再确认应用名称及 Search Console 只读范围。Google 会显示测试应用提示。这个范围的测试授权与刷新令牌在同意后 7 天过期，因此本地授权可用于联调，生产长期同步需要在上线前确定正式的受众、发布和验证安排。[Google OAuth 受众与发布状态](https://support.google.com/cloud/answer/15549945)

### OAuth 客户端密钥在创建时保存

创建 Web 客户端后，将下载的 JSON 临时保存在受限目录。核对项目、客户端和回调地址后，把凭据导入本环境的服务端配置，并清理临时下载。Google 控制台可能只在创建时提供完整密钥。各环境分别保存自己的 `GSC_TOKEN_KEY`，以便应用重启后解密已有刷新令牌。[Google OAuth 客户端管理](https://support.google.com/cloud/answer/15549257)

## 生产配置和验收清单

1. **准备发布内容。** 确认代码版本、目标数据库及备份。网站发布与生产数据库操作按项目规则分别确认。生产库使用现有数据的增量迁移，保留线上产品、文章和询盘。查看 [部署与回滚](../PROJECT.md#部署与回滚)。
2. **准备生产 OAuth。** 在公司管理的 Google Cloud 项目启用 Search Console API，准备生产 Web 客户端。注册回调 `https://teao-damper.com/api/admin/search-console/callback`，声明 `https://www.googleapis.com/auth/webmasters.readonly`，由有权读取站点数据的业务账号授权。检查 Google Auth Platform 的受众、发布状态和验证中心。如果组织支持且用户都属于该组织，可评估内部应用；使用外部应用时，按 Google 对所请求范围的要求完成发布和必要验证。
3. **配置服务器。** 通过生产环境文件或密钥管理服务设置 `GSC_CLIENT_ID`、`GSC_CLIENT_SECRET`、`GSC_REDIRECT_URI`、`GSC_TOKEN_KEY`。确认 `AUTH_SECRET` 可签发后台会话。实测服务器能访问 Google 的两个 HTTPS 域名，并确认反向代理把正式 HTTPS 请求正确交给应用。
4. **执行首次同步。** 打开 [生产 Google 搜索数据后台](https://teao-damper.com/admin/search-console)，完成只读授权并点击「立即同步」。确认资源、最后完成时间、数据截止日期、总点击和曝光。用同一站点资源、网页搜索类型、日期范围及聚合口径与 Google Search Console 抽样对照。
5. **启用并验收每日任务。** 用单独的 PM2 进程 `teao-website-jobs` 运行任务，与网站进程使用相同的 `PORT` 和 `TEAO_JOBS_SECRET`，按需设置回环地址 `TEAO_JOBS_URL`。该进程也会处理待发邮件和运营提醒，启动前核对发件身份、收件人和队列。确认北京时间 10 点后的定时同步成功，后台更新「最后一次同步」且无异常。次日新数据尚未定稿时，重点核对任务完成时间。
6. **处理失败与回滚。** 同步失败时查看后台错误，先保留已同步的历史数据。如果 Google 授权撤销、过期或加密密钥变更，在正式域名重新连接。应用需回滚时，停止任务进程并恢复前一版本，保留生产库和已写入的新数据。

发布前从获准的提交构建候选版本，再按 [部署与回滚](../PROJECT.md#部署与回滚) 的顺序校验配置、迁移数据库并切换两个 PM2 进程。
