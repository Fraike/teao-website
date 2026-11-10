export const inquiryStatusLabels: Record<string, string> = {
  pending: "待跟进",
  following_up: "跟进中",
  replied: "已回复",
  closed: "已关闭",
};

export const inquiryQualityLabels: Record<string, string> = {
  pending: "待审核",
  valid: "有效询盘",
  spam: "垃圾询盘",
};

export const inquiryChannelLabels: Record<string, string> = {
  organic: "自然搜索",
  paid: "付费推广",
  referral: "外部引荐",
  campaign: "营销活动",
  direct: "直接访问",
  unknown: "未知",
};

export const mailKindLabels: Record<string, string> = {
  notification: "内部通知",
  acknowledgment: "客户收件确认",
  reply: "客户回复",
};

export const mailStatusLabels: Record<string, string> = {
  pending: "待发送",
  processing: "发送中",
  accepted: "服务商已接收",
  delivered: "已送达",
  bounced: "已退信",
  failed: "发送失败",
};

const productInterestLabels: Record<string, string> = {
  "gear-damper": "齿轮式旋转阻尼器",
  "axial-damper": "轴向阻尼器",
  "glove-box-damper": "手套箱阻尼器",
  latch: "锁扣",
  other: "其他产品",
};

export function productInterestLabel(value: string) {
  return Object.hasOwn(productInterestLabels, value) ? productInterestLabels[value] : value;
}

const errorLabels: Record<string, string> = {
  "A model provider has not been configured.": "尚未配置 AI 服务，无法生成草稿。",
  "The model provider could not generate a reply.": "AI 服务未能生成回复，请重试。",
  "The generated draft was invalid. Please try again.": "生成的草稿格式无效，请重试。",
  "Search sync lease changed. Retry the sync.": "同步任务状态已变更，请重试。",
  "Configure Google Search Console credentials first.": "请先配置 Google OAuth 凭据。",
  "A search sync is already running.": "已有同步任务正在运行。",
  "Connect a Google account with access to the site first.": "请先连接有权访问该站点的 Google 账号。",
  "Search Console sync failed. Check the connection and retry.": "同步 Google 搜索数据失败，请检查连接后重试。",
  "Google Search Console API quota exceeded.": "Google 搜索数据接口的调用配额已用尽。",
  "Google authorization expired or was rejected. Reconnect Google.": "Google 授权已过期或被拒绝，请重新连接。",
  "Google did not grant read access to Search Console.": "Google 尚未授予 Search Console 的读取权限。",
  "The saved Google credential cannot be decrypted. Reconnect Google.": "无法解密已保存的 Google 凭据，请重新连接。",
  "Google authorization required": "需要 Google 授权",
  "Search sync has pending batches": "还有待同步的数据批次",
  "Resend API key is not configured.": "尚未配置 Resend API 密钥。",
  "Retry window expired. Check Resend before sending again.": "重试期限已过，请在 Resend 中核对后再发送。",
  "Resend request failed or timed out.": "请求 Resend 失败或超时。",
  "Resend reported a delivery failure.": "Resend 报告邮件投递失败。",
  "Resend reported a bounce.": "Resend 报告邮件退回。",
};

export function adminErrorLabel(message: string, fallback: string) {
  if (Object.hasOwn(errorLabels, message)) return errorLabels[message];
  if (/^[\p{Script=Han}]/u.test(message)) return message;
  const status = message.match(/HTTP (\d{3})/);
  if (status) return `${fallback}（HTTP ${status[1]}）`;
  return fallback;
}
