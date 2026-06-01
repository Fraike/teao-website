"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { SkeletonImage } from "@/components/ui/skeleton-image";
import type { ProductVideo } from "@/lib/product-videos";

type GalleryImage = { type: "image"; url: string; alt?: string };
type GalleryVideo = ProductVideo & { type: "video" };
type GalleryItem = GalleryImage | GalleryVideo;

export function ProductGallery({
  images,
  videos = [],
}: {
  images: { url: string; alt?: string }[];
  videos?: ProductVideo[];
}) {
  const [active, setActive] = useState(0);
  const items: GalleryItem[] = [
    ...images.map((img) => ({ ...img, type: "image" as const })),
    ...videos.map((video) => ({ ...video, type: "video" as const })),
  ];
  const safeIndex = Math.min(active, items.length - 1);
  const activeItem = items[safeIndex];

  if (items.length === 0) return null;

  return (
    <div className="max-w-[440px]">
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#F8F9FA]"
        onContextMenu={(event) => event.preventDefault()}
      >
        {activeItem.type === "image" ? (
          <SkeletonImage
            src={activeItem.url}
            alt={activeItem.alt ?? `Product image ${safeIndex + 1}`}
            fill
            containerClassName="absolute inset-0 select-none"
            shimmer={false}
            className="object-contain p-7 pointer-events-none select-none"
            sizes="(max-width: 1024px) 100vw, 440px"
            priority
            draggable={false}
          />
        ) : (
          <video
            key={activeItem.url}
            className="h-full w-full bg-black object-contain"
            controls
            controlsList="nodownload noplaybackrate"
            disablePictureInPicture
            preload="metadata"
            playsInline
            onContextMenu={(event) => event.preventDefault()}
            aria-label={`${activeItem.title} application video`}
          >
            <source src={activeItem.url} type="video/mp4" />
          </video>
        )}
      </div>

      {items.length > 1 && (
        <div className="mt-3 rounded-xl border border-[#E5E7EB] bg-white p-3">
          <div className="mb-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#9CA3AF]">
            Product views
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {items.map((item, i) => (
              <button
                key={item.url}
                onClick={() => setActive(i)}
                title={item.type === "video" ? item.title : item.alt}
                className={`relative h-14 w-14 shrink-0 cursor-pointer overflow-hidden rounded-lg border transition-colors ${
                  i === safeIndex
                    ? "border-[#ED7606] bg-[#FFF1E3]"
                    : "border-[#E5E7EB] bg-[#F8F9FA] hover:border-[#ED7606]/40"
                }`}
                onContextMenu={(event) => event.preventDefault()}
              >
                {item.type === "image" ? (
                  <SkeletonImage
                    src={item.url}
                    alt={item.alt ?? `Thumbnail ${i + 1}`}
                    fill
                    containerClassName="absolute inset-0 select-none"
                    shimmer={false}
                    className="object-contain p-1.5 pointer-events-none select-none"
                    sizes="56px"
                    loading="lazy"
                    draggable={false}
                  />
                ) : (
                  <span className="absolute inset-0 grid place-items-center bg-[#111827] text-white">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-[#ED7606] shadow-[0_8px_18px_rgba(237,118,6,.35)]">
                      <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                    </span>
                    <span className="sr-only">{item.title}</span>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
