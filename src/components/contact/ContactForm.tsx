"use client";

import { useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Captcha, type CaptchaRef } from "@/components/ui/captcha";

export function ContactForm() {
  const searchParams = useSearchParams();
  const initialProduct = searchParams.get("product") || "";
  const captchaRef = useRef<CaptchaRef>(null);

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

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMsg("");

      if (!form.privacyAccepted) {
        setStatus("error");
        setErrorMsg("Please agree to the Privacy Policy before submitting.");
        return;
      }

      if (!captchaRef.current?.validate()) {
        setStatus("error");
        setErrorMsg("Verification code is incorrect. Please try again.");
        return;
      }

      setStatus("submitting");

      try {
        const payload = captchaRef.current?.getPayload();
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            captchaToken: payload?.token,
            captchaAnswer: payload?.answer,
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
          website: "",
        });
        captchaRef.current?.reset();
      } catch (err) {
        setStatus("error");
        setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        captchaRef.current?.reset();
      }
    },
    [form]
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

      <div className="rounded-xl border border-[#E5E7EB] bg-[#F8F9FA] p-4 lg:p-5 space-y-4">
        <label className="flex items-center gap-3 text-sm leading-relaxed text-[#374151]">
          <input
            type="checkbox"
            name="privacyAccepted"
            required
            checked={form.privacyAccepted}
            onChange={handleChange}
            className="h-4 w-4 shrink-0 rounded border-[#D1D5DB] text-[#ED7606] focus:ring-[#ED7606]"
          />
          <span>
            I agree to the{" "}
            <a href="/privacy-policy" target="_blank" className="font-bold text-[#111827] underline decoration-[#ED7606]/40 underline-offset-4 hover:text-[#ED7606]">
              Privacy Policy
            </a>
            .
          </span>
        </label>

        <Captcha ref={captchaRef} />
      </div>

      {status === "error" && (
        <p className="text-red-600 text-sm font-medium">{errorMsg || "Submission failed. Please try again."}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex h-12 min-w-[190px] items-center justify-center rounded-full bg-[#ED7606] px-8 text-base font-extrabold text-white shadow-[0_16px_34px_rgba(237,118,6,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#D46900] hover:shadow-[0_20px_42px_rgba(237,118,6,0.3)] disabled:translate-y-0 disabled:opacity-50"
      >
        {status === "submitting" ? "Sending..." : "Send Inquiry →"}
      </button>
    </form>
  );
}
