"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export function AboutCTA() {
  return (
    <section className="relative py-20 lg:py-28 bg-[#0a0b0d] text-white overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-18">
        <Image
          src="/images/company/factory-entrance.webp"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          loading="lazy"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0b0d]/97 via-[#0a0b0d]/88 to-[#0a0b0d]/72" />

      {/* Decorative ring */}
      <div className="absolute w-[500px] h-[500px] -right-[100px] -bottom-[160px] rounded-full border border-[#ED7606]/15 pointer-events-none" />

      <div className="shell relative z-10">
        <div className="grid lg:grid-cols-[1fr_0.7fr] gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="eyebrow">Work With TEAO</span>
            <h2 className="mt-3.5 max-w-[640px] text-[clamp(30px,4vw,50px)] leading-[0.94] tracking-[-0.05em] font-black">
              Looking for a reliable damper manufacturing partner?
            </h2>
            <p className="mt-4 text-white/55 text-lg max-w-[560px] leading-relaxed">
              Tell us your application, torque requirements and annual volume. TEAO engineering
              team will help recommend a suitable solution.
            </p>

            <div className="flex flex-wrap gap-3 mt-7">
              <Link href="/contact" className="btn btn-primary text-base px-7">
                Get a Custom Solution
              </Link>
              <Link href="/contact" className="btn btn-ghost text-base px-7">
                Contact Engineering Team
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex flex-col gap-3"
          >
            {[
              { src: "/images/products/gear-damper/GearDamperSingle.webp", label: "Custom Torque" },
              { src: "/images/products/axial-damper/AxialDamperSingle.webp", label: "Full Engineering Support" },
              { src: "/images/products/glove-box-damper/GloveBoxDamperSingle.webp", label: "Stable Mass Production" },
            ].map((item, index) => (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-xl border border-white/15 bg-white p-4 shadow-[0_18px_45px_rgba(0,0,0,0.18)]"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-[#E5E7EB] bg-[#F8F9FA]">
                  <Image
                    src={item.src}
                    alt=""
                    fill
                    className="object-contain p-2"
                    sizes="56px"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#ED7606]">
                    0{index + 1}
                  </span>
                  <p className="mt-0.5 text-sm font-extrabold text-[#111827]">{item.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
