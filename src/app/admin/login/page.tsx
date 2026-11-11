"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Captcha, type CaptchaRef } from "@/components/ui/captcha";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const captchaRef = useRef<CaptchaRef>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!captchaRef.current?.validate()) {
      setError("验证码错误，请重试。");
      setLoading(false);
      return;
    }

    try {
      const payload = captchaRef.current.getPayload();
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          captchaToken: payload.token,
          captchaAnswer: payload.answer,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || "登录失败，请稍后重试。");
        captchaRef.current?.reset();
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("无法连接后台，请检查网络后重试。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5]">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm">
        <h1 className="text-xl font-black text-[#111827] mb-6">特澳独立站后台登录</h1>
        {error && (
          <div role="alert" className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">{error}</div>
        )}
        <div className="space-y-4">
          <div>
            <label htmlFor="admin-username" className="block text-[13px] font-bold text-[#111827] mb-1.5">账号</label>
            <input
              id="admin-username"
              autoComplete="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full h-11 px-4 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#ED7606] focus:ring-2 focus:ring-[#ED7606]/10"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="block text-[13px] font-bold text-[#111827] mb-1.5">密码</label>
            <input
              id="admin-password"
              autoComplete="current-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-11 px-4 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#ED7606] focus:ring-2 focus:ring-[#ED7606]/10"
            />
          </div>
          <Captcha ref={captchaRef} locale="zh-CN" />
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg bg-[#ED7606] text-white text-sm font-bold hover:bg-[#D46900] disabled:opacity-50 transition-colors"
          >
            {loading ? "正在登录…" : "登录"}
          </button>
        </div>
      </form>
    </div>
  );
}
