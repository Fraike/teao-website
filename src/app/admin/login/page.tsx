"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Login failed");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5]">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm">
        <h1 className="text-xl font-black text-[#111827] mb-6">Admin Login</h1>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">{error}</div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-[13px] font-bold text-[#111827] mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full h-11 px-4 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#ED7606] focus:ring-2 focus:ring-[#ED7606]/10"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#111827] mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-11 px-4 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#ED7606] focus:ring-2 focus:ring-[#ED7606]/10"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg bg-[#ED7606] text-white text-sm font-bold hover:bg-[#D46900] disabled:opacity-50 transition-colors"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </form>
    </div>
  );
}
