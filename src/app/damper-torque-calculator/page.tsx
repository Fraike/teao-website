import type { Metadata } from "next";
import DamperTorqueCalculator from "@/components/tools/DamperTorqueCalculator";
import { PRODUCTS } from "@/lib/constants";
import { getProductUrl } from "@/lib/products";
import { JsonLdScript } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "阻尼器扭矩计算器 | TEAO 工程工具",
  description:
    "根据对手件重量、旋转轴到重心距离、开启角度、目标时间、传动比和安全余量，估算旋转阻尼器或齿轮阻尼器初选扭矩。",
  keywords: [
    "阻尼器扭矩计算器",
    "旋转阻尼器扭矩计算",
    "齿轮阻尼器选型",
    "阻尼器选型",
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
    title: "阻尼器扭矩计算器 | TEAO 工程工具",
    description:
      "输入真实应用数据，估算齿轮阻尼器或旋转阻尼器的初选扭矩范围。",
    images: [{ url: "/images/logo-color.webp", width: 512, height: 512 }],
  },
};

const calculatorSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "阻尼器扭矩计算器",
  applicationCategory: "EngineeringApplication",
  operatingSystem: "Web",
  description:
    "用于根据重量、重心距离、角度、时间、传动比和余量估算旋转阻尼器扭矩的工程计算器。",
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
              <span className="eyebrow">工程工具</span>
              <h1 className="mt-3 text-[clamp(32px,5vw,58px)] font-black leading-[0.96] tracking-[-0.05em] text-[#111827]">
                阻尼器扭矩计算器
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#6B7280] lg:text-lg">
                根据客户通常能提供的对手件数据，先估算齿轮阻尼器或旋转阻尼器的初选扭矩范围。
              </p>
            </div>
            <DamperTorqueCalculator products={selectableProducts} />
          </div>
        </section>
      </main>
    </>
  );
}
