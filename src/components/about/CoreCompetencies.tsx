"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { competencies } from "@/content/about";
import { Cog, Wrench, Settings } from "lucide-react";

const icons = [Settings, Wrench, Cog];

export function CoreCompetencies() {
  return (
    <section className="py-16 lg:py-24 bg-[#171717] text-white">
      <div className="shell">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <span className="eyebrow">Core Competencies</span>
          <h2 className="mt-2.5 lg:mt-3.5 text-[28px] sm:text-[34px] lg:text-[clamp(34px,4vw,52px)] leading-[1.02] tracking-[-0.04em] font-extrabold">
            Complete manufacturing capabilities.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5 mt-8 lg:mt-10">
          {competencies.map((comp, i) => {
            const Icon = icons[i];
            const isHighlight = comp.highlight;

            return (
              <motion.div
                key={comp.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-6% 0px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 ${
                  isHighlight
                    ? "border-[#ED7606]/40 shadow-[0_16px_48px_rgba(237,118,6,.12)]"
                    : "border-white/10 shadow-[0_16px_40px_rgba(0,0,0,.2)]"
                }`}
              >
                {/* Image */}
                <div className="relative aspect-[16/10]">
                  <Image
                    src={comp.image}
                    alt={comp.title}
                    fill
                    className="object-cover opacity-90 transition-transform duration-[0.65s] group-hover:scale-[1.04]"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#171717] to-transparent" />
                </div>

                {/* Content */}
                <div className="relative p-5 lg:p-6">
                  <div className="flex items-start gap-3">
                    <Icon
                      className={`w-6 h-6 mt-0.5 shrink-0 ${
                        isHighlight ? "text-[#ED7606]" : "text-[#FF9A3C]"
                      }`}
                      strokeWidth={1.5}
                    />
                    <div>
                      <h3 className="text-lg lg:text-xl font-extrabold tracking-[-0.02em]">
                        {comp.title}
                      </h3>
                      {isHighlight && (
                        <span className="inline-block mt-0.5 text-[#ED7606] text-xs font-black uppercase tracking-[0.1em]">
                          {comp.subtitle}
                        </span>
                      )}
                      {!isHighlight && (
                        <span className="inline-block mt-0.5 text-white/40 text-xs font-bold">
                          {comp.subtitle}
                        </span>
                      )}
                      <p className="mt-2.5 text-white/55 text-sm leading-relaxed">
                        {comp.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Highlight ring */}
                {isHighlight && (
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-[#ED7606]/20 pointer-events-none" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
