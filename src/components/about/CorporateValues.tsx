"use client";

import { motion } from "framer-motion";
import { corporateValues } from "@/content/about";
import { BookOpen, HeartHandshake, Leaf, Building2 } from "lucide-react";

const valueIcons = [BookOpen, HeartHandshake, Leaf, Building2];

export function CorporateValues() {
  return (
    <section className="pt-10 pb-16 lg:pt-12 lg:pb-24 bg-white">
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
            <h2 className="mt-2.5 lg:mt-3.5 text-[26px] sm:text-[30px] lg:text-[clamp(30px,3.2vw,44px)] leading-[1.02] tracking-[-0.04em] font-extrabold text-[#111827]">
              Contributing to education, charity and environmental protection.
            </h2>
          </div>
          <p className="text-[#6B7280] text-[15px] lg:text-[17px] leading-relaxed max-w-[620px]">
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
                className="p-5 lg:p-6 rounded-xl border border-[#E5E7EB] bg-white hover:-translate-y-1 hover:border-[#ED7606]/25 hover:shadow-md transition-all duration-300"
              >
                <Icon className="w-7 h-7 text-[#ED7606] mb-5" strokeWidth={1.5} />
                <h3 className="text-lg lg:text-xl font-extrabold tracking-[-0.02em] text-[#111827]">
                  {val.name}
                </h3>
                <p className="mt-2 text-[#6B7280] text-sm leading-relaxed">{val.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
