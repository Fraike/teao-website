const productCategories: Readonly<Record<string, string>> = {
  "gear-damper": "齿轮阻尼器",
  "axial-damper": "轴向阻尼器",
  "glove-box-damper": "手套箱阻尼器",
  latch: "锁扣",
  other: "其他",
};

const articleCategories: Readonly<Record<string, string>> = {
  company: "公司动态",
  quality: "质量管理",
  engineering: "工程技术",
};

export function productCategoryLabel(category: string) {
  return Object.hasOwn(productCategories, category) ? productCategories[category] : category;
}

export function articleCategoryLabel(category: string) {
  return Object.hasOwn(articleCategories, category) ? articleCategories[category] : category;
}

export function publishingError(message: unknown, fallback: string) {
  if (typeof message !== "string" || !message) return fallback;
  if (/[\u3400-\u9fff]/u.test(message)) return message;
  if (message === "Unauthorized") return "登录已失效，请重新登录。";
  if (message === "Not found") return "未找到该记录。";
  if (message === "Missing filename" || message === "No file") return "请选择文件。";
  if (message === "Cannot delete project images") return "无法删除项目内置图片。";
  if (message.startsWith("Unsupported file type")) return "不支持此文件格式。";
  if (message.startsWith("File too large")) return "单个文件不得超过 5 MB。";
  if (message.includes("is not configured.")) return "翻译服务尚未配置，请检查服务凭据。";
  if (message.includes("translation failed")) return "翻译服务暂不可用，请稍后重试。";
  return fallback;
}
