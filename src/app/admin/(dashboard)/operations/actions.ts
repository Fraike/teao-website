"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { db } from "@/db";

export async function recordPageChange(form: FormData) {
  if (!await getSession()) throw new Error("请先登录后台。");
  const changedOn = String(form.get("changedOn") ?? "");
  const page = String(form.get("page") ?? "").trim();
  const summary = String(form.get("summary") ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(changedOn) || !/^\/(?!\/)[a-z0-9_.%/-]{0,299}$/i.test(page) ||
      !summary || summary.length > 300) {
    throw new Error("请填写有效的日期、页面路径和变更说明。");
  }

  await db.$client.execute({
    sql: "INSERT INTO website_operations_changes (changed_on, page, summary) VALUES (?, ?, ?)",
    args: [changedOn, page, summary],
  });
  revalidatePath("/admin/operations");
}
