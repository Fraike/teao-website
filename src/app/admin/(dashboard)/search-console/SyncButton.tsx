"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminErrorLabel } from "@/lib/admin-labels";

export function SyncButton() {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("");

  async function sync() {
    setRunning(true);
    setStatus("正在启动同步…");
    try {
      for (let batch = 0; batch < 40; batch++) {
        const response = await fetch("/api/admin/search-console/sync", { method: "POST" });
        const result = await response.json() as { error?: string; remaining?: number };
        if (!response.ok) throw new Error(result.error ?? "同步失败，请重试。");
        if (result.remaining === 0) {
          setStatus("同步已完成。");
          return;
        }
        setStatus(`正在同步，剩余 ${result.remaining} 天的数据。`);
      }
      setStatus("同步已暂停。点击「立即同步」继续。");
    } catch (error) {
      setStatus(adminErrorLabel(error instanceof Error ? error.message : "", "同步失败，请重试。"));
    } finally {
      setRunning(false);
      router.refresh();
    }
  }

  return (
    <div>
      <button type="button" onClick={sync} disabled={running}
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold disabled:opacity-50">
        {running ? "正在同步…" : "立即同步"}
      </button>
      <p aria-live="polite" className="mt-1 text-sm text-gray-600">{status}</p>
    </div>
  );
}
