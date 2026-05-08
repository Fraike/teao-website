"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Play, Video } from "lucide-react";
import { trustBadges, youtubeVideoId, videoPoster } from "@/content/about";

export function AboutHero() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="relative min-h-[82vh] lg:min-h-svh flex items-end bg-[#FAFAFA] text-[#111827] overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.035) 1px, transparent 1px)",
          backgroundSize: "84px 84px",
          maskImage: "linear-gradient(180deg, #000, transparent 82%)",
        }}
      />
      <div className="absolute right-[-14vw] top-[10%] h-[42vw] w-[42vw] max-w-[620px] max-h-[620px] rounded-full border border-[#ED7606]/15" />
      <div className="absolute left-0 bottom-0 h-28 w-full bg-gradient-to-t from-white to-transparent" />

      <div className="relative z-10 w-full pt-32 lg:pt-40 pb-14 lg:pb-18">
        <div className="shell">
          <div className="grid lg:grid-cols-[0.85fr_1.05fr] gap-10 lg:gap-14 items-end">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="eyebrow">Company Profile</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="mt-5 lg:mt-6 max-w-[760px] text-[30px] sm:text-[38px] lg:text-[clamp(38px,4vw,58px)] leading-[1.02] tracking-[-0.045em] font-black text-balance"
              >
                Dongguan Teao Electronic Technology Co., Ltd.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="mt-5 text-[#4B5563] text-[16px] lg:text-[18px] leading-relaxed max-w-[620px]"
              >
                A focused manufacturer of dampers, latches, synchronizers and custom
                motion-control modules for automotive, appliance and precision product programs.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap gap-2.5 lg:gap-3 mt-7 lg:mt-8"
              >
                <Link href="/contact" className="btn btn-primary text-sm lg:text-base px-6">
                  Discuss a Project
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-px mt-8 lg:mt-10 overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#E5E7EB]"
              >
                {trustBadges.map((b) => (
                  <span
                    key={b}
                    className="px-3 py-3 bg-white text-[#4B5563] text-[10px] lg:text-[11px] font-extrabold text-center"
                  >
                    {b}
                  </span>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="relative aspect-[16/10] lg:aspect-[5/4] overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#111827] shadow-[0_16px_48px_rgba(0,0,0,.06)]">
                {playing ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0&modestbranding=1`}
                    title="TEAO Company Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                ) : (
                  <button
                    onClick={() => setPlaying(true)}
                    className="group absolute inset-0 h-full w-full cursor-pointer text-left"
                    aria-label="Play TEAO company video"
                  >
                    <Image
                      src={videoPoster}
                      alt="TEAO manufacturing workshop"
                      fill
                      className="object-cover transition-transform duration-[0.65s] group-hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 100vw, 52vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/54 via-transparent to-transparent" />
                    <div className="absolute left-5 top-5 lg:left-7 lg:top-7 inline-flex items-center gap-2 rounded-full border border-white/16 bg-[#111827]/50 px-3.5 py-2 text-white/80 backdrop-blur-md">
                      <Video size={15} strokeWidth={2} />
                      <span className="text-[11px] font-black uppercase tracking-[0.14em]">
                        Company Video
                      </span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-16 w-16 lg:h-20 lg:w-20 items-center justify-center rounded-full bg-[#ED7606] text-white shadow-[0_18px_48px_rgba(237,118,6,.36)] transition-transform duration-300 group-hover:scale-105">
                        <Play size={28} className="ml-1" strokeWidth={2.5} />
                      </span>
                    </div>
                    <div className="absolute left-5 right-5 bottom-5 lg:left-7 lg:right-7 lg:bottom-7">
                      <h2 className="max-w-[420px] text-white text-2xl lg:text-[30px] leading-[1.02] font-black tracking-[-0.04em]">
                        Inside TEAO Manufacturing
                      </h2>
                    </div>
                  </button>
                )}
              </div>

              <div className="absolute -left-5 -bottom-5 hidden lg:block rounded-xl border border-[#E5E7EB] bg-white px-5 py-4 shadow-[0_12px_32px_rgba(0,0,0,.06)]">
                <b className="block text-3xl leading-none font-black text-[#ED7606]">20+</b>
                <span className="mt-1 block text-xs font-bold text-[#6B7280]">Years of focused manufacturing</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
