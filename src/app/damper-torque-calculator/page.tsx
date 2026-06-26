import type { Metadata } from "next";
import DamperTorqueCalculator from "@/components/tools/DamperTorqueCalculator";
import { PRODUCTS } from "@/lib/constants";
import { getProductUrl } from "@/lib/products";
import { JsonLdScript } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Damper Torque Calculator | TEAO Engineering Tools",
  description:
    "Estimate the initial torque range for rotary dampers or gear dampers using part weight, axis-to-CG distance, opening angle, target time, motion ratio and safety margin.",
  keywords: [
    "damper torque calculator",
    "rotary damper torque calculation",
    "gear damper selection",
    "rotary damper selection",
    "damper torque estimate",
    "gf.cm torque calculator",
    "N.m to gf.cm",
  ],
  alternates: {
    canonical: "/damper-torque-calculator",
  },
  openGraph: {
    title: "Damper Torque Calculator | TEAO Engineering Tools",
    description:
      "Enter real application data to estimate the initial torque range for gear dampers or rotary dampers.",
    images: [{ url: "/images/logo-color.webp", width: 512, height: 512 }],
  },
};

const calculatorSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Damper Torque Calculator",
  applicationCategory: "EngineeringApplication",
  operatingSystem: "Web",
  description:
    "Engineering calculator for estimating rotary damper torque based on weight, CG distance, angle, time, motion ratio and safety margin.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  url: "/damper-torque-calculator",
};

export default function DamperTorqueCalculatorPage() {
  const selectableProducts = PRODUCTS.filter(
    (product) =>
      product.isActive &&
      product.torque &&
      (product.category === "gear-damper" || product.category === "glove-box-damper"),
  ).map((product) => ({
    model: product.model,
    name: product.name,
    summary: product.summary,
    url: getProductUrl(product),
    torque: product.torque!,
  }));

  return (
    <>
      <JsonLdScript data={calculatorSchema} />
      <main className="bg-[#F8F9FA] pt-24 lg:pt-28">
        <section className="pb-8 lg:pb-10">
          <div className="shell">
            <div className="mb-6 max-w-3xl">
              <span className="eyebrow">Engineering Tools</span>
              <h1 className="mt-3 text-[clamp(32px,5vw,58px)] font-black leading-[0.96] tracking-[-0.05em] text-[#111827]">
                Damper Torque Calculator
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#6B7280] lg:text-lg">
                Estimate the initial torque range for gear dampers or rotary dampers using the
                application data that customers can typically provide.
              </p>
            </div>
            <DamperTorqueCalculator products={selectableProducts} />
          </div>
        </section>
      </main>
    </>
  );
}
