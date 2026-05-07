"use client";

import { motion } from "framer-motion";
import { corporateValues } from "@/content/about";
import { BookOpen, HeartHandshake, Leaf, Building2 } from "lucide-react";

const valueIcons = [BookOpen, HeartHandshake, Leaf, Building2];

export function CorporateValues() {
  return (
    <section className="py-16 lg:py-24 bg-[#0a0b0d] text-white">
      <div className="shell">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid lg:grid-cols-[0.78fr_1fr] gap-6 lg:gap-12 items-end"
        >
          <div>
            <span className="eyebrow">Corporate Social Responsibility</span>
            <h2 className="mt-2.5 lg:mt-3.5 text-[28px] sm:text-[34px] lg:text-[clamp(34px,3.6vw,52px)] leading-[1.02] tracking-[-0.04em] font-extrabold">
              Contributing to education, charity and environmental protection.
            </h2>
          </div>
          <p className="text-white/50 text-[15px] lg:text-[17px] leading-relaxed max-w-[620px]">
            TEAO believes enterprise development should create value beyond products. We support
            public-interest activities in education, charity, environmental protection and local
            community development.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mt-8 lg:mt-10">
          {corporateValues.map((val, i) => {
            const Icon = valueIcons[i];
            return (
              <motion.div
                key={val.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-6% 0px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="p-5 lg:p-6 rounded-xl border border-white/8 bg-white/[0.035] hover:-translate-y-1 hover:border-[#ED7606]/25 transition-all duration-300"
              >
                <Icon className="w-7 h-7 text-[#ED7606] mb-5" strokeWidth={1.5} />
                <h3 className="text-lg lg:text-xl font-extrabold tracking-[-0.02em]">
                  {val.name}
                </h3>
                <p className="mt-2 text-white/45 text-sm leading-relaxed">{val.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
