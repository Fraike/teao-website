"use client";

import { useRef, useEffect, useCallback, useImperativeHandle, forwardRef, useState } from "react";

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const LEN = 4;
const CANVAS_W = 140;
const CANVAS_H = 48;
const FONT_FAMILY = "Inter, system-ui, sans-serif";

function randomCode(): string {
  let code = "";
  for (let i = 0; i < LEN; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return code;
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function draw(ctx: CanvasRenderingContext2D, w: number, h: number, code: string) {
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, "#F8F9FA");
  gradient.addColorStop(0.5, "#FFF");
  gradient.addColorStop(1, "#F0F0F0");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  // Noise lines
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(randomInt(0, w), randomInt(0, h));
    ctx.lineTo(randomInt(0, w), randomInt(0, h));
    ctx.strokeStyle = `rgba(${randomInt(100, 200)},${randomInt(100, 200)},${randomInt(100, 200)},0.4)`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Noise dots
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = `rgba(${randomInt(100, 180)},${randomInt(100, 180)},${randomInt(100, 180)},0.5)`;
    ctx.fillRect(randomInt(0, w), randomInt(0, h), randomInt(1, 2), randomInt(1, 2));
  }

  // Characters
  const charWidth = Math.floor(w / (LEN + 1));
  for (let i = 0; i < code.length; i++) {
    const x = charWidth * (i + 0.8) + randomInt(-4, 4);
    const y = h / 2 + randomInt(-6, 6);
    const size = randomInt(18, 24);
    const angle = (randomInt(-25, 25) * Math.PI) / 180;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.font = `bold ${size}px ${FONT_FAMILY}`;
    ctx.fillStyle = `rgb(${randomInt(20, 80)},${randomInt(20, 80)},${randomInt(20, 80)})`;
    ctx.fillText(code[i], 0, 0);
    ctx.restore();
  }
}

export interface CaptchaRef {
  validate: () => boolean;
  reset: () => void;
  getPayload: () => { answer: string; token: string };
}

interface CaptchaProps {
  className?: string;
  inputName?: string;
}

const Captcha = forwardRef<CaptchaRef, CaptchaProps>(function Captcha(
  { className, inputName = "captchaAnswer" },
  ref
) {
  const [code, setCode] = useState(() => randomCode());
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const redraw = useCallback((newCode: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Account for device pixel ratio
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_W * dpr;
    canvas.height = CANVAS_H * dpr;
    canvas.style.width = `${CANVAS_W}px`;
    canvas.style.height = `${CANVAS_H}px`;
    ctx.scale(dpr, dpr);
    draw(ctx, CANVAS_W, CANVAS_H, newCode);
  }, []);

  useEffect(() => {
    redraw(code);
  }, [code, redraw]);

  const validate = useCallback(() => {
    const valid = input.toUpperCase() === code;
    if (!valid) {
      setError(true);
      const newCode = randomCode();
      setCode(newCode);
      setInput("");
    }
    return valid;
  }, [input, code]);

  const reset = useCallback(() => {
    const newCode = randomCode();
    setCode(newCode);
    setInput("");
    setError(false);
  }, []);

  const getPayload = useCallback(() => {
    return { answer: code, token: btoa(code) };
  }, [code]);

  useImperativeHandle(ref, () => ({ validate, reset, getPayload }), [validate, reset, getPayload]);

  return (
    <div className={className}>
      <label className="block text-[13px] font-bold text-[#111827] mb-1.5">
        Verification code *
      </label>
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-3">
        <div className="flex gap-2.5 items-stretch">
          <div className="overflow-hidden rounded-md border border-[#E5E7EB] bg-[#F8F9FA] shrink-0">
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              className="block"
              style={{ width: CANVAS_W, height: CANVAS_H }}
            />
          </div>
          <input
            type="text"
            name={inputName}
            required
            autoComplete="off"
            spellCheck={false}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(false);
            }}
            placeholder="Enter code"
            className="flex-1 min-w-0 rounded-md border border-[#E5E7EB] bg-white px-3 text-sm font-bold text-[#374151] uppercase tracking-[0.12em] outline-none placeholder:text-[#9CA3AF] placeholder:normal-case placeholder:tracking-normal focus:border-[#ED7606] focus:ring-2 focus:ring-[#ED7606]/10"
          />
        </div>
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={reset}
            className="text-xs font-medium text-[#9CA3AF] transition-colors hover:text-[#ED7606]"
          >
            Refresh code
          </button>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium">
          Incorrect code. Please try the new code shown.
        </p>
      )}
    </div>
  );
});

export { Captcha };
