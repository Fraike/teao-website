"use client";

import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";

function createCaptcha() {
  const a = Math.floor(Math.random() * 8) + 2;
  const b = Math.floor(Math.random() * 7) + 3;
  return { a, b };
}

export function ContactForm() {
  const searchParams = useSearchParams();
  const initialProduct = searchParams.get("product") || "";
  const [captcha, setCaptcha] = useState(createCaptcha);

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    productInterest: initialProduct,
    annualVolume: "",
    message: "",
    privacyAccepted: false,
    captchaAnswer: "",
    website: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target instanceof HTMLInputElement && e.target.type === "checkbox"
        ? e.target.checked
        : e.target.value;
      setForm((prev) => ({ ...prev, [e.target.name]: value }));
    },
    []
  );

  const resetCaptcha = useCallback(() => {
    setCaptcha(createCaptcha());
    setForm((prev) => ({ ...prev, captchaAnswer: "" }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMsg("");

      if (!form.privacyAccepted) {
        setStatus("error");
        setErrorMsg("Please agree to the Privacy Policy before submitting.");
        return;
      }

      if (Number(form.captchaAnswer) !== captcha.a + captcha.b) {
        setStatus("error");
        setErrorMsg("Verification code is incorrect. Please try again.");
        resetCaptcha();
        return;
      }

      setStatus("submitting");

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            captchaA: captcha.a,
            captchaB: captcha.b,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Submission failed");
        }

        setStatus("success");
        window.dispatchEvent(new CustomEvent("teao:track", {
          detail: {
            event: "form_submit",
            page: window.location.pathname,
            targetType: "form",
            targetId: form.productInterest || "general",
            source: "contact_page",
          },
        }));
        setForm({
          name: "",
          company: "",
          email: "",
          phone: "",
          country: "",
          productInterest: "",
          annualVolume: "",
          message: "",
          privacyAccepted: false,
          captchaAnswer: "",
          website: "",
        });
        setCaptcha(createCaptcha());
      } catch (err) {
        setStatus("error");
        setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        resetCaptcha();
      }
    },
    [captcha, form, resetCaptcha]
  );

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-[#ED7606]/20 bg-[#FFFAF5] p-6 lg:p-8 text-center">
        <h3 className="text-xl font-black text-[#111827]">Inquiry sent</h3>
        <p className="mt-2 text-[#6B7280] text-sm leading-relaxed">
          Thank you. Our engineering team will review your requirements and respond within 24 hours.
        </p>
        <button onClick={() => setStatus("idle")} className="mt-5 text-[#ED7606] text-sm font-bold hover:underline">
          Submit another inquiry
        </button>
      </div>
    );
  }

  const fieldClass =
    "w-full h-11 px-4 rounded-lg border border-[#E5E7EB] bg-white text-[#374151] text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#ED7606] focus:ring-2 focus:ring-[#ED7606]/10 transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4 lg:gap-5">
        <div>
          <label className="block text-[13px] font-bold text-[#111827] mb-1.5">Name *</label>
          <input type="text" name="name" required value={form.name} onChange={handleChange} className={fieldClass} />
        </div>
        <div>
          <label className="block text-[13px] font-bold text-[#111827] mb-1.5">Company</label>
          <input type="text" name="company" value={form.company} onChange={handleChange} className={fieldClass} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 lg:gap-5">
        <div>
          <label className="block text-[13px] font-bold text-[#111827] mb-1.5">Email *</label>
          <input type="email" name="email" required value={form.email} onChange={handleChange} className={fieldClass} />
        </div>
        <div>
          <label className="block text-[13px] font-bold text-[#111827] mb-1.5">Phone</label>
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} className={fieldClass} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 lg:gap-5">
        <div>
          <label className="block text-[13px] font-bold text-[#111827] mb-1.5">Country</label>
          <input type="text" name="country" value={form.country} onChange={handleChange} className={fieldClass} />
        </div>
        <div>
          <label className="block text-[13px] font-bold text-[#111827] mb-1.5">Product Interest</label>
          <select name="productInterest" value={form.productInterest} onChange={handleChange} className={fieldClass}>
            <option value="">Select product...</option>
            <option value="gear-damper">Gear Damper</option>
            <option value="axial-damper">Axial Damper</option>
            <option value="glove-box-damper">Glove Box Damper</option>
            <option value="latch">Latch</option>
            <option value="other">Custom / Other</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-[13px] font-bold text-[#111827] mb-1.5">Annual Volume</label>
        <input type="text" name="annualVolume" value={form.annualVolume} onChange={handleChange} placeholder="e.g. 50,000 units/year" className={fieldClass} />
      </div>
      <div>
        <label className="block text-[13px] font-bold text-[#111827] mb-1.5">Message *</label>
        <textarea name="message" required rows={5} value={form.message} onChange={handleChange} placeholder="Describe your application, torque requirements, mounting space..." className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] bg-white text-[#374151] text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#ED7606] focus:ring-2 focus:ring-[#ED7606]/10 transition-all resize-y" />
      </div>

      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={handleChange} />
        </label>
      </div>

      <div className="rounded-xl border border-[#E5E7EB] bg-[#F8F9FA] p-4 lg:p-5">
        <label className="flex items-start gap-3 text-sm leading-relaxed text-[#374151]">
          <input
            type="checkbox"
            name="privacyAccepted"
            required
            checked={form.privacyAccepted}
            onChange={handleChange}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#D1D5DB] text-[#ED7606] focus:ring-[#ED7606]"
          />
          <span>
            I have read and agree to the{" "}
            <a href="/privacy-policy" target="_blank" className="font-bold text-[#111827] underline decoration-[#ED7606]/40 underline-offset-4 hover:text-[#ED7606]">
              Privacy Policy
            </a>
            . You can also{" "}
            <a href="/remark/privacy-policy.txt" download className="font-bold text-[#ED7606] hover:underline">
              download a copy
            </a>
            .
          </span>
        </label>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <label className="block text-[13px] font-bold text-[#111827] mb-1.5">
              Verification code *
            </label>
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white p-2">
              <div className="rounded-md bg-[#FFF2E5] px-3 py-2 text-sm font-black tracking-[0.08em] text-[#111827]">
                {captcha.a} + {captcha.b}
              </div>
              <input
                type="number"
                name="captchaAnswer"
                required
                inputMode="numeric"
                value={form.captchaAnswer}
                onChange={handleChange}
                placeholder="Enter answer"
                className="h-10 min-w-0 bg-transparent px-2 text-sm text-[#374151] outline-none placeholder:text-[#9CA3AF]"
              />
              <button
                type="button"
                onClick={resetCaptcha}
                className="rounded-md border border-[#E5E7EB] px-3 py-2 text-xs font-bold text-[#6B7280] transition-colors hover:border-[#ED7606]/40 hover:text-[#ED7606]"
              >
                Refresh
              </button>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-[#6B7280] sm:max-w-[180px]">
            This check helps reduce automated spam submissions.
          </p>
        </div>
      </div>

      {status === "error" && (
        <p className="text-red-600 text-sm font-medium">{errorMsg || "Submission failed. Please try again."}</p>
      )}

      <button type="submit" disabled={status === "submitting"} className="btn btn-primary px-8 text-base disabled:opacity-50">
        {status === "submitting" ? "Sending..." : "Send Inquiry →"}
      </button>
    </form>
  );
}
