"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Play, Video, Pause } from "lucide-react";

export function VideoPlayer({
  poster,
  src,
  badge = "Company Video",
  title = "Inside TEAO Manufacturing",
}: {
  poster: string;
  src: string;
  badge?: string;
  title?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
      setStarted(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="group absolute inset-0 h-full w-full cursor-pointer text-left" onClick={toggle}>
      {!started && (
        <Image
          src={poster}
          alt="TEAO manufacturing workshop"
          fill
          className="object-cover transition-transform duration-[0.65s] group-hover:scale-[1.03]"
          sizes="(max-width: 1024px) 100vw, 52vw"
          priority
        />
      )}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload="metadata"
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        onEnded={() => setPlaying(false)}
        onClick={(e) => e.stopPropagation()}
      />
      {!playing && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/54 via-transparent to-transparent" />
          <div className="absolute left-5 top-5 lg:left-7 lg:top-7 inline-flex items-center gap-2 rounded-full border border-white/16 bg-[#111827]/50 px-3.5 py-2 text-white/80 backdrop-blur-md">
            <Video size={15} strokeWidth={2} />
            <span className="text-[11px] font-black uppercase tracking-[0.14em]">
              {badge}
            </span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 lg:h-20 lg:w-20 items-center justify-center rounded-full bg-[#ED7606] text-white shadow-[0_18px_48px_rgba(237,118,6,.36)] transition-transform duration-300 group-hover:scale-105">
              {started ? <Pause size={28} strokeWidth={2.5} /> : <Play size={28} className="ml-1" strokeWidth={2.5} />}
            </span>
          </div>
          <div className="absolute left-5 right-5 bottom-5 lg:left-7 lg:right-7 lg:bottom-7">
            <h2 className="max-w-[420px] text-white text-2xl lg:text-[30px] leading-[1.02] font-black tracking-[-0.04em]">
              {title}
            </h2>
          </div>
        </>
      )}
    </div>
  );
}
