"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Play } from "lucide-react";
import { videoPoster, youtubeVideoPlaybackUrl } from "@/content/about";

export function CompanyVideoSection() {
  return (
    <section className="py-16 lg:py-24 bg-white" id="company-video">
      <div className="shell">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8 lg:mb-10"
        >
          <span className="eyebrow">Company Video</span>
          <h2 className="mt-2.5 lg:mt-3.5 text-[26px] sm:text-[30px] lg:text-[clamp(30px,3.6vw,46px)] leading-[1.02] tracking-[-0.04em] font-extrabold text-[#111827]">
            Inside TEAO Manufacturing
          </h2>
          <p className="mt-3 text-[#6B7280] text-[15px] lg:text-[17px] max-w-[560px] mx-auto">
            Watch our company video to learn more about our factory, production lines, testing
            capabilities and engineering support.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-4xl mx-auto aspect-video rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-[0_8px_32px_rgba(0,0,0,.05)] bg-black"
        >
            <a
              href={youtubeVideoPlaybackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group absolute inset-0 w-full h-full cursor-pointer"
              aria-label="Play company video"
            >
              <Image
                src={videoPoster}
                alt="TEAO factory video cover"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 896px"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />

              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-[#ED7606]/95 shadow-[0_18px_48px_rgba(237,118,6,.4)] group-hover:bg-[#ED7606] transition-colors duration-300">
                  <Play size={32} className="text-white ml-1.5" strokeWidth={2.5} />
                </span>
              </motion.div>
            </a>
        </motion.div>
      </div>
    </section>
  );
}
