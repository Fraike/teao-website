"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/constants";

export function AboutCTA() {
  return (
    <section className="relative py-20 lg:py-28 bg-[#0a0b0d] text-white overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-18">
        <Image
          src="/images/company/factory-entrance.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
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
            <h2 className="mt-3.5 max-w-[640px] text-[clamp(34px,4.5vw,58px)] leading-[0.94] tracking-[-0.05em] font-black">
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
              { src: "/images/products/gear-damper/GearDamperSingle.png", label: "Custom Torque" },
              { src: "/images/products/cylinder-damper/AxialDamperSingle.png", label: "Full Engineering Support" },
              { src: "/images/products/glove-box-damper/GloveBoxDamperSingle.png", label: "Stable Mass Production" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
              >
                <div className="relative w-12 h-12 shrink-0 rounded-lg bg-white/10 p-1.5">
                  <Image
                    src={item.src}
                    alt=""
                    fill
                    className="object-contain p-1"
                    sizes="48px"
                  />
                </div>
                <span className="text-white/75 text-sm font-bold">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
