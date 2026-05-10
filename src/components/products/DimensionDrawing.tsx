"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X } from "lucide-react";

export function DimensionDrawing({
  src,
  alt = "Dimension drawing",
}: {
  src: string;
  alt?: string;
}) {
  const [zoomed, setZoomed] = useState(false);

  const close = useCallback(() => setZoomed(false), []);

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [zoomed, close]);

  return (
    <>
      <button
        type="button"
        onClick={() => setZoomed(true)}
        className="relative w-full rounded-xl border border-[#E5E7EB] bg-white overflow-hidden cursor-zoom-in"
      >
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={800}
          className="w-full max-h-[360px] object-contain"
          sizes="(max-width: 1024px) 100vw, 800px"
        />
      </button>

      {zoomed && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 p-6 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-5 top-5 z-[110] inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#111827] shadow-lg transition-colors hover:border-[#ED7606] hover:bg-[#FFF1E3]"
            aria-label="Close"
          >
            <X size={18} className="text-[#111827]" />
          </button>
          <div className="relative max-h-full max-w-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={src}
              alt={alt}
              width={1600}
              height={1200}
              className="max-w-full max-h-[90vh] object-contain"
              sizes="90vw"
            />
          </div>
          <button
            type="button"
            onClick={close}
            className="absolute bottom-5 left-1/2 z-[110] -translate-x-1/2 rounded-full bg-[#111827] px-4 py-2 text-sm font-bold text-white shadow-lg transition-colors hover:bg-[#ED7606]"
          >
            Close drawing
          </button>
        </div>
      )}
    </>
  );
}
