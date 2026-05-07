"use client";

import { motion } from "framer-motion";
import { businessStats } from "@/content/about";

export function BusinessHighlights() {
  return (
    <section className="py-16 lg:py-24 bg-[#0a0b0d] text-white">
      <div className="shell">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <span className="eyebrow">Business Data</span>
          <h2 className="mt-2.5 lg:mt-3.5 text-[28px] sm:text-[34px] lg:text-[clamp(34px,4vw,52px)] leading-[1.02] tracking-[-0.04em] font-extrabold">
            Manufacturing at scale.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mt-8 lg:mt-10">
          {businessStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-6% 0px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 lg:p-7 rounded-xl border border-white/8 bg-white/[0.03] backdrop-blur-sm hover:border-white/15 hover:bg-white/[0.06] transition-all duration-300"
            >
              <b className="block text-3xl lg:text-4xl tracking-[-0.04em] font-black text-[#FF9A3C]">
                {stat.value}
              </b>
              <span className="block mt-2 text-white/55 text-sm lg:text-[15px] leading-relaxed">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
