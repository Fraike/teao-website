import { Repeat2, Gauge, ArrowLeftRight, Wrench, Thermometer, ArrowDownToLine, Volume2, VolumeX } from "lucide-react";
import type { Product } from "@/types";

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="rounded-xl border border-[#FFE3C2] bg-[#FFFAF5] px-4 py-3.5 flex items-start gap-3">
      <div className="shrink-0 mt-0.5 text-[#ED7606]">{icon}</div>
      <div className="min-w-0">
        <div className="text-[10px] font-black uppercase tracking-[0.1em] text-[#9CA3AF] mb-0.5">
          {label}
        </div>
        <div className="text-sm font-extrabold text-[#111827] tabular-nums break-words">
          {value}
        </div>
      </div>
    </div>
  );
}

export function PerformanceStats({ product }: { product: Product }) {
  const stats: { icon: React.ReactNode; label: string; value: string }[] = [];

  // Durability cycles — available for ALL products
  if (product.durability?.cycles) {
    stats.push({
      icon: <Repeat2 size={18} />,
      label: "Durability",
      value: `≥ ${fmt(product.durability.cycles)} cycles`,
    });
  }

  // Temperature range
  if (product.durability?.temperature) {
    stats.push({
      icon: <Thermometer size={18} />,
      label: "Temp. Range",
      value: product.durability.temperature,
    });
  }

  // Test method
  if (product.durability?.test_method) {
    stats.push({
      icon: <Wrench size={18} />,
      label: "Test Method",
      value: product.durability.test_method,
    });
  }

  // Hard torque — mainly gear/axial/glove-box dampers
  if (product.hard_torque) {
    const unit = product.torque?.unit ?? "gf.cm";
    stats.push({
      icon: <Gauge size={18} />,
      label: "Hard Torque",
      value: `${product.hard_torque} ${unit}`,
    });
  }

  // Force range — mainly latch products
  if (product.force_range) {
    stats.push({
      icon: <ArrowDownToLine size={18} />,
      label: "Force Range",
      value: product.force_range,
    });
  }

  // Hard force — mainly latch products
  if (product.hard_force) {
    stats.push({
      icon: <ArrowDownToLine size={18} />,
      label: "Press Force",
      value: `${product.hard_force} N`,
    });
  }

  // Sound type — mainly latch products
  if (product.sound_type) {
    const isAudible = product.sound_type === "audible";
    stats.push({
      icon: isAudible ? <Volume2 size={18} /> : <VolumeX size={18} />,
      label: "Sound Type",
      value: isAudible ? "Audible" : "Silent",
    });
  }

  // Buffer direction
  if (product.buffer_direction) {
    stats.push({
      icon: <ArrowLeftRight size={18} />,
      label: "Buffer Direction",
      value: product.buffer_direction,
    });
  }

  // Assembly method
  if (product.assembly_method) {
    stats.push({
      icon: <Wrench size={18} />,
      label: "Assembly Method",
      value: product.assembly_method,
    });
  }

  if (stats.length === 0) return null;

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 lg:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="eyebrow">Performance</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>
    </div>
  );
}
