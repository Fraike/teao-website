"use client";

import { useState } from "react";
import { SkeletonImage } from "@/components/ui/skeleton-image";

export function ProductGallery({
  images,
}: {
  images: { url: string; alt?: string }[];
}) {
  const [active, setActive] = useState(0);
  const safeIndex = Math.min(active, images.length - 1);

  if (images.length === 0) return null;

  return (
    <div className="max-w-[440px]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#F8F9FA]">
        <SkeletonImage
          src={images[safeIndex].url}
          alt={images[safeIndex].alt ?? `Product image ${safeIndex + 1}`}
          fill
          containerClassName="absolute inset-0"
          shimmer={false}
          className="object-contain p-7"
          sizes="(max-width: 1024px) 100vw, 440px"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="mt-3 rounded-xl border border-[#E5E7EB] bg-white p-3">
          <div className="mb-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#9CA3AF]">
            Product views
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {images.map((img, i) => (
              <button
                key={img.url}
                onClick={() => setActive(i)}
                className={`relative h-14 w-14 shrink-0 cursor-pointer overflow-hidden rounded-lg border transition-colors ${
                  i === safeIndex
                    ? "border-[#ED7606] bg-[#FFF1E3]"
                    : "border-[#E5E7EB] bg-[#F8F9FA] hover:border-[#ED7606]/40"
                }`}
              >
                <SkeletonImage
                  src={img.url}
                  alt={img.alt ?? `Thumbnail ${i + 1}`}
                  fill
                  containerClassName="absolute inset-0"
                  shimmer={false}
                  className="object-contain p-1.5"
                  sizes="56px"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
